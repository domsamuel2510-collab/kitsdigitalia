// ============================================================
// _admin-auth.js — Autenticação da área restrita
//
// Sessão baseada em cookie httpOnly com token HMAC-SHA256.
// Sem dependências externas — usa apenas Node.js built-in.
//
// Env vars necessárias:
//   ADMIN_USERNAME        — usuário admin (ex: admin)
//   ADMIN_PASSWORD        — senha admin (nunca commitada no repo)
//   ADMIN_SESSION_SECRET  — segredo para assinar tokens (min. 32 chars)
// ============================================================

'use strict';

const { createHmac, timingSafeEqual } = require('crypto');

const COOKIE_NAME    = 'kd_admin';
const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 horas

function getSecret() {
  const s = process.env.ADMIN_SESSION_SECRET || '';
  if (!s) console.warn('[_admin-auth] ADMIN_SESSION_SECRET não configurado. Use uma string aleatória longa.');
  return s || 'dev-secret-CHANGE-IN-PRODUCTION';
}

// ── Token ────────────────────────────────────────────────────────────────────

/**
 * Gera um token assinado para a sessão admin.
 * Formato (antes de base64url): "username:timestamp:hmac"
 */
function signToken(username) {
  const ts      = Date.now().toString();
  const payload = `${username}:${ts}`;
  const sig     = createHmac('sha256', getSecret()).update(payload).digest('hex');
  return Buffer.from(`${payload}:${sig}`).toString('base64url');
}

/**
 * Valida e decodifica um token. Retorna { username } ou null.
 */
function verifyToken(token) {
  try {
    const decoded      = Buffer.from(token, 'base64url').toString('utf8');
    const lastColon    = decoded.lastIndexOf(':');
    const secondLast   = decoded.lastIndexOf(':', lastColon - 1);
    if (secondLast < 0 || lastColon <= secondLast) return null;

    const username = decoded.slice(0, secondLast);
    const tsStr    = decoded.slice(secondLast + 1, lastColon);
    const sig      = decoded.slice(lastColon + 1);

    const ts = Number(tsStr);
    if (!Number.isFinite(ts) || Date.now() - ts > SESSION_TTL_MS) return null;

    const expected = createHmac('sha256', getSecret())
      .update(`${username}:${tsStr}`)
      .digest('hex');

    // Comparação em tempo constante para evitar timing attacks
    const expBuf = Buffer.from(expected, 'hex');
    const sigBuf = Buffer.from(sig,      'hex');
    if (expBuf.length !== sigBuf.length) return null;
    if (!timingSafeEqual(expBuf, sigBuf)) return null;

    return { username };
  } catch {
    return null;
  }
}

// ── Cookie ───────────────────────────────────────────────────────────────────

function getCookieToken(req) {
  const header = req.headers.cookie || '';
  const m      = header.match(/(?:^|;\s*)kd_admin=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

function setSessionCookie(res, token) {
  const maxAge = Math.floor(SESSION_TTL_MS / 1000);
  res.setHeader('Set-Cookie',
    `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}`
  );
}

function clearSessionCookie(res) {
  res.setHeader('Set-Cookie',
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0`
  );
}

// ── CORS para endpoints admin ─────────────────────────────────────────────────

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin',      process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods',     'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers',     'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}

// ── Middleware de proteção ────────────────────────────────────────────────────

/**
 * Verifica sessão admin. Envia 401 e retorna null se inválida.
 * Use no topo de todos os handlers admin:
 *   const admin = requireAdmin(req, res);
 *   if (!admin) return;
 */
function requireAdmin(req, res) {
  const token = getCookieToken(req);
  if (!token) {
    res.status(401).json({ error: 'Não autenticado.' });
    return null;
  }
  const payload = verifyToken(token);
  if (!payload) {
    res.status(401).json({ error: 'Sessão inválida ou expirada.' });
    return null;
  }
  return payload;
}

module.exports = {
  COOKIE_NAME,
  SESSION_TTL_MS,
  signToken,
  verifyToken,
  getCookieToken,
  setSessionCookie,
  clearSessionCookie,
  setCorsHeaders,
  requireAdmin,
};
