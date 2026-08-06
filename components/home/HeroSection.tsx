"use client"

import Link from "next/link"
import { ArrowRightIcon, ShieldCheckIcon } from "@heroicons/react/24/outline"
import { ArrowTrendingUpIcon, CheckBadgeIcon } from "@heroicons/react/24/solid"
import Sparkline from "@/components/ui/Sparkline"

const heroSparkData = [1140, 1120, 1155, 1148, 1170, 1162, 1180, 1195, 1185, 1210, 1205, 1220, 1215, 1235, 1250]

export default function HeroSection() {
  return (
    <section
      className="hero-section"
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#fff",
        padding: "80px 0 72px",
      }}
    >
      {/* Background blobs */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #eef2ff 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: -80,
          left: "50%",
          transform: "translateX(-50%)",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)",
          zIndex: 0,
        }}
      />

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
        className="hero-grid"
      >
        {/* Left — copy */}
        <div>
          {/* Clean label - no badge/icon */}
          <p style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#2563eb",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: 18,
            margin: "0 0 18px 0",
          }}>
            Real Estate Investment Platform
          </p>

          {/* Headline */}
          <h1
            style={{
              fontSize: 56,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-1.5px",
              color: "#0f172a",
              margin: "0 0 20px 0",
            }}
          >
            Invest in Real Estate.
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Own the Future.
            </span>
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.7,
              color: "#475569",
              margin: "0 0 36px 0",
              maxWidth: 480,
            }}
          >
            Buy shares of verified properties, earn monthly rental income, and trade
            real estate like stocks — with full financial intelligence.
          </p>

          {/* CTA buttons */}
          <div className="hero-ctas" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
            <Link
              href="/market"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 24px",
                borderRadius: 11,
                background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
              }}
            >
              Start Investing
              <ArrowRightIcon style={{ width: 18, height: 18 }} />
            </Link>
            <Link
              href="/market"
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "13px 24px",
                borderRadius: 11,
                border: "1.5px solid #e2e8f0",
                backgroundColor: "#fff",
                color: "#0f172a",
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Explore Properties
            </Link>
          </div>

          {/* Trust row */}
          <div className="hero-trust" style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
            {[
              { icon: <ShieldCheckIcon style={{ width: 16, height: 16, color: "#16a34a" }} />, text: "Secure & Regulated" },
              { icon: <ArrowTrendingUpIcon style={{ width: 16, height: 16, color: "#2563eb" }} />, text: "Avg. 8.6% Annual Return" },
              { icon: <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#10b981", display: "inline-block" }} />, text: "14,250+ Active Investors" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {item.icon}
                <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>{item.text}</span>
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
              top: 24,
              left: -24,
              zIndex: 10,
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: "10px 14px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              border: "1px solid #f1f5f9",
              minWidth: 150,
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
              bottom: 80,
              right: -20,
              zIndex: 10,
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: "10px 14px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              border: "1px solid #f1f5f9",
            }}
          >
            <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 2px 0", fontWeight: 500 }}>Monthly Income</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 2px 0" }}>UGX 185K</p>
            <p style={{ fontSize: 11, color: "#10b981", fontWeight: 600, margin: 0 }}>From rental yield</p>
          </div>

          {/* Main property card */}
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
              border: "1.5px solid #f1f5f9",
              overflow: "hidden",
              maxWidth: 420,
              marginLeft: "auto",
            }}
          >
            {/* Property image */}
            <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
              <img
                src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=700&q=80"
                alt="Sunrise Apartments"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%)",
                }}
              />
              <div style={{ position: "absolute", top: 12, left: 12 }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    backgroundColor: "rgba(255,255,255,0.92)",
                    borderRadius: 99,
                    padding: "4px 10px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#16a34a",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <CheckBadgeIcon style={{ width: 13, height: 13 }} />
                  Verified Property
                </span>
              </div>
            </div>

            {/* Card content */}
            <div style={{ padding: "16px 18px 20px" }}>
              {/* Name + price */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 3px 0" }}>
                    Sunrise Apartments
                  </h3>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>Kiira, Wakiso</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 2px 0", letterSpacing: "-0.5px" }}>
                    UGX 1,250
                  </p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3, fontSize: 12, fontWeight: 700, color: "#10b981" }}>
                    <ArrowTrendingUpIcon style={{ width: 13, height: 13 }} />
                    +8.43% Today
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
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#10b981", margin: 0 }}>↑ Trending up</p>
                </div>
                <Sparkline data={heroSparkData} width={160} height={48} positive={true} strokeWidth={2.2} />
              </div>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
                {[
                  { label: "Yield (Annual)", value: "11.2%", green: true },
                  { label: "Area Score", value: "87/100" },
                  { label: "Growth", value: "High", green: true },
                ].map(s => (
                  <div key={s.label} style={{ backgroundColor: "#f8fafc", borderRadius: 8, padding: "8px 6px", textAlign: "center" }}>
                    <p style={{ fontSize: 10, color: "#94a3b8", margin: "0 0 3px 0", fontWeight: 500 }}>{s.label}</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: s.green ? "#10b981" : "#0f172a", margin: 0 }}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                style={{
                  width: "100%",
                  padding: "11px 0",
                  borderRadius: 10,
                  background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Buy Shares — UGX 1,250/share
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
