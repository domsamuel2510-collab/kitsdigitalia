// ============================================================
// _email.js — Helper de envio de email
//
// Estratégia:
//   1. RESEND_API_KEY definida → Resend (sem dependência extra, usa fetch)
//   2. SMTP_HOST definido → nodemailer (já instalado)
//   3. Nenhum → loga aviso, não falha
//
// Env vars:
//   RESEND_API_KEY          — chave Resend (https://resend.com)
//   FROM_EMAIL              — remetente (ex: no-reply@kitsdigitalia.com)
//   ADMIN_NOTIFICATION_EMAIL — destinatário para notificações admin
//   SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS — fallback SMTP
// ============================================================

'use strict';

/**
 * Envia um email transacional.
 * @param {{ to: string, subject: string, text: string, html?: string }} opts
 */
async function sendEmail({ to, subject, text, html }) {
  const resendKey = (process.env.RESEND_API_KEY || '').trim();
  const fromEmail = (process.env.FROM_EMAIL || process.env.SMTP_USER || 'no-reply@kitsdigitalia.com').trim();

  // ── 1. Resend ──────────────────────────────────────────────────────────────
  if (resendKey) {
    const resp = await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type':  'application/json',
      },
      body: JSON.stringify({
        from:    `KitsDigitalia <${fromEmail}>`,
        to:      [to],
        subject,
        text,
        html:    html || undefined,
      }),
    });

    if (!resp.ok) {
      const body = await resp.text().catch(() => '');
      throw new Error(`Resend HTTP ${resp.status}: ${body}`);
    }
    return;
  }

  // ── 2. Nodemailer (SMTP) ───────────────────────────────────────────────────
  const smtpHost = (process.env.SMTP_HOST || '').trim();
  if (smtpHost) {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host:   smtpHost,
      port:   Number(process.env.SMTP_PORT) || 465,
      secure: (Number(process.env.SMTP_PORT) || 465) === 465,
      auth:   { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await transporter.sendMail({
      from:    `"KitsDigitalia" <${fromEmail}>`,
      to,
      subject,
      text,
      html:    html || undefined,
    });
    return;
  }

  // ── 3. Sem provedor configurado ─────────────────────────────────────────────
  console.warn(`[_email] Nenhum provedor de email configurado. Email não enviado. Para: ${to} | Assunto: ${subject}`);
}

module.exports = { sendEmail };
