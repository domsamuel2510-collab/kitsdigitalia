// ============================================================
// GET /api/admin-me
// Verifica sessão admin. Retorna 200 + username se válido, 401 caso contrário.
// ============================================================

'use strict';

const { requireAdmin, setCorsHeaders } = require('./_admin-auth');

module.exports = async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const admin = requireAdmin(req, res);
  if (!admin) return;

  return res.status(200).json({ authenticated: true, username: admin.username });
};
