"use client"

import {
  CpuChipIcon,
  ChartBarSquareIcon,
  ShieldCheckIcon,
  BoltIcon,
  UserGroupIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline"

const features = [
  {
    icon: CpuChipIcon,
    title: "AI-Powered Intelligence",
    description: "Advanced algorithms track market signals, identify high-growth sectors, and surface the best opportunities before they become mainstream.",
    color: "#2563eb",
    bg: "#eff6ff",
    tag: "Smart",
  },
  {
    icon: ChartBarSquareIcon,
    title: "Real-Time Market Data",
    description: "Live share pricing, 30-day price charts, rental yield tracking, and area performance scores — just like a stock exchange.",
    color: "#7c3aed",
    bg: "#f5f3ff",
    tag: "Live",
  },
  {
    icon: ShieldCheckIcon,
    title: "Secure & Regulated",
    description: "Every opportunity is legally verified and vetted — titles checked, contracts confirmed, operators screened. Bank-grade security throughout.",
    color: "#16a34a",
    bg: "#f0fdf4",
    tag: "Safe",
  },
  {
    icon: BoltIcon,
    title: "Instant Liquidity",
    description: "Sell property shares in seconds on our secondary marketplace, and exit other opportunities on their defined schedules — no agents, no delays.",
    color: "#ea580c",
    bg: "#fff7ed",
    tag: "Fast",
  },
  {
    icon: UserGroupIcon,
    title: "Fractional Ownership",
    description: "Invest from UGX 50,000. Own a piece of contracts, trade deals, productive assets and premium property across Uganda.",
    color: "#0891b2",
    bg: "#ecfeff",
    tag: "Accessible",
  },
  {
    icon: LockClosedIcon,
    title: "Transparent Transactions",
    description: "Full audit trail for every transaction. Real-time breakdown of income, expenses, and performance for every position you hold.",
    color: "#d97706",
    bg: "#fffbeb",
    tag: "Clear",
  },
]

export default function WhyNestFund() {
  return (
    <section style={{ backgroundColor: "#f8fafc", padding: "80px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>

        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
            Platform Advantages
          </p>
          <h2 style={{ fontSize: 34, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.6px", margin: "0 0 12px 0" }}>
            Why NestFund Stands Apart
          </h2>
          <p style={{ fontSize: 17, color: "#64748b", maxWidth: 520, margin: "0 auto" }}>
            Built like a financial exchange — for every kind of opportunity
          </p>
        </div>

        <div className="features-grid">
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                backgroundColor: "#fff",
                borderRadius: 16,
                padding: "28px 24px",
                border: "1.5px solid #f1f5f9",
                boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.boxShadow = `0 8px 28px ${f.color}18`
                el.style.borderColor = `${f.color}30`
                el.style.transform = "translateY(-2px)"
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement
                el.style.boxShadow = "0 1px 6px rgba(0,0,0,0.04)"
                el.style.borderColor = "#f1f5f9"
                el.style.transform = "translateY(0)"
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 13,
                    backgroundColor: f.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <f.icon style={{ width: 24, height: 24, color: f.color }} />
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: f.color,
                    backgroundColor: f.bg,
                    padding: "3px 9px",
                    borderRadius: 99,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {f.tag}
                </span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 10px 0" }}>
                {f.title}
              </h3>
              <p style={{ fontSize: 13, lineHeight: 1.65, color: "#64748b", margin: 0 }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
