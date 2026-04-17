export type Status =
  | 'ativo'
  | 'vence_em_breve'
  | 'vence_hoje'
  | 'vencido'
  | 'renovado'
  | 'reabordagem';

export type RespostaCliente =
  | 'respondeu'
  | 'nao_respondeu'
  | 'vai_renovar'
  | 'nao_quer_mais';

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  whatsapp: string;
  produto: string;
  pais: string;                      // 'Brasil' | 'Exterior'
  data_compra: string;
  data_vencimento: string;
  dias_restantes: number;
  status: Status;
  msg_confirmacao: string | null;
  renovado_em: string | null;
  ultimo_aviso: string | null;
  observacoes: string | null;
  // controle de ativação
  data_ativacao: string | null;
  ativacao_confirmada: boolean;
  // controle de tentativas
  tentativas_contato: number;
  ultima_tentativa: string | null;
  resposta_cliente: RespostaCliente | null;
  created_at: string;
}
