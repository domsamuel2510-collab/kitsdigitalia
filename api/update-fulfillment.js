// ============================================================
// Vercel Function: POST /api/update-fulfillment
//
// Atualiza status de entrega de um pedido.
// Protegido por token admin simples (ADMIN_TOKEN env var).
//
// Uso (curl):
//   curl -X POST https://seu-site.vercel.app/api/update-fulfillment \
//     -H "Content-Type: application/json" \
//     -H "Authorization: Bearer SEU_ADMIN_TOKEN" \
//     -d '{"orderId":"PD-20250415-1234","fulfillmentStatus":"entregue"}'
//
// Variáveis de ambiente:
//   ADMIN_TOKEN           — token secreto para autorização (ex: uuid v4 aleatório)
//   SUPABASE_URL          — URL do Supabase
//   SUPABASE_SERVICE_KEY  — Service Role Key do Supabase
// ============================================================

const { createClient } = require('@supabase/supabase-js');

const VALID_FULFILLMENT = ['aguardando_pagamento', 'pago_ok', 'em_andamento', 'entregue', 'concluido'];
const VALID_PAYMENT     = ['pending', 'pending_manual', 'paid', 'failed', 'expired'];

function setCorsHeaders(res) {
  const origin = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

module.exports = async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')    return res.status(405).json({ error: 'Method not allowed' });

  // Verifica token admin
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (!token || !process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Não autorizado.' });
  }

  const { orderId, fulfillmentStatus, paymentStatus } = req.body || {};

  if (!orderId) {
    return res.status(400).json({ error: 'orderId obrigatório.' });
  }
  if (fulfillmentStatus && !VALID_FULFILLMENT.includes(fulfillmentStatus)) {
    return res.status(400).json({ error: 'fulfillmentStatus inválido. Valores aceitos: ' + VALID_FULFILLMENT.join(', ') });
  }
  if (paymentStatus && !VALID_PAYMENT.includes(paymentStatus)) {
    return res.status(400).json({ error: 'paymentStatus inválido. Valores aceitos: ' + VALID_PAYMENT.join(', ') });
  }

  const updates = {};
  if (fulfillmentStatus) updates.fulfillment_status = fulfillmentStatus;
  if (paymentStatus)     updates.payment_status     = paymentStatus;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'Nenhum campo para atualizar.' });
  }

  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    const { error } = await supabase
      .from('orders')
      .update(updates)
      .eq('order_id', orderId);

    if (error) throw new Error(error.message);

    return res.status(200).json({ success: true, orderId, updates });

  } catch (err) {
    console.error('[update-fulfillment]', err.message);
    return res.status(500).json({ error: 'Erro ao atualizar pedido.' });
  }
};
