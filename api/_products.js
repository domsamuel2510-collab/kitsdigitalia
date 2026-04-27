// ============================================================
// _products.js — Lookup de produto: DB primeiro, _catalog.js como fallback
//
// Permite que o admin gerencie produtos via Supabase sem quebrar
// os produtos existentes definidos em _catalog.js.
// ============================================================

'use strict';

const { PRODUCT_CATALOG } = require('./_catalog');

/**
 * Busca um produto pelo ID.
 * Ordem: tabela `products` no Supabase → _catalog.js
 *
 * @param {object}  db        — cliente Supabase (service role)
 * @param {string}  productId
 * @returns {Promise<{ price: number, soldOut: boolean, name: string|null } | null>}
 */
async function lookupProduct(db, productId) {
  // Tenta banco de dados primeiro
  try {
    const { data, error } = await db
      .from('products')
      .select('price, active, name')
      .eq('id', productId)
      .maybeSingle();

    if (!error && data) {
      return {
        price:   Number(data.price),
        soldOut: !data.active,
        name:    data.name || null,
      };
    }
  } catch {
    // DB indisponível — cai no fallback
  }

  // Fallback: _catalog.js
  const item = PRODUCT_CATALOG[productId];
  if (!item) return null;
  return { price: item.price, soldOut: Boolean(item.soldOut), name: null };
}

/**
 * Lista todos os produtos (DB + catálogo local mesclados).
 * Produtos do DB têm prioridade sobre catálogo local.
 * Usado pelo painel admin.
 *
 * @param {object} db — cliente Supabase (service role)
 * @returns {Promise<Array>}
 */
async function listAllProducts(db) {
  let dbProducts = [];
  try {
    const { data } = await db
      .from('products')
      .select('id, name, description, price, currency, category, active, created_at, updated_at')
      .order('category', { ascending: true })
      .order('name',     { ascending: true });
    dbProducts = data || [];
  } catch {
    // DB indisponível
  }

  const dbIds = new Set(dbProducts.map(p => p.id));

  // Adiciona produtos do catálogo local que não estão no DB
  const catalogProducts = Object.entries(PRODUCT_CATALOG)
    .filter(([id]) => !dbIds.has(id))
    .map(([id, item]) => ({
      id,
      name:        id,         // nome display virá do frontend KD_PRODUCTS
      description: null,
      price:       item.price,
      currency:    'EUR',
      category:    null,
      active:      !item.soldOut,
      created_at:  null,
      updated_at:  null,
      source:      'catalog',  // indica origem
    }));

  return [
    ...dbProducts.map(p => ({ ...p, source: 'db' })),
    ...catalogProducts,
  ];
}

module.exports = { lookupProduct, listAllProducts };
