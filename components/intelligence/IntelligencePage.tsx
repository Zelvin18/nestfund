"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowPathIcon, MapPinIcon } from "@heroicons/react/24/outline"
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/solid"
import { useIntelligence, useRentals, useConstruction } from "@/lib/hooks"
import { type IntelligenceItem } from "@/lib/data/intelligence"

/* ── Inline SVG icon components ── */
const IconGovt = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 22h18M4 11h16M12 2L2 7h20L12 2zM4 11v9M20 11v9M8 11v9M16 11v9M12 11v9" />
  </svg>
)
const IconBuilding = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
  </svg>
)
const IconAlert = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)
const IconCheckCircle = () => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)
const IconLink = () => (
  <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
    <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
  </svg>
)

type FilterKey = "all" | "positive" | "negative" | "approval" | "development"

const filters: { key: FilterKey; label: string }[] = [
  { key: "all",         label: "All Updates" },
  { key: "positive",   label: "Positive" },
  { key: "negative",   label: "Negative" },
  { key: "approval",   label: "Government" },
  { key: "development",label: "Development" },
]

export default function IntelligencePage() {
  const [active, setActive] = useState<FilterKey>("all")
  const { items: allItems } = useIntelligence()
  const { rentals } = useRentals()
  const { projects } = useConstruction()
  const lookup = new Map<string, { name: string; href: string }>([
    ...rentals.map(p => [p.id, { name: p.name, href: `/property/${p.id}` }] as const),
    ...projects.map(p => [p.id, { name: p.name, href: `/construction/${p.id}` }] as const),
  ])

  const filtered = allItems.filter(item => {
    if (active === "all") return true
    if (active === "positive") return item.change > 0
    if (active === "negative") return item.change < 0
    if (active === "approval") return item.type === "approval"
    if (active === "development") return item.type === "development"
    return true
  })

  const counts: Record<FilterKey, number> = {
    all: allItems.length,
    positive: allItems.filter(i => i.change > 0).length,
    negative: allItems.filter(i => i.change < 0).length,
    approval: allItems.filter(i => i.type === "approval").length,
    development: allItems.filter(i => i.type === "development").length,
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>

      {/* Page header */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e8ecf0" }}>
        <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px 0" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h1 style={{ fontSize: 28, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", margin: "0 0 5px 0" }}>
                Market Intelligence
              </h1>
              <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
                Real-time events, policy changes, and developments affecting property values
              </p>
            </div>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 9, border: "1.5px solid #e2e8f0", backgroundColor: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 500, color: "#374151" }}>
              <ArrowPathIcon style={{ width: 14, height: 14 }} />
              Refresh
            </button>
          </div>

          {/* Filter tabs */}
          <div className="filter-tabs" style={{ display: "flex", gap: 0 }}>
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setActive(f.key)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "9px 16px", border: "none", background: "transparent",
                  cursor: "pointer", fontSize: 13, fontWeight: 600,
                  color: active === f.key ? "#2563eb" : "#64748b",
                  borderBottom: `2px solid ${active === f.key ? "#2563eb" : "transparent"}`,
                  transition: "all 0.15s", whiteSpace: "nowrap",
                }}
              >
                {f.label}
                <span style={{
                  fontSize: 11, fontWeight: 700, padding: "1px 6px", borderRadius: 99,
                  backgroundColor: active === f.key ? "#eff6ff" : "#f1f5f9",
                  color: active === f.key ? "#2563eb" : "#94a3b8",
                }}>
                  {counts[f.key]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards grid */}
      <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px 56px" }}>
        <div className="intel-grid">
          {filtered.map(item => <IntelCard key={item.id} item={item} lookup={lookup} />)}
        </div>
      </div>
    </div>
  )
}

