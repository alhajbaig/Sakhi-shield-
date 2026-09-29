import { createClient } from '@supabase/supabase-js';

const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : (typeof process !== 'undefined' ? process.env : {} as any);
const supabaseUrl = env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[SakhiShield] Supabase URL or Anon Key not found in environment. Auth features will be unavailable.',
    'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

// Create the Supabase client — safe to call even with empty strings;
// all operations will fail gracefully and isSupabaseConfigured() will return false.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

/**
 * Returns true only when both the Supabase URL and Anon Key are properly configured.
 */
export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseUrl.length > 10 &&
    supabaseAnonKey &&
    supabaseAnonKey.length > 10
  );
};
