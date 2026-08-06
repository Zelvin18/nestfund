"use client"

import Link from "next/link"
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/solid"
import {
  WalletIcon,
  ChartPieIcon,
  BanknotesIcon,
  ArrowsRightLeftIcon,
  PlusIcon,
} from "@heroicons/react/24/outline"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts"
import { featuredProperties } from "@/lib/mockData"
import Sparkline from "@/components/ui/Sparkline"

const mockPortfolio = [
  { propertyId: "sunrise-apartments", shares: 800, invested: 1000000, currentValue: 1045000 },
  { propertyId: "acacia-office-park", shares: 200, invested: 420000, currentValue: 504000 },
  { propertyId: "green-heights", shares: 630, invested: 504000, currentValue: 474500 },
]

const performanceData = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  value: 12000000 + i * 420000 + (Math.random() * 200000 - 50000),
}))

const COLORS = ["#2563eb", "#10b981", "#7c3aed"]

export default function PortfolioPage() {
  const totalValue = mockPortfolio.reduce((s, p) => s + p.currentValue, 0)
  const totalInvested = mockPortfolio.reduce((s, p) => s + p.invested, 0)
  const totalGain = totalValue - totalInvested
  const totalGainPct = (totalGain / totalInvested) * 100

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>

      {/* Page header */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1.5px solid #f1f5f9" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 28px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <h1 style={{ fontSize: 34, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.6px", margin: "0 0 6px 0" }}>
                My Portfolio
              </h1>
              <p style={{ fontSize: 15, color: "#64748b", margin: 0 }}>
                Track your property investments and monthly income
              </p>
            </div>
            <Link
              href="/market"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "10px 20px", borderRadius: 10,
                background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none",
              }}
            >
              <PlusIcon style={{ width: 16, height: 16 }} />
              Add Investment
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px" }}>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18, marginBottom: 24 }} className="summary-grid">
          {[
            { label: "Portfolio Value", value: `UGX ${formatCurrency(totalValue)}`, change: totalGainPct, icon: ChartPieIcon, iconColor: "#2563eb", iconBg: "#eff6ff" },
            { label: "Total Invested", value: `UGX ${formatCurrency(totalInvested)}`, neutral: true, icon: WalletIcon, iconColor: "#7c3aed", iconBg: "#f5f3ff" },
            { label: "Total Gain", value: `UGX ${formatCurrency(totalGain)}`, change: totalGainPct, icon: ArrowTrendingUpIcon, iconColor: "#16a34a", iconBg: "#f0fdf4" },
            { label: "Monthly Income", value: "UGX 185,000", change: 2.4, icon: BanknotesIcon, iconColor: "#ea580c", iconBg: "#fff7ed" },
          ].map((card) => (
            <SummaryCard key={card.label} {...card} />
          ))}
        </div>

        {/* Charts row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, marginBottom: 24 }} className="portfolio-chart-grid">

          {/* Performance chart */}
          <div style={{ backgroundColor: "#fff", borderRadius: 16, padding: "22px 20px", border: "1.5px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 3px 0" }}>Portfolio Performance</h2>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>12-month value growth</p>
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: "#10b981", backgroundColor: "#f0fdf4", padding: "4px 10px", borderRadius: 99 }}>
                <ArrowTrendingUpIcon style={{ width: 13, height: 13 }} />
                +{formatPercentage(totalGainPct)} all time
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={performanceData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={v => `${(v / 1000000).toFixed(0)}M`} width={40} />
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: "1px solid #f1f5f9", fontSize: 13 }}
                  formatter={(v: unknown) => [`UGX ${formatCurrency(Number(v))}`, "Portfolio Value"]}
                />
                <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "#2563eb", stroke: "#fff", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Allocation */}
          <div style={{ backgroundColor: "#fff", borderRadius: 16, padding: "22px 20px", border: "1.5px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 16px 0" }}>Allocation</h2>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <PieChart width={160} height={160}>
                <Pie
                  data={mockPortfolio.map(p => ({ name: p.propertyId, value: p.currentValue }))}
                  cx="50%" cy="50%"
                  outerRadius={70} innerRadius={34}
                  dataKey="value" paddingAngle={4}
                >
                  {mockPortfolio.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
              </PieChart>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {mockPortfolio.map((p, i) => {
                const prop = featuredProperties.find(f => f.id === p.propertyId)
                const pct = ((p.currentValue / totalValue) * 100).toFixed(1)
                return (
                  <div key={p.propertyId} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: COLORS[i], flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{prop?.name}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 60, height: 4, borderRadius: 99, backgroundColor: "#f1f5f9", overflow: "hidden" }}>
                        <div style={{ width: `${pct}%`, height: "100%", backgroundColor: COLORS[i], borderRadius: 99 }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", minWidth: 36, textAlign: "right" }}>{pct}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Holdings table */}
        <div style={{ backgroundColor: "#fff", borderRadius: 16, border: "1.5px solid #f1f5f9", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 }}>My Holdings</h2>
            <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>{mockPortfolio.length} positions</span>
          </div>

          <div className="responsive-table" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc" }}>
                  {["Property", "Shares Owned", "Avg. Price", "Current Value", "Gain / Loss", "30d Chart", "Action"].map(h => (
                    <th
                      key={h}
                      style={{
                        padding: "11px 18px",
                        textAlign: h === "Property" ? "left" : "right",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockPortfolio.map((holding, idx) => {
                  const prop = featuredProperties.find(f => f.id === holding.propertyId)
                  if (!prop) return null
                  const gain = holding.currentValue - holding.invested
                  const gainPct = (gain / holding.invested) * 100
                  const positive = gain >= 0
                  const sparkData = prop.chartData.slice(-20).map(d => d.value)

                  return (
                    <tr
                      key={holding.propertyId}
                      style={{ borderTop: idx === 0 ? "none" : "1px solid #f8fafc", transition: "background 0.15s" }}
                      onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "#f8fafc"}
                      onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = ""}
                    >
                      {/* Property */}
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <img
                            src={prop.image}
                            alt={prop.name}
                            style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover", flexShrink: 0 }}
                          />
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 2px 0" }}>{prop.name}</p>
                            <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{prop.location}</p>
                          </div>
                        </div>
                      </td>
                      {/* Shares */}
                      <td style={{ padding: "14px 18px", textAlign: "right", fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                        {holding.shares.toLocaleString()}
                      </td>
                      {/* Avg price */}
                      <td style={{ padding: "14px 18px", textAlign: "right", fontSize: 13, color: "#64748b" }}>
                        UGX {formatCurrency(holding.invested / holding.shares)}
                      </td>
                      {/* Current value */}
                      <td style={{ padding: "14px 18px", textAlign: "right", fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                        UGX {formatCurrency(holding.currentValue)}
                      </td>
                      {/* Gain/Loss */}
                      <td style={{ padding: "14px 18px", textAlign: "right" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 2 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 700, color: positive ? "#10b981" : "#ef4444" }}>
                            {positive ? <ArrowTrendingUpIcon style={{ width: 13, height: 13 }} /> : <ArrowTrendingDownIcon style={{ width: 13, height: 13 }} />}
                            {formatPercentage(gainPct)}
                          </div>
                          <span style={{ fontSize: 11, color: positive ? "#10b981" : "#ef4444" }}>
                            {positive ? "+" : ""}UGX {formatCurrency(gain)}
                          </span>
                        </div>
                      </td>
                      {/* Sparkline */}
                      <td style={{ padding: "14px 18px", textAlign: "right" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <Sparkline data={sparkData} width={90} height={36} positive={positive} strokeWidth={1.8} />
                        </div>
                      </td>
                      {/* Action */}
                      <td style={{ padding: "14px 18px", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                          <Link
                            href={`/property/${prop.id}`}
                            style={{ padding: "6px 12px", borderRadius: 8, backgroundColor: "#eff6ff", color: "#2563eb", fontSize: 12, fontWeight: 600, textDecoration: "none" }}
                          >
                            Buy More
                          </Link>
                          <button style={{ padding: "6px 12px", borderRadius: 8, backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", color: "#64748b", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                            Sell
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ label, value, change, icon: Icon, iconColor, iconBg, neutral }: {
  label: string; value: string; change?: number; icon: React.ElementType
  iconColor: string; iconBg: string; neutral?: boolean
}) {
  const positive = (change ?? 0) >= 0
  return (
    <div style={{ backgroundColor: "#fff", borderRadius: 14, padding: "20px", border: "1.5px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
        <div style={{ width: 40, height: 40, borderRadius: 11, backgroundColor: iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon style={{ width: 20, height: 20, color: iconColor }} />
        </div>
        {!neutral && change !== undefined && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "3px 8px", borderRadius: 99, backgroundColor: positive ? "#f0fdf4" : "#fef2f2", fontSize: 11, fontWeight: 700, color: positive ? "#16a34a" : "#dc2626" }}>
            {positive ? <ArrowTrendingUpIcon style={{ width: 11, height: 11 }} /> : <ArrowTrendingDownIcon style={{ width: 11, height: 11 }} />}
            {positive ? "+" : ""}{change?.toFixed(1)}%
          </div>
        )}
      </div>
      <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500, margin: "0 0 5px 0" }}>{label}</p>
      <p style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.4px" }}>{value}</p>
    </div>
  )
}
