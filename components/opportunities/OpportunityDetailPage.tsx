"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeftIcon, ArrowRightIcon, ArrowDownIcon,
  ShieldCheckIcon, DocumentTextIcon, ExclamationTriangleIcon,
  BanknotesIcon, XMarkIcon,
} from "@heroicons/react/24/outline"
import { CheckCircleIcon } from "@heroicons/react/24/solid"
import { useOpportunities, useSession, useWallet } from "@/lib/hooks"
import { purchaseShares } from "@/lib/ledger"
import {
  categoryMeta, fundingProgress, displayStatus, returnLabel,
  type Opportunity,
} from "@/lib/data/opportunities"
import OpportunityCard from "@/components/opportunities/OpportunityCard"
import StickyBuyBar from "@/components/property/StickyBuyBar"

const fmtUGX = (n: number) => `UGX ${n.toLocaleString()}`

/* The capital journey — how investors make money, always visible */
const moneyFlow = (o: Opportunity) => [
  { label: "Investor Capital", desc: `Pooled from investors (min ${fmtUGX(o.minInvestment)})` },
  { label: "Deployed to the Opportunity", desc: o.subcategory },
  { label: "Revenue Generated", desc: o.revenueModel },
  { label: "Repayment / Exit", desc: o.expectedExit },
  { label: "Investor Return", desc: `Target ${returnLabel(o)} — not guaranteed` },
]

