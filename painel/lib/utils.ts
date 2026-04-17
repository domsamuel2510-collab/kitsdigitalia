import type { Status } from '@/types/cliente';

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

export function calcularStatus(diasRestantes: number, renovadoEm: string | null): Status {
  if (renovadoEm) return 'renovado';
  if (diasRestantes > 2)  return 'ativo';
  if (diasRestantes >= 1) return 'vence_em_breve';
  if (diasRestantes === 0) return 'vence_hoje';
  return 'vencido';
}

export function fmtData(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export function whatsappLink(numero: string): string {
  const limpo = numero.replace(/\D/g, '');
  return `https://wa.me/${limpo}`;
}

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

export function gerarMsgCobranca(nome: string, produto: string): string {
  return `⚠️ Olá, ${nome}! Seu acesso ao ${produto} vence HOJE.\nPara renovar é só me chamar aqui! 😊`;
}

export function gerarMsgReabordagem(nome: string, produto: string): string {
  return `🔥 Olá, ${nome}! Temos uma novidade especial para você.\nSeu acesso ao ${produto} está disponível com condição especial.\nQuer voltar? Me chama aqui! 😊`;
}
