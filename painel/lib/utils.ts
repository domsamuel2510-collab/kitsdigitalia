import type { Status, Cliente } from '@/types/cliente';

export const PLANOS: { value: string; label: string; dias: number }[] = [
  { value: 'mensal',     label: 'Mensal (30 dias)',     dias: 30  },
  { value: 'trimestral', label: 'Trimestral (90 dias)', dias: 90  },
  { value: 'semestral',  label: 'Semestral (180 dias)', dias: 180 },
  { value: 'anual',      label: 'Anual (365 dias)',     dias: 365 },
];

export function diasDoPlano(plano: string): number {
  return PLANOS.find(p => p.value === plano)?.dias ?? 30;
}

export const PRODUTOS = [
  'ChatGPT Pro',
  'Claude',
  'Perplexity',
  'Canva Pro',
  'Netflix Premium',
  'YouTube Premium',
  'Spotify Premium',
];

export function hoje(): string {
  return new Date().toISOString().split('T')[0];
}

export function addDias(isoDate: string, dias: number): string {
  const d = new Date(isoDate + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + dias);
  return d.toISOString().split('T')[0];
}

export function diffDias(isoDate: string): number {
  const agora = new Date(); agora.setHours(0,0,0,0);
  const alvo  = new Date(isoDate + 'T00:00:00');
  return Math.round((alvo.getTime() - agora.getTime()) / 86_400_000);
}

export function diasSemContato(ultimaTentativa: string | null): number {
  if (!ultimaTentativa) return 999;
  return diffDias(ultimaTentativa) * -1; // negativo = passou
}

export function calcularStatus(diasRestantes: number, renovadoEm: string | null): Status {
  if (renovadoEm)           return 'renovado';
  if (diasRestantes > 2)    return 'ativo';
  if (diasRestantes >= 1)   return 'vence_em_breve'; // 1 ou 2 dias
  if (diasRestantes === 0)  return 'vence_hoje';
  return 'vencido';                                   // < 0
}

/**
 * Recalcula dias_restantes e status no frontend para todos os clientes.
 * Garante que a contagem seja baseada em new Date() (hoje), independente
 * do valor armazenado no Supabase, que pode estar desatualizado se a
 * função SQL atualizar_status_todos() não tiver rodado.
 *
 * - Preserva 'reabordagem': status manual definido pelo usuário
 * - Usa T00:00:00 no parse de datas para evitar offset de fuso horário
 */
export function normalizarClientes(clientes: Cliente[]): Cliente[] {
  const agora = new Date();
  agora.setHours(0, 0, 0, 0);

  return clientes.map(c => {
    // Reabordagem é manual — nunca sobrescrever
    if (c.status === 'reabordagem') return c;

    const venc = new Date(c.data_vencimento + 'T00:00:00');
    const diasRestantes = isNaN(venc.getTime())
      ? c.dias_restantes                              // fallback se data inválida
      : Math.round((venc.getTime() - agora.getTime()) / 86_400_000);
    const status = calcularStatus(diasRestantes, c.renovado_em);

    return { ...c, dias_restantes: diasRestantes, status };
  });
}

