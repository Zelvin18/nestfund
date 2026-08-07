"use client"

interface SharePriceChartProps {
  startPrice: number
  currentPrice: number
  endPrice: number
  currency?: string
}

export default function SharePriceChart({
  startPrice,
  currentPrice,
  endPrice,
  currency = "UGX",
}: SharePriceChartProps) {
  const width = 320
  const height = 120
  const padding = { top: 30, right: 80, bottom: 20, left: 20 }

  const prices = [startPrice, currentPrice, endPrice]
  const minP = Math.min(...prices) * 0.95
  const maxP = Math.max(...prices) * 1.05

  // Map price to Y coordinate (inverted — higher price = lower Y)
  const toY = (p: number) =>
    padding.top + ((maxP - p) / (maxP - minP)) * (height - padding.top - padding.bottom)

  // 3 X positions
  const x0 = padding.left + 20 // start
  const x1 = ((width - padding.left - padding.right) * 0.5) + padding.left // current
  const x2 = width - padding.right // end

  const y0 = toY(startPrice)
  const y1 = toY(currentPrice)
  const y2 = toY(endPrice)

  const fmt = (n: number) => n.toLocaleString()

  return (
    <div style={{ position: "relative", height: height + 40 }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ overflow: "visible" }}
      >
        {/* Solid line: start → current */}
        <line
          x1={x0}
          y1={y0}
          x2={x1}
          y2={y1}
          stroke="#0d9488"
          strokeWidth={2}
          strokeLinecap="round"
        />

        {/* Dashed line: current → end (projection) */}
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#94a3b8"
          strokeWidth={1.5}
          strokeDasharray="5,4"
          strokeLinecap="round"
        />

        {/* Dots */}
        <circle cx={x0} cy={y0} r={5} fill="#0d9488" />
        <circle cx={x1} cy={y1} r={6} fill="#0d9488" stroke="#fff" strokeWidth={2} />
        <circle cx={x2} cy={y2} r={5} fill="#94a3b8" stroke="#fff" strokeWidth={2} />

        {/* Start price labels */}
        <text
          x={x0}
          y={y0 - 10}
          textAnchor="middle"
          fontSize={10}
          fill="#64748b"
          fontWeight="500"
        >
          {currency} {fmt(startPrice)}
        </text>
        <text
          x={x0}
          y={y0 - 22}
          textAnchor="middle"
          fontSize={9}
          fill="#94a3b8"
        >
          Start price
        </text>
      </svg>

      {/* Current price tooltip */}
      <div
        style={{
          position: "absolute",
          left: x1 - 40,
          top: y1 + 10,
          backgroundColor: "#0d9488",
          color: "#fff",
          borderRadius: 8,
          padding: "4px 10px",
          fontSize: 11,
          fontWeight: 700,
          whiteSpace: "nowrap",
        }}
      >
        {currency} {fmt(currentPrice)}
        <div style={{ fontSize: 9, fontWeight: 400, opacity: 0.85 }}>Price now</div>
      </div>

      {/* End price tooltip */}
      <div
        style={{
          position: "absolute",
          left: x2 - 10,
          top: y2 - 48,
          backgroundColor: "#fff",
          border: "1.5px solid #e2e8f0",
          borderRadius: 8,
          padding: "5px 10px",
          fontSize: 11,
          fontWeight: 700,
          color: "#0f172a",
          whiteSpace: "nowrap",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        {currency} {fmt(endPrice)}
        <div style={{ fontSize: 9, fontWeight: 400, color: "#64748b" }}>End of construction</div>
      </div>
    </div>
  )
}
