"use client"

import { useState } from "react"
import Link from "next/link"
import {
  EnvelopeIcon, LockClosedIcon, UserIcon,
  EyeIcon, EyeSlashIcon, PhoneIcon, ShieldCheckIcon,
} from "@heroicons/react/24/outline"
import { CheckBadgeIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/solid"

const benefits = [
  "Buy shares from UGX 50,000",
  "Earn monthly rental income",
  "Real-time property pricing",
  "No hidden fees — ever",
  "Withdraw anytime",
]

export default function RegisterPage() {
  const [show, setShow] = useState(false)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" })

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="auth-grid">

      {/* ── LEFT — Benefits panel ── */}
      <div style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)", padding: "48px 52px", display: "flex", flexDirection: "column", justifyContent: "space-between" }} className="auth-left">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, color: "#fff" }}>N</div>
          <span style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>NestFund</span>
        </div>

        <div>
          <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 16px 0" }}>
            Join 14,250+ investors
          </p>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: "#fff", lineHeight: 1.1, letterSpacing: "-0.8px", margin: "0 0 20px 0" }}>
            Start investing in
            <br />
            <span style={{ color: "#93c5fd" }}>real estate today.</span>
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, margin: "0 0 32px 0" }}>
            No millions required. Own a piece of premium property from UGX 50,000.
          </p>

          {/* Benefits list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {benefits.map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", backgroundColor: "rgba(16,185,129,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <CheckBadgeIcon style={{ width: 13, height: 13, color: "#6ee7b7" }} />
                </div>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sample return card */}
        <div style={{ backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 14, padding: "16px 18px", border: "1px solid rgba(255,255,255,0.12)" }}>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: "0 0 6px 0", textTransform: "uppercase", letterSpacing: "0.07em" }}>Example: 100 shares in Sunrise Apartments</p>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: "0 0 2px 0" }}>Investment</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: 0 }}>UGX 125,000</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: "0 0 2px 0" }}>Monthly income</p>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#6ee7b7", margin: 0 }}>UGX 1,167</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: "0 0 2px 0" }}>Annual yield</p>
              <div style={{ display: "flex", alignItems: "center", gap: 3, justifyContent: "flex-end" }}>
                <ArrowTrendingUpIcon style={{ width: 13, height: 13, color: "#6ee7b7" }} />
                <p style={{ fontSize: 16, fontWeight: 700, color: "#6ee7b7", margin: 0 }}>11.2%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT — Register form ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px", backgroundColor: "#fff", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          {/* Step indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
            {[1, 2].map(s => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", backgroundColor: step >= s ? "#2563eb" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {step > s
                    ? <CheckBadgeIcon style={{ width: 16, height: 16, color: "#fff" }} />
                    : <span style={{ fontSize: 12, fontWeight: 700, color: step === s ? "#fff" : "#94a3b8" }}>{s}</span>
                  }
                </div>
                <span style={{ fontSize: 12, fontWeight: 600, color: step >= s ? "#0f172a" : "#94a3b8" }}>
                  {s === 1 ? "Your Details" : "Verify & Secure"}
                </span>
                {s < 2 && <div style={{ width: 32, height: 1, backgroundColor: step > s ? "#2563eb" : "#f1f5f9", marginRight: 0 }} />}
              </div>
            ))}
          </div>

          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", margin: "0 0 4px 0" }}>
            {step === 1 ? "Create your account" : "Secure your account"}
          </h1>
          <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 28px 0" }}>
            {step === 1 ? "Free to join. No credit card needed." : "Your details are protected with 256-bit encryption."}
          </p>

          {step === 1 && (
            <>
              {/* Social */}
              <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                {["Google", "Apple"].map(s => (
                  <button key={s} style={{ flex: 1, height: 42, borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#374151" }}>
                    Continue with {s}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{ flex: 1, height: 1, backgroundColor: "#f1f5f9" }} />
                <span style={{ fontSize: 12, color: "#94a3b8" }}>or with email</span>
                <div style={{ flex: 1, height: 1, backgroundColor: "#f1f5f9" }} />
              </div>

              <form style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { key: "name",  label: "Full Name",     type: "text",  Icon: UserIcon,     placeholder: "Kelvin Magumise" },
                  { key: "email", label: "Email Address", type: "email", Icon: EnvelopeIcon, placeholder: "you@example.com" },
                  { key: "phone", label: "Phone Number",  type: "tel",   Icon: PhoneIcon,    placeholder: "+256 7XX XXX XXX" },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 7 }}>{f.label}</label>
                    <div style={{ position: "relative" }}>
                      <f.Icon style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#9ca3af" }} />
                      <input
                        type={f.type}
                        value={form[f.key as keyof typeof form]}
                        onChange={e => update(f.key, e.target.value)}
                        placeholder={f.placeholder}
                        style={{ width: "100%", height: 44, paddingLeft: 40, paddingRight: 16, borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0f172a", outline: "none", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{ height: 46, borderRadius: 11, background: "linear-gradient(135deg, #2563eb, #4f46e5)", color: "#fff", fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(37,99,235,0.3)", marginTop: 6 }}
                >
                  Continue
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <form style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Create Password</label>
                </div>
                <div style={{ position: "relative" }}>
                  <LockClosedIcon style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#9ca3af" }} />
                  <input
                    type={show ? "text" : "password"}
                    value={form.password}
                    onChange={e => update("password", e.target.value)}
                    placeholder="Minimum 8 characters"
                    style={{ width: "100%", height: 44, paddingLeft: 40, paddingRight: 44, borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0f172a", outline: "none", boxSizing: "border-box" }}
                  />
                  <button type="button" onClick={() => setShow(!show)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer" }}>
                    {show ? <EyeSlashIcon style={{ width: 16, height: 16, color: "#9ca3af" }} /> : <EyeIcon style={{ width: 16, height: 16, color: "#9ca3af" }} />}
                  </button>
                </div>
              </div>

              {/* Security note */}
              <div style={{ backgroundColor: "#f0fdf4", borderRadius: 10, padding: "12px 14px", border: "1px solid #bbf7d0", display: "flex", gap: 8 }}>
                <ShieldCheckIcon style={{ width: 16, height: 16, color: "#16a34a", flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 12, color: "#15803d", margin: 0, lineHeight: 1.6 }}>
                  Your data is encrypted with 256-bit SSL. We never share your information.
                </p>
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                <button type="button" onClick={() => setStep(1)} style={{ flex: 1, height: 46, borderRadius: 11, border: "1.5px solid #e2e8f0", background: "#fff", color: "#374151", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  Back
                </button>
                <Link href="/onboarding" style={{ flex: 2, display: "flex", alignItems: "center", justifyContent: "center", height: 46, borderRadius: 11, background: "linear-gradient(135deg, #2563eb, #4f46e5)", color: "#fff", fontSize: 15, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 14px rgba(37,99,235,0.3)" }}>
                  Create Account
                </Link>
              </div>
            </form>
          )}

          <p style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", marginTop: 20, lineHeight: 1.6 }}>
            By creating an account you agree to our{" "}
            <Link href="/terms" style={{ color: "#2563eb", textDecoration: "none" }}>Terms</Link>{" & "}
            <Link href="/privacy" style={{ color: "#2563eb", textDecoration: "none" }}>Privacy Policy</Link>
          </p>

          <p style={{ fontSize: 13, color: "#64748b", textAlign: "center", marginTop: 12 }}>
            Already have an account?{" "}
            <Link href="/auth/login" style={{ color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
