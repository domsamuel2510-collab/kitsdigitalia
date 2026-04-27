// ============================================================
// POST /api/create-pix-order
//
// Cria cobrança PIX via MisticPay e persiste no Supabase.
// Catálogo de preços:  api/_catalog.js
// Geração de order_id: api/_order-id.js
// Validação de inputs: api/_validate.js
//
// Env vars (Vercel → Settings → Environment Variables):
//   MISTICPAY_CLIENT_ID     — client ID da MisticPay
//   MISTICPAY_CLIENT_SECRET — client secret da MisticPay
//   SUPABASE_URL            — https://xxxx.supabase.co
//   SUPABASE_SERVICE_KEY    — service role key (nunca expor no frontend)
//   ALLOWED_ORIGIN          — https://seusite.com (obrigatório em produção)
//   SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS — notificação por email
// ============================================================

'use strict';

const { createClient }           = require('@supabase/supabase-js');
const { createPixCharge }        = require('./_misticpay');
const { PRODUCT_CATALOG }        = require('./_catalog');
const { insertOrderWithRetry }   = require('./_order-id');
const { validateEmail,
        validateRequiredString,
        firstError }             = require('./_validate');
const nodemailer                 = require('nodemailer');

const EUR_TO_BRL = 5.99;

// ── CORS ────────────────────────────────────────────────────────────────────

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin',  process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// ── Email (fire-and-forget) ──────────────────────────────────────────────────

async function sendOrderEmail({ orderId, productName, amount, name, email, whatsapp }) {
  const transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   Number(process.env.SMTP_PORT) || 465,
    secure: (Number(process.env.SMTP_PORT) || 465) === 465,
    auth:   { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  await transporter.sendMail({
    from:    `"KitsDigitalia" <${process.env.SMTP_USER}>`,
    to:      'pedidos@kitsdigitalia.com',
    subject: `Novo pedido PIX — ${orderId}`,
    text: [
      'Novo pedido PIX recebido:',
      '',
      `Order ID:  ${orderId}`,
      `Produto:   ${productName}`,
      `Valor:     R$ ${amount}`,
      `Cliente:   ${name}`,
      `Email:     ${email}`,
      `WhatsApp:  ${whatsapp}`,
    ].join('\n'),
  });
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

// ── Handler principal ────────────────────────────────────────────────────────

module.exports = async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, email, whatsapp, cpf, productId, productName, notes } = req.body || {};

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

    // 2. Validação de produto (servidor é a única fonte de verdade) ───────────
    const item = PRODUCT_CATALOG[productId];
    if (!item) return res.status(400).json({ error: 'Produto não encontrado.' });
    if (item.soldOut) return res.status(400).json({ error: 'Produto esgotado. Escolha outro produto.' });

    // productName é display-only (vem do frontend localizado).
    // Preço e disponibilidade sempre do catálogo server-side.
    const resolvedName = (productName && typeof productName === 'string')
      ? productName.trim().slice(0, 200) || productId
      : productId;

    const priceEUR = item.price;
    const amount   = Math.round(priceEUR * EUR_TO_BRL * 100) / 100;

    // 3. Supabase ─────────────────────────────────────────────────────────────
    const { db, configError } = resolveSupabase();
    if (configError) {
      console.error('[create-pix-order] config:', configError);
      return res.status(500).json({ error: 'Configuração inválida no servidor', details: configError });
    }

    // 4. Insert com retry em colisão de order_id ──────────────────────────────
    const { orderId, error: dbErr } = await insertOrderWithRetry(db, (id) => ({
      order_id:           id,
      customer_name:      name.trim(),
      customer_email:     email.trim().toLowerCase(),
      customer_whatsapp:  whatsapp.trim(),
      customer_cpf:       cleanCpf,          // armazenado limpo; não logado
      product_id:         productId,
      product_name:       resolvedName,
      amount,
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

    console.log(`[create-pix-order] pedido criado | orderId=${orderId} | product=${productId} | amount=${amount}`);

    // 5. Email (fire-and-forget) ──────────────────────────────────────────────
    sendOrderEmail({
      orderId,
      productName: resolvedName,
      amount,
      name:     name.trim(),
      email:    email.trim().toLowerCase(),
      whatsapp: whatsapp.trim(),
    }).catch(err => console.error(`[create-pix-order] email error | orderId=${orderId} | ${err.message}`));

    // 6. Gera cobrança PIX ────────────────────────────────────────────────────
    let pix;
    try {
      pix = await createPixCharge({ orderId, amount, name: name.trim(), cpf: cleanCpf });
      console.log(`[create-pix-order] PIX gerado | orderId=${orderId} | txId=${pix.transactionId}`);
    } catch (err) {
      console.error(`[create-pix-order] MisticPay error | orderId=${orderId} | ${err.message}`);
      return res.status(502).json({ error: 'Erro ao gerar PIX', details: err.message });
    }

    // 7. Atualiza pedido com dados da MisticPay ───────────────────────────────
    await db.from('orders').update({
      provider_transaction_id: pix.transactionId,
      provider_status:         'pending',
      pix_copy_paste:          pix.copyPaste,
      pix_qrcode_url:          pix.qrcodeUrl,
    }).eq('order_id', orderId);

    // 8. Resposta (estrutura idêntica à anterior) ─────────────────────────────
    return res.status(200).json({
      success:      true,
      orderId,
      copyPaste:    pix.copyPaste,
      qrcodeUrl:    pix.qrcodeUrl,
      qrCodeBase64: pix.qrCodeBase64,
      amount,
    });

  } catch (unexpectedErr) {
    console.error('[create-pix-order] unhandled error:', unexpectedErr);
    return res.status(500).json({ error: 'Erro inesperado no servidor', details: unexpectedErr.message });
  }
};
