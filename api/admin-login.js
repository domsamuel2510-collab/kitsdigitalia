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

const { createHmac, timingSafeEqual } = require('crypto');
const {
  signToken,
  setSessionCookie,
  setCorsHeaders,
} = require('./_admin-auth');

module.exports = async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  // ── Verificação de configuração obrigatória ──────────────────────────────
  // ADMIN_SESSION_SECRET DEVE estar configurada. O fallback no helper é apenas
  // para não quebrar `verifyToken` em edge cases; aqui bloqueamos login explicitamente.
  const sessionSecret = (process.env.ADMIN_SESSION_SECRET || '').trim();
  if (!sessionSecret || sessionSecret.length < 32) {
    console.error('[admin-login] ADMIN_SESSION_SECRET ausente ou muito curta (mín. 32 chars). Login bloqueado.');
    return res.status(503).json({
      error: 'Configuração de segurança incompleta. Configure ADMIN_SESSION_SECRET com no mínimo 32 caracteres.',
    });
  }

  const expectedUser = (process.env.ADMIN_USERNAME || '').trim();
  const expectedPass = (process.env.ADMIN_PASSWORD || '').trim();

  if (!expectedUser || !expectedPass) {
    console.error('[admin-login] ADMIN_USERNAME ou ADMIN_PASSWORD não configurados.');
    return res.status(503).json({ error: 'Painel não configurado. Defina ADMIN_USERNAME e ADMIN_PASSWORD.' });
  }

  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
  }

  // ── Comparação em tempo constante (HMAC-based) ────────────────────────────
  // Usar HMAC garante que as saídas têm sempre o mesmo comprimento (32 bytes),
  // eliminando o timing leak que ocorre quando os buffers têm tamanhos diferentes.
  function safeCompare(actual, expected) {
    const mac1 = createHmac('sha256', sessionSecret).update(String(actual)).digest();
    const mac2 = createHmac('sha256', sessionSecret).update(String(expected)).digest();
    return timingSafeEqual(mac1, mac2); // sempre 32 bytes — sem timing leak por comprimento
  }

  const userOk = safeCompare(username, expectedUser);
  const passOk = safeCompare(password, expectedPass);

  if (!userOk || !passOk) {
    // Log sem revelar qual campo falhou
    console.warn(`[admin-login] tentativa inválida | ip=${req.headers['x-forwarded-for'] || 'unknown'}`);
    // Delay constante para dificultar brute-force
    await new Promise(r => setTimeout(r, 800));
    return res.status(401).json({ error: 'Credenciais inválidas.' });
  }

  const token = signToken(username);
  setSessionCookie(res, token);

  console.log(`[admin-login] login bem-sucedido | user=${username}`);
  return res.status(200).json({ success: true, username });
};
