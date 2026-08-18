"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { EyeIcon, EyeSlashIcon, ArrowRightIcon, EnvelopeOpenIcon } from "@heroicons/react/24/outline"
import { CheckCircleIcon } from "@heroicons/react/24/solid"
import AuthPanel from "@/components/auth/AuthPanel"
import SocialAuth from "@/components/auth/SocialAuth"
import { signUp } from "@/lib/auth"

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", border: "1.5px solid #e2e8f0", borderRadius: 12,
  padding: "13px 16px", fontSize: 14.5, fontWeight: 500, color: "#0f172a", outline: "none",
}
const labelStyle: React.CSSProperties = {
  fontSize: 12.5, fontWeight: 700, color: "#374151", display: "block", marginBottom: 7,
}

const perks = [
  "Start investing from UGX 50,000",
  "Contracts, trade, assets & property in one place",
  "Sell property shares anytime on the Exchange",
]

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "" })
  const [showPw, setShowPw] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmSent, setConfirmSent] = useState(false)

  const set = (key: keyof typeof form, value: string) => {
    setForm(f => ({ ...f, [key]: value }))
    setError(null)
  }

  const canSubmit =
    form.fullName.trim().length >= 3 &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.password.length >= 6

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!canSubmit || busy) return
    setBusy(true)
    setError(null)
    try {
      const { needsConfirmation } = await signUp({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      })
      if (needsConfirmation) {
        setConfirmSent(true)
        setBusy(false)
      } else {
        router.push("/onboarding")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed — please try again.")
      setBusy(false)
    }
  }

  return (
    <div className="auth-grid">
      <AuthPanel />

      {/* ── Form side ── */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "40px 24px", backgroundColor: "#fff", minHeight: "100vh" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>

          {confirmSent ? (
            <div style={{ textAlign: "center", animation: "fade-up 0.35s ease-out" }}>
              <div style={{ width: 66, height: 66, borderRadius: "50%", backgroundColor: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                <EnvelopeOpenIcon style={{ width: 30, height: 30, color: "#2563eb" }} />
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: "0 0 10px 0" }}>Check your inbox</h1>
              <p style={{ fontSize: 14.5, color: "#64748b", lineHeight: 1.7, margin: "0 0 6px 0" }}>
                We sent a confirmation link to <strong style={{ color: "#0f172a" }}>{form.email}</strong>.
              </p>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 26px 0" }}>
                Click it to activate your account, then log in.
              </p>
              <Link href="/auth/login" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "13px 28px", borderRadius: 12, background: "linear-gradient(135deg, #2563eb, #4f46e5)", color: "#fff", fontSize: 14.5, fontWeight: 700, textDecoration: "none" }}>
                Go to Log In
                <ArrowRightIcon style={{ width: 15, height: 15 }} />
              </Link>
            </div>
          ) : (
            <>
              {/* Mobile logo */}
              <div className="auth-mobile-logo" style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 26 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg, #2563eb, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: "#fff" }}>N</div>
                <span style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>NestFund</span>
              </div>

              <h1 style={{ fontSize: 27, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", margin: "0 0 8px 0" }}>
                Start owning property
              </h1>
              <p style={{ fontSize: 14.5, color: "#64748b", margin: "0 0 18px 0", lineHeight: 1.6 }}>
                Create your free account in under a minute.
              </p>

              {/* Perks */}
              <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 20 }}>
                {perks.map(p => (
                  <div key={p} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircleIcon style={{ width: 16, height: 16, color: "#10b981", flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{p}</span>
                  </div>
                ))}
              </div>

              <SocialAuth onError={setError} />

              <form onSubmit={submit}>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Full Name</label>
                  <input style={inputStyle} autoComplete="name" value={form.fullName} onChange={e => set("fullName", e.target.value)} placeholder="Your full name" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input style={inputStyle} type="email" autoComplete="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@email.com" />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone</label>
                    <input style={inputStyle} inputMode="tel" autoComplete="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+256 7XX XXX XXX" />
                  </div>
                </div>
                <div style={{ marginBottom: 18 }}>
                  <label style={labelStyle}>Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      style={{ ...inputStyle, paddingRight: 46 }}
                      type={showPw ? "text" : "password"}
                      autoComplete="new-password"
                      value={form.password}
                      onChange={e => set("password", e.target.value)}
                      placeholder="At least 6 characters"
                    />
                    <button type="button" onClick={() => setShowPw(s => !s)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex" }}>
                      {showPw ? <EyeSlashIcon style={{ width: 17, height: 17, color: "#94a3b8" }} /> : <EyeIcon style={{ width: 17, height: 17, color: "#94a3b8" }} />}
                    </button>
                  </div>
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
                  {busy ? "Creating account..." : "Create Free Account"}
                  {!busy && <ArrowRightIcon style={{ width: 16, height: 16 }} />}
                </button>
              </form>

              <p style={{ fontSize: 13.5, color: "#64748b", textAlign: "center", marginTop: 22 }}>
                Already have an account?{" "}
                <Link href="/auth/login" style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>
                  Sign in
                </Link>
              </p>

              <p style={{ fontSize: 11.5, color: "#b6c1cf", textAlign: "center", marginTop: 18, lineHeight: 1.6 }}>
                By creating an account you agree to our{" "}
                <Link href="/terms" style={{ color: "#94a3b8", textDecoration: "none" }}>Terms</Link> &{" "}
                <Link href="/privacy" style={{ color: "#94a3b8", textDecoration: "none" }}>Privacy Policy</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
