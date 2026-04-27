// ============================================================
// POST /api/create-manual-order
//
// Registra pedidos IBAN e Binance no Supabase.
// Entrega manual via WhatsApp — sem gateway de pagamento.
// Catálogo de preços:  api/_products.js (DB-first) + api/_catalog.js (fallback)
// Geração de order_id: api/_order-id.js
// Validação de inputs: api/_validate.js
//
// Env vars (Vercel → Settings → Environment Variables):
//   SUPABASE_URL          — https://xxxx.supabase.co
//   SUPABASE_SERVICE_KEY  — service role key (nunca expor no frontend)
//   ALLOWED_ORIGIN        — https://seusite.com (obrigatório em produção)
// ============================================================

'use strict';

const { createClient }           = require('@supabase/supabase-js');
const { lookupProduct }          = require('./_products');
const { insertOrderWithRetry }   = require('./_order-id');
const { validateEmail,
        validateRequiredString,
        firstError }             = require('./_validate');
const { resolveReseller }        = require('./_reseller');

const BINANCE_UID          = '1229674211';
const BINANCE_DISCOUNT_PCT = 0.07; // 7 %

// ── CORS ────────────────────────────────────────────────────────────────────

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin',  process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// ── Helpers ──────────────────────────────────────────────────────────────────

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
 * Valida e aplica cupom. Retorna { discountPercent, discountAmount, resolvedCode } ou zeros.
 */
async function resolveCoupon(db, couponCode, basePrice) {
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
  const amount = Math.round(basePrice * (pct / 100) * 100) / 100;
  return { discountPercent: pct, discountAmount: amount, resolvedCode: data.code };
}

// ── Handler principal ────────────────────────────────────────────────────────

module.exports = async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, email, whatsapp, productId, productName, paymentMethod, notes, coupon_code, reseller_code } = req.body || {};

    // 1. Validação de inputs ─────────────────────────────────────────────────
    const inputError = firstError(
      validateRequiredString(name,          'Nome',          200),
      validateEmail(email),
      validateRequiredString(whatsapp,      'WhatsApp',       30),
      validateRequiredString(productId,     'productId',     100),
      validateRequiredString(paymentMethod, 'paymentMethod',  20),
    );
    if (inputError) return res.status(400).json({ error: inputError });

    if (!['iban', 'binance'].includes(paymentMethod)) {
      return res.status(400).json({ error: 'Método de pagamento inválido.' });
    }

    // 2. Supabase ─────────────────────────────────────────────────────────────
    const { db, configError } = resolveSupabase();
    if (configError) {
      console.error('[create-manual-order] config:', configError);
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

    // Desconto Binance calculado exclusivamente no servidor
    const basePrice = item.price; // em EUR
    const binanceDiscount = paymentMethod === 'binance'
      ? Math.round(basePrice * BINANCE_DISCOUNT_PCT * 100) / 100
      : 0;
    const priceAfterBinance = Math.round((basePrice - binanceDiscount) * 100) / 100;

    // 4. Resolve cupom (opcional, aplicado sobre o preço após desconto Binance) ─
    const { discountPercent, discountAmount, resolvedCode } =
      await resolveCoupon(db, coupon_code, priceAfterBinance);
    const originalAmount = priceAfterBinance; // antes do cupom
    const amount         = Math.round((priceAfterBinance - discountAmount) * 100) / 100;

    // 4.5 Resolve revendedor (opcional — só aceita se aprovado no DB) ──────────
    const reseller         = await resolveReseller(db, reseller_code);
    const commissionPct    = reseller ? reseller.commission_percent : 0;
    const commissionAmount = reseller ? Math.round(amount * (commissionPct / 100) * 100) / 100 : 0;

    // 5. Insert com retry em colisão de order_id ──────────────────────────────
    const { orderId, error: dbErr } = await insertOrderWithRetry(db, (id) => ({
      order_id:           id,
      customer_name:      name.trim(),
      customer_email:     email.trim().toLowerCase(),
      customer_whatsapp:  whatsapp.trim(),
      product_id:         productId,
      product_name:       resolvedName,
      amount,
      original_amount:    discountPercent > 0 ? originalAmount : null,
      coupon_code:        resolvedCode,
      discount_percent:   discountPercent > 0 ? discountPercent : null,
      payment_method:     paymentMethod,
      payment_provider:   'manual',
      payment_status:     'pending_manual',
      fulfillment_status: 'aguardando_pagamento',
      currency:           'EUR',
      notes:              notes ? String(notes).trim().slice(0, 1000) : null,
      // Revendedor (nulo quando não veio ref válido)
      reseller_id:        reseller ? reseller.id   : null,
      reseller_code:      reseller ? reseller_code.trim().toLowerCase() : null,
      reseller_name:      reseller ? reseller.name : null,
      commission_percent: reseller ? commissionPct : null,
      commission_amount:  reseller ? commissionAmount : null,
      commission_status:  reseller ? 'pending' : null,
    }));

    if (dbErr) {
      console.error(`[create-manual-order] DB insert falhou | product=${productId} | err=${dbErr.message}`);
      return res.status(500).json({ error: 'Erro ao registrar pedido.', details: dbErr.message });
    }

    const couponInfo   = resolvedCode ? ` | cupom=${resolvedCode} ${discountPercent}%` : '';
    const resellerInfo = reseller ? ` | ref=${reseller_code.trim().toLowerCase()} commission=${commissionPct}%` : '';
    console.log(`[create-manual-order] pedido criado | orderId=${orderId} | product=${productId} | method=${paymentMethod} | amount=${amount}${couponInfo}${resellerInfo}`);

    // 6. Resposta ─────────────────────────────────────────────────────────────
    return res.status(200).json({
      success:          true,
      orderId,
      amount,
      original_amount:  discountPercent > 0 ? originalAmount : null,
      discount_percent: discountPercent > 0 ? discountPercent : null,
      binanceUid:       paymentMethod === 'binance' ? BINANCE_UID : undefined,
    });

  } catch (unexpectedErr) {
    console.error('[create-manual-order] unhandled error:', unexpectedErr);
    return res.status(500).json({ error: 'Erro inesperado no servidor. Tente novamente.' });
  }
};
