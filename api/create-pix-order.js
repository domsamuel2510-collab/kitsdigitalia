// ============================================================
// POST /api/create-pix-order
//
// Cria cobrança PIX via MisticPay e persiste no Supabase.
// Catálogo de preços:  api/_products.js (DB-first) + api/_catalog.js (fallback)
// Geração de order_id: api/_order-id.js
// Validação de inputs: api/_validate.js
//
// Env vars (Vercel → Settings → Environment Variables):
//   MISTICPAY_CLIENT_ID     — client ID da MisticPay
//   MISTICPAY_CLIENT_SECRET — client secret da MisticPay
//   SUPABASE_URL            — https://xxxx.supabase.co
//   SUPABASE_SERVICE_KEY    — service role key (nunca expor no frontend)
//   ALLOWED_ORIGIN          — https://seusite.com (obrigatório em produção)
//   SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS — notificação por email (legado)
//   RESEND_API_KEY          — alternativa moderna a SMTP
// ============================================================

'use strict';

const { createClient }           = require('@supabase/supabase-js');
const { createPixCharge }        = require('./_misticpay');
const { lookupProduct }          = require('./_products');
const { insertOrderWithRetry }   = require('./_order-id');
const { validateEmail,
        validateRequiredString,
        firstError }             = require('./_validate');
const { sendEmail }              = require('./_email');

const EUR_TO_BRL = 5.99;

// ── CORS ────────────────────────────────────────────────────────────────────

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin',  process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function sanitizeCpf(raw) {
  return (raw || '').replace(/\D/g, '');
}

function resolveSupabase() {
  const url = (process.env.SUPABASE_URL || '').trim();
  const key = (process.env.SUPABASE_SERVICE_KEY || '').trim();
  if (!url || !url.startsWith('https://')) {
    return { db: null, configError: 'SUPABASE_URL ausente ou inválida. Configure a env var na Vercel.' };
  }
  if (!key) {
    return { db: null, configError: 'SUPABASE_SERVICE_KEY ausente. Configure a env var na Vercel.' };
  }
  return { db: createClient(url, key), configError: null };
}

/**
 * Valida e aplica cupom. Retorna { discountPercent, discountAmount } ou zeros se sem cupom.
 */
async function resolveCoupon(db, couponCode, priceEUR) {
  if (!couponCode || typeof couponCode !== 'string') {
    return { discountPercent: 0, discountAmount: 0, resolvedCode: null };
  }
  const normalizedCode = couponCode.trim().toUpperCase();
  if (!normalizedCode) return { discountPercent: 0, discountAmount: 0, resolvedCode: null };

  const { data, error } = await db
    .from('coupons')
    .select('code, discount_percent, active')
    .eq('code', normalizedCode)
    .maybeSingle();

  if (error || !data || !data.active) {
    return { discountPercent: 0, discountAmount: 0, resolvedCode: null };
  }

  const pct    = Number(data.discount_percent);
  const amount = Math.round(priceEUR * (pct / 100) * 100) / 100;
  return { discountPercent: pct, discountAmount: amount, resolvedCode: data.code };
}

// ── Handler principal ────────────────────────────────────────────────────────