function IntelCard({ item, lookup }: { item: IntelligenceItem; lookup: Map<string, { name: string; href: string }> }) {
  const positive = item.change >= 0
  const affected = item.affectedPropertyIds.map(id => ({ id, ...lookup.get(id) })).filter((p): p is { id: string; name: string; href: string } => !!p.name)

  const typeConfig = {
    approval:    { Icon: IconCheckCircle, bg: "#f0fdf4", color: "#16a34a", ring: "#bbf7d0" },
    development: { Icon: IconBuilding,    bg: "#eff6ff", color: "#2563eb", ring: "#bfdbfe" },
    decline:     { Icon: IconAlert,       bg: "#fef2f2", color: "#dc2626", ring: "#fecaca" },
  }
  const { Icon, bg, color, ring } = typeConfig[item.type]

  return (
    <div
      style={{
        backgroundColor: "#fff", borderRadius: 14,
        border: "1px solid #e8ecf0", overflow: "hidden",
        transition: "box-shadow 0.2s",
        display: "flex", flexDirection: "column",
      }}
      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"}
      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "none"}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 180, overflow: "hidden", flexShrink: 0 }}>
        <img
          src={item.image}
          alt={item.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.55) 100%)" }} />

        {/* Category badge top-left */}
        <div style={{ position: "absolute", top: 12, left: 12 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            backgroundColor: bg, border: `1px solid ${ring}`,
            borderRadius: 6, padding: "4px 9px",
          }}>
            <span style={{ color, display: "flex", alignItems: "center" }}><Icon /></span>
            <span style={{ fontSize: 10, fontWeight: 800, color, textTransform: "uppercase", letterSpacing: "0.06em" }}>{item.category}</span>
          </div>
        </div>

        {/* Time top-right */}
        <div style={{ position: "absolute", top: 12, right: 12 }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.85)", fontWeight: 500, backgroundColor: "rgba(0,0,0,0.3)", padding: "3px 8px", borderRadius: 99, backdropFilter: "blur(4px)" }}>
            {item.timeAgo}
          </span>
        </div>

        {/* Title overlaid at bottom */}
        <div style={{ position: "absolute", bottom: 12, left: 14, right: 14 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.3 }}>{item.title}</h3>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "14px 16px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>

        {/* Location + affected */}
        <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
          <MapPinIcon style={{ width: 13, height: 13, color: "#94a3b8", flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>{item.location}</span>
          <span style={{ fontSize: 12, color: "#c4cad4" }}>·</span>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>{item.affectedProps} properties affected</span>
        </div>

        {/* Description */}
        <p style={{ fontSize: 13, color: "#475569", margin: 0, lineHeight: 1.65 }}>{item.desc}</p>

        {/* Affected listed properties — click to open */}
        {affected.length > 0 && (
          <div>
            <p style={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 6px 0" }}>
              Listed properties affected
            </p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {affected.map(p => (
                <Link key={p.id} href={p.href} style={{
                  display: "inline-flex", alignItems: "center", gap: 4,
                  fontSize: 11.5, fontWeight: 650, color: "#1d4ed8",
                  backgroundColor: "#eff6ff", border: "1px solid #dbeafe",
                  borderRadius: 99, padding: "4px 11px", textDecoration: "none",
                }}>
                  {p.name} →
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Bottom row: impact badge + source link */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginTop: "auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "5px 11px", borderRadius: 99, fontSize: 12, fontWeight: 700,
            backgroundColor: positive ? "#f0fdf4" : "#fef2f2",
            color: positive ? "#16a34a" : "#dc2626",
            border: `1px solid ${positive ? "#bbf7d0" : "#fecaca"}`,
          }}>
            {positive
              ? <ArrowTrendingUpIcon style={{ width: 13, height: 13 }} />
              : <ArrowTrendingDownIcon style={{ width: 13, height: 13 }} />
            }
            {positive ? "+" : ""}{item.change}% expected impact
          </div>

          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "#2563eb", textDecoration: "none" }}
          >
            <IconLink />
            View source
          </a>
        </div>

        {/* Source attribution */}
        <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 10 }}>
          <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>
            Source: <span style={{ fontWeight: 600, color: "#64748b" }}>{item.sourceLabel}</span>
          </p>
        </div>
      </div>
    </div>
  )
}
