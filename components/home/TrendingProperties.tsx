"use client"

import Link from "next/link"
import { ArrowRightIcon } from "@heroicons/react/24/outline"
import { useOpportunities } from "@/lib/hooks"
import { fundingProgress, displayStatus, type Opportunity } from "@/lib/data/opportunities"
import OpportunityCard from "@/components/opportunities/OpportunityCard"

/**
 * Trending Opportunities — a deliberately mixed selection so the home
 * page shows the whole marketplace, not just property. Categories are
 * interleaved (best-funded first within each), up to six cards.
 */
export default function TrendingOpportunities() {
  const { opportunities } = useOpportunities()

  const open = opportunities.filter(o => {
    const s = displayStatus(o)
    return s === "Open" || s === "Almost Funded"
  })

  // Group by category, best funding progress first within each group
  const groups = new Map<string, Opportunity[]>()
  for (const o of open) {
    const g = groups.get(o.category) ?? []
    g.push(o)
    groups.set(o.category, g)
  }
  groups.forEach(g => g.sort((a, b) => fundingProgress(b) - fundingProgress(a)))

  // Round-robin across categories so the mix is guaranteed
  const trending: Opportunity[] = []
  const lists = [...groups.values()]
  for (let round = 0; trending.length < 6 && lists.some(l => l.length > round); round++) {
    for (const l of lists) {
      if (l[round] && trending.length < 6) trending.push(l[round])
    }
  }

  if (trending.length === 0) return null

  return (
    <section className="section-pad" style={{ backgroundColor: "#fff", padding: "64px 0" }}>
      <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 14, flexWrap: "wrap", marginBottom: 28 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px 0" }}>
              Live Market
            </p>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.6px", margin: "0 0 6px 0" }}>
              Trending Opportunities
            </h2>
            <p style={{ fontSize: 15, color: "#64748b", margin: 0 }}>
              Contracts, trade, assets and property — live funding across the marketplace
            </p>
          </div>
          <Link
            href="/opportunities"
            style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 14, fontWeight: 700, color: "#2563eb", textDecoration: "none", whiteSpace: "nowrap" }}
          >
            View All
            <ArrowRightIcon style={{ width: 15, height: 15 }} />
          </Link>
        </div>

        {/* Mixed grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))", gap: 20 }}>
          {trending.map(o => <OpportunityCard key={o.id} opportunity={o} />)}
        </div>
      </div>
    </section>
  )
}
