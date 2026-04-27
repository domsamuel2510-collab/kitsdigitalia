// ============================================================
// POST /api/admin-reseller-update
// Atualiza status de um cadastro de revendedor.
// Body: { id, status }
// Status válidos: new | contacted | approved | rejected
// ============================================================

'use strict';

const { createClient }                 = require('@supabase/supabase-js');
const { requireAdmin, setCorsHeaders } = require('./_admin-auth');

const VALID_STATUSES = ['new', 'contacted', 'approved', 'rejected'];

module.exports = async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  const admin = requireAdmin(req, res);
  if (!admin) return;

  const { id, status } = req.body || {};

  if (!id)     return res.status(400).json({ error: 'ID é obrigatório.' });
  if (!status) return res.status(400).json({ error: 'Status é obrigatório.' });
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status inválido. Use: ${VALID_STATUSES.join(', ')}.` });
  }

  const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const { data, error } = await db
    .from('reseller_applications')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[admin-reseller-update]', error.message);
    return res.status(500).json({ error: 'Erro ao atualizar status.' });
  }

  console.log(`[admin-reseller-update] id=${id} | status=${status} | admin=${admin.username}`);
  return res.status(200).json({ reseller: data });
};
