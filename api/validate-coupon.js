// ============================================================
// POST /api/validate-coupon  — Endpoint PÚBLICO
//
// Valida um cupom e retorna o preço final calculado.
// Body: { coupon_code, product_id }
//
// O cálculo é sempre feito no servidor.
// O frontend NUNCA deve confiar em preço ou desconto que ele mesmo calculou.
// ============================================================

'use strict';

const { createClient } = require('@supabase/supabase-js');
const { lookupProduct } = require('./_products');

const EUR_TO_BRL = 5.99; // usado para converter PIX (BRL); IBAN/Binance em EUR

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin',  process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  const { coupon_code, product_id, payment_method } = req.body || {};

  if (!coupon_code || typeof coupon_code !== 'string') {
    return res.status(400).json({ valid: false, message: 'Código do cupom é obrigatório.' });
  }
  if (!product_id || typeof product_id !== 'string') {
    return res.status(400).json({ valid: false, message: 'product_id é obrigatório.' });
  }

  const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

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
    console.error('[validate-coupon] DB error:', error.message);
    return res.status(500).json({ valid: false, message: 'Erro ao validar cupom.' });
  }

  if (!coupon) {
    return res.status(200).json({ valid: false, message: 'Cupom não encontrado.' });
  }
  if (!coupon.active) {
    return res.status(200).json({ valid: false, message: 'Cupom inativo.' });
  }

  const discountPct     = Number(coupon.discount_percent);
  const basePrice       = product.price; // em EUR
  const discountAmount  = Math.round(basePrice * (discountPct / 100) * 100) / 100;
  const finalPriceEUR   = Math.round((basePrice - discountAmount) * 100) / 100;

  // Para exibição: se método for PIX, mostrar em BRL; senão EUR
  const isPix  = (payment_method || '') === 'pix';
  const mult   = isPix ? EUR_TO_BRL : 1;
  const currency = isPix ? 'BRL' : 'EUR';

  return res.status(200).json({
    valid:            true,
    coupon_code:      coupon.code,
    discount_percent: discountPct,
    original_amount:  Math.round(basePrice * mult * 100) / 100,
    discount_amount:  Math.round(discountAmount * mult * 100) / 100,
    final_amount:     Math.round(finalPriceEUR * mult * 100) / 100,
    currency,
    message:          `Cupom aplicado! ${discountPct}% de desconto.`,
  });
};
