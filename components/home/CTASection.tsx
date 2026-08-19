"use client"

import Link from "next/link"
import { ArrowRightIcon, ShieldCheckIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline"
import { ArrowTrendingUpIcon } from "@heroicons/react/24/solid"

export default function CTASection() {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "90px 24px",
        background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 40%, #4f46e5 100%)",
      }}
    >
      {/* Background decorations */}
      <div style={{ position: "absolute", top: -60, left: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.04)", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: -80, right: -40, width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,0.03)", zIndex: 0 }} />
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 400, borderRadius: "50%", background: "rgba(255,255,255,0.03)", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto", textAlign: "center" }}>

        {/* Top badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            backgroundColor: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 99,
            padding: "6px 16px",
            fontSize: 12,
            fontWeight: 600,
            color: "#bfdbfe",
            marginBottom: 28,
            backdropFilter: "blur(8px)",
          }}
        >
          <ArrowTrendingUpIcon style={{ width: 13, height: 13 }} />
          Join 14,250+ investors already earning
        </div>

        <h2
          style={{
            fontSize: 48,
            fontWeight: 900,
            color: "#fff",
            letterSpacing: "-1px",
            lineHeight: 1.1,
            margin: "0 0 20px 0",
          }}
        >
          Start Building Wealth
          <br />
          <span style={{ color: "#93c5fd" }}>Through Real Opportunities</span>
        </h2>

        <p
          style={{
            fontSize: 18,
            color: "#bfdbfe",
            lineHeight: 1.7,
            margin: "0 0 40px 0",
            maxWidth: 520,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Invest in verified opportunities — contracts, trade, assets and property —
          from as little as <strong style={{ color: "#fff" }}>UGX 50,000</strong>. Grow your portfolio like a pro.
        </p>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap", marginBottom: 32 }}>
          <Link
            href="/auth/register"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 28px",
              borderRadius: 12,
              backgroundColor: "#fff",
              color: "#1e3a8a",
              fontSize: 15,
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            }}
          >
            Create Free Account
            <ArrowRightIcon style={{ width: 18, height: 18 }} />
          </Link>
          <Link
            href="/market"
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "14px 28px",
              borderRadius: 12,
              border: "1.5px solid rgba(255,255,255,0.35)",
              backgroundColor: "transparent",
              color: "#fff",
              fontSize: 15,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Browse Opportunities
          </Link>
        </div>

        {/* Trust row */}
        <div style={{ display: "flex", justifyContent: "center", gap: 28, flexWrap: "wrap" }}>
          {[
            { icon: <ShieldCheckIcon style={{ width: 15, height: 15 }} />, text: "No hidden fees" },
            { icon: <CurrencyDollarIcon style={{ width: 15, height: 15 }} />, text: "From UGX 50,000" },
            { icon: <ArrowTrendingUpIcon style={{ width: 15, height: 15 }} />, text: "Avg. 8.6% annual return" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, color: "#93c5fd", fontSize: 13, fontWeight: 500 }}>
              {item.icon}
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
