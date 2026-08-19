"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { ArrowRightIcon, CheckIcon } from "@heroicons/react/24/outline"
import { ArrowTrendingUpIcon, ShieldCheckIcon, StarIcon } from "@heroicons/react/24/solid"
import CountUp from "@/components/ui/CountUp"
import { useLandingFeatured, usePlatformStats, useOpportunities } from "@/lib/hooks"
import { ComingSoonSection } from "@/components/comingsoon/ComingSoon"
import OpportunityCard from "@/components/opportunities/OpportunityCard"
import { CATEGORIES } from "@/lib/data/opportunities"

/* ── Inline SVG icons (professional, no emoji) ── */
const IconHome = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
const IconBanknotes = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
const IconTrade = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 014-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 01-4 4H3" /></svg>
const IconShield = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
const IconChart = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
const IconUsers = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
const IconBuilding = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>
const IconConstruction = () => <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20M4 20V10l8-6 8 6v10" /><path d="M9 20v-5h6v5" /></svg>

/* Featured hero cards + trust numbers are managed in Admin → Site Settings */

const howSteps = [
  { num: "01", title: "Create your account", desc: "Sign up free. Complete KYC verification in minutes. No minimum experience required.", icon: IconUsers },
  { num: "02", title: "Explore opportunities", desc: "Browse verified opportunities across contracts, trade, productive assets and real estate — each with its duration, target return and risks.", icon: IconBuilding },
  { num: "03", title: "Invest from UGX 50,000", desc: "Choose an amount that suits you. Every opportunity shows exactly what your capital will finance.", icon: IconBanknotes },
  { num: "04", title: "Track & receive proceeds", desc: "Follow progress in your portfolio. Receive proceeds as opportunities repay — and trade property shares anytime on the Exchange.", icon: IconTrade },
]

const trustPoints = [
  { icon: IconShield,  title: "Verified Before Listing", desc: "Every opportunity goes through document, operator and financial verification before it appears on the marketplace." },
  { icon: IconChart,   title: "Full Transparency",   desc: "You see what your capital finances, how it generates revenue, how long it is deployed, and what could go wrong." },
  { icon: IconBanknotes,title: "Defined Exits",      desc: "Every opportunity states its duration and expected exit — contract payment, trade cycle, asset income or property sale." },
  { icon: IconUsers,   title: "14,250+ Investors",   desc: "A growing community of verified investors across Uganda and East Africa." },
]

