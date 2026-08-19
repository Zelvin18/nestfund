"use client"

import Link from "next/link"
import { ArrowRightIcon, ClockIcon } from "@heroicons/react/24/outline"
import {
  categoryMeta, fundingProgress, displayStatus, returnLabel,
  type Opportunity,
} from "@/lib/data/opportunities"

const riskColor: Record<string, { color: string; bg: string }> = {
  Lower:    { color: "#16a34a", bg: "#f0fdf4" },
  Moderate: { color: "#d97706", bg: "#fffbeb" },
  Higher:   { color: "#dc2626", bg: "#fef2f2" },
}

const fmtUGX = (n: number) =>
  n >= 1_000_000_000 ? `UGX ${(n / 1_000_000_000).toFixed(1)}B`
  : n >= 1_000_000 ? `UGX ${Math.round(n / 1_000_000)}M`
  : `UGX ${n.toLocaleString()}`

/** Consistent marketplace card — the most important info at a glance */
export default function OpportunityCard({ opportunity: o }: { opportunity: Opportunity }) {
  const cat = categoryMeta(o.category)
  const progress = fundingProgress(o)
  const status = displayStatus(o)
  const risk = riskColor[o.riskLevel]
  const href = o.href ?? `/opportunity/${o.id}`

  return (
    <Link href={href} style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <div
        style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", overflow: "hidden", height: "100%", display: "flex", flexDirection: "column", transition: "box-shadow 0.2s, transform 0.2s", cursor: "pointer" }}
        onMouseEnter={e => { const el = e.currentTarget; el.style.boxShadow = `0 10px 30px ${cat.accent}22`; el.style.transform = "translateY(-3px)" }}
        onMouseLeave={e => { const el = e.currentTarget; el.style.boxShadow = "none"; el.style.transform = "translateY(0)" }}
      >
        {/* Image + chips */}
        <div style={{ position: "relative", height: 150, overflow: "hidden", flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={o.image} alt={o.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)" }} />
          <span style={{ position: "absolute", top: 10, left: 10, fontSize: 10, fontWeight: 800, color: "#fff", backgroundColor: cat.accent, padding: "3px 10px", borderRadius: 99, letterSpacing: "0.04em", textTransform: "uppercase" }}>
            {cat.label}
          </span>
          {status !== "Open" && (
            <span style={{ position: "absolute", top: 10, right: 10, fontSize: 10, fontWeight: 800, color: "#0f172a", backgroundColor: "rgba(255,255,255,0.92)", padding: "3px 10px", borderRadius: 99, letterSpacing: "0.03em" }}>
              {status}
            </span>
          )}
        </div>

        <div style={{ padding: "14px 16px 16px", display: "flex", flexDirection: "column", flex: 1 }}>
          {/* Title + subcategory */}
          <p style={{ fontSize: 11, fontWeight: 700, color: cat.accent, margin: "0 0 3px 0" }}>{o.subcategory}</p>
          <h3 style={{ fontSize: 15.5, fontWeight: 750, color: "#0f172a", margin: "0 0 3px 0", letterSpacing: "-0.2px", lineHeight: 1.3 }}>{o.title}</h3>
          <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 12px 0" }}>{o.location}</p>

          {/* Funding progress */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>{fmtUGX(o.fundingReceived)} raised</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: "#0f172a" }}>{progress}%</span>
            </div>
            <div style={{ height: 6, borderRadius: 99, backgroundColor: "#f1f5f9", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${progress}%`, borderRadius: 99, backgroundColor: cat.accent }} />
            </div>
            <p style={{ fontSize: 10.5, color: "#94a3b8", margin: "3px 0 0 0" }}>of {fmtUGX(o.fundingRequired)} required</p>
          </div>

          {/* Stat row */}
          <div style={{ display: "flex", gap: 8, marginTop: "auto", marginBottom: 12 }}>
            <div style={{ flex: 1, backgroundColor: "#f8fafc", borderRadius: 9, padding: "7px 10px" }}>
              <p style={{ fontSize: 9.5, color: "#94a3b8", fontWeight: 600, margin: "0 0 1px 0", textTransform: "uppercase", letterSpacing: "0.04em" }}>Target return</p>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", margin: 0, whiteSpace: "nowrap" }}>{returnLabel(o)}</p>
            </div>
            <div style={{ flex: 1, backgroundColor: "#f8fafc", borderRadius: 9, padding: "7px 10px" }}>
              <p style={{ fontSize: 9.5, color: "#94a3b8", fontWeight: 600, margin: "0 0 1px 0", textTransform: "uppercase", letterSpacing: "0.04em" }}>Duration</p>
              <p style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: 3, whiteSpace: "nowrap" }}>
                <ClockIcon style={{ width: 12, height: 12, color: "#94a3b8", flexShrink: 0 }} />{o.durationLabel}
              </p>
            </div>
          </div>

          {/* Footer: risk + min + CTA */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, color: risk.color, backgroundColor: risk.bg, padding: "3px 9px", borderRadius: 99, whiteSpace: "nowrap" }}>{o.riskLevel} risk</span>
              <span style={{ fontSize: 10.5, color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Min {fmtUGX(o.minInvestment)}</span>
            </div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12.5, fontWeight: 750, color: cat.accent, whiteSpace: "nowrap" }}>
              View Details<ArrowRightIcon style={{ width: 13, height: 13 }} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
