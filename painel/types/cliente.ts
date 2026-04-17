export type Status =
  | 'ativo'
  | 'vence_em_breve'
  | 'vence_hoje'
  | 'vencido'
  | 'renovado'
  | 'reabordagem';

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  whatsapp: string;
  produto: string;
  data_compra: string;       // ISO date: YYYY-MM-DD
  data_vencimento: string;   // ISO date
  dias_restantes: number;
  status: Status;
  msg_confirmacao: string | null;
  renovado_em: string | null;
  ultimo_aviso: string | null;
  observacoes: string | null;
  created_at: string;
}
