// ============================================================
// _order-id.js — Geração de order_id compartilhada
//
// Formato: PD-YYYYMMDD-xxxxxx
//   - data UTC do pedido
//   - 6 hex chars via crypto.randomBytes → 16.777.216 valores/dia
//
// Requer Node.js 18+ (nativo no projeto — ver package.json "engines").
// Sem dependências externas.
// ============================================================

'use strict';

const { randomBytes } = require('crypto');

/**
 * Gera um order ID único no formato PD-YYYYMMDD-xxxxxx.
 * @returns {string}  ex: "PD-20260427-a3f7b2"
 */
function generateOrderId() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const rand = randomBytes(3).toString('hex'); // 3 bytes → 6 hex → 16 777 216 valores
  return `PD-${date}-${rand}`;
}

module.exports = { generateOrderId };
