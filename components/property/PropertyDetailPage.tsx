"use client"

import { useState, useMemo, useRef } from "react"
import Link from "next/link"
import {
  ArrowLeftIcon, MapPinIcon, HeartIcon, ShareIcon,
  ShieldCheckIcon, ArrowTopRightOnSquareIcon, ClipboardDocumentIcon,
  UserGroupIcon, CalendarIcon, BuildingOfficeIcon,
  DocumentTextIcon, ChartBarSquareIcon, LinkIcon, ClipboardDocumentListIcon, PencilSquareIcon,
} from "@heroicons/react/24/outline"
import {
  ArrowTrendingUpIcon, ArrowTrendingDownIcon,
  CheckBadgeIcon, StarIcon,
} from "@heroicons/react/24/solid"
import { useRouter } from "next/navigation"
import { generatePriceSeries } from "@/lib/mockData"
import { useRentals, useComingSoon, useSession } from "@/lib/hooks"
import { purchaseShares } from "@/lib/ledger"
import { ReserveModal } from "@/components/comingsoon/ComingSoon"
import StickyBuyBar from "@/components/property/StickyBuyBar"
import { UsersIcon as UsersOutlineIcon, SparklesIcon } from "@heroicons/react/24/outline"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import { AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts"
import ChartBox from "@/components/ui/ChartBox"

const timeRanges = ["1W", "1M", "3M", "6M", "1Y", "ALL"] as const
type TimeRange = (typeof timeRanges)[number]

/* Label helper — real calendar dates counting back from today */
const dateLabel = (stepDays: number) => (i: number, points: number) => {
  const d = new Date()
  d.setDate(d.getDate() - Math.round((points - 1 - i) * stepDays))
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
}

/* Each range: number of points, spacing in days, and how much of the
   property's long-term growth story it covers */
const rangeConfig: Record<TimeRange, { points: number; stepDays: number; driftShare: number }> = {
  "1W":  { points: 8,  stepDays: 1,   driftShare: 0.04 },
  "1M":  { points: 30, stepDays: 1,   driftShare: 0.12 },
  "3M":  { points: 13, stepDays: 7,   driftShare: 0.3 },
  "6M":  { points: 26, stepDays: 7,   driftShare: 0.55 },
  "1Y":  { points: 12, stepDays: 30,  driftShare: 1 },
  "ALL": { points: 24, stepDays: 30,  driftShare: 2 },
}

/* Long-term annual growth per story tier */
const annualGrowthPct = { High: 16, Medium: 9, Low: 3.5 }

export default function PropertyDetailPage({ id }: { id: string }) {
  const { rentals } = useRentals()
  const { queue } = useComingSoon()
  const property = rentals.find(p => p.id === id) ?? queue.find(p => p.id === id)
  const queued = queue.find(p => p.id === id)
  const widgetRef = useRef<HTMLDivElement>(null)
  const [showReserve, setShowReserve] = useState(false)
  const [shares, setShares] = useState(100)
  const [range, setRange] = useState<TimeRange>("1M")
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState<"overview"|"documents"|"calculator"|"activities"|"trades">("overview")
  const [docTab, setDocTab] = useState<"ownership"|"property"|"audit">("ownership")
  const [investment, setInvestment] = useState(500000)
  const router = useRouter()
  const { user } = useSession()
  const [buyState, setBuyState] = useState<{ phase: "idle" | "busy" | "done"; message?: string; error?: string }>({ phase: "idle" })

  const handleBuy = async () => {
    if (!property || buyState.phase === "busy") return
    if (!user) { router.push("/auth/login"); return }
    setBuyState({ phase: "busy" })
    try {
      const { ref } = await purchaseShares({
        userId: user.id,
        propertyId: property.id,
        propertyName: property.name,
        units: shares,
        pricePerShare: property.pricePerShare,
      })
      setBuyState({ phase: "done", message: `You now own ${shares.toLocaleString()} more shares of ${property.name}. Receipt ${ref}.` })
    } catch (err) {
      const raw = err instanceof Error ? err.message : "Purchase failed — please try again."
      setBuyState({ phase: "idle", error: raw.replace(/^INSUFFICIENT_FUNDS:/, "") })
    }
  }

  // Story-driven price series — each range shows its slice of the property's
  // long-term growth, always ending at the current share price
  const chartSeries = useMemo(() => {
    if (!property) return []
    const cfg = rangeConfig[range]
    const growth = annualGrowthPct[property.futureGrowth]
    const drift = range === "1W"
      ? property.priceChangePercent * 1.4
      : growth * cfg.driftShare * (property.priceChangePercent < 0 ? 0.55 : 1)
    return generatePriceSeries(`${property.id}-${range}`, property.pricePerShare, cfg.points, drift, dateLabel(cfg.stepDays))
  }, [property, range])

  // Admin-curated picks first, then auto-fill with same type / top yield (open listings only)
  const recommendations = useMemo(() => {
    if (!property) return []
    const open = rentals.filter(r => r.status === "Live")
    const manual = (property.recommendedIds ?? [])
      .map(rid => open.find(r => r.id === rid))
      .filter((r): r is NonNullable<typeof r> => !!r && r.id !== property.id)
    const pool = open.filter(r => r.id !== property.id && !manual.some(m => m.id === r.id))
    const sameType = pool.filter(r => r.type === property.type)
    const rest = pool.filter(r => r.type !== property.type).sort((a, b) => b.rentalYield - a.rentalYield)
    return [...manual, ...sameType, ...rest].slice(0, 3)
  }, [rentals, property])

  if (!property) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <p style={{ color: "#64748b" }}>Property not found</p>
    </div>
  )

  // The canonical record carries specs, gallery, activities, and trades
  const extra = property
  const isComingSoon = property.status === "Coming Soon"
  const isPositive = property.priceChangePercent >= 0
  const totalCost = shares * property.pricePerShare
  const monthlyIncome = (totalCost * (property.rentalYield / 100)) / 12
  const annualIncome = totalCost * (property.rentalYield / 100)
  const sharesPct = Math.round((property.availableShares / property.totalShares) * 100)
  const soldPct = 100 - sharesPct
  const chartColor = isPositive ? "#10b981" : "#ef4444"
  const calcShares = Math.floor(investment / property.pricePerShare)
  const calcMonthly = (investment * (property.rentalYield / 100)) / 12
  const calcAnnual = investment * (property.rentalYield / 100)

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f6f8" }}>

      {/* Coming Soon guard — not investable until it opens */}
      {isComingSoon && (
        <div style={{ backgroundColor: "#0f766e", padding: "11px 24px" }}>
          <p style={{ maxWidth: 1280, margin: "0 auto", fontSize: 13, fontWeight: 650, color: "#fff", display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, fontWeight: 800, backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 99, padding: "3px 10px", letterSpacing: "0.06em" }}>COMING SOON</span>
            This property hasn&apos;t opened for investment yet — explore its potential below and reserve priority access before launch.
          </p>
        </div>
      )}

      {/* Breadcrumb */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e8ecf0" }}>
        <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 48, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0, overflow: "hidden" }}>
            <Link href="/market" style={{ fontSize: 13, color: "#64748b", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap", flexShrink: 0 }}>
              <ArrowLeftIcon style={{ width: 14, height: 14 }} />Rental Market
            </Link>
            <span style={{ fontSize: 13, color: "#c4cad4", flexShrink: 0 }}>/</span>
            <span style={{ fontSize: 13, color: "#0f172a", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0 }}>{property.name}</span>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button onClick={() => setSaved(!saved)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 8, border: `1.5px solid ${saved ? "#fecaca" : "#e2e8f0"}`, background: saved ? "#fef2f2" : "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: saved ? "#dc2626" : "#64748b" }}>
              <HeartIcon style={{ width: 14, height: 14 }} />{saved ? "Saved" : "Save"}
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#64748b" }}>
              <ShareIcon style={{ width: 14, height: 14 }} />Share
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px 48px" }}>
        <div className="property-detail-grid">

          {/* ── GALLERY (mobile: widget slots right under this) ── */}
          <div className="pd-gallery">

            {/* Image gallery — CSS-driven responsive layout */}
            <div className="property-gallery-row">
              {/* Main image */}
              <div className="property-gallery-main">
                <img src={extra.images[0]} alt={property.name} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.3) 100%)" }} />
                <div style={{ position: "absolute", top: 12, left: 12 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, backgroundColor: "rgba(255,255,255,0.92)", borderRadius: 99, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "#16a34a" }}>
                    <CheckBadgeIcon style={{ width: 13, height: 13 }} />Verified
                  </span>
                </div>
                <div style={{ position: "absolute", top: 12, right: 12 }}>
                  <span style={{ backgroundColor: "#0d9488", color: "#fff", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 6 }}>{property.rentalYield}% APR</span>
                </div>
              </div>
              {/* Thumbnails */}
              <div className="gallery-thumbs">
                {extra.images.slice(1, 5).map((img, i) => (
                  <div key={i} className="gallery-thumb">
                    <img src={img} alt="" />
                    {i === 3 && (
                      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(15,23,42,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>+3</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── CONTENT (mobile: appears after the buy widget) ── */}
          <div className="pd-content">

            {/* Title */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <div>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: "0 0 5px 0", letterSpacing: "-0.5px" }}>{property.name}</h1>
                <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#64748b" }}>
                  <MapPinIcon style={{ width: 14, height: 14 }} />
                  <span style={{ fontSize: 13 }}>{property.location}</span>
                  <span style={{ color: "#e2e8f0" }}>·</span>
                  <span style={{ fontSize: 13 }}>{property.id.includes("office") ? "Commercial" : "Residential"}</span>
                </div>
              </div>
              <div style={{ display: "flex", gap: 3 }}>
                {[1,2,3,4,5].map(s => <StarIcon key={s} style={{ width: 14, height: 14, color: "#f59e0b" }} />)}
                <span style={{ fontSize: 12, color: "#64748b", marginLeft: 4 }}>98/100</span>
              </div>
            </div>

            {/* Property detail icons — proper SVG icons, no emojis */}
            <div className="prop-features-row" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                ...(extra.beds > 0 ? [{ svg: <svg viewBox="0 0 24 24" fill="none" stroke="#0369a1" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v10m0-6h18M3 11v0a2 2 0 012-2h14a2 2 0 012 2v0M7 11V7a1 1 0 011-1h8a1 1 0 011 1v4" /></svg>, label: `${extra.beds} Bed` }] : []),
                ...(extra.baths > 0 ? [{ svg: <svg viewBox="0 0 24 24" fill="none" stroke="#0369a1" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16v4a4 4 0 01-4 4H8a4 4 0 01-4-4v-4z" /><path d="M6 12V6a3 3 0 013-3h1" /></svg>, label: `${extra.baths} Bath` }] : []),
                { svg: <svg viewBox="0 0 24 24" fill="none" stroke="#0369a1" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l4-4m0 0L18 6a1 1 0 011 1l-11 11-4.4 1.1.4-1.1z" /></svg>, label: `${extra.sqm} m²` },
                { svg: <svg viewBox="0 0 24 24" fill="none" stroke="#0369a1" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" /><circle cx="8.5" cy="14.5" r="1.5" /><circle cx="15.5" cy="14.5" r="1.5" /></svg>, label: `${extra.parking} Parking` },
                { svg: <svg viewBox="0 0 24 24" fill="none" stroke="#0369a1" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18M4 21V8l8-5 8 5v13" /><path d="M9 21V12h6v9" /></svg>, label: `${extra.floors} Floors` },
                { svg: <svg viewBox="0 0 24 24" fill="none" stroke="#0369a1" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>, label: `Built ${extra.yearBuilt}` },
                { svg: <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>, label: "Occupied", green: true },
              ].map(d => (
                <div key={d.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, backgroundColor: (d as {green?: boolean}).green ? "#f0fdf4" : "#f0f9ff", borderRadius: 12, padding: "10px 14px", minWidth: 70, border: `1px solid ${(d as {green?: boolean}).green ? "#bbf7d0" : "#e0f2fe"}` }}>
                  <div style={{ width: 22, height: 22 }}>{d.svg}</div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: (d as {green?: boolean}).green ? "#16a34a" : "#0369a1" }}>{d.label}</span>
                </div>
              ))}
            </div>

            {/* Chart (live) or Launch Potential (coming soon) */}
            {!isComingSoon ? (
              <div style={{ backgroundColor: "#fff", borderRadius: 14, padding: "18px 20px 12px", border: "1px solid #e8ecf0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <p style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 2px 0", letterSpacing: "-0.4px" }}>UGX {formatCurrency(property.pricePerShare)}<span style={{ fontSize: 13, fontWeight: 500, color: "#64748b" }}>/share</span></p>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: isPositive ? "#10b981" : "#ef4444" }}>
                      {isPositive ? <ArrowTrendingUpIcon style={{ width: 13, height: 13 }} /> : <ArrowTrendingDownIcon style={{ width: 13, height: 13 }} />}
                      {formatPercentage(property.priceChangePercent)} (24h)
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 2, backgroundColor: "#f8f9fb", borderRadius: 9, padding: 3 }}>
                    {timeRanges.map(r => <button key={r} onClick={() => setRange(r)} style={{ padding: "4px 9px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, backgroundColor: range === r ? "#fff" : "transparent", color: range === r ? "#0f172a" : "#94a3b8", boxShadow: range === r ? "0 1px 4px rgba(0,0,0,0.1)" : "none" }}>{r}</button>)}
                  </div>
                </div>
                <ChartBox height={220}>
                  {w => (
                    <AreaChart width={w} height={220} data={chartSeries} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                      <defs>
                        <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={chartColor} stopOpacity={0.12} />
                          <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} interval={Math.max(0, Math.ceil(chartSeries.length / 7) - 1)} />
                      <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} width={55} tickFormatter={v => v.toLocaleString()} domain={[(min: number) => Math.floor(min * 0.97), (max: number) => Math.ceil(max * 1.015)]} />
                      <Tooltip contentStyle={{ borderRadius: 9, border: "1px solid #f1f5f9", fontSize: 12 }} formatter={(v: unknown) => [`UGX ${formatCurrency(Number(v))}`, "Price"]} />
                      <Area type="monotone" dataKey="value" stroke={chartColor} strokeWidth={2.5} fill="url(#ag)" dot={false} activeDot={{ r: 5, fill: chartColor, stroke: "#fff", strokeWidth: 2 }} />
                    </AreaChart>
                  )}
                </ChartBox>
              </div>
            ) : (
              <div style={{ backgroundColor: "#fff", borderRadius: 14, padding: "20px 22px", border: "1px solid #e8ecf0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <SparklesIcon style={{ width: 17, height: 17, color: "#0d9488" }} />
                  <h2 style={{ fontSize: 15, fontWeight: 750, color: "#0f172a", margin: 0 }}>Launch Potential</h2>
                  <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 800, color: "#0f766e", backgroundColor: "#f0fdfa", border: "1px solid #ccfbf1", borderRadius: 99, padding: "3px 10px", letterSpacing: "0.05em" }}>PRE-LAUNCH</span>
                </div>
                <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 16px 0", lineHeight: 1.65 }}>
                  Live price history begins the day this property opens for trading. Until then, here&apos;s what the numbers say about its potential:
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(140px, 100%), 1fr))", gap: 10 }}>
                  {[
                    { label: "Planned Share Price", value: `UGX ${formatCurrency(property.pricePerShare)}`, tone: "#0f172a" },
                    { label: "Target Annual Yield", value: `${property.rentalYield}%`, tone: "#0d9488" },
                    { label: "Area Score", value: `${property.areaScore}/100`, tone: "#2563eb" },
                    { label: "Growth Outlook", value: property.futureGrowth, tone: property.futureGrowth === "High" ? "#16a34a" : "#d97706" },
                  ].map(s => (
                    <div key={s.label} style={{ backgroundColor: "#f8fafc", borderRadius: 11, padding: "12px 14px" }}>
                      <p style={{ fontSize: 10.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 4px 0" }}>{s.label}</p>
                      <p style={{ fontSize: 17, fontWeight: 800, color: s.tone, margin: 0, letterSpacing: "-0.3px" }}>{s.value}</p>
                    </div>
                  ))}
                </div>
                {queued && (
                  <div style={{ marginTop: 16, backgroundColor: "#f0fdfa", border: "1px solid #ccfbf1", borderRadius: 12, padding: "13px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#0f766e", display: "inline-flex", alignItems: "center", gap: 5 }}>
                        <UsersOutlineIcon style={{ width: 13, height: 13 }} /> {queued.interest.count} of {property.interestThreshold ?? 100} investors reserved
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 800, color: "#0f766e" }}>{queued.progress}%</span>
                    </div>
                    <div style={{ height: 7, borderRadius: 99, backgroundColor: "rgba(13,148,136,0.15)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${queued.progress}%`, borderRadius: 99, background: "linear-gradient(90deg, #0d9488, #10b981)" }} />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tabs */}
            <div style={{ backgroundColor: "#fff", borderRadius: 14, border: "1px solid #e8ecf0", overflow: "hidden" }}>
              <div style={{ display: "flex", borderBottom: "1px solid #f1f4f8", overflowX: "auto" }}>
                {(isComingSoon ? (["overview","documents","calculator"] as const) : (["overview","documents","calculator","activities","trades"] as const)).map(t => (
                  <button key={t} onClick={() => setTab(t)} style={{ padding: "13px 18px", border: "none", background: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: tab === t ? "#2563eb" : "#64748b", borderBottom: `2px solid ${tab === t ? "#2563eb" : "transparent"}`, whiteSpace: "nowrap", textTransform: "capitalize", transition: "all 0.15s" }}>
                    {t === "activities" ? "Activities" : t === "trades" ? "Trade History" : t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>

              <div style={{ padding: "22px 24px" }}>

                {/* OVERVIEW */}
                {tab === "overview" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    <p style={{ fontSize: 14, lineHeight: 1.75, color: "#475569", margin: 0 }}>
                      <strong style={{ color: "#0f172a" }}>{property.name}</strong> is a premium {property.id.includes("office") ? "commercial complex" : "residential property"} in {property.location}. Fully verified, tenant-occupied, and generating consistent monthly rental income. Investors receive proportional distributions every month.
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
                      {[
                        { label: "Rental Yield",      value: `${property.rentalYield}%`, teal: true },
                        { label: "Area Score",        value: `${property.areaScore}/100` },
                        { label: "Growth Outlook",    value: property.futureGrowth, teal: true },
                        { label: "Occupancy",         value: "98%" },
                        { label: "Total Shares",      value: property.totalShares.toLocaleString() },
                        { label: "Total Value",       value: `UGX ${formatCurrency(property.currentPrice)}` },
                      ].map(r => (
                        <div key={r.label} style={{ backgroundColor: "#f8f9fb", borderRadius: 10, padding: "10px 14px", border: "1px solid #f1f4f8" }}>
                          <p style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px", margin: "0 0 3px 0" }}>{r.label}</p>
                          <p style={{ fontSize: 15, fontWeight: 700, color: (r as {teal?: boolean}).teal ? "#0d9488" : "#0f172a", margin: 0 }}>{r.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* DOCUMENTS */}
                {tab === "documents" && (
                  <div>
                    <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 18px 0", lineHeight: 1.6 }}>Compilation of documents related to this property, including registrations, agreements, and comprehensive reports.</p>
                    <div style={{ display: "flex", backgroundColor: "#f1f4f8", borderRadius: 10, padding: 3, gap: 2, marginBottom: 18 }}>
                      {(["ownership","property","audit"] as const).map(dt => (
                        <button key={dt} onClick={() => setDocTab(dt)} style={{ flex: 1, padding: "8px 0", border: "none", cursor: "pointer", borderRadius: 8, fontSize: 13, fontWeight: 600, backgroundColor: docTab === dt ? "#fff" : "transparent", color: docTab === dt ? "#0f172a" : "#94a3b8", boxShadow: docTab === dt ? "0 1px 4px rgba(0,0,0,0.1)" : "none", textTransform: "capitalize" }}>{dt}</button>
                      ))}
                    </div>
                    {[
                      { icon: DocumentTextIcon, name: "Title Deed — " + property.name + ".pdf", type: "pdf", source: "Uganda Land Registry" },
                      { icon: ChartBarSquareIcon, name: "Independent Valuation Report.pdf", type: "pdf", source: "Knight Frank Uganda" },
                      { icon: LinkIcon, name: "Smart Contract — Share Registry", type: "link", source: "verified.nestfund.io" },
                      { icon: ClipboardDocumentListIcon, name: "Investment Prospectus.pdf", type: "pdf", source: "NestFund Legal" },
                    ].map((doc, i) => (
                      <div key={i} style={{ border: "1.5px solid #f1f4f8", borderRadius: 11, padding: "13px 16px", marginBottom: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: doc.type === "link" ? 12 : 0 }}>
                          <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><doc.icon style={{ width: 19, height: 19, color: "#2563eb" }} /></div>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "0 0 2px 0" }}>{doc.name}</p>
                            <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{doc.source}</p>
                          </div>
                          {doc.type === "pdf" && <button style={{ padding: "5px 14px", borderRadius: 99, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", gap: 4 }}><ArrowTopRightOnSquareIcon style={{ width: 13, height: 13 }} />Open</button>}
                        </div>
                        {doc.type === "link" && (
                          <div style={{ display: "flex", gap: 8 }}>
                            <button style={{ flex: 1, padding: "8px 0", borderRadius: 99, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}><ArrowTopRightOnSquareIcon style={{ width: 13, height: 13 }} />Open</button>
                            <button style={{ flex: 1, padding: "8px 0", borderRadius: 99, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}><ClipboardDocumentIcon style={{ width: 13, height: 13 }} />Copy</button>
                          </div>
                        )}
                      </div>
                    ))}
                    <div style={{ padding: "11px 14px", borderRadius: 10, backgroundColor: "#fffbeb", border: "1px solid #fde68a" }}>
                      <p style={{ fontSize: 12, color: "#92400e", margin: 0 }}>
                        <ShieldCheckIcon style={{ width: 13, height: 13, display: "inline", marginRight: 5, verticalAlign: "middle" }} />
                        All documents independently verified by our legal team and Capital Markets Authority of Uganda.
                      </p>
                    </div>
                  </div>
                )}

                {/* CALCULATOR */}
                {tab === "calculator" && (
                  <div style={{ maxWidth: 480 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", textAlign: "center", margin: "0 0 4px 0" }}>Investment Calculator</h3>
                    <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", margin: "0 0 20px 0" }}>Initial investment</p>
                    <div style={{ border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "14px 18px", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>UGX {investment.toLocaleString()}</span>
                      <PencilSquareIcon style={{ width: 19, height: 19, color: "#94a3b8" }} />
                    </div>
                    <input type="range" min={50000} max={10000000} step={50000} value={investment} onChange={e => setInvestment(Number(e.target.value))} style={{ width: "100%", accentColor: "#0d9488", marginBottom: 20, cursor: "pointer" }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 0, border: "1px solid #f1f4f8", borderRadius: 12, overflow: "hidden", marginBottom: 14 }}>
                      {[
                        { label: "Actual investment amount",   value: `UGX ${Math.floor(investment / property.pricePerShare) * property.pricePerShare === 0 ? 0 : (Math.floor(investment / property.pricePerShare) * property.pricePerShare).toLocaleString()}` },
                        { label: "Shares you will get",        value: calcShares.toLocaleString() },
                        { label: "Average share price",        value: `UGX ${formatCurrency(property.pricePerShare)}` },
                        { label: "Monthly rental income",      value: `UGX ${formatCurrency(calcMonthly)}`, teal: true },
                        { label: "Annual rental income",       value: `UGX ${formatCurrency(calcAnnual)}`, teal: true },
                        { label: "Annual percentage rate",     value: `${property.rentalYield}%`, teal: true },
                      ].map((r, i) => (
                        <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 16px", borderTop: i === 0 ? "none" : "1px solid #f8f9fb", backgroundColor: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                          <span style={{ fontSize: 13, color: "#64748b" }}>{r.label}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: (r as {teal?: boolean}).teal ? "#0d9488" : "#0f172a" }}>{r.value}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ backgroundColor: "#f0fdfa", border: "1.5px solid #99f6e4", borderRadius: 12, padding: "16px 20px", textAlign: "center" }}>
                      <p style={{ fontSize: 12, color: "#0d9488", fontWeight: 600, margin: "0 0 4px 0" }}>Projected annual return</p>
                      <p style={{ fontSize: 26, fontWeight: 900, color: "#0d9488", margin: 0, letterSpacing: "-0.5px" }}>UGX {formatCurrency(investment + calcAnnual)}</p>
                    </div>
                  </div>
                )}

                {/* ACTIVITIES */}
                {tab === "activities" && (
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 4px 0" }}>Property Activities</h3>
                    <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 24px 0" }}>All events and changes related to this property, including rental payments and updates.</p>
                    {extra.activityFeed.map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: 14, paddingBottom: 28, position: "relative" }}>
                        {/* Timeline icon */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                          <div style={{ width: 38, height: 38, borderRadius: "50%", backgroundColor: item.icon === "payment" ? "#f0fdf4" : "#eff6ff", border: `1.5px solid ${item.icon === "payment" ? "#bbf7d0" : "#bfdbfe"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {item.icon === "payment" ? (
                              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                            ) : (
                              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                            )}
                          </div>
                          {i < extra.activityFeed.length - 1 && <div style={{ width: 1, flex: 1, borderLeft: "1.5px dashed #e2e8f0", marginTop: 8 }} />}
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, paddingBottom: 4 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                            <h4 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: 0, lineHeight: 1.4 }}>{item.title}</h4>
                            <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500, flexShrink: 0, marginLeft: 16 }}>{item.date}</span>
                          </div>
                          <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 12px 0", lineHeight: 1.65 }}>{item.desc}</p>

                          {/* Photos */}
                          {item.photos && item.photos.length > 0 && (
                            <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                              {item.photos.map((p, pi) => (
                                <div key={pi} style={{ width: 88, height: 66, borderRadius: 9, overflow: "hidden", border: "1px solid #f1f4f8" }}>
                                  <img src={p} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>
                              ))}
                              {item.extra && (
                                <div style={{ width: 88, height: 66, borderRadius: 9, backgroundColor: "#f1f4f8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#64748b", border: "1px solid #e2e8f0" }}>
                                  {item.extra}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Attachment / source link */}
                          {item.attachment && (
                            <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 99, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#374151" }}>
                              <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                              {item.attachment}
                            </button>
                          )}

                          {/* Source link — always shown */}
                          <div style={{ marginTop: item.attachment ? 8 : 0 }}>
                            <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "#2563eb", textDecoration: "none", fontWeight: 500 }}>
                              <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                              View source report
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* TRADE HISTORY */}
                {tab === "trades" && (
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 4px 0" }}>Trade History</h3>
                    <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 18px 0" }}>Recent share transactions for this property.</p>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ borderBottom: "1.5px solid #f1f4f8" }}>
                            {["Transaction", "Date", "Shares", "Share Price", "Volume", "Status"].map(h => (
                              <th key={h} style={{ padding: "10px 14px", textAlign: h === "Transaction" ? "left" : "right", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.4px", whiteSpace: "nowrap" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {extra.tradeHistory.map((t, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid #f8f9fb" }}>
                              <td style={{ padding: "12px 14px" }}><span style={{ fontSize: 12, color: "#2563eb", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>{t.hash}<ArrowTopRightOnSquareIcon style={{ width: 12, height: 12 }} /></span></td>
                              <td style={{ padding: "12px 14px", textAlign: "right" }}><p style={{ fontSize: 12, color: "#374151", fontWeight: 600, margin: 0 }}>{t.date}</p><p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{t.time}</p></td>
                              <td style={{ padding: "12px 14px", textAlign: "right", fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{t.shares} {t.shares === 1 ? "Share" : "Shares"}</td>
                              <td style={{ padding: "12px 14px", textAlign: "right", fontSize: 13, color: "#374151" }}>UGX {formatCurrency(t.price)}</td>
                              <td style={{ padding: "12px 14px", textAlign: "right", fontSize: 13, fontWeight: 600, color: "#0f172a" }}>UGX {formatCurrency(t.volume)}</td>
                              <td style={{ padding: "12px 14px", textAlign: "right" }}><span style={{ fontSize: 11, fontWeight: 700, color: "#0d9488", backgroundColor: "#f0fdfa", border: "1px solid #99f6e4", padding: "3px 10px", borderRadius: 99 }}>{t.status}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* ── RIGHT — Buy Widget (live) / Reserve Widget (coming soon) ── */}
          <div className="buy-widget-col" style={{ minWidth: 0 }} ref={widgetRef}>
            <div className="buy-widget-sticky">
            {isComingSoon ? (
              <div style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
                {/* Header */}
                <div style={{ position: "relative", overflow: "hidden", padding: "16px 20px" }}>
                  <img src={property.image} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(4,47,46,0.94) 0%, rgba(15,118,110,0.88) 55%, rgba(13,148,136,0.78) 100%)" }} />
                  <div style={{ position: "relative" }}>
                    <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px 0" }}>Planned Share Price</p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <p style={{ fontSize: 24, fontWeight: 900, color: "#fff", margin: 0, letterSpacing: "-0.4px" }}>UGX {formatCurrency(property.pricePerShare)}</p>
                      <span style={{ fontSize: 10, fontWeight: 800, color: "#fff", backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 99, padding: "3px 10px", letterSpacing: "0.05em" }}>COMING SOON</span>
                    </div>
                  </div>
                </div>

                <div style={{ padding: "18px 20px" }}>
                  {/* Interest progress */}
                  {queued && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Reserved investors</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#0f172a" }}>{queued.interest.count} of {property.interestThreshold ?? 100}</span>
                      </div>
                      <div style={{ height: 6, borderRadius: 99, backgroundColor: "#f1f5f9", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${queued.progress}%`, borderRadius: 99, background: "linear-gradient(90deg, #0d9488, #10b981)" }} />
                      </div>
                      <p style={{ fontSize: 11, color: "#94a3b8", margin: "4px 0 0 0" }}>
                        UGX {(queued.interest.amount / 1e6).toFixed(1)}M in reserved interest — opens at {property.interestThreshold ?? 100} investors
                      </p>
                    </div>
                  )}

                  {/* What happens next */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
                    {[
                      "Reserve free — no payment now",
                      "First access to shares at launch",
                      "We email you the moment it opens",
                    ].map(line => (
                      <div key={line} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <CheckBadgeIcon style={{ width: 15, height: 15, color: "#0d9488", flexShrink: 0 }} />
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: "#374151" }}>{line}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowReserve(true)}
                    style={{ width: "100%", padding: "13px 0", borderRadius: 11, background: "linear-gradient(135deg, #0d9488, #0f766e)", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(13,148,136,0.3)", marginBottom: 9 }}
                  >
                    Reserve Priority Access
                  </button>
                  <Link href="/coming-soon" style={{ display: "block", textAlign: "center", width: "100%", padding: "10px 0", borderRadius: 11, border: "1.5px solid #e2e8f0", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, textDecoration: "none", boxSizing: "border-box", marginBottom: 14 }}>
                    View the Launch Queue
                  </Link>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "center" }}>
                    <ShieldCheckIcon style={{ width: 13, height: 13, color: "#16a34a" }} />
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>Non-binding · No payment · Verified before launch</p>
                  </div>
                </div>
              </div>
            ) : (
            <div style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
              <div style={{ position: "relative", overflow: "hidden", padding: "16px 20px" }}>
                {/* Property photo behind a deep blue overlay */}
                <img src={property.image} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(15,32,84,0.94) 0%, rgba(30,58,138,0.88) 55%, rgba(37,99,235,0.78) 100%)" }} />
                <div style={{ position: "relative" }}>
                  <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.65)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px 0" }}>Share Price</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ fontSize: 24, fontWeight: 900, color: "#fff", margin: 0, letterSpacing: "-0.4px" }}>UGX {formatCurrency(property.pricePerShare)}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: isPositive ? "#6ee7b7" : "#fca5a5" }}>
                      {isPositive ? <ArrowTrendingUpIcon style={{ width: 14, height: 14 }} /> : <ArrowTrendingDownIcon style={{ width: 14, height: 14 }} />}
                      {formatPercentage(property.priceChangePercent)}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ padding: "18px 20px" }}>
                {/* Shares sold bar */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Shares sold</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#0f172a" }}>{soldPct}% of {property.totalShares.toLocaleString()}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 99, backgroundColor: "#f1f5f9", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${soldPct}%`, borderRadius: 99, background: "linear-gradient(90deg, #2563eb, #4f46e5)" }} />
                  </div>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: "4px 0 0 0" }}>{property.availableShares.toLocaleString()} shares remaining</p>
                </div>

                {/* Shares input */}
                <div style={{ marginBottom: 12 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 7 }}>Number of Shares</label>
                  <div style={{ display: "flex", gap: 7 }}>
                    <button onClick={() => setShares(Math.max(1, shares - 10))} style={{ width: 36, height: 42, borderRadius: 9, border: "1.5px solid #e2e8f0", background: "#f8fafc", fontSize: 16, cursor: "pointer", color: "#374151" }}>−</button>
                    <input type="number" value={shares} onChange={e => setShares(Math.max(1, parseInt(e.target.value) || 1))} style={{ flex: 1, height: 42, borderRadius: 9, border: "1.5px solid #e2e8f0", textAlign: "center", fontSize: 16, fontWeight: 700, color: "#0f172a", outline: "none" }} />
                    <button onClick={() => setShares(Math.min(property.availableShares, shares + 10))} style={{ width: 36, height: 42, borderRadius: 9, border: "1.5px solid #bfdbfe", background: "#eff6ff", fontSize: 16, cursor: "pointer", color: "#2563eb" }}>+</button>
                  </div>
                </div>

                {/* Quick presets */}
                <div style={{ display: "flex", gap: 5, marginBottom: 14, flexWrap: "wrap" }}>
                  {[50, 100, 250, 500].map(n => <button key={n} onClick={() => setShares(n)} style={{ padding: "4px 11px", borderRadius: 8, border: `1.5px solid ${shares === n ? "#2563eb" : "#e2e8f0"}`, backgroundColor: shares === n ? "#eff6ff" : "#f8fafc", color: shares === n ? "#2563eb" : "#64748b", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{n}</button>)}
                </div>

                {/* Cost summary */}
                <div style={{ backgroundColor: "#f8fafc", borderRadius: 11, padding: "12px 14px", marginBottom: 12 }}>
                  {[
                    { label: "Price per share",  val: `UGX ${formatCurrency(property.pricePerShare)}` },
                    { label: "Total cost",        val: `UGX ${formatCurrency(totalCost)}`, bold: true },
                  ].map(r => (
                    <div key={r.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                      <span style={{ fontSize: 12, color: "#64748b" }}>{r.label}</span>
                      <span style={{ fontSize: r.bold ? 15 : 12, fontWeight: r.bold ? 800 : 600, color: "#0f172a" }}>{r.val}</span>
                    </div>
                  ))}
                </div>

                {/* Income estimate */}
                <div style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "1.5px solid #bbf7d0", borderRadius: 11, padding: "10px 14px", marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#16a34a", margin: "0 0 2px 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>Est. Monthly Income</p>
                    <p style={{ fontSize: 10, color: "#4ade80", margin: 0 }}>Based on {property.rentalYield}% APR</p>
                  </div>
                  <p style={{ fontSize: 18, fontWeight: 800, color: "#15803d", margin: 0 }}>UGX {formatCurrency(monthlyIncome)}</p>
                </div>

                {buyState.phase === "done" ? (
                  <div style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "1.5px solid #86efac", borderRadius: 11, padding: "13px 14px", marginBottom: 9, animation: "fade-up 0.3s ease-out" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                      <CheckBadgeIcon style={{ width: 17, height: 17, color: "#16a34a", flexShrink: 0 }} />
                      <p style={{ fontSize: 13, fontWeight: 800, color: "#15803d", margin: 0 }}>Purchase complete</p>
                    </div>
                    <p style={{ fontSize: 12, color: "#166534", margin: "0 0 10px 0", lineHeight: 1.55 }}>{buyState.message}</p>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Link href="/portfolio" style={{ flex: 1, textAlign: "center", padding: "9px 0", borderRadius: 9, background: "#16a34a", color: "#fff", fontSize: 12.5, fontWeight: 700, textDecoration: "none" }}>View Portfolio</Link>
                      <button onClick={() => setBuyState({ phase: "idle" })} style={{ flex: 1, padding: "9px 0", borderRadius: 9, border: "1.5px solid #bbf7d0", background: "#fff", color: "#15803d", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>Buy More</button>
                    </div>
                  </div>
                ) : (
                  <>
                    {buyState.error && (
                      <p style={{ fontSize: 12, fontWeight: 600, color: "#b45309", backgroundColor: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "9px 12px", margin: "0 0 10px 0", lineHeight: 1.55 }}>
                        {buyState.error}{buyState.error.includes("Wallet") && <>{" "}<Link href="/wallet" style={{ color: "#b45309", fontWeight: 800 }}>Open Wallet</Link></>}
                      </p>
                    )}
                    <button onClick={handleBuy} disabled={buyState.phase === "busy"}
                      style={{ width: "100%", padding: "13px 0", borderRadius: 11, background: buyState.phase === "busy" ? "#93c5fd" : "linear-gradient(135deg, #2563eb, #4f46e5)", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: buyState.phase === "busy" ? "wait" : "pointer", boxShadow: "0 4px 14px rgba(37,99,235,0.3)", marginBottom: 9 }}>
                      {buyState.phase === "busy" ? "Processing..." : user ? `Buy ${shares} Shares` : `Sign In to Buy ${shares} Shares`}
                    </button>
                    <button style={{ width: "100%", padding: "10px 0", borderRadius: 11, border: "1.5px solid #e2e8f0", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 14 }}>
                      Preview Order
                    </button>
                  </>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "center" }}>
                  <ShieldCheckIcon style={{ width: 13, height: 13, color: "#16a34a" }} />
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>Regulated · Secure · Verified</p>
                </div>
              </div>
            </div>
            )}
            </div>
          </div>

        </div>

        {/* Sticky mini buy-bar (mobile) — appears after scrolling past the widget */}
        <StickyBuyBar
          targetRef={widgetRef}
          price={`UGX ${property.pricePerShare.toLocaleString()}`}
          sub={isComingSoon ? "per share · planned" : "per share"}
          cta={isComingSoon ? "Reserve Access" : "Buy Shares"}
          tone={isComingSoon ? "teal" : "blue"}
          onClick={() => {
            if (isComingSoon) setShowReserve(true)
            else widgetRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
          }}
        />

        {/* Reserve modal (coming soon) */}
        {showReserve && queued && (
          <ReserveModal
            property={queued}
            onClose={() => setShowReserve(false)}
            onReserved={() => {}}
          />
        )}

        {/* ── Recommended properties ── */}
        {recommendations.length > 0 && (
          <div style={{ marginTop: 36 }}>
            <div style={{ marginBottom: 18 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 5px 0" }}>You may also like</p>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.4px", margin: 0 }}>Recommended Properties</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))", gap: 18 }}>
              {recommendations.map(r => (
                <Link key={r.id} href={`/property/${r.id}`} style={{ textDecoration: "none" }}>
                  <div
                    style={{ backgroundColor: "#fff", borderRadius: 14, border: "1px solid #e8ecf0", overflow: "hidden", transition: "box-shadow 0.2s, transform 0.2s", cursor: "pointer" }}
                    onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "0 8px 24px rgba(15,23,42,0.1)"; el.style.transform = "translateY(-3px)" }}
                    onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "none"; el.style.transform = "translateY(0)" }}
                  >
                    <div style={{ position: "relative", height: 150, overflow: "hidden" }}>
                      <img src={r.image} alt={r.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <span style={{ position: "absolute", top: 10, left: 10, fontSize: 10, fontWeight: 700, color: "#0d9488", backgroundColor: "rgba(255,255,255,0.94)", padding: "3px 10px", borderRadius: 99 }}>{r.type}</span>
                    </div>
                    <div style={{ padding: "13px 15px 15px" }}>
                      <p style={{ fontSize: 14.5, fontWeight: 700, color: "#0f172a", margin: "0 0 2px 0" }}>{r.name}</p>
                      <p style={{ fontSize: 11.5, color: "#94a3b8", margin: "0 0 10px 0" }}>{r.location}</p>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>UGX {r.pricePerShare.toLocaleString()}<span style={{ fontSize: 11, fontWeight: 500, color: "#94a3b8" }}>/share</span></span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#0d9488" }}>{r.rentalYield}% yield</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
