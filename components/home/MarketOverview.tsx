"use client"

import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  UsersIcon,
  Squares2X2Icon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline"
import { marketStats } from "@/lib/mockData"
import Sparkline from "@/components/ui/Sparkline"

const volumeData  = [18,22,19,25,21,28,24,30,27,32,29,35,31,38,34,40,37,42,39,44,42,46,43,48,45,49]
const investData  = [120,125,122,130,128,135,133,140,138,145,142,148,146,152,150,156,154,160,158,164,162,168,165,170,168,172]
const listData    = [280,285,290,288,295,292,298,296,302,300,306,304,308,306,310,309,312,311,313,312,314,313,315,314,316,312]
const returnData  = [9.1,9.0,9.2,8.9,9.0,8.8,8.9,8.7,8.8,8.7,8.6,8.7,8.6,8.5,8.6,8.5,8.64,8.5,8.4,8.5,8.4,8.3,8.4,8.3,8.2,8.64]

const stats = [
  { label: "Market Volume",     value: marketStats.marketVolume,                  change: marketStats.marketVolumeChange, sub: "Total 24H Trading",       icon: ArrowTrendingUpIcon, iconBg: "#eff6ff", iconColor: "#2563eb", sparkData: volumeData,  positive: true  },
  { label: "Total Investors",   value: marketStats.totalInvestors.toLocaleString(), change: marketStats.investorsChange,   sub: "Active Platform Users",   icon: UsersIcon,           iconBg: "#f0fdf4", iconColor: "#16a34a", sparkData: investData,  positive: true  },
  { label: "Active Listings",   value: String(marketStats.activeListings),         change: marketStats.listingsChange,    sub: "Available Properties",    icon: Squares2X2Icon,      iconBg: "#fefce8", iconColor: "#ca8a04", sparkData: listData,    positive: true  },
  { label: "Avg. Annual Return",value: `${marketStats.avgAnnualReturn}%`,          change: marketStats.returnChange,      sub: "Historical Performance",  icon: CurrencyDollarIcon,  iconBg: "#fdf4ff", iconColor: "#9333ea", sparkData: returnData,  positive: false },
]

export default function MarketOverview() {
  return (
    <section className="section-pad" style={{ backgroundColor: "#f8fafc", padding: "56px 0" }}>
      <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>

        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", margin: "0 0 6px 0" }}>
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

function StatCard({ label, value, change, sub, icon: Icon, iconBg, iconColor, sparkData, positive }: {
  label: string; value: string; change: number; sub: string
  icon: React.ElementType; iconBg: string; iconColor: string
  sparkData: number[]; positive: boolean
}) {
  const isUp = change >= 0

  return (
    <div style={{
      backgroundColor: "#fff",
      borderRadius: 14,
      padding: "16px 18px 14px",
      border: "1px solid #e8ecf0",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    }}>
      {/* Row 1: icon + badge */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, backgroundColor: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon style={{ width: 17, height: 17, color: iconColor }} />
        </div>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 3,
          padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 700,
          backgroundColor: isUp ? "#f0fdf4" : "#fef2f2",
          color: isUp ? "#16a34a" : "#dc2626",
        }}>
          {isUp ? <ArrowTrendingUpIcon style={{ width: 10, height: 10 }} /> : <ArrowTrendingDownIcon style={{ width: 10, height: 10 }} />}
          {isUp ? "+" : ""}{change.toFixed(2)}%
        </span>
      </div>

      {/* Label + value */}
      <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, margin: "0 0 3px 0" }}>{label}</p>
      <p style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.4px", margin: "0 0 1px 0" }}>{value}</p>
      <p style={{ fontSize: 10, color: "#cbd5e1", fontWeight: 500, margin: "0 0 12px 0" }}>{sub}</p>

      {/* Sparkline */}
      <div style={{ borderTop: "1px solid #f8fafc", paddingTop: 10, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: 9, color: "#94a3b8", fontWeight: 500 }}>30-day trend</span>
        <Sparkline data={sparkData} width={90} height={28} positive={positive} strokeWidth={1.6} />
      </div>
    </div>
  )
}