module.exports = async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, email, whatsapp, cpf, productId, productName, notes, coupon_code } = req.body || {};

    // 1. Validação de inputs ─────────────────────────────────────────────────
    const inputError = firstError(
      validateRequiredString(name,      'Nome',      200),
      validateEmail(email),
      validateRequiredString(whatsapp,  'WhatsApp',   30),
      validateRequiredString(productId, 'productId', 100),
    );
    if (inputError) return res.status(400).json({ error: inputError });

    const cleanCpf = sanitizeCpf(cpf);
    if (cleanCpf.length !== 11) {
      return res.status(400).json({ error: 'CPF inválido. Informe os 11 dígitos numéricos.' });
    }

    // 2. Supabase ─────────────────────────────────────────────────────────────
    const { db, configError } = resolveSupabase();
    if (configError) {
      console.error('[create-pix-order] config:', configError);
      return res.status(500).json({ error: 'Configuração inválida no servidor', details: configError });
    }

    // 3. Validação de produto (DB-first, fallback em _catalog.js) ─────────────
    const item = await lookupProduct(db, productId);
    if (!item) return res.status(400).json({ error: 'Produto não encontrado.' });
    if (item.soldOut) return res.status(400).json({ error: 'Produto esgotado. Escolha outro produto.' });

    // productName é display-only (vem do frontend localizado).
    const resolvedName = (productName && typeof productName === 'string')
      ? productName.trim().slice(0, 200) || productId
      : (item.name || productId);

    const priceEUR       = item.price;
    const originalAmount = Math.round(priceEUR * EUR_TO_BRL * 100) / 100;

    // 4. Resolve cupom (opcional) ─────────────────────────────────────────────
    const { discountPercent, discountAmount, resolvedCode } =
      await resolveCoupon(db, coupon_code, priceEUR * EUR_TO_BRL);
    const amount = Math.round((originalAmount - discountAmount) * 100) / 100;

    // 5. Insert com retry em colisão de order_id ──────────────────────────────
    const { orderId, error: dbErr } = await insertOrderWithRetry(db, (id) => ({
      order_id:           id,
      customer_name:      name.trim(),
      customer_email:     email.trim().toLowerCase(),
      customer_whatsapp:  whatsapp.trim(),
      customer_cpf:       cleanCpf,          // armazenado limpo; não logado
      product_id:         productId,
      product_name:       resolvedName,
      amount,
      original_amount:    discountPercent > 0 ? originalAmount : null,
      coupon_code:        resolvedCode,
      discount_percent:   discountPercent > 0 ? discountPercent : null,
      payment_method:     'pix',
      payment_provider:   'misticpay',
      payment_status:     'pending',
      fulfillment_status: 'aguardando_pagamento',
      currency:           'BRL',
      notes:              notes ? String(notes).trim().slice(0, 1000) : null,
    }));

    if (dbErr) {
      console.error(`[create-pix-order] DB insert falhou | product=${productId} | err=${dbErr.message}`);
      return res.status(500).json({ error: 'Erro no banco de dados', details: dbErr.message });
    }

    const couponInfo = resolvedCode ? ` | cupom=${resolvedCode} ${discountPercent}%` : '';
    console.log(`[create-pix-order] pedido criado | orderId=${orderId} | product=${productId} | amount=${amount}${couponInfo}`);

    // 6. Email (fire-and-forget) ──────────────────────────────────────────────
    const notifyEmail = (process.env.ADMIN_NOTIFICATION_EMAIL || 'pedidos@kitsdigitalia.com').trim();
    sendEmail({
      to:      notifyEmail,
      subject: `Novo pedido PIX — ${orderId}`,
      text: [
        'Novo pedido PIX recebido:',
        '',
        `Order ID:  ${orderId}`,
        `Produto:   ${resolvedName}`,
        `Valor:     R$ ${amount}`,
        discountPercent > 0 ? `Cupom:     ${resolvedCode} (${discountPercent}% off)` : '',
        `Cliente:   ${name.trim()}`,
        `Email:     ${email.trim().toLowerCase()}`,
        `WhatsApp:  ${whatsapp.trim()}`,
      ].filter(Boolean).join('\n'),
    }).catch(err => console.error(`[create-pix-order] email error | orderId=${orderId} | ${err.message}`));

    // 7. Gera cobrança PIX ────────────────────────────────────────────────────
    let pix;
    try {
      pix = await createPixCharge({ orderId, amount, name: name.trim(), cpf: cleanCpf });
      console.log(`[create-pix-order] PIX gerado | orderId=${orderId} | txId=${pix.transactionId}`);
    } catch (err) {
      console.error(`[create-pix-order] MisticPay error | orderId=${orderId} | ${err.message}`);
      return res.status(502).json({ error: 'Erro ao gerar PIX', details: err.message });
    }

    // 8. Atualiza pedido com dados da MisticPay ───────────────────────────────
    await db.from('orders').update({
      provider_transaction_id: pix.transactionId,
      provider_status:         'pending',
      pix_copy_paste:          pix.copyPaste,
      pix_qrcode_url:          pix.qrcodeUrl,
    }).eq('order_id', orderId);

    // 9. Resposta ─────────────────────────────────────────────────────────────
    return res.status(200).json({
      success:          true,
      orderId,
      copyPaste:        pix.copyPaste,
      qrcodeUrl:        pix.qrcodeUrl,
      qrCodeBase64:     pix.qrCodeBase64,
      amount,
      original_amount:  discountPercent > 0 ? originalAmount : null,
      discount_percent: discountPercent > 0 ? discountPercent : null,
    });

  } catch (unexpectedErr) {
    // Loga internamente sem expor stack/mensagem técnica ao cliente
    console.error('[create-pix-order] unhandled error:', unexpectedErr);
    return res.status(500).json({ error: 'Erro inesperado no servidor. Tente novamente.' });
  }
};
