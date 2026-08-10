"use client"

import Link from "next/link"
import { ArrowRightIcon, ArrowDownIcon, SparklesIcon } from "@heroicons/react/24/outline"
import { CheckBadgeIcon, ShieldCheckIcon } from "@heroicons/react/24/solid"

/* ── Inline SVG icons (match landing page style) ── */
const IconCrane = () => <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20M4 20V10l8-6 8 6v10" /><path d="M9 20v-5h6v5" /></svg>
const IconLand = () => <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>
const IconTower = () => <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
const IconHardHat = () => <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M2 18a1 1 0 001 1h18a1 1 0 001-1v-2a1 1 0 00-1-1H3a1 1 0 00-1 1v2z" /><path d="M4 15v-3a8 8 0 0116 0v3" /><path d="M10 6.5V4a1 1 0 011-1h2a1 1 0 011 1v2.5" /></svg>
const IconCapital = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
const IconUsers = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
const IconChart = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
const IconShield = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>

const submitTypes = [
  { icon: IconCrane, title: "Development Projects", desc: "Planning to build apartments, offices, shopping centers, hotels or other developments?", cta: "Submit Project", color: "#d97706", bg: "#fffbeb", type: "apartment-development" },
  { icon: IconLand, title: "Land", desc: "Own valuable land and want to unlock its investment potential?", cta: "Submit Land", color: "#16a34a", bg: "#f0fdf4", type: "land" },
  { icon: IconTower, title: "Existing Properties", desc: "Own an income-generating property and want to explore investment opportunities?", cta: "Submit Property", color: "#2563eb", bg: "#eff6ff", type: "residential-property" },
  { icon: IconHardHat, title: "Construction Projects", desc: "Have a development underway that requires additional capital?", cta: "Submit Project", color: "#dc2626", bg: "#fef2f2", type: "construction-project" },
]

const steps = [
  { num: "01", title: "Submit", desc: "Tell us about your property or project — location, stage, value, and how much capital you're seeking." },
  { num: "02", title: "Verification", desc: "NestFund verifies ownership, documentation, valuation, and project information with independent partners." },
  { num: "03", title: "Investment Assessment", desc: "We evaluate location, market demand, financial potential, risk, and projected returns." },
  { num: "04", title: "Investment Opportunity", desc: "If approved, your project is prepared for presentation to investors, subject to the applicable legal and regulatory framework." },
]

const benefits = [
  { icon: IconCapital, title: "Access Capital", desc: "Connect your project with thousands of investors actively looking for real estate opportunities." },
  { icon: IconUsers, title: "Reach More Investors", desc: "Present your project to NestFund's investment audience across Uganda and East Africa." },
  { icon: IconShield, title: "Build Credibility", desc: "Projects undergo NestFund's verification and due-diligence process — a trust signal investors recognise." },
  { icon: IconChart, title: "Data & Analytics", desc: "See investor interest, funding progress, and market conditions for your project in real time." },
]

