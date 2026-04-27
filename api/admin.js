// ============================================================
// /api/admin  — Roteador único para todas as operações admin
//
// Roteamento via ?action= (query string) ou body.action.
// Exemplos:
//   POST /api/admin?action=login          { username, password }
//   POST /api/admin?action=logout
//   GET  /api/admin?action=me
//   GET  /api/admin?action=getCoupons
//   POST /api/admin?action=createCoupon   { code, discount_percent, active? }
//   POST /api/admin?action=updateCoupon   { id, code?, discount_percent?, active? }
//   POST /api/admin?action=deleteCoupon   { id }
//   GET  /api/admin?action=getProducts
//   POST /api/admin?action=createProduct  { id, name, price, ... }
//   POST /api/admin?action=updateProduct  { id, name?, price?, ... }
//   GET  /api/admin?action=getResellers   [?status=new|contacted|approved|rejected]
//   POST /api/admin?action=updateReseller { id, status }
//
// Env vars:
//   ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_SESSION_SECRET
//   SUPABASE_URL, SUPABASE_SERVICE_KEY
//   ALLOWED_ORIGIN
// ============================================================

'use strict';

const { createHmac, timingSafeEqual } = require('crypto');
const { createClient }                = require('@supabase/supabase-js');
const {
  signToken,
  verifyToken,
  setSessionCookie,
  clearSessionCookie,
  setCorsHeaders,
  requireAdmin,
}                                     = require('./_admin-auth');
const { validateRequiredString }      = require('./_validate');
const { listAllProducts }             = require('./_products');

// ── Helpers ──────────────────────────────────────────────────────────────────

function getDb() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

function getAction(req) {
  return (req.query && req.query.action) || (req.body && req.body.action) || '';
}

// ── Actions ──────────────────────────────────────────────────────────────────

// POST ?action=login
async function actionLogin(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const sessionSecret = (process.env.ADMIN_SESSION_SECRET || '').trim();
  if (!sessionSecret || sessionSecret.length < 32) {
    console.error('[admin] ADMIN_SESSION_SECRET ausente ou muito curta. Login bloqueado.');
    return res.status(503).json({
      error: 'Configuração de segurança incompleta. Configure ADMIN_SESSION_SECRET com no mínimo 32 caracteres.',
    });
  }

  const expectedUser = (process.env.ADMIN_USERNAME || '').trim();
  const expectedPass = (process.env.ADMIN_PASSWORD || '').trim();

  if (!expectedUser || !expectedPass) {
    console.error('[admin] ADMIN_USERNAME ou ADMIN_PASSWORD não configurados.');
    return res.status(503).json({ error: 'Painel não configurado. Defina ADMIN_USERNAME e ADMIN_PASSWORD.' });
  }

  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuário e senha são obrigatórios.' });
  }

  function safeCompare(actual, expected) {
    const mac1 = createHmac('sha256', sessionSecret).update(String(actual)).digest();
    const mac2 = createHmac('sha256', sessionSecret).update(String(expected)).digest();
    return timingSafeEqual(mac1, mac2);
  }

  const userOk = safeCompare(username, expectedUser);
  const passOk = safeCompare(password, expectedPass);

  if (!userOk || !passOk) {
    console.warn(`[admin] login inválido | ip=${req.headers['x-forwarded-for'] || 'unknown'}`);
    await new Promise(r => setTimeout(r, 800));
    return res.status(401).json({ error: 'Credenciais inválidas.' });
  }

  const token = signToken(username);
  setSessionCookie(res, token);

  console.log(`[admin] login bem-sucedido | user=${username}`);
  return res.status(200).json({ success: true, username });
}

// POST ?action=logout
function actionLogout(req, res) {
  clearSessionCookie(res);
  return res.status(200).json({ success: true });
}

// GET ?action=me
function actionMe(req, res) {
  const admin = requireAdmin(req, res);
  if (!admin) return;
  return res.status(200).json({ authenticated: true, username: admin.username });
}

// ── Coupons ───────────────────────────────────────────────────────────────────

// GET ?action=getCoupons
async function actionGetCoupons(req, res) {
  const admin = requireAdmin(req, res);
  if (!admin) return;

  const db = getDb();
  const { data, error } = await db
    .from('coupons')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[admin] getCoupons:', error.message);
    return res.status(500).json({ error: 'Erro ao listar cupons.' });
  }
  return res.status(200).json({ coupons: data });
}

