"use client"

import Link from "next/link"
import { MapPinIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, CheckBadgeIcon } from "@heroicons/react/24/solid"
import { featuredProperties } from "@/lib/mockData"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import Sparkline from "@/components/ui/Sparkline"

export default function TrendingProperties() {
  return (
    <section style={{ backgroundColor: "#fff", padding: "72px 0" }} className="section-pad">
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }} className="container">

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
              Live Market
            </p>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", margin: 0 }}>
              Trending Properties
            </h2>
            <p style={{ fontSize: 16, color: "#64748b", marginTop: 8 }}>
              Hot investment opportunities with real-time share pricing
            </p>
          </div>
          <Link
            href="/market"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontSize: 14,
              fontWeight: 600,
              color: "#2563eb",
              textDecoration: "none",
            }}
          >
            View All
            <ChevronRightIcon style={{ width: 16, height: 16 }} />
          </Link>
        </div>

        {/* Cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 24,
          }}
          className="property-grid"
        >
          {featuredProperties.slice(0, 3).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PropertyCard({ property }: { property: typeof featuredProperties[0] }) {
  const isPositive = property.priceChangePercent >= 0
  const sparkData = property.chartData.map(d => d.value)

  return (
    <Link
      href={`/property/${property.id}`}
      style={{ textDecoration: "none", display: "block" }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          border: "1.5px solid #f1f5f9",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          overflow: "hidden",
          transition: "box-shadow 0.2s, transform 0.2s",
          cursor: "pointer",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(37,99,235,0.12)"
          ;(e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"
          ;(e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"
        }}
      >
        {/* Property Image */}
        <div style={{ position: "relative", height: 200, overflow: "hidden", backgroundColor: "#f1f5f9" }}>
          <img
            src={property.image}
            alt={property.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          {/* Gradient overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.65) 100%)",
            }}
          />
          {/* Growth badge */}
          <div style={{ position: "absolute", top: 12, right: 12 }}>
            <span
              style={{
                display: "inline-block",
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
          {/* Verified badge */}
          <div style={{ position: "absolute", top: 12, left: 12 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "4px 8px",
                borderRadius: 99,
                fontSize: 11,
                fontWeight: 600,
                backgroundColor: "rgba(255,255,255,0.92)",
                color: "#16a34a",
                backdropFilter: "blur(4px)",
              }}
            >
              <CheckBadgeIcon style={{ width: 12, height: 12 }} />
              Verified
            </span>
          </div>
          {/* Location bottom */}
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
            <MapPinIcon style={{ width: 14, height: 14 }} />
            <span style={{ fontSize: 13, fontWeight: 500 }}>{property.location}</span>
          </div>
        </div>

        {/* Card Body */}
        <div style={{ padding: "16px 18px 18px" }}>
          {/* Name + Price row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: "0 0 3px 0",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {property.name}
              </h3>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                {property.availableShares.toLocaleString()} / {property.totalShares.toLocaleString()} shares left
              </p>
            </div>

            {/* Price + chart right side */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.3px" }}>
                UGX {formatCurrency(property.pricePerShare)}
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  fontSize: 12,
                  fontWeight: 700,
                  color: isPositive ? "#10b981" : "#ef4444",
                }}
              >
                {isPositive
                  ? <ArrowTrendingUpIcon style={{ width: 14, height: 14 }} />
                  : <ArrowTrendingDownIcon style={{ width: 14, height: 14 }} />
                }
                {formatPercentage(property.priceChangePercent)} today
              </div>
            </div>
          </div>

          {/* Sparkline chart — the stock market zigzag line */}
          <div
            style={{
              backgroundColor: "#f8fafc",
              borderRadius: 10,
              padding: "10px 12px 8px",
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500, marginBottom: 2 }}>30-day price</p>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: 0 }}>
                /share
              </p>
            </div>
            <Sparkline
              data={sparkData}
              width={130}
              height={44}
              positive={isPositive}
              strokeWidth={2}
            />
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 8,
              marginBottom: 14,
            }}
          >
            {[
              { label: "Yield (Annual)", value: `${property.rentalYield}%`, highlight: true },
              { label: "Occupancy", value: "98%" },
              { label: "Area Score", value: `${property.areaScore}/100` },
            ].map(stat => (
              <div
                key={stat.label}
                style={{
                  backgroundColor: "#f8fafc",
                  borderRadius: 8,
                  padding: "8px 6px",
                  textAlign: "center",
                }}
              >
                <p style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3, fontWeight: 500 }}>
                  {stat.label}
                </p>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: stat.highlight ? "#10b981" : "#0f172a",
                    margin: 0,
                  }}
                >
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Buy button */}
          <button
            style={{
              width: "100%",
              padding: "11px 0",
              borderRadius: 10,
              background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              letterSpacing: "0.01em",
            }}
          >
            Buy Shares — UGX {formatCurrency(property.pricePerShare)}/share
          </button>
        </div>
      </div>
    </Link>
  )
}
