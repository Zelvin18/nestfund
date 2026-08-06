"use client"

import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UsersIcon,
  Squares2X2Icon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline"
import { marketStats } from "@/lib/mockData"

const stats = [
  {
    label: "Market Volume",
    value: marketStats.marketVolume,
    change: marketStats.marketVolumeChange,
    sub: "Total 24H Trading",
    icon: ArrowTrendingUpIcon,
    iconBg: "#eff6ff",
    iconColor: "#2563eb",
  },
  {
    label: "Total Investors",
    value: marketStats.totalInvestors.toLocaleString(),
    change: marketStats.investorsChange,
    sub: "Active Platform Users",
    icon: UsersIcon,
    iconBg: "#f0fdf4",
    iconColor: "#16a34a",
  },
  {
    label: "Active Listings",
    value: String(marketStats.activeListings),
    change: marketStats.listingsChange,
    sub: "Available Properties",
    icon: Squares2X2Icon,
    iconBg: "#fefce8",
    iconColor: "#ca8a04",
  },
  {
    label: "Avg. Annual Return",
    value: `${marketStats.avgAnnualReturn}%`,
    change: marketStats.returnChange,
    sub: "Historical Performance",
    icon: CurrencyDollarIcon,
    iconBg: "#fdf4ff",
    iconColor: "#9333ea",
  },
]

export default function MarketOverview() {
  return (
    <section style={{ backgroundColor: "#f8fafc", padding: "64px 0" }} className="section-pad">
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }} className="container">

        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: 30, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", margin: "0 0 8px 0" }}>
            Live Market Overview
          </h2>
          <p style={{ fontSize: 16, color: "#64748b", margin: 0 }}>
            Real-time statistics powering smarter investment decisions
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
          }}
          className="stats-grid"
        >
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StatCard({
  label, value, change, sub, icon: Icon, iconBg, iconColor,
}: {
  label: string; value: string; change: number; sub: string
  icon: React.ElementType; iconBg: string; iconColor: string
}) {
  const positive = change >= 0

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: "22px 20px",
        border: "1.5px solid #f1f5f9",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 11,
            backgroundColor: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon style={{ width: 20, height: 20, color: iconColor }} />
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 3,
            padding: "3px 9px",
            borderRadius: 99,
            backgroundColor: positive ? "#f0fdf4" : "#fef2f2",
            fontSize: 11,
            fontWeight: 700,
            color: positive ? "#16a34a" : "#dc2626",
          }}
        >
          {positive
            ? <ArrowTrendingUpIcon style={{ width: 11, height: 11 }} />
            : <ArrowTrendingDownIcon style={{ width: 11, height: 11 }} />
          }
          {positive ? "+" : ""}{change.toFixed(2)}%
        </div>
      </div>

      <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500, margin: "0 0 4px 0" }}>{label}</p>
      <p style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", margin: "0 0 4px 0" }}>
        {value}
      </p>
      <p style={{ fontSize: 11, color: "#cbd5e1", fontWeight: 500, margin: 0 }}>{sub}</p>
    </div>
  )
}
