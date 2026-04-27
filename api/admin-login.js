// ============================================================
// POST /api/admin-login
//
// Valida credenciais admin e define cookie de sessão httpOnly.
//
// Env vars obrigatórias:
//   ADMIN_USERNAME       — usuário admin
//   ADMIN_PASSWORD       — senha admin (nunca commitada)
//   ADMIN_SESSION_SECRET — segredo HMAC (min. 32 chars recomendado)
// ============================================================

'use strict';

const { timingSafeEqual } = require('crypto');
const {
  signToken,
  setSessionCookie,
  setCorsHeaders,
} = require('./_admin-auth');

module.exports = async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
  }

  const expectedUser = process.env.ADMIN_USERNAME || '';
  const expectedPass = process.env.ADMIN_PASSWORD || '';

  if (!expectedUser || !expectedPass) {
    console.error('[admin-login] ADMIN_USERNAME ou ADMIN_PASSWORD não configurados.');
    return res.status(503).json({ error: 'Painel não configurado. Defina as variáveis de ambiente admin.' });
  }

  // Comparação em tempo constante para evitar timing attacks
  function safeCompare(a, b) {
    const bufA = Buffer.from(String(a));
    const bufB = Buffer.from(String(b));
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  }

  const userOk = safeCompare(username, expectedUser);
  const passOk = safeCompare(password, expectedPass);

  if (!userOk || !passOk) {
    // Log sem revelar qual campo falhou
    console.warn(`[admin-login] tentativa inválida | ip=${req.headers['x-forwarded-for'] || 'unknown'}`);
    // Delay leve para dificultar brute-force (fire-and-forget não precisa de setTimeout async)
    await new Promise(r => setTimeout(r, 800));
    return res.status(401).json({ error: 'Credenciais inválidas.' });
  }

  const token = signToken(username);
  setSessionCookie(res, token);

  console.log(`[admin-login] login bem-sucedido | user=${username}`);
  return res.status(200).json({ success: true, username });
};
