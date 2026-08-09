"use client"

import { useState } from "react"
import Link from "next/link"
import { MapPinIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline"
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, CheckBadgeIcon } from "@heroicons/react/24/solid"
import { featuredProperties } from "@/lib/mockData"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import Sparkline from "@/components/ui/Sparkline"

type Filter = "all" | "high-growth" | "high-yield"
type Sort = "trending" | "price-low" | "price-high" | "yield"

export default function MarketPage() {
  const [filter, setFilter] = useState<Filter>("all")
  const [sort, setSort] = useState<Sort>("trending")

  const filterTabs: { key: Filter; label: string }[] = [
    { key: "all", label: "All Properties" },
    { key: "high-growth", label: "High Growth" },
    { key: "high-yield", label: "High Yield" },
  ]

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>

      {/* Page header */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1.5px solid #f1f5f9" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px 0" }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.8px", margin: "0 0 6px 0" }}>
            Property Market
          </h1>
          <p style={{ fontSize: 16, color: "#64748b", margin: "0 0 24px 0" }}>
            Real-time share pricing across verified investment properties
          </p>

          {/* Tabs + Sort */}
          <div className="filter-sort-row">
          <div className="filter-tabs" style={{ display: "flex", gap: 4 }}>
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
                    backgroundColor: filter === tab.key ? "#2563eb" : "transparent",
                    color: filter === tab.key ? "#fff" : "#64748b",
                    borderBottom: filter === tab.key ? "2px solid #2563eb" : "2px solid transparent",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
              <AdjustmentsHorizontalIcon style={{ width: 16, height: 16, color: "#94a3b8" }} />
              <select
                value={sort}
                onChange={e => setSort(e.target.value as Sort)}
                style={{
                  padding: "7px 12px",
                  borderRadius: 8,
                  border: "1.5px solid #e2e8f0",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#374151",
                  background: "#fff",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="trending">Trending</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
                <option value="yield">Rental Yield</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Property grid */}
      <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }}>
        <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20, fontWeight: 500 }}>
          Showing <strong style={{ color: "#374151" }}>{featuredProperties.length}</strong> properties
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(340px, 100%), 1fr))",
            gap: 24,
          }}
          className="property-grid"
        >
          {featuredProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </div>
  )
}

function PropertyCard({ property }: { property: typeof featuredProperties[0] }) {
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
                backgroundColor: property.futureGrowth === "High" ? "#10b981" : property.futureGrowth === "Medium" ? "#f59e0b" : "#6b7280",
                color: "#fff",
              }}
            >
              {property.futureGrowth} Growth
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
