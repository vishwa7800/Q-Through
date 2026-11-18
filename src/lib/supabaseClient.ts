/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// Read Supabase configuration strictly from environment variables (.env.local / Vercel)
export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  // Explicitly disable realtime websocket channels so all communication uses pure HTTP REST (GET/POST)
  realtime: {
    params: {
      eventsPerSecond: 0,
    },
  },
});
