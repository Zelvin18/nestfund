"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeftIcon, MapPinIcon, HeartIcon, ShareIcon,
  DocumentTextIcon, BuildingOfficeIcon, CalendarIcon,
  UserGroupIcon, ShieldCheckIcon, ChartBarIcon,
} from "@heroicons/react/24/outline"
import {
  ArrowTrendingUpIcon, ArrowTrendingDownIcon,
  CheckBadgeIcon, StarIcon, FireIcon,
} from "@heroicons/react/24/solid"
import { featuredProperties } from "@/lib/mockData"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Area, AreaChart,
} from "recharts"

const timeRanges = ["1W", "1M", "3M", "6M", "1Y", "ALL"]

const updates = [
  { date: "Jan 2026", event: "Rent increased 8% following lease renewal", type: "positive" },
  { date: "Nov 2025", event: "New access road completed nearby", type: "positive" },
  { date: "Sep 2025", event: "Property fully occupied — 0% vacancy", type: "positive" },
  { date: "Jun 2025", event: "Annual valuation completed — value up 12%", type: "positive" },
]

const docs = [
  { name: "Title Deed", status: "Verified" },
  { name: "Valuation Report", status: "Verified" },
  { name: "Investment Prospectus", status: "Available" },
  { name: "Lease Agreements", status: "Available" },
]

