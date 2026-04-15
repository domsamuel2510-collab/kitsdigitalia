// ============================================================
// POST /api/create-manual-order
//
// Registra pedidos IBAN e Binance no Supabase.
// Entrega manual via WhatsApp — sem gateway de pagamento.
//
// Env vars: SUPABASE_URL, SUPABASE_SERVICE_KEY, ALLOWED_ORIGIN
// ============================================================

const { createClient }  = require('@supabase/supabase-js');
const { PRODUCT_CATALOG } = require('./_catalog');

const BINANCE_UID          = '1229674211';
const BINANCE_DISCOUNT_PCT = 0.07; // 7%

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin',  process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function generateOrderId() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = String(Math.floor(1000 + Math.random() * 9000));
  return `PD-${date}-${rand}`;
}

module.exports = async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, whatsapp, productId, productName, paymentMethod, notes } = req.body || {};

  if (!name || !email || !whatsapp || !productId || !paymentMethod) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
  }

  if (!['iban', 'binance'].includes(paymentMethod)) {
    return res.status(400).json({ error: 'Método de pagamento inválido.' });
  }

  const item = PRODUCT_CATALOG[productId];
  if (!item) {
    return res.status(400).json({ error: 'Produto não encontrado.' });
  }
  if (item.soldOut) {
    return res.status(400).json({ error: 'Produto esgotado. Escolha outro produto.' });
  }

  // Desconto Binance calculado no servidor
  const basePrice = item.price;
  const amount    = paymentMethod === 'binance'
    ? Math.round(basePrice * (1 - BINANCE_DISCOUNT_PCT) * 100) / 100
    : basePrice;

  const orderId = generateOrderId();
  const db      = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  const { error: dbErr } = await db.from('orders').insert({
    order_id:           orderId,
    customer_name:      name.trim(),
    customer_email:     email.trim().toLowerCase(),
    customer_whatsapp:  whatsapp.trim(),
    product_id:         productId,
    product_name:       (productName || productId).trim(),
    amount,
    payment_method:     paymentMethod,
    payment_provider:   'manual',
    payment_status:     'pending_manual',
    fulfillment_status: 'aguardando_pagamento',
    currency:           'EUR',
    notes:              notes ? notes.trim() : null,
  });

  if (dbErr) {
    console.error('[create-manual-order] DB insert:', dbErr.message);
    return res.status(500).json({ error: 'Erro ao registrar pedido.' });
  }

  return res.status(200).json({
    success:    true,
    orderId,
    amount,
    binanceUid: paymentMethod === 'binance' ? BINANCE_UID : undefined,
  });
};