export function fmtData(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export function whatsappLink(numero: string): string {
  const limpo = numero.replace(/\D/g, '');
  return `https://wa.me/${limpo}`;
}

// ---- Mensagens de confirmação ----

export function gerarMsgConfirmacao(
  nome: string,
  produto: string,
  email: string,
  whatsapp: string,
  dataCompra: string,
  dataVencimento: string,
): string {
  return `Olá, ${nome}! Tudo bem? 😊\n\n✅ Seu acesso ao ${produto} foi ativado com sucesso!\n\n📅 Data de início: ${fmtData(dataCompra)}\n⏳ Válido até: ${fmtData(dataVencimento)}\n✉️ Email cadastrado: ${email}\n\nQualquer dúvida é só chamar. Aproveite! 🚀`;
}

// ---- Mensagens de cobrança (contextuais) ----

export function gerarMsgCobranca(
  nome: string,
  produto: string,
  dias: number,
  dataVencimento: string,
): string {
  if (dias === 0) {
    return `Olá, ${nome}! Tudo bem? 😊\n\nSeu acesso ao ${produto} expira HOJE (${fmtData(dataVencimento)})! ⚠️\n\nPara não ficar sem acesso, renova agora. Me chama aqui! 🔥`;
  }
  if (dias < 0) {
    return `Olá, ${nome}! Tudo bem? 😊\n\nNotei que seu acesso ao ${produto} expirou no dia ${fmtData(dataVencimento)}. 😕\n\nQue tal renovar e voltar a aproveitar? Me chama aqui! 🔥`;
  }
  return `Olá, ${nome}! Tudo bem? 😊\n\nPassando para te lembrar que seu acesso ao ${produto} vai expirar em ${dias} dia${dias > 1 ? 's' : ''}, no dia ${fmtData(dataVencimento)}.\n\nBora renovar para não perder o acesso? Me chama aqui! 🔥`;
}

// ---- Mensagens de reabordagem ----

/** Templates com placeholders {nome} e {produto} — usados pela página de reabordagem como default editável */
export const MSG_TEMPLATE_REABORDAGEM_BRASIL =
`Olá, {nome}! 🇧🇷

Tudo bem? Tenho uma condição especial exclusiva para você renovar seu {produto}!

Preço promocional disponível por tempo limitado. Quer aproveitar?
Me chama aqui! 🔥`;

export const MSG_TEMPLATE_REABORDAGEM_EXTERIOR =
`Hey {nome}! 🌍

Hope you're doing well! I have a special exclusive deal for you to renew your {produto}!

Limited time promotional price available. Interested?
Message me here! 🔥`;

export function gerarMsgReabordagemBrasil(nome: string, produto: string): string {
  return MSG_TEMPLATE_REABORDAGEM_BRASIL.replace(/{nome}/g, nome).replace(/{produto}/g, produto);
}

export function gerarMsgReabordagemExterior(nome: string, produto: string): string {
  return MSG_TEMPLATE_REABORDAGEM_EXTERIOR.replace(/{nome}/g, nome).replace(/{produto}/g, produto);
}

// mantém compatibilidade com código antigo
export function gerarMsgReabordagem(nome: string, produto: string): string {
  return gerarMsgReabordagemBrasil(nome, produto);
}

// ---- Renovação mensal (para planos longos) ----

/** True se o cliente (plano != mensal) tem proxima_renovacao_mensal dentro de 2 dias ou no passado */
export function precisaRenovacaoMensal(c: Cliente): boolean {
  if (!c.proxima_renovacao_mensal || !c.plano || c.plano === 'mensal') return false;
  const agora = new Date(); agora.setHours(0, 0, 0, 0);
  const data  = new Date(c.proxima_renovacao_mensal + 'T00:00:00');
  const diff  = Math.round((data.getTime() - agora.getTime()) / 86_400_000);
  return diff <= 2;
}

/** Mensagem de lembrete de renovação mensal */
export function gerarMsgRenovacaoMensal(c: Cliente): string {
  const planoLabel = PLANOS.find(p => p.value === c.plano)?.label.split(' ')[0] ?? c.plano ?? '';
  const dataFmt    = c.proxima_renovacao_mensal ? fmtData(c.proxima_renovacao_mensal) : '?';
  return `🔔 Lembrete de Renovação Mensal\n\nCliente: ${c.nome}\nPlano: ${planoLabel} (pago adiantado)\nProduto: ${c.produto}\n\n⚠️ Atenção: Este cliente possui plano ${planoLabel} mas a renovação técnica é mensal.\nPróxima renovação: ${dataFmt}\n\nNão esqueça de renovar o acesso dele hoje! ✅`;
}

// ---- Ordenação por urgência ----

const URGENCIA: Record<Status, number> = {
  vence_hoje:     0,
  vence_em_breve: 1,
  vencido:        2,
  reabordagem:    3,
  ativo:          4,
  renovado:       5,
};

export function ordenarPorUrgencia(clientes: Cliente[]): Cliente[] {
  return [...clientes].sort((a, b) => {
    const ua = URGENCIA[a.status] ?? 9;
    const ub = URGENCIA[b.status] ?? 9;
    if (ua !== ub) return ua - ub;
    // mesmo status: vence mais cedo primeiro
    return a.dias_restantes - b.dias_restantes;
  });
}

export function precisaAtencao(c: Cliente): boolean {
  if (['vence_hoje', 'vence_em_breve', 'vencido'].includes(c.status)) {
    return diasSemContato(c.ultima_tentativa) >= 3;
  }
  return false;
}

// ---- Cadastro incompleto ----

/** True se email ou whatsapp estão ausentes/vazios */
export function cadastroIncompleto(c: Cliente): boolean {
  return !c.email?.trim() || !c.whatsapp?.trim();
}

/** Lista os campos ausentes de um cliente */
export function camposFaltantes(c: Cliente): ('email' | 'whatsapp')[] {
  const faltam: ('email' | 'whatsapp')[] = [];
  if (!c.email?.trim())    faltam.push('email');
  if (!c.whatsapp?.trim()) faltam.push('whatsapp');
  return faltam;
}

/** Ordena clientes incompletos: reabordagem → vencido → demais */
export function ordenarIncompletos(clientes: Cliente[]): Cliente[] {
  const PRIO: Partial<Record<string, number>> = { reabordagem: 0, vencido: 1 };
  return [...clientes].sort((a, b) => {
    const pa = PRIO[a.status] ?? 2;
    const pb = PRIO[b.status] ?? 2;
    return pa - pb;
  });
}
