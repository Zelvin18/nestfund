"use client"

import { useState } from "react"
import Link from "next/link"
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, ShieldCheckIcon } from "@heroicons/react/24/outline"
import { ArrowTrendingUpIcon, CheckBadgeIcon } from "@heroicons/react/24/solid"
import Sparkline from "@/components/ui/Sparkline"

const sparkA = [10,13,12,15,14,17,16,20,18,22,21,25,23,27,26,30,28,33,31,36,34,38,36,40,38,42]
const sparkB = [5,8,7,11,9,13,12,16,14,18,17,21,19,23,22,26,24,28,26,31,29,33,31,35,33,37]

const stats = [
  { label: "Properties",    value: "312+",      positive: true,  spark: sparkA },
  { label: "Avg. Yield",    value: "8.6%",       positive: true,  spark: sparkB },
  { label: "Active Investors", value: "14,250", positive: true,  spark: sparkA },
]

export default function LoginPage() {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr" }} className="auth-grid">

      {/* ── LEFT — Branding panel ── */}
      <div style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)", padding: "48px 52px", display: "flex", flexDirection: "column", justifyContent: "space-between" }} className="auth-left">
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, color: "#fff", backdropFilter: "blur(8px)" }}>N</div>
          <span style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>NestFund</span>
        </div>

        {/* Main pitch */}
        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 16px 0" }}>
            Real Estate Investment Market
          </p>
          <h2 style={{ fontSize: 38, fontWeight: 900, color: "#fff", lineHeight: 1.1, letterSpacing: "-1px", margin: "0 0 20px 0" }}>
            Own Property.
            <br />
            <span style={{ color: "#93c5fd" }}>Earn Every Month.</span>
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.65)", lineHeight: 1.7, margin: "0 0 36px 0", maxWidth: 380 }}>
            Buy shares of verified properties, receive monthly rental income, and trade real estate like stocks.
          </p>

          {/* 3 stat cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {stats.map(s => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 16px", border: "1px solid rgba(255,255,255,0.1)" }}>
                <div>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", margin: "0 0 3px 0", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <ArrowTrendingUpIcon style={{ width: 13, height: 13, color: "#6ee7b7" }} />
                    <p style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: 0 }}>{s.value}</p>
                  </div>
                </div>
                <Sparkline data={s.spark} width={80} height={32} positive={s.positive} strokeWidth={1.8} />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom trust */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ShieldCheckIcon style={{ width: 16, height: 16, color: "#6ee7b7" }} />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>Regulated · Bank-grade security · Capital Markets Authority</span>
        </div>
      </div>

      {/* ── RIGHT — Login form ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px", backgroundColor: "#fff" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>

          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", margin: "0 0 6px 0" }}>
            Welcome back
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 32px 0" }}>
            Sign in to your NestFund account
          </p>

          {/* Social logins */}
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            {[
              { label: "Google", logo: "https://www.google.com/favicon.ico" },
              { label: "Apple",  logo: "https://www.apple.com/favicon.ico" },
            ].map(s => (
              <button key={s.label} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, height: 42, borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#374151" }}>
                <img src={s.logo} alt={s.label} style={{ width: 16, height: 16 }} />
                {s.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, backgroundColor: "#f1f5f9" }} />
            <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>or continue with email</span>
            <div style={{ flex: 1, height: 1, backgroundColor: "#f1f5f9" }} />
          </div>

          {/* Form */}
          <form onSubmit={e => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 7 }}>Email address</label>
              <div style={{ position: "relative" }}>
                <EnvelopeIcon style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#9ca3af" }} />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  style={{ width: "100%", height: 44, paddingLeft: 40, paddingRight: 16, borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0f172a", outline: "none", boxSizing: "border-box" }}
                />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Password</label>
                <Link href="/auth/forgot" style={{ fontSize: 12, color: "#2563eb", textDecoration: "none", fontWeight: 500 }}>Forgot password?</Link>
              </div>
              <div style={{ position: "relative" }}>
                <LockClosedIcon style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#9ca3af" }} />
                <input
                  type={show ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{ width: "100%", height: 44, paddingLeft: 40, paddingRight: 44, borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0f172a", outline: "none", boxSizing: "border-box" }}
                />
                <button type="button" onClick={() => setShow(!show)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}>
                  {show ? <EyeSlashIcon style={{ width: 16, height: 16, color: "#9ca3af" }} /> : <EyeIcon style={{ width: 16, height: 16, color: "#9ca3af" }} />}
                </button>
              </div>
            </div>

            <Link
              href="/"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 46, borderRadius: 11, background: "linear-gradient(135deg, #2563eb, #4f46e5)", color: "#fff", fontSize: 15, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 14px rgba(37,99,235,0.3)", marginTop: 4 }}
            >
              Sign In
            </Link>
          </form>

          <p style={{ fontSize: 13, color: "#64748b", textAlign: "center", marginTop: 24 }}>
            Don't have an account?{" "}
            <Link href="/auth/register" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
