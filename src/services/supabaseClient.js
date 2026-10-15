import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[SUPABASE] Missing environment variables. Storage functionality will be disabled.'
  );
}

// Singleton Supabase client for direct storage uploads
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
