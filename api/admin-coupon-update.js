// ============================================================
// POST /api/admin-coupon-update
// Atualiza código, desconto ou status ativo de um cupom.
// Body: { id, code?, discount_percent?, active? }
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

  const { id, code, discount_percent, active } = req.body || {};

  if (!id) return res.status(400).json({ error: 'ID do cupom é obrigatório.' });

  const updates = {};
  if (code !== undefined) {
    if (typeof code !== 'string' || !code.trim()) {
      return res.status(400).json({ error: 'Código inválido.' });
    }
    updates.code = code.trim().toUpperCase();
  }
  if (discount_percent !== undefined) {
    const pct = Number(discount_percent);
    if (!Number.isFinite(pct) || pct < 1 || pct > 90) {
      return res.status(400).json({ error: 'Desconto deve ser entre 1% e 90%.' });
    }
    updates.discount_percent = pct;
  }
  if (active !== undefined) {
    updates.active = Boolean(active);
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'Nenhum campo para atualizar.' });
  }

  const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const { data, error } = await db
    .from('coupons')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    const isDuplicate = error.code === '23505' || (error.message || '').includes('duplicate key');
    if (isDuplicate) return res.status(409).json({ error: `Código "${updates.code}" já está em uso.` });
    console.error('[admin-coupon-update]', error.message);
    return res.status(500).json({ error: 'Erro ao atualizar cupom.' });
  }

  console.log(`[admin-coupon-update] id=${id} | admin=${admin.username}`);
  return res.status(200).json({ coupon: data });
};
