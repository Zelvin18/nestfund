"use client"

import { useEffect, useState, type RefObject } from "react"
import { ArrowRightIcon } from "@heroicons/react/24/outline"

/**
 * Compact mobile bar pinned just above the bottom navigation.
 * Appears only after the investor scrolls past the buy/reserve widget,
 * so the primary action is always one tap away.
 */
export default function StickyBuyBar({ targetRef, price, sub, cta, tone = "blue", onClick }: {
  targetRef: RefObject<HTMLDivElement | null>
  price: string
  sub: string
  cta: string
  tone?: "blue" | "teal" | "amber"
  onClick: () => void
}) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = targetRef.current
    if (!el) return
    const io = new IntersectionObserver(
      entries => {
        const e = entries[0]
        // Show once the widget has been scrolled past (its bottom is above the viewport)
        setVisible(!e.isIntersecting && e.boundingClientRect.bottom < 0)
      },
      { threshold: 0 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [targetRef])

  const grad =
    tone === "teal" ? "linear-gradient(135deg, #0d9488, #0f766e)" :
    tone === "amber" ? "linear-gradient(135deg, #d97706, #b45309)" :
    "linear-gradient(135deg, #2563eb, #4f46e5)"

  if (!visible) return null

  return (
    <div className="sticky-buy-bar">
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        backgroundColor: "rgba(10, 17, 32, 0.94)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 16, padding: "10px 10px 10px 16px",
        boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 15, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.3px", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{price}</p>
          <p style={{ fontSize: 10.5, color: "rgba(255,255,255,0.55)", margin: 0, whiteSpace: "nowrap" }}>{sub}</p>
        </div>
        <button
          onClick={onClick}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "11px 20px", borderRadius: 12, border: "none", cursor: "pointer",
            background: grad, color: "#fff", fontSize: 13.5, fontWeight: 750,
            whiteSpace: "nowrap", flexShrink: 0,
            boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
          }}
        >
          {cta}
          <ArrowRightIcon style={{ width: 14, height: 14 }} />
        </button>
      </div>
    </div>
  )
}
