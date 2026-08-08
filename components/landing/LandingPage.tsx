"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { ArrowRightIcon, CheckIcon, PlayIcon } from "@heroicons/react/24/outline"
import { ArrowTrendingUpIcon, ShieldCheckIcon, StarIcon } from "@heroicons/react/24/solid"

/* ── Inline SVG icons (professional, no emoji) ── */
const IconHome = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
const IconBanknotes = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
const IconTrade = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 014-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 01-4 4H3" /></svg>
const IconShield = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
const IconChart = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
const IconUsers = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
const IconBuilding = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
const IconConstruction = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20M4 20V10l8-6 8 6v10" /><path d="M9 20v-5h6v5" /></svg>
const IconExchange = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3" /></svg>

/* ── Featured properties for the hero ── */
const featuredCards = [
  { name: "Sunrise Apartments", location: "Kiira, Wakiso", price: "UGX 1,250", change: "+4.34%", apr: "11.2%", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=75", type: "Rental" },
  { name: "Acacia Office Park", location: "Nakasero, Kampala", price: "UGX 2,100", change: "+4.43%", apr: "10.8%", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=75", type: "Rental" },
  { name: "Ibis Residences Phase II", location: "Kiira, Wakiso", price: "UGX 4,200", change: "+2.1%", apr: "13.2%", img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=75", type: "Construction" },
]

const stats = [
  { value: "UGX 24.6B", label: "invested in real estate" },
  { value: "312+",       label: "verified properties" },
  { value: "UGX 4.2B",  label: "distributed to investors" },
  { value: "14,250+",   label: "investors on the platform" },
]

const howSteps = [
  { num: "01", title: "Create your account", desc: "Sign up free. Complete KYC verification in minutes. No minimum experience required.", icon: IconUsers },
  { num: "02", title: "Browse properties", desc: "Explore verified rental and construction properties with full financial data, yields, and projections.", icon: IconBuilding },
  { num: "03", title: "Buy shares", desc: "Invest from as little as UGX 50,000. Instantly own a fraction of a premium property.", icon: IconBanknotes },
  { num: "04", title: "Earn & trade", desc: "Receive monthly rental income. Watch your portfolio grow. Sell shares anytime on the Exchange.", icon: IconTrade },
]

const markets = [
  { icon: IconHome,        title: "Rental Market",      desc: "Income-producing properties. Earn monthly rent from day one.", link: "/market",              color: "#2563eb", bg: "#eff6ff", badge: "Most Popular" },
  { icon: IconConstruction,title: "Construction Market", desc: "Fund new buildings. Earn higher returns from the ground up.", link: "/construction-market", color: "#0d9488", bg: "#f0fdfa", badge: "High ROI" },
  { icon: IconExchange,    title: "Exchange",            desc: "Trade property shares with other investors. Buy and sell anytime.", link: "/exchange",          color: "#7c3aed", bg: "#f5f3ff", badge: "Liquid" },
]

const trustPoints = [
  { icon: IconShield,  title: "Legally Verified",    desc: "Every property has verified title deeds, legal compliance, and independent valuation." },
  { icon: IconChart,   title: "Full Transparency",   desc: "Real-time reporting, monthly income statements, and live construction updates." },
  { icon: IconBanknotes,title: "Monthly Income",     desc: "Rental distributions paid directly to your wallet every month, automatically." },
  { icon: IconUsers,   title: "14,250+ Investors",   desc: "A growing community of verified investors across Uganda and East Africa." },
]

const faqs = [
  { q: "How much do I need to start investing?", a: "You can start investing from as little as UGX 50,000 by buying one or more shares in a verified property." },
  { q: "When do I receive rental income?", a: "Monthly rental income is distributed to your NestFund wallet within the first 5 business days of each month." },
  { q: "Can I sell my shares whenever I want?", a: "Yes. You can list your shares on the Exchange where other investors can buy them. Average sell time is under 38 minutes." },
  { q: "Are the properties legally secure?", a: "Absolutely. Every property undergoes independent legal verification, title deed checks, and annual independent valuation." },
  { q: "What is the minimum investment period?", a: "There is no lock-in period. You can sell your shares on the Exchange at any time after purchase." },
]

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [ticker, setTicker] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setTicker(p => (p + 1) % featuredCards.length), 3000)
    return () => clearInterval(t)
  }, [])

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff", overflowX: "hidden" }}>

      {/* ══ LANDING NAVBAR ══ */}
      <LandingNav />

      {/* ══ HERO ══ */}
      <HeroSection ticker={ticker} />

      {/* ══ TRUST NUMBERS ══ */}
      <TrustNumbers />

      {/* ══ MARKETS ══ */}
      <MarketsSection />

      {/* ══ HOW IT WORKS ══ */}
      <HowItWorksSection />

      {/* ══ TRUST / WHY ══ */}
      <WhySection />

      {/* ══ TESTIMONIALS ══ */}
      <TestimonialsSection />

      {/* ══ FAQ ══ */}
      <FaqSection faqs={faqs} openFaq={openFaq} setOpenFaq={setOpenFaq} />

      {/* ══ FINAL CTA ══ */}
      <FinalCTA />

      {/* ══ LANDING FOOTER ══ */}
      <LandingFooter />
    </div>
  )
}

