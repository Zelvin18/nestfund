"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { MagnifyingGlassIcon, ShieldCheckIcon, AdjustmentsHorizontalIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { useOpportunities } from "@/lib/hooks"
import {
  CATEGORIES, fundingProgress, displayStatus,
  type OpportunityCategory,
} from "@/lib/data/opportunities"
import OpportunityCard from "@/components/opportunities/OpportunityCard"

type DurationFilter = "any" | "under3" | "3to6" | "6to12" | "1to3y" | "3yplus"
type RiskFilter = "any" | "Lower" | "Moderate" | "Higher"
type StatusFilter = "any" | "Open" | "Almost Funded" | "Fully Funded" | "Active" | "Completed"

const durations: { key: DurationFilter; label: string }[] = [
  { key: "under3", label: "Under 3 months" },
  { key: "3to6", label: "3–6 months" },
  { key: "6to12", label: "6–12 months" },
  { key: "1to3y", label: "1–3 years" },
  { key: "3yplus", label: "3+ years" },
]

const riskOptions: RiskFilter[] = ["Lower", "Moderate", "Higher"]
const statusOptions: StatusFilter[] = ["Open", "Almost Funded", "Active", "Completed"]

const matchesDuration = (months: number, f: DurationFilter) =>
  f === "any" ||
  (f === "under3" && months < 3) ||
  (f === "3to6" && months >= 3 && months <= 6) ||
  (f === "6to12" && months > 6 && months <= 12) ||
  (f === "1to3y" && months > 12 && months <= 36) ||
  (f === "3yplus" && months > 36)

/* Category chips — the one always-visible filter row */
const categoryChip = (active: boolean, accent: string): React.CSSProperties => ({
  padding: "8px 17px", borderRadius: 99, fontSize: 13, fontWeight: 700, cursor: "pointer",
  whiteSpace: "nowrap", transition: "all 0.18s",
  border: active ? `1.5px solid ${accent}` : "1.5px solid #e5e9f0",
  backgroundColor: active ? accent : "#fff",
  color: active ? "#fff" : "#4b5563",
  boxShadow: active ? `0 5px 16px ${accent}45` : "0 1px 2px rgba(15,23,42,0.04)",
})

/* Panel option chips — quiet until chosen */
const optionChip = (active: boolean): React.CSSProperties => ({
  padding: "7px 14px", borderRadius: 99, fontSize: 12.5, fontWeight: 650, cursor: "pointer",
  whiteSpace: "nowrap", transition: "all 0.15s",
  border: active ? "1.5px solid #0f172a" : "1.5px solid #e5e9f0",
  backgroundColor: active ? "#0f172a" : "#fff",
  color: active ? "#fff" : "#4b5563",
})

