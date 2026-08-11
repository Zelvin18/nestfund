"use client"

import { useState } from "react"
import Link from "next/link"
import {
  IdentificationIcon,
  WalletIcon,
  BuildingOffice2Icon,
  DevicePhoneMobileIcon,
  BuildingLibraryIcon,
  ArrowRightIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline"
import { CheckCircleIcon, CheckBadgeIcon, ShieldCheckIcon } from "@heroicons/react/24/solid"
import { useRentals } from "@/lib/hooks"
import { formatCurrency } from "@/lib/utils"

const steps = [
  { num: 1, title: "Verify Identity", icon: IdentificationIcon },
  { num: 2, title: "Fund Wallet", icon: WalletIcon },
  { num: 3, title: "First Investment", icon: BuildingOffice2Icon },
]

const quickAmounts = [50000, 100000, 250000, 500000]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
      {/* Top bar */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e8ecf0" }}>
        <div className="container" style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg, #2563eb, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, color: "#fff" }}>N</div>
            <span style={{ fontSize: 17, fontWeight: 700, color: "#0f172a" }}>NestFund</span>
          </div>
          <Link href="/home" style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8", textDecoration: "none" }}>
            Skip for now
          </Link>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 640, margin: "0 auto", padding: "36px 24px 64px" }}>
        {/* Stepper */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 36 }}>
          {steps.map((s, i) => {
            const state = step > s.num ? "done" : step === s.num ? "active" : "todo"
            return (
              <div key={s.num} style={{ display: "flex", alignItems: "center", flex: i === steps.length - 1 ? "0 0 auto" : 1 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, minWidth: 74 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    backgroundColor: state === "done" ? "#10b981" : state === "active" ? "#2563eb" : "#fff",
                    border: state === "todo" ? "2px solid #e2e8f0" : "none",
                    transition: "all 0.3s",
                  }}>
                    {state === "done"
                      ? <CheckCircleIcon style={{ width: 22, height: 22, color: "#fff" }} />
                      : <s.icon style={{ width: 19, height: 19, color: state === "active" ? "#fff" : "#94a3b8" }} />}
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: state === "active" ? 700 : 500, color: state === "active" ? "#0f172a" : state === "done" ? "#10b981" : "#94a3b8", whiteSpace: "nowrap" }}>
                    {s.title}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ flex: 1, height: 2, borderRadius: 99, margin: "0 10px 24px", backgroundColor: step > s.num ? "#10b981" : "#e2e8f0", transition: "background-color 0.3s" }} />
                )}
              </div>
            )
          })}
        </div>

        {step === 1 && <VerifyStep onNext={() => setStep(2)} />}
        {step === 2 && <FundStep onNext={() => setStep(3)} onSkip={() => setStep(3)} />}
        {step === 3 && <InvestStep />}
      </div>
    </div>
  )
}

/* ── Shared card wrapper ── */
function StepCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: "#fff", borderRadius: 18, border: "1px solid #e8ecf0", padding: "clamp(22px, 4vw, 32px)", animation: "fade-up 0.35s ease-out" }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 6px 0", letterSpacing: "-0.4px" }}>{title}</h1>
      <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 24px 0", lineHeight: 1.6 }}>{subtitle}</p>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", border: "1.5px solid #e2e8f0", borderRadius: 11,
  padding: "12px 15px", fontSize: 14, fontWeight: 500, color: "#0f172a", outline: "none",
}

const labelStyle: React.CSSProperties = {
  fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 7,
}

/* ── Step 1: KYC ── */
function VerifyStep({ onNext }: { onNext: () => void }) {
  const [name, setName] = useState("")
  const [nin, setNin] = useState("")
  const [phone, setPhone] = useState("")
  const canContinue = name.trim().length >= 3 && nin.trim().length >= 8 && phone.replace(/\D/g, "").length >= 9

  return (
    <StepCard title="Verify your identity" subtitle="Required by the Capital Markets Authority before you can invest. Takes about a minute.">
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Full Legal Name</label>
        <input style={inputStyle} placeholder="As it appears on your ID" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>National ID Number (NIN)</label>
        <input style={inputStyle} placeholder="e.g. CM93052104XXXX" value={nin} onChange={e => setNin(e.target.value)} />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Phone Number</label>
        <input style={inputStyle} inputMode="tel" placeholder="+256 7XX XXX XXX" value={phone} onChange={e => setPhone(e.target.value)} />
      </div>

      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, backgroundColor: "#f0fdf4", border: "1px solid #dcfce7", borderRadius: 11, padding: "10px 14px", marginBottom: 22 }}>
        <ShieldCheckIcon style={{ width: 15, height: 15, color: "#16a34a", flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 11.5, color: "#166534", margin: 0, lineHeight: 1.55 }}>
          Your details are encrypted and verified against the national registry. Most verifications complete instantly.
        </p>
      </div>

      <button
        onClick={() => canContinue && onNext()}
        disabled={!canContinue}
        style={{
          width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
          background: canContinue ? "linear-gradient(135deg, #2563eb, #4f46e5)" : "#e2e8f0",
          color: canContinue ? "#fff" : "#94a3b8",
          fontSize: 15, fontWeight: 700, cursor: canContinue ? "pointer" : "not-allowed",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
        }}
      >
        Verify & Continue
        <ArrowRightIcon style={{ width: 16, height: 16 }} />
      </button>
    </StepCard>
  )
}

