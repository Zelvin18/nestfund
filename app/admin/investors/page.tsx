"use client"

import { useState } from "react"
import Link from "next/link"
import { MagnifyingGlassIcon, XMarkIcon, UsersIcon } from "@heroicons/react/24/outline"
import { PageHeader, Card, fieldInput } from "@/components/admin/AdminShell"
import { investors as seedInvestors, type Investor, type KycStatus } from "@/lib/data/investors"

const kycMeta: Record<KycStatus, { label: string; color: string; bg: string; ring: string }> = {
  "verified":  { label: "Verified", color: "#16a34a", bg: "#f0fdf4", ring: "#dcfce7" },
  "pending":   { label: "Pending KYC", color: "#d97706", bg: "#fffbeb", ring: "#fde68a" },
  "rejected":  { label: "Rejected", color: "#dc2626", bg: "#fef2f2", ring: "#fecaca" },
  "high-risk": { label: "High Risk", color: "#7c3aed", bg: "#f5f3ff", ring: "#ddd6fe" },
}

type Tab = "all" | KycStatus

export default function AdminInvestors() {
  const [investors, setInvestors] = useState<Investor[]>(seedInvestors)
  const [tab, setTab] = useState<Tab>("all")
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState<Investor | null>(null)

  const filtered = investors
    .filter(i => tab === "all" || i.kycStatus === tab)
    .filter(i => (i.fullName + i.email + i.country).toLowerCase().includes(query.toLowerCase()))

  const counts = (s: Tab) => s === "all" ? investors.length : investors.filter(i => i.kycStatus === s).length

  const setKyc = (id: string, status: KycStatus) => {
    setInvestors(prev => prev.map(i => i.id === id ? { ...i, kycStatus: status } : i))
    setOpen(prev => prev && prev.id === id ? { ...prev, kycStatus: status } : prev)
  }

  return (
    <>
      <PageHeader
        title="Investors"
        subtitle="Sample directory mirroring the future accounts table — binds to real users when authentication launches"
      />

      <Card style={{ padding: 0 }}>
        {/* Tabs + search */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, padding: "16px 20px", borderBottom: "1px solid #f0f2f6" }}>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {(["all", "verified", "pending", "rejected", "high-risk"] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "7px 14px", borderRadius: 9, border: "none", cursor: "pointer",
                fontSize: 12, fontWeight: 700,
                backgroundColor: tab === t ? "#0b1220" : "#f2f5f9",
                color: tab === t ? "#fff" : "#64748b",
              }}>
                {t === "all" ? "All" : kycMeta[t as KycStatus].label} ({counts(t)})
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "8px 13px", minWidth: 220 }}>
            <MagnifyingGlassIcon style={{ width: 14, height: 14, color: "#94a3b8", flexShrink: 0 }} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search investors..." style={{ flex: 1, border: "none", outline: "none", fontSize: 12.5, color: "#0b1220", minWidth: 0 }} />
          </div>
        </div>

        {/* Table */}
        <div className="responsive-table">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1.5px solid #f0f2f6" }}>
                {["Investor", "Country", "KYC", "Joined", "Invested", "Properties", "Shares", "Last Active"].map(h => (
                  <th key={h} style={{ padding: "11px 18px", textAlign: h === "Investor" ? "left" : "right", fontSize: 10.5, fontWeight: 750, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => {
                const meta = kycMeta[inv.kycStatus]
                return (
                  <tr key={inv.id} className="admin-table-row" onClick={() => setOpen(inv)} style={{ borderBottom: "1px solid #f6f8fa", cursor: "pointer" }}>
                    <td style={{ padding: "12px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "#f1f5f9", border: "1px solid #e8edf4", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: "#64748b", flexShrink: 0 }}>
                          {inv.fullName.charAt(0)}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 750, color: "#0b1220", margin: 0, whiteSpace: "nowrap" }}>{inv.fullName}</p>
                          <p style={{ fontSize: 11, color: "#a6b2c3", margin: 0, whiteSpace: "nowrap" }}>{inv.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 18px", textAlign: "right", fontSize: 12.5, color: "#64748b", whiteSpace: "nowrap" }}>{inv.country}</td>
                    <td style={{ padding: "12px 18px", textAlign: "right" }}>
                      <span style={{ fontSize: 10.5, fontWeight: 750, color: meta.color, backgroundColor: meta.bg, border: `1px solid ${meta.ring}`, padding: "3px 11px", borderRadius: 99, whiteSpace: "nowrap" }}>{meta.label}</span>
                    </td>
                    <td style={{ padding: "12px 18px", textAlign: "right", fontSize: 12.5, color: "#64748b", whiteSpace: "nowrap" }}>{inv.joined}</td>
                    <td style={{ padding: "12px 18px", textAlign: "right", fontSize: 13, fontWeight: 750, color: "#0b1220", whiteSpace: "nowrap" }}>
                      {inv.invested ? `UGX ${(inv.invested / 1e6).toFixed(1)}M` : "—"}
                    </td>
                    <td style={{ padding: "12px 18px", textAlign: "right", fontSize: 12.5, color: "#64748b" }}>{inv.properties || "—"}</td>
                    <td style={{ padding: "12px 18px", textAlign: "right", fontSize: 12.5, color: "#64748b", whiteSpace: "nowrap" }}>{inv.shares ? inv.shares.toLocaleString() : "—"}</td>
                    <td style={{ padding: "12px 18px", textAlign: "right", fontSize: 11.5, color: "#a6b2c3", whiteSpace: "nowrap" }}>{inv.lastActive}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p style={{ padding: "26px 20px", textAlign: "center", fontSize: 13, color: "#94a3b8" }}>No investors match.</p>
        )}
      </Card>

      {/* ── Detail drawer ── */}
      {open && (
        <div onClick={() => setOpen(null)} style={{ position: "fixed", inset: 0, zIndex: 100, backgroundColor: "rgba(10,17,32,0.55)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: "#fff", borderRadius: 20, width: "100%", maxWidth: 520, maxHeight: "92vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.35)", animation: "modal-in 0.25s ease-out", padding: "26px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", backgroundColor: "#f1f5f9", border: "1px solid #e8edf4", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 19, color: "#64748b", flexShrink: 0 }}>
                {open.fullName.charAt(0)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h2 style={{ fontSize: 19, fontWeight: 800, color: "#0b1220", margin: 0 }}>{open.fullName}</h2>
                <p style={{ fontSize: 12.5, color: "#94a3b8", margin: 0 }}>{open.email} · {open.phone}</p>
              </div>
              <button onClick={() => setOpen(null)} style={{ width: 32, height: 32, borderRadius: 9, border: "none", cursor: "pointer", backgroundColor: "#f2f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <XMarkIcon style={{ width: 16, height: 16, color: "#64748b" }} />
              </button>
            </div>

            {/* Facts grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 18 }}>
              {[
                ["KYC", kycMeta[open.kycStatus].label],
                ["Identity", open.idType],
                ["Country", open.country],
                ["Joined", open.joined],
                ["Invested", open.invested ? `UGX ${(open.invested / 1e6).toFixed(1)}M` : "—"],
                ["Shares", open.shares ? open.shares.toLocaleString() : "—"],
              ].map(([label, value]) => (
                <div key={label} style={{ backgroundColor: "#f8fafc", borderRadius: 10, padding: "10px 12px" }}>
                  <p style={{ fontSize: 9.5, fontWeight: 750, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 3px 0" }}>{label}</p>
                  <p style={{ fontSize: 13, fontWeight: 750, color: "#0b1220", margin: 0 }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Holdings */}
            <p style={{ fontSize: 10.5, fontWeight: 750, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px 0" }}>
              Property Holdings ({open.holdings.length})
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 20 }}>
              {open.holdings.map(h => (
                <Link key={h.propertyId} href={`/admin/properties/${h.propertyId}`} style={{ textDecoration: "none" }}>
                  <div className="admin-table-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, border: "1px solid #eef1f5", borderRadius: 10, padding: "9px 13px" }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700, color: "#0b1220" }}>{h.propertyName}</span>
                    <span style={{ fontSize: 12, color: "#64748b", whiteSpace: "nowrap" }}>{h.shares.toLocaleString()} shares · UGX {(h.value / 1e6).toFixed(2)}M</span>
                  </div>
                </Link>
              ))}
              {open.holdings.length === 0 && <p style={{ fontSize: 12.5, color: "#c3ccd9", margin: 0 }}>No investments yet</p>}
            </div>

            {/* KYC actions */}
            <p style={{ fontSize: 10.5, fontWeight: 750, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px 0" }}>KYC Decision</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {(["verified", "pending", "rejected", "high-risk"] as KycStatus[]).map(s => {
                const meta = kycMeta[s]
                const active = open.kycStatus === s
                return (
                  <button key={s} onClick={() => setKyc(open.id, s)} style={{
                    padding: "9px 16px", borderRadius: 10, cursor: "pointer", fontSize: 12.5, fontWeight: 750,
                    border: active ? `1.5px solid ${meta.color}` : "1.5px solid #e8ecf0",
                    backgroundColor: active ? meta.bg : "#fff",
                    color: active ? meta.color : "#64748b",
                  }}>
                    {active ? "● " : ""}{meta.label}
                  </button>
                )
              })}
            </div>
            <p style={{ fontSize: 11, color: "#b6c1cf", margin: "14px 0 0 0", lineHeight: 1.6 }}>
              Decisions apply to this sample directory for now — they bind to real accounts and identity documents when authentication launches.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
