// ============================================================
//  KitsDigitalia — Google Apps Script
//  Cole tudo isso em Extensions > Apps Script do seu Sheets
// ============================================================

// ---------- CONFIGURAÇÕES ----------
const SHEET_NAME = 'CLIENTES';
const EMAIL_ALERTA = Session.getActiveUser().getEmail(); // email do dono da planilha

// Índices das colunas (base 1)
const COL = {
  ID:               1,  // A
  NOME:             2,  // B
  EMAIL:            3,  // C
  WHATSAPP:         4,  // D
  PRODUTO:          5,  // E
  DATA_COMPRA:      6,  // F
  DATA_VENCIMENTO:  7,  // G
  DIAS_RESTANTES:   8,  // H
  STATUS:           9,  // I
  STATUS_COBRANCA:  10, // J
  ULTIMO_AVISO:     11, // K
  RENOVADO_EM:      12, // L
  MSG_CONFIRMACAO:  13, // M
  OBSERVACOES:      14, // N
};

// ============================================================
//  MENU PERSONALIZADO
// ============================================================
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚙️ KitsDigitalia')
    .addItem('🔄 Atualizar todos os status', 'atualizarTodosStatus')
    .addItem('📧 Enviar alerta agora', 'enviarAlertaDiario')
    .addItem('✅ Renovar cliente selecionado', 'renovarClienteSelecionado')
    .addToUi();
}

// ============================================================
//  HELPERS DE DATA
// ============================================================

/** Retorna Date zerado no horário (meia-noite local) */
function hoje() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Adiciona N dias a uma Date e retorna nova Date */
function addDias(data, n) {
  const d = new Date(data);
  d.setDate(d.getDate() + n);
  return d;
}

/** Diferença em dias inteiros entre duas datas (b - a) */
function diffDias(a, b) {
  const msPerDay = 1000 * 60 * 60 * 24;
  const da = new Date(a); da.setHours(0,0,0,0);
  const db = new Date(b); db.setHours(0,0,0,0);
  return Math.round((db - da) / msPerDay);
}

/** Formata Date para DD/MM/AAAA */
function fmt(data) {
  if (!data || !(data instanceof Date) || isNaN(data)) return '';
  const d = String(data.getDate()).padStart(2, '0');
  const m = String(data.getMonth() + 1).padStart(2, '0');
  const a = data.getFullYear();
  return `${d}/${m}/${a}`;
}

/** Converte valor de célula (Date ou string DD/MM/AAAA) para Date, ou null */
function toDate(val) {
  if (!val) return null;
  if (val instanceof Date && !isNaN(val)) return val;
  if (typeof val === 'string' && val.includes('/')) {
    const [d, m, a] = val.split('/');
    return new Date(Number(a), Number(m) - 1, Number(d));
  }
  return null;
}

// ============================================================
//  STATUS AUTOMÁTICO
// ============================================================
function calcularStatus(diasRestantes, renovadoEm) {
  if (renovadoEm && toDate(renovadoEm)) return '🔵 Renovado';
  if (diasRestantes > 2)  return '🟢 Ativo';
  if (diasRestantes === 2) return '🟡 Vence em 2 dias';
  if (diasRestantes === 1) return '🟡 Vence amanhã';
  if (diasRestantes === 0) return '🟠 Vence hoje';
  return '🔴 Vencido';
}

// ============================================================
//  MENSAGEM DE CONFIRMAÇÃO
// ============================================================
function gerarMsgConfirmacao(nome, produto, email, dataCompra, dataVencimento) {
  return `✅ Acesso renovado com sucesso!\n\nOlá, ${nome}!\nProduto: ${produto}\nEmail: ${email}\nNova vigência: ${fmt(dataCompra)} até ${fmt(dataVencimento)}\n\nQualquer dúvida é só chamar. 😊`;
}

