// ============================================================
// GET  /api/admin-products — Lista produtos (DB + catálogo)
// POST /api/admin-products — Cria/salva produto no banco
//
// Protegido por sessão admin.
// ============================================================

'use strict';

const { createClient }                 = require('@supabase/supabase-js');
const { requireAdmin, setCorsHeaders } = require('./_admin-auth');
const { listAllProducts }              = require('./_products');

function getDb() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

module.exports = async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const admin = requireAdmin(req, res);
  if (!admin) return;

  const db = getDb();

  // ── GET ─────────────────────────────────────────────────────────────────────
  if (req.method === 'GET') {
    const products = await listAllProducts(db);
    return res.status(200).json({ products });
  }

  // ── POST: cria / atualiza produto no banco ───────────────────────────────────
  if (req.method === 'POST') {
    const { id, name, description, price, currency, category, image_url, active } = req.body || {};

    if (!id || typeof id !== 'string' || !id.trim()) {
      return res.status(400).json({ error: 'ID do produto é obrigatório.' });
    }
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Nome do produto é obrigatório.' });
    }
    const priceNum = Number(price);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      return res.status(400).json({ error: 'Preço inválido.' });
    }

    const row = {
      id:          id.trim().toLowerCase(),
      name:        name.trim().slice(0, 200),
      description: description ? String(description).trim().slice(0, 1000) : null,
      price:       priceNum,
      currency:    currency === 'BRL' ? 'BRL' : 'EUR',
      category:    category ? String(category).trim().slice(0, 50) : null,
      image_url:   image_url ? String(image_url).trim().slice(0, 500) : null,
      active:      active !== false,
    };

    // Upsert: insere se não existe, atualiza se já existe
    const { data, error } = await db
      .from('products')
      .upsert(row, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('[admin-products] upsert:', error.message);
      return res.status(500).json({ error: 'Erro ao salvar produto.' });
    }

    console.log(`[admin-products] produto salvo | id=${row.id} | admin=${admin.username}`);
    return res.status(200).json({ product: { ...data, source: 'db' } });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