// POST ?action=createCoupon
async function actionCreateCoupon(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const admin = requireAdmin(req, res);
  if (!admin) return;

  const { code, discount_percent, active } = req.body || {};

  const codeErr = validateRequiredString(code, 'Código do cupom', 50);
  if (!codeErr.ok) return res.status(400).json({ error: codeErr.error });

  const pct = Number(discount_percent);
  if (!Number.isFinite(pct) || pct < 1 || pct > 90) {
    return res.status(400).json({ error: 'Desconto deve ser entre 1% e 90%.' });
  }

  const normalizedCode = code.trim().toUpperCase();
  const db = getDb();

  const { data, error } = await db
    .from('coupons')
    .insert({
      code:             normalizedCode,
      discount_percent: pct,
      active:           active !== false,
    })
    .select()
    .single();

  if (error) {
    const isDuplicate = error.code === '23505' || (error.message || '').includes('duplicate key');
    if (isDuplicate) return res.status(409).json({ error: `Cupom "${normalizedCode}" já existe.` });
    console.error('[admin] createCoupon:', error.message);
    return res.status(500).json({ error: 'Erro ao criar cupom.' });
  }

  console.log(`[admin] createCoupon | code=${normalizedCode} | pct=${pct} | admin=${admin.username}`);
  return res.status(201).json({ coupon: data });
}

// POST ?action=updateCoupon
async function actionUpdateCoupon(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const admin = requireAdmin(req, res);
  if (!admin) return;

  const { id, code, discount_percent, active } = req.body || {};
  if (!id) return res.status(400).json({ error: 'ID do cupom é obrigatório.' });

  const updates = {};
  if (code !== undefined) {
    if (typeof code !== 'string' || !code.trim()) {
      return res.status(400).json({ error: 'Código inválido.' });
    }
    updates.code = code.trim().toUpperCase();
  }
  if (discount_percent !== undefined) {
    const pct = Number(discount_percent);
    if (!Number.isFinite(pct) || pct < 1 || pct > 90) {
      return res.status(400).json({ error: 'Desconto deve ser entre 1% e 90%.' });
    }
    updates.discount_percent = pct;
  }
  if (active !== undefined) {
    updates.active = Boolean(active);
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'Nenhum campo para atualizar.' });
  }

  const db = getDb();
  const { data, error } = await db
    .from('coupons')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    const isDuplicate = error.code === '23505' || (error.message || '').includes('duplicate key');
    if (isDuplicate) return res.status(409).json({ error: `Código "${updates.code}" já está em uso.` });
    console.error('[admin] updateCoupon:', error.message);
    return res.status(500).json({ error: 'Erro ao atualizar cupom.' });
  }

  console.log(`[admin] updateCoupon | id=${id} | admin=${admin.username}`);
  return res.status(200).json({ coupon: data });
}

// POST ?action=deleteCoupon
async function actionDeleteCoupon(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const admin = requireAdmin(req, res);
  if (!admin) return;

  const { id } = req.body || {};
  if (!id) return res.status(400).json({ error: 'ID do cupom é obrigatório.' });

  const db = getDb();
  const { error } = await db.from('coupons').delete().eq('id', id);

  if (error) {
    console.error('[admin] deleteCoupon:', error.message);
    return res.status(500).json({ error: 'Erro ao excluir cupom.' });
  }

  console.log(`[admin] deleteCoupon | id=${id} | admin=${admin.username}`);
  return res.status(200).json({ success: true });
}

// ── Products ─────────────────────────────────────────────────────────────────

// GET ?action=getProducts
async function actionGetProducts(req, res) {
  const admin = requireAdmin(req, res);
  if (!admin) return;

  const products = await listAllProducts(getDb());
  return res.status(200).json({ products });
}

// POST ?action=createProduct
async function actionCreateProduct(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const admin = requireAdmin(req, res);
  if (!admin) return;

  const { id, name, description, price, currency, category, image_url, active } = req.body || {};

  if (!id || typeof id !== 'string' || !id.trim()) {
    return res.status(400).json({ error: 'ID do produto é obrigatório.' });
  }
  if (!name || typeof name !== 'string' || !name.trim()) {
    return res.status(400).json({ error: 'Nome do produto é obrigatório.' });
  }
  const priceNum = Number(price);
  if (!Number.isFinite(priceNum) || priceNum <= 0) {
    return res.status(400).json({ error: 'Preço inválido.' });
  }

  const row = {
    id:          id.trim().toLowerCase(),
    name:        name.trim().slice(0, 200),
    description: description ? String(description).trim().slice(0, 1000) : null,
    price:       priceNum,
    currency:    currency === 'BRL' ? 'BRL' : 'EUR',
    category:    category ? String(category).trim().slice(0, 50) : null,
    image_url:   image_url ? String(image_url).trim().slice(0, 500) : null,
    active:      active !== false,
  };

  const db = getDb();
  const { data, error } = await db
    .from('products')
    .upsert(row, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    console.error('[admin] createProduct:', error.message);
    return res.status(500).json({ error: 'Erro ao salvar produto.' });
  }

  console.log(`[admin] createProduct | id=${row.id} | admin=${admin.username}`);
  return res.status(200).json({ product: { ...data, source: 'db' } });
}