/* ══════════════════════════════════
   LANDING NAVBAR
══════════════════════════════════ */
function LandingNav() {
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 50, backgroundColor: "rgba(255,255,255,0.97)", borderBottom: "1px solid #e8ecf0", backdropFilter: "blur(12px)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #2563eb, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 17, color: "#fff" }}>N</div>
          <span style={{ fontSize: 19, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.3px" }}>NestFund</span>
        </Link>

        {/* Desktop links */}
        <div className="landing-nav-links" style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {[
            { href: "/market", label: "Rental Market" },
            { href: "/construction-market", label: "Construction" },
            { href: "/exchange", label: "Exchange" },
            { href: "/home", label: "Dashboard" },
          ].map(l => (
            <Link key={l.href} href={l.href} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 14, fontWeight: 500, color: "#4b5563", textDecoration: "none" }}>{l.label}</Link>
          ))}
        </div>

        {/* Auth */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Link href="/auth/login" className="landing-nav-links" style={{ fontSize: 14, fontWeight: 600, color: "#374151", textDecoration: "none", padding: "7px 16px" }}>Log In</Link>
          <Link href="/auth/register" style={{ padding: "8px 20px", borderRadius: 9, background: "linear-gradient(135deg, #2563eb, #4f46e5)", color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>Sign Up Free</Link>
        </div>
      </div>
    </nav>
  )
}

/* ══════════════════════════════════
   HERO SECTION
══════════════════════════════════ */
function HeroSection({ ticker }: { ticker: number }) {
  const card = featuredCards[ticker]
  return (
    <section style={{ background: "linear-gradient(160deg, #0f172a 0%, #1e3a8a 45%, #2563eb 100%)", padding: "80px 24px 0", position: "relative", overflow: "hidden" }}>
      {/* Background city silhouette */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 160, backgroundImage: "url(https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=30)", backgroundSize: "cover", backgroundPosition: "center top", opacity: 0.07 }} />

      <div style={{ maxWidth: 1140, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Trustpilot row */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 99, padding: "7px 16px", border: "1px solid rgba(255,255,255,0.15)" }}>
            <div style={{ display: "flex", gap: 2 }}>{[1,2,3,4,5].map(s => <StarIcon key={s} style={{ width: 14, height: 14, color: "#10b981" }} />)}</div>
            <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>Rated 4.8/5 · 2,600+ investors</span>
          </div>
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: "clamp(36px, 6vw, 68px)", fontWeight: 900, color: "#fff", textAlign: "center", lineHeight: 1.08, letterSpacing: "-2px", margin: "0 0 8px 0" }}>
          Own Real Estate.
          <br />Get Monthly Rent.
          <br /><span style={{ color: "#10b981", fontStyle: "italic" }}>Sell Anytime.</span>
        </h1>
        <p style={{ fontSize: "clamp(16px, 2.2vw, 20px)", color: "rgba(255,255,255,0.7)", textAlign: "center", margin: "16px auto 36px", maxWidth: 580, lineHeight: 1.65 }}>
          Build your real estate portfolio from <strong style={{ color: "#fff" }}>UGX 50,000</strong>. Own shares of verified properties, earn monthly rental income, and exit whenever you want.
        </p>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 52 }}>
          <Link href="/auth/register" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 12, backgroundColor: "#10b981", color: "#fff", fontSize: 16, fontWeight: 700, textDecoration: "none", boxShadow: "0 6px 20px rgba(16,185,129,0.35)" }}>
            <div style={{ width: 18, height: 18, display: "flex" }}><IconHome /></div>
            Explore Properties
          </Link>
          <button style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 24px", borderRadius: 12, backgroundColor: "transparent", border: "1.5px solid rgba(255,255,255,0.3)", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
            <PlayIcon style={{ width: 18, height: 18 }} />
            How it works
          </button>
        </div>

        {/* Floating property cards strip */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center", overflowX: "auto", paddingBottom: 40, scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
          {featuredCards.map((c, i) => (
            <div key={i} style={{ backgroundColor: "rgba(255,255,255,0.07)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 16, overflow: "hidden", minWidth: 220, maxWidth: 240, flexShrink: 0, transition: "transform 0.3s", transform: i === ticker ? "translateY(-8px)" : "translateY(0)" }}>
              <div style={{ height: 130, overflow: "hidden" }}>
                <img src={c.img} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: "12px 14px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: c.type === "Rental" ? "#10b981" : "#f59e0b", backgroundColor: c.type === "Rental" ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)", padding: "2px 7px", borderRadius: 99, textTransform: "uppercase", letterSpacing: "0.05em" }}>{c.type}</span>
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: "0 0 2px 0" }}>{c.name}</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: "0 0 10px 0" }}>{c.location}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: 15, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.3px" }}>{c.price}</p>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", margin: 0 }}>per share</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#10b981", margin: 0 }}>{c.change}</p>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#0d9488", margin: 0 }}>{c.apr} APR</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════
   TRUST NUMBERS
