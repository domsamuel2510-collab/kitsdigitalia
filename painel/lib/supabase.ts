import { createClient } from '@supabase/supabase-js';

// NEXT_PUBLIC_ vars são embutidas em build-time pelo Next.js.
// Em build local sem .env, ficam undefined e createClient lança erro.
// Usamos fallback para não quebrar o build — em produção (Vercel) as
// vars reais estão sempre presentes via environment settings.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