// ============================================================
//  1. ATUALIZAR TODOS OS STATUS
// ============================================================
function atualizarTodosStatus() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) return; // sem dados

  const hoje_ = hoje();

  // Lê bloco inteiro de uma vez (mais rápido que getCell por célula)
  const range  = sheet.getRange(2, 1, lastRow - 1, COL.OBSERVACOES);
  const values = range.getValues();

  for (let i = 0; i < values.length; i++) {
    const row = values[i];

    const dataCompra     = toDate(row[COL.DATA_COMPRA - 1]);
    const renovadoEm     = toDate(row[COL.RENOVADO_EM - 1]);
    const ultimoAvisoVal = toDate(row[COL.ULTIMO_AVISO - 1]);

    if (!dataCompra) continue; // linha sem data de compra → ignora

    // Recalcula vencimento e dias restantes
    const dataVenc    = renovadoEm ? addDias(renovadoEm, 30) : addDias(dataCompra, 30);
    const diasRest    = diffDias(hoje_, dataVenc);
    const status      = calcularStatus(diasRest, renovadoEm);

    row[COL.DATA_VENCIMENTO - 1] = dataVenc;
    row[COL.DIAS_RESTANTES  - 1] = diasRest;
    row[COL.STATUS          - 1] = status;

    // Marca ultimo_aviso se vence em ≤ 2 dias e ainda não avisou hoje
    if (!renovadoEm && diasRest <= 2) {
      const precisaMarcar = !ultimoAvisoVal ||
        diffDias(ultimoAvisoVal, hoje_) > 1;

      if (precisaMarcar) {
        row[COL.ULTIMO_AVISO - 1] = hoje_;
      }
    }

    values[i] = row;
  }

  range.setValues(values);
  SpreadsheetApp.getActiveSpreadsheet().toast('Status atualizados!', '⚙️ KitsDigitalia', 3);
}

// ============================================================
//  2. ENVIAR ALERTA DIÁRIO
// ============================================================
function enviarAlertaDiario() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) return;

  const values = sheet.getRange(2, 1, lastRow - 1, COL.OBSERVACOES).getValues();

  const em2dias  = [];
  const hoje_    = [];
  const vencidos = [];

  for (const row of values) {
    const nome     = row[COL.NOME            - 1];
    const wpp      = row[COL.WHATSAPP        - 1];
    const produto  = row[COL.PRODUTO         - 1];
    const dias     = Number(row[COL.DIAS_RESTANTES - 1]);
    const dataVenc = toDate(row[COL.DATA_VENCIMENTO - 1]);
    const renovado = toDate(row[COL.RENOVADO_EM - 1]);

    if (!nome || renovado) continue; // pula linhas vazias ou já renovadas

    const linha = `- ${nome} | ${wpp} | ${produto} | vence ${fmt(dataVenc)}`;

    if (dias === 2)       em2dias.push(linha);
    else if (dias === 0)  hoje_.push(`- ${nome} | ${wpp} | ${produto}`);
    else if (dias < 0)    vencidos.push(linha);
  }

  if (!em2dias.length && !hoje_.length && !vencidos.length) return; // nada a reportar

  const dataHoje = fmt(new Date());
  let corpo = '';

  if (em2dias.length) {
    corpo += `🟡 VENCEM EM 2 DIAS:\n${em2dias.join('\n')}\n\n`;
  }
  if (hoje_.length) {
    corpo += `🟠 VENCEM HOJE:\n${hoje_.join('\n')}\n\n`;
  }
  if (vencidos.length) {
    corpo += `🔴 VENCIDOS:\n${vencidos.join('\n')}\n\n`;
  }

  GmailApp.sendEmail(
    EMAIL_ALERTA,
    `⚠️ Clientes para renovar hoje — ${dataHoje}`,
    corpo.trim()
  );

  SpreadsheetApp.getActiveSpreadsheet().toast('Alerta enviado para ' + EMAIL_ALERTA, '📧', 4);
}

// ============================================================
//  3. RENOVAR CLIENTE (por número de linha real no sheet)
// ============================================================
function renovarCliente(linhaSheet) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const hoje_ = hoje();

  const nome    = sheet.getRange(linhaSheet, COL.NOME).getValue();
  const produto = sheet.getRange(linhaSheet, COL.PRODUTO).getValue();
  const email   = sheet.getRange(linhaSheet, COL.EMAIL).getValue();
  const dataCompra = toDate(sheet.getRange(linhaSheet, COL.DATA_COMPRA).getValue()) || hoje_;

  const novaVenc = addDias(hoje_, 30);
  const msg      = gerarMsgConfirmacao(nome, produto, email, hoje_, novaVenc);

  sheet.getRange(linhaSheet, COL.RENOVADO_EM).setValue(hoje_);
  sheet.getRange(linhaSheet, COL.DATA_VENCIMENTO).setValue(novaVenc);
  sheet.getRange(linhaSheet, COL.DIAS_RESTANTES).setValue(30);
  sheet.getRange(linhaSheet, COL.STATUS).setValue('🔵 Renovado');
  sheet.getRange(linhaSheet, COL.ULTIMO_AVISO).clearContent();
  sheet.getRange(linhaSheet, COL.STATUS_COBRANCA).clearContent();
  sheet.getRange(linhaSheet, COL.MSG_CONFIRMACAO).setValue(msg);

  SpreadsheetApp.getActiveSpreadsheet().toast(`${nome} renovado até ${fmt(novaVenc)}`, '✅', 5);
}

