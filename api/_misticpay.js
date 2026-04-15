// ============================================================
// _misticpay.js — Integração MisticPay (PIX)
//
// Env vars:
//   MISTICPAY_CLIENT_ID     — client ID da conta MisticPay
//   MISTICPAY_CLIENT_SECRET — client secret da conta MisticPay
// ============================================================

const BASE_URL = 'https://api.misticpay.com/api';

function authHeaders() {
  const ci = process.env.MISTICPAY_CLIENT_ID;
  const cs = process.env.MISTICPAY_CLIENT_SECRET;
  if (!ci || !cs) {
    throw new Error('MISTICPAY_CLIENT_ID ou MISTICPAY_CLIENT_SECRET não configurados.');
  }
  return { ci, cs };
}

async function mpPost(endpoint, body) {
  const res = await fetch(BASE_URL + endpoint, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body:    JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`MisticPay ${endpoint} → ${res.status}: ${text}`);
  }
  return res.json();
}

// ── Status mapping ────────────────────────────────────────────
// MisticPay transactionState values: PENDENTE | COMPLETO | FALHA | CANCELADO
function mapStatus(transactionState) {
  switch ((transactionState || '').toUpperCase()) {
    case 'COMPLETO':   return 'paid';
    case 'FALHA':      return 'failed';
    case 'CANCELADO':  return 'failed';
    case 'PENDENTE':   return 'pending';
    default:           return 'pending';
  }
}

// ── Exports ───────────────────────────────────────────────────

/**
 * Cria uma cobrança PIX na MisticPay.
 * @returns {{ transactionId, copyPaste, qrcodeUrl, qrCodeBase64 }}
 */
async function createPixCharge({ orderId, amount, name, cpf }) {
  const result = await mpPost('/transactions/create', {
    amount,                          // em reais (não centavos)
    payerName:     name,
    payerDocument: cpf,
    transactionId: orderId,          // nosso PD-YYYYMMDD-XXXX como referência
    description:   `KitsDigitalia ${orderId}`,
  });

  const data = result.data || result;

  // MisticPay retorna qrCodeBase64 com o prefixo "data:image/png;base64," já incluso.
  // O frontend acrescenta esse prefixo novamente, então removemos aqui.
  let qrCodeBase64 = data.qrCodeBase64 || '';
  if (qrCodeBase64.startsWith('data:')) {
    qrCodeBase64 = qrCodeBase64.replace(/^data:[^;]+;base64,/, '');
  }

  return {
    transactionId: String(data.transactionId || ''),
    copyPaste:     data.copyPaste   || '',
    qrcodeUrl:     data.qrcodeUrl   || '',
    qrCodeBase64,
  };
}

/**
 * Consulta o status de uma transação MisticPay.
 * @param {string} transactionId — ID retornado pela MisticPay na criação
 * @returns {{ raw: string, internalStatus: 'pending'|'paid'|'failed' }}
 */
async function getChargeStatus(transactionId) {
  const result = await mpPost('/transactions/check', { transactionId });
  const tx     = result.transaction || result.data || result;
  const raw    = tx.transactionState || '';
  return { raw, internalStatus: mapStatus(raw) };
}

module.exports = { createPixCharge, getChargeStatus };
