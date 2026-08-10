"use client"

import Link from "next/link"
import { ChevronRightIcon, MapPinIcon } from "@heroicons/react/24/outline"
import { useIntelligence } from "@/lib/hooks"
import { type IntelType } from "@/lib/data/intelligence"

const typeMeta: Record<IntelType, { label: string; color: string }> = {
  approval:    { label: "Government Approval", color: "#2563eb" },
  development: { label: "Development",         color: "#0d9488" },
  decline:     { label: "Risk Alert",          color: "#dc2626" },
}

export default function MarketIntelligenceSection() {
  const { items } = useIntelligence()
  const top = items.slice(0, 3)

  return (
    <section style={{ backgroundColor: "#f8fafc", padding: "72px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 14, flexWrap: "wrap", marginBottom: 36 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
              Market Intelligence
            </p>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", margin: "0 0 8px 0" }}>
              What&apos;s Moving the Market
            </h2>
            <p style={{ fontSize: 16, color: "#64748b", margin: 0 }}>
              Real-time events affecting property values across the region
            </p>
          </div>
          <Link
            href="/intelligence"
            style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 14, fontWeight: 600, color: "#2563eb", textDecoration: "none" }}
          >
            View All Updates
            <ChevronRightIcon style={{ width: 16, height: 16 }} />
          </Link>
        </div>

        {/* 3-across news cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))", gap: 20 }}>
          {top.map(item => {
            const meta = typeMeta[item.type]
            const positive = item.change >= 0
            return (
              <Link key={item.id} href={`/intelligence/${item.id}`} style={{ textDecoration: "none" }}>
                <article
                  style={{
                    backgroundColor: "#fff", borderRadius: 16, overflow: "hidden",
                    border: "1px solid #eef1f5", height: "100%", boxSizing: "border-box",
                    display: "flex", flexDirection: "column",
                    transition: "box-shadow 0.2s, transform 0.2s", cursor: "pointer",
                  }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "0 12px 32px rgba(15,23,42,0.1)"; el.style.transform = "translateY(-4px)" }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = "none"; el.style.transform = "translateY(0)" }}
                >
                  {/* Cover image */}
                  <div style={{ position: "relative", height: 170, flexShrink: 0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.image} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", backgroundColor: "#f1f5f9" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,17,32,0.45) 0%, transparent 50%)" }} />
                    <span style={{ position: "absolute", top: 12, left: 12, fontSize: 10, fontWeight: 800, color: meta.color, backgroundColor: "rgba(255,255,255,0.95)", padding: "4px 11px", borderRadius: 99, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {meta.label}
                    </span>
                    <span style={{
                      position: "absolute", top: 12, right: 12, fontSize: 12, fontWeight: 800, color: "#fff",
                      backgroundColor: positive ? "rgba(16,185,129,0.92)" : "rgba(239,68,68,0.92)",
                      padding: "4px 11px", borderRadius: 99,
                    }}>
                      {positive ? "+" : ""}{item.change}%
                    </span>
                  </div>

                  {/* Body */}
                  <div style={{ padding: "16px 18px 18px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <h3 style={{ fontSize: 16.5, fontWeight: 750, color: "#0f172a", margin: "0 0 7px 0", lineHeight: 1.35 }}>{item.title}</h3>
                    <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 12px 0", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {item.desc}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "#94a3b8" }}>
                        <MapPinIcon style={{ width: 12, height: 12 }} /> {item.location} · {item.timeAgo}
                      </span>
                      <span style={{ fontSize: 12.5, fontWeight: 750, color: "#2563eb" }}>Read →</span>
                    </div>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
