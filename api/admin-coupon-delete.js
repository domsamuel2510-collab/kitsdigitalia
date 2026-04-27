// ============================================================
// POST /api/admin-coupon-delete
// Exclui um cupom pelo ID.
// Body: { id }
// ============================================================

'use strict';

const { createClient }                 = require('@supabase/supabase-js');
const { requireAdmin, setCorsHeaders } = require('./_admin-auth');

module.exports = async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  const admin = requireAdmin(req, res);
  if (!admin) return;

  const { id } = req.body || {};
  if (!id) return res.status(400).json({ error: 'ID do cupom é obrigatório.' });

  const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const { error } = await db.from('coupons').delete().eq('id', id);

  if (error) {
    console.error('[admin-coupon-delete]', error.message);
    return res.status(500).json({ error: 'Erro ao excluir cupom.' });
  }

  console.log(`[admin-coupon-delete] id=${id} | admin=${admin.username}`);
  return res.status(200).json({ success: true });
};
