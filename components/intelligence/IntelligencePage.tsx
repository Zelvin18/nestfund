"use client"

import { useState } from "react"
import {
  CheckCircleIcon,
  BuildingOffice2Icon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  FunnelIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline"
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/solid"

const allItems = [
  { id: "1", title: "Gov't Approves New Expressway", type: "approval" as const, location: "Entebbe – Kampala", impact: "Properties along the 51km corridor expected to see significant value appreciation. New access roads open 3 untapped residential zones.", change: 11, timeAgo: "2h ago", affectedProps: 312 },
  { id: "2", title: "New Shopping Mall Approved", type: "development" as const, location: "Kira Town, Wakiso", impact: "Commercial activity boost expected within 6 months. Nearby residential properties historically increase 7–12% after mall construction.", change: 7, timeAgo: "5h ago", affectedProps: 89 },
  { id: "3", title: "Flooding Reported in Bwaise", type: "decline" as const, location: "Bwaise, Kampala", impact: "High-risk flood zone alert. Properties in low-lying areas facing devaluation risk. Insurance premiums expected to rise.", change: -8, timeAgo: "7h ago", affectedProps: 47 },
  { id: "4", title: "New University Campus Planned", type: "development" as const, location: "Nansana, Wakiso", impact: "Student housing demand expected to surge. Purpose-built student accommodation currently under-supplied in this corridor.", change: 15, timeAgo: "12h ago", affectedProps: 134 },
  { id: "5", title: "Property Tax Increase in Kololo", type: "decline" as const, location: "Kololo, Kampala", impact: "Local council approved 12% property tax increase. Net rental yields in the area may decrease by 0.5–1.2% for investors.", change: -4, timeAgo: "1d ago", affectedProps: 28 },
  { id: "6", title: "New Industrial Park Approved", type: "approval" as const, location: "Namanve, Mukono", impact: "20,000+ workers expected to relocate to the area. Worker housing demand rising. Strong buy signal for budget residential.", change: 9, timeAgo: "2d ago", affectedProps: 201 },
]

type FilterType = "all" | "positive" | "negative" | "approval" | "development"

export default function IntelligencePage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")

  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: "all", label: "All Updates", count: allItems.length },
    { key: "positive", label: "Positive", count: allItems.filter(i => i.change > 0).length },
    { key: "negative", label: "Negative", count: allItems.filter(i => i.change < 0).length },
    { key: "approval", label: "Government", count: allItems.filter(i => i.type === "approval").length },
    { key: "development", label: "Development", count: allItems.filter(i => i.type === "development").length },
  ]

  const filtered = activeFilter === "all" ? allItems
    : activeFilter === "positive" ? allItems.filter(i => i.change > 0)
    : activeFilter === "negative" ? allItems.filter(i => i.change < 0)
    : allItems.filter(i => i.type === activeFilter)

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>

      {/* Header */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1.5px solid #f1f5f9" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 0" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 34, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.6px", margin: "0 0 6px 0" }}>
                Market Intelligence
              </h1>
              <p style={{ fontSize: 15, color: "#64748b", margin: 0 }}>
                Real-time events, policy changes, and developments affecting property values
              </p>
            </div>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 9, border: "1.5px solid #e2e8f0", backgroundColor: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#374151" }}>
              <ArrowPathIcon style={{ width: 15, height: 15 }} />
              Refresh
            </button>
          </div>

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: 4 }}>
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "9px 16px",
                  borderRadius: "9px 9px 0 0",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 600,
                  backgroundColor: activeFilter === f.key ? "#fff" : "transparent",
                  color: activeFilter === f.key ? "#0f172a" : "#64748b",
                  borderBottom: activeFilter === f.key ? "2px solid #2563eb" : "2px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                {f.label}
                <span style={{ fontSize: 11, padding: "1px 6px", borderRadius: 99, backgroundColor: activeFilter === f.key ? "#eff6ff" : "#f1f5f9", color: activeFilter === f.key ? "#2563eb" : "#94a3b8", fontWeight: 700 }}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="intel-grid">
          {filtered.map(item => (
            <IntelCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

function IntelCard({ item }: { item: typeof allItems[0] }) {
  const positive = item.change >= 0

  const config = {
    approval: { Icon: CheckCircleIcon, bg: "#f0fdf4", color: "#16a34a", ring: "#bbf7d0", label: "Govt. Approval" },
    development: { Icon: BuildingOffice2Icon, bg: "#eff6ff", color: "#2563eb", ring: "#bfdbfe", label: "Development" },
    decline: { Icon: ExclamationTriangleIcon, bg: "#fef2f2", color: "#dc2626", ring: "#fecaca", label: "Risk Alert" },
  }
  const { Icon, bg, color, ring, label } = config[item.type]

  return (
    <div
      style={{
        backgroundColor: "#fff", borderRadius: 14, padding: "20px 22px",
        border: "1.5px solid #f1f5f9", boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"}
      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)"}
    >
      <div style={{ display: "flex", gap: 14 }}>
        {/* Icon */}
        <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: bg, border: `1.5px solid ${ring}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon style={{ width: 22, height: 22, color }} />
        </div>

        <div style={{ flex: 1 }}>
          {/* Top row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color, backgroundColor: bg, padding: "2px 8px", borderRadius: 99, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {label}
            </span>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>{item.timeAgo}</span>
          </div>

          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "6px 0 4px 0" }}>{item.title}</h3>
          <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 8px 0", display: "flex", alignItems: "center", gap: 4 }}>
            <MapPinIcon style={{ width: 13, height: 13, color: "#94a3b8" }} /> {item.location}
            <span style={{ marginLeft: 8, fontSize: 11, color: "#94a3b8" }}>• {item.affectedProps} properties affected</span>
          </p>
          <p style={{ fontSize: 13, color: "#475569", margin: "0 0 12px 0", lineHeight: 1.6 }}>{item.impact}</p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 11px", borderRadius: 99, fontSize: 12, fontWeight: 700, backgroundColor: positive ? "#f0fdf4" : "#fef2f2", color: positive ? "#16a34a" : "#dc2626", border: `1px solid ${positive ? "#bbf7d0" : "#fecaca"}` }}>
              {positive ? <ArrowTrendingUpIcon style={{ width: 13, height: 13 }} /> : <ArrowTrendingDownIcon style={{ width: 13, height: 13 }} />}
              {positive ? "+" : ""}{item.change}% expected impact
            </div>
            <button style={{ fontSize: 12, fontWeight: 600, color: "#2563eb", background: "none", border: "none", cursor: "pointer" }}>
              View affected properties →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
