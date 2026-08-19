"use client"

import { useMemo, useRef, useState, useEffect } from "react"
import Link from "next/link"
import { MapPinIcon, AdjustmentsHorizontalIcon, ClockIcon } from "@heroicons/react/24/outline"
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, CheckBadgeIcon } from "@heroicons/react/24/solid"
import { type RentalProperty } from "@/lib/data/rentals"
import { type ConstructionProject } from "@/lib/data/construction"
import { useRentals, useConstruction } from "@/lib/hooks"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import Sparkline from "@/components/ui/Sparkline"

type Filter = "all" | "construction" | "rental"
type Sort = "trending" | "price-low" | "price-high" | "yield"

const sortOptions: { key: Sort; label: string }[] = [
  { key: "trending", label: "Trending" },
  { key: "price-low", label: "Price: Low → High" },
  { key: "price-high", label: "Price: High → Low" },
  { key: "yield", label: "Yield / ROI" },
]

export default function MarketPage() {
  const [filter, setFilter] = useState<Filter>("all")
  const [sort, setSort] = useState<Sort>("trending")
  const [sortOpen, setSortOpen] = useState(false)
  const sortRef = useRef<HTMLDivElement>(null)
  const { rentals } = useRentals()
  const { projects } = useConstruction()
  const liveRentals = rentals.filter(p => p.status === "Live")

  // Close the mobile sort menu on outside tap
  useEffect(() => {
    if (!sortOpen) return
    const onDown = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [sortOpen])

  const filterTabs: { key: Filter; label: string }[] = [
    { key: "all", label: "All Properties" },
    { key: "construction", label: "Construction" },
    { key: "rental", label: "Rental Income" },
  ]

  const sortedRentals = useMemo(() => {
    const list = [...liveRentals]
    if (sort === "price-low") list.sort((a, b) => a.pricePerShare - b.pricePerShare)
    else if (sort === "price-high") list.sort((a, b) => b.pricePerShare - a.pricePerShare)
    else if (sort === "yield") list.sort((a, b) => b.rentalYield - a.rentalYield)
    else list.sort((a, b) => b.priceChangePercent - a.priceChangePercent)
    return list
  }, [liveRentals, sort])

  const sortedProjects = useMemo(() => {
    const list = [...projects]
    if (sort === "price-low") list.sort((a, b) => a.sharePrice - b.sharePrice)
    else if (sort === "price-high") list.sort((a, b) => b.sharePrice - a.sharePrice)
    else if (sort === "yield") list.sort((a, b) => b.projectedROI - a.projectedROI)
    else list.sort((a, b) => b.fundingProgress - a.fundingProgress)
    return list
  }, [projects, sort])

  // Construction leads the market; rental income follows
  const showConstruction = filter !== "rental"
  const showRental = filter !== "construction"
  const total = (showConstruction ? sortedProjects.length : 0) + (showRental ? sortedRentals.length : 0)

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>

      {/* Page header */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1.5px solid #f1f5f9" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 0" }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.8px", margin: "0 0 6px 0" }}>
            Property Market
          </h1>
          <p style={{ fontSize: 16, color: "#64748b", margin: "0 0 24px 0" }}>
            Construction projects and income-producing rentals — verified, share-priced, live
          </p>

          {/* Tabs + Sort — one row on every screen size */}
          <div className="filter-sort-row">
            <div className="filter-tabs" style={{ display: "flex", gap: 4, minWidth: 0 }}>
              {filterTabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "10px 10px 0 0",
                    fontSize: 13,
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    whiteSpace: "nowrap",
                    backgroundColor: filter === tab.key ? "#2563eb" : "transparent",
                    color: filter === tab.key ? "#fff" : "#64748b",
                    borderBottom: filter === tab.key ? "2px solid #2563eb" : "2px solid transparent",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div ref={sortRef} style={{ position: "relative", flexShrink: 0, marginBottom: 2 }}>
              {/* Desktop: labelled select */}
              <div className="sort-select-wrap" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <AdjustmentsHorizontalIcon style={{ width: 16, height: 16, color: "#94a3b8" }} />
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value as Sort)}
                  style={{
                    padding: "7px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0",
                    fontSize: 13, fontWeight: 500, color: "#374151", background: "#fff",
                    outline: "none", cursor: "pointer",
                  }}
                >
                  {sortOptions.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
                </select>
              </div>

              {/* Mobile: icon-only button, menu on tap */}
              <button
                className="sort-icon-btn"
                onClick={() => setSortOpen(o => !o)}
                aria-label="Sort"
                style={{
                  display: "none",
                  width: 38, height: 38, borderRadius: 10,
                  border: sortOpen ? "1.5px solid #2563eb" : "1.5px solid #e2e8f0",
                  backgroundColor: sortOpen ? "#eff6ff" : "#fff",
                  alignItems: "center", justifyContent: "center", cursor: "pointer",
                }}
              >
                <AdjustmentsHorizontalIcon style={{ width: 18, height: 18, color: sortOpen ? "#2563eb" : "#64748b" }} />
              </button>
              {sortOpen && (
                <div style={{ position: "absolute", right: 0, top: 44, width: 190, backgroundColor: "#fff", borderRadius: 12, border: "1px solid #e8ecf0", boxShadow: "0 14px 40px rgba(0,0,0,0.14)", overflow: "hidden", zIndex: 40, padding: 5 }}>
                  {sortOptions.map(o => (
                    <button key={o.key} onClick={() => { setSort(o.key); setSortOpen(false) }}
                      style={{ display: "block", width: "100%", textAlign: "left", padding: "9px 12px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: sort === o.key ? 700 : 500, backgroundColor: sort === o.key ? "#eff6ff" : "transparent", color: sort === o.key ? "#2563eb" : "#374151" }}>
                      {o.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
        <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20, fontWeight: 500 }}>
          Showing <strong style={{ color: "#374151" }}>{total}</strong> {total === 1 ? "listing" : "listings"}
        </p>

        {/* ── Construction first — the market's main lane ── */}
        {showConstruction && sortedProjects.length > 0 && (
          <div style={{ marginBottom: showRental ? 36 : 0 }}>
            {filter === "all" && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", backgroundColor: "#d97706", padding: "3px 11px", borderRadius: 99, textTransform: "uppercase", letterSpacing: "0.05em" }}>Construction</span>
                <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Fund new buildings — share value grows as milestones complete</p>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(340px, 100%), 1fr))", gap: 24 }} className="property-grid">
              {sortedProjects.map(project => <ConstructionCard key={project.id} project={project} />)}
            </div>
          </div>
        )}

        {/* ── Rental income second ── */}
        {showRental && sortedRentals.length > 0 && (
          <div>
            {filter === "all" && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", backgroundColor: "#0d9488", padding: "3px 11px", borderRadius: 99, textTransform: "uppercase", letterSpacing: "0.05em" }}>Rental Income</span>
                <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Occupied properties paying monthly rental income</p>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(340px, 100%), 1fr))", gap: 24 }} className="property-grid">
              {sortedRentals.map(property => <PropertyCard key={property.id} property={property} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Construction card — the market's lead product ── */
function ConstructionCard({ project }: { project: ConstructionProject }) {
  return (
    <Link href={`/construction/${project.id}`} style={{ textDecoration: "none", display: "block" }}>
      <div
        style={{ backgroundColor: "#fff", borderRadius: 16, border: "1.5px solid #f1f5f9", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", overflow: "hidden", transition: "all 0.2s", cursor: "pointer" }}
        onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "0 8px 32px rgba(217,119,6,0.16)"; el.style.transform = "translateY(-3px)" }}
        onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)"; el.style.transform = "translateY(0)" }}
      >
        <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.image} alt={project.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)" }} />
          <div style={{ position: "absolute", top: 12, left: 12 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, backgroundColor: "rgba(255,255,255,0.92)", borderRadius: 99, padding: "4px 9px", fontSize: 11, fontWeight: 700, color: "#16a34a" }}>
              <CheckBadgeIcon style={{ width: 12, height: 12 }} />Verified
            </span>
          </div>
          <div style={{ position: "absolute", top: 12, right: 12 }}>
            <span style={{ padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, backgroundColor: "#d97706", color: "#fff" }}>
              {project.stage}
            </span>
          </div>
          <div style={{ position: "absolute", bottom: 12, left: 12, display: "flex", alignItems: "center", gap: 4, color: "#fff" }}>
            <MapPinIcon style={{ width: 13, height: 13 }} />
            <span style={{ fontSize: 12, fontWeight: 500 }}>{project.location}</span>
          </div>
        </div>

        <div style={{ padding: "16px 18px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div style={{ flex: 1, paddingRight: 12 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 3px 0" }}>{project.name}</h3>
              <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
                <ClockIcon style={{ width: 12, height: 12 }} />Completion {project.expectedCompletion}
              </p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", margin: "0 0 2px 0", letterSpacing: "-0.3px" }}>
                UGX {formatCurrency(project.sharePrice)}
              </p>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#d97706", margin: 0 }}>{project.projectedROI}% projected ROI</p>
            </div>
          </div>

          {/* Funding progress */}
          <div style={{ backgroundColor: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "9px 12px", marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 10.5, color: "#92400e", fontWeight: 700 }}>Funding progress</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#78350f" }}>{project.fundingProgress.toFixed(0)}%</span>
            </div>
            <div style={{ height: 6, borderRadius: 99, backgroundColor: "rgba(217,119,6,0.15)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${project.fundingProgress}%`, borderRadius: 99, backgroundColor: "#d97706" }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 12 }}>
            {[
              { label: "Proj. Yield", value: `${project.projectedYield}%`, highlight: true },
              { label: "Built", value: `${project.constructionProgress}%` },
              { label: "Investors", value: project.investors.toLocaleString() },
            ].map(s => (
              <div key={s.label} style={{ backgroundColor: "#f8fafc", borderRadius: 8, padding: "7px 5px", textAlign: "center" }}>
                <p style={{ fontSize: 9, color: "#94a3b8", marginBottom: 2, fontWeight: 500, textTransform: "uppercase" }}>{s.label}</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: s.highlight ? "#d97706" : "#0f172a", margin: 0 }}>{s.value}</p>
              </div>
            ))}
          </div>

          <button style={{ width: "100%", padding: "10px 0", borderRadius: 10, background: "linear-gradient(135deg, #d97706 0%, #b45309 100%)", color: "#fff", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer" }}>
            Invest — UGX {formatCurrency(project.sharePrice)}/share
          </button>
        </div>
      </div>
    </Link>
  )
}

function PropertyCard({ property }: { property: RentalProperty }) {
  const isPositive = property.priceChangePercent >= 0
  const sparkData = property.chartData.map(d => d.value)

  return (
    <Link href={`/property/${property.id}`} style={{ textDecoration: "none", display: "block" }}>
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          border: "1.5px solid #f1f5f9",
          boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
          overflow: "hidden",
          transition: "all 0.2s",
          cursor: "pointer",
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.boxShadow = "0 8px 32px rgba(37,99,235,0.13)"
          el.style.transform = "translateY(-3px)"
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.boxShadow = "0 2px 12px rgba(0,0,0,0.05)"
          el.style.transform = "translateY(0)"
        }}
      >
        {/* Image */}
        <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={property.image}
            alt={property.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)",
            }}
          />
          <div style={{ position: "absolute", top: 12, left: 12 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                backgroundColor: "rgba(255,255,255,0.92)",
                borderRadius: 99,
                padding: "4px 9px",
                fontSize: 11,
                fontWeight: 700,
                color: "#16a34a",
              }}
            >
              <CheckBadgeIcon style={{ width: 12, height: 12 }} />
              Verified
            </span>
          </div>
          <div style={{ position: "absolute", top: 12, right: 12 }}>
            <span
              style={{
                padding: "4px 10px",
                borderRadius: 99,
                fontSize: 11,
                fontWeight: 700,
                backgroundColor: "#0d9488",
                color: "#fff",
              }}
            >
              {property.rentalYield}% Yield
            </span>
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 12,
              left: 12,
              display: "flex",
              alignItems: "center",
              gap: 4,
              color: "#fff",
            }}
          >
            <MapPinIcon style={{ width: 13, height: 13 }} />
            <span style={{ fontSize: 12, fontWeight: 500 }}>{property.location}</span>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "16px 18px 18px" }}>
          {/* Name + price */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div style={{ flex: 1, paddingRight: 12 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 3px 0" }}>
                {property.name}
              </h3>
              <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>
                {property.availableShares.toLocaleString()} of {property.totalShares.toLocaleString()} shares left
              </p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", margin: "0 0 2px 0", letterSpacing: "-0.3px" }}>
                UGX {formatCurrency(property.pricePerShare)}
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: 3,
                  fontSize: 12,
                  fontWeight: 700,
                  color: isPositive ? "#10b981" : "#ef4444",
                }}
              >
                {isPositive
                  ? <ArrowTrendingUpIcon style={{ width: 13, height: 13 }} />
                  : <ArrowTrendingDownIcon style={{ width: 13, height: 13 }} />
                }
                {formatPercentage(property.priceChangePercent)}
              </div>
            </div>
          </div>

          {/* Stock-style sparkline */}
          <div
            style={{
              backgroundColor: "#f8fafc",
              borderRadius: 10,
              padding: "8px 12px",
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p style={{ fontSize: 10, color: "#94a3b8", margin: "0 0 1px 0", fontWeight: 500 }}>30-day price</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: isPositive ? "#10b981" : "#ef4444", margin: 0 }}>
                {isPositive ? "↑ Trending up" : "↓ Trending down"}
              </p>
            </div>
            <Sparkline data={sparkData} width={120} height={40} positive={isPositive} strokeWidth={1.8} />
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 12 }}>
            {[
              { label: "Yield (Annual)", value: `${property.rentalYield}%`, highlight: true },
              { label: "Occupancy", value: "98%" },
              { label: "Area Score", value: `${property.areaScore}/100` },
            ].map(s => (
              <div
                key={s.label}
                style={{
                  backgroundColor: "#f8fafc",
                  borderRadius: 8,
                  padding: "7px 5px",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: 9, color: "#94a3b8", marginBottom: 2, fontWeight: 500, textTransform: "uppercase" }}>
                  {s.label}
                </p>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: s.highlight ? "#10b981" : "#0f172a",
                    margin: 0,
                  }}
                >
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* Buy button */}
          <button
            style={{
              width: "100%",
              padding: "10px 0",
              borderRadius: 10,
              background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
            }}
          >
            Buy Shares — UGX {formatCurrency(property.pricePerShare)}/share
          </button>
        </div>
      </div>
    </Link>
  )
}
