// ============================================================
// _validate.js — Helpers de validação de input (server-side)
//
// Sem dependências externas. Usado por create-pix-order.js
// e create-manual-order.js.
// ============================================================

'use strict';

// RFC 5322 simplificado — suficiente para detectar lixo óbvio
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Valida formato e comprimento de email.
 * @param {unknown} value
 * @returns {{ ok: boolean, error?: string }}
 */
function validateEmail(value) {
  if (!value || typeof value !== 'string') {
    return { ok: false, error: 'Email obrigatório.' };
  }
  const s = value.trim();
  if (s.length > 254)       return { ok: false, error: 'Email muito longo (máx. 254 chars).' };
  if (!EMAIL_RE.test(s))    return { ok: false, error: 'Formato de email inválido.' };
  return { ok: true };
}

/**
 * Valida string obrigatória com comprimento máximo.
 * @param {unknown} value
 * @param {string}  label    — nome do campo (para a mensagem de erro)
 * @param {number}  [max=300]
 * @returns {{ ok: boolean, error?: string }}
 */
function validateRequiredString(value, label, max = 300) {
  if (!value || typeof value !== 'string' || !value.trim()) {
    return { ok: false, error: `${label} é obrigatório.` };
  }
  if (value.trim().length > max) {
    return { ok: false, error: `${label} muito longo (máx. ${max} caracteres).` };
  }
  return { ok: true };
}

/**
 * Executa uma lista de validações e retorna o primeiro erro encontrado.
 * @param  {...{ ok: boolean, error?: string }} checks
 * @returns {string|null} — mensagem de erro, ou null se tudo ok
 */
function firstError(...checks) {
  for (const check of checks) {
    if (!check.ok) return check.error;
  }
  return null;
}

module.exports = { validateEmail, validateRequiredString, firstError };