export default function OpportunityDetailPage({ id }: { id: string }) {
  const { opportunities } = useOpportunities()
  const opportunity = opportunities.find(o => o.id === id)
  const [investOpen, setInvestOpen] = useState(false)
  const widgetRef = useRef<HTMLDivElement>(null)

  if (!opportunity) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <p style={{ color: "#64748b" }}>Opportunity not found</p>
    </div>
  )

  const o = opportunity
  const cat = categoryMeta(o.category)
  const progress = fundingProgress(o)
  const status = displayStatus(o)
  const related = opportunities.filter(r => r.category === o.category && r.id !== o.id).slice(0, 3)
  const investable = status === "Open" || status === "Almost Funded"

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f6f8" }}>

      {/* Breadcrumb */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e8ecf0" }}>
        <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 48, display: "flex", alignItems: "center", gap: 6 }}>
          <Link href="/opportunities" style={{ fontSize: 13, color: "#64748b", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
            <ArrowLeftIcon style={{ width: 14, height: 14 }} />Opportunities
          </Link>
          <span style={{ fontSize: 13, color: "#c4cad4" }}>/</span>
          <span style={{ fontSize: 13, color: "#0f172a", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{o.title}</span>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px 48px" }}>
        <div className="property-detail-grid">

          {/* ── Hero image ── */}
          <div className="pd-gallery">
            <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", height: 300 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={o.image} alt={o.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)" }} />
              <div style={{ position: "absolute", top: 14, left: 14, display: "flex", gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", backgroundColor: cat.accent, padding: "4px 12px", borderRadius: 99, textTransform: "uppercase", letterSpacing: "0.04em" }}>{cat.label}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#0f172a", backgroundColor: "rgba(255,255,255,0.92)", padding: "4px 12px", borderRadius: 99 }}>{status}</span>
              </div>
              <div style={{ position: "absolute", left: 18, bottom: 16, right: 18 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.75)", margin: "0 0 3px 0" }}>{o.subcategory} · {o.location}</p>
                <h1 style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.5px" }}>{o.title}</h1>
              </div>
            </div>
          </div>

          {/* ── Content ── */}
          <div className="pd-content">

            {/* About */}
            <Section title="About This Opportunity">
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.75, margin: "0 0 14px 0" }}>{o.description}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", gap: 10 }}>
                {[
                  { label: "Operator", value: o.operator },
                  { label: "Location", value: o.location },
                  { label: "Expected exit", value: o.expectedExit },
                ].map(r => (
                  <div key={r.label} style={{ backgroundColor: "#f8fafc", borderRadius: 10, padding: "10px 14px" }}>
                    <p style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, margin: "0 0 3px 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>{r.label}</p>
                    <p style={{ fontSize: 13, fontWeight: 650, color: "#0f172a", margin: 0, lineHeight: 1.45 }}>{r.value}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* How investors make money */}
            <Section title="How Investors Make Money">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}>
                {moneyFlow(o).map((step, i, arr) => (
                  <div key={step.label}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, backgroundColor: i === 0 || i === arr.length - 1 ? cat.accentBg : "#f8fafc", border: `1px solid ${i === 0 || i === arr.length - 1 ? cat.accent + "30" : "#eef1f5"}`, borderRadius: 12, padding: "12px 16px" }}>
                      <div style={{ width: 26, height: 26, borderRadius: "50%", backgroundColor: cat.accent, color: "#fff", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                      <div>
                        <p style={{ fontSize: 13.5, fontWeight: 750, color: "#0f172a", margin: "0 0 2px 0" }}>{step.label}</p>
                        <p style={{ fontSize: 12.5, color: "#64748b", margin: 0, lineHeight: 1.55 }}>{step.desc}</p>
                      </div>
                    </div>
                    {i < arr.length - 1 && (
                      <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
                        <ArrowDownIcon style={{ width: 14, height: 14, color: "#cbd5e1" }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>

            {/* Security & protection */}
            {o.security.length > 0 && (
              <Section title="Security & Protection">
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {o.security.map(s => (
                    <div key={s} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <ShieldCheckIcon style={{ width: 17, height: 17, color: "#16a34a", flexShrink: 0 }} />
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: "#374151" }}>{s}</span>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 11.5, color: "#94a3b8", margin: "12px 0 0 0", lineHeight: 1.6 }}>
                  Security mechanisms reduce risk — they do not eliminate it. No return on this platform is guaranteed.
                </p>
              </Section>
            )}

            {/* Risks — never hidden */}
            <Section title="Understand the Risks" icon={<ExclamationTriangleIcon style={{ width: 17, height: 17, color: "#d97706" }} />}>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                {o.risks.map(r => (
                  <div key={r} style={{ display: "flex", alignItems: "flex-start", gap: 9, backgroundColor: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "10px 14px" }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: "#d97706", flexShrink: 0, marginTop: 7 }} />
                    <span style={{ fontSize: 13, color: "#78350f", lineHeight: 1.55 }}>{r}</span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: "12px 0 0 0", lineHeight: 1.6 }}>
                All investments carry risk, including the possible loss of capital. Target returns are projections, not promises. Invest only what you can afford to commit for the stated duration.
              </p>
            </Section>

            {/* Documents */}
            <Section title="Verification Documents" icon={<DocumentTextIcon style={{ width: 17, height: 17, color: "#64748b" }} />}>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65, margin: 0 }}>
                Contracts, invoices, company records and other verification documents are made available to committed investors after investment.
                {o.demo && " This sample record has no real documents."}
              </p>
            </Section>
          </div>

          {/* ── Invest widget ── */}
          <div className="buy-widget-col" style={{ minWidth: 0 }} ref={widgetRef}>
            <div className="buy-widget-sticky">
              <div style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                {/* Header */}
                <div style={{ position: "relative", overflow: "hidden", padding: "16px 20px" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={o.image} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: `linear-gradient(120deg, ${cat.accent}ee 0%, ${cat.accent}cc 60%, ${cat.accent}aa 100%)` }} />
                  <div style={{ position: "relative" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.75)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px 0" }}>Target Return</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <p style={{ fontSize: 24, fontWeight: 900, color: "#fff", margin: 0, letterSpacing: "-0.4px" }}>{returnLabel(o)}</p>
                      <span style={{ fontSize: 10, fontWeight: 800, color: "#fff", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 99, padding: "3px 10px" }}>{o.riskLevel} risk</span>
                    </div>
                  </div>
                </div>

                <div style={{ padding: "18px 20px" }}>
                  {/* Funding progress */}
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Funded</span>
                      <span style={{ fontSize: 11, fontWeight: 800, color: "#0f172a" }}>{progress}%</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 99, backgroundColor: "#f1f5f9", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${progress}%`, borderRadius: 99, backgroundColor: cat.accent }} />
                    </div>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: "4px 0 0 0" }}>
                      {fmtUGX(o.fundingReceived)} of {fmtUGX(o.fundingRequired)}
                    </p>
                  </div>

                  {/* Key facts */}
                  <div style={{ border: "1px solid #f1f4f8", borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
                    {[
                      { label: "Minimum investment", value: fmtUGX(o.minInvestment) },
                      { label: "Duration", value: o.durationLabel },
                      { label: "Target return", value: returnLabel(o) },
                      { label: "Expected exit", value: o.expectedExit },
                    ].map((r, i) => (
                      <div key={r.label} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "9px 14px", backgroundColor: i % 2 === 0 ? "#fff" : "#fafafa", borderBottom: i < 3 ? "1px solid #f8f9fb" : "none" }}>
                        <span style={{ fontSize: 12, color: "#64748b", flexShrink: 0 }}>{r.label}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", textAlign: "right" }}>{r.value}</span>
                      </div>
                    ))}
                  </div>

                  {investable ? (
                    <button onClick={() => setInvestOpen(true)}
                      style={{ width: "100%", padding: "13px 0", borderRadius: 11, background: cat.accent, color: "#fff", fontSize: 14, fontWeight: 750, border: "none", cursor: "pointer", boxShadow: `0 4px 14px ${cat.accent}50`, marginBottom: 12 }}>
                      Invest Now
                    </button>
                  ) : (
                    <div style={{ textAlign: "center", padding: "12px 0", borderRadius: 11, backgroundColor: "#f1f5f9", color: "#64748b", fontSize: 13.5, fontWeight: 700, marginBottom: 12 }}>
                      {status} — not open for investment
                    </div>
                  )}

                  <div style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "center" }}>
                    <ShieldCheckIcon style={{ width: 13, height: 13, color: "#16a34a" }} />
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>Verified opportunity · Investments carry risk</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky mini invest-bar (mobile) — appears after scrolling past the widget */}
        {investable && (
          <StickyBuyBar
            targetRef={widgetRef}
            price={`${returnLabel(o)} target`}
            sub={`min ${fmtUGX(o.minInvestment)} · ${o.durationLabel}`}
            cta="Invest Now"
            accent={cat.accent}
            onClick={() => setInvestOpen(true)}
          />
        )}

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop: 36 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: cat.accent, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 5px 0" }}>More in {cat.label}</p>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.4px", margin: "0 0 18px 0" }}>Similar Opportunities</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))", gap: 18 }}>
              {related.map(r => <OpportunityCard key={r.id} opportunity={r} />)}
            </div>
          </div>
        )}
      </div>

      {investOpen && <InvestModal opportunity={o} onClose={() => setInvestOpen(false)} />}
    </div>
  )
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: "#fff", borderRadius: 14, border: "1px solid #e8ecf0", padding: "20px 22px" }}>
      <h2 style={{ fontSize: 16, fontWeight: 750, color: "#0f172a", margin: "0 0 14px 0", display: "flex", alignItems: "center", gap: 8 }}>
        {icon}{title}
      </h2>
      {children}
    </div>
  )
}

/* ── 3-step invest flow: amount → review → confirm → success ── */

function InvestModal({ opportunity: o, onClose }: { opportunity: Opportunity; onClose: () => void }) {
  const router = useRouter()
  const cat = categoryMeta(o.category)
  const { user } = useSession()
  const { balance, live } = useWallet(user)
  const [step, setStep] = useState<"amount" | "review" | "success">("amount")
  const [amount, setAmount] = useState(o.minInvestment)
  const [agreed, setAgreed] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [receipt, setReceipt] = useState<string | null>(null)

  const units = Math.max(1, Math.floor(amount / o.unitPrice))
  const actualAmount = units * o.unitPrice
  const projectedMin = Math.round(actualAmount * (1 + o.targetReturnMin / 100))
  const projectedMax = Math.round(actualAmount * (1 + o.targetReturnMax / 100))
  const validAmount = amount >= o.minInvestment

  const confirm = async () => {
    if (!agreed || busy) return
    if (!user) { router.push("/auth/login"); return }
    setBusy(true)
    setError(null)
    try {
      const { ref } = await purchaseShares({
        userId: user.id,
        propertyId: o.id,
        propertyName: o.title,
        units,
        pricePerShare: o.unitPrice,
      })
      setReceipt(ref)
      setStep("success")
    } catch (err) {
      const raw = err instanceof Error ? err.message : "Investment failed — please try again."
      setError(raw.replace(/^INSUFFICIENT_FUNDS:/, ""))
    }
    setBusy(false)
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 100, backgroundColor: "rgba(10,22,40,0.55)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ backgroundColor: "#fff", borderRadius: 20, width: "100%", maxWidth: 460, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.35)", animation: "modal-in 0.25s ease-out" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "22px 24px 0" }}>
          <div>
            <h2 style={{ fontSize: 19, fontWeight: 800, color: "#0f172a", margin: "0 0 3px 0", letterSpacing: "-0.3px" }}>
              {step === "amount" ? "Enter Investment Amount" : step === "review" ? "Review & Confirm" : "Investment Submitted"}
            </h2>
            <p style={{ fontSize: 12.5, color: "#94a3b8", margin: 0 }}>{o.title}</p>
          </div>
          <button onClick={onClose} style={{ background: "#f4f6f9", border: "none", borderRadius: 9, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <XMarkIcon style={{ width: 17, height: 17, color: "#64748b" }} />
          </button>
        </div>

        <div style={{ padding: "20px 24px 24px" }}>

          {step === "amount" && (
            <>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 8 }}>Amount</label>
              <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "13px 16px", marginBottom: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#94a3b8", marginRight: 8 }}>UGX</span>
                <input
                  type="text" inputMode="numeric" value={amount.toLocaleString()}
                  onChange={e => { const n = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10); setAmount(isNaN(n) ? 0 : Math.min(n, 10_000_000_000)) }}
                  style={{ flex: 1, border: "none", outline: "none", fontSize: 20, fontWeight: 800, color: "#0f172a", minWidth: 0, background: "transparent" }}
                />
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                {[o.minInvestment, 500_000, 1_000_000, 5_000_000].filter((v, i, a) => a.indexOf(v) === i).map(a2 => (
                  <button key={a2} onClick={() => setAmount(a2)} style={{ padding: "6px 12px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer", border: amount === a2 ? `1.5px solid ${cat.accent}` : "1.5px solid #e8ecf0", backgroundColor: amount === a2 ? cat.accentBg : "#fff", color: amount === a2 ? cat.accent : "#64748b" }}>
                    {a2 >= 1_000_000 ? `${a2 / 1_000_000}M` : `${a2 / 1_000}K`}
                  </button>
                ))}
              </div>

              <div style={{ backgroundColor: "#f8fafc", borderRadius: 12, padding: "12px 16px", marginBottom: 16 }}>
                {[
                  { label: "Minimum investment", value: fmtUGX(o.minInvestment) },
                  { label: "Units", value: `${units.toLocaleString()} × ${fmtUGX(o.unitPrice)}` },
                  { label: "Projected value at exit", value: `${fmtUGX(projectedMin)} – ${fmtUGX(projectedMax)}` },
                  { label: "Estimated maturity", value: o.expectedExit },
                ].map(r => (
                  <div key={r.label} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "3px 0" }}>
                    <span style={{ fontSize: 12.5, color: "#64748b", flexShrink: 0 }}>{r.label}</span>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "#0f172a", textAlign: "right" }}>{r.value}</span>
                  </div>
                ))}
              </div>
              {!validAmount && amount > 0 && (
                <p style={{ fontSize: 12, fontWeight: 600, color: "#b45309", margin: "0 0 12px 0" }}>Minimum investment is {fmtUGX(o.minInvestment)}.</p>
              )}
              <button onClick={() => validAmount && setStep("review")} disabled={!validAmount}
                style={{ width: "100%", padding: "14px 0", borderRadius: 12, border: "none", background: validAmount ? cat.accent : "#e2e8f0", color: validAmount ? "#fff" : "#94a3b8", fontSize: 15, fontWeight: 750, cursor: validAmount ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                Review Investment<ArrowRightIcon style={{ width: 15, height: 15 }} />
              </button>
            </>
          )}

          {step === "review" && (
            <>
              <div style={{ backgroundColor: "#f8fafc", borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
                {[
                  { label: "Investment", value: fmtUGX(actualAmount), bold: true },
                  { label: "Opportunity", value: o.title },
                  { label: "Category", value: `${cat.label} · ${o.subcategory}` },
                  { label: "Duration", value: o.durationLabel },
                  { label: "Target return", value: `${returnLabel(o)} (projected, not guaranteed)` },
                  { label: "Projected proceeds", value: `${fmtUGX(projectedMin)} – ${fmtUGX(projectedMax)}` },
                  { label: "Fees", value: "None at investment" },
                ].map(r => (
                  <div key={r.label} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "4px 0" }}>
                    <span style={{ fontSize: 12.5, color: "#64748b", flexShrink: 0 }}>{r.label}</span>
                    <span style={{ fontSize: r.bold ? 14.5 : 12.5, fontWeight: r.bold ? 800 : 700, color: "#0f172a", textAlign: "right", lineHeight: 1.4 }}>{r.value}</span>
                  </div>
                ))}
              </div>

              {user && live && balance !== null && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, backgroundColor: balance >= actualAmount ? "#f0fdf4" : "#fffbeb", border: `1px solid ${balance >= actualAmount ? "#bbf7d0" : "#fde68a"}`, borderRadius: 10, padding: "9px 14px", marginBottom: 14 }}>
                  <BanknotesIcon style={{ width: 16, height: 16, color: balance >= actualAmount ? "#16a34a" : "#d97706", flexShrink: 0 }} />
                  <p style={{ fontSize: 12, fontWeight: 600, color: balance >= actualAmount ? "#166534" : "#78350f", margin: 0 }}>
                    Wallet balance: {fmtUGX(balance)}{balance < actualAmount && " — top up before confirming"}
                  </p>
                </div>
              )}

              {/* Key risks — repeated at the point of commitment */}
              <div style={{ backgroundColor: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "10px 14px", marginBottom: 14 }}>
                <p style={{ fontSize: 11, fontWeight: 800, color: "#92400e", margin: "0 0 5px 0", textTransform: "uppercase", letterSpacing: "0.04em" }}>Important risks</p>
                {o.risks.slice(0, 3).map(r => (
                  <p key={r} style={{ fontSize: 12, color: "#78350f", margin: "0 0 3px 0", lineHeight: 1.5 }}>· {r}</p>
                ))}
              </div>

              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", marginBottom: 14 }}>
                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 3, width: 15, height: 15, accentColor: cat.accent }} />
                <span style={{ fontSize: 12.5, color: "#374151", lineHeight: 1.6 }}>
                  I have reviewed this opportunity, I understand the risks including possible loss of capital, and I agree to the <Link href="/terms" style={{ color: cat.accent, fontWeight: 700 }}>investment terms</Link>.
                </span>
              </label>

              {error && (
                <p style={{ fontSize: 12.5, fontWeight: 600, color: "#b45309", backgroundColor: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "10px 14px", margin: "0 0 14px 0", lineHeight: 1.55 }}>
                  {error}{error.includes("Wallet") && <>{" "}<Link href="/wallet" style={{ color: "#b45309", fontWeight: 800 }}>Open Wallet</Link></>}
                </p>
              )}

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setStep("amount")} style={{ flex: 1, padding: "13px 0", borderRadius: 12, border: "1.5px solid #e2e8f0", background: "#fff", color: "#374151", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Back</button>
                <button onClick={confirm} disabled={!agreed || busy}
                  style={{ flex: 2, padding: "13px 0", borderRadius: 12, border: "none", background: agreed && !busy ? cat.accent : "#e2e8f0", color: agreed && !busy ? "#fff" : "#94a3b8", fontSize: 14, fontWeight: 750, cursor: agreed && !busy ? "pointer" : "not-allowed" }}>
                  {busy ? "Processing..." : user ? "Confirm Investment" : "Sign In to Confirm"}
                </button>
              </div>
            </>
          )}

          {step === "success" && (
            <div style={{ textAlign: "center", padding: "8px 0 4px" }}>
              <CheckCircleIcon style={{ width: 62, height: 62, color: "#16a34a", margin: "0 auto 14px" }} />
              <p style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", margin: "0 0 4px 0", letterSpacing: "-0.4px" }}>{fmtUGX(actualAmount)}</p>
              <p style={{ fontSize: 13.5, color: "#64748b", margin: "0 0 4px 0", lineHeight: 1.6 }}>
                invested in <strong style={{ color: "#0f172a" }}>{o.title}</strong>
              </p>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 18px 0" }}>
                Duration {o.durationLabel} · Projected {fmtUGX(projectedMin)}–{fmtUGX(projectedMax)} · Ref {receipt}
              </p>
              <Link href="/portfolio" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "13px 28px", borderRadius: 12, background: cat.accent, color: "#fff", fontSize: 14.5, fontWeight: 750, textDecoration: "none" }}>
                View My Portfolio<ArrowRightIcon style={{ width: 15, height: 15 }} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
