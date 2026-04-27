-- ============================================================
-- KitsDigitalia — Migration 001: Admin Upgrade
-- Tabelas: coupons, products, reseller_applications
-- Colunas novas em orders: coupon_code, discount_percent, original_amount
--
-- Execute no SQL Editor: app.supabase.com → SQL Editor
-- ============================================================

-- ── Cupons ───────────────────────────────────────────────────────────────────

create table if not exists coupons (
  id               uuid          primary key default gen_random_uuid(),
  code             text          unique not null,          -- sempre armazenado em MAIÚSCULAS
  discount_percent numeric(5,2)  not null
                   check (discount_percent >= 1 and discount_percent <= 90),
  active           boolean       not null default true,
  created_at       timestamptz   not null default now(),
  updated_at       timestamptz   not null default now()
);

create index if not exists coupons_code_idx    on coupons (code);
create index if not exists coupons_active_idx  on coupons (active) where active = true;

drop trigger if exists coupons_updated_at on coupons;
create trigger coupons_updated_at
  before update on coupons
  for each row execute function update_updated_at();

alter table coupons enable row level security;

-- ── Produtos (override/adição ao catálogo em _catalog.js) ────────────────────

create table if not exists products (
  id          text          primary key,              -- ex: 'chatgpt-pro'
  name        text          not null,
  description text,
  price       numeric(10,2) not null check (price > 0),
  currency    text          not null default 'EUR',
  category    text,
  image_url   text,
  active      boolean       not null default true,
  created_at  timestamptz   not null default now(),
  updated_at  timestamptz   not null default now()
);

create index if not exists products_active_idx on products (active) where active = true;

drop trigger if exists products_updated_at on products;
create trigger products_updated_at
  before update on products
  for each row execute function update_updated_at();

alter table products enable row level security;

-- ── Cadastros de Revendedores ─────────────────────────────────────────────────

create table if not exists reseller_applications (
  id        uuid        primary key default gen_random_uuid(),
  name      text        not null,
  email     text        not null,
  whatsapp  text        not null,
  country   text        not null,
  message   text,
  status    text        not null default 'new'
            check (status in ('new','contacted','approved','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists resellers_status_idx  on reseller_applications (status);
create index if not exists resellers_email_idx   on reseller_applications (email);
create index if not exists resellers_created_idx on reseller_applications (created_at desc);

drop trigger if exists resellers_updated_at on reseller_applications;
create trigger resellers_updated_at
  before update on reseller_applications
  for each row execute function update_updated_at();

alter table reseller_applications enable row level security;

-- ── Novas colunas em orders ───────────────────────────────────────────────────

alter table orders
  add column if not exists coupon_code      text,
  add column if not exists discount_percent numeric(5,2),
  add column if not exists original_amount  numeric(10,2);

-- Nota: a coluna `amount` continua representando o valor FINAL (após desconto).
-- original_amount = preço base antes do cupom/desconto Binance.
