"use client"

import Link from "next/link"
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/solid"
import { PlusIcon } from "@heroicons/react/24/outline"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import { useRentals, useConstruction, useOpportunities, useSession, useWallet, useLedgerHoldings } from "@/lib/hooks"
import { categoryMeta } from "@/lib/data/opportunities"
import Sparkline from "@/components/ui/Sparkline"

type AssetTab = "All Assets" | "Rental" | "Construction"

const assetFilterTabs: AssetTab[] = ["All Assets", "Rental", "Construction"]

export default function PortfolioPage() {
  const { rentals: featuredProperties } = useRentals()
  const { projects: constructionProjects } = useConstruction()
  const { opportunities } = useOpportunities()

  // Resolve any asset id (rental, construction, or opportunity) to display info
  const assetInfo = (id: string) => {
    const r = featuredProperties.find(f => f.id === id)
    if (r) return { name: r.name, location: r.location, image: r.image, price: r.pricePerShare, spark: r.chartData.slice(-20).map((d: { value: number }) => d.value), href: `/property/${r.id}`, kind: "Rental" as const }
    const c = constructionProjects.find(p => p.id === id)
    if (c) return { name: c.name, location: c.location, image: c.image, price: c.sharePrice, spark: [c.sharePriceStart, c.sharePrice], href: `/construction/${c.id}`, kind: "Construction" as const }
    const o = opportunities.find(p => p.id === id)
    if (o) return { name: o.title, location: o.location, image: o.image, price: o.unitPrice, spark: [o.unitPrice, o.unitPrice], href: `/opportunity/${o.id}`, kind: categoryMeta(o.category).label }
    return null
  }

  // This page renders behind SignInGate — always the signed-in user's REAL
  // ledger positions (virtual beta money), never mock showcase data
  const { user } = useSession()
  const { balance, live: walletLive } = useWallet(user)
  const { holdings: ledgerHoldings } = useLedgerHoldings(user)

  const portfolio = (ledgerHoldings ?? []).map(h => {
    const price = assetInfo(h.propertyId)?.price ?? h.avgCost
    return {
      propertyId: h.propertyId,
      shares: h.units,
      invested: h.units * h.avgCost,
      currentValue: h.units * price,
    }
  })

  const cashBalance = walletLive && balance !== null ? balance : 0
  // Weighted average rental yield across property positions (0 when none)
  const yieldWeighted = portfolio.reduce((acc, p) => {
    const r = featuredProperties.find(f => f.id === p.propertyId)
    return r ? { sum: acc.sum + r.rentalYield * p.currentValue, weight: acc.weight + p.currentValue } : acc
  }, { sum: 0, weight: 0 })
  const portfolioYield = yieldWeighted.weight > 0 ? (yieldWeighted.sum / yieldWeighted.weight).toFixed(1) : "0"
  const totalValue = portfolio.reduce((s, p) => s + p.currentValue, 0)
  const totalInvested = portfolio.reduce((s, p) => s + p.invested, 0)
  const totalGain = totalValue - totalInvested
  const totalGainPct = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0
  const rentalValue = portfolio
    .filter(p => assetInfo(p.propertyId)?.kind !== "Construction")
    .reduce((s, p) => s + p.currentValue, 0)
  const constructionValue = totalValue - rentalValue

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f6f8" }}>

      {/* Page header */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e8ecf0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px 28px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              {/* Breadcrumb */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>Dashboard</span>
                <span style={{ fontSize: 13, color: "#c4cad4" }}>/</span>
                <span style={{ fontSize: 13, color: "#2563eb", fontWeight: 600 }}>Portfolio</span>
              </div>
              <h1 style={{ fontSize: 30, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.6px", margin: "0 0 5px 0" }}>
                My Portfolio
              </h1>
              <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>
                Track your investments and income across every opportunity
              </p>
            </div>
            <Link
              href="/market"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 10, backgroundColor: "#2563eb", color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none" }}
            >
              <PlusIcon style={{ width: 16, height: 16 }} />
              Add Investment
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px 56px" }}>

        {/* Top 3-column cards */}
        <div className="portfolio-top-grid" style={{ marginBottom: 28 }}>

          {/* Card 1: Assets Net Value */}
          <div style={{ backgroundColor: "#fff", border: "1px solid #e8ecf0", borderRadius: 14, padding: "22px 22px 20px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px", margin: "0 0 14px 0" }}>
              Assets Net Value
            </p>
            <p style={{ fontSize: 30, fontWeight: 800, color: "#0f172a", margin: "0 0 4px 0", letterSpacing: "-0.8px", lineHeight: 1.1 }}>
              UGX {formatCurrency(totalValue)}
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 4, backgroundColor: "#f0fdf4", borderRadius: 99, padding: "3px 10px", marginBottom: 18 }}>
              <ArrowTrendingUpIcon style={{ width: 12, height: 12, color: "#10b981" }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: "#10b981" }}>+{formatPercentage(totalGainPct)} all time</span>
            </div>

            <div style={{ height: 1, backgroundColor: "#f1f4f8", marginBottom: 14 }} />

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>Available balance</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>UGX {cashBalance.toLocaleString()}</span>
            </div>

            <div style={{ backgroundColor: "#f0fdfa", border: "1px solid #99f6e4", borderRadius: 9, padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div>
                <p style={{ fontSize: 11, color: "#0d9488", fontWeight: 600, margin: "0 0 2px 0" }}>Claimable income</p>
                <p style={{ fontSize: 16, fontWeight: 800, color: "#0d9488", margin: 0 }}>UGX 0</p>
              </div>
              <button style={{ padding: "7px 16px", borderRadius: 8, backgroundColor: "#0d9488", color: "#fff", fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer" }}>
                Claim
              </button>
            </div>
            <button style={{ background: "none", border: "none", fontSize: 12, color: "#2563eb", fontWeight: 600, cursor: "pointer", padding: 0 }}>
              View claim history
            </button>
          </div>

          {/* Card 2: Analytics */}
          <div style={{ backgroundColor: "#fff", border: "1px solid #e8ecf0", borderRadius: 14, padding: "22px 22px 20px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px", margin: "0 0 14px 0" }}>
              Analytics
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div style={{ backgroundColor: "#f8f9fb", borderRadius: 10, padding: "12px 14px" }}>
                <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, margin: "0 0 4px 0" }}>Portfolio Yield</p>
                <p style={{ fontSize: 22, fontWeight: 800, color: "#0d9488", margin: 0, letterSpacing: "-0.5px" }}>{portfolioYield}%</p>
              </div>
              <div style={{ backgroundColor: "#f8f9fb", borderRadius: 10, padding: "12px 14px" }}>
                <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, margin: "0 0 4px 0" }}>Avg Total Gain</p>
                <p style={{ fontSize: 22, fontWeight: 800, color: totalGainPct >= 0 ? "#0d9488" : "#ef4444", margin: 0, letterSpacing: "-0.5px" }}>
                  {totalGainPct >= 0 ? "+" : ""}{formatPercentage(totalGainPct)}
                </p>
              </div>
            </div>
            <div style={{ height: 1, backgroundColor: "#f1f4f8", marginBottom: 14 }} />
            <p style={{ fontSize: 12, fontWeight: 600, color: "#64748b", margin: "0 0 10px 0" }}>Breakdown</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: "#0d9488" }} />
                  <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>Rental</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>UGX {formatCurrency(rentalValue)}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: "#f59e0b" }} />
                  <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>Construction</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>UGX {formatCurrency(constructionValue)}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Additional Materials */}
          <div style={{ backgroundColor: "#fff", border: "1px solid #e8ecf0", borderRadius: 14, padding: "22px 22px 20px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px", margin: "0 0 14px 0" }}>
              Additional Materials
            </p>
            {/* Tab row */}
            <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #f1f4f8", marginBottom: 20 }}>
              {["Documents", "Community", "Referral"].map((tab, i) => (
                <button
                  key={tab}
                  style={{
                    padding: "7px 14px", fontSize: 12, fontWeight: 600, border: "none",
                    background: "transparent", cursor: "pointer",
                    color: i === 0 ? "#2563eb" : "#94a3b8",
                    borderBottom: i === 0 ? "2px solid #2563eb" : "2px solid transparent",
                    transition: "all 0.15s",
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
            {/* Documents content */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, backgroundColor: "#f8f9fb", borderRadius: 10, padding: "14px 16px", marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width={20} height={20} fill="none" viewBox="0 0 24 24" stroke="#2563eb" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "0 0 2px 0" }}>Documents &amp; Taxes</p>
                <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>Annual reports, tax certificates</p>
              </div>
            </div>
            <button style={{ width: "100%", padding: "9px 0", borderRadius: 9, backgroundColor: "transparent", color: "#2563eb", fontSize: 13, fontWeight: 700, border: "1.5px solid #2563eb", cursor: "pointer" }}>
              View Documents
            </button>
          </div>
        </div>

        {/* Owned Assets section */}
        <div style={{ backgroundColor: "#fff", border: "1px solid #e8ecf0", borderRadius: 14, overflow: "hidden" }}>
          {/* Header + tabs */}
          <div style={{ padding: "20px 24px 0", borderBottom: "1px solid #f1f4f8" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 }}>Owned Assets</h2>
              <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>{portfolio.length} positions</span>
            </div>
            <AssetFilterTabs />
          </div>

          {/* Table */}
          <div className="responsive-table" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8f9fb" }}>
                  {["Asset Name", "Balance", "APR", "Asset Value", "Share Price", "Shares Owned", "Portfolio Share"].map(h => (
                    <th
                      key={h}
                      style={{
                        padding: "11px 18px",
                        textAlign: h === "Asset Name" ? "left" : "right",
                        fontSize: 11, fontWeight: 700, color: "#94a3b8",
                        textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {portfolio.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: "44px 24px", textAlign: "center" }}>
                      <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 5px 0" }}>You don&apos;t own any shares yet</p>
                      <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 18px 0", lineHeight: 1.6 }}>
                        Top up your wallet with demo funds, then invest in any open opportunity — your positions appear here.
                      </p>
                      <Link href="/market" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 22px", borderRadius: 10, backgroundColor: "#2563eb", color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                        Browse the Rental Market
                      </Link>
                    </td>
                  </tr>
                )}
                {portfolio.map((holding, idx) => {
                  const prop = assetInfo(holding.propertyId)
                  if (!prop) return null
                  const gain = holding.currentValue - holding.invested
                  const gainPct = holding.invested > 0 ? (gain / holding.invested) * 100 : 0
                  const positive = gain >= 0
                  const portfolioShare = totalValue > 0 ? ((holding.currentValue / totalValue) * 100).toFixed(1) : "0"
                  const sparkData = prop.spark
                  const avgPrice = holding.invested / holding.shares

                  return (
                    <tr
                      key={holding.propertyId}
                      style={{ borderTop: idx === 0 ? "none" : "1px solid #f8f9fb", transition: "background 0.15s" }}
                      onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = "#f8f9fb"}
                      onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.backgroundColor = ""}
                    >
                      {/* Asset Name */}
                      <td style={{ padding: "14px 18px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <img src={prop.image} alt={prop.name} style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
                          <div>
                            <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 2px 0" }}>{prop.name}</p>
                            <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{prop.location}</p>
                          </div>
                        </div>
                      </td>
                      {/* Balance (30d chart) */}
                      <td style={{ padding: "14px 18px", textAlign: "right" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <Sparkline data={sparkData} width={80} height={30} positive={positive} strokeWidth={1.8} />
                        </div>
                      </td>
                      {/* APR */}
                      <td style={{ padding: "14px 18px", textAlign: "right" }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#0d9488" }}>
                          {positive ? "+" : ""}{formatPercentage(gainPct)}
                        </span>
                      </td>
                      {/* Asset Value */}
                      <td style={{ padding: "14px 18px", textAlign: "right", fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                        UGX {formatCurrency(holding.currentValue)}
                      </td>
                      {/* Share Price */}
                      <td style={{ padding: "14px 18px", textAlign: "right", fontSize: 13, color: "#64748b" }}>
                        UGX {formatCurrency(avgPrice)}
                      </td>
                      {/* Shares Owned */}
                      <td style={{ padding: "14px 18px", textAlign: "right", fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
                        {holding.shares.toLocaleString()}
                      </td>
                      {/* Portfolio Share */}
                      <td style={{ padding: "14px 18px", textAlign: "right" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{portfolioShare}%</span>
                          <div style={{ width: 60, height: 4, borderRadius: 99, backgroundColor: "#f1f5f9", overflow: "hidden" }}>
                            <div style={{ width: `${portfolioShare}%`, height: "100%", backgroundColor: "#2563eb", borderRadius: 99 }} />
                          </div>
                          <div style={{ display: "flex", gap: 6 }}>
                            <Link href={prop.href} style={{ padding: "5px 10px", borderRadius: 7, backgroundColor: "#eff6ff", color: "#2563eb", fontSize: 11, fontWeight: 600, textDecoration: "none" }}>
                              Buy More
                            </Link>
                            <button style={{ padding: "5px 10px", borderRadius: 7, backgroundColor: "#f8f9fb", border: "1px solid #e2e8f0", color: "#64748b", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                              Sell
                            </button>
                          </div>
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

function AssetFilterTabs() {
  return (
    <div className="filter-tabs" style={{ display: "flex", gap: 0 }}>
      {(["All Assets", "Rental", "Construction"] as AssetTab[]).map((tab, i) => (
        <button
          key={tab}
          style={{
            padding: "7px 18px", fontSize: 13, fontWeight: 600, border: "none",
            background: "transparent", cursor: "pointer",
            color: i === 0 ? "#2563eb" : "#64748b",
            borderBottom: i === 0 ? "2px solid #2563eb" : "2px solid transparent",
            transition: "all 0.15s", whiteSpace: "nowrap",
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  )
}
