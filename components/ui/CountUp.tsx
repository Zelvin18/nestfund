"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Animates the numeric part of a display string (e.g. "UGX 24.6B", "14,250+", "38 min")
 * counting up from 0 when the element first scrolls into view.
 * Non-numeric prefix/suffix (currency, units, "+") are preserved as-is.
 */
export default function CountUp({ value, duration = 1200 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(value)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const match = value.match(/([\d,]+(?:\.\d+)?)/)
    if (!match) { setDisplay(value); return }

    const numStr = match[1]
    const target = parseFloat(numStr.replace(/,/g, ""))
    const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0
    const hasCommas = numStr.includes(",")
    const prefix = value.slice(0, match.index)
    const suffix = value.slice((match.index ?? 0) + numStr.length)

    const fmt = (n: number) => {
      const fixed = n.toFixed(decimals)
      if (!hasCommas) return fixed
      const [int, dec] = fixed.split(".")
      return Number(int).toLocaleString() + (dec ? "." + dec : "")
    }

    // Show the real value by default — the count-up only replaces it once the
    // element actually enters the viewport, so a failed observer degrades to
    // static (correct) numbers instead of zeros.
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting || started.current) return
      started.current = true
      observer.disconnect()
      const t0 = performance.now()
      const tick = (now: number) => {
        const p = Math.min((now - t0) / duration, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        setDisplay(prefix + fmt(target * eased) + suffix)
        if (p < 1) requestAnimationFrame(tick)
        else setDisplay(value)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.4 })

    observer.observe(el)
    return () => observer.disconnect()
  }, [value, duration])

  return <span ref={ref}>{display}</span>
}
