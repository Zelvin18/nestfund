"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeftIcon,
  MapPinIcon,
  HeartIcon,
  ShareIcon,
} from "@heroicons/react/24/outline"
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckBadgeIcon,
  StarIcon,
} from "@heroicons/react/24/solid"
import { featuredProperties } from "@/lib/mockData"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

const timeRanges = ["1W", "1M", "3M", "6M", "1Y", "ALL"]

export default function PropertyDetailPage({ id }: { id: string }) {
  const property = featuredProperties.find((p) => p.id === id)
  const [shareAmount, setShareAmount] = useState(100)
  const [activeRange, setActiveRange] = useState("1M")
  const [wishlisted, setWishlisted] = useState(false)

  if (!property) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
        <p style={{ color: "#64748b", fontSize: 16 }}>Property not found</p>
      </div>
    )
  }

  const isPositive = property.priceChangePercent >= 0
  const totalCost = shareAmount * property.pricePerShare
  const estimatedMonthlyIncome = (totalCost * (property.rentalYield / 100)) / 12
  const sharesPct = Math.round((property.availableShares / property.totalShares) * 100)

  const chartColor = isPositive ? "#10b981" : "#ef4444"
  const chartFill = isPositive ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.06)"

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>

      {/* Back nav */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1.5px solid #f1f5f9" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link
            href="/market"
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 14, fontWeight: 500, color: "#4b5563", textDecoration: "none" }}
          >
            <ArrowLeftIcon style={{ width: 16, height: 16 }} />
            Back to Market
          </Link>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => setWishlisted(!wishlisted)}
              style={{
                display: "flex", alignItems: "center", gap: 5, padding: "7px 14px",
                borderRadius: 9, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer",
                fontSize: 13, fontWeight: 500, color: wishlisted ? "#ef4444" : "#4b5563",
              }}
            >
              <HeartIcon style={{ width: 15, height: 15, color: wishlisted ? "#ef4444" : "#9ca3af" }} />
              {wishlisted ? "Saved" : "Save"}
            </button>
            <button
              style={{
                display: "flex", alignItems: "center", gap: 5, padding: "7px 14px",
                borderRadius: 9, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer",
                fontSize: 13, fontWeight: 500, color: "#4b5563",
              }}
            >
              <ShareIcon style={{ width: 15, height: 15, color: "#9ca3af" }} />
              Share
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 28, alignItems: "start" }} className="property-detail-grid">

          {/* ── LEFT COLUMN ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

            {/* Property image + title */}
            <div style={{ backgroundColor: "#fff", borderRadius: 18, overflow: "hidden", border: "1.5px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
              <div style={{ position: "relative", height: 320, overflow: "hidden" }}>
                <img
                  src={property.image}
                  alt={property.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.65) 100%)" }} />
                <div style={{ position: "absolute", top: 16, left: 16, display: "flex", gap: 8 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, backgroundColor: "rgba(255,255,255,0.92)", borderRadius: 99, padding: "5px 11px", fontSize: 12, fontWeight: 700, color: "#16a34a" }}>
                    <CheckBadgeIcon style={{ width: 14, height: 14 }} />
                    Verified Property
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, backgroundColor: "rgba(255,255,255,0.92)", borderRadius: 99, padding: "5px 11px", fontSize: 12, fontWeight: 700, color: "#2563eb" }}>
                    <StarIcon style={{ width: 12, height: 12, color: "#f59e0b" }} />
                    Trust Score 98/100
                  </span>
                </div>
                <div style={{ position: "absolute", bottom: 16, left: 16 }}>
                  <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: "0 0 5px 0", letterSpacing: "-0.4px" }}>
                    {property.name}
                  </h1>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, color: "rgba(255,255,255,0.85)" }}>
                    <MapPinIcon style={{ width: 14, height: 14 }} />
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{property.location}</span>
                  </div>
                </div>
              </div>

              {/* Price strip */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid #f1f5f9" }}>
                <div>
                  <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500, margin: "0 0 2px 0" }}>Share Price</p>
                  <p style={{ fontSize: 30, fontWeight: 900, color: "#0f172a", margin: 0, letterSpacing: "-0.8px" }}>
                    UGX {formatCurrency(property.pricePerShare)}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "6px 14px", borderRadius: 99, backgroundColor: isPositive ? "#f0fdf4" : "#fef2f2", marginBottom: 4 }}>
                    {isPositive
                      ? <ArrowTrendingUpIcon style={{ width: 16, height: 16, color: "#10b981" }} />
                      : <ArrowTrendingDownIcon style={{ width: 16, height: 16, color: "#ef4444" }} />
                    }
                    <span style={{ fontSize: 15, fontWeight: 700, color: isPositive ? "#10b981" : "#ef4444" }}>
                      {formatPercentage(property.priceChangePercent)} (24h)
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                    UGX {formatCurrency(property.priceChange)} change
                  </p>
                </div>
              </div>

              {/* Key metrics grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
                {[
                  { label: "Rental Yield", value: `${property.rentalYield}%`, note: "Annual", color: "#10b981" },
                  { label: "Area Score", value: `${property.areaScore}/100`, note: "Location quality", color: "#2563eb" },
                  { label: "Growth Outlook", value: property.futureGrowth, note: "Forecast", color: property.futureGrowth === "High" ? "#10b981" : "#f59e0b" },
                  { label: "Shares Left", value: `${sharesPct}%`, note: `${property.availableShares.toLocaleString()} available`, color: "#7c3aed" },
                ].map((m, i) => (
                  <div
                    key={m.label}
                    style={{
                      padding: "16px 18px",
                      borderRight: i < 3 ? "1px solid #f1f5f9" : "none",
                      textAlign: "center",
                    }}
                  >
                    <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, margin: "0 0 5px 0" }}>{m.label}</p>
                    <p style={{ fontSize: 20, fontWeight: 800, color: m.color, margin: "0 0 3px 0" }}>{m.value}</p>
                    <p style={{ fontSize: 10, color: "#cbd5e1", margin: 0 }}>{m.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Chart — stock style */}
            <div style={{ backgroundColor: "#fff", borderRadius: 18, padding: "22px 22px 16px", border: "1.5px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: "0 0 3px 0" }}>Share Price History</h2>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>UGX / share over time</p>
                </div>
                {/* Time range tabs */}
                <div style={{ display: "flex", gap: 3, backgroundColor: "#f8fafc", borderRadius: 10, padding: 3 }}>
                  {timeRanges.map(r => (
                    <button
                      key={r}
                      onClick={() => setActiveRange(r)}
                      style={{
                        padding: "5px 10px",
                        borderRadius: 7,
                        border: "none",
                        cursor: "pointer",
                        fontSize: 12,
                        fontWeight: 600,
                        backgroundColor: activeRange === r ? "#fff" : "transparent",
                        color: activeRange === r ? "#0f172a" : "#94a3b8",
                        boxShadow: activeRange === r ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                        transition: "all 0.15s",
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={property.chartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chartColor} stopOpacity={0.12} />
                      <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} interval={4} />
                  <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={v => `${v.toLocaleString()}`} width={64} />
                  <Tooltip
                    contentStyle={{ borderRadius: 10, border: "1.5px solid #f1f5f9", boxShadow: "0 4px 16px rgba(0,0,0,0.1)", fontSize: 13, fontWeight: 600 }}
                    formatter={(v: unknown) => [`UGX ${formatCurrency(Number(v))}`, "Price/Share"]}
                    labelStyle={{ color: "#64748b", fontWeight: 500, fontSize: 11 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={chartColor}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: chartColor, strokeWidth: 2, stroke: "#fff" }}
                    fill="url(#chartGrad)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* About */}
            <div style={{ backgroundColor: "#fff", borderRadius: 18, padding: "24px", border: "1.5px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: "0 0 16px 0" }}>About This Property</h2>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: "#475569", margin: "0 0 12px 0" }}>
                <strong style={{ color: "#0f172a" }}>{property.name}</strong> is a premium{" "}
                {property.id.includes("office") ? "commercial office complex" : "residential apartment complex"} located in{" "}
                {property.location}. The property features modern architecture, high-spec finishes, and is positioned in one
                of the fastest-growing real estate corridors in the region.
              </p>
              <p style={{ fontSize: 14, lineHeight: 1.75, color: "#475569", margin: "0 0 12px 0" }}>
                With a current rental yield of <strong style={{ color: "#10b981" }}>{property.rentalYield}%</strong> per annum
                and a location score of <strong style={{ color: "#2563eb" }}>{property.areaScore}/100</strong>, this property
                offers a compelling mix of stable income and capital appreciation potential.
              </p>
              <div style={{ display: "flex", gap: 20, marginTop: 16 }}>
                {[
                  { label: "Property Type", value: property.id.includes("office") ? "Commercial" : "Residential" },
                  { label: "Total Value", value: `UGX ${formatCurrency(property.currentPrice)}` },
                  { label: "Total Shares", value: property.totalShares.toLocaleString() },
                  { label: "Share Price", value: `UGX ${formatCurrency(property.pricePerShare)}` },
                ].map(d => (
                  <div key={d.label}>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 3px 0", fontWeight: 500 }}>{d.label}</p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: 0 }}>{d.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN — Buy Widget ── */}
          <div style={{ position: "sticky", top: 84 }}>
            <div
              style={{
                backgroundColor: "#fff",
                borderRadius: 18,
                border: "1.5px solid #f1f5f9",
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
                overflow: "hidden",
              }}
            >
              {/* Widget header */}
              <div style={{ padding: "18px 22px", borderBottom: "1px solid #f8fafc", backgroundColor: "#f8fafc" }}>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 4px 0", fontWeight: 500 }}>CURRENT PRICE</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontSize: 26, fontWeight: 900, color: "#0f172a", margin: 0, letterSpacing: "-0.5px" }}>
                    UGX {formatCurrency(property.pricePerShare)}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 700, color: isPositive ? "#10b981" : "#ef4444" }}>
                    {isPositive ? <ArrowTrendingUpIcon style={{ width: 15, height: 15 }} /> : <ArrowTrendingDownIcon style={{ width: 15, height: 15 }} />}
                    {formatPercentage(property.priceChangePercent)}
                  </div>
                </div>
              </div>

              <div style={{ padding: "20px 22px" }}>
                {/* Shares input */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 7 }}>
                    Number of Shares
                  </label>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <button
                      onClick={() => setShareAmount(Math.max(1, shareAmount - 10))}
                      style={{ width: 36, height: 44, borderRadius: 9, border: "1.5px solid #e2e8f0", background: "#f8fafc", fontSize: 18, fontWeight: 600, cursor: "pointer", color: "#374151" }}
                    >−</button>
                    <input
                      type="number"
                      value={shareAmount}
                      onChange={e => setShareAmount(Math.max(1, parseInt(e.target.value) || 1))}
                      style={{ flex: 1, height: 44, borderRadius: 9, border: "1.5px solid #e2e8f0", textAlign: "center", fontSize: 18, fontWeight: 700, color: "#0f172a", outline: "none" }}
                      min={1}
                      max={property.availableShares}
                    />
                    <button
                      onClick={() => setShareAmount(Math.min(property.availableShares, shareAmount + 10))}
                      style={{ width: 36, height: 44, borderRadius: 9, border: "1.5px solid #e2e8f0", background: "#f8fafc", fontSize: 18, fontWeight: 600, cursor: "pointer", color: "#2563eb" }}
                    >+</button>
                  </div>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: "5px 0 0 0" }}>
                    Max: {property.availableShares.toLocaleString()} shares available ({sharesPct}% remaining)
                  </p>
                </div>

                {/* Quick amounts */}
                <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
                  {[50, 100, 250, 500].map(n => (
                    <button
                      key={n}
                      onClick={() => setShareAmount(n)}
                      style={{
                        padding: "5px 12px",
                        borderRadius: 8,
                        border: `1.5px solid ${shareAmount === n ? "#2563eb" : "#e2e8f0"}`,
                        backgroundColor: shareAmount === n ? "#eff6ff" : "#f8fafc",
                        color: shareAmount === n ? "#2563eb" : "#64748b",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {n} shares
                    </button>
                  ))}
                </div>

                {/* Cost breakdown */}
                <div style={{ backgroundColor: "#f8fafc", borderRadius: 12, padding: "14px 16px", marginBottom: 16 }}>
                  {[
                    { label: "Price per share", val: `UGX ${formatCurrency(property.pricePerShare)}` },
                    { label: "Number of shares", val: shareAmount.toLocaleString() },
                    { label: "Platform fee (0%)", val: "UGX 0", muted: true },
                  ].map(row => (
                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontSize: 13, color: row.muted ? "#94a3b8" : "#64748b" }}>{row.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: row.muted ? "#94a3b8" : "#374151" }}>{row.val}</span>
                    </div>
                  ))}
                  <div style={{ borderTop: "1.5px solid #e2e8f0", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>Total Cost</span>
                    <span style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.3px" }}>
                      UGX {formatCurrency(totalCost)}
                    </span>
                  </div>
                </div>

                {/* Estimated income */}
                <div
                  style={{
                    background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                    border: "1.5px solid #bbf7d0",
                    borderRadius: 12,
                    padding: "12px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 18,
                  }}
                >
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#16a34a", margin: "0 0 2px 0" }}>Est. Monthly Income</p>
                    <p style={{ fontSize: 11, color: "#4ade80", margin: 0 }}>Based on {property.rentalYield}% annual yield</p>
                  </div>
                  <p style={{ fontSize: 20, fontWeight: 800, color: "#15803d", margin: 0, letterSpacing: "-0.3px" }}>
                    UGX {formatCurrency(estimatedMonthlyIncome)}
                  </p>
                </div>

                {/* Buy button */}
                <button
                  style={{
                    width: "100%",
                    padding: "14px 0",
                    borderRadius: 12,
                    background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
                    color: "#fff",
                    fontSize: 15,
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
                    letterSpacing: "0.01em",
                    marginBottom: 10,
                  }}
                >
                  Buy {shareAmount.toLocaleString()} Shares
                </button>

                <button
                  style={{
                    width: "100%",
                    padding: "11px 0",
                    borderRadius: 12,
                    border: "1.5px solid #e2e8f0",
                    background: "#fff",
                    color: "#374151",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    marginBottom: 14,
                  }}
                >
                  Preview Order
                </button>

                <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", margin: 0 }}>
                  By proceeding, you agree to our{" "}
                  <Link href="/terms" style={{ color: "#2563eb" }}>Terms of Service</Link>
                  {" & "}
                  <Link href="/risks" style={{ color: "#2563eb" }}>Risk Disclosure</Link>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
