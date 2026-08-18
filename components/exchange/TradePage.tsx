"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeftIcon, ArrowRightIcon, XMarkIcon, ArrowsRightLeftIcon,
  UserCircleIcon, ShieldCheckIcon, BanknotesIcon,
} from "@heroicons/react/24/outline"
import { CheckBadgeIcon, CheckCircleIcon } from "@heroicons/react/24/solid"
import { useExchange, useShareOffers, useSession, useWallet, useLedgerHoldings } from "@/lib/hooks"
import { buyFromListing } from "@/lib/ledger"
import type { ShareOffer } from "@/lib/data/exchange"
import SellSharesModal from "@/components/exchange/SellSharesModal"

const fmt = (n: number) => n.toLocaleString()

/**
 * The trade floor for one asset: every open sell offer from other
 * investors, your own position, and the buy flow that settles the
 * transaction between seller and buyer on the ledger.
 */
export default function TradePage({ assetId }: { assetId: string }) {
  const { listings } = useExchange()
  const { offers } = useShareOffers()
  const { user } = useSession()
  const { holdings } = useLedgerHoldings(user)

  const listing = listings.find(l => l.id === assetId)
  const assetOffers = offers.filter(o => o.assetId === assetId && o.units > 0)
  const myPosition = holdings?.find(h => h.propertyId === assetId)
  const [buying, setBuying] = useState<ShareOffer | null>(null)
  const [selling, setSelling] = useState(false)

  if (!listing) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 12 }}>
      <p style={{ color: "#64748b" }}>This asset isn&apos;t trading on the Exchange.</p>
      <Link href="/exchange" style={{ fontSize: 14, fontWeight: 700, color: "#2563eb", textDecoration: "none" }}>Back to the Exchange</Link>
    </div>
  )

  const detailHref = listing.marketType === "construction" ? `/construction/${listing.id}` : `/property/${listing.id}`

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f6f8" }}>

      {/* Breadcrumb */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e8ecf0" }}>
        <div className="container" style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px", height: 48, display: "flex", alignItems: "center", gap: 6 }}>
          <Link href="/exchange" style={{ fontSize: 13, color: "#64748b", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
            <ArrowLeftIcon style={{ width: 14, height: 14 }} />Exchange
          </Link>
          <span style={{ fontSize: 13, color: "#c4cad4" }}>/</span>
          <span style={{ fontSize: 13, color: "#0f172a", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{listing.name}</span>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1080, margin: "0 auto", padding: "24px 24px 56px" }}>

        {/* ── Asset header ── */}
        <div style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", overflow: "hidden", marginBottom: 20 }}>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <div style={{ width: 220, minHeight: 150, flexShrink: 0, position: "relative", flexGrow: 1, maxWidth: 320 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={listing.image} alt={listing.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ flex: 2, minWidth: 260, padding: "18px 22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: "#fff", backgroundColor: listing.marketType === "construction" ? "#d97706" : "#0d9488", padding: "3px 10px", borderRadius: 99, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  {listing.marketType === "construction" ? "Construction" : "Income"}
                </span>
                <span style={{ fontSize: 11, color: "#94a3b8" }}>{listing.location}</span>
              </div>
              <h1 style={{ fontSize: 23, fontWeight: 800, color: "#0f172a", margin: "0 0 10px 0", letterSpacing: "-0.4px" }}>{listing.name}</h1>
              <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, margin: 0, textTransform: "uppercase" }}>Market price</p>
                  <p style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", margin: 0 }}>UGX {fmt(listing.currentSharePrice)}</p>
                </div>
                <div>
                  <p style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, margin: 0, textTransform: "uppercase" }}>Last trade</p>
                  <p style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", margin: 0 }}>UGX {fmt(listing.lastTradePrice)}</p>
                </div>
                <div>
                  <p style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, margin: 0, textTransform: "uppercase" }}>Change</p>
                  <p style={{ fontSize: 17, fontWeight: 800, color: listing.priceChange >= 0 ? "#10b981" : "#ef4444", margin: 0 }}>{listing.priceChange >= 0 ? "+" : ""}{listing.priceChange.toFixed(2)}%</p>
                </div>
                <div>
                  <p style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, margin: 0, textTransform: "uppercase" }}>APR</p>
                  <p style={{ fontSize: 17, fontWeight: 800, color: "#0d9488", margin: 0 }}>{listing.apr}%</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <Link href={detailHref} style={{ fontSize: 12.5, fontWeight: 700, color: "#2563eb", textDecoration: "none" }}>
                  View full details →
                </Link>
                {myPosition && myPosition.units > 0 && (
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: "#0d9488", backgroundColor: "#f0fdfa", border: "1px solid #99f6e4", borderRadius: 99, padding: "3px 11px" }}>
                    You own {fmt(myPosition.units)} shares
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Sell CTA — active only when you hold this asset ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <ArrowsRightLeftIcon style={{ width: 18, height: 18, color: "#64748b" }} />
            Open Sell Offers <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>({assetOffers.length})</span>
          </h2>
          <button
            onClick={() => setSelling(true)}
            disabled={!!user && (!myPosition || myPosition.units <= 0)}
            title={user && (!myPosition || myPosition.units <= 0) ? "You don't own shares of this asset" : undefined}
            style={{
              padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 750,
              border: "1.5px solid #e2e8f0", cursor: user && (!myPosition || myPosition.units <= 0) ? "not-allowed" : "pointer",
              backgroundColor: user && (!myPosition || myPosition.units <= 0) ? "#f1f5f9" : "#fff",
              color: user && (!myPosition || myPosition.units <= 0) ? "#94a3b8" : "#0f172a",
            }}
          >
            {!user ? "Sign In to Sell" : (!myPosition || myPosition.units <= 0) ? "No shares to sell" : "Sell My Shares"}
          </button>
        </div>

        {/* ── Offers list ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {assetOffers.length === 0 && (
            <div style={{ backgroundColor: "#fff", borderRadius: 14, border: "1px solid #e8ecf0", padding: "40px 24px", textAlign: "center" }}>
              <p style={{ fontSize: 14.5, fontWeight: 700, color: "#0f172a", margin: "0 0 4px 0" }}>No open sell offers right now</p>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Check back soon — or hold shares here and be the first to list.</p>
            </div>
          )}
          {assetOffers.map(offer => {
            const premium = Math.round(((offer.pricePerShare - listing.currentSharePrice) / listing.currentSharePrice) * 1000) / 10
            return (
              <div key={offer.id} style={{ backgroundColor: "#fff", borderRadius: 14, border: "1px solid #e8ecf0", padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 2, minWidth: 170 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", backgroundColor: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <UserCircleIcon style={{ width: 22, height: 22, color: "#2563eb" }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13.5, fontWeight: 750, color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: 5 }}>
                      {offer.sellerName}
                      <CheckBadgeIcon style={{ width: 14, height: 14, color: "#10b981" }} />
                      {offer.demo && <span style={{ fontSize: 9, fontWeight: 700, color: "#94a3b8", backgroundColor: "#f1f5f9", padding: "1px 7px", borderRadius: 99 }}>SAMPLE</span>}
                    </p>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>Verified investor · listed {offer.listedAgo}</p>
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 90 }}>
                  <p style={{ fontSize: 10.5, color: "#94a3b8", fontWeight: 700, margin: 0, textTransform: "uppercase" }}>Selling</p>
                  <p style={{ fontSize: 14.5, fontWeight: 800, color: "#0f172a", margin: 0 }}>{fmt(offer.units)} shares</p>
                </div>
                <div style={{ flex: 1, minWidth: 120 }}>
                  <p style={{ fontSize: 10.5, color: "#94a3b8", fontWeight: 700, margin: 0, textTransform: "uppercase" }}>Asking price</p>
                  <p style={{ fontSize: 14.5, fontWeight: 800, color: "#0f172a", margin: 0 }}>
                    UGX {fmt(offer.pricePerShare)}
                    <span style={{ fontSize: 11, fontWeight: 700, color: premium > 0 ? "#d97706" : premium < 0 ? "#16a34a" : "#94a3b8", marginLeft: 6 }}>
                      {premium === 0 ? "at market" : premium > 0 ? `+${premium}%` : `${premium}%`}
                    </span>
                  </p>
                </div>
                <button onClick={() => setBuying(offer)}
                  style={{ padding: "10px 22px", borderRadius: 10, border: "none", cursor: "pointer", background: "linear-gradient(135deg, #2563eb, #4f46e5)", color: "#fff", fontSize: 13, fontWeight: 750, flexShrink: 0 }}>
                  Buy Shares
                </button>
              </div>
            )
          })}
        </div>

        <p style={{ fontSize: 11.5, color: "#94a3b8", margin: "18px 0 0 0", lineHeight: 1.7 }}>
          NestFund operates the marketplace connecting buyers and sellers. Every transfer settles through the platform ledger. Offers marked SAMPLE are demonstration order-book depth, not real investors.
        </p>
      </div>

      {buying && (
        <BuyTradeModal
          offer={buying}
          assetName={listing.name}
          marketPrice={listing.currentSharePrice}
          onClose={() => setBuying(null)}
        />
      )}
      {selling && <SellSharesModal presetAssetId={assetId} onClose={() => setSelling(false)} />}
    </div>
  )
}

/* ── The transaction: seller ⇄ buyer, settled on the ledger ── */

function BuyTradeModal({ offer, assetName, marketPrice, onClose }: {
  offer: ShareOffer
  assetName: string
  marketPrice: number
  onClose: () => void
}) {
  const { user } = useSession()
  const { balance, live } = useWallet(user)
  const [units, setUnits] = useState(Math.min(offer.units, 50))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [receipt, setReceipt] = useState<string | null>(null)

  const total = units * offer.pricePerShare
  const valid = units >= 1 && units <= offer.units

  const confirm = async () => {
    if (!user || !valid || busy) return
    setBusy(true)
    setError(null)
    try {
      const { ref } = await buyFromListing({ buyerId: user.id, offer, units, assetName })
      setReceipt(ref)
    } catch (err) {
      const raw = err instanceof Error ? err.message : "Trade failed — please try again."
      setError(raw.replace(/^INSUFFICIENT_FUNDS:/, ""))
    }
    setBusy(false)
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 100, backgroundColor: "rgba(10,22,40,0.55)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ backgroundColor: "#fff", borderRadius: 20, width: "100%", maxWidth: 450, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.35)", animation: "modal-in 0.25s ease-out" }}>

        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "22px 24px 0" }}>
          <div>
            <h2 style={{ fontSize: 19, fontWeight: 800, color: "#0f172a", margin: "0 0 3px 0", letterSpacing: "-0.3px" }}>
              {receipt ? "Trade Complete" : "Buy from " + offer.sellerName}
            </h2>
            <p style={{ fontSize: 12.5, color: "#94a3b8", margin: 0 }}>{assetName}</p>
          </div>
          <button onClick={onClose} style={{ background: "#f4f6f9", border: "none", borderRadius: 9, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <XMarkIcon style={{ width: 17, height: 17, color: "#64748b" }} />
          </button>
        </div>

        <div style={{ padding: "18px 24px 24px" }}>
          {receipt ? (
            <div style={{ textAlign: "center", padding: "6px 0 4px" }}>
              <CheckCircleIcon style={{ width: 60, height: 60, color: "#16a34a", margin: "0 auto 12px" }} />
              <p style={{ fontSize: 21, fontWeight: 900, color: "#0f172a", margin: "0 0 4px 0" }}>UGX {fmt(total)}</p>
              <p style={{ fontSize: 13.5, color: "#64748b", lineHeight: 1.7, margin: "0 0 4px 0" }}>
                {fmt(units)} shares of <strong style={{ color: "#0f172a" }}>{assetName}</strong> transferred from {offer.sellerName} to you.
              </p>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 18px 0" }}>Recorded on the ledger · Ref {receipt}</p>
              <Link href="/portfolio" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "12px 26px", borderRadius: 11, background: "linear-gradient(135deg, #2563eb, #4f46e5)", color: "#fff", fontSize: 14, fontWeight: 750, textDecoration: "none" }}>
                View My Portfolio<ArrowRightIcon style={{ width: 15, height: 15 }} />
              </Link>
            </div>
          ) : (
            <>
              {/* The transaction, visualised */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, backgroundColor: "#f8fafc", borderRadius: 12, padding: "12px 16px", marginBottom: 16 }}>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <UserCircleIcon style={{ width: 26, height: 26, color: "#2563eb", margin: "0 auto" }} />
                  <p style={{ fontSize: 11.5, fontWeight: 750, color: "#0f172a", margin: "3px 0 0 0" }}>{offer.sellerName}</p>
                  <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>Seller</p>
                </div>
                <div style={{ textAlign: "center" }}>
                  <ArrowsRightLeftIcon style={{ width: 18, height: 18, color: "#64748b" }} />
                  <p style={{ fontSize: 9.5, color: "#94a3b8", margin: "2px 0 0 0", whiteSpace: "nowrap" }}>{fmt(units)} shares ⇄ UGX {fmt(total)}</p>
                </div>
                <div style={{ textAlign: "center", flex: 1 }}>
                  <UserCircleIcon style={{ width: 26, height: 26, color: "#0d9488", margin: "0 auto" }} />
                  <p style={{ fontSize: 11.5, fontWeight: 750, color: "#0f172a", margin: "3px 0 0 0" }}>{user ? "You" : "You (signed out)"}</p>
                  <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>Buyer</p>
                </div>
              </div>

              {/* Units */}
              <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 7 }}>Shares to buy</label>
              <div style={{ display: "flex", gap: 7, marginBottom: 6 }}>
                <button onClick={() => setUnits(u => Math.max(1, u - 10))} style={{ width: 38, height: 44, borderRadius: 10, border: "1.5px solid #e2e8f0", background: "#f8fafc", fontSize: 16, cursor: "pointer", color: "#374151" }}>−</button>
                <input type="number" value={units || ""} onChange={e => setUnits(Math.max(1, Math.min(offer.units, parseInt(e.target.value) || 1)))}
                  style={{ flex: 1, height: 44, borderRadius: 10, border: "1.5px solid #e2e8f0", textAlign: "center", fontSize: 16, fontWeight: 700, color: "#0f172a", outline: "none", minWidth: 0 }} />
                <button onClick={() => setUnits(u => Math.min(offer.units, u + 10))} style={{ width: 38, height: 44, borderRadius: 10, border: "1.5px solid #bfdbfe", background: "#eff6ff", fontSize: 16, cursor: "pointer", color: "#2563eb" }}>+</button>
              </div>
              <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 14px 0" }}>Seller is offering {fmt(offer.units)} shares at UGX {fmt(offer.pricePerShare)} each (market UGX {fmt(marketPrice)})</p>

              {/* Summary */}
              <div style={{ backgroundColor: "#f8fafc", borderRadius: 11, padding: "11px 14px", marginBottom: 14 }}>
                {[
                  { label: "Price per share", value: `UGX ${fmt(offer.pricePerShare)}` },
                  { label: "Total", value: `UGX ${fmt(total)}`, bold: true },
                ].map(r => (
                  <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
                    <span style={{ fontSize: 12.5, color: "#64748b" }}>{r.label}</span>
                    <span style={{ fontSize: r.bold ? 15 : 12.5, fontWeight: r.bold ? 800 : 700, color: "#0f172a" }}>{r.value}</span>
                  </div>
                ))}
              </div>

              {user && live && balance !== null && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, backgroundColor: balance >= total ? "#f0fdf4" : "#fffbeb", border: `1px solid ${balance >= total ? "#bbf7d0" : "#fde68a"}`, borderRadius: 10, padding: "9px 13px", marginBottom: 14 }}>
                  <BanknotesIcon style={{ width: 16, height: 16, color: balance >= total ? "#16a34a" : "#d97706", flexShrink: 0 }} />
                  <p style={{ fontSize: 12, fontWeight: 600, color: balance >= total ? "#166534" : "#78350f", margin: 0 }}>
                    Wallet balance: UGX {fmt(balance)}{balance < total && " — top up before confirming"}
                  </p>
                </div>
              )}

              {error && (
                <p style={{ fontSize: 12.5, fontWeight: 600, color: "#b45309", backgroundColor: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "10px 14px", margin: "0 0 14px 0", lineHeight: 1.55 }}>
                  {error}{error.includes("Wallet") && <>{" "}<Link href="/wallet" style={{ color: "#b45309", fontWeight: 800 }}>Open Wallet</Link></>}
                </p>
              )}

              {user ? (
                <button onClick={confirm} disabled={!valid || busy}
                  style={{ width: "100%", padding: "13px 0", borderRadius: 12, border: "none", background: valid && !busy ? "linear-gradient(135deg, #2563eb, #4f46e5)" : "#e2e8f0", color: valid && !busy ? "#fff" : "#94a3b8", fontSize: 14.5, fontWeight: 750, cursor: valid && !busy ? "pointer" : "not-allowed" }}>
                  {busy ? "Settling trade..." : `Confirm — Buy ${fmt(units)} Shares`}
                </button>
              ) : (
                <Link href="/auth/login" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, width: "100%", boxSizing: "border-box", padding: "13px 0", borderRadius: 12, background: "linear-gradient(135deg, #2563eb, #4f46e5)", color: "#fff", fontSize: 14.5, fontWeight: 750, textDecoration: "none" }}>
                  Sign In to Complete This Trade<ArrowRightIcon style={{ width: 15, height: 15 }} />
                </Link>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "center", marginTop: 12 }}>
                <ShieldCheckIcon style={{ width: 13, height: 13, color: "#16a34a" }} />
                <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>You pay → shares transfer → seller is paid · recorded on the ledger</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
