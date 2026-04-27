// ============================================================
// _products.js — Lookup de produto: DB primeiro, _catalog.js como fallback
//
// status:
//   'active'   → disponível para compra
//   'sold_out' → visível no site, mas NÃO pode ser comprado
//   'inactive' → não aparece no site público
//
// soldOut (bool) = status !== 'active'  (cobertura de sold_out e inactive)
// ============================================================

'use strict';

const { PRODUCT_CATALOG } = require('./_catalog');

const VALID_STATUSES = ['active', 'sold_out', 'inactive'];

/**
 * Normaliza status a partir de campos DB.
 * Suporta período de transição antes/depois da migration 002.
 * @param {string|null} status  — coluna status (null se coluna ainda não existe)
 * @param {boolean}     active  — coluna active (fallback legado)
 */
function resolveStatus(status, active) {
  if (status && VALID_STATUSES.includes(status)) return status;
  return active ? 'active' : 'inactive';
}

/**
 * Busca um produto pelo ID.
 * Ordem: tabela `products` no Supabase → _catalog.js
 *
 * @param {object}  db        — cliente Supabase (service role)
 * @param {string}  productId
 * @returns {Promise<{ price: number, soldOut: boolean, status: string, name: string|null } | null>}
 */
async function lookupProduct(db, productId) {
  // Tenta banco de dados primeiro
  try {
    const { data, error } = await db
      .from('products')
      .select('price, status, active, name')
      .eq('id', productId)
      .maybeSingle();

    if (!error && data) {
      const status  = resolveStatus(data.status, data.active);
      return {
        price:   Number(data.price),
        soldOut: status !== 'active',
        status,
        name:    data.name || null,
      };
    }
  } catch {
    // DB indisponível — cai no fallback
  }

  // Fallback: _catalog.js
  const item = PRODUCT_CATALOG[productId];
  if (!item) return null;
  const status = item.soldOut ? 'sold_out' : 'active';
  return {
    price:   item.price,
    soldOut: Boolean(item.soldOut),
    status,
    name:    null,
  };
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
      .select('id, name, description, price, currency, category, status, active, created_at, updated_at')
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
      status:      item.soldOut ? 'sold_out' : 'active',
      active:      !item.soldOut,
      created_at:  null,
      updated_at:  null,
      source:      'catalog',
    }));

  return [
    ...dbProducts.map(p => ({
      ...p,
      // Normaliza status (suporte a período pré/pós migration 002)
      status: resolveStatus(p.status, p.active),
      source: 'db',
    })),
    ...catalogProducts,
  ];
}

module.exports = { lookupProduct, listAllProducts };
