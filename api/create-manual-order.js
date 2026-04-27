// ============================================================
// POST /api/create-manual-order
//
// Registra pedidos IBAN e Binance no Supabase.
// Entrega manual via WhatsApp — sem gateway de pagamento.
// Catálogo de preços:  api/_catalog.js
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
const { PRODUCT_CATALOG }        = require('./_catalog');
const { insertOrderWithRetry }   = require('./_order-id');
const { validateEmail,
        validateRequiredString,
        firstError }             = require('./_validate');

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

// ── Handler principal ────────────────────────────────────────────────────────

module.exports = async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, email, whatsapp, productId, productName, paymentMethod, notes } = req.body || {};

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

    // 2. Validação de produto (servidor é a única fonte de verdade) ───────────
    const item = PRODUCT_CATALOG[productId];
    if (!item) return res.status(400).json({ error: 'Produto não encontrado.' });
    if (item.soldOut) return res.status(400).json({ error: 'Produto esgotado. Escolha outro produto.' });

    // productName é display-only (vem do frontend localizado).
    // Preço e disponibilidade sempre do catálogo server-side.
    const resolvedName = (productName && typeof productName === 'string')
      ? productName.trim().slice(0, 200) || productId
      : productId;

    // Desconto Binance calculado exclusivamente no servidor
    const basePrice = item.price;
    const amount    = paymentMethod === 'binance'
      ? Math.round(basePrice * (1 - BINANCE_DISCOUNT_PCT) * 100) / 100
      : basePrice;

    // 3. Supabase ─────────────────────────────────────────────────────────────
    const { db, configError } = resolveSupabase();
    if (configError) {
      console.error('[create-manual-order] config:', configError);
      return res.status(500).json({ error: 'Configuração inválida no servidor', details: configError });
    }

    // 4. Insert com retry em colisão de order_id ──────────────────────────────
    const { orderId, error: dbErr } = await insertOrderWithRetry(db, (id) => ({
      order_id:           id,
      customer_name:      name.trim(),
      customer_email:     email.trim().toLowerCase(),
      customer_whatsapp:  whatsapp.trim(),
      product_id:         productId,
      product_name:       resolvedName,
      amount,
      payment_method:     paymentMethod,
      payment_provider:   'manual',
      payment_status:     'pending_manual',
      fulfillment_status: 'aguardando_pagamento',
      currency:           'EUR',
      notes:              notes ? String(notes).trim().slice(0, 1000) : null,
    }));

    if (dbErr) {
      console.error(`[create-manual-order] DB insert falhou | product=${productId} | err=${dbErr.message}`);
      return res.status(500).json({ error: 'Erro ao registrar pedido.', details: dbErr.message });
    }

    console.log(`[create-manual-order] pedido criado | orderId=${orderId} | product=${productId} | method=${paymentMethod} | amount=${amount}`);

    // 5. Resposta ─────────────────────────────────────────────────────────────
    return res.status(200).json({
      success:    true,
      orderId,
      amount,
      binanceUid: paymentMethod === 'binance' ? BINANCE_UID : undefined,
    });

  } catch (unexpectedErr) {
    console.error('[create-manual-order] unhandled error:', unexpectedErr);
    return res.status(500).json({ error: 'Erro inesperado no servidor', details: unexpectedErr.message });
  }
};
