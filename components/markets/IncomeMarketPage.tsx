"use client"

import { useState } from "react"
import Link from "next/link"

type PropertyType = "All" | "Residential" | "Commercial" | "Hotels"
type SortKey = "yield-high" | "yield-low" | "income-high" | "price-low" | "price-high"

interface IncomeProperty {
  id: string
  name: string
  location: string
  type: string
  image: string
  status: string
  occupancy: number
  monthlyIncome: number
  annualYield: number
  sharePrice: number
  totalShares: number
  availableShares: number
  investors: number
  priceChange: number
  lastActivity: string
}

const incomeProperties: IncomeProperty[] = [
  {
    id: "sunrise-apartments",
    name: "Ibis Apartments",
    location: "Kiira, Wakiso",
    type: "Residential",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
    status: "Live",
    occupancy: 100,
    monthlyIncome: 18000000,
    annualYield: 11.0,
    sharePrice: 1280,
    totalShares: 5000,
    availableShares: 1240,
    investors: 312,
    priceChange: 4.34,
    lastActivity: "Rent paid — Jan 2026",
  },
  {
    id: "green-heights",
    name: "Nakasero Office Tower",
    location: "Nakasero, Kampala",
    type: "Commercial",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
    status: "Live",
    occupancy: 96,
    monthlyIncome: 42000000,
    annualYield: 12.8,
    sharePrice: 3200,
    totalShares: 5000,
    availableShares: 890,
    investors: 489,
    priceChange: 2.11,
    lastActivity: "96% Occupied — Jan 2026",
  },
  {
    id: "acacia-office-park",
    name: "Muyenga Villas",
    location: "Muyenga, Kampala",
    type: "Residential",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
    status: "Live",
    occupancy: 98,
    monthlyIncome: 12500000,
    annualYield: 9.6,
    sharePrice: 950,
    totalShares: 5000,
    availableShares: 2100,
    investors: 201,
    priceChange: 1.87,
    lastActivity: "Rent paid — Dec 2025",
  },
  {
    id: "lake-view-residences",
    name: "Entebbe Road Suites",
    location: "Entebbe Rd, Wakiso",
    type: "Hotels",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
    status: "Live",
    occupancy: 94,
    monthlyIncome: 28000000,
    annualYield: 10.2,
    sharePrice: 1850,
    totalShares: 5000,
    availableShares: 3200,
    investors: 156,
    priceChange: 3.42,
    lastActivity: "Revenue distributed — Jan 2026",
  },
  {
    id: "kololo-heights",
    name: "Kololo Heights",
    location: "Kololo, Kampala",
    type: "Residential",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80",
    status: "Live",
    occupancy: 100,
    monthlyIncome: 9800000,
    annualYield: 8.9,
    sharePrice: 740,
    totalShares: 5000,
    availableShares: 4100,
    investors: 98,
    priceChange: 0.54,
    lastActivity: "100% Occupied",
  },
  {
    id: "naalya-business-park",
    name: "Naalya Business Park",
    location: "Naalya, Wakiso",
    type: "Commercial",
    image: "https://images.unsplash.com/photo-1464146072230-91cabc968266?w=600&q=80",
    status: "Live",
    occupancy: 91,
    monthlyIncome: 35000000,
    annualYield: 11.8,
    sharePrice: 2400,
    totalShares: 5000,
    availableShares: 680,
    investors: 421,
    priceChange: 5.12,
    lastActivity: "Rent paid — Jan 2026",
  },
]

