"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import RecentTrades from "@/components/markets/RecentTrades"
import { exchangeStats, type ExchangeListing } from "@/lib/data/exchange"
import { useExchange, useSession, useLedgerHoldings } from "@/lib/hooks"
import SellSharesModal from "@/components/exchange/SellSharesModal"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPrice(value: number): string {
  return value.toLocaleString()
}

function formatPropertyValue(value: number): string {
  if (value >= 1_000_000_000) return `UGX ${(value / 1_000_000_000).toFixed(1)}B`
  if (value >= 1_000_000) return `UGX ${(value / 1_000_000).toFixed(1)}M`
  return `UGX ${value.toLocaleString()}`
}

// ─── Types ───────────────────────────────────────────────────────────────────

type FilterKey = "All" | "Income" | "Growth" | "Trending"

const filterTabs: { key: FilterKey; label: string }[] = [
  { key: "All", label: "All Listings" },
  { key: "Income", label: "Income" },
  { key: "Growth", label: "Growth & Construction" },
  { key: "Trending", label: "Trending" },
]

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ExchangePage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("All")
  const { listings: exchangeListings } = useExchange()
  const { user } = useSession()
  const { holdings } = useLedgerHoldings(user)
  const [sellModal, setSellModal] = useState<{ open: boolean; presetAssetId?: string }>({ open: false })

  const ownsAsset = (assetId: string) =>
    (holdings ?? []).some(h => h.propertyId === assetId && h.units > 0)

  const filtered = exchangeListings.filter(listing => {
    if (activeFilter === "All") return true
    if (activeFilter === "Income") return listing.marketType === "income"
    if (activeFilter === "Growth") return listing.marketType === "construction"
    if (activeFilter === "Trending") return listing.priceChange >= 4
    return true
  })

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f6f8" }}>

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e8ecf0" }}>
        <div
          className="container"
          style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px 0" }}
        >

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 18 }}>
            <Link
              href="/opportunities"
              style={{ fontSize: 13, color: "#64748b", textDecoration: "none", fontWeight: 500 }}
            >
              Opportunities
            </Link>
            <span style={{ fontSize: 13, color: "#c4cad4" }}>/</span>
            <span style={{ fontSize: 13, color: "#2563eb", fontWeight: 600 }}>Exchange</span>
          </div>

          {/* Title + subtitle + sell CTA — the CTA holds its own line on
              mobile (full width) instead of crowding the stat tiles */}
          <div className="exchange-hero-row">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
                <h1
                  style={{
                    fontSize: 30,
                    fontWeight: 800,
                    color: "#0f172a",
                    margin: 0,
                    letterSpacing: "-0.6px",
                  }}
                >
                  Exchange
                </h1>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, backgroundColor: "#f0fdf7", border: "1px solid #d1fae5", borderRadius: 99, padding: "4px 12px" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#10b981", display: "inline-block", animation: "pulse-dot 2s ease-in-out infinite" }} />
                  <span style={{ fontSize: 11, color: "#059669", fontWeight: 700 }}>Live</span>
                </span>
              </div>
              <p style={{ fontSize: 15, color: "#64748b", margin: 0, lineHeight: 1.6 }}>
                Buy and sell shares in listed opportunities with other investors — anytime.
              </p>
            </div>
            <button
              className="exchange-sell-btn"
              onClick={() => setSellModal({ open: true })}
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "12px 26px", borderRadius: 12, border: "none", cursor: "pointer",
                background: "linear-gradient(135deg, #2563eb, #4f46e5)", color: "#fff",
                fontSize: 14, fontWeight: 750, boxShadow: "0 6px 18px rgba(37,99,235,0.28)",
                flexShrink: 0, whiteSpace: "nowrap",
              }}
            >
              {user ? "Sell Your Shares" : "Sign In to Sell"}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>

          {/* Stats grid */}
          <div className="stats-grid" style={{ marginBottom: 28 }}>
            <StatCard label="Monthly Volume" value={exchangeStats.monthlyVolume} />
            <StatCard label="Avg. Sell Time" value={exchangeStats.avgSellTime} />
            <StatCard label="Market Participants" value={exchangeStats.participants.toLocaleString()} />
            <StatCard label="Active Listings" value={exchangeStats.totalListings.toString()} highlight />
          </div>

          {/* Filter tabs */}
          <div className="filter-tabs" style={{ display: "flex", gap: 0 }}>
            {filterTabs.map(tab => {
              const isActive = activeFilter === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key)}
                  style={{
                    padding: "9px 20px",
                    fontSize: 13,
                    fontWeight: 600,
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    color: isActive ? "#2563eb" : "#64748b",
                    borderBottom: isActive ? "2px solid #2563eb" : "2px solid transparent",
                    transition: "all 0.15s",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Info Banner ──────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: "#f8f9fb", borderBottom: "1px solid #eef0f4" }}>
        <div
          className="container"
          style={{ maxWidth: 1280, margin: "0 auto", padding: "10px 24px" }}
        >
          <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, fontWeight: 500, lineHeight: 1.5 }}>
            <span style={{ fontWeight: 700, color: "#64748b" }}>How it works: </span>
            NestFund operates as the marketplace — connecting buyers and sellers across every opportunity type. All share transfers are recorded on our ledger.
          </p>
        </div>
      </div>

      {/* ── Main content: sidebar + listings ─────────────────────────────── */}
      <div
        className="container"
        style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px 56px" }}
      >
        <div className="exchange-layout">

          {/* ── Sidebar: Market Stats ──────────────────────────────────── */}
          <aside className="exchange-sidebar">
            <div
              style={{
                backgroundColor: "#fff",
                border: "1px solid #e8ecf0",
                borderRadius: 14,
                padding: "20px 22px",
                position: "sticky",
                top: 24,
              }}
            >
              <h2
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: "0 0 18px 0",
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                }}
              >
                Market Stats
              </h2>

              <SidebarStat
                label="Monthly Trading Volume"
                value={exchangeStats.monthlyVolume}
                valueColor="#2563eb"
              />
              <div style={{ height: 1, backgroundColor: "#f1f4f8", margin: "14px 0" }} />
              <SidebarStat
                label="Avg. Share Sell Time"
                value={exchangeStats.avgSellTime}
                valueColor="#0f172a"
              />
              <div style={{ height: 1, backgroundColor: "#f1f4f8", margin: "14px 0" }} />
              <SidebarStat
                label="Market Participants"
                value={exchangeStats.participants.toLocaleString()}
                valueColor="#0f172a"
              />
              <div style={{ height: 1, backgroundColor: "#f1f4f8", margin: "14px 0" }} />
              <SidebarStat
                label="Active Listings"
                value={exchangeStats.totalListings.toString()}
                valueColor="#10b981"
              />

              {/* Live indicator */}
              <div
                style={{
                  marginTop: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  backgroundColor: "#f0fdf7",
                  border: "1px solid #d1fae5",
                  borderRadius: 8,
                  padding: "8px 12px",
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    backgroundColor: "#10b981",
                    display: "inline-block",
                    flexShrink: 0,
                    animation: "pulse-dot 2s ease-in-out infinite",
                  }}
                />
                <span style={{ fontSize: 11, color: "#059669", fontWeight: 600 }}>
                  Market is live
                </span>
              </div>

              <RecentTrades />
            </div>
          </aside>

          {/* ── Listings column ────────────────────────────────────────── */}
          <div>
            <p
              style={{
                fontSize: 13,
                color: "#94a3b8",
                marginBottom: 16,
                marginTop: 0,
                fontWeight: 500,
              }}
            >
              Showing{" "}
              <strong style={{ color: "#374151" }}>{filtered.length}</strong> listings
            </p>

            <div
              className="property-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(520px, 100%), 1fr))",
                gap: 16,
              }}
            >
              {filtered.map(listing => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  canSell={ownsAsset(listing.id)}
                  signedIn={!!user}
                  onSell={() => setSellModal({ open: true, presetAssetId: listing.id })}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {sellModal.open && (
        <SellSharesModal
          presetAssetId={sellModal.presetAssetId}
          onClose={() => setSellModal({ open: false })}
        />
      )}
    </div>
  )
}

