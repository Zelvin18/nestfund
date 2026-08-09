"use client"

import { useEffect, useState } from "react"

interface TickerItem {
  name: string
  price: number
  change: number
  img: string
}

const initialItems: TickerItem[] = [
  { name: "Sunrise Apartments",   price: 1250, change: 4.34,  img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=56&h=56&fit=crop&q=60" },
  { name: "Green Heights",        price: 840,  change: -1.29, img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=56&h=56&fit=crop&q=60" },
  { name: "Acacia Office Park",   price: 2100, change: 4.43,  img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=56&h=56&fit=crop&q=60" },
  { name: "Lake View Residences", price: 1680, change: 2.63,  img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=56&h=56&fit=crop&q=60" },
  { name: "Naguru Heights",       price: 3200, change: 1.87,  img: "https://images.unsplash.com/photo-1464146072230-91cabc968266?w=56&h=56&fit=crop&q=60" },
  { name: "Muyenga Villas",       price: 2800, change: -0.54, img: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=56&h=56&fit=crop&q=60" },
  { name: "Kololo Towers",        price: 4500, change: 6.12,  img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=56&h=56&fit=crop&q=60" },
  { name: "Naalya Gardens",       price: 950,  change: 3.21,  img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=56&h=56&fit=crop&q=60" },
]

export default function LiveTicker() {
  const [items, setItems] = useState(initialItems)
  const [flash, setFlash] = useState<{ index: number; up: boolean } | null>(null)

  // Drift a random property's price every few seconds so the market feels alive
  useEffect(() => {
    const interval = setInterval(() => {
      setItems(prev => {
        const i = Math.floor(Math.random() * prev.length)
        const drift = (Math.random() * 0.6 - 0.25) // -0.25% .. +0.35%
        const next = [...prev]
        const p = next[i]
        const newPrice = Math.max(Math.round(p.price * (1 + drift / 100)), 100)
        next[i] = { ...p, price: newPrice, change: Math.round((p.change + drift) * 100) / 100 }
        setFlash({ index: i, up: drift >= 0 })
        return next
      })
      setTimeout(() => setFlash(null), 900)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  // Triple for seamless infinite loop
  const all = [...items, ...items, ...items]

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderTop: "1px solid #f1f5f9",
        borderBottom: "1px solid #f1f5f9",
        overflow: "hidden",
        position: "relative",
        height: 50,
        userSelect: "none",
      }}
    >
      {/* Left gradient fade + LIVE badge */}
      <div
        style={{
          position: "absolute", left: 0, top: 0, bottom: 0, zIndex: 3,
          display: "flex", alignItems: "center",
          paddingLeft: 16, paddingRight: 32,
          background: "linear-gradient(to right, #fff 65%, transparent 100%)",
          pointerEvents: "none",
        }}
      >
        <div style={{
          display: "flex", alignItems: "center", gap: 5,
          backgroundColor: "#1d4ed8",
          borderRadius: 5, padding: "3px 9px",
        }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            backgroundColor: "#fff",
            animation: "pulse-dot 1.4s ease-in-out infinite",
            display: "block",
            flexShrink: 0,
          }} />
          <span style={{
            fontSize: 10, fontWeight: 800, color: "#fff",
            letterSpacing: "0.1em", lineHeight: 1,
          }}>
            LIVE
          </span>
        </div>
      </div>

      {/* Right gradient fade */}
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: 80, zIndex: 2,
        background: "linear-gradient(to left, #fff, transparent)",
        pointerEvents: "none",
      }} />

      {/* Scrolling strip */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          paddingLeft: 80,
          whiteSpace: "nowrap",
          animation: "ticker 50s linear infinite",
          willChange: "transform",
        }}
      >
        {all.map((item, i) => {
          const isFlashing = flash !== null && i % items.length === flash.index
          const positive = item.change >= 0
          return (
            <div
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 9,
                padding: "0 24px",
                borderRight: "1px solid #f1f5f9",
                flexShrink: 0,
                cursor: "pointer",
                backgroundColor: isFlashing ? (flash.up ? "rgba(22,163,74,0.07)" : "rgba(220,38,38,0.07)") : "transparent",
                transition: "background-color 0.4s",
              }}
            >
              {/* Thumbnail */}
              <div style={{
                width: 26, height: 26, borderRadius: 6,
                overflow: "hidden", flexShrink: 0,
                backgroundColor: "#f1f5f9",
              }}>
                <img
                  src={item.img}
                  alt={item.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>

              {/* Name */}
              <span className="ticker-item-name" style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>
                {item.name}
              </span>

              {/* Price */}
              <span style={{ fontSize: 12, color: isFlashing ? (flash.up ? "#16a34a" : "#dc2626") : "#64748b", fontWeight: isFlashing ? 700 : 400, transition: "color 0.3s" }}>
                UGX {item.price.toLocaleString()}
              </span>

              {/* Change badge */}
              <span style={{
                fontSize: 11, fontWeight: 700,
                color: positive ? "#16a34a" : "#dc2626",
                backgroundColor: positive ? "#f0fdf4" : "#fef2f2",
                border: `1px solid ${positive ? "#bbf7d0" : "#fecaca"}`,
                padding: "1px 7px",
                borderRadius: 4,
              }}>
                {positive ? "▲" : "▼"} {positive ? "+" : ""}{item.change.toFixed(2)}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