const scoreBars = [
  { label: "Location", value: 91 },
  { label: "Market Demand", value: 86 },
  { label: "Rental Potential", value: 78 },
  { label: "Development Risk", value: 72 },
  { label: "Project Economics", value: 84 },
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
            For Developers
          </p>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 400, lineHeight: 1.16, letterSpacing: "-0.4px", color: "rgba(255,255,255,0.88)", margin: "0 0 8px 0" }}>
            Turn your property into
          </h1>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 700, lineHeight: 1.16, letterSpacing: "-0.4px", color: "#fff", margin: "0 0 22px 0" }}>
            an investment opportunity.
          </h1>
          <p style={{ fontSize: 16.5, color: "rgba(255,255,255,0.6)", maxWidth: 560, margin: "0 auto 34px", lineHeight: 1.75 }}>
            Have land, apartments, commercial property or a development project?
            NestFund helps eligible property owners and developers prepare their projects
            for investment and connect with investors.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
            <Link href="/developers/apply" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 30px", borderRadius: 11, background: "linear-gradient(135deg, #0d9488, #0f766e)", color: "#fff", fontSize: 15, fontWeight: 700, textDecoration: "none", boxShadow: "0 8px 28px rgba(13,148,136,0.4)" }}>
              Submit Your Project
              <ArrowRightIcon style={{ width: 17, height: 17 }} />
            </Link>
            <a href="#how-it-works" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 24px", borderRadius: 11, border: "1.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.9)", fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
              How it works
              <ArrowDownIcon style={{ width: 15, height: 15 }} />
            </a>
          </div>

          {/* Audience strip */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            {["Landowners", "Developers", "Property Owners", "Project Sponsors"].map(a => (
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
          Build it. <span style={{ color: "#0d9488" }}>List it.</span> Fund it. <span style={{ color: "#2563eb" }}>Grow it.</span>
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
              Four kinds of opportunities — one application process.
            </p>
          </div>

          <div className="trust-features-grid">
            {submitTypes.map(t => (
              <Link key={t.title} href={`/developers/apply?type=${t.type}`} style={{ textDecoration: "none" }}>
                <div style={{ backgroundColor: "#fff", borderRadius: 16, padding: "26px 22px", border: "1.5px solid #f1f5f9", height: "100%", boxSizing: "border-box", transition: "all 0.2s", cursor: "pointer" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = `0 8px 28px ${t.color}18`; el.style.borderColor = `${t.color}40`; el.style.transform = "translateY(-3px)" }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "none"; el.style.borderColor = "#f1f5f9"; el.style.transform = "translateY(0)" }}>
                  <div style={{ width: 46, height: 46, borderRadius: 13, backgroundColor: t.bg, display: "flex", alignItems: "center", justifyContent: "center", color: t.color, marginBottom: 16 }}>
                    <t.icon />
                  </div>
                  <h3 style={{ fontSize: 16.5, fontWeight: 700, color: "#0f172a", margin: "0 0 8px 0" }}>{t.title}</h3>
                  <p style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.65, margin: "0 0 14px 0" }}>{t.desc}</p>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 700, color: t.color }}>
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
              How NestFund works with developers
            </h2>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", maxWidth: 500, margin: "0 auto" }}>
              From first submission to a live, investable project.
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
                Every approved project receives a NestFund Score across five dimensions. An analytical tool — not a guarantee of returns.
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
                  Trust is the biggest barrier in African real estate. Every listed project carries the verification badge investors rely on:
                </p>
                {["Ownership verified", "Developer identity verified", "Property documents verified", "Valuation reviewed", "Project documents reviewed"].map(v => (
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
                <p style={{ fontSize: 15, fontWeight: 700, margin: "0 0 6px 0" }}>Get your project investment-ready.</p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.65, margin: 0 }}>
                  Describe your project — &ldquo;We own 3 acres in Kampala and want to build 120 apartments&rdquo; — and NestFund AI drafts your project profile, investment summary, financial projections, and risk disclosures for your review.
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
              Why developers use NestFund
            </h2>
          </div>
          <div className="trust-features-grid">
            {benefits.map(b => (
              <div key={b.title} style={{ backgroundColor: "#f8fafc", borderRadius: 16, padding: "24px 22px", border: "1px solid #eef1f5" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563eb", marginBottom: 15 }}>
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
            Have a project that needs capital?
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.75)", margin: "0 0 32px 0", lineHeight: 1.65 }}>
            The application takes about 10 minutes. Our team reviews every submission within 5 business days.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/developers/apply" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 12, backgroundColor: "#fff", color: "#0f766e", fontSize: 16, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
              Submit Your Project
              <ArrowRightIcon style={{ width: 17, height: 17 }} />
            </Link>
            <Link href="/developers/dashboard" style={{ display: "inline-flex", alignItems: "center", padding: "14px 26px", borderRadius: 12, border: "1.5px solid rgba(255,255,255,0.4)", color: "#fff", fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
              Preview the Developer Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
