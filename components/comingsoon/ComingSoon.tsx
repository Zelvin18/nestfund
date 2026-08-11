"use client"

import { useState } from "react"
import Link from "next/link"
import { XMarkIcon, ArrowRightIcon, FireIcon, UsersIcon, BanknotesIcon } from "@heroicons/react/24/outline"
import { CheckCircleIcon, ShieldCheckIcon } from "@heroicons/react/24/solid"
import { type RentalProperty } from "@/lib/data/rentals"
import { type InterestStats } from "@/lib/api"
import { submitInterest } from "@/lib/api"
import { useComingSoon } from "@/lib/hooks"

export type QueuedProperty = RentalProperty & { interest: InterestStats; progress: number }

const quickAmounts = [100000, 250000, 500000, 1000000, 2500000]
const fmtM = (v: number) => v >= 1e9 ? `UGX ${(v / 1e9).toFixed(1)}B` : `UGX ${(v / 1e6).toFixed(1)}M`

/* ═══ Reserve modal — the demand trace ═══ */
export function ReserveModal({ property, onClose, onReserved }: {
  property: QueuedProperty
  onClose: () => void
  onReserved: () => void
}) {
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", amount: 250000 })
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = form.fullName.trim().length >= 3 && /\S+@\S+\.\S+/.test(form.email) && form.amount >= 50000
  const approxShares = Math.floor(form.amount / property.pricePerShare)

  const submit = async () => {
    if (!canSubmit) return
    setBusy(true)
    setError(null)
    try {
      await submitInterest({
        propertyId: property.id,
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        intendedAmount: form.amount,
      })
      setDone(true)
      onReserved()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Reservation failed — please try again.")
    } finally { setBusy(false) }
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 100, backgroundColor: "rgba(10,17,32,0.55)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ backgroundColor: "#fff", borderRadius: 20, width: "100%", maxWidth: 460, maxHeight: "92vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.35)", animation: "modal-in 0.25s ease-out" }}>

        {done ? (
          <div style={{ padding: "34px 30px", textAlign: "center" }}>
            <CheckCircleIcon style={{ width: 60, height: 60, color: "#10b981", margin: "0 auto 14px" }} />
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", margin: "0 0 8px 0" }}>You&apos;re in line!</h2>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, margin: "0 0 6px 0" }}>
              You&apos;re reservation <strong style={{ color: "#0f172a" }}>#{property.interest.count + 1}</strong> for{" "}
              <strong style={{ color: "#0f172a" }}>{property.name}</strong>.
            </p>
            <p style={{ fontSize: 12.5, color: "#94a3b8", margin: "0 0 24px 0", lineHeight: 1.6 }}>
              We&apos;ll email you the moment it opens — reserved investors get first access to shares before the general market.
            </p>
            <button onClick={onClose} style={{ width: "100%", padding: "13px 0", borderRadius: 11, border: "none", cursor: "pointer", background: "linear-gradient(135deg, #0d9488, #0f766e)", color: "#fff", fontSize: 14, fontWeight: 700 }}>
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Header with image */}
            <div style={{ position: "relative", height: 130 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={property.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "20px 20px 0 0" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,17,32,0.75), transparent)", borderRadius: "20px 20px 0 0" }} />
              <button onClick={onClose} style={{ position: "absolute", top: 12, right: 12, width: 32, height: 32, borderRadius: 9, border: "none", cursor: "pointer", backgroundColor: "rgba(10,17,32,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <XMarkIcon style={{ width: 16, height: 16, color: "#fff" }} />
              </button>
              <div style={{ position: "absolute", bottom: 12, left: 16 }}>
                <p style={{ fontSize: 16, fontWeight: 800, color: "#fff", margin: 0 }}>{property.name}</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", margin: 0 }}>{property.location} · UGX {property.pricePerShare.toLocaleString()}/share planned</p>
              </div>
            </div>

            <div style={{ padding: "20px 24px 24px" }}>
              <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 18px 0", lineHeight: 1.65 }}>
                Reserve <strong style={{ color: "#0f172a" }}>priority access</strong> — no payment now.
                When {property.interest.count >= (property.interestThreshold ?? 100) ? "it opens" : `${(property.interestThreshold ?? 100)} investors have reserved`}, the property opens and you invest before everyone else.
              </p>

              <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>Full Name *</label>
              <input value={form.fullName} onChange={e => { setForm(f => ({ ...f, fullName: e.target.value })); setError(null) }} placeholder="Your name"
                style={{ width: "100%", boxSizing: "border-box", border: "1.5px solid #e2e8f0", borderRadius: 11, padding: "11px 14px", fontSize: 14, outline: "none", marginBottom: 13 }} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 13 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>Email *</label>
                  <input type="email" value={form.email} onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setError(null) }} placeholder="you@email.com"
                    style={{ width: "100%", boxSizing: "border-box", border: "1.5px solid #e2e8f0", borderRadius: 11, padding: "11px 14px", fontSize: 14, outline: "none" }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>Phone</label>
                  <input inputMode="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+256 7XX XXX XXX"
                    style={{ width: "100%", boxSizing: "border-box", border: "1.5px solid #e2e8f0", borderRadius: 11, padding: "11px 14px", fontSize: 14, outline: "none" }} />
                </div>
              </div>

              <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>How much do you plan to invest?</label>
              <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #e2e8f0", borderRadius: 11, padding: "11px 14px", marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#94a3b8", marginRight: 8 }}>UGX</span>
                <input
                  inputMode="numeric"
                  value={form.amount.toLocaleString()}
                  onChange={e => { const n = parseInt(e.target.value.replace(/\D/g, ""), 10); setForm(f => ({ ...f, amount: isNaN(n) ? 0 : Math.min(n, 1e9) })) }}
                  style={{ flex: 1, border: "none", outline: "none", fontSize: 17, fontWeight: 800, color: "#0f172a", minWidth: 0, background: "transparent" }}
                />
                <span style={{ fontSize: 11.5, color: "#94a3b8", flexShrink: 0 }}>≈ {approxShares.toLocaleString()} shares</span>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
                {quickAmounts.map(a => (
                  <button key={a} onClick={() => setForm(f => ({ ...f, amount: a }))} style={{
                    padding: "5px 12px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer",
                    border: form.amount === a ? "1.5px solid #0d9488" : "1.5px solid #e8ecf0",
                    backgroundColor: form.amount === a ? "#f0fdfa" : "#fff",
                    color: form.amount === a ? "#0f766e" : "#64748b",
                  }}>
                    {a >= 1000000 ? `${a / 1000000}M` : `${a / 1000}K`}
                  </button>
                ))}
              </div>

              {error && (
                <p style={{ fontSize: 12.5, fontWeight: 600, color: "#dc2626", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 13px", margin: "0 0 14px 0", lineHeight: 1.55 }}>{error}</p>
              )}

              <button onClick={submit} disabled={!canSubmit || busy} style={{
                width: "100%", padding: "13px 0", borderRadius: 12, border: "none",
                cursor: canSubmit && !busy ? "pointer" : "not-allowed",
                background: canSubmit ? "linear-gradient(135deg, #0d9488, #0f766e)" : "#e2e8f0",
                color: canSubmit ? "#fff" : "#94a3b8", fontSize: 15, fontWeight: 700, marginBottom: 12,
              }}>
                {busy ? "Reserving..." : "Reserve Priority Access"}
              </button>
              <p style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 11, color: "#94a3b8", margin: 0, lineHeight: 1.55 }}>
                <ShieldCheckIcon style={{ width: 13, height: 13, color: "#16a34a", flexShrink: 0, marginTop: 1 }} />
                Non-binding reservation. No payment is taken — your details are only used to notify you and hold your early-access place.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* ═══ Card — clicking anywhere opens the full property page ═══ */
export function ComingSoonCard({ property, rank, onReserve }: {
  property: QueuedProperty
  rank: number
  onReserve: (p: QueuedProperty) => void
}) {
  const threshold = property.interestThreshold ?? 100
  const ready = property.interest.count >= threshold
  return (
    <Link href={`/property/${property.id}`} style={{ textDecoration: "none", display: "block" }}>
    <div style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", overflow: "hidden", display: "flex", flexDirection: "column", height: "100%", boxSizing: "border-box", cursor: "pointer", transition: "box-shadow 0.2s, transform 0.2s" }}
      onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "0 12px 32px rgba(15,23,42,0.1)"; el.style.transform = "translateY(-3px)" }}
      onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.boxShadow = "none"; el.style.transform = "translateY(0)" }}>
      {/* Image */}
      <div style={{ position: "relative", height: 160, flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={property.image} alt={property.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", backgroundColor: "#f1f5f9" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,17,32,0.5), transparent 55%)" }} />
        <span style={{ position: "absolute", top: 11, left: 11, display: "inline-flex", alignItems: "center", gap: 5, fontSize: 10.5, fontWeight: 800, color: rank === 1 ? "#fff" : "#0f172a", backgroundColor: rank === 1 ? "#d97706" : "rgba(255,255,255,0.94)", padding: "4px 12px", borderRadius: 99 }}>
          {rank === 1 && <FireIcon style={{ width: 12, height: 12 }} />}
          {rank === 1 ? "MOST WANTED" : `#${rank} IN QUEUE`}
        </span>
        <span style={{ position: "absolute", top: 11, right: 11, fontSize: 10.5, fontWeight: 800, color: "#0f766e", backgroundColor: "rgba(255,255,255,0.94)", padding: "4px 12px", borderRadius: 99 }}>
          COMING SOON
        </span>
        <div style={{ position: "absolute", bottom: 10, left: 13 }}>
          <p style={{ fontSize: 15.5, fontWeight: 800, color: "#fff", margin: 0 }}>{property.name}</p>
          <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.8)", margin: 0 }}>{property.location} · {property.type}</p>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "14px 16px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 13.5, fontWeight: 800, color: "#0f172a" }}>UGX {property.pricePerShare.toLocaleString()}<span style={{ fontSize: 11, fontWeight: 500, color: "#94a3b8" }}>/share planned</span></span>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: "#0d9488" }}>{property.rentalYield}% target yield</span>
        </div>

        {/* Interest progress */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
          <span style={{ fontSize: 11.5, fontWeight: 650, color: "#64748b", display: "inline-flex", alignItems: "center", gap: 4 }}>
            <UsersIcon style={{ width: 12, height: 12 }} /> {property.interest.count} of {threshold} investors
          </span>
          <span style={{ fontSize: 11.5, fontWeight: 800, color: ready ? "#16a34a" : "#0f172a" }}>{property.progress}%</span>
        </div>
        <div style={{ height: 7, borderRadius: 99, backgroundColor: "#f1f5f9", overflow: "hidden", marginBottom: 6 }}>
          <div style={{ height: "100%", width: `${property.progress}%`, borderRadius: 99, background: ready ? "linear-gradient(90deg, #10b981, #059669)" : "linear-gradient(90deg, #0d9488, #10b981)", transition: "width 0.6s ease" }} />
        </div>
        <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 14px 0", display: "inline-flex", alignItems: "center", gap: 4 }}>
          <BanknotesIcon style={{ width: 12, height: 12 }} /> {fmtM(property.interest.amount)} in reserved interest
        </p>

        <button
          onClick={e => { e.preventDefault(); e.stopPropagation(); onReserve(property) }}
          style={{
            marginTop: "auto", width: "100%", padding: "11px 0", borderRadius: 11, border: "none", cursor: "pointer",
            background: ready ? "linear-gradient(135deg, #16a34a, #15803d)" : "linear-gradient(135deg, #0d9488, #0f766e)",
            color: "#fff", fontSize: 13.5, fontWeight: 750,
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}
        >
          {ready ? "Threshold reached — join the wave" : "Reserve Priority Access"}
          <ArrowRightIcon style={{ width: 14, height: 14 }} />
        </button>
        <p style={{ fontSize: 11, color: "#b6c1cf", textAlign: "center", margin: "9px 0 0 0" }}>
          Click the card for full details, photos &amp; potential
        </p>
      </div>
    </div>
    </Link>
  )
}

/* ═══ Section for landing + home pages ═══ */
export function ComingSoonSection() {
  const { queue } = useComingSoon()
  const [reserving, setReserving] = useState<QueuedProperty | null>(null)
  const [bump, setBump] = useState(0)
  const top = queue.slice(0, 3)

  if (top.length === 0) return null

  return (
    <section style={{ backgroundColor: "#f8fafc", padding: "72px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 14, flexWrap: "wrap", marginBottom: 36 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#0d9488", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
              Coming Soon
            </p>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", margin: "0 0 8px 0" }}>
              Be First in Line
            </h2>
            <p style={{ fontSize: 16, color: "#64748b", margin: 0, maxWidth: 560 }}>
              New properties open when enough investors reserve interest — the first to reach its target opens first. Reserve now, invest before everyone else.
            </p>
          </div>
          <Link href="/coming-soon" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 14, fontWeight: 600, color: "#0d9488", textDecoration: "none" }}>
            View the Full Queue
            <ArrowRightIcon style={{ width: 15, height: 15 }} />
          </Link>
        </div>

        <div key={bump} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(300px, 100%), 1fr))", gap: 20 }}>
          {top.map((p, i) => (
            <ComingSoonCard key={p.id} property={p} rank={i + 1} onReserve={setReserving} />
          ))}
        </div>
      </div>

      {reserving && (
        <ReserveModal
          property={reserving}
          onClose={() => setReserving(null)}
          onReserved={() => setBump(b => b + 1)}
        />
      )}
    </section>
  )
}