/* ── Step 2: Fund wallet ── */
function FundStep({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  const [amount, setAmount] = useState(100000)
  const [method, setMethod] = useState<"mtn" | "airtel" | "bank">("mtn")

  const methods = [
    { key: "mtn" as const,    label: "MTN Mobile Money", icon: DevicePhoneMobileIcon, bg: "linear-gradient(135deg, #fbbf24, #f59e0b)", text: "#422006" },
    { key: "airtel" as const, label: "Airtel Money",     icon: DevicePhoneMobileIcon, bg: "linear-gradient(135deg, #ef4444, #b91c1c)", text: "#fff" },
    { key: "bank" as const,   label: "Bank Transfer",    icon: BuildingLibraryIcon,   bg: "linear-gradient(135deg, #3b82f6, #1d4ed8)", text: "#fff" },
  ]

  return (
    <StepCard title="Fund your wallet" subtitle="Add money so you're ready to invest. You can start with as little as UGX 50,000.">
      <label style={labelStyle}>Amount</label>
      <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "13px 16px", marginBottom: 10 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#94a3b8", marginRight: 8 }}>UGX</span>
        <input
          type="text"
          inputMode="numeric"
          value={amount.toLocaleString()}
          onChange={e => {
            const n = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10)
            setAmount(isNaN(n) ? 0 : Math.min(n, 100000000))
          }}
          style={{ flex: 1, border: "none", outline: "none", fontSize: 20, fontWeight: 800, color: "#0f172a", minWidth: 0, background: "transparent" }}
        />
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 22 }}>
        {quickAmounts.map(a => (
          <button key={a} onClick={() => setAmount(a)} style={{
            padding: "6px 12px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer",
            border: amount === a ? "1.5px solid #2563eb" : "1.5px solid #e8ecf0",
            backgroundColor: amount === a ? "#eff6ff" : "#fff",
            color: amount === a ? "#2563eb" : "#64748b",
          }}>
            {a >= 1000000 ? `${a / 1000000}M` : `${a / 1000}K`}
          </button>
        ))}
      </div>

      <label style={labelStyle}>Pay with</label>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
        {methods.map(m => {
          const active = method === m.key
          return (
            <button key={m.key} onClick={() => setMethod(m.key)} style={{
              display: "flex", alignItems: "center", gap: 12, textAlign: "left",
              padding: "11px 13px", borderRadius: 12, cursor: "pointer",
              border: active ? "1.5px solid #2563eb" : "1.5px solid #eef1f5",
              backgroundColor: active ? "#f6f9ff" : "#fff",
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: m.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <m.icon style={{ width: 17, height: 17, color: m.text }} />
              </div>
              <span style={{ flex: 1, fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>{m.label}</span>
              <div style={{ width: 18, height: 18, borderRadius: "50%", flexShrink: 0, border: active ? "5.5px solid #2563eb" : "2px solid #cbd5e1", boxSizing: "border-box" }} />
            </button>
          )
        })}
      </div>

      <button
        onClick={onNext}
        disabled={amount < 50000}
        style={{
          width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
          background: amount >= 50000 ? "linear-gradient(135deg, #2563eb, #4f46e5)" : "#e2e8f0",
          color: amount >= 50000 ? "#fff" : "#94a3b8",
          fontSize: 15, fontWeight: 700, cursor: amount >= 50000 ? "pointer" : "not-allowed",
          marginBottom: 12,
        }}
      >
        Deposit UGX {amount.toLocaleString()}
      </button>
      <button onClick={onSkip} style={{ width: "100%", padding: "10px 0", borderRadius: 12, border: "none", background: "none", color: "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
        I&apos;ll fund my wallet later
      </button>
    </StepCard>
  )
}

/* ── Step 3: First investment ── */
function InvestStep() {
  const { rentals } = useRentals()
  const picks = rentals.filter(p => p.status === "Live").slice(0, 3)

  return (
    <StepCard title="You're all set — pick your first property" subtitle="These verified properties are popular with first-time investors. One share is all it takes to start earning.">
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
        {picks.map(p => (
          <Link key={p.id} href={`/property/${p.id}`} style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, border: "1.5px solid #eef1f5", borderRadius: 14, padding: 12, transition: "border-color 0.15s", cursor: "pointer" }}>
              <div style={{ width: 76, height: 60, borderRadius: 10, overflow: "hidden", flexShrink: 0, backgroundColor: "#f1f5f9" }}>
                <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                  <CheckBadgeIcon style={{ width: 14, height: 14, color: "#10b981", flexShrink: 0 }} />
                </div>
                <p style={{ fontSize: 11.5, color: "#94a3b8", margin: "0 0 3px 0", display: "flex", alignItems: "center", gap: 3 }}>
                  <MapPinIcon style={{ width: 11, height: 11 }} />{p.location}
                </p>
                <p style={{ fontSize: 12, margin: 0 }}>
                  <span style={{ fontWeight: 700, color: "#0f172a" }}>UGX {formatCurrency(p.pricePerShare)}</span>
                  <span style={{ color: "#94a3b8" }}>/share · </span>
                  <span style={{ fontWeight: 700, color: "#10b981" }}>{p.rentalYield}% yield</span>
                </p>
              </div>
              <ArrowRightIcon style={{ width: 16, height: 16, color: "#cbd5e1", flexShrink: 0 }} />
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/home"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          width: "100%", padding: "14px 0", borderRadius: 12, boxSizing: "border-box",
          background: "linear-gradient(135deg, #2563eb, #4f46e5)",
          color: "#fff", fontSize: 15, fontWeight: 700, textDecoration: "none",
        }}
      >
        Go to My Dashboard
        <ArrowRightIcon style={{ width: 16, height: 16 }} />
      </Link>
    </StepCard>
  )
}
