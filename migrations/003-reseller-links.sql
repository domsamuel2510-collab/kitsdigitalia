-- ============================================================
-- 003-reseller-links.sql — Sistema de links de revendedor
--
-- Idempotente: usa ADD COLUMN IF NOT EXISTS e CREATE INDEX IF NOT EXISTS.
-- Aplica-se sobre reseller_applications e orders.
-- ============================================================

-- ── reseller_applications ─────────────────────────────────────────────────────

ALTER TABLE reseller_applications
  ADD COLUMN IF NOT EXISTS reseller_code      TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS approved_at        TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS commission_percent NUMERIC(5,2) NOT NULL DEFAULT 10;

-- ── orders ────────────────────────────────────────────────────────────────────

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS reseller_id        UUID,
  ADD COLUMN IF NOT EXISTS reseller_code      TEXT,
  ADD COLUMN IF NOT EXISTS reseller_name      TEXT,
  ADD COLUMN IF NOT EXISTS commission_percent NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS commission_amount  NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS commission_status  TEXT;

-- Constraint de valores válidos para commission_status (apenas quando não nulo)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'chk_commission_status' AND conrelid = 'orders'::regclass
  ) THEN
    ALTER TABLE orders
      ADD CONSTRAINT chk_commission_status
        CHECK (commission_status IS NULL OR commission_status IN ('pending','paid','cancelled'));
  END IF;
END $$;

-- Índice para lookup rápido de pedidos por revendedor
CREATE INDEX IF NOT EXISTS idx_orders_reseller_code ON orders(reseller_code);
