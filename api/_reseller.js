// ============================================================
// _reseller.js — Helpers de revendedor (uso interno do backend)
//
// Usado por create-pix-order.js e create-manual-order.js.
// Prefixo _ → não exposto como Vercel Function.
// ============================================================

'use strict';

/**
 * Busca o revendedor pelo código e valida que está aprovado.
 * Retorna { id, name, commission_percent } ou null se inválido/não encontrado.
 *
 * @param {import('@supabase/supabase-js').SupabaseClient} db
 * @param {string|null|undefined} rawCode — código vindo do frontend
 */
async function resolveReseller(db, rawCode) {
  if (!rawCode || typeof rawCode !== 'string') return null;
  const code = rawCode.trim().toLowerCase();
  if (!code) return null;

  const { data, error } = await db
    .from('reseller_applications')
    .select('id, name, commission_percent, status')
    .eq('reseller_code', code)
    .maybeSingle();

  if (error) {
    console.error('[reseller] resolveReseller DB error:', error.message);
    return null;
  }

  // Só aceita revendedores aprovados
  if (!data || data.status !== 'approved') return null;

  return {
    id:                 data.id,
    name:               data.name,
    commission_percent: Number(data.commission_percent) || 0,
  };
}

module.exports = { resolveReseller };
