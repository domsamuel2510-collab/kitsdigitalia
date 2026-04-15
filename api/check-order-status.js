// ============================================================
// GET /api/check-order-status?orderId=PD-YYYYMMDD-XXXX
//
// Consulta o Supabase. Se o pedido PIX ainda está 'pending'
// e tem provider_transaction_id, consulta a MisticPay e atualiza.
//
// Env vars: MISTICPAY_CLIENT_ID, MISTICPAY_CLIENT_SECRET,
//           SUPABASE_URL, SUPABASE_SERVICE_KEY, ALLOWED_ORIGIN
// ============================================================

const { createClient }    = require('@supabase/supabase-js');
const { getChargeStatus } = require('./_misticpay');

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin',  process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET')    return res.status(405).json({ error: 'Method not allowed' });

  const { orderId } = req.query;
  if (!orderId || !orderId.startsWith('PD-')) {
    return res.status(400).json({ error: 'orderId inválido.' });
  }

  const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  const { data: order, error } = await db
    .from('orders')
    .select('payment_status, fulfillment_status, provider_transaction_id, amount')
    .eq('order_id', orderId)
    .single();

  if (error || !order) {
    return res.status(404).json({ error: 'Pedido não encontrado.' });
  }

  // Só consulta a MisticPay para PIX ainda pendente com ID de transação
  if (order.payment_status === 'pending' && order.provider_transaction_id) {
    try {
      const { raw, internalStatus } = await getChargeStatus(order.provider_transaction_id);

      if (internalStatus !== order.payment_status) {
        const updates = {
          payment_status:  internalStatus,
          provider_status: raw,
        };
        if (internalStatus === 'paid') {
          updates.fulfillment_status = 'pago_ok';
        }

        await db.from('orders').update(updates).eq('order_id', orderId);
        order.payment_status     = internalStatus;
        order.fulfillment_status = updates.fulfillment_status || order.fulfillment_status;
      }
    } catch (err) {
      // Não fatal: retorna o que está no banco
      console.error('[check-order-status] MisticPay:', err.message);
    }
  }

  return res.status(200).json({
    orderId,
    paymentStatus:     order.payment_status,
    fulfillmentStatus: order.fulfillment_status,
    amount:            order.amount,
  });
};
