// ============================================================
// POST /api/admin-logout
// Limpa o cookie de sessão admin.
// ============================================================

'use strict';

const { clearSessionCookie, setCorsHeaders } = require('./_admin-auth');

module.exports = async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  clearSessionCookie(res);
  return res.status(200).json({ success: true });
};
