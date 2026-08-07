"use client"

import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline"
import { marketStats } from "@/lib/mockData"

const stats = [
  { label: "Market Volume",      value: marketStats.marketVolume,                    change: marketStats.marketVolumeChange, sub: "Total 24H Trading"       },
  { label: "Total Investors",    value: marketStats.totalInvestors.toLocaleString(), change: marketStats.investorsChange,    sub: "Active Platform Users"   },
  { label: "Active Listings",    value: String(marketStats.activeListings),          change: marketStats.listingsChange,     sub: "Available Properties"    },
  { label: "Avg. Annual Return", value: `${marketStats.avgAnnualReturn}%`,           change: marketStats.returnChange,       sub: "Historical Performance"  },
]

export default function MarketOverview() {
  return (
    <section className="section-pad" style={{ backgroundColor: "#f8fafc", padding: "48px 0" }}>
      <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.4px", margin: "0 0 6px 0" }}>
            Live Market Overview
          </h2>
          <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
            Real-time statistics powering smarter investment decisions
          </p>
        </div>

        <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StatCard({ label, value, change, sub }: {
  label: string; value: string; change: number; sub: string
}) {
  const isUp = change >= 0

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: "20px 22px",
        border: "1px solid #e8ecf0",
      }}
    >
      {/* % change badge */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 3,
          fontSize: 12, fontWeight: 700,
          color: isUp ? "#16a34a" : "#dc2626",
        }}>
          {isUp
            ? <ArrowTrendingUpIcon style={{ width: 13, height: 13 }} />
            : <ArrowTrendingDownIcon style={{ width: 13, height: 13 }} />
          }
          {isUp ? "+" : ""}{change.toFixed(2)}%
        </span>
      </div>

      {/* Label */}
      <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500, margin: "0 0 5px 0" }}>
        {label}
      </p>

      {/* Big value */}
      <p style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.6px", margin: "0 0 5px 0", lineHeight: 1 }}>
        {value}
      </p>

      {/* Sub label */}
      <p style={{ fontSize: 11, color: "#cbd5e1", margin: 0 }}>
        {sub}
      </p>
    </div>
  )
}