// ============================================================
//  3b. RENOVAR CLIENTE SELECIONADO (chamado pelo menu)
// ============================================================
function renovarClienteSelecionado() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const linha = sheet.getActiveCell().getRow();

  if (linha < 2) {
    SpreadsheetApp.getUi().alert('Selecione uma célula na linha do cliente (linha 2 em diante).');
    return;
  }

  const nome = sheet.getRange(linha, COL.NOME).getValue();
  if (!nome) {
    SpreadsheetApp.getUi().alert('Linha vazia. Selecione a linha do cliente.');
    return;
  }

  const ui = SpreadsheetApp.getUi();
  const resp = ui.alert(
    '✅ Confirmar renovação',
    `Renovar ${nome}? Vai atualizar datas e gerar nova mensagem de confirmação.`,
    ui.ButtonSet.YES_NO
  );

  if (resp === ui.Button.YES) {
    renovarCliente(linha);
  }
}

// ============================================================
//  4. ON FORM SUBMIT
//  Trigger: spreadsheet → on form submit
//  O Forms grava em 'Respostas ao formulário 1'; este handler
//  lê via e.namedValues (robusto a reordenação de perguntas)
//  e grava a linha estruturada na aba CLIENTES.
// ============================================================
function onFormSubmit(e) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);

  // e.namedValues = { "Título da pergunta": ["valor"], ... }
  // Usa os títulos exatos configurados no Form.
  const nv = e.namedValues;

  const nome      = (nv['Nome completo']       || [''])[0].trim();
  const emailForm = (nv['E-mail']               || [''])[0].trim();
  const whatsapp  = (nv['WhatsApp com DDD']     || [''])[0].trim();
  const produto   = (nv['Produto']              || [''])[0].trim();
  const obs       = (nv['Observações']          || [''])[0].trim();

  if (!nome) return; // resposta vazia / linha fantasma

  const hoje_    = hoje();
  const dataVenc = addDias(hoje_, 30);

  // ID sequencial: maior ID existente + 1
  const lastRow = sheet.getLastRow();
  let novoId = 1;
  if (lastRow >= 2) {
    const idsExist = sheet.getRange(2, COL.ID, lastRow - 1, 1).getValues()
      .map(r => Number(r[0]) || 0);
    novoId = Math.max(...idsExist) + 1;
  }

  const msg = gerarMsgConfirmacao(nome, produto, emailForm, hoje_, dataVenc);

  const novaLinha = new Array(COL.OBSERVACOES).fill('');
  novaLinha[COL.ID              - 1] = novoId;
  novaLinha[COL.NOME            - 1] = nome;
  novaLinha[COL.EMAIL           - 1] = emailForm;
  novaLinha[COL.WHATSAPP        - 1] = whatsapp;
  novaLinha[COL.PRODUTO         - 1] = produto;
  novaLinha[COL.DATA_COMPRA     - 1] = hoje_;
  novaLinha[COL.DATA_VENCIMENTO - 1] = dataVenc;
  novaLinha[COL.DIAS_RESTANTES  - 1] = 30;
  novaLinha[COL.STATUS          - 1] = '🟢 Ativo';
  novaLinha[COL.MSG_CONFIRMACAO - 1] = msg;
  novaLinha[COL.OBSERVACOES     - 1] = obs;

  sheet.appendRow(novaLinha);
}

// Função auxiliar para testar onFormSubmit manualmente no editor
function testarFormSubmit() {
  onFormSubmit({
    namedValues: {
      'Nome completo':   ['Teste Silva'],
      'E-mail':          ['teste@email.com'],
      'WhatsApp com DDD':['11999990000'],
      'Produto':         ['ChatGPT Plus'],
      'Observações':     ['Teste manual'],
    }
  });
}

// ============================================================
//  5. TRIGGER DIÁRIO — instalar com installTriggers()
// ============================================================
function rotinaDiaria() {
  atualizarTodosStatus();
  enviarAlertaDiario();
}

/**
 * Execute esta função UMA VEZ manualmente (Run > installTriggers)
 * para registrar o trigger diário às 8h.
 * Não precisa executar de novo depois.
 */
function installTriggers() {
  // Remove triggers duplicados antes de criar
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === 'rotinaDiaria') {
      ScriptApp.deleteTrigger(t);
    }
  });

  ScriptApp.newTrigger('rotinaDiaria')
    .timeBased()
    .everyDays(1)
    .atHour(8)
    .create();

  SpreadsheetApp.getActiveSpreadsheet()
    .toast('Trigger diário às 8h instalado!', '⏰', 4);
}
