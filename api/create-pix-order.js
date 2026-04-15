// ============================================================
// POST /api/create-pix-order
//
// Cria cobrança PIX via MisticPay e persiste no Supabase.
// Configuração da MisticPay: api/_misticpay.js
// Catálogo de preços:         api/_catalog.js
//
// Env vars necessárias (Vercel → Settings → Environment Variables):
//   MISTICPAY_CLIENT_ID     — client ID da MisticPay
//   MISTICPAY_CLIENT_SECRET — client secret da MisticPay
//   SUPABASE_URL            — https://xxxx.supabase.co
//   SUPABASE_SERVICE_KEY    — service role key (nunca expor no frontend)
//   ALLOWED_ORIGIN          — https://seusite.vercel.app  (obrigatório em produção)
// ============================================================

const { createClient }              = require('@supabase/supabase-js');
const { createPixCharge }           = require('./_misticpay');
const { PRODUCT_CATALOG }           = require('./_catalog');

const EUR_TO_BRL = 5.99;

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

function sanitizeCpf(raw) {
  return (raw || '').replace(/\D/g, '');
}

module.exports = async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, whatsapp, cpf, productId, productName, notes } = req.body || {};

  // Validação de campos obrigatórios
  if (!name || !email || !whatsapp || !cpf || !productId) {
    return res.status(400).json({ error: 'Campos obrigatórios: name, email, whatsapp, cpf, productId.' });
  }

  // Validação de CPF (11 dígitos)
  const cleanCpf = sanitizeCpf(cpf);
  if (cleanCpf.length !== 11) {
    return res.status(400).json({ error: 'CPF inválido. Informe os 11 dígitos numéricos.' });
  }

  // Valida produto e preço no servidor — nunca confiar no cliente
  const item = PRODUCT_CATALOG[productId];
  if (!item) {
    return res.status(400).json({ error: 'Produto não encontrado.' });
  }
  if (item.soldOut) {
    return res.status(400).json({ error: 'Produto esgotado. Escolha outro produto.' });
  }

  const priceEUR = item.price;
  const amount   = Math.round(priceEUR * EUR_TO_BRL * 100) / 100;
  const orderId = generateOrderId();

  console.log('[create-pix-order] request:', { productId, productName, amount, paymentMethod: 'pix', orderId });

  const db      = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  // Persiste pedido ANTES de chamar a MisticPay
  // Garante que o pedido existe no banco mesmo se o gateway falhar
  const { error: dbErr } = await db.from('orders').insert({
    order_id:           orderId,
    customer_name:      name.trim(),
    customer_email:     email.trim().toLowerCase(),
    customer_whatsapp:  whatsapp.trim(),
    customer_cpf:       cleanCpf,
    product_id:         productId,
    product_name:       (productName || productId).trim(),
    amount,
    payment_method:     'pix',
    payment_provider:   'misticpay',
    payment_status:     'pending',
    fulfillment_status: 'aguardando_pagamento',
    currency:           'BRL',
    notes:              notes ? notes.trim() : null,
  });

  if (dbErr) {
    console.error('[create-pix-order] DB insert:', dbErr.message);
    return res.status(500).json({ error: 'Erro interno. Tente novamente.' });
  }

  // Chama a MisticPay
  let pix;
  try {
    console.log('[create-pix-order] calling createPixCharge:', { orderId, amount, name: name.trim() });
    pix = await createPixCharge({
      orderId,
      amount,
      name: name.trim(),
      cpf:  cleanCpf,
    });
    console.log('[create-pix-order] createPixCharge response:', {
      transactionId: pix.transactionId,
      copyPaste:     pix.copyPaste ? pix.copyPaste.slice(0, 40) + '…' : '',
      qrcodeUrl:     pix.qrcodeUrl,
      qrCodeBase64:  pix.qrCodeBase64 ? '[base64 present]' : '[empty]',
    });
  } catch (err) {
    console.error('[create-pix-order] MisticPay error:', err);
    return res.status(502).json({
      error:   'Erro ao gerar PIX',
      details: err.message,
    });
  }

  // Atualiza pedido com dados do provedor
  await db.from('orders').update({
    provider_transaction_id: pix.transactionId,
    provider_status:         'pending',
    pix_copy_paste:          pix.copyPaste,
    pix_qrcode_url:          pix.qrcodeUrl,
  }).eq('order_id', orderId);

  return res.status(200).json({
    success:      true,
    orderId,
    copyPaste:    pix.copyPaste,
    qrcodeUrl:    pix.qrcodeUrl,
    qrCodeBase64: pix.qrCodeBase64,
    amount,
  });
};
