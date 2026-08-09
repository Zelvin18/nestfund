import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/* ═══════════════════════════════════════════════════════════════
   Supabase client — returns null until the project is connected.

   To go live:
   1. Create a project at https://supabase.com
   2. Run supabase/schema.sql then supabase/seed.sql in the SQL editor
   3. Add to .env.local:
        NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
        NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
   4. Add the same two env vars in Vercel project settings

   While unset, the site and admin read from lib/data (mock mode) —
   the UI is identical, only persistence is missing.
═══════════════════════════════════════════════════════════════ */

let client: SupabaseClient | null | undefined

export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  client = url && key ? createClient(url, key) : null
  return client
}

export const isSupabaseConfigured = () => getSupabase() !== null