const faqs = [
  { q: "What can I invest in on NestFund?", a: "Verified opportunities across five categories: Cashflow (contract and invoice financing), Growth (trade and working capital), Assets (income-producing equipment), Property (rental and construction), and Stable (lower-risk products, coming soon)." },
  { q: "How much do I need to start investing?", a: "You can start from as little as UGX 50,000. Each opportunity shows its own minimum investment." },
  { q: "Are returns guaranteed?", a: "No. Every figure you see is a target or projected return, not a promise. All investments carry risk, including possible loss of capital — each opportunity page explains its specific risks in plain language." },
  { q: "How do I get my money back?", a: "Every opportunity has a defined duration and exit — a contract payment, the end of a trade cycle, asset income, or a property exit. Property shares can also be listed on the Exchange for other investors to buy." },
  { q: "How are opportunities verified?", a: "Before listing, NestFund reviews the operator, the underlying contracts or assets, and the financials. Verification status is shown on each opportunity, and only completed checks are displayed." },
]

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [ticker, setTicker] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setTicker(p => (p + 1) % 3), 3000)
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

      {/* ══ WHAT CAN YOU INVEST IN — the five categories ══ */}
      <CategoriesSection />

      {/* ══ FEATURED OPPORTUNITIES ══ */}
      <FeaturedOpportunities />

      {/* ══ COMING SOON — reserve before launch ══ */}
      <ComingSoonSection />

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
            { href: "/opportunities", label: "Opportunities" },
            { href: "/exchange", label: "Exchange" },
            { href: "/developers", label: "For Businesses" },
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
  const featuredCards = useLandingFeatured()
  return (
    <section style={{ position: "relative", overflow: "hidden", minHeight: "88vh", display: "flex", flexDirection: "column" }}>

      {/* Full-bleed background photo */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80"
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }}
        />
        {/* Dark overlay — teal tint like Binaryx */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(10,25,40,0.88) 0%, rgba(13,60,80,0.82) 50%, rgba(10,30,60,0.78) 100%)" }} />
      </div>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px 24px 0", maxWidth: 1140, margin: "0 auto", width: "100%" }}>

        {/* Headline — clean, moderate weight */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <h1 style={{
            fontSize: "clamp(30px, 5vw, 58px)",
            fontWeight: 400,
            color: "rgba(255,255,255,0.88)",
            lineHeight: 1.2,
            letterSpacing: "-0.3px",
            margin: "0 0 4px 0",
          }}>
            Your money
          </h1>
          <h1 style={{
            fontSize: "clamp(30px, 5vw, 58px)",
            fontWeight: 400,
            color: "rgba(255,255,255,0.88)",
            lineHeight: 1.2,
            letterSpacing: "-0.3px",
            margin: "0 0 4px 0",
          }}>
            shouldn&apos;t sit idle.
          </h1>
          <h1 style={{
            fontSize: "clamp(30px, 5vw, 58px)",
            fontWeight: 700,
            color: "#fff",
            lineHeight: 1.2,
            letterSpacing: "-0.3px",
            margin: "0 0 22px 0",
          }}>
            Put it to work.
          </h1>
          <p style={{
            fontSize: "clamp(14px, 1.7vw, 17px)",
            color: "rgba(255,255,255,0.58)",
            maxWidth: 540,
            margin: "0 auto 34px",
            lineHeight: 1.7,
            fontWeight: 400,
          }}>
            Invest in verified opportunities across Africa&apos;s growing economy — from contracts
            and businesses to productive assets and real estate. Start from UGX 50,000.
          </p>
        </div>

        {/* CTA buttons — Binaryx style */}
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 56 }}>
          <Link
            href="/opportunities"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "13px 28px", borderRadius: 8,
              backgroundColor: "#0d9488",
              color: "#fff", fontSize: 15, fontWeight: 600,
              textDecoration: "none",
            }}
          >
            <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            Explore Opportunities
          </Link>
          <Link
            href="#how-it-works"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "13px 24px", borderRadius: 8,
              backgroundColor: "transparent",
              border: "1.5px solid rgba(255,255,255,0.25)",
              color: "rgba(255,255,255,0.85)", fontSize: 15, fontWeight: 500,
              textDecoration: "none",
            }}
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" />
            </svg>
            How it works
          </Link>
        </div>

        {/* Featured opportunity strip — a mix of categories, picked in Admin → Site Settings */}
        <div className="hero-cards-strip">
          {featuredCards.map((c, i) => (
            <Link key={c.id} href={c.href} style={{ textDecoration: "none", flexShrink: 0 }}>
              <div style={{
                backgroundColor: "rgba(255,255,255,0.09)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 16, overflow: "hidden",
                minWidth: 228, maxWidth: 248,
                boxShadow: i === ticker ? "0 18px 44px rgba(0,0,0,0.35)" : "0 8px 24px rgba(0,0,0,0.2)",
                transition: "transform 0.35s, border-color 0.35s, box-shadow 0.35s",
                transform: i === ticker ? "translateY(-10px)" : "translateY(0)",
                borderColor: i === ticker ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.14)",
              }}>
                {/* Image with category chip + gradient */}
                <div style={{ position: "relative", height: 116, overflow: "hidden" }}>
                  <img src={c.img} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.45) 100%)" }} />
                  <span style={{ position: "absolute", top: 9, left: 9, fontSize: 9, fontWeight: 800, color: "#fff", backgroundColor: c.accent, padding: "3px 9px", borderRadius: 99, textTransform: "uppercase" as const, letterSpacing: "0.05em", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>{c.kind}</span>
                </div>
                <div style={{ padding: "12px 14px 14px" }}>
                  <p style={{ fontSize: 13.5, fontWeight: 700, color: "#fff", margin: "0 0 2px 0", letterSpacing: "-0.1px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: "0 0 10px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.location}</p>

                  {/* Funding progress */}
                  <div style={{ height: 4, borderRadius: 99, backgroundColor: "rgba(255,255,255,0.14)", overflow: "hidden", marginBottom: 5 }}>
                    <div style={{ height: "100%", width: `${c.progress}%`, borderRadius: 99, backgroundColor: c.accent }} />
                  </div>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", margin: "0 0 10px 0" }}>{c.progress}% funded</p>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.2px" }}>UGX {c.price.toLocaleString()}</p>
                      <p style={{ fontSize: 10, color: "rgba(255,255,255,0.42)", margin: "1px 0 0 0" }}>{c.unitLabel}</p>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", backgroundColor: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.18)", borderRadius: 99, padding: "4px 10px", whiteSpace: "nowrap" }}>{c.returnTag}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom fade into next section */}
        <div style={{ height: 48, background: "linear-gradient(to bottom, transparent, rgba(248,250,252,0.15))" }} />
      </div>
    </section>
  )
}

