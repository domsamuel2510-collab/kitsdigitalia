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

  const discountPct = Number(coupon.discount_percent);
  const baseEUR     = product.price; // em EUR

  // ── Cálculo idêntico ao usado em create-pix-order.js e create-manual-order.js ──
  // PIX: desconto aplicado sobre o valor em BRL (após conversão EUR→BRL).
  // IBAN/Binance: desconto aplicado sobre o valor em EUR.
  // Usar a MESMA sequência de arredondamentos garante que o valor exibido
  // aqui é exatamente o valor que será cobrado no pedido.
  const isPix    = (payment_method || '') === 'pix';
  const currency = isPix ? 'BRL' : 'EUR';

  let originalAmount, discountAmount, finalAmount;

  if (isPix) {
    // Replica create-pix-order.js → resolveCoupon(db, code, priceEUR * EUR_TO_BRL)
    originalAmount = Math.round(baseEUR * EUR_TO_BRL * 100) / 100;
    discountAmount = Math.round(originalAmount * (discountPct / 100) * 100) / 100;
    finalAmount    = Math.round((originalAmount - discountAmount) * 100) / 100;
  } else {
    // Replica create-manual-order.js → resolveCoupon(db, code, priceAfterBinance)
    // Sem Binance aqui (não sabemos se vai usar); calcula sobre EUR base.
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
};
