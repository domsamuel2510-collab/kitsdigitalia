// ============================================================
// POST /api/admin-product-update
// Atualiza campos específicos de um produto no banco.
// Body: { id, name?, description?, price?, currency?, category?, image_url?, active? }
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

  const { id, name, description, price, currency, category, image_url, active } = req.body || {};

  if (!id) return res.status(400).json({ error: 'ID do produto é obrigatório.' });

  const updates = {};

  if (name !== undefined) {
    if (!name || !String(name).trim()) return res.status(400).json({ error: 'Nome inválido.' });
    updates.name = String(name).trim().slice(0, 200);
  }
  if (description !== undefined) {
    updates.description = description ? String(description).trim().slice(0, 1000) : null;
  }
  if (price !== undefined) {
    const p = Number(price);
    if (!Number.isFinite(p) || p <= 0) return res.status(400).json({ error: 'Preço inválido.' });
    updates.price = p;
  }
  if (currency !== undefined) {
    updates.currency = currency === 'BRL' ? 'BRL' : 'EUR';
  }
  if (category !== undefined) {
    updates.category = category ? String(category).trim().slice(0, 50) : null;
  }
  if (image_url !== undefined) {
    updates.image_url = image_url ? String(image_url).trim().slice(0, 500) : null;
  }
  if (active !== undefined) {
    updates.active = Boolean(active);
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'Nenhum campo para atualizar.' });
  }

  const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

  // Se produto não existe no DB ainda (vem do catálogo), deve criar primeiro
  const { data, error } = await db
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    // Produto pode não existir no DB — importar do catálogo antes de atualizar
    if (error.code === 'PGRST116') {
      return res.status(404).json({
        error: 'Produto não encontrado no banco. Use "Salvar no banco" primeiro para importá-lo.',
      });
    }
    console.error('[admin-product-update]', error.message);
    return res.status(500).json({ error: 'Erro ao atualizar produto.' });
  }

  console.log(`[admin-product-update] id=${id} | admin=${admin.username}`);
  return res.status(200).json({ product: { ...data, source: 'db' } });
};
