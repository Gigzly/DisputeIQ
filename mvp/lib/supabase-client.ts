import { createClient } from '@supabase/supabase-js'

// Client-side only — no next/headers or server imports
export function createSupabaseClientSide() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession:   true,
        autoRefreshToken: true,
        storageKey:       'disputeiq-auth',
      },
    }
  )
}
