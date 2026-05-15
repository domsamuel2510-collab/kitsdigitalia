import { createClient } from '@supabase/supabase-js';

// Projeto Supabase: kitsdigitalia (tdofhjcxykmskekpmcyi)
// URL e anon key são chaves PÚBLICAS — seguro incluir no bundle client-side.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  'https://tdofhjcxykmskekpmcyi.supabase.co';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkb2ZoamN4eWttc2tla3BtY3lpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMjE0OTUsImV4cCI6MjA5MTc5NzQ5NX0.rO3trrGiI0Yjwn-iBYADNRMCL2K2nu_ARWGrZbCw-Gk';

export const supabase = createClient(supabaseUrl, supabaseKey);
