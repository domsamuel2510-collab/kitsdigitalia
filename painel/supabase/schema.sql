-- ============================================================
--  KitsDigitalia — Schema Supabase
--  Execute no SQL Editor do seu projeto Supabase
-- ============================================================

-- Extensão necessária (já ativa no Supabase por padrão)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -------------------------------------------------------
-- Tabela principal
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS clientes (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  nome             TEXT        NOT NULL,
  email            TEXT        NOT NULL,
  whatsapp         TEXT        NOT NULL,
  produto          TEXT        NOT NULL,
  data_compra      DATE        NOT NULL DEFAULT CURRENT_DATE,
  data_vencimento  DATE        NOT NULL,
  dias_restantes   INT         GENERATED ALWAYS AS (data_vencimento - CURRENT_DATE) STORED,
  status           TEXT        NOT NULL DEFAULT 'ativo'
                   CHECK (status IN ('ativo','vence_em_breve','vence_hoje','vencido','renovado','reabordagem')),
  msg_confirmacao  TEXT,
  renovado_em      DATE,
  ultimo_aviso     DATE,
  observacoes      TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------
-- Função: recalcula status de todos os clientes
-- Chamada pelo frontend ao carregar o painel
-- -------------------------------------------------------
CREATE OR REPLACE FUNCTION atualizar_status_todos()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE clientes
  SET status = CASE
    WHEN renovado_em IS NOT NULL          THEN 'renovado'
    WHEN (data_vencimento - CURRENT_DATE) > 2  THEN 'ativo'
    WHEN (data_vencimento - CURRENT_DATE) IN (1,2) THEN 'vence_em_breve'
    WHEN (data_vencimento - CURRENT_DATE) = 0  THEN 'vence_hoje'
    WHEN status = 'reabordagem'           THEN 'reabordagem'  -- não sobrescreve
    ELSE 'vencido'
  END
  WHERE status <> 'reabordagem' OR renovado_em IS NOT NULL;
END;
$$;

-- -------------------------------------------------------
-- (Opcional) pg_cron — roda atualizar_status_todos todo dia às 05:00 UTC
-- Requer extensão pg_cron habilitada no projeto Supabase
-- -------------------------------------------------------
-- SELECT cron.schedule('atualizar-status-diario', '0 5 * * *', 'SELECT atualizar_status_todos()');

-- -------------------------------------------------------
-- RLS — habilita Row Level Security (ajuste as policies conforme sua auth)
-- -------------------------------------------------------
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- Policy permissiva para desenvolvimento (troque por auth real em produção)
CREATE POLICY "allow_all" ON clientes FOR ALL USING (true) WITH CHECK (true);

-- -------------------------------------------------------
-- Migração: novas colunas (execute se a tabela já existir)
-- -------------------------------------------------------
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS tentativas_contato   INT     DEFAULT 0;
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS data_ativacao        DATE;
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS ativacao_confirmada  BOOLEAN DEFAULT false;
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS resposta_cliente     TEXT
  CHECK (resposta_cliente IN ('respondeu','nao_respondeu','vai_renovar','nao_quer_mais'));
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS pais                 TEXT    DEFAULT 'Brasil';
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS ultima_tentativa     DATE;
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS plano               TEXT    DEFAULT 'mensal'
  CHECK (plano IN ('mensal','trimestral','semestral','anual'));
ALTER TABLE clientes ADD COLUMN IF NOT EXISTS proxima_renovacao_mensal DATE;
