import { getSupabase } from "./supabase"
import type { Session, User } from "@supabase/supabase-js"

/* ═══════════════════════════════════════════════════════════════
   AUTH — Phase 1 foundation.
   Real Supabase accounts; a profiles row is created automatically
   by the database trigger (supabase/phase1-foundation.sql).
═══════════════════════════════════════════════════════════════ */

export async function signIn(email: string, password: string): Promise<Session> {
  const sb = getSupabase()
  if (!sb) throw new Error("Accounts aren't available right now — the database isn't connected.")
  const { data, error } = await sb.auth.signInWithPassword({ email, password })
  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      throw new Error("Email or password is incorrect.")
    }
    if (error.message.includes("Email not confirmed")) {
      throw new Error("Please confirm your email first — check your inbox for the verification link.")
    }
    throw new Error(error.message)
  }
  return data.session
}

export async function signUp(input: { fullName: string; email: string; phone: string; password: string }): Promise<{ needsConfirmation: boolean }> {
  const sb = getSupabase()
  if (!sb) throw new Error("Accounts aren't available right now — the database isn't connected.")
  const { data, error } = await sb.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: { full_name: input.fullName, phone: input.phone },
    },
  })
  if (error) {
    if (error.message.includes("already registered")) {
      throw new Error("This email already has an account — try logging in instead.")
    }
    if (error.message.toLowerCase().includes("password")) {
      throw new Error("Password must be at least 6 characters.")
    }
    throw new Error(error.message)
  }
  // Existing-but-unconfirmed accounts come back with an empty identities array
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    throw new Error("This email already has an account — try logging in instead.")
  }
  return { needsConfirmation: !data.session }
}

export async function signOut(): Promise<void> {
  const sb = getSupabase()
  if (sb) await sb.auth.signOut()
}

export async function getCurrentUser(): Promise<User | null> {
  const sb = getSupabase()
  if (!sb) return null
  const { data } = await sb.auth.getSession()
  return data.session?.user ?? null
}

export function onAuthChange(cb: (user: User | null) => void): () => void {
  const sb = getSupabase()
  if (!sb) return () => {}
  const { data } = sb.auth.onAuthStateChange((_event, session) => cb(session?.user ?? null))
  return () => data.subscription.unsubscribe()
}
