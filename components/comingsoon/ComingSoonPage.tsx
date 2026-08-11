"use client"

import { useState } from "react"
import { UsersIcon, BoltIcon, BellAlertIcon } from "@heroicons/react/24/outline"
import { useComingSoon } from "@/lib/hooks"
import { ComingSoonCard, ReserveModal, type QueuedProperty } from "@/components/comingsoon/ComingSoon"

const steps = [
  { icon: UsersIcon, title: "Reserve interest", desc: "Leave your details and how much you plan to invest — no payment, no commitment." },
  { icon: BoltIcon, title: "First to the target opens first", desc: "Each property has an investor target. Whichever reaches it first launches first — demand decides the order." },
  { icon: BellAlertIcon, title: "You invest before everyone", desc: "When it opens, reserved investors get notified and buy shares before the general market." },
]

export default function ComingSoonPage() {
  const { queue } = useComingSoon()
  const [reserving, setReserving] = useState<QueuedProperty | null>(null)
  const [bump, setBump] = useState(0)

  const totalReserved = queue.reduce((s, p) => s + p.interest.count, 0)
  const totalAmount = queue.reduce((s, p) => s + p.interest.amount, 0)

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>

      {/* Header */}
      <div style={{ position: "relative", overflow: "hidden", backgroundColor: "#0a1628", padding: "56px 24px 48px" }}>
        <div style={{ position: "absolute", inset: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1800&q=80" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(8,18,36,0.96) 0%, rgba(10,30,50,0.9) 60%, rgba(13,60,80,0.8) 100%)" }} />
        </div>
        <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto" }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#2dd4bf", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 12px 0" }}>Coming Soon</p>
          <h1 style={{ fontSize: "clamp(28px, 4.5vw, 44px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.8px", margin: "0 0 10px 0", lineHeight: 1.15 }}>
            Demand decides what opens next.
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.65)", maxWidth: 560, margin: "0 0 26px 0", lineHeight: 1.7 }}>
            Every new property gathers reservations here first. The one that reaches its investor target first opens to the market first — and reserved investors buy before anyone else.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              { value: String(queue.length), label: "properties in queue" },
              { value: totalReserved.toLocaleString(), label: "investors reserved" },
              { value: totalAmount >= 1e9 ? `UGX ${(totalAmount / 1e9).toFixed(1)}B` : `UGX ${(totalAmount / 1e6).toFixed(0)}M`, label: "interest indicated" },
            ].map(s => (
              <div key={s.label} style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 18px" }}>
                <p style={{ fontSize: 18, fontWeight: 850, color: "#fff", margin: 0, letterSpacing: "-0.3px" }}>{s.value}</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works strip */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #eef1f5" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "22px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))", gap: 18 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#f0fdfa", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <s.icon style={{ width: 17, height: 17, color: "#0d9488" }} />
              </div>
              <div>
                <p style={{ fontSize: 13.5, fontWeight: 750, color: "#0f172a", margin: "0 0 2px 0" }}>{s.title}</p>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.55 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The queue */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 24px 64px" }}>
        <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20, fontWeight: 500 }}>
          The queue — ranked by investor interest. <strong style={{ color: "#374151" }}>#1 opens first.</strong>
        </p>
        <div key={bump} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(320px, 100%), 1fr))", gap: 20 }}>
          {queue.map((p, i) => (
            <ComingSoonCard key={p.id} property={p} rank={i + 1} onReserve={setReserving} />
          ))}
        </div>
        {queue.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: "0 0 6px 0" }}>Nothing in the queue right now</p>
            <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>New properties appear here before they open to the market — check back soon.</p>
          </div>
        )}
      </div>

      {reserving && (
        <ReserveModal
          property={reserving}
          onClose={() => setReserving(null)}
          onReserved={() => setBump(b => b + 1)}
        />
      )}
    </div>
  )
}
