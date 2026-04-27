// ============================================================
// /api/public  — Roteador único para endpoints públicos
//
// Roteamento via ?action= (query string) ou body.action.
// Exemplos:
//   POST /api/public?action=validateCoupon      { coupon_code, product_id, payment_method? }
//   POST /api/public?action=resellerApplication { name, email, whatsapp, country, message? }
//
// Env vars:
//   SUPABASE_URL, SUPABASE_SERVICE_KEY
//   ALLOWED_ORIGIN
//   ADMIN_NOTIFICATION_EMAIL
//   RESEND_API_KEY | SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS
// ============================================================

'use strict';

const { createClient }  = require('@supabase/supabase-js');
const { lookupProduct } = require('./_products');
const { sendEmail }     = require('./_email');
const {
  validateEmail,
  validateRequiredString,
  firstError,
}                       = require('./_validate');

const EUR_TO_BRL = 5.99;

// ── CORS ─────────────────────────────────────────────────────────────────────

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin',  process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getDb() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

function getAction(req) {
  return (req.query && req.query.action) || (req.body && req.body.action) || '';
}

// ── validateCoupon ────────────────────────────────────────────────────────────

async function actionValidateCoupon(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { coupon_code, product_id, payment_method } = req.body || {};

  if (!coupon_code || typeof coupon_code !== 'string') {
    return res.status(400).json({ valid: false, message: 'Código do cupom é obrigatório.' });
  }
  if (!product_id || typeof product_id !== 'string') {
    return res.status(400).json({ valid: false, message: 'product_id é obrigatório.' });
  }

  const db = getDb();

  // 1. Busca produto (DB-first com fallback em _catalog.js)
  const product = await lookupProduct(db, product_id);
  if (!product) {
    return res.status(400).json({ valid: false, message: 'Produto não encontrado.' });
  }
  if (product.soldOut) {
    return res.status(400).json({ valid: false, message: 'Produto esgotado.' });
  }

  // 2. Busca cupom (case-insensitive via normalização)
  const normalizedCode = coupon_code.trim().toUpperCase();
  const { data: coupon, error } = await db
    .from('coupons')
    .select('id, code, discount_percent, active')
    .eq('code', normalizedCode)
    .maybeSingle();

  if (error) {
    console.error('[public] validateCoupon DB error:', error.message);
    return res.status(500).json({ valid: false, message: 'Erro ao validar cupom.' });
  }

  if (!coupon) {
    return res.status(200).json({ valid: false, message: 'Cupom não encontrado.' });
  }
  if (!coupon.active) {
    return res.status(200).json({ valid: false, message: 'Cupom inativo.' });
  }

  const discountPct = Number(coupon.discount_percent);
  const baseEUR     = product.price;

  // Cálculo idêntico ao usado em create-pix-order.js e create-manual-order.js
  const isPix    = (payment_method || '') === 'pix';
  const currency = isPix ? 'BRL' : 'EUR';

  let originalAmount, discountAmount, finalAmount;

  if (isPix) {
    originalAmount = Math.round(baseEUR * EUR_TO_BRL * 100) / 100;
    discountAmount = Math.round(originalAmount * (discountPct / 100) * 100) / 100;
    finalAmount    = Math.round((originalAmount - discountAmount) * 100) / 100;
  } else {
    originalAmount = Math.round(baseEUR * 100) / 100;
    discountAmount = Math.round(originalAmount * (discountPct / 100) * 100) / 100;
    finalAmount    = Math.round((originalAmount - discountAmount) * 100) / 100;
  }

  return res.status(200).json({
    valid:            true,
    coupon_code:      coupon.code,
    discount_percent: discountPct,
    original_amount:  originalAmount,
    discount_amount:  discountAmount,
    final_amount:     finalAmount,
    currency,
    message:          `Cupom aplicado! ${discountPct}% de desconto.`,
  });
}

// ── resellerApplication ───────────────────────────────────────────────────────

async function actionResellerApplication(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, whatsapp, country, message } = req.body || {};

  const inputError = firstError(
    validateRequiredString(name,     'Nome',     200),
    validateEmail(email),
    validateRequiredString(whatsapp, 'WhatsApp',  50),
    validateRequiredString(country,  'País',     100),
  );
  if (inputError) return res.status(400).json({ error: inputError });

  const sanitizedMessage = message ? String(message).trim().slice(0, 2000) : null;

  const db = getDb();
  const { data, error: dbErr } = await db
    .from('reseller_applications')
    .insert({
      name:     name.trim(),
      email:    email.trim().toLowerCase(),
      whatsapp: whatsapp.trim(),
      country:  country.trim(),
      message:  sanitizedMessage,
      status:   'new',
    })
    .select('id, created_at')
    .single();

  if (dbErr) {
    console.error('[public] resellerApplication DB:', dbErr.message);
    return res.status(500).json({ error: 'Erro ao registrar cadastro. Tente novamente.' });
  }

  console.log(`[public] resellerApplication | id=${data.id} | email=${email.trim().toLowerCase()}`);

  const notifyEmail = (process.env.ADMIN_NOTIFICATION_EMAIL || 'pedidos@kitsdigitalia.com').trim();
  sendEmail({
    to:      notifyEmail,
    subject: `Novo cadastro de revendedor — ${name.trim()}`,
    text: [
      'Novo cadastro de revendedor recebido:',
      '',
      `ID:        ${data.id}`,
      `Nome:      ${name.trim()}`,
      `Email:     ${email.trim().toLowerCase()}`,
      `WhatsApp:  ${whatsapp.trim()}`,
      `País:      ${country.trim()}`,
      `Mensagem:  ${sanitizedMessage || '—'}`,
      `Data:      ${new Date(data.created_at).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`,
    ].join('\n'),
  }).catch(err => console.error(`[public] resellerApplication email | id=${data.id} | ${err.message}`));

  return res.status(201).json({
    success: true,
    message: 'Cadastro recebido! Entraremos em contato em breve.',
  });
}

// ── Roteador principal ────────────────────────────────────────────────────────

const ACTION_MAP = {
  validateCoupon:       actionValidateCoupon,
  resellerApplication:  actionResellerApplication,
};

module.exports = async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const action = getAction(req);

  if (!action) {
    return res.status(400).json({ error: 'Parâmetro "action" obrigatório.' });
  }

  const fn = ACTION_MAP[action];
  if (!fn) {
    return res.status(400).json({ error: `Ação desconhecida: "${action}".` });
  }

  try {
    return await fn(req, res);
  } catch (err) {
    console.error(`[public] unhandled error | action=${action} |`, err);
    return res.status(500).json({ error: 'Erro inesperado no servidor. Tente novamente.' });
  }
};
