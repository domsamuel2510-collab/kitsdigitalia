// ============================================================
// _order-id.js — Geração de order_id + retry de insert
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
  const rand = randomBytes(3).toString('hex'); // 3 bytes → 6 hex → 16 777 216 valores/dia
  return `PD-${date}-${rand}`;
}

/**
 * Insere uma linha em `orders` com retry automático em colisão de order_id.
 *
 * Gera um novo order_id a cada tentativa. Só re-tenta quando o erro
 * for de unique constraint (código Postgres 23505 ou mensagem "duplicate key").
 * Qualquer outro erro (FK, schema, conexão) é propagado imediatamente.
 *
 * @param {object}   db           — cliente Supabase (service role)
 * @param {Function} buildRow     — recebe orderId:string, retorna objeto a inserir
 * @param {number}   [maxAttempts=3]
 * @returns {Promise<{ orderId: string, error: null } | { orderId: null, error: object }>}
 */
async function insertOrderWithRetry(db, buildRow, maxAttempts = 3) {
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const orderId = generateOrderId();
    const row     = buildRow(orderId);

    const { error } = await db.from('orders').insert(row);

    if (!error) return { orderId, error: null };

    const isDuplicate =
      error.code === '23505' ||
      (typeof error.message === 'string' && error.message.includes('duplicate key'));

    if (!isDuplicate) return { orderId: null, error }; // erro não recuperável — propaga

    lastError = error;
    console.warn(`[insertOrderWithRetry] colisão order_id=${orderId} (tentativa ${attempt}/${maxAttempts})`);
  }

  // Esgotou tentativas — muito improvável com espaço de 16M valores/dia
  return { orderId: null, error: lastError };
}

module.exports = { generateOrderId, insertOrderWithRetry };