export default function PropertyDetailPage({ id }: { id: string }) {
  const property = featuredProperties.find((p) => p.id === id)
  const [shares, setShares] = useState(100)
  const [range, setRange] = useState("1M")
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState<"overview" | "financials" | "documents" | "updates">("overview")

  if (!property) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <p style={{ color: "#64748b" }}>Property not found</p>
      </div>
    )
  }

  const isPositive = property.priceChangePercent >= 0
  const totalCost = shares * property.pricePerShare
  const monthlyIncome = (totalCost * (property.rentalYield / 100)) / 12
  const annualIncome = totalCost * (property.rentalYield / 100)
  const sharesPct = Math.round((property.availableShares / property.totalShares) * 100)
  const soldPct = 100 - sharesPct
  const chartColor = isPositive ? "#10b981" : "#ef4444"

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {/* ── BACK BAR ── */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1.5px solid #f1f5f9", position: "sticky", top: 64, zIndex: 40 }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px", height: 50, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/market" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 500, color: "#64748b", textDecoration: "none" }}>
            <ArrowLeftIcon style={{ width: 15, height: 15 }} />
            Market
          </Link>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setSaved(!saved)}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 8, border: `1.5px solid ${saved ? "#fecaca" : "#e2e8f0"}`, background: saved ? "#fef2f2" : "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: saved ? "#dc2626" : "#64748b" }}
            >
              <HeartIcon style={{ width: 14, height: 14, color: saved ? "#dc2626" : "#9ca3af" }} />
              {saved ? "Saved" : "Save"}
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#64748b" }}>
              <ShareIcon style={{ width: 14, height: 14, color: "#9ca3af" }} />
              Share
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 20px" }}>
        <div className="property-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, alignItems: "start" }}>

          {/* ══ LEFT COLUMN ══ */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Hero image */}
            <div style={{ borderRadius: 20, overflow: "hidden", position: "relative", height: 380, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
              <img src={property.image} alt={property.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%)" }} />
              {/* Badges top */}
              <div style={{ position: "absolute", top: 16, left: 16, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, backgroundColor: "rgba(255,255,255,0.95)", borderRadius: 99, padding: "5px 11px", fontSize: 12, fontWeight: 700, color: "#16a34a" }}>
                  <CheckBadgeIcon style={{ width: 14, height: 14 }} />
                  Verified Property
                </span>
                {property.futureGrowth === "High" && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, backgroundColor: "rgba(16,185,129,0.9)", borderRadius: 99, padding: "5px 11px", fontSize: 12, fontWeight: 700, color: "#fff" }}>
                    <FireIcon style={{ width: 12, height: 12 }} />
                    High Growth Zone
                  </span>
                )}
              </div>
              {/* Bottom info */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 20px 20px" }}>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: "#fff", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>{property.name}</h1>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.85)" }}>
                  <MapPinIcon style={{ width: 14, height: 14 }} />
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{property.location}</span>
                  <span style={{ color: "rgba(255,255,255,0.4)" }}>•</span>
                  <span style={{ fontSize: 14, color: "rgba(255,255,255,0.7)" }}>
                    {property.id.includes("office") ? "Commercial" : "Residential"}
                  </span>
                </div>
              </div>
            </div>

            {/* Price strip */}
            <div style={{ backgroundColor: "#fff", borderRadius: 16, padding: "20px 22px", border: "1.5px solid #f1f5f9", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 20 }}>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", margin: "0 0 4px 0", textTransform: "uppercase", letterSpacing: "0.07em" }}>Share Price</p>
                  <p style={{ fontSize: 34, fontWeight: 900, color: "#0f172a", margin: "0 0 6px 0", letterSpacing: "-1px" }}>
                    UGX {formatCurrency(property.pricePerShare)}
                  </p>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 99, backgroundColor: isPositive ? "#f0fdf4" : "#fef2f2", border: `1px solid ${isPositive ? "#bbf7d0" : "#fecaca"}` }}>
                    {isPositive ? <ArrowTrendingUpIcon style={{ width: 14, height: 14, color: "#10b981" }} /> : <ArrowTrendingDownIcon style={{ width: 14, height: 14, color: "#ef4444" }} />}
                    <span style={{ fontSize: 13, fontWeight: 700, color: isPositive ? "#10b981" : "#ef4444" }}>
                      {formatPercentage(property.priceChangePercent)} today
                    </span>
                  </div>
                </div>
                {/* Rating */}
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", margin: "0 0 4px 0", textTransform: "uppercase", letterSpacing: "0.07em" }}>Trust Score</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
                    <span style={{ fontSize: 28, fontWeight: 900, color: "#0f172a" }}>98</span>
                    <span style={{ fontSize: 16, color: "#94a3b8", fontWeight: 400 }}>/100</span>
                  </div>
                  <div style={{ display: "flex", gap: 2, justifyContent: "flex-end", marginTop: 4 }}>
                    {[1,2,3,4,5].map(s => <StarIcon key={s} style={{ width: 14, height: 14, color: "#f59e0b" }} />)}
                  </div>
                </div>
              </div>

              {/* 4 key metrics */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
                {[
                  { label: "Annual Yield", value: `${property.rentalYield}%`, color: "#10b981", bg: "#f0fdf4" },
                  { label: "Area Score",   value: `${property.areaScore}/100`, color: "#2563eb", bg: "#eff6ff" },
                  { label: "Growth",       value: property.futureGrowth, color: property.futureGrowth === "High" ? "#10b981" : "#f59e0b", bg: "#f0fdf4" },
                  { label: "Occupancy",    value: "98%", color: "#7c3aed", bg: "#f5f3ff" },
                ].map(m => (
                  <div key={m.label} style={{ backgroundColor: m.bg, borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
                    <p style={{ fontSize: 10, color: "#64748b", fontWeight: 600, margin: "0 0 5px 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>{m.label}</p>
                    <p style={{ fontSize: 18, fontWeight: 800, color: m.color, margin: 0 }}>{m.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart */}
            <div style={{ backgroundColor: "#fff", borderRadius: 16, padding: "20px 20px 12px", border: "1.5px solid #f1f5f9", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 2px 0" }}>Share Price History</h2>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>UGX per share</p>
                </div>
                <div style={{ display: "flex", gap: 2, backgroundColor: "#f8fafc", borderRadius: 10, padding: 3 }}>
                  {timeRanges.map(r => (
                    <button key={r} onClick={() => setRange(r)} style={{ padding: "4px 10px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, backgroundColor: range === r ? "#fff" : "transparent", color: range === r ? "#0f172a" : "#94a3b8", boxShadow: range === r ? "0 1px 4px rgba(0,0,0,0.1)" : "none", transition: "all 0.15s" }}>{r}</button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={property.chartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={chartColor} stopOpacity={0.15} />
                      <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} interval={4} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} width={55} tickFormatter={v => v.toLocaleString()} />
                  <Tooltip
                    contentStyle={{ borderRadius: 10, border: "1px solid #f1f5f9", fontSize: 12, fontWeight: 600 }}
                    formatter={(v: unknown) => [`UGX ${formatCurrency(Number(v))}`, "Price"]}
                    labelStyle={{ color: "#64748b", fontSize: 10 }}
                  />
                  <Area type="monotone" dataKey="value" stroke={chartColor} strokeWidth={2.5} fill="url(#areaGrad)" dot={false} activeDot={{ r: 5, fill: chartColor, stroke: "#fff", strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Tabs */}
            <div style={{ backgroundColor: "#fff", borderRadius: 16, border: "1.5px solid #f1f5f9", boxShadow: "0 1px 6px rgba(0,0,0,0.04)", overflow: "hidden" }}>
              {/* Tab bar */}
              <div style={{ display: "flex", borderBottom: "1.5px solid #f1f5f9", overflowX: "auto" }}>
                {(["overview","financials","documents","updates"] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)} style={{ padding: "14px 20px", border: "none", background: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: tab === t ? "#2563eb" : "#64748b", borderBottom: `2px solid ${tab === t ? "#2563eb" : "transparent"}`, whiteSpace: "nowrap", transition: "all 0.15s", textTransform: "capitalize" }}>{t}</button>
                ))}
              </div>

              <div style={{ padding: "20px" }}>
                {/* OVERVIEW TAB */}
                {tab === "overview" && (
                  <div>
                    <p style={{ fontSize: 14, lineHeight: 1.75, color: "#475569", margin: "0 0 16px 0" }}>
                      <strong style={{ color: "#0f172a" }}>{property.name}</strong> is a premium {property.id.includes("office") ? "commercial complex" : "residential development"} in {property.location}, one of the fastest-growing real estate corridors in the region. The property delivers consistent rental income with strong capital appreciation potential.
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {[
                        { icon: BuildingOfficeIcon, label: "Property Type", value: property.id.includes("office") ? "Commercial" : "Residential" },
                        { icon: UserGroupIcon,       label: "Total Investors", value: "1,248" },
                        { icon: CalendarIcon,        label: "Listed",          value: "March 2024" },
                        { icon: ChartBarIcon,        label: "Total Value",     value: `UGX ${formatCurrency(property.currentPrice)}` },
                      ].map(item => (
                        <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 12, backgroundColor: "#f8fafc", borderRadius: 10, padding: "12px 14px" }}>
                          <div style={{ width: 36, height: 36, borderRadius: 9, backgroundColor: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <item.icon style={{ width: 18, height: 18, color: "#2563eb" }} />
                          </div>
                          <div>
                            <p style={{ fontSize: 10, color: "#94a3b8", margin: "0 0 2px 0", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>{item.label}</p>
                            <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: 0 }}>{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FINANCIALS TAB */}
                {tab === "financials" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      { label: "Gross Rental Income (Annual)", value: `UGX ${formatCurrency(property.currentPrice * 0.13)}`, positive: true },
                      { label: "Property Expenses", value: `UGX ${formatCurrency(property.currentPrice * 0.02)}`, positive: false },
                      { label: "Net Rental Income (Annual)", value: `UGX ${formatCurrency(property.currentPrice * 0.112)}`, positive: true, bold: true },
                      { label: "Property Management Fee (5%)", value: `UGX ${formatCurrency(property.currentPrice * 0.0056)}`, positive: false },
                      { label: "Net Investor Income", value: `UGX ${formatCurrency(property.currentPrice * 0.1064)}`, positive: true, bold: true },
                      { label: "Per Share Annual Yield", value: `${property.rentalYield}%`, positive: true, highlight: true },
                    ].map(row => (
                      <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", borderRadius: 10, backgroundColor: row.highlight ? "#f0fdf4" : "#f8fafc", border: row.highlight ? "1px solid #bbf7d0" : "1px solid transparent" }}>
                        <span style={{ fontSize: 13, color: "#475569", fontWeight: row.bold ? 600 : 400 }}>{row.label}</span>
                        <span style={{ fontSize: 14, fontWeight: row.bold ? 700 : 600, color: row.highlight ? "#16a34a" : row.positive ? "#0f172a" : "#dc2626" }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* DOCUMENTS TAB */}
                {tab === "documents" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {docs.map(doc => (
                      <div key={doc.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 10, backgroundColor: "#f8fafc", border: "1px solid #f1f5f9" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 9, backgroundColor: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <DocumentTextIcon style={{ width: 18, height: 18, color: "#2563eb" }} />
                          </div>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", margin: 0 }}>{doc.name}</p>
                            <p style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0 0 0" }}>PDF Document</p>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: doc.status === "Verified" ? "#16a34a" : "#2563eb", backgroundColor: doc.status === "Verified" ? "#f0fdf4" : "#eff6ff", padding: "3px 9px", borderRadius: 99 }}>{doc.status}</span>
                          <button style={{ fontSize: 12, fontWeight: 600, color: "#2563eb", border: "1.5px solid #bfdbfe", borderRadius: 7, padding: "4px 10px", backgroundColor: "#fff", cursor: "pointer" }}>View</button>
                        </div>
                      </div>
                    ))}
                    <div style={{ padding: "12px 14px", borderRadius: 10, backgroundColor: "#fffbeb", border: "1px solid #fde68a", marginTop: 4 }}>
                      <p style={{ fontSize: 12, color: "#92400e", margin: 0 }}>
                        <ShieldCheckIcon style={{ width: 14, height: 14, display: "inline", marginRight: 5, verticalAlign: "middle" }} />
                        All documents are independently verified by our legal team and Capital Markets Authority.
                      </p>
                    </div>
                  </div>
                )}

                {/* UPDATES TAB */}
                {tab === "updates" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {updates.map((u, i) => (
                      <div key={i} style={{ display: "flex", gap: 14, paddingBottom: 20, position: "relative" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                          <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "#10b981", border: "2px solid #fff", boxShadow: "0 0 0 2px #bbf7d0", marginTop: 4 }} />
                          {i < updates.length - 1 && <div style={{ width: 1, flex: 1, backgroundColor: "#f1f5f9", marginTop: 6 }} />}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 4px 0", fontWeight: 600 }}>{u.date}</p>
                          <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.6 }}>{u.event}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ══ RIGHT COLUMN — BUY WIDGET ══ */}
          <div style={{ position: "sticky", top: 120 }}>
            <div style={{ backgroundColor: "#fff", borderRadius: 18, border: "1.5px solid #f1f5f9", boxShadow: "0 4px 24px rgba(37,99,235,0.08)", overflow: "hidden" }}>

              {/* Widget header */}
              <div style={{ padding: "16px 20px 14px", background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #4f46e5 100%)" }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)", margin: "0 0 4px 0", textTransform: "uppercase", letterSpacing: "0.07em" }}>Current Share Price</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontSize: 26, fontWeight: 900, color: "#fff", margin: 0, letterSpacing: "-0.5px" }}>
                    UGX {formatCurrency(property.pricePerShare)}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: isPositive ? "#6ee7b7" : "#fca5a5" }}>
                    {isPositive ? <ArrowTrendingUpIcon style={{ width: 14, height: 14 }} /> : <ArrowTrendingDownIcon style={{ width: 14, height: 14 }} />}
                    {formatPercentage(property.priceChangePercent)}
                  </div>
                </div>
              </div>

              <div style={{ padding: "18px 20px" }}>
                {/* Share progress bar */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}>Shares sold</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#0f172a" }}>{soldPct}% of {property.totalShares.toLocaleString()}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 99, backgroundColor: "#f1f5f9", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${soldPct}%`, borderRadius: 99, background: "linear-gradient(90deg, #2563eb, #4f46e5)", transition: "width 0.5s" }} />
                  </div>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: "5px 0 0 0" }}>{property.availableShares.toLocaleString()} shares remaining</p>
                </div>

                {/* Shares input */}
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>Number of Shares</label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button onClick={() => setShares(Math.max(1, shares - 10))} style={{ width: 38, height: 44, borderRadius: 9, border: "1.5px solid #e2e8f0", background: "#f8fafc", fontSize: 18, fontWeight: 600, cursor: "pointer", color: "#374151", flexShrink: 0 }}>−</button>
                    <input
                      type="number" value={shares}
                      onChange={e => setShares(Math.max(1, parseInt(e.target.value) || 1))}
                      style={{ flex: 1, height: 44, borderRadius: 9, border: "1.5px solid #e2e8f0", textAlign: "center", fontSize: 18, fontWeight: 700, color: "#0f172a", outline: "none" }}
                      min={1} max={property.availableShares}
                    />
                    <button onClick={() => setShares(Math.min(property.availableShares, shares + 10))} style={{ width: 38, height: 44, borderRadius: 9, border: "1.5px solid #bfdbfe", background: "#eff6ff", fontSize: 18, fontWeight: 600, cursor: "pointer", color: "#2563eb", flexShrink: 0 }}>+</button>
                  </div>
                </div>

                {/* Quick presets */}
                <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
                  {[50, 100, 250, 500].map(n => (
                    <button key={n} onClick={() => setShares(n)} style={{ padding: "5px 13px", borderRadius: 8, border: `1.5px solid ${shares === n ? "#2563eb" : "#e2e8f0"}`, backgroundColor: shares === n ? "#eff6ff" : "#f8fafc", color: shares === n ? "#2563eb" : "#64748b", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                      {n}
                    </button>
                  ))}
                </div>

                {/* Cost summary */}
                <div style={{ backgroundColor: "#f8fafc", borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
                  {[
                    { label: "Price per share", val: `UGX ${formatCurrency(property.pricePerShare)}` },
                    { label: "Number of shares", val: shares.toLocaleString() },
                    { label: "Transaction fee", val: "Free", muted: true },
                  ].map(r => (
                    <div key={r.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 12, color: r.muted ? "#94a3b8" : "#64748b" }}>{r.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: r.muted ? "#10b981" : "#374151" }}>{r.val}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>Total Investment</span>
                    <span style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.3px" }}>UGX {formatCurrency(totalCost)}</span>
                  </div>
                </div>

                {/* Income estimate */}
                <div style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "1.5px solid #bbf7d0", borderRadius: 12, padding: "12px 16px", marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>Est. Income</p>
                    <span style={{ fontSize: 10, color: "#4ade80", backgroundColor: "#166534", padding: "2px 6px", borderRadius: 4, fontWeight: 700 }}>PASSIVE</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <div>
                      <p style={{ fontSize: 10, color: "#16a34a", margin: "0 0 1px 0" }}>Monthly</p>
                      <p style={{ fontSize: 18, fontWeight: 800, color: "#15803d", margin: 0 }}>UGX {formatCurrency(monthlyIncome)}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: 10, color: "#16a34a", margin: "0 0 1px 0" }}>Annual</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#15803d", margin: 0 }}>UGX {formatCurrency(annualIncome)}</p>
                    </div>
                  </div>
                </div>

                {/* Buy button */}
                <button style={{ width: "100%", padding: "14px 0", borderRadius: 12, background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)", color: "#fff", fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(37,99,235,0.3)", marginBottom: 10, letterSpacing: "0.01em" }}>
                  Buy {shares} Shares Now
                </button>
                <button style={{ width: "100%", padding: "11px 0", borderRadius: 12, border: "1.5px solid #e2e8f0", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 14 }}>
                  Preview Order
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center" }}>
                  <ShieldCheckIcon style={{ width: 14, height: 14, color: "#16a34a" }} />
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, textAlign: "center" }}>
                    Regulated · Secure · Verified
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
