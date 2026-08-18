"use client"

import Link from "next/link"
import { ArrowRightIcon, ArrowDownIcon, SparklesIcon } from "@heroicons/react/24/outline"
import { CheckBadgeIcon, ShieldCheckIcon } from "@heroicons/react/24/solid"

/* ── Inline SVG icons (match landing page style) ── */
const IconLand = () => <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>
const IconTower = () => <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
const IconHardHat = () => <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M2 18a1 1 0 001 1h18a1 1 0 001-1v-2a1 1 0 00-1-1H3a1 1 0 00-1 1v2z" /><path d="M4 15v-3a8 8 0 0116 0v3" /><path d="M10 6.5V4a1 1 0 011-1h2a1 1 0 011 1v2.5" /></svg>
const IconCapital = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
const IconUsers = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
const IconChart = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
const IconShield = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>

/* Uniform grey icon tiles — one calm color, no rainbow */
const iconTile = { bg: "#f1f5f9", color: "#64748b" }

const submitTypes = [
  { icon: IconCapital, title: "Contracts & Invoices", desc: "Have a signed contract, LPO or invoice and need capital to execute or bridge payment?", cta: "Apply for Funding", type: "contract-financing" },
  { icon: IconLand, title: "Trade & Working Capital", desc: "Run a trading or production business that needs stock, inputs or working capital to grow?", cta: "Apply for Funding", type: "trade-financing" },
  { icon: IconHardHat, title: "Assets & Equipment", desc: "Need a truck, machinery or equipment that will generate income once it's working?", cta: "Apply for Funding", type: "asset-financing" },
  { icon: IconTower, title: "Property & Development", desc: "Own land, income property, or a development project that needs construction capital?", cta: "Submit Project", type: "apartment-development" },
]

const steps = [
  { num: "01", title: "Apply", desc: "Tell us about your business or project — what the capital is for, the contract or asset behind it, and how it will be repaid." },
  { num: "02", title: "Vetting & Due Diligence", desc: "NestFund verifies your business, documents, contracts and financials with independent partners. Not every application qualifies — that protects everyone." },
  { num: "03", title: "Risk Assessment", desc: "We evaluate the revenue model, repayment source, security, market conditions and execution risk." },
  { num: "04", title: "Listed as an Opportunity", desc: "If approved, your opportunity is prepared and listed on the marketplace for investors, subject to the applicable legal and regulatory framework." },
]

const benefits = [
  { icon: IconCapital, title: "Access Capital", desc: "Connect your business with thousands of investors actively looking for productive opportunities to fund." },
  { icon: IconUsers, title: "Reach More Investors", desc: "Present your opportunity to NestFund's investment audience across Uganda and East Africa." },
  { icon: IconShield, title: "Build Credibility", desc: "Every listing passes NestFund's vetting and due-diligence process — a trust signal investors recognise." },
  { icon: IconChart, title: "Data & Analytics", desc: "See investor interest, funding progress and repayment tracking for your opportunity in real time." },
]

const scoreBars = [
  { label: "Repayment Source", value: 88 },
  { label: "Business Track Record", value: 84 },
  { label: "Security & Collateral", value: 79 },
  { label: "Execution Risk", value: 74 },
  { label: "Opportunity Economics", value: 86 },
]

