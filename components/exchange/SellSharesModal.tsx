"use client"

import { useState } from "react"
import Link from "next/link"
import { XMarkIcon, ArrowRightIcon, LockClosedIcon } from "@heroicons/react/24/outline"
import { CheckCircleIcon } from "@heroicons/react/24/solid"
import { useSession, useLedgerHoldings, useRentals, useConstruction, useOpportunities } from "@/lib/hooks"
import { createShareListing } from "@/lib/ledger"

/**
 * Sell flow: pick one of YOUR holdings → set units + asking price →
 * publish. The listing then appears on the Exchange for other
 * investors to buy. Requires sign-in and real owned shares.
 */
export default function SellSharesModal({ onClose, presetAssetId }: {
  onClose: () => void
  presetAssetId?: string
}) {
  const { user } = useSession()
  const { holdings } = useLedgerHoldings(user)
  const { rentals } = useRentals()
  const { projects } = useConstruction()
  const { opportunities } = useOpportunities()

  const assetInfo = (id: string) => {
    const r = rentals.find(x => x.id === id)
    if (r) return { name: r.name, image: r.image, marketPrice: r.pricePerShare }
    const c = projects.find(x => x.id === id)
    if (c) return { name: c.name, image: c.image, marketPrice: c.sharePrice }
    const o = opportunities.find(x => x.id === id)
    if (o) return { name: o.title, image: o.image, marketPrice: o.unitPrice }
    return { name: id, image: "", marketPrice: 0 }
  }

  const positions = (holdings ?? []).filter(h => h.units > 0)
  const [assetId, setAssetId] = useState<string | null>(
    presetAssetId && positions.some(p => p.propertyId === presetAssetId) ? presetAssetId : null
  )
  const [units, setUnits] = useState(0)
  const [price, setPrice] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [published, setPublished] = useState(false)

  const selected = positions.find(p => p.propertyId === assetId)
  const info = assetId ? assetInfo(assetId) : null

  const pick = (id: string) => {
    setAssetId(id)
    const pos = positions.find(p => p.propertyId === id)
    setUnits(pos ? Math.min(pos.units, Math.max(1, Math.floor(pos.units / 2))) : 0)
    setPrice(assetInfo(id).marketPrice)
    setError(null)
  }

  const canPublish = !!selected && units > 0 && units <= (selected?.units ?? 0) && price > 0

  const publish = async () => {
    if (!user || !selected || !canPublish || busy) return
    setBusy(true)
    setError(null)
    try {
      await createShareListing({
        userId: user.id,
        sellerName: (user.user_metadata?.full_name as string | undefined)?.split(" ")[0]
          ? `${(user.user_metadata.full_name as string).split(" ")[0]} ${((user.user_metadata.full_name as string).split(" ")[1]?.[0] ?? "")}.`.trim()
          : "Investor",
        assetId: selected.propertyId,
        units,
        pricePerShare: price,
      })
      setPublished(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Publishing failed — please try again.")
    }
    setBusy(false)
  }

  const marketDiff = info && info.marketPrice > 0 && price > 0
    ? Math.round(((price - info.marketPrice) / info.marketPrice) * 1000) / 10
    : 0

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 100, backgroundColor: "rgba(10,22,40,0.55)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ backgroundColor: "#fff", borderRadius: 20, width: "100%", maxWidth: 470, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.35)", animation: "modal-in 0.25s ease-out" }}>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "22px 24px 0" }}>
          <div>
            <h2 style={{ fontSize: 19, fontWeight: 800, color: "#0f172a", margin: "0 0 3px 0", letterSpacing: "-0.3px" }}>Sell Your Shares</h2>
            <p style={{ fontSize: 12.5, color: "#94a3b8", margin: 0 }}>List shares from your portfolio on the Exchange</p>
          </div>
          <button onClick={onClose} style={{ background: "#f4f6f9", border: "none", borderRadius: 9, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <XMarkIcon style={{ width: 17, height: 17, color: "#64748b" }} />
          </button>
        </div>

        <div style={{ padding: "20px 24px 24px" }}>

          {/* Signed out — selling needs your portfolio */}
          {!user ? (
            <div style={{ textAlign: "center", padding: "16px 0 6px" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                <LockClosedIcon style={{ width: 24, height: 24, color: "#2563eb" }} />
              </div>
              <p style={{ fontSize: 15.5, fontWeight: 800, color: "#0f172a", margin: "0 0 6px 0" }}>Sign in to sell</p>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, margin: "0 0 20px 0" }}>
                Selling lists shares from <strong>your</strong> portfolio — so we need to know who you are first.
              </p>
              <Link href="/auth/login" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "12px 28px", borderRadius: 11, background: "linear-gradient(135deg, #2563eb, #4f46e5)", color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
                Log In<ArrowRightIcon style={{ width: 15, height: 15 }} />
              </Link>
            </div>

          ) : published ? (
            /* Success */
            <div style={{ textAlign: "center", padding: "10px 0 4px" }}>
              <CheckCircleIcon style={{ width: 60, height: 60, color: "#16a34a", margin: "0 auto 14px" }} />
              <p style={{ fontSize: 18, fontWeight: 900, color: "#0f172a", margin: "0 0 6px 0" }}>Your listing is live</p>
              <p style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.7, margin: "0 0 18px 0" }}>
                {units.toLocaleString()} shares of <strong style={{ color: "#0f172a" }}>{info?.name}</strong> at UGX {price.toLocaleString()} each are now on the Exchange for other investors to buy.
              </p>
              <button onClick={onClose} style={{ padding: "12px 28px", borderRadius: 11, border: "none", background: "linear-gradient(135deg, #2563eb, #4f46e5)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                Done
              </button>
            </div>

          ) : positions.length === 0 ? (
            /* No holdings */
            <div style={{ textAlign: "center", padding: "12px 0 6px" }}>
              <p style={{ fontSize: 15.5, fontWeight: 800, color: "#0f172a", margin: "0 0 6px 0" }}>Nothing to sell yet</p>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7, margin: "0 0 20px 0" }}>
                You don&apos;t own any shares. Buy into an opportunity first — then you can list your shares here anytime.
              </p>
              <Link href="/opportunities" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "12px 26px", borderRadius: 11, backgroundColor: "#0f172a", color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
                Explore Opportunities<ArrowRightIcon style={{ width: 15, height: 15 }} />
              </Link>
            </div>

          ) : (
            <>
              {/* Step 1: pick a holding */}
              <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 8 }}>Choose from your portfolio</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
                {positions.map(p => {
                  const a = assetInfo(p.propertyId)
                  const active = p.propertyId === assetId
                  return (
                    <button key={p.propertyId} onClick={() => pick(p.propertyId)} style={{
                      display: "flex", alignItems: "center", gap: 12, textAlign: "left", padding: "10px 12px",
                      borderRadius: 12, cursor: "pointer",
                      border: active ? "1.5px solid #2563eb" : "1.5px solid #eef1f5",
                      backgroundColor: active ? "#f6f9ff" : "#fff",
                    }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {a.image && <img src={a.image} alt="" style={{ width: 44, height: 44, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.name}</p>
                        <p style={{ fontSize: 11.5, color: "#94a3b8", margin: 0 }}>You own {p.units.toLocaleString()} shares · avg cost UGX {p.avgCost.toLocaleString()}</p>
                      </div>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", flexShrink: 0, border: active ? "5.5px solid #2563eb" : "2px solid #cbd5e1", boxSizing: "border-box" }} />
                    </button>
                  )
                })}
              </div>

              {/* Step 2: units + price */}
              {selected && info && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 10 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 7 }}>Shares to sell</label>
                      <input type="number" value={units || ""} min={1} max={selected.units}
                        onChange={e => setUnits(Math.max(0, Math.min(selected.units, parseInt(e.target.value) || 0)))}
                        style={{ width: "100%", boxSizing: "border-box", height: 44, borderRadius: 10, border: "1.5px solid #e2e8f0", textAlign: "center", fontSize: 15, fontWeight: 700, color: "#0f172a", outline: "none" }} />
                      <p style={{ fontSize: 10.5, color: "#94a3b8", margin: "4px 0 0 0" }}>Max {selected.units.toLocaleString()}</p>
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 7 }}>Price per share (UGX)</label>
                      <input type="number" value={price || ""} min={1}
                        onChange={e => setPrice(Math.max(0, parseInt(e.target.value) || 0))}
                        style={{ width: "100%", boxSizing: "border-box", height: 44, borderRadius: 10, border: "1.5px solid #e2e8f0", textAlign: "center", fontSize: 15, fontWeight: 700, color: "#0f172a", outline: "none" }} />
                      <p style={{ fontSize: 10.5, color: marketDiff > 0 ? "#d97706" : marketDiff < 0 ? "#16a34a" : "#94a3b8", margin: "4px 0 0 0" }}>
                        Market UGX {info.marketPrice.toLocaleString()}{marketDiff !== 0 && ` · you're ${marketDiff > 0 ? `${marketDiff}% above` : `${Math.abs(marketDiff)}% below`}`}
                      </p>
                    </div>
                  </div>

                  <div style={{ backgroundColor: "#f8fafc", borderRadius: 11, padding: "11px 14px", marginBottom: 14, display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 12.5, color: "#64748b" }}>You&apos;ll receive if fully sold</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>UGX {(units * price).toLocaleString()}</span>
                  </div>

                  {error && (
                    <p style={{ fontSize: 12.5, fontWeight: 600, color: "#b45309", backgroundColor: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "10px 14px", margin: "0 0 14px 0", lineHeight: 1.55 }}>
                      {error}
                    </p>
                  )}

                  <button onClick={publish} disabled={!canPublish || busy}
                    style={{ width: "100%", padding: "13px 0", borderRadius: 12, border: "none", background: canPublish && !busy ? "linear-gradient(135deg, #2563eb, #4f46e5)" : "#e2e8f0", color: canPublish && !busy ? "#fff" : "#94a3b8", fontSize: 14.5, fontWeight: 750, cursor: canPublish && !busy ? "pointer" : "not-allowed" }}>
                    {busy ? "Publishing..." : "Publish Listing"}
                  </button>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: "10px 0 0 0", textAlign: "center", lineHeight: 1.6 }}>
                    Your shares stay yours until a buyer completes the trade — every transfer is recorded on the ledger.
                  </p>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
