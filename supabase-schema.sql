-- ============================================================
-- KitsDigitalia — Supabase Schema (final)
-- Execute no SQL Editor: app.supabase.com → SQL Editor
-- Suporta: PIX (MisticPay), IBAN e Binance
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists orders (
  -- Identidade
  id                      uuid          primary key default gen_random_uuid(),
  order_id                text          unique not null,  -- ex: PD-20250415-1234

  -- Cliente
  customer_name           text          not null,
  customer_email          text          not null,
  customer_whatsapp       text          not null,
  customer_cpf            text,                          -- somente PIX; 11 dígitos

  -- Produto
  product_id              text          not null,
  product_name            text          not null,
  amount                  numeric(10,2) not null,

  -- Pagamento
  payment_method          text          not null,        -- 'pix' | 'iban' | 'binance'
  payment_provider        text,                          -- 'misticpay' | 'manual'
  payment_status          text          not null default 'pending',
    -- 'pending' | 'pending_manual' | 'paid' | 'failed' | 'expired'
  fulfillment_status      text          not null default 'aguardando_pagamento',
    -- 'aguardando_pagamento' | 'pago_ok' | 'em_andamento' | 'entregue' | 'concluido'

  -- Dados do provedor (preenchidos apenas para PIX)
  provider_transaction_id text,                          -- ID da transação na MisticPay
  provider_status         text,                          -- status bruto retornado pela MisticPay
  pix_copy_paste          text,                          -- código copia-e-cola PIX
  pix_qrcode_url          text,                          -- URL da imagem QR (se disponível)

  -- Moeda do pedido
  currency                text          not null default 'EUR',
    -- 'EUR' (IBAN, Binance) | 'BRL' (PIX)

  -- Extras
  notes                   text,
  created_at              timestamptz   not null default now(),
  updated_at              timestamptz   not null default now()
);

-- Índices para as consultas mais frequentes
create index if not exists orders_email_idx   on orders (customer_email);
create index if not exists orders_status_idx  on orders (payment_status);
create index if not exists orders_created_idx on orders (created_at desc);

-- Trigger: atualiza updated_at automaticamente em qualquer UPDATE
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_updated_at on orders;
create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

-- Row Level Security
-- As Vercel Functions usam SUPABASE_SERVICE_KEY (bypass automático de RLS).
-- Nenhuma policy aberta é criada — o frontend não acessa o banco diretamente.
alter table orders enable row level security;
