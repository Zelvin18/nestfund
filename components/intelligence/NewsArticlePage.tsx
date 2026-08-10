"use client"

import Link from "next/link"
import { ArrowLeftIcon, MapPinIcon, ArrowTopRightOnSquareIcon, ClockIcon } from "@heroicons/react/24/outline"
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, CheckBadgeIcon } from "@heroicons/react/24/solid"
import { useIntelligence, useRentals, useConstruction } from "@/lib/hooks"
import { type IntelType } from "@/lib/data/intelligence"

const typeMeta: Record<IntelType, { label: string; color: string; bg: string }> = {
  approval:    { label: "Government Approval", color: "#2563eb", bg: "#eff6ff" },
  development: { label: "Development",         color: "#0d9488", bg: "#f0fdfa" },
  decline:     { label: "Risk Alert",          color: "#dc2626", bg: "#fef2f2" },
}

export default function NewsArticlePage({ id }: { id: string }) {
  const { items } = useIntelligence()
  const { rentals } = useRentals()
  const { projects } = useConstruction()

  const item = items.find(i => i.id === id)

  if (!item) return (
    <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
      <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>Story not found — it may have been removed.</p>
      <Link href="/intelligence" style={{ fontSize: 13, fontWeight: 700, color: "#2563eb", textDecoration: "none" }}>← Back to Market Intelligence</Link>
    </div>
  )

  const meta = typeMeta[item.type]
  const positive = item.change >= 0

  const affected = item.affectedPropertyIds
    .map(pid => {
      const r = rentals.find(p => p.id === pid)
      if (r) return { id: pid, name: r.name, location: r.location, image: r.image, sub: `UGX ${r.pricePerShare.toLocaleString()}/share · ${r.rentalYield}% yield`, href: `/property/${pid}` }
      const c = projects.find(p => p.id === pid)
      if (c) return { id: pid, name: c.name, location: c.location, image: c.image, sub: `Construction · ${c.projectedROI}% projected ROI`, href: `/construction/${pid}` }
      return null
    })
    .filter((p): p is NonNullable<typeof p> => p !== null)

  const related = items.filter(i => i.id !== item.id && i.type === item.type).slice(0, 3)
  const moreNews = related.length ? related : items.filter(i => i.id !== item.id).slice(0, 3)

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      {/* Breadcrumb */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #f1f5f9" }}>
        <div className="container" style={{ maxWidth: 860, margin: "0 auto", padding: "14px 24px" }}>
          <Link href="/intelligence" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#64748b", textDecoration: "none" }}>
            <ArrowLeftIcon style={{ width: 14, height: 14 }} />
            Market Intelligence
          </Link>
        </div>
      </div>

      <article className="container" style={{ maxWidth: 860, margin: "0 auto", padding: "30px 24px 64px" }}>
        {/* Kicker */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: meta.color, backgroundColor: meta.bg, padding: "5px 14px", borderRadius: 99, textTransform: "uppercase", letterSpacing: "0.06em" }}>{meta.label}</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "#94a3b8" }}>
            <ClockIcon style={{ width: 13, height: 13 }} /> {item.timeAgo}
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, color: "#94a3b8" }}>
            <MapPinIcon style={{ width: 13, height: 13 }} /> {item.location}
          </span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: "clamp(26px, 4.5vw, 40px)", fontWeight: 850, color: "#0f172a", letterSpacing: "-0.8px", lineHeight: 1.2, margin: "0 0 18px 0" }}>
          {item.title}
        </h1>

        {/* Byline */}
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 26, paddingBottom: 22, borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <CheckBadgeIcon style={{ width: 18, height: 18, color: "#2563eb" }} />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: 0 }}>NestFund Intelligence Desk</p>
            <p style={{ fontSize: 11.5, color: "#94a3b8", margin: 0 }}>Source: {item.sourceLabel}</p>
          </div>
        </div>

        {/* Hero image */}
        <div style={{ borderRadius: 18, overflow: "hidden", marginBottom: 28, maxHeight: 420 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>

        {/* Body */}
        <div style={{ maxWidth: 700 }}>
          <p style={{ fontSize: 17, color: "#334155", lineHeight: 1.85, margin: "0 0 22px 0" }}>{item.desc}</p>

          {/* Impact box */}
          <div style={{
            display: "flex", alignItems: "center", gap: 14, borderRadius: 14, padding: "18px 22px", marginBottom: 28,
            backgroundColor: positive ? "#f0fdf4" : "#fef2f2",
            border: `1.5px solid ${positive ? "#bbf7d0" : "#fecaca"}`,
          }}>
            {positive
              ? <ArrowTrendingUpIcon style={{ width: 26, height: 26, color: "#16a34a", flexShrink: 0 }} />
              : <ArrowTrendingDownIcon style={{ width: 26, height: 26, color: "#dc2626", flexShrink: 0 }} />}
            <div>
              <p style={{ fontSize: 19, fontWeight: 850, color: positive ? "#166534" : "#991b1b", margin: "0 0 2px 0" }}>
                {positive ? "+" : ""}{item.change}% expected impact
              </p>
              <p style={{ fontSize: 13, color: positive ? "#15803d" : "#b91c1c", margin: 0 }}>
                on nearby property values · {item.affectedProps} properties in the affected zone
              </p>
            </div>
          </div>

          {/* Affected listed properties */}
          {affected.length > 0 && (
            <div style={{ marginBottom: 30 }}>
              <h2 style={{ fontSize: 19, fontWeight: 800, color: "#0f172a", margin: "0 0 4px 0", letterSpacing: "-0.3px" }}>
                Listed properties affected
              </h2>
              <p style={{ fontSize: 13.5, color: "#64748b", margin: "0 0 14px 0", lineHeight: 1.6 }}>
                These NestFund listings sit in the affected area — review them before making investment decisions.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {affected.map(p => (
                  <Link key={p.id} href={p.href} style={{ textDecoration: "none" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 14, border: "1.5px solid #eef1f5", borderRadius: 14, padding: 12, transition: "border-color 0.15s, box-shadow 0.15s", cursor: "pointer" }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "#bfdbfe"; el.style.boxShadow = "0 4px 16px rgba(37,99,235,0.08)" }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = "#eef1f5"; el.style.boxShadow = "none" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.image} alt={p.name} style={{ width: 84, height: 62, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 15, fontWeight: 750, color: "#0f172a", margin: "0 0 2px 0" }}>{p.name}</p>
                        <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 3px 0" }}>{p.location}</p>
                        <p style={{ fontSize: 12, fontWeight: 650, color: "#0d9488", margin: 0 }}>{p.sub}</p>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 750, color: "#2563eb", flexShrink: 0 }}>View →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Source box */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, backgroundColor: "#f8fafc", border: "1px solid #eef1f5", borderRadius: 12, padding: "14px 18px", marginBottom: 8 }}>
            <div>
              <p style={{ fontSize: 10.5, fontWeight: 750, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 3px 0" }}>Source</p>
              <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", margin: 0 }}>{item.sourceLabel}</p>
            </div>
            {item.sourceUrl && item.sourceUrl !== "#" && (
              <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 700, color: "#2563eb", textDecoration: "none", flexShrink: 0 }}>
                Visit source <ArrowTopRightOnSquareIcon style={{ width: 13, height: 13 }} />
              </a>
            )}
          </div>
          <p style={{ fontSize: 11.5, color: "#b6c1cf", margin: 0, lineHeight: 1.6 }}>
            NestFund Intelligence provides market context, not investment advice. Impact estimates are analytical projections.
          </p>
        </div>

        {/* Related news */}
        {moreNews.length > 0 && (
          <div style={{ marginTop: 44, paddingTop: 30, borderTop: "1px solid #f1f5f9" }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 16px 0", letterSpacing: "-0.3px" }}>More market intelligence</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(240px, 100%), 1fr))", gap: 16 }}>
              {moreNews.map(n => (
                <Link key={n.id} href={`/intelligence/${n.id}`} style={{ textDecoration: "none" }}>
                  <div style={{ borderRadius: 14, overflow: "hidden", border: "1px solid #eef1f5", transition: "box-shadow 0.2s", cursor: "pointer" }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 20px rgba(15,23,42,0.08)"}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.boxShadow = "none"}>
                    <div style={{ height: 110, overflow: "hidden" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={n.image} alt={n.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ padding: "11px 13px 13px" }}>
                      <span style={{ fontSize: 9, fontWeight: 800, color: typeMeta[n.type].color, textTransform: "uppercase", letterSpacing: "0.05em" }}>{n.category}</span>
                      <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", margin: "4px 0 4px 0", lineHeight: 1.4 }}>{n.title}</p>
                      <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{n.timeAgo}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
