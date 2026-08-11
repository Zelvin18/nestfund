"use client"

import { useState } from "react"
import Link from "next/link"
import { RocketLaunchIcon, UsersIcon, BanknotesIcon, PencilSquareIcon } from "@heroicons/react/24/outline"
import { PageHeader, Card } from "@/components/admin/AdminShell"
import { useComingSoon } from "@/lib/hooks"
import { setPropertyStatus } from "@/lib/api"

const fmtM = (v: number) => v >= 1e9 ? `UGX ${(v / 1e9).toFixed(1)}B` : `UGX ${(v / 1e6).toFixed(1)}M`

export default function AdminComingSoon() {
  const { queue, live } = useComingSoon()
  const [opened, setOpened] = useState<string[]>([])
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [flash, setFlash] = useState<string | null>(null)

  const visible = queue.filter(p => !opened.includes(p.id))

  const openToMarket = async (id: string, name: string) => {
    setBusy(id)
    setError(null)
    try {
      if (live) await setPropertyStatus(id, "Live")
      setOpened(prev => [...prev, id])
      setFlash(`${name} is now LIVE on the market — reserved investors should be notified first`)
      setTimeout(() => setFlash(null), 6000)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not open the property")
    } finally { setBusy(null) }
  }

  return (
    <>
      <PageHeader
        title="Coming Soon — Launch Queue"
        subtitle="Every new property gathers reservations here. First to its threshold opens first — you pull the trigger."
      />

      {flash && (
        <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #dcfce7", borderRadius: 11, padding: "11px 16px", marginBottom: 16 }}>
          <p style={{ fontSize: 12.5, fontWeight: 650, color: "#166534", margin: 0 }}>✓ {flash}</p>
        </div>
      )}
      {error && (
        <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 11, padding: "11px 16px", marginBottom: 16 }}>
          <p style={{ fontSize: 12.5, fontWeight: 650, color: "#dc2626", margin: 0, lineHeight: 1.55 }}>{error}</p>
        </div>
      )}

      {visible.length === 0 && (
        <Card>
          <div style={{ textAlign: "center", padding: "28px 0" }}>
            <RocketLaunchIcon style={{ width: 34, height: 34, color: "#cbd5e1", margin: "0 auto 12px" }} />
            <p style={{ fontSize: 14.5, fontWeight: 700, color: "#0b1220", margin: "0 0 5px 0" }}>Queue is empty</p>
            <p style={{ fontSize: 12.5, color: "#94a3b8", margin: 0 }}>
              Set a property&apos;s status to &ldquo;Coming Soon&rdquo; in its editor to start gathering reservations.
            </p>
          </div>
        </Card>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {visible.map((p, i) => {
          const threshold = p.interestThreshold ?? 100
          const ready = p.interest.count >= threshold
          return (
            <Card key={p.id} style={{ padding: 0 }}>
              <div style={{ display: "flex", alignItems: "stretch", gap: 0, flexWrap: "wrap" }}>
                {/* Rank + image */}
                <div style={{ position: "relative", width: 200, minWidth: 160, flexShrink: 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt="" style={{ width: "100%", height: "100%", minHeight: 150, objectFit: "cover" }} />
                  <span style={{
                    position: "absolute", top: 10, left: 10,
                    fontSize: 11, fontWeight: 800, borderRadius: 99, padding: "4px 12px",
                    color: i === 0 ? "#fff" : "#0b1220",
                    backgroundColor: i === 0 ? "#d97706" : "rgba(255,255,255,0.94)",
                  }}>#{i + 1} IN QUEUE</span>
                </div>

                {/* Detail */}
                <div style={{ flex: 1, minWidth: 260, padding: "18px 22px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
                    <div>
                      <p style={{ fontSize: 16.5, fontWeight: 800, color: "#0b1220", margin: "0 0 2px 0" }}>{p.name}</p>
                      <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{p.location} · {p.type} · UGX {p.pricePerShare.toLocaleString()}/share planned</p>
                    </div>
                    {ready
                      ? <span style={{ fontSize: 11, fontWeight: 800, color: "#166534", backgroundColor: "#f0fdf4", border: "1px solid #dcfce7", borderRadius: 99, padding: "5px 14px" }}>✓ THRESHOLD REACHED</span>
                      : <span style={{ fontSize: 11, fontWeight: 800, color: "#92400e", backgroundColor: "#fffbeb", border: "1px solid #fde68a", borderRadius: 99, padding: "5px 14px" }}>GATHERING INTEREST</span>}
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                    <span style={{ fontSize: 12, fontWeight: 650, color: "#64748b", display: "inline-flex", alignItems: "center", gap: 5 }}>
                      <UsersIcon style={{ width: 13, height: 13 }} /> {p.interest.count} of {threshold} reserved investors
                    </span>
                    <span style={{ fontSize: 12, fontWeight: 800, color: ready ? "#16a34a" : "#0b1220" }}>{p.progress}%</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 99, backgroundColor: "#f1f5f9", overflow: "hidden", marginBottom: 8 }}>
                    <div style={{ height: "100%", width: `${p.progress}%`, borderRadius: 99, background: ready ? "linear-gradient(90deg, #10b981, #059669)" : "linear-gradient(90deg, #0d9488, #10b981)" }} />
                  </div>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 14px 0", display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <BanknotesIcon style={{ width: 13, height: 13 }} /> {fmtM(p.interest.amount)} indicated interest
                    <span style={{ color: "#c3ccd9" }}>· threshold adjustable in the editor</span>
                  </p>

                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button
                      onClick={() => openToMarket(p.id, p.name)}
                      disabled={busy === p.id}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 7,
                        padding: "10px 22px", borderRadius: 10, border: "none",
                        cursor: busy === p.id ? "wait" : "pointer",
                        background: ready ? "linear-gradient(135deg, #16a34a, #15803d)" : "linear-gradient(135deg, #2563eb, #4f46e5)",
                        color: "#fff", fontSize: 13, fontWeight: 750,
                        opacity: busy === p.id ? 0.7 : 1,
                      }}
                    >
                      <RocketLaunchIcon style={{ width: 15, height: 15 }} />
                      {busy === p.id ? "Opening..." : ready ? "Open to Market" : "Open Early (override)"}
                    </button>
                    <Link href={`/admin/properties/${p.id}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 10, border: "1.5px solid #e2e8f0", backgroundColor: "#fff", color: "#374151", fontSize: 12.5, fontWeight: 700, textDecoration: "none" }}>
                      <PencilSquareIcon style={{ width: 14, height: 14 }} />
                      Edit Property
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <p style={{ fontSize: 12, color: "#a6b2c3", marginTop: 18, lineHeight: 1.6 }}>
        Opening a property sets its status to Live: it leaves this queue and appears across the market pages instantly.
        Reserved investors&apos; contacts are in the property_interest table — email notifications hook in with the auth build.
      </p>
    </>
  )
}