/* ══════════════════════════════════
   TRUST NUMBERS
══════════════════════════════════ */
function TrustNumbers() {
  // Numbers come from Admin → Site Settings + live listing counts
  const platform = usePlatformStats()
  const { opportunities } = useOpportunities()
  const stats = [
    { value: platform.marketVolume, label: "invested through the platform" },
    { value: `${opportunities.filter(o => o.status !== "Coming Soon").length}+`, label: "verified opportunities" },
    { value: platform.distributedToInvestors, label: "distributed to investors" },
    { value: `${platform.totalInvestors.toLocaleString()}+`, label: "investors on the platform" },
  ]
  return (
    <section style={{ backgroundColor: "#f8fafc", padding: "56px 24px" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center", marginBottom: 32 }}>
          Results, Not Promises
        </p>
        <div className="trust-grid">
          {stats.map((s, i) => (
            <div key={i} style={{ backgroundColor: "#fff", borderRadius: 16, padding: "24px 20px", border: "1px solid #e8ecf0", textAlign: "center" }}>
              <p style={{ fontSize: "clamp(24px, 6vw, 34px)", fontWeight: 900, color: "#0f172a", letterSpacing: "-1px", margin: "0 0 6px 0" }}><CountUp value={s.value} /></p>
              <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════
   WHAT CAN YOU INVEST IN — 5 categories
══════════════════════════════════ */
const categoryIcons: Record<string, () => React.ReactElement> = {
  cashflow: IconTrade,
  growth: IconChart,
  assets: IconConstruction,
  property: IconHome,
  stable: IconShield,
}

function CategoriesSection() {
  return (
    <section style={{ backgroundColor: "#fff", padding: "72px 24px" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 52 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>The Marketplace</p>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 800, color: "#0f172a", letterSpacing: "-1px", margin: "0 0 14px 0" }}>
            What Can You Invest In?
          </h2>
          <p style={{ fontSize: 16, color: "#64748b", maxWidth: 560, margin: "0 auto" }}>
            Five categories with different durations, risk levels and income profiles — so your capital works the way you want it to.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(210px, 100%), 1fr))", gap: 16 }}>
          {CATEGORIES.map(c => {
            const Icon = categoryIcons[c.key]
            return (
              <Link key={c.key} href={`/opportunities?category=${c.key}`} style={{ textDecoration: "none", display: "block" }}>
                <div style={{ backgroundColor: "#fff", borderRadius: 18, padding: "24px 20px", border: "1.5px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", transition: "all 0.2s", cursor: "pointer", height: "100%", display: "flex", flexDirection: "column" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = `0 8px 28px ${c.accent}20`; el.style.borderColor = `${c.accent}45`; el.style.transform = "translateY(-3px)" }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; el.style.borderColor = "#f1f5f9"; el.style.transform = "translateY(0)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    {/* Uniform grey icon tiles — one calm color across all five cards */}
                    <div style={{ width: 46, height: 46, borderRadius: 13, backgroundColor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b" }}><Icon /></div>
                    {c.comingSoon && <span style={{ fontSize: 10, fontWeight: 700, color: "#64748b", backgroundColor: "#f1f5f9", padding: "3px 9px", borderRadius: 99 }}>Coming Soon</span>}
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 750, color: "#0f172a", margin: "0 0 4px 0" }}>{c.label}</h3>
                  <p style={{ fontSize: 12.5, fontWeight: 650, color: c.accent, margin: "0 0 8px 0" }}>{c.tagline}</p>
                  <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 16px 0", lineHeight: 1.6, flex: 1 }}>{c.description}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>Typical duration</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#0f172a" }}>{c.duration}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>Risk</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#0f172a" }}>{c.risk}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, fontWeight: 700, color: c.accent }}>
                    Explore <ArrowRightIcon style={{ width: 14, height: 14 }} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════
   FEATURED OPPORTUNITIES
══════════════════════════════════ */
function FeaturedOpportunities() {
  const { opportunities } = useOpportunities()
  // One highlight per category so the diversity is visible at a glance
  const featured = ["cashflow", "growth", "assets", "property"]
    .map(cat => opportunities.find(o => o.category === cat && (o.status === "Open" || o.status === "Almost Funded")))
    .filter((o): o is NonNullable<typeof o> => !!o)
  if (featured.length === 0) return null
  return (
    <section style={{ backgroundColor: "#f8fafc", padding: "72px 24px" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Open Now</p>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.8px", margin: "0 0 12px 0" }}>
            Featured Opportunities
          </h2>
          <p style={{ fontSize: 15, color: "#64748b", maxWidth: 520, margin: "0 auto" }}>
            A contract, a trade, an asset and a property — capital at work in different ways.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(260px, 100%), 1fr))", gap: 18, marginBottom: 32 }}>
          {featured.map(o => <OpportunityCard key={o.id} opportunity={o} />)}
        </div>
        <div style={{ textAlign: "center" }}>
          <Link href="/opportunities" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 30px", borderRadius: 11, backgroundColor: "#0f172a", color: "#fff", fontSize: 14.5, fontWeight: 700, textDecoration: "none" }}>
            Explore All Opportunities
            <ArrowRightIcon style={{ width: 16, height: 16 }} />
          </Link>
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

        <div className="steps-grid">
          {howSteps.map((step, i) => (
            <div key={i} style={{ backgroundColor: "rgba(255,255,255,0.06)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: "24px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, backgroundColor: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#cbd5e1" }}><step.icon /></div>
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

        <div className="trust-features-grid">
          {trustPoints.map((t, i) => (
            <div key={i} style={{ backgroundColor: "#fff", borderRadius: 16, padding: "24px 20px", border: "1px solid #e8ecf0" }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", marginBottom: 16 }}>
                <t.icon />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 8px 0" }}>{t.title}</h3>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.65, margin: 0 }}>{t.desc}</p>
            </div>
          ))}
        </div>

        {/* Featured property highlight */}
        <div className="featured-split">
          <div className="featured-split-img">
            <img src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=700&q=80" alt="Property" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div className="featured-split-body">
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
    { name: "Sarah K.", role: "Teacher, Kampala", text: "I started with UGX 200,000 in a short contract-financing opportunity. Seeing exactly what my money was financing — and when it would come back — made investing feel real and accessible.", rating: 5 },
    { name: "David M.", role: "Engineer, Wakiso", text: "The transparency is what got me. Every opportunity shows what it finances, how it earns, how long my capital is deployed, and honestly what could go wrong. That's rare.", rating: 5 },
    { name: "Grace N.", role: "Business Owner, Entebbe", text: "My portfolio now spreads across a trade deal, a truck, and two rental properties. Different durations, different income — all in one place I can actually track.", rating: 5 },
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
        <div className="testimonials-grid">
          {testimonials.map((t, i) => (
            <div key={i} style={{ backgroundColor: "#f8fafc", borderRadius: 16, padding: "26px 22px", border: "1px solid #f1f5f9" }}>
              <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                {Array.from({ length: t.rating }).map((_, s) => <StarIcon key={s} style={{ width: 14, height: 14, color: "#f59e0b" }} />)}
              </div>
              <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, margin: "0 0 18px 0", fontStyle: "italic" }}>&ldquo;{t.text}&rdquo;</p>
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
          Put Your Money
          <br />to Work Today
        </h2>
        <p style={{ fontSize: 17, color: "rgba(255,255,255,0.75)", margin: "0 0 36px 0", lineHeight: 1.65 }}>
          More than 14,000 investors already fund verified opportunities across contracts, trade, productive assets and real estate on NestFund. Join them.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 20 }}>
          <Link href="/auth/register" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: 12, backgroundColor: "#fff", color: "#1e3a8a", fontSize: 16, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
            Create Free Account
            <ArrowRightIcon style={{ width: 18, height: 18 }} />
          </Link>
          <Link href="/opportunities" style={{ display: "inline-flex", alignItems: "center", padding: "14px 28px", borderRadius: 12, border: "1.5px solid rgba(255,255,255,0.4)", backgroundColor: "transparent", color: "#fff", fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
            Explore Opportunities
          </Link>
        </div>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: 0 }}>No credit card required · Investments carry risk</p>
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
            {[["Opportunities","/opportunities"],["Rental Market","/market"],["Construction","/construction-market"],["Exchange","/exchange"],["For Businesses","/developers"],["Portfolio","/portfolio"],["Terms","/terms"],["Privacy","/privacy"]].map(([label, href]) => (
              <Link key={href} href={href} style={{ fontSize: 13, color: "#475569", textDecoration: "none" }}>{label}</Link>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid #1e293b", paddingTop: 18, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
          <p style={{ fontSize: 12, color: "#334155", margin: 0 }}>© 2026 NestFund Limited.</p>
          <p style={{ fontSize: 12, color: "#334155", margin: 0 }}>Investments carry risk. Target returns are projections, not promises. Past performance is not indicative of future results.</p>
        </div>
      </div>
    </footer>
  )
}
