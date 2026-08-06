"use client"

interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  positive?: boolean
  strokeWidth?: number
}

export default function Sparkline({
  data,
  width = 120,
  height = 40,
  positive = true,
  strokeWidth = 1.8,
}: SparklineProps) {
  if (!data || data.length < 2) return null

  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const padding = 3

  const points = data.map((val, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2)
    const y = padding + (1 - (val - min) / range) * (height - padding * 2)
    return `${x},${y}`
  })

  const polyline = points.join(" ")

  // Build filled area path
  const firstX = padding
  const lastX = padding + (width - padding * 2)
  const bottomY = height - padding

  const areaPath = `M ${firstX},${bottomY} L ${points.join(" L ")} L ${lastX},${bottomY} Z`

  const color = positive ? "#10b981" : "#ef4444"
  const fillColor = positive ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)"

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
    >
      {/* Fill area */}
      <path d={areaPath} fill={fillColor} />
      {/* Line */}
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
