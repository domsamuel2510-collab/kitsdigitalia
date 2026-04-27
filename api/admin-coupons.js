// ============================================================
// GET  /api/admin-coupons — Lista cupons
// POST /api/admin-coupons — Cria cupom
//
// Protegido por sessão admin (cookie kd_admin).
// ============================================================

'use strict';

const { createClient }              = require('@supabase/supabase-js');
const { requireAdmin, setCorsHeaders } = require('./_admin-auth');
const { validateRequiredString }    = require('./_validate');

function getDb() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

module.exports = async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const admin = requireAdmin(req, res);
  if (!admin) return;

  const db = getDb();

  // ── GET: lista cupons ───────────────────────────────────────────────────────
  if (req.method === 'GET') {
    const { data, error } = await db
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[admin-coupons] list:', error.message);
      return res.status(500).json({ error: 'Erro ao listar cupons.' });
    }
    return res.status(200).json({ coupons: data });
  }

  // ── POST: cria cupom ────────────────────────────────────────────────────────
  if (req.method === 'POST') {
    const { code, discount_percent, active } = req.body || {};

    const codeErr = validateRequiredString(code, 'Código do cupom', 50);
    if (!codeErr.ok) return res.status(400).json({ error: codeErr.error });

    const pct = Number(discount_percent);
    if (!Number.isFinite(pct) || pct < 1 || pct > 90) {
      return res.status(400).json({ error: 'Desconto deve ser entre 1% e 90%.' });
    }

    const normalizedCode = code.trim().toUpperCase();

    const { data, error } = await db
      .from('coupons')
      .insert({
        code:             normalizedCode,
        discount_percent: pct,
        active:           active !== false, // default true
      })
      .select()
      .single();

    if (error) {
      const isDuplicate = error.code === '23505' || (error.message || '').includes('duplicate key');
      if (isDuplicate) return res.status(409).json({ error: `Cupom "${normalizedCode}" já existe.` });
      console.error('[admin-coupons] insert:', error.message);
      return res.status(500).json({ error: 'Erro ao criar cupom.' });
    }

    console.log(`[admin-coupons] cupom criado | code=${normalizedCode} | pct=${pct} | admin=${admin.username}`);
    return res.status(201).json({ coupon: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
