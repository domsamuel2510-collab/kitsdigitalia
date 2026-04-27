// ============================================================
// POST /api/reseller-application  — Endpoint PÚBLICO
//
// Registra cadastro de revendedor no Supabase e envia email ao dono.
//
// Env vars:
//   SUPABASE_URL, SUPABASE_SERVICE_KEY
//   ADMIN_NOTIFICATION_EMAIL — destinatário do email de notificação
//   RESEND_API_KEY | SMTP_HOST — provedor de email
// ============================================================

'use strict';

const { createClient }  = require('@supabase/supabase-js');
const { sendEmail }     = require('./_email');
const {
  validateEmail,
  validateRequiredString,
  firstError,
}                       = require('./_validate');

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin',  process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async function handler(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, email, whatsapp, country, message } = req.body || {};

    // Validação
    const inputError = firstError(
      validateRequiredString(name,     'Nome',      200),
      validateEmail(email),
      validateRequiredString(whatsapp, 'WhatsApp',   50),
      validateRequiredString(country,  'País',       100),
    );
    if (inputError) return res.status(400).json({ error: inputError });

    const sanitizedMessage = message ? String(message).trim().slice(0, 2000) : null;

    // Salva no Supabase
    const db = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
    const { data, error: dbErr } = await db
      .from('reseller_applications')
      .insert({
        name:     name.trim(),
        email:    email.trim().toLowerCase(),
        whatsapp: whatsapp.trim(),
        country:  country.trim(),
        message:  sanitizedMessage,
        status:   'new',
      })
      .select('id, created_at')
      .single();

    if (dbErr) {
      console.error('[reseller-application] DB:', dbErr.message);
      return res.status(500).json({ error: 'Erro ao registrar cadastro. Tente novamente.' });
    }

    console.log(`[reseller-application] novo cadastro | id=${data.id} | email=${email.trim().toLowerCase()}`);

    // Email de notificação (fire-and-forget)
    const notifyEmail = (process.env.ADMIN_NOTIFICATION_EMAIL || 'pedidos@kitsdigitalia.com').trim();
    sendEmail({
      to:      notifyEmail,
      subject: `Novo cadastro de revendedor — ${name.trim()}`,
      text: [
        'Novo cadastro de revendedor recebido:',
        '',
        `ID:        ${data.id}`,
        `Nome:      ${name.trim()}`,
        `Email:     ${email.trim().toLowerCase()}`,
        `WhatsApp:  ${whatsapp.trim()}`,
        `País:      ${country.trim()}`,
        `Mensagem:  ${sanitizedMessage || '—'}`,
        `Data:      ${new Date(data.created_at).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`,
      ].join('\n'),
    }).catch(err => console.error(`[reseller-application] email error | id=${data.id} | ${err.message}`));

    return res.status(201).json({
      success: true,
      message: 'Cadastro recebido! Entraremos em contato em breve.',
    });

  } catch (err) {
    console.error('[reseller-application] unhandled:', err);
    return res.status(500).json({ error: 'Erro inesperado. Tente novamente.' });
  }
};
