-- ============================================================
-- KitsDigitalia — Migration 002: Product Status
-- Adiciona coluna `status` à tabela products
--
-- Status aceitos:
--   active   → aparece no site, pode ser comprado
--   sold_out → aparece no site, NÃO pode ser comprado (badge Esgotado)
--   inactive → NÃO aparece no site público, NÃO pode ser comprado
--
-- Compatibilidade:
--   active = true  → status 'active'
--   active = false → status 'inactive'
--
-- Seguro para re-execução (idempotente):
--   ADD COLUMN IF NOT EXISTS  — skip se coluna já existe
--   DO $$ … END $$            — adiciona constraint só se não existe
--   UPDATE … WHERE condition  — backfill seguro
-- ============================================================

-- 1. Adiciona coluna status com CHECK constraint (idempotente)
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active'
  CHECK (status IN ('active', 'sold_out', 'inactive'));

-- 2. Garante constraint pelo nome (caso coluna existia sem constraint)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
     WHERE conname     = 'products_status_check'
       AND conrelid    = 'products'::regclass
  ) THEN
    ALTER TABLE products
      ADD CONSTRAINT products_status_check
      CHECK (status IN ('active', 'sold_out', 'inactive'));
  END IF;
END $$;

-- 3. Backfill: active=false → status='inactive'
--    Linhas com active=true já receberam status='active' pelo DEFAULT.
--    Re-executar é seguro (WHERE filtra apenas linhas que ainda precisam de ajuste).
UPDATE products
   SET status = 'inactive'
 WHERE active = false
   AND status = 'active';