export default function OpportunitiesPage() {
  const { opportunities } = useOpportunities()
  const [category, setCategory] = useState<OpportunityCategory | "all">("all")
  const [duration, setDuration] = useState<DurationFilter>("any")
  const [risk, setRisk] = useState<RiskFilter>("any")
  const [status, setStatus] = useState<StatusFilter>("any")
  const [query, setQuery] = useState("")
  const [panelOpen, setPanelOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Desktop: close the filter panel on outside click (mobile uses the backdrop)
  useEffect(() => {
    if (!panelOpen) return
    const onDown = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setPanelOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [panelOpen])

  const activeFilterCount = (duration !== "any" ? 1 : 0) + (risk !== "any" ? 1 : 0) + (status !== "any" ? 1 : 0)
  const clearFilters = () => { setDuration("any"); setRisk("any"); setStatus("any") }

  // Category links (?category=cashflow) — read via window to avoid the
  // useSearchParams Suspense hydration stall seen on ApplyPage; deferred
  // so the effect never sets state synchronously
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("category")
    if (c && CATEGORIES.some(x => x.key === c)) {
      Promise.resolve().then(() => setCategory(c as OpportunityCategory))
    }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return opportunities.filter(o => {
      if (category !== "all" && o.category !== category) return false
      if (!matchesDuration(o.durationMonths, duration)) return false
      if (risk !== "any" && o.riskLevel !== risk) return false
      if (status !== "any" && displayStatus(o) !== status) return false
      if (q && ![o.title, o.subcategory, o.description, o.location, o.category].some(s => s.toLowerCase().includes(q))) return false
      return true
    })
  }, [opportunities, category, duration, risk, status, query])

  const activeCat = category === "all" ? null : CATEGORIES.find(c => c.key === category)

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f6f8" }}>

      {/* ── Header ── */}
      <div style={{ backgroundColor: "#0a1628", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1800&q=80" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(8,18,36,0.96) 0%, rgba(13,28,58,0.92) 55%, rgba(20,38,74,0.85) 100%)" }} />
        </div>
        <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "38px 24px 30px", position: "relative" }}>
          <h1 style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.7px", margin: "0 0 8px 0" }}>
            Explore Opportunities
          </h1>
          <p style={{ fontSize: 14.5, color: "rgba(255,255,255,0.6)", margin: "0 0 22px 0", maxWidth: 560, lineHeight: 1.65 }}>
            Discover verified opportunities across multiple sectors and investment durations — each with a defined purpose, duration, risk profile and target return.
          </p>

          {/* Search */}
          <div style={{ position: "relative", maxWidth: 460 }}>
            <MagnifyingGlassIcon style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 17, height: 17, color: "#94a3b8" }} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search — truck, contract, apartment, coffee..."
              style={{ width: "100%", boxSizing: "border-box", height: 46, paddingLeft: 42, paddingRight: 16, fontSize: 14, borderRadius: 12, border: "1.5px solid rgba(255,255,255,0.15)", backgroundColor: "rgba(255,255,255,0.08)", color: "#fff", outline: "none", backdropFilter: "blur(8px)" }}
            />
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "22px 24px 56px" }}>

        {/* ── ONE filter row: category chips + filter button ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div className="filter-tabs" style={{ display: "flex", gap: 8, paddingBottom: 2, flex: 1, minWidth: 0 }}>
            <button onClick={() => setCategory("all")} style={categoryChip(category === "all", "#0f172a")}>All</button>
            {CATEGORIES.map(c => (
              <button key={c.key} onClick={() => setCategory(c.key)} style={categoryChip(category === c.key, c.accent)}>
                {c.label}
              </button>
            ))}
          </div>

          {/* Filter button + panel */}
          <div ref={panelRef} style={{ position: "relative", flexShrink: 0 }}>
            <button
              onClick={() => setPanelOpen(o => !o)}
              aria-label="Filters"
              style={{
                position: "relative",
                display: "flex", alignItems: "center", gap: 7,
                height: 38, padding: "0 14px", borderRadius: 99, cursor: "pointer",
                border: panelOpen || activeFilterCount > 0 ? "1.5px solid #0f172a" : "1.5px solid #e5e9f0",
                backgroundColor: panelOpen ? "#0f172a" : "#fff",
                color: panelOpen ? "#fff" : "#0f172a",
                fontSize: 13, fontWeight: 700,
                boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
                transition: "all 0.18s",
              }}
            >
              <AdjustmentsHorizontalIcon style={{ width: 16, height: 16 }} />
              <span className="filter-btn-label">Filters</span>
              {activeFilterCount > 0 && (
                <span style={{ minWidth: 18, height: 18, borderRadius: 99, backgroundColor: panelOpen ? "#fff" : "#2563eb", color: panelOpen ? "#0f172a" : "#fff", fontSize: 10.5, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>
                  {activeFilterCount}
                </span>
              )}
            </button>

            {panelOpen && (
              <>
                <div className="opp-filter-backdrop" onClick={() => setPanelOpen(false)} />
                <div className="opp-filter-panel">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <p style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.2px" }}>Refine</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {activeFilterCount > 0 && (
                        <button onClick={clearFilters} style={{ fontSize: 12.5, fontWeight: 700, color: "#2563eb", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                          Clear all
                        </button>
                      )}
                      <button onClick={() => setPanelOpen(false)} style={{ background: "#f2f5f9", border: "none", borderRadius: 9, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <XMarkIcon style={{ width: 16, height: 16, color: "#64748b" }} />
                      </button>
                    </div>
                  </div>

                  <FilterGroup label="Duration">
                    {durations.map(d => (
                      <button key={d.key} onClick={() => setDuration(duration === d.key ? "any" : d.key)} style={optionChip(duration === d.key)}>
                        {d.label}
                      </button>
                    ))}
                  </FilterGroup>

                  <FilterGroup label="Risk level">
                    {riskOptions.map(r => (
                      <button key={r} onClick={() => setRisk(risk === r ? "any" : r)} style={optionChip(risk === r)}>
                        {r}
                      </button>
                    ))}
                  </FilterGroup>

                  <FilterGroup label="Status">
                    {statusOptions.map(s => (
                      <button key={s} onClick={() => setStatus(status === s ? "any" : s)} style={optionChip(status === s)}>
                        {s}
                      </button>
                    ))}
                  </FilterGroup>

                  <button
                    onClick={() => setPanelOpen(false)}
                    style={{ width: "100%", marginTop: 6, padding: "12px 0", borderRadius: 12, border: "none", cursor: "pointer", background: "linear-gradient(135deg, #2563eb, #4f46e5)", color: "#fff", fontSize: 14, fontWeight: 750 }}
                  >
                    Show {filtered.length} {filtered.length === 1 ? "opportunity" : "opportunities"}
                  </button>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: "9px 0 0 0", textAlign: "center" }}>Tap a selected option again to remove it</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Active category banner ── */}
        {activeCat && (
          <div style={{ display: "flex", alignItems: "center", gap: 14, backgroundColor: activeCat.accentBg, border: `1.5px solid ${activeCat.accent}30`, borderRadius: 14, padding: "14px 18px", marginBottom: 20, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <p style={{ fontSize: 14, fontWeight: 800, color: activeCat.accent, margin: "0 0 2px 0" }}>{activeCat.label} — {activeCat.tagline}</p>
              <p style={{ fontSize: 12.5, color: "#475569", margin: 0, lineHeight: 1.55 }}>{activeCat.description}</p>
            </div>
            <div style={{ display: "flex", gap: 16, flexShrink: 0 }}>
              <div>
                <p style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, margin: 0, textTransform: "uppercase" }}>Typical duration</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: 0 }}>{activeCat.duration}</p>
              </div>
              <div>
                <p style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, margin: 0, textTransform: "uppercase" }}>Risk</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: 0 }}>{activeCat.risk}</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Results ── */}
        {category === "stable" ? (
          <div style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", padding: "56px 24px", textAlign: "center" }}>
            <ShieldCheckIcon style={{ width: 40, height: 40, color: "#94a3b8", margin: "0 auto 14px" }} />
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 6px 0" }}>Stable opportunities are coming</h3>
            <p style={{ fontSize: 13.5, color: "#64748b", margin: "0 auto", maxWidth: 440, lineHeight: 1.7 }}>
              Lower-risk products built around capital preservation are in preparation. They will appear here once the right structures are in place — nothing is listed before it is real.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", padding: "56px 24px", textAlign: "center" }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", margin: "0 0 6px 0" }}>No opportunities match those filters</h3>
            <p style={{ fontSize: 13.5, color: "#64748b", margin: 0 }}>Try widening the duration or risk filters, or clear the search.</p>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 12.5, color: "#94a3b8", margin: "0 0 14px 0" }}>
              {filtered.length} {filtered.length === 1 ? "opportunity" : "opportunities"}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))", gap: 18 }}>
              {filtered.map(o => <OpportunityCard key={o.id} opportunity={o} />)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* One labelled group inside the filter panel */
function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <p style={{ fontSize: 11, fontWeight: 750, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 8px 0" }}>{label}</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>{children}</div>
    </div>
  )
}
