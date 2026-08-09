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

/* Fallbacks so deploys work without Vercel env config. The anon key is
   public by design (it ships in every browser request) — row-level
   security is the actual boundary. Env vars override when set. */
const FALLBACK_URL = "https://cmrwksxoajukfxtbpgqh.supabase.co"
const FALLBACK_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtcndrc3hvYWp1a2Z4dGJwZ3FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYyNzc5MTksImV4cCI6MjEwMTg1MzkxOX0.EZpXxsiMF_1Pnm3G73eAZjEy4zT5AOECF6o_siqRupk"

let client: SupabaseClient | null | undefined

export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_ANON_KEY
  client = url && key ? createClient(url, key) : null
  return client
}

export const isSupabaseConfigured = () => getSupabase() !== null
