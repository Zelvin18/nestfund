"use client"

import Link from "next/link"
import { ArrowRightIcon, ShieldCheckIcon, PlayCircleIcon } from "@heroicons/react/24/outline"
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, CheckBadgeIcon, BoltIcon } from "@heroicons/react/24/solid"
import Sparkline from "@/components/ui/Sparkline"
import { useHomeHeroProperty } from "@/lib/hooks"

export default function HeroSection() {
  // The featured property is chosen in Admin → Site Settings
  const hero = useHomeHeroProperty()
  const heroUp = hero.priceChangePercent >= 0
  const heroSparkData = hero.chartData.slice(-15).map(d => d.value)
  return (
    <section
      className="hero-section"
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#0a1628",
        padding: "76px 0 68px",
        maxWidth: "100vw",
      }}
    >
      {/* Full-bleed architecture photo */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=1800&q=80"
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }}
        />
        {/* Navy overlay keeps text readable while the towers show through */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(8,18,36,0.96) 0%, rgba(10,26,54,0.88) 45%, rgba(12,30,62,0.72) 100%)" }} />
        {/* Soft glow accents */}
        <div style={{ position: "absolute", top: -180, right: "8%", width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -220, left: "-6%", width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(13,148,136,0.14) 0%, transparent 65%)", pointerEvents: "none" }} />
      </div>

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
        }}
        className="hero-grid container"
      >
        {/* Left — copy */}
        <div>
          {/* Eyebrow label */}
          <p style={{
            fontSize: 12.5,
            fontWeight: 500,
            color: "rgba(255,255,255,0.55)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            margin: "0 0 18px 0",
          }}>
            The Investment Marketplace
          </p>

          {/* Headline — clean, landing-page style */}
          <h1
            style={{
              fontSize: "clamp(34px, 4.6vw, 54px)",
              fontWeight: 400,
              lineHeight: 1.18,
              letterSpacing: "-0.3px",
              color: "rgba(255,255,255,0.88)",
              margin: "0 0 22px 0",
            }}
          >
            Fund Real Opportunities.
            <br />
            <span style={{ fontWeight: 700, color: "#fff" }}>
              Earn Real Returns.
            </span>
          </h1>

          {/* Description */}
          <p
            className="hero-desc"
            style={{
              fontSize: 17,
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.62)",
              margin: "0 0 34px 0",
              maxWidth: 480,
            }}
          >
            Invest from UGX 50,000 in verified opportunities — contracts, trade,
            productive assets and property — and receive proceeds as each one pays out.
          </p>

          {/* CTA buttons */}
          <div className="hero-ctas" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 38 }}>
            <Link
              href="/market"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                borderRadius: 11,
                background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 8px 28px rgba(37,99,235,0.45)",
              }}
            >
              Start Investing
              <ArrowRightIcon style={{ width: 18, height: 18 }} />
            </Link>
            <Link
              href="/exchange"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 24px",
                borderRadius: 11,
                border: "1.5px solid rgba(255,255,255,0.18)",
                backgroundColor: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.92)",
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                backdropFilter: "blur(6px)",
              }}
            >
              <PlayCircleIcon style={{ width: 19, height: 19 }} />
              See the Exchange
            </Link>
          </div>

          {/* Trust row */}
          <div className="hero-trust" style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {[
              { icon: <ShieldCheckIcon style={{ width: 15, height: 15, color: "#34d399" }} />, text: "CMA Regulated" },
              { icon: <BoltIcon style={{ width: 15, height: 15, color: "#60a5fa" }} />, text: "Avg. 10.4% Annual Yield" },
              { icon: <CheckBadgeIcon style={{ width: 15, height: 15, color: "#a78bfa" }} />, text: "14,250+ Investors" },
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 7,
                backgroundColor: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 99, padding: "7px 14px",
              }}>
                {item.icon}
                <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — live property card */}
        <div style={{ position: "relative" }} className="hero-right">
          {/* Floating portfolio value chip */}
          <div
            style={{
              position: "absolute",
              top: 18,
              left: -26,
              zIndex: 10,
              backgroundColor: "rgba(255,255,255,0.98)",
              borderRadius: 13,
              padding: "11px 15px",
              boxShadow: "0 16px 48px rgba(0,0,0,0.35)",
              border: "1px solid rgba(255,255,255,0.6)",
              minWidth: 150,
              animation: "float-a 5.5s ease-in-out infinite",
            }}
          >
            <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 2px 0", fontWeight: 500 }}>Portfolio Value</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 2px 0" }}>UGX 14.8M</p>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: "#10b981" }}>
              <ArrowTrendingUpIcon style={{ width: 12, height: 12 }} />
              +4.62% Today
            </div>
          </div>

          {/* Floating income chip */}
          <div
            style={{
              position: "absolute",
              bottom: 74,
              right: -22,
              zIndex: 10,
              backgroundColor: "rgba(255,255,255,0.98)",
              borderRadius: 13,
              padding: "11px 15px",
              boxShadow: "0 16px 48px rgba(0,0,0,0.35)",
              border: "1px solid rgba(255,255,255,0.6)",
              animation: "float-b 6.5s ease-in-out infinite",
            }}
          >
            <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 2px 0", fontWeight: 500 }}>Monthly Income</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 2px 0" }}>UGX 185K</p>
            <p style={{ fontSize: 11, color: "#10b981", fontWeight: 600, margin: 0 }}>Paid on the 5th, automatically</p>
          </div>

          {/* Main property card */}
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              boxShadow: "0 32px 80px rgba(0,0,0,0.45)",
              border: "1px solid rgba(255,255,255,0.14)",
              overflow: "hidden",
              maxWidth: 420,
              marginLeft: "auto",
            }}
          >
            {/* Property image */}
            <div style={{ position: "relative", height: 210, overflow: "hidden" }}>
              <img
                src={hero.image}
                alt={hero.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)",
                }}
              />
              <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6 }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    backgroundColor: "rgba(255,255,255,0.94)",
                    borderRadius: 99,
                    padding: "4px 10px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#16a34a",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <CheckBadgeIcon style={{ width: 13, height: 13 }} />
                  Verified
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    backgroundColor: "rgba(13,148,136,0.92)",
                    borderRadius: 99,
                    padding: "4px 10px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  {hero.occupancy}% Occupied
                </span>
              </div>
            </div>

            {/* Card content */}
            <div style={{ padding: "16px 18px 20px" }}>
              {/* Name + price */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 3px 0" }}>
                    {hero.name}
                  </h3>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{hero.location}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 2px 0", letterSpacing: "-0.5px" }}>
                    UGX {hero.pricePerShare.toLocaleString()}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3, fontSize: 12, fontWeight: 700, color: heroUp ? "#10b981" : "#ef4444" }}>
                    {heroUp ? <ArrowTrendingUpIcon style={{ width: 13, height: 13 }} /> : <ArrowTrendingDownIcon style={{ width: 13, height: 13 }} />}
                    {heroUp ? "+" : ""}{hero.priceChangePercent}% Today
                  </div>
                </div>
              </div>

              {/* Sparkline chart */}
              <div
                style={{
                  backgroundColor: "#f8fafc",
                  borderRadius: 10,
                  padding: "10px 14px",
                  marginBottom: 14,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div>
                  <p style={{ fontSize: 10, color: "#94a3b8", marginBottom: 1, fontWeight: 500 }}>30-day chart</p>
                  <p style={{ fontSize: 11, fontWeight: 600, color: heroUp ? "#10b981" : "#ef4444", margin: 0 }}>{heroUp ? "↑ Trending up" : "↓ Cooling off"}</p>
                </div>
                <Sparkline data={heroSparkData} width={160} height={48} positive={heroUp} strokeWidth={2.2} />
              </div>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
                {[
                  { label: "Yield (Annual)", value: `${hero.rentalYield}%`, green: true },
                  { label: "Area Score", value: `${hero.areaScore}/100` },
                  { label: "Growth", value: hero.futureGrowth, green: hero.futureGrowth === "High" },
                ].map(s => (
                  <div key={s.label} style={{ backgroundColor: "#f8fafc", borderRadius: 8, padding: "8px 6px", textAlign: "center" }}>
                    <p style={{ fontSize: 10, color: "#94a3b8", margin: "0 0 3px 0", fontWeight: 500 }}>{s.label}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: s.green ? "#10b981" : "#0f172a", margin: 0 }}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                href={`/property/${hero.id}`}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "12px 0",
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  textAlign: "center",
                  textDecoration: "none",
                  boxSizing: "border-box",
                }}
              >
                Buy Shares — UGX {hero.pricePerShare.toLocaleString()}/share
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
