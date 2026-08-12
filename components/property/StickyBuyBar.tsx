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

  // Same gradient family as the widget's SHARE PRICE header, per market tone
  const palette =
    tone === "teal"
      ? { grad: "linear-gradient(120deg, #0f766e 0%, #0d9488 55%, #14b8a6 100%)", btnText: "#0f766e", glow: "rgba(13,148,136,0.45)" }
      : tone === "amber"
      ? { grad: "linear-gradient(120deg, #b45309 0%, #d97706 55%, #f59e0b 100%)", btnText: "#b45309", glow: "rgba(217,119,6,0.45)" }
      : { grad: "linear-gradient(120deg, #1d4ed8 0%, #2563eb 55%, #4f46e5 100%)", btnText: "#2563eb", glow: "rgba(37,99,235,0.45)" }

  if (!visible) return null

  return (
    <div className="sticky-buy-bar">
      <div style={{
        position: "relative", overflow: "hidden",
        display: "flex", alignItems: "center", gap: 12,
        background: palette.grad,
        border: "1px solid rgba(255,255,255,0.22)",
        borderRadius: 16, padding: "11px 11px 11px 16px",
        boxShadow: `0 10px 30px ${palette.glow}, 0 4px 12px rgba(0,0,0,0.18)`,
      }}>
        {/* soft highlight for depth, echoing the widget header sheen */}
        <div style={{ position: "absolute", top: -46, right: 60, width: 130, height: 130, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 70%)", pointerEvents: "none" }} />
        <div style={{ flex: 1, minWidth: 0, position: "relative" }}>
          <p style={{ fontSize: 15.5, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.3px", lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{price}</p>
          <p style={{ fontSize: 10.5, fontWeight: 600, color: "rgba(255,255,255,0.75)", margin: 0, whiteSpace: "nowrap" }}>{sub}</p>
        </div>
        <button
          onClick={onClick}
          style={{
            position: "relative",
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "11px 20px", borderRadius: 12, border: "none", cursor: "pointer",
            background: "#fff", color: palette.btnText, fontSize: 13.5, fontWeight: 800,
            whiteSpace: "nowrap", flexShrink: 0,
            boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
          }}
        >
          {cta}
          <ArrowRightIcon style={{ width: 14, height: 14 }} />
        </button>
      </div>
    </div>
  )
}
