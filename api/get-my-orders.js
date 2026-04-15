// ============================================================
// Vercel Function: GET /api/get-my-orders?email=...&whatsapp=...
//
// Retorna pedidos de um cliente identificado por email + whatsapp.
// Requer ambos para dificultar enumeração de pedidos alheios.
//
// Variáveis de ambiente: SUPABASE_URL, SUPABASE_SERVICE_KEY
// ============================================================

const { createClient } = require('@supabase/supabase-js');

function setCorsHeaders(res) {
  const origin = process.env.ALLOWED_ORIGIN || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET')    return res.status(405).json({ error: 'Method not allowed' });

  const { email, whatsapp } = req.query;

  if (!email || !whatsapp) {
    return res.status(400).json({ error: 'email e whatsapp são obrigatórios.' });
  }

  // Validação mínima de formato
  if (!email.includes('@') || email.length > 254) {
    return res.status(400).json({ error: 'Email inválido.' });
  }

  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

    const { data: orders, error } = await supabase
      .from('orders')
      .select(
        'order_id, product_name, amount, currency, payment_method, payment_status, fulfillment_status, created_at'
      )
      .eq('customer_email', email.trim().toLowerCase())
      .eq('customer_whatsapp', whatsapp.trim())
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw new Error(error.message);

    return res.status(200).json({ orders: orders || [] });

  } catch (err) {
    console.error('[get-my-orders]', err.message);
    return res.status(500).json({ error: 'Erro ao buscar pedidos.' });
  }
};