// POST ?action=updateProduct
async function actionUpdateProduct(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const admin = requireAdmin(req, res);
  if (!admin) return;

  const { id, name, description, price, currency, category, image_url, active } = req.body || {};
  if (!id) return res.status(400).json({ error: 'ID do produto é obrigatório.' });

  const updates = {};
  if (name !== undefined) {
    if (!name || !String(name).trim()) return res.status(400).json({ error: 'Nome inválido.' });
    updates.name = String(name).trim().slice(0, 200);
  }
  if (description !== undefined) {
    updates.description = description ? String(description).trim().slice(0, 1000) : null;
  }
  if (price !== undefined) {
    const p = Number(price);
    if (!Number.isFinite(p) || p <= 0) return res.status(400).json({ error: 'Preço inválido.' });
    updates.price = p;
  }
  if (currency !== undefined) {
    updates.currency = currency === 'BRL' ? 'BRL' : 'EUR';
  }
  if (category !== undefined) {
    updates.category = category ? String(category).trim().slice(0, 50) : null;
  }
  if (image_url !== undefined) {
    updates.image_url = image_url ? String(image_url).trim().slice(0, 500) : null;
  }
  if (active !== undefined) {
    updates.active = Boolean(active);
  }

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'Nenhum campo para atualizar.' });
  }

  const db = getDb();
  const { data, error } = await db
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return res.status(404).json({
        error: 'Produto não encontrado no banco. Use "Salvar no banco" primeiro para importá-lo.',
      });
    }
    console.error('[admin] updateProduct:', error.message);
    return res.status(500).json({ error: 'Erro ao atualizar produto.' });
  }

  console.log(`[admin] updateProduct | id=${id} | admin=${admin.username}`);
  return res.status(200).json({ product: { ...data, source: 'db' } });
}

// ── Resellers ─────────────────────────────────────────────────────────────────

// GET ?action=getResellers
async function actionGetResellers(req, res) {
  const admin = requireAdmin(req, res);
  if (!admin) return;

  const db = getDb();
  const statusFilter = req.query && req.query.status;

  let query = db
    .from('reseller_applications')
    .select('*')
    .order('created_at', { ascending: false });

  if (statusFilter && ['new', 'contacted', 'approved', 'rejected'].includes(statusFilter)) {
    query = query.eq('status', statusFilter);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[admin] getResellers:', error.message);
    return res.status(500).json({ error: 'Erro ao listar revendedores.' });
  }

  return res.status(200).json({ resellers: data });
}

// POST ?action=updateReseller
async function actionUpdateReseller(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const admin = requireAdmin(req, res);
  if (!admin) return;

  const VALID_STATUSES = ['new', 'contacted', 'approved', 'rejected'];
  const { id, status } = req.body || {};

  if (!id)     return res.status(400).json({ error: 'ID é obrigatório.' });
  if (!status) return res.status(400).json({ error: 'Status é obrigatório.' });
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status inválido. Use: ${VALID_STATUSES.join(', ')}.` });
  }

  const db = getDb();
  const { data, error } = await db
    .from('reseller_applications')
    .update({ status })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[admin] updateReseller:', error.message);
    return res.status(500).json({ error: 'Erro ao atualizar status.' });
  }

  console.log(`[admin] updateReseller | id=${id} | status=${status} | admin=${admin.username}`);
  return res.status(200).json({ reseller: data });
}

// ── Roteador principal ────────────────────────────────────────────────────────

const ACTION_MAP = {
  login:          actionLogin,
  logout:         actionLogout,
  me:             actionMe,
  getCoupons:     actionGetCoupons,
  createCoupon:   actionCreateCoupon,
  updateCoupon:   actionUpdateCoupon,
  deleteCoupon:   actionDeleteCoupon,
  getProducts:    actionGetProducts,
  createProduct:  actionCreateProduct,
  updateProduct:  actionUpdateProduct,
  getResellers:   actionGetResellers,
  updateReseller: actionUpdateReseller,
};

module.exports = async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const action = getAction(req);

  if (!action) {
    return res.status(400).json({ error: 'Parâmetro "action" obrigatório.' });
  }

  const fn = ACTION_MAP[action];
  if (!fn) {
    return res.status(400).json({ error: `Ação desconhecida: "${action}".` });
  }

  try {
    return await fn(req, res);
  } catch (err) {
    console.error(`[admin] unhandled error | action=${action} |`, err);
    return res.status(500).json({ error: 'Erro inesperado no servidor. Tente novamente.' });
  }
};
