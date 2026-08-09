"use client"

import { useEffect, useState } from "react"

interface Trade {
  id: number
  buyer: string
  action: "bought" | "sold"
  shares: number
  property: string
  price: number
  secondsAgo: number
}

const names = ["James K.", "Amina N.", "David O.", "Grace T.", "Peter M.", "Sarah L.", "Brian S.", "Joan A.", "Moses W.", "Diana R."]
const properties = [
  { name: "Ibis Apartments", price: 1380 },
  { name: "Acacia Office Park", price: 2150 },
  { name: "Green Heights", price: 815 },
  { name: "Kololo Towers", price: 4520 },
  { name: "Naalya Gardens", price: 962 },
]

let nextId = 100

function randomTrade(secondsAgo: number): Trade {
  const prop = properties[Math.floor(Math.random() * properties.length)]
  return {
    id: nextId++,
    buyer: names[Math.floor(Math.random() * names.length)],
    action: Math.random() > 0.35 ? "bought" : "sold",
    shares: [10, 15, 20, 25, 40, 50, 75, 100][Math.floor(Math.random() * 8)],
    property: prop.name,
    price: prop.price,
    secondsAgo,
  }
}

const fmtAgo = (s: number) => (s < 60 ? "just now" : s < 3600 ? `${Math.floor(s / 60)}m ago` : `${Math.floor(s / 3600)}h ago`)

export default function RecentTrades() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [tick, setTick] = useState(0)

  // Seed after mount (avoids SSR/client randomness mismatch), then add a trade every few seconds
  useEffect(() => {
    setTrades([randomTrade(40), randomTrade(160), randomTrade(380), randomTrade(700), randomTrade(1400)])
    const addInterval = setInterval(() => {
      setTrades(prev => [randomTrade(0), ...prev].slice(0, 5))
    }, 7000)
    const ageInterval = setInterval(() => {
      setTrades(prev => prev.map(t => ({ ...t, secondsAgo: t.secondsAgo + 15 })))
      setTick(t => t + 1)
    }, 15000)
    return () => { clearInterval(addInterval); clearInterval(ageInterval) }
  }, [])

  return (
    <div style={{ backgroundColor: "#fff", border: "1px solid #e8ecf0", borderRadius: 14, padding: "18px 20px", marginTop: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: 0, textTransform: "uppercase", letterSpacing: "0.6px" }}>
          Recent Trades
        </h2>
        <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#10b981", display: "inline-block", animation: "pulse-dot 2s ease-in-out infinite" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {trades.map((t, i) => (
          <div key={t.id} style={{ padding: "9px 0", borderTop: i === 0 ? "none" : "1px solid #f1f4f8", animation: i === 0 ? "trade-in 0.4s ease-out" : "none" }}>
            <p style={{ fontSize: 12.5, color: "#374151", margin: "0 0 2px 0", lineHeight: 1.5 }}>
              <strong style={{ color: "#0f172a" }}>{t.buyer}</strong>{" "}
              <span style={{ color: t.action === "bought" ? "#16a34a" : "#dc2626", fontWeight: 600 }}>{t.action}</span>{" "}
              {t.shares} shares of <strong style={{ color: "#0f172a" }}>{t.property}</strong>
            </p>
            <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>
              UGX {t.price.toLocaleString()}/share · {fmtAgo(t.secondsAgo)}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