══════════════════════════════════ */
function TrustNumbers() {
  return (
    <section style={{ backgroundColor: "#f8fafc", padding: "56px 24px" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", marginBottom: 32 }}>
          Results, Not Promises
        </p>
        <div className="trust-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ backgroundColor: "#fff", borderRadius: 16, padding: "24px 20px", border: "1px solid #e8ecf0", textAlign: "center" }}>
              <p style={{ fontSize: 34, fontWeight: 900, color: "#0f172a", letterSpacing: "-1px", margin: "0 0 6px 0" }}>{s.value}</p>
              <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════
   MARKETS SECTION
══════════════════════════════════ */
function MarketsSection() {
  return (
    <section style={{ backgroundColor: "#fff", padding: "72px 24px" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Our Markets</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#0f172a", letterSpacing: "-1px", margin: "0 0 14px 0" }}>
            Three Ways to<br />Build Wealth in Real Estate
          </h2>
          <p style={{ fontSize: 16, color: "#64748b", maxWidth: 520, margin: "0 auto" }}>
            Rental income, construction ROI, or secondary trading — all on one platform.
          </p>
        </div>

        <div className="markets-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
          {markets.map((m, i) => (
            <Link key={i} href={m.link} style={{ textDecoration: "none", display: "block" }}>
              <div style={{ backgroundColor: "#fff", borderRadius: 18, padding: "28px 24px", border: "1.5px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", transition: "all 0.2s", cursor: "pointer", height: "100%" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = `0 8px 28px ${m.color}18`; el.style.borderColor = `${m.color}40`; el.style.transform = "translateY(-3px)" }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; el.style.borderColor = "#f1f5f9"; el.style.transform = "translateY(0)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 13, backgroundColor: m.bg, display: "flex", alignItems: "center", justifyContent: "center", color: m.color }}><m.icon /></div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: m.color, backgroundColor: m.bg, padding: "4px 10px", borderRadius: 99 }}>{m.badge}</span>
                </div>
                <h3 style={{ fontSize: 19, fontWeight: 700, color: "#0f172a", margin: "0 0 10px 0" }}>{m.title}</h3>
                <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 20px 0", lineHeight: 1.65 }}>{m.desc}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 700, color: m.color }}>
                  Explore <ArrowRightIcon style={{ width: 14, height: 14 }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════
   HOW IT WORKS
══════════════════════════════════ */
function HowItWorksSection() {
  return (
    <section style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)", padding: "80px 24px" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#10b981", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Start From Here</p>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.8px", margin: "0 0 12px 0" }}>
            Invest in 4 Simple Steps
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.6)", maxWidth: 480, margin: "0 auto" }}>
            No brokers. No paperwork. No millions required.
          </p>
        </div>

        <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {howSteps.map((step, i) => (
            <div key={i} style={{ backgroundColor: "rgba(255,255,255,0.06)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "24px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, backgroundColor: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981" }}><step.icon /></div>
                <span style={{ fontSize: 24, fontWeight: 900, color: "rgba(255,255,255,0.12)", letterSpacing: "-0.5px" }}>{step.num}</span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: "0 0 8px 0" }}>{step.title}</h3>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, margin: 0 }}>{step.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 44 }}>
          <Link href="/auth/register" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 12, backgroundColor: "#10b981", color: "#fff", fontSize: 16, fontWeight: 700, textDecoration: "none", boxShadow: "0 6px 20px rgba(16,185,129,0.3)" }}>
            Get Started Free
            <ArrowRightIcon style={{ width: 18, height: 18 }} />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════
   WHY NESTFUND
══════════════════════════════════ */
function WhySection() {
  return (
    <section style={{ backgroundColor: "#f8fafc", padding: "80px 24px" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Why NestFund</p>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.8px", margin: "0 0 12px 0" }}>
            Confidence Built on<br />Transparency
          </h2>
          <p style={{ fontSize: 16, color: "#64748b", maxWidth: 480, margin: "0 auto" }}>
            Everything on NestFund is verified, documented, and reported — so you invest with full confidence.
          </p>
        </div>

        <div className="trust-features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {trustPoints.map((t, i) => (
            <div key={i} style={{ backgroundColor: "#fff", borderRadius: 16, padding: "24px 20px", border: "1px solid #e8ecf0" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563eb", marginBottom: 16 }}>
                <t.icon />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 8px 0" }}>{t.title}</h3>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65, margin: 0 }}>{t.desc}</p>
            </div>
          ))}
        </div>

        {/* Featured property highlight */}
        <div style={{ marginTop: 44, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "center", backgroundColor: "#fff", borderRadius: 20, overflow: "hidden", border: "1.5px solid #f1f5f9" }}>
          <div style={{ height: 320, overflow: "hidden" }}>
            <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=700&q=80" alt="Property" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ padding: "32px 36px" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#0d9488", backgroundColor: "#f0fdfa", padding: "4px 10px", borderRadius: 99, display: "inline-block", marginBottom: 16 }}>FEATURED PROPERTY</span>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 6px 0" }}>Sunrise Apartments</h3>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 20px 0" }}>Kiira, Wakiso · Verified Residential</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {[
                { label: "Share Price",    value: "UGX 1,250/share" },
                { label: "Annual Yield",  value: "11.2%",           teal: true },
                { label: "Occupancy",     value: "100%",            teal: true },
                { label: "Total Investors",value: "312 investors" },
              ].map(r => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "#94a3b8" }}>{r.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: (r as {teal?: boolean}).teal ? "#0d9488" : "#0f172a" }}>{r.value}</span>
                </div>
              ))}
            </div>
            <Link href="/property/sunrise-apartments" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "11px 22px", borderRadius: 10, backgroundColor: "#2563eb", color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
              View Property
              <ArrowRightIcon style={{ width: 15, height: 15 }} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════
   TESTIMONIALS
══════════════════════════════════ */
function TestimonialsSection() {
  const testimonials = [
    { name: "Sarah K.", role: "Teacher, Kampala", text: "I invested UGX 200,000 in my first property share and received my first rental payment 30 days later. NestFund made investing real and accessible.", rating: 5 },
    { name: "David M.", role: "Engineer, Wakiso", text: "The transparency is what got me. I can see exactly where my money is, what it's earning, and the monthly reports give me confidence that everything is being managed properly.", rating: 5 },
    { name: "Grace N.", role: "Business Owner, Entebbe", text: "I've now invested in 3 properties on NestFund. My portfolio generates UGX 450,000 every month in passive income. This is the future of investment.", rating: 5 },
  ]
  return (
    <section style={{ backgroundColor: "#fff", padding: "72px 24px" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Investor Stories</p>
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.6px", margin: 0 }}>
            What Our Investors Say
          </h2>
        </div>
        <div className="testimonials-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 22 }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{ backgroundColor: "#f8fafc", borderRadius: 16, padding: "26px 22px", border: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                {Array.from({ length: t.rating }).map((_, s) => <StarIcon key={s} style={{ width: 14, height: 14, color: "#f59e0b" }} />)}
              </div>
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: "0 0 18px 0", fontStyle: "italic" }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", backgroundColor: "#2563eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                  {t.name[0]}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: 0 }}>{t.name}</p>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════
   FAQ
══════════════════════════════════ */
function FaqSection({ faqs, openFaq, setOpenFaq }: { faqs: {q: string; a: string}[]; openFaq: number | null; setOpenFaq: (n: number | null) => void }) {
  return (
    <section style={{ backgroundColor: "#f8fafc", padding: "72px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>FAQ</p>
          <h2 style={{ fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", margin: 0 }}>
            Frequently Asked Questions
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ backgroundColor: "#fff", borderRadius: 13, border: `1.5px solid ${openFaq === i ? "#bfdbfe" : "#f1f5f9"}`, overflow: "hidden", transition: "border-color 0.2s" }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "17px 20px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
              >
                <span style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>{faq.q}</span>
                <span style={{ fontSize: 20, color: "#94a3b8", marginLeft: 16, flexShrink: 0, transform: openFaq === i ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.2s" }}>+</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: "0 20px 18px" }}>
                  <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════
   FINAL CTA
══════════════════════════════════ */
function FinalCTA() {
  return (
    <section style={{ background: "linear-gradient(135deg, #0d9488 0%, #2563eb 60%, #4f46e5 100%)", padding: "80px 24px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 900, color: "#fff", letterSpacing: "-1px", margin: "0 0 14px 0", lineHeight: 1.1 }}>
          Start Owning Real Estate Today
        </h2>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.75)", margin: "0 0 36px 0", lineHeight: 1.65 }}>
          Join 14,250+ investors already earning passive income from verified properties across Uganda.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
          <Link href="/auth/register" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 12, backgroundColor: "#fff", color: "#1e3a8a", fontSize: 16, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
            Create Free Account
            <ArrowRightIcon style={{ width: 18, height: 18 }} />
          </Link>
          <Link href="/market" style={{ display: "inline-flex", alignItems: "center", padding: "14px 28px", borderRadius: 12, border: "1.5px solid rgba(255,255,255,0.4)", backgroundColor: "transparent", color: "#fff", fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
            Browse Properties
          </Link>
        </div>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: 0 }}>No credit card required · Secure · Regulated</p>
      </div>
    </section>
  )
}

/* ══════════════════════════════════
   LANDING FOOTER
══════════════════════════════════ */
function LandingFooter() {
  return (
    <footer style={{ backgroundColor: "#0f172a", padding: "40px 24px 28px" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: "linear-gradient(135deg, #2563eb, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 14, color: "#fff" }}>N</div>
            <span style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>NestFund</span>
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[["Rental Market","/market"],["Construction","/construction-market"],["Exchange","/exchange"],["Portfolio","/portfolio"],["Terms","/terms"],["Privacy","/privacy"]].map(([label, href]) => (
              <Link key={href} href={href} style={{ fontSize: 13, color: "#475569", textDecoration: "none" }}>{label}</Link>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid #1e293b", paddingTop: 18, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <p style={{ fontSize: 12, color: "#334155", margin: 0 }}>© 2026 NestFund Limited. Regulated by the Capital Markets Authority of Uganda.</p>
          <p style={{ fontSize: 12, color: "#334155", margin: 0 }}>Investments carry risk. Past performance is not indicative of future results.</p>
        </div>
      </div>
    </footer>
  )
}