// ─── Stat Card (header) ───────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <div
      style={{
        backgroundColor: "#f8f9fb",
        border: "1px solid #e8ecf0",
        borderRadius: 12,
        padding: "16px 20px",
      }}
    >
      <p
        style={{
          fontSize: 11,
          color: "#94a3b8",
          fontWeight: 600,
          margin: "0 0 5px 0",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: 24,
          fontWeight: 800,
          color: highlight ? "#10b981" : "#0f172a",
          margin: 0,
          letterSpacing: "-0.5px",
        }}
      >
        {value}
      </p>
    </div>
  )
}

// ─── Sidebar Stat ─────────────────────────────────────────────────────────────

function SidebarStat({
  label,
  value,
  valueColor = "#0f172a",
}: {
  label: string
  value: string
  valueColor?: string
}) {
  return (
    <div>
      <p
        style={{
          fontSize: 11,
          color: "#94a3b8",
          fontWeight: 500,
          margin: "0 0 4px 0",
          lineHeight: 1.4,
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: valueColor,
          margin: 0,
          letterSpacing: "-0.4px",
          lineHeight: 1.2,
        }}
      >
        {value}
      </p>
    </div>
  )
}

// ─── Listing Card (Binaryx-style horizontal) ──────────────────────────────────

function ListingCard({ listing, canSell, signedIn, onSell }: {
  listing: ExchangeListing
  canSell: boolean
  signedIn: boolean
  onSell: () => void
}) {
  const router = useRouter()
  // Sell is possible signed-out only in the sense that the modal explains sign-in;
  // signed-in users without shares of THIS asset get a disabled button
  const sellDisabled = signedIn && !canSell
  return (
    <div
      className="exchange-card-row"
      style={{
        backgroundColor: "#fff",
        border: "1px solid #e8ecf0",
        borderRadius: 14,
        transition: "box-shadow 0.2s, transform 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow = "0 8px 28px rgba(37,99,235,0.09)"
        el.style.transform = "translateY(-2px)"
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow = "none"
        el.style.transform = "translateY(0)"
      }}
    >

      {/* ── Left: image ────────────────────────────────────────────────── */}
      <div
        className="exchange-card-img"
        style={{ position: "relative" }}
      >
        <img
          src={listing.image}
          alt={listing.name}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />

        {/* Gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(0,0,0,0.0) 60%, rgba(0,0,0,0.18) 100%), linear-gradient(to bottom, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.50) 100%)",
          }}
        />

        {/* Type badge */}
        <div style={{ position: "absolute", bottom: 12, left: 12 }}>
          <span
            style={{
              display: "inline-block",
              backgroundColor:
                listing.marketType === "construction"
                  ? "rgba(245,158,11,0.92)"
                  : "rgba(16,185,129,0.92)",
              color: "#fff",
              fontSize: 10,
              fontWeight: 700,
              padding: "3px 9px",
              borderRadius: 99,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {listing.marketType === "construction" ? "Growth" : "Income"}
          </span>
        </div>

        {/* Asset sub-type badge */}
        <div style={{ position: "absolute", top: 12, left: 12 }}>
          <span
            style={{
              display: "inline-block",
              backgroundColor: "rgba(255,255,255,0.88)",
              color: "#374151",
              fontSize: 9,
              fontWeight: 700,
              padding: "3px 8px",
              borderRadius: 99,
              textTransform: "uppercase",
              letterSpacing: "0.4px",
            }}
          >
            {listing.type}
          </span>
        </div>
      </div>

      {/* ── Right: content ─────────────────────────────────────────────── */}
      <div style={{ flex: 1, padding: "16px 18px 14px", display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Row 1: Name + asset value */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 8,
            marginBottom: 2,
          }}
        >
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#0f172a",
              margin: 0,
              letterSpacing: "-0.2px",
              lineHeight: 1.3,
            }}
          >
            {listing.name}
          </h3>
          <div style={{ display: "flex", alignItems: "baseline", gap: 4, flexShrink: 0 }}>
            <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, whiteSpace: "nowrap" }}>
              Asset value:
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#0d9488", whiteSpace: "nowrap" }}>
              {formatPropertyValue(listing.propertyValue)}
            </span>
          </div>
        </div>

        {/* Location */}
        <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 12px 0", fontWeight: 500 }}>
          {listing.location}
        </p>

        {/* Share price row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 10,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: "-0.5px",
              lineHeight: 1,
            }}
          >
            UGX {formatPrice(listing.currentSharePrice)}
            <span style={{ fontSize: 13, fontWeight: 500, color: "#64748b" }}> / share</span>
          </span>

          {/* Strikethrough original */}
          <span
            style={{
              fontSize: 12,
              color: "#94a3b8",
              textDecoration: "line-through",
              fontWeight: 500,
            }}
          >
            UGX {formatPrice(listing.originalSharePrice)}
          </span>

          {/* % change */}
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#10b981",
              backgroundColor: "#f0fdf7",
              border: "1px solid #d1fae5",
              borderRadius: 6,
              padding: "2px 7px",
              lineHeight: 1.5,
            }}
          >
            +{listing.priceChange.toFixed(2)}%
          </span>

          {/* APR badge */}
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#0d9488",
              backgroundColor: "#f0fdfa",
              border: "1px solid #99f6e4",
              borderRadius: 6,
              padding: "2px 7px",
              lineHeight: 1.5,
            }}
          >
            {listing.apr}% APR
          </span>
        </div>

        {/* Available to buy */}
        <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 12px 0", fontWeight: 500 }}>
          Available to buy:{" "}
          <strong style={{ color: "#0f172a" }}>
            {listing.availableBuyShares.toLocaleString()} Shares
          </strong>
        </p>

        {/* Action buttons — Buy opens the trade floor; Sell knows your position */}
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <button
            onClick={() => router.push(`/exchange/${listing.id}`)}
            style={{
              flex: 1,
              padding: "9px 0",
              borderRadius: 9,
              backgroundColor: "#2563eb",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              transition: "background 0.15s",
            }}
            onMouseEnter={e =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1d4ed8")
            }
            onMouseLeave={e =>
              ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#2563eb")
            }
          >
            Buy Shares
          </button>
          <button
            onClick={() => !sellDisabled && onSell()}
            disabled={sellDisabled}
            title={sellDisabled ? "You don't own shares of this asset" : undefined}
            style={{
              flex: 1,
              padding: "9px 0",
              borderRadius: 9,
              backgroundColor: sellDisabled ? "#f1f5f9" : "#fff",
              color: sellDisabled ? "#b0b9c6" : "#374151",
              fontSize: 13,
              fontWeight: 600,
              border: sellDisabled ? "1.5px solid #eef1f5" : "1.5px solid #d1d5db",
              cursor: sellDisabled ? "not-allowed" : "pointer",
              transition: "background 0.15s, border-color 0.15s",
            }}
            onMouseEnter={e => {
              if (sellDisabled) return
              const btn = e.currentTarget as HTMLButtonElement
              btn.style.backgroundColor = "#f8f9fb"
              btn.style.borderColor = "#9ca3af"
            }}
            onMouseLeave={e => {
              if (sellDisabled) return
              const btn = e.currentTarget as HTMLButtonElement
              btn.style.backgroundColor = "#fff"
              btn.style.borderColor = "#d1d5db"
            }}
          >
            {sellDisabled ? "No Shares to Sell" : "Sell"}
          </button>
        </div>

        {/* Separator */}
        <div style={{ height: 1, backgroundColor: "#f1f4f8", marginBottom: 10 }} />

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>
            Last trade:{" "}
            <strong style={{ color: "#374151" }}>
              UGX {formatPrice(listing.lastTradePrice)}
            </strong>{" "}
            &middot; {listing.lastTradeTime}
          </span>
          <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>
            {listing.availableSellShares.toLocaleString()} shares for sale
          </span>
        </div>
      </div>
    </div>
  )
}
