"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { EyeIcon, EyeSlashIcon, ArrowRightIcon } from "@heroicons/react/24/outline"
import AuthPanel from "@/components/auth/AuthPanel"
import SocialAuth from "@/components/auth/SocialAuth"
import { signIn } from "@/lib/auth"

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", border: "1.5px solid #e2e8f0", borderRadius: 12,
  padding: "13px 16px", fontSize: 14.5, fontWeight: 500, color: "#0f172a", outline: "none",
  transition: "border-color 0.15s",
}
const labelStyle: React.CSSProperties = {
  fontSize: 12.5, fontWeight: 700, color: "#374151", display: "block", marginBottom: 7,
}

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = /\S+@\S+\.\S+/.test(email) && password.length >= 6

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!canSubmit || busy) return
    setBusy(true)
    setError(null)
    try {
      await signIn(email.trim(), password)
      router.push("/home")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed — please try again.")
      setBusy(false)
    }
  }

  return (
    <div className="auth-grid">
      <AuthPanel />

      {/* ── Form side ── */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px 24px", backgroundColor: "#fff", minHeight: "100vh" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>

          {/* Mobile logo */}
          <div className="auth-mobile-logo" style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 30 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg, #2563eb, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: "#fff" }}>N</div>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>NestFund</span>
          </div>

          <h1 style={{ fontSize: 27, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", margin: "0 0 8px 0" }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 14.5, color: "#64748b", margin: "0 0 24px 0", lineHeight: 1.6 }}>
            Log in to see your portfolio, income, and the market.
          </p>

          <SocialAuth onError={setError} />

          <form onSubmit={submit}>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Email</label>
              <input
                style={inputStyle}
                type="email"
                autoComplete="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(null) }}
                placeholder="you@email.com"
              />
            </div>

            <div style={{ marginBottom: 8 }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  style={{ ...inputStyle, paddingRight: 46 }}
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(null) }}
                  placeholder="Your password"
                />
                <button type="button" onClick={() => setShowPw(s => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
                  {showPw ? <EyeSlashIcon style={{ width: 17, height: 17, color: "#94a3b8" }} /> : <EyeIcon style={{ width: 17, height: 17, color: "#94a3b8" }} />}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 20 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: "#94a3b8", cursor: "pointer" }}>Forgot password?</span>
            </div>

            {error && (
              <p style={{ fontSize: 12.5, fontWeight: 600, color: "#dc2626", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", margin: "0 0 16px 0", lineHeight: 1.55 }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!canSubmit || busy}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                padding: "14px 0", borderRadius: 12, border: "none",
                cursor: canSubmit && !busy ? "pointer" : "not-allowed",
                background: canSubmit ? "linear-gradient(135deg, #2563eb, #4f46e5)" : "#e2e8f0",
                color: canSubmit ? "#fff" : "#94a3b8",
                fontSize: 15, fontWeight: 700,
                boxShadow: canSubmit ? "0 4px 14px rgba(37,99,235,0.3)" : "none",
              }}
            >
              {busy ? "Logging in..." : "Log In"}
              {!busy && <ArrowRightIcon style={{ width: 16, height: 16 }} />}
            </button>
          </form>

          <p style={{ fontSize: 13.5, color: "#64748b", textAlign: "center", marginTop: 26 }}>
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>
              Create one free
            </Link>
          </p>

          <p style={{ fontSize: 11.5, color: "#b6c1cf", textAlign: "center", marginTop: 22, lineHeight: 1.6 }}>
            Protected by bank-grade encryption ·{" "}
            <Link href="/terms" style={{ color: "#94a3b8", textDecoration: "none" }}>Terms</Link> ·{" "}
            <Link href="/privacy" style={{ color: "#94a3b8", textDecoration: "none" }}>Privacy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
