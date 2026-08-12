"use client"

import { useState } from "react"
import { signInWithProvider } from "@/lib/auth"

/* "Continue with Google / Apple" row + divider, shared by Login and Register.
   Routes through Supabase OAuth; shows a friendly note if a provider
   hasn't been enabled in the Supabase dashboard yet. */
export default function SocialAuth({ onError }: { onError: (message: string) => void }) {
  const [busy, setBusy] = useState<"google" | "apple" | null>(null)

  const go = async (provider: "google" | "apple") => {
    if (busy) return
    setBusy(provider)
    try {
      await signInWithProvider(provider)
      // On success the browser redirects to the provider — no cleanup needed
    } catch (err) {
      onError(err instanceof Error ? err.message : "Sign-in failed — please try again.")
      setBusy(null)
    }
  }

  const btnStyle: React.CSSProperties = {
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 9,
    padding: "12px 0", borderRadius: 12, border: "1.5px solid #e2e8f0",
    backgroundColor: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 650, color: "#1f2937",
  }

  return (
    <>
      <div style={{ display: "flex", gap: 12 }}>
        <button type="button" onClick={() => go("google")} disabled={busy !== null} style={{ ...btnStyle, opacity: busy && busy !== "google" ? 0.6 : 1 }}>
          {/* Google "G" */}
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.1 3.58-5.18 3.58-8.82z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.91l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.72-4.95H1.27v3.1A12 12 0 0 0 12 24z" />
            <path fill="#FBBC05" d="M5.28 14.29A7.2 7.2 0 0 1 4.9 12c0-.8.14-1.57.38-2.29V6.6H1.27a12 12 0 0 0 0 10.8l4.01-3.1z" />
            <path fill="#EA4335" d="M12 4.77c1.76 0 3.35.61 4.6 1.8l3.44-3.44A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.27 6.6l4.01 3.11C6.22 6.87 8.87 4.77 12 4.77z" />
          </svg>
          {busy === "google" ? "Connecting..." : "Google"}
        </button>
        <button type="button" onClick={() => go("apple")} disabled={busy !== null} style={{ ...btnStyle, opacity: busy && busy !== "apple" ? 0.6 : 1 }}>
          {/* Apple mark */}
          <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#0f172a" d="M16.36 12.76c.03 3.26 2.86 4.35 2.89 4.36-.02.08-.45 1.55-1.49 3.07-.9 1.31-1.83 2.62-3.3 2.65-1.44.03-1.91-.86-3.56-.86-1.65 0-2.17.83-3.53.89-1.42.05-2.5-1.42-3.4-2.73-1.86-2.68-3.27-7.56-1.37-10.86A5.28 5.28 0 0 1 7.05 6.6c1.39-.03 2.7.94 3.56.94.85 0 2.45-1.16 4.12-.99.7.03 2.68.28 3.94 2.14-.1.06-2.35 1.37-2.31 4.07zM13.64 3.79c.75-.9 1.25-2.17 1.11-3.42-1.08.04-2.38.72-3.15 1.62-.69.8-1.3 2.08-1.14 3.31 1.2.09 2.43-.61 3.18-1.51z" />
          </svg>
          {busy === "apple" ? "Connecting..." : "Apple"}
        </button>
      </div>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0" }}>
        <div style={{ flex: 1, height: 1, backgroundColor: "#e8ecf0" }} />
        <span style={{ fontSize: 11.5, fontWeight: 650, color: "#94a3b8", letterSpacing: "0.04em" }}>OR WITH EMAIL</span>
        <div style={{ flex: 1, height: 1, backgroundColor: "#e8ecf0" }} />
      </div>
    </>
  )
}
