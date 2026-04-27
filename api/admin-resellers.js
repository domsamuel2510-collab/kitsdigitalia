// ============================================================
// GET /api/admin-resellers — Lista cadastros de revendedores
// Protegido por sessão admin.
// ============================================================

'use strict';

const { createClient }                 = require('@supabase/supabase-js');
const { requireAdmin, setCorsHeaders } = require('./_admin-auth');

module.exports = async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const admin = requireAdmin(req, res);
  if (!admin) return;

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  // Filtro opcional por status: ?status=new
  const statusFilter = req.query?.status;
  let query = db
    .from('reseller_applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (statusFilter && ['new','contacted','approved','rejected'].includes(statusFilter)) {
    query = query.eq('status', statusFilter);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[admin-resellers] list:', error.message);
    return res.status(500).json({ error: 'Erro ao listar revendedores.' });
  }

  return res.status(200).json({ resellers: data });
};
