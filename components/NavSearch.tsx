"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { MagnifyingGlassIcon, ArrowRightIcon } from "@heroicons/react/24/outline"
import { useOpportunities } from "@/lib/hooks"
import { categoryMeta, returnLabel } from "@/lib/data/opportunities"

/**
 * Live marketplace search — results come from the same opportunity
 * feed the marketplace uses (database rows when connected, with the
 * built-in records as fallback). Enter opens the full filtered
 * marketplace; clicking a result opens it directly.
 */
export default function NavSearch({ compact = false }: { compact?: boolean }) {
  const router = useRouter()
  const { opportunities } = useOpportunities()
  const [query, setQuery] = useState("")
  const [focused, setFocused] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!focused) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setFocused(false)
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [focused])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) return []
    return opportunities
      .filter(o => [o.title, o.subcategory, o.location, o.category, o.description]
        .some(s => s.toLowerCase().includes(q)))
      .slice(0, 6)
  }, [opportunities, query])

  const goToMarketplace = () => {
    if (!query.trim()) return
    setFocused(false)
    router.push(`/opportunities?q=${encodeURIComponent(query.trim())}`)
  }

  const open = focused && query.trim().length >= 2

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <MagnifyingGlassIcon style={{
        position: "absolute", left: 12, top: "50%",
        transform: "translateY(-50%)", width: 16, height: 16, color: "#9ca3af", pointerEvents: "none",
      }} />
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onKeyDown={e => { if (e.key === "Enter") goToMarketplace(); if (e.key === "Escape") setFocused(false) }}
        placeholder="Search opportunities, locations..."
        style={{
          width: "100%", boxSizing: "border-box", height: compact ? 42 : 38, paddingLeft: 38, paddingRight: 16,
          fontSize: 13, border: "1.5px solid #e5e7eb", borderRadius: compact ? 10 : 9,
          backgroundColor: "#f9fafb", color: "#111827", outline: "none",
        }}
      />

      {open && (
        <div style={{ position: "absolute", left: 0, right: 0, top: compact ? 48 : 44, backgroundColor: "#fff", borderRadius: 14, border: "1px solid #e8ecf0", boxShadow: "0 20px 56px rgba(15,23,42,0.16)", overflow: "hidden", zIndex: 60, animation: "fade-up 0.15s ease-out", minWidth: 300 }}>
          {results.length === 0 ? (
            <div style={{ padding: "20px 18px", textAlign: "center" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "0 0 2px 0" }}>No matches for &ldquo;{query.trim()}&rdquo;</p>
              <p style={{ fontSize: 11.5, color: "#94a3b8", margin: 0 }}>Try &ldquo;truck&rdquo;, &ldquo;contract&rdquo;, &ldquo;apartment&rdquo; or a location.</p>
            </div>
          ) : (
            <>
              {results.map(o => {
                const cat = categoryMeta(o.category)
                const href = o.href ?? `/opportunity/${o.id}`
                return (
                  <button
                    key={o.id}
                    onClick={() => { setFocused(false); setQuery(""); router.push(href) }}
                    style={{ display: "flex", alignItems: "center", gap: 11, width: "100%", textAlign: "left", padding: "10px 14px", border: "none", borderBottom: "1px solid #f7f9fb", backgroundColor: "#fff", cursor: "pointer" }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#f8fafc")}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#fff")}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={o.image} alt="" style={{ width: 40, height: 32, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 12.5, fontWeight: 750, color: "#0f172a", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{o.title}</p>
                      <p style={{ fontSize: 10.5, color: "#94a3b8", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{o.location} · {returnLabel(o)} target</p>
                    </div>
                    <span style={{ fontSize: 9, fontWeight: 800, color: cat.accent, backgroundColor: cat.accentBg, padding: "2px 8px", borderRadius: 99, textTransform: "uppercase", letterSpacing: "0.04em", flexShrink: 0 }}>{cat.label}</span>
                  </button>
                )
              })}
              <button
                onClick={goToMarketplace}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", padding: "11px 0", border: "none", backgroundColor: "#f8fafc", cursor: "pointer", fontSize: 12.5, fontWeight: 750, color: "#2563eb" }}
              >
                See all results for &ldquo;{query.trim()}&rdquo;
                <ArrowRightIcon style={{ width: 13, height: 13 }} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