function formatIncome(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`
  return value.toLocaleString()
}

function formatPrice(value: number): string {
  return value.toLocaleString()
}

const filterTabs: { key: PropertyType; label: string }[] = [
  { key: "All", label: "All" },
  { key: "Residential", label: "Residential" },
  { key: "Commercial", label: "Commercial" },
  { key: "Hotels", label: "Hotels" },
]

export default function IncomeMarketPage() {
  const [activeFilter, setActiveFilter] = useState<PropertyType>("All")
  const [sort, setSort] = useState<SortKey>("yield-high")

  const filtered = incomeProperties
    .filter(p => activeFilter === "All" || p.type === activeFilter)
    .sort((a, b) => {
      if (sort === "yield-high") return b.annualYield - a.annualYield
      if (sort === "yield-low") return a.annualYield - b.annualYield
      if (sort === "income-high") return b.monthlyIncome - a.monthlyIncome
      if (sort === "price-low") return a.sharePrice - b.sharePrice
      if (sort === "price-high") return b.sharePrice - a.sharePrice
      return 0
    })

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f6f8" }}>

      {/* Page Header */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e8ecf0" }}>
        <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px 0" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
            <Link href="/market" style={{ fontSize: 13, color: "#64748b", textDecoration: "none", fontWeight: 500 }}>
              Markets
            </Link>
            <span style={{ fontSize: 13, color: "#c4cad4" }}>/</span>
            <span style={{ fontSize: 13, color: "#2563eb", fontWeight: 600 }}>Rental Market</span>
          </div>

          <h1 style={{ fontSize: 30, fontWeight: 800, color: "#0f172a", margin: "0 0 6px 0", letterSpacing: "-0.6px" }}>
            Rental Market
          </h1>
          <p style={{ fontSize: 15, color: "#64748b", margin: "0 0 24px 0" }}>
            Earn monthly income from completed, income-producing properties.
          </p>

          {/* Stats */}
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
            <StatCard label="Total Properties" value="18" />
            <StatCard label="Total Value" value="UGX 4.2B" />
            <StatCard label="Avg. Annual Yield" value="10.4%" highlight />
          </div>

          {/* Filter tabs + sort */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div className="filter-tabs" style={{ display: "flex", gap: 0 }}>
              {filterTabs.map(tab => {
                const isActive = activeFilter === tab.key
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveFilter(tab.key)}
                    style={{
                      padding: "9px 20px", fontSize: 13, fontWeight: 600,
                      border: "none", background: "transparent", cursor: "pointer",
                      color: isActive ? "#2563eb" : "#64748b",
                      borderBottom: isActive ? "2px solid #2563eb" : "2px solid transparent",
                      transition: "all 0.15s", whiteSpace: "nowrap",
                    }}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 2 }}>
              <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>Sort by</span>
              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortKey)}
                style={{ padding: "7px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 13, fontWeight: 500, color: "#374151", background: "#fff", outline: "none", cursor: "pointer" }}
              >
                <option value="yield-high">Yield: High to Low</option>
                <option value="yield-low">Yield: Low to High</option>
                <option value="income-high">Monthly Income</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Properties grid */}
      <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px 48px" }}>
        <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20, fontWeight: 500 }}>
          Showing <strong style={{ color: "#374151" }}>{filtered.length}</strong> properties
        </p>
        <div
          className="property-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 22 }}
        >
          {filtered.map(property => (
            <PropertyCard key={`${property.id}-${property.name}`} property={property} />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Stat Card ── */
function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ backgroundColor: "#f8f9fb", border: "1px solid #e8ecf0", borderRadius: 12, padding: "16px 20px" }}>
      <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, margin: "0 0 5px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {label}
      </p>
      <p style={{ fontSize: 26, fontWeight: 800, color: highlight ? "#0d9488" : "#0f172a", margin: 0, letterSpacing: "-0.5px" }}>
        {value}
      </p>
    </div>
  )
}

/* ── Property Card ── */
function PropertyCard({ property }: { property: IncomeProperty }) {
  const soldShares = property.totalShares - property.availableShares
  const soldPct = Math.round((soldShares / property.totalShares) * 100)

  return (
    <div
      style={{ backgroundColor: "#fff", border: "1px solid #e8ecf0", borderRadius: 14, overflow: "hidden", transition: "box-shadow 0.2s, transform 0.2s", cursor: "pointer", display: "flex", flexDirection: "column" }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow = "0 8px 28px rgba(37,99,235,0.10)"
        el.style.transform = "translateY(-3px)"
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow = "none"
        el.style.transform = "translateY(0)"
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
        <img
          src={property.image}
          alt={property.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        {/* Gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.48) 100%)" }} />

        {/* APR badge — top left (prominent green, Binaryx-style) */}
        <div style={{ position: "absolute", top: 12, left: 12 }}>
          <span style={{ display: "inline-block", backgroundColor: "#0d9488", color: "#fff", fontSize: 13, fontWeight: 800, padding: "5px 11px", borderRadius: 7, letterSpacing: "0.1px", boxShadow: "0 2px 8px rgba(13,148,136,0.3)" }}>
            {property.annualYield}% APR
          </span>
        </div>

        {/* Live + type badge — top right */}
        <div style={{ position: "absolute", top: 12, right: 12, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, backgroundColor: "rgba(255,255,255,0.92)", color: "#10b981", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 99 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#10b981", display: "inline-block", animation: "pulse-dot 2s ease-in-out infinite" }} />
            Live
          </span>
          <span style={{ backgroundColor: "rgba(255,255,255,0.85)", color: "#374151", fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 99, textTransform: "uppercase", letterSpacing: "0.4px" }}>
            {property.type}
          </span>
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", flex: 1 }}>

        {/* Name + location */}
        <div style={{ marginBottom: 12 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 3px 0", letterSpacing: "-0.2px" }}>
            {property.name}
          </h3>
          <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, fontWeight: 500 }}>{property.location}</p>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
          <MiniStat label="Share Price" value={`UGX ${formatPrice(property.sharePrice)}`} />
          <MiniStat label="Occupancy" value={`${property.occupancy}%`} valueColor={property.occupancy >= 98 ? "#0d9488" : "#f59e0b"} />
          <MiniStat label="Investors" value={property.investors.toLocaleString()} />
        </div>

        {/* Shares sold progress bar */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
            <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>{soldPct}% shares sold</span>
            <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>{property.availableShares.toLocaleString()} left</span>
          </div>
          <div style={{ height: 5, backgroundColor: "#f1f4f8", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${soldPct}%`, backgroundColor: soldPct >= 80 ? "#ef4444" : "#2563eb", borderRadius: 99, transition: "width 0.4s ease" }} />
          </div>
        </div>

        {/* Monthly income highlight */}
        <div style={{ backgroundColor: "#f0fdfa", border: "1px solid #99f6e4", borderRadius: 8, padding: "8px 12px", marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: "#0d9488", fontWeight: 600 }}>Monthly Income</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: "#0d9488", letterSpacing: "-0.3px" }}>
            UGX {formatIncome(property.monthlyIncome)}
          </span>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <Link href={`/property/${property.id}`} style={{ flex: 1, textDecoration: "none" }}>
            <button
              style={{ width: "100%", padding: "9px 0", borderRadius: 9, backgroundColor: "#2563eb", color: "#fff", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", transition: "background 0.15s" }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1d4ed8")}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#2563eb")}
            >
              Buy Shares
            </button>
          </Link>
          <Link href={`/property/${property.id}`} style={{ flex: 1, textDecoration: "none" }}>
            <button
              style={{ width: "100%", padding: "9px 0", borderRadius: 9, backgroundColor: "transparent", color: "#2563eb", fontSize: 13, fontWeight: 700, border: "1.5px solid #2563eb", cursor: "pointer", transition: "background 0.15s" }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#eff6ff")}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent")}
            >
              Details
            </button>
          </Link>
        </div>

        {/* Last activity */}
        <div style={{ borderTop: "1px solid #f1f4f8", paddingTop: 10, marginTop: "auto" }}>
          <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, fontWeight: 500 }}>
            <span style={{ fontWeight: 700, color: "#64748b" }}>Last activity: </span>
            {property.lastActivity}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ── Mini stat cell ── */
function MiniStat({ label, value, valueColor = "#0f172a" }: { label: string; value: string; valueColor?: string }) {
  return (
    <div style={{ backgroundColor: "#f8f9fb", borderRadius: 8, padding: "7px 6px", textAlign: "center" }}>
      <p style={{ fontSize: 9, color: "#94a3b8", fontWeight: 600, margin: "0 0 3px 0", textTransform: "uppercase", letterSpacing: "0.4px" }}>
        {label}
      </p>
      <p style={{ fontSize: 12, fontWeight: 700, color: valueColor, margin: 0 }}>{value}</p>
    </div>
  )
}