export default function DevelopersPage() {
  return (
    <div style={{ backgroundColor: "#fff" }}>

      {/* ══ HERO ══ */}
      <section style={{ position: "relative", overflow: "hidden", backgroundColor: "#0a1628", padding: "84px 24px 72px" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1800&q=80"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(8,18,36,0.96) 0%, rgba(10,26,54,0.9) 50%, rgba(12,30,62,0.78) 100%)" }} />
        </div>

        <div style={{ position: "relative", maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <p style={{ fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,0.55)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 18px 0" }}>
            For Businesses
          </p>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 400, lineHeight: 1.16, letterSpacing: "-0.4px", color: "rgba(255,255,255,0.88)", margin: "0 0 8px 0" }}>
            Turn your business into
          </h1>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 700, lineHeight: 1.16, letterSpacing: "-0.4px", color: "#fff", margin: "0 0 22px 0" }}>
            an investment opportunity.
          </h1>
          <p style={{ fontSize: 16.5, color: "rgba(255,255,255,0.6)", maxWidth: 560, margin: "0 auto 34px", lineHeight: 1.75 }}>
            Need capital to execute a contract, finance stock, buy equipment, or fund a
            development? Eligible businesses apply, NestFund vets every application, and
            approved opportunities are listed for investors to fund.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
            <Link href="/developers/apply" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 30px", borderRadius: 11, background: "linear-gradient(135deg, #0d9488, #0f766e)", color: "#fff", fontSize: 15, fontWeight: 700, textDecoration: "none", boxShadow: "0 8px 28px rgba(13,148,136,0.4)" }}>
              Apply for Funding
              <ArrowRightIcon style={{ width: 17, height: 17 }} />
            </Link>
            <a href="#how-it-works" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 24px", borderRadius: 11, border: "1.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.9)", fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
              How it works
              <ArrowDownIcon style={{ width: 15, height: 15 }} />
            </a>
          </div>

          {/* Audience strip */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {["Contractors & Suppliers", "Traders", "Transport & Equipment Operators", "Developers", "Growing Businesses"].map(a => (
              <span key={a} style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.65)", backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 99, padding: "7px 16px" }}>
                {a}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ TAGLINE ══ */}
      <section style={{ backgroundColor: "#f8fafc", padding: "44px 24px", textAlign: "center" }}>
        <p style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", margin: 0 }}>
          Apply. <span style={{ color: "#0d9488" }}>Get vetted.</span> Get funded. <span style={{ color: "#2563eb" }}>Deliver.</span>
        </p>
      </section>

      {/* ══ WHAT CAN YOU SUBMIT ══ */}
      <section style={{ backgroundColor: "#fff", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#0d9488", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>What Qualifies</p>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.8px", margin: "0 0 12px 0" }}>
              What can you bring to NestFund?
            </h2>
            <p style={{ fontSize: 16, color: "#64748b", maxWidth: 520, margin: "0 auto" }}>
              Contracts, trade, assets, property — one application process, one vetting standard.
            </p>
          </div>

          <div className="trust-features-grid">
            {submitTypes.map(t => (
              <Link key={t.title} href={`/developers/apply?type=${t.type}`} style={{ textDecoration: "none" }}>
                <div style={{ backgroundColor: "#fff", borderRadius: 16, padding: "26px 22px", border: "1.5px solid #f1f5f9", height: "100%", boxSizing: "border-box", transition: "all 0.2s", cursor: "pointer" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "0 8px 28px rgba(15,23,42,0.1)"; el.style.borderColor = "#cbd5e1"; el.style.transform = "translateY(-3px)" }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "none"; el.style.borderColor = "#f1f5f9"; el.style.transform = "translateY(0)" }}>
                  <div style={{ width: 46, height: 46, borderRadius: 13, backgroundColor: iconTile.bg, display: "flex", alignItems: "center", justifyContent: "center", color: iconTile.color, marginBottom: 16 }}>
                    <t.icon />
                  </div>
                  <h3 style={{ fontSize: 16.5, fontWeight: 700, color: "#0f172a", margin: "0 0 8px 0" }}>{t.title}</h3>
                  <p style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.65, margin: "0 0 14px 0" }}>{t.desc}</p>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 700, color: "#2563eb" }}>
                    {t.cta} <ArrowRightIcon style={{ width: 13, height: 13 }} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section id="how-it-works" style={{ background: "linear-gradient(135deg, #0f172a 0%, #134e4a 100%)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#2dd4bf", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>The Process</p>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.8px", margin: "0 0 12px 0" }}>
              How NestFund works with businesses
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", maxWidth: 500, margin: "0 auto" }}>
              From application to a live, investable opportunity — every listing is vetted first.
            </p>
          </div>

          <div className="steps-grid">
            {steps.map(s => (
              <div key={s.num} style={{ backgroundColor: "rgba(255,255,255,0.06)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "24px 20px" }}>
                <span style={{ fontSize: 26, fontWeight: 900, color: "rgba(45,212,191,0.35)", letterSpacing: "-0.5px", display: "block", marginBottom: 12 }}>{s.num}</span>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: "0 0 8px 0" }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ NESTFUND SCORE + VERIFICATION ══ */}
      <section style={{ backgroundColor: "#f8fafc", padding: "76px 24px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))", gap: 24, alignItems: "stretch" }}>

            {/* Score demo */}
            <div style={{ backgroundColor: "#fff", borderRadius: 20, border: "1.5px solid #eef1f5", padding: "30px 30px 26px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                <SparklesIcon style={{ width: 17, height: 17, color: "#7c3aed" }} />
                <p style={{ fontSize: 12, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>NestFund Investment Score</p>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 20 }}>
                <span style={{ fontSize: 52, fontWeight: 900, color: "#0f172a", letterSpacing: "-2px", lineHeight: 1 }}>82</span>
                <span style={{ fontSize: 18, fontWeight: 600, color: "#94a3b8" }}>/ 100</span>
                <span style={{ marginLeft: "auto", fontSize: 11.5, fontWeight: 700, color: "#16a34a", backgroundColor: "#f0fdf4", border: "1px solid #dcfce7", borderRadius: 99, padding: "5px 13px" }}>Strong Potential</span>
              </div>
              {scoreBars.map(b => (
                <div key={b.label} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: "#46536b" }}>{b.label}</span>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "#0f172a" }}>{b.value}/100</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 99, backgroundColor: "#f1f5f9", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${b.value}%`, borderRadius: 99, background: b.value >= 85 ? "#10b981" : b.value >= 75 ? "#2563eb" : "#f59e0b" }} />
                  </div>
                </div>
              ))}
              <p style={{ fontSize: 11, color: "#94a3b8", margin: "16px 0 0 0", lineHeight: 1.6 }}>
                Every approved opportunity receives a NestFund Score across five dimensions. An analytical tool — not a guarantee of returns.
              </p>
            </div>

            {/* Verification + AI assistant */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <div style={{ backgroundColor: "#fff", borderRadius: 20, border: "1.5px solid #eef1f5", padding: "28px 30px", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <ShieldCheckIcon style={{ width: 18, height: 18, color: "#16a34a" }} />
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#16a34a", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>NestFund Verified</p>
                </div>
                <p style={{ fontSize: 14.5, color: "#46536b", lineHeight: 1.65, margin: "0 0 16px 0" }}>
                  Trust is what makes investors fund an opportunity. Every listing carries the verification badge investors rely on:
                </p>
                {["Business identity verified", "Contracts & documents verified", "Financials reviewed", "Repayment source assessed", "Security & collateral confirmed"].map(v => (
                  <div key={v} style={{ display: "flex", alignItems: "center", gap: 9, padding: "5px 0" }}>
                    <CheckBadgeIcon style={{ width: 16, height: 16, color: "#16a34a", flexShrink: 0 }} />
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: "#0f172a" }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: "linear-gradient(135deg, #1e1b4b, #4c1d95)", borderRadius: 20, padding: "26px 30px", color: "#fff" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <SparklesIcon style={{ width: 17, height: 17, color: "#c4b5fd" }} />
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#c4b5fd", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>NestFund AI — Coming Soon</p>
                </div>
                <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 6px 0" }}>Get your opportunity investment-ready.</p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.65, margin: 0 }}>
                  Describe your business — &ldquo;We won a UGX 400M supply contract and need capital to deliver&rdquo; — and NestFund AI drafts your opportunity profile, investment summary, financial projections, and risk disclosures for your review.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ WHY DEVELOPERS USE NESTFUND ══ */}
      <section style={{ backgroundColor: "#fff", padding: "72px 24px" }}>
        <div style={{ maxWidth: 1140, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Why NestFund</p>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.8px", margin: 0 }}>
              Why businesses use NestFund
            </h2>
          </div>
          <div className="trust-features-grid">
            {benefits.map(b => (
              <div key={b.title} style={{ backgroundColor: "#f8fafc", borderRadius: 16, padding: "24px 22px", border: "1px solid #eef1f5" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: iconTile.bg, display: "flex", alignItems: "center", justifyContent: "center", color: iconTile.color, marginBottom: 15 }}>
                  <b.icon />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 7px 0" }}>{b.title}</h3>
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65, margin: 0 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section style={{ background: "linear-gradient(135deg, #0d9488 0%, #2563eb 70%)", padding: "72px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 900, color: "#fff", letterSpacing: "-1px", margin: "0 0 14px 0", lineHeight: 1.15 }}>
            Need capital to execute an opportunity?
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.75)", margin: "0 0 32px 0", lineHeight: 1.65 }}>
            The application takes about 10 minutes. Our team reviews and vets every submission within 5 business days.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/developers/apply" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 12, backgroundColor: "#fff", color: "#0f766e", fontSize: 16, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
              Apply for Funding
              <ArrowRightIcon style={{ width: 17, height: 17 }} />
            </Link>
            <Link href="/developers/dashboard" style={{ display: "inline-flex", alignItems: "center", padding: "14px 26px", borderRadius: 12, border: "1.5px solid rgba(255,255,255,0.4)", color: "#fff", fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
              Preview the Business Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
