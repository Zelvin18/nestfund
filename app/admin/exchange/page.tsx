"use client"

import { useState, useEffect } from "react"
import { ArrowsRightLeftIcon, CheckIcon } from "@heroicons/react/24/outline"
import { PageHeader, Card, fieldInput } from "@/components/admin/AdminShell"
import { useExchange } from "@/lib/hooks"
import { saveExchangeListing } from "@/lib/api"
import { type ExchangeListing } from "@/lib/data/exchange"

type EditableListing = ExchangeListing & { dbId?: string }

export default function AdminExchange() {
  const { listings: liveListings, live } = useExchange()
  const [rows, setRows] = useState<EditableListing[]>(liveListings)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing to async-loaded records
    setRows(liveListings)
  }, [liveListings])

  const num = (v: string) => { const n = parseInt(v.replace(/\D/g, ""), 10); return isNaN(n) ? 0 : n }

  const update = (id: string, field: "currentSharePrice" | "availableBuyShares" | "availableSellShares", value: number) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r))
    setSavedId(null)
    setError(null)
  }

  const save = async (row: EditableListing) => {
    setError(null)
    try {
      if (live && row.dbId) {
        await saveExchangeListing(row.dbId, {
          currentSharePrice: row.currentSharePrice,
          availableBuyShares: row.availableBuyShares,
          availableSellShares: row.availableSellShares,
        })
      }
      setSavedId(row.id)
      setTimeout(() => setSavedId(s => (s === row.id ? null : s)), 3500)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed")
    }
  }

  return (
    <>
      <PageHeader
        title="Exchange"
        subtitle="Monitor the secondary market — prices, depth, and premiums shown to traders"
      />

      {/* Market monitor */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", gap: 13, marginBottom: 18 }}>
        {(() => {
          const avgPremium = rows.length ? rows.reduce((s, r) => s + (r.originalSharePrice ? ((r.currentSharePrice - r.originalSharePrice) / r.originalSharePrice) * 100 : 0), 0) / rows.length : 0
          const openOrders = rows.reduce((s, r) => s + r.availableBuyShares + r.availableSellShares, 0)
          return [
            { label: "Monthly Volume", value: "UGX 18.5B", sub: "+31.2% vs last month", color: "#ec4899" },
            { label: "Avg. Premium", value: `${avgPremium >= 0 ? "+" : ""}${avgPremium.toFixed(1)}%`, sub: "vs base share price", color: avgPremium >= 0 ? "#10b981" : "#ef4444" },
            { label: "Open Order Depth", value: openOrders.toLocaleString(), sub: "shares across buy + sell", color: "#3b82f6" },
            { label: "Active Listings", value: String(rows.length), sub: "trading now", color: "#7c3aed" },
          ].map(s => (
            <Card key={s.label} style={{ padding: "16px 18px" }}>
              <div style={{ width: 32, height: 4, borderRadius: 99, backgroundColor: s.color, marginBottom: 11 }} />
              <p style={{ fontSize: 21, fontWeight: 850, color: "#0b1220", margin: "0 0 2px 0", letterSpacing: "-0.4px" }}>{s.value}</p>
              <p style={{ fontSize: 11.5, fontWeight: 700, color: "#46536b", margin: "0 0 1px 0" }}>{s.label}</p>
              <p style={{ fontSize: 10.5, color: "#a6b2c3", margin: 0 }}>{s.sub}</p>
            </Card>
          ))
        })()}
      </div>

      {error && (
        <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 11, padding: "11px 16px", marginBottom: 16 }}>
          <p style={{ fontSize: 12.5, fontWeight: 600, color: "#dc2626", margin: 0, lineHeight: 1.55 }}>{error}</p>
        </div>
      )}

      <Card title="Active Listings" subtitle="Price changes here update the Exchange page instantly" icon={ArrowsRightLeftIcon} accent="#7c3aed" style={{ padding: 0 }}>
        <div className="responsive-table" style={{ marginTop: -6 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1.5px solid #f0f2f6" }}>
                {["Listing", "Market", "Base Price", "Current Price", "Buy Depth", "Sell Depth", "Premium", ""].map(h => (
                  <th key={h} style={{ padding: "11px 18px", textAlign: h === "Listing" ? "left" : "right", fontSize: 10.5, fontWeight: 750, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => {
                const premium = row.originalSharePrice ? Math.round(((row.currentSharePrice - row.originalSharePrice) / row.originalSharePrice) * 1000) / 10 : 0
                return (
                  <tr key={row.id} className="admin-table-row" style={{ borderBottom: "1px solid #f6f8fa" }}>
                    <td style={{ padding: "13px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                        <img src={row.image} alt="" style={{ width: 44, height: 34, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: "#0b1220", margin: 0, whiteSpace: "nowrap" }}>{row.name}</p>
                          <p style={{ fontSize: 11, color: "#a6b2c3", margin: 0, whiteSpace: "nowrap" }}>{row.location}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "13px 18px", textAlign: "right" }}>
                      <span style={{
                        fontSize: 10, fontWeight: 750, padding: "3px 10px", borderRadius: 99, whiteSpace: "nowrap",
                        color: row.marketType === "income" ? "#0d9488" : "#d97706",
                        backgroundColor: row.marketType === "income" ? "#f0fdfa" : "#fffbeb",
                      }}>
                        {row.marketType === "income" ? "Income" : "Construction"}
                      </span>
                    </td>
                    <td style={{ padding: "13px 18px", textAlign: "right", fontSize: 12.5, color: "#94a3b8", whiteSpace: "nowrap" }}>
                      UGX {row.originalSharePrice.toLocaleString()}
                    </td>
                    <td style={{ padding: "13px 12px", textAlign: "right" }}>
                      <input
                        style={{ ...fieldInput, width: 110, textAlign: "right", fontWeight: 700, padding: "8px 11px" }}
                        inputMode="numeric"
                        value={row.currentSharePrice.toLocaleString()}
                        onChange={e => update(row.id, "currentSharePrice", num(e.target.value))}
                      />
                    </td>
                    <td style={{ padding: "13px 12px", textAlign: "right" }}>
                      <input
                        style={{ ...fieldInput, width: 90, textAlign: "right", padding: "8px 11px" }}
                        inputMode="numeric"
                        value={row.availableBuyShares.toLocaleString()}
                        onChange={e => update(row.id, "availableBuyShares", num(e.target.value))}
                      />
                    </td>
                    <td style={{ padding: "13px 12px", textAlign: "right" }}>
                      <input
                        style={{ ...fieldInput, width: 90, textAlign: "right", padding: "8px 11px" }}
                        inputMode="numeric"
                        value={row.availableSellShares.toLocaleString()}
                        onChange={e => update(row.id, "availableSellShares", num(e.target.value))}
                      />
                    </td>
                    <td style={{ padding: "13px 18px", textAlign: "right", fontSize: 12.5, fontWeight: 750, color: premium >= 0 ? "#10b981" : "#ef4444", whiteSpace: "nowrap" }}>
                      {premium >= 0 ? "+" : ""}{premium}%
                    </td>
                    <td style={{ padding: "13px 18px", textAlign: "right" }}>
                      <button
                        onClick={() => save(row)}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 5,
                          padding: "8px 16px", borderRadius: 9, border: "none", cursor: "pointer",
                          background: savedId === row.id ? "#10b981" : "linear-gradient(135deg, #2563eb, #4f46e5)",
                          color: "#fff", fontSize: 12, fontWeight: 750, whiteSpace: "nowrap",
                        }}
                      >
                        {savedId === row.id ? <><CheckIcon style={{ width: 13, height: 13 }} /> Saved</> : "Save"}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <p style={{ fontSize: 12, color: "#a6b2c3", marginTop: 16, lineHeight: 1.6 }}>
        Base price comes from the property/project record. Premium is calculated automatically. Adding and pausing listings arrives with the trading engine phase.
      </p>
    </>
  )
}
