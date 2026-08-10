"use client"

import { useRef, useState, useEffect } from "react"

/**
 * Measures its own width and hands it to the child render function so
 * charts get explicit pixel dimensions. Replaces Recharts'
 * ResponsiveContainer, which fails to measure in some grid/animation
 * contexts and renders nothing.
 */
export default function ChartBox({ height, children }: {
  height: number
  children: (width: number) => React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    /* eslint-disable react-hooks/set-state-in-effect -- measuring layout is inherently an effect */
    const measure = () => { if (el.clientWidth > 0) setWidth(el.clientWidth) }
    measure()
    /* eslint-enable react-hooks/set-state-in-effect */
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    // Fallback: some environments delay layout past first paint
    const t = setTimeout(measure, 300)
    return () => { ro.disconnect(); clearTimeout(t) }
  }, [])

  return (
    <div ref={ref} style={{ width: "100%" }}>
      {width > 0 ? children(width) : <div style={{ height }} />}
    </div>
  )
}
