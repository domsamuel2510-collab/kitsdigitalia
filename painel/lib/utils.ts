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
  return `✅ Solicitação Recebida com Sucesso!\n📦 Produto: ${produto}\n✉️ Email: ${email}\n📅 Data do Pedido: ${fmtData(dataCompra)}\n⏳ Vencimento Previsto: ${fmtData(dataVencimento)}\n📲 WhatsApp: ${whatsapp}\n⚠️ A ativação pode levar até 24 horas.\n🔔 Você será notificado aqui no chat.`;
}

// ---- Mensagens de cobrança (contextuais) ----

export function gerarMsgCobranca(
  nome: string,
  produto: string,
  dias: number,
  dataVencimento: string,
): string {
  if (dias === 0) {
    return `🔴 Olá, ${nome}! Seu acesso ao ${produto} vence HOJE.\nBora renovar para não perder o acesso? Me chama aqui! 🔥`;
  }
  if (dias < 0) {
    return `⚠️ Olá, ${nome}! Seu acesso ao ${produto} venceu há ${Math.abs(dias)} dia(s).\nAinda dá pra renovar — me chama aqui! 😊`;
  }
  return `⚠️ Olá, ${nome}! Seu acesso ao ${produto} vence em ${dias} dia(s) (${fmtData(dataVencimento)}).\nPara renovar é só me chamar aqui! 😊`;
}

// ---- Mensagens de reabordagem ----

export function gerarMsgReabordagemBrasil(nome: string, produto: string): string {
  return `🇧🇷 Olá, ${nome}! Temos uma oferta especial para você voltar.\nSeu ${produto} com condição exclusiva — me chama aqui! 🔥`;
}

export function gerarMsgReabordagemExterior(nome: string, produto: string): string {
  return `Hey ${nome}! We have a special deal for you to come back.\nYour ${produto} access with exclusive pricing — message me! 🔥`;
}

// mantém compatibilidade com código antigo
export function gerarMsgReabordagem(nome: string, produto: string): string {
  return gerarMsgReabordagemBrasil(nome, produto);
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
