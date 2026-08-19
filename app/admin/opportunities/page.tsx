"use client"

import { useState } from "react"
import { PlusIcon, RectangleStackIcon, XMarkIcon, CheckIcon } from "@heroicons/react/24/outline"
import { PageHeader, Card, fieldLabel, fieldInput } from "@/components/admin/AdminShell"
import { useAllOpportunities } from "@/lib/hooks"
import { saveOpportunity } from "@/lib/api"
import {
  CATEGORIES, categoryMeta, fundingProgress, returnLabel,
  type Opportunity, type OpportunityCategory, type OpportunityStatus, type RiskLevel,
} from "@/lib/data/opportunities"

const ALL_STATUSES: OpportunityStatus[] = ["Coming Soon", "Open", "Almost Funded", "Fully Funded", "Active", "Repayment", "Completed", "Cancelled"]
const ADMIN_STATUSES = ["Draft", "Under Review", ...ALL_STATUSES] as string[]

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60)

const blank = (): Opportunity => ({
  id: "",
  title: "",
  category: "cashflow",
  subcategory: "Contract Finance",
  description: "",
  location: "Kampala, Uganda",
  operator: "",
  image: "",
  fundingRequired: 100_000_000,
  fundingReceived: 0,
  minInvestment: 100_000,
  unitPrice: 10_000,
  durationLabel: "3 months",
  durationMonths: 3,
  targetReturnMin: 8,
  targetReturnMax: 12,
  returnPeriod: "total",
  riskLevel: "Moderate",
  status: "Open" as OpportunityStatus,
  revenueModel: "",
  security: [],
  risks: [],
  expectedExit: "",
})

export default function AdminOpportunities() {
  const { opportunities, live, refresh } = useAllOpportunities()
  const [editing, setEditing] = useState<Opportunity | null>(null)
  const [filter, setFilter] = useState<OpportunityCategory | "all">("all")

  const rows = opportunities.filter(o => filter === "all" || o.category === filter)

  return (
    <>
      <PageHeader
        title="Opportunities"
        subtitle="Everything on the marketplace — create, edit, price, and control what investors see"
        action={
          <button
            onClick={() => setEditing(blank())}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer", background: "linear-gradient(135deg, #2563eb, #4f46e5)", color: "#fff", fontSize: 13, fontWeight: 750 }}
          >
            <PlusIcon style={{ width: 15, height: 15 }} />
            New Opportunity
          </button>
        }
      />

      {!live && (
        <div style={{ backgroundColor: "#fffbeb", border: "1px solid #fde68a", borderRadius: 11, padding: "11px 16px", marginBottom: 16 }}>
          <p style={{ fontSize: 12.5, fontWeight: 600, color: "#92400e", margin: 0, lineHeight: 1.55 }}>
            The opportunities table isn&apos;t answering yet — run supabase/opportunities.sql in the Supabase SQL editor. You&apos;re viewing the built-in sample records; edits will save to the database once the table exists.
          </p>
        </div>
      )}

      {/* Category filter */}
      <div className="filter-tabs" style={{ display: "flex", gap: 7, marginBottom: 18 }}>
        {[{ key: "all" as const, label: "All" }, ...CATEGORIES.map(c => ({ key: c.key, label: c.label }))].map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)}
            style={{ padding: "7px 15px", borderRadius: 99, fontSize: 12.5, fontWeight: 650, cursor: "pointer", whiteSpace: "nowrap", border: filter === t.key ? "1.5px solid #0b1220" : "1.5px solid #e2e8f0", backgroundColor: filter === t.key ? "#0b1220" : "#fff", color: filter === t.key ? "#fff" : "#46536b" }}>
            {t.label}
          </button>
        ))}
      </div>

      <Card title="Marketplace Records" subtitle="Records edited here override the built-in samples with the same id" icon={RectangleStackIcon} style={{ padding: 0 }}>
        <div className="responsive-table" style={{ marginTop: -6 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1.5px solid #f0f2f6" }}>
                {["Opportunity", "Category", "Target Return", "Funded", "Status", ""].map(h => (
                  <th key={h} style={{ padding: "11px 18px", textAlign: h === "Opportunity" ? "left" : "right", fontSize: 10.5, fontWeight: 750, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(o => {
                const cat = categoryMeta(o.category)
                return (
                  <tr key={o.id} className="admin-table-row" style={{ borderBottom: "1px solid #f6f8fa" }}>
                    <td style={{ padding: "13px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {o.image && <img src={o.image} alt="" style={{ width: 44, height: 34, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />}
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: "#0b1220", margin: 0, whiteSpace: "nowrap" }}>{o.title}</p>
                          <p style={{ fontSize: 11, color: "#a6b2c3", margin: 0, whiteSpace: "nowrap" }}>{o.subcategory} · {o.location}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "13px 18px", textAlign: "right" }}>
                      <span style={{ fontSize: 10, fontWeight: 750, padding: "3px 10px", borderRadius: 99, whiteSpace: "nowrap", color: cat.accent, backgroundColor: cat.accentBg }}>{cat.label}</span>
                    </td>
                    <td style={{ padding: "13px 18px", textAlign: "right", fontSize: 12.5, fontWeight: 700, color: "#0b1220", whiteSpace: "nowrap" }}>{returnLabel(o)}</td>
                    <td style={{ padding: "13px 18px", textAlign: "right", fontSize: 12.5, color: "#46536b", whiteSpace: "nowrap" }}>{fundingProgress(o)}%</td>
                    <td style={{ padding: "13px 18px", textAlign: "right" }}>
                      <span style={{ fontSize: 10.5, fontWeight: 750, padding: "3px 10px", borderRadius: 99, whiteSpace: "nowrap", color: o.status === "Open" ? "#16a34a" : o.status === "Coming Soon" ? "#0d9488" : "#64748b", backgroundColor: o.status === "Open" ? "#f0fdf4" : o.status === "Coming Soon" ? "#f0fdfa" : "#f1f5f9" }}>
                        {o.status}
                      </span>
                    </td>
                    <td style={{ padding: "13px 18px", textAlign: "right" }}>
                      <button onClick={() => setEditing({ ...o })}
                        style={{ padding: "7px 16px", borderRadius: 9, border: "1.5px solid #e2e8f0", cursor: "pointer", backgroundColor: "#fff", color: "#0b1220", fontSize: 12, fontWeight: 700 }}>
                        Edit
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
        Statuses Draft, Under Review and Cancelled are hidden from the public marketplace. Property and construction records are managed in their own sections — this page controls the Cashflow, Growth, Assets and Stable categories.
      </p>

      {editing && (
        <OpportunityEditor
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); refresh() }}
        />
      )}
    </>
  )
}

/* ── Editor modal ─────────────────────────────────────────────── */

function OpportunityEditor({ initial, onClose, onSaved }: {
  initial: Opportunity
  onClose: () => void
  onSaved: () => void
}) {
  const isNew = initial.id === ""
  const [o, setO] = useState<Opportunity>(initial)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const set = <K extends keyof Opportunity>(k: K, v: Opportunity[K]) => { setO(p => ({ ...p, [k]: v })); setError(null) }
  const num = (v: string) => { const n = parseInt(v.replace(/\D/g, ""), 10); return isNaN(n) ? 0 : n }

  const save = async () => {
    if (busy) return
    const record = { ...o, id: o.id || slugify(o.title) }
    if (!record.id || !record.title) { setError("A title is required."); return }
    setBusy(true)
    setError(null)
    try {
      await saveOpportunity(record)
      onSaved()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed")
      setBusy(false)
    }
  }

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 100, backgroundColor: "rgba(10,22,40,0.55)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ backgroundColor: "#fff", borderRadius: 20, width: "100%", maxWidth: 680, maxHeight: "92vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.35)", animation: "modal-in 0.25s ease-out" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 0" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0b1220", margin: 0, letterSpacing: "-0.3px" }}>
            {isNew ? "New Opportunity" : `Edit — ${initial.title}`}
          </h2>
          <button onClick={onClose} style={{ background: "#f2f5f9", border: "none", borderRadius: 9, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <XMarkIcon style={{ width: 17, height: 17, color: "#64748b" }} />
          </button>
        </div>

        <div style={{ padding: "18px 24px 24px", display: "flex", flexDirection: "column", gap: 14 }}>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 12 }}>
            <div>
              <label style={fieldLabel}>Title</label>
              <input style={fieldInput} value={o.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Kampala School Supply Contract" />
            </div>
            <div>
              <label style={fieldLabel}>Category</label>
              <select style={{ ...fieldInput, cursor: "pointer" }} value={o.category} onChange={e => set("category", e.target.value as OpportunityCategory)}>
                {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={fieldLabel}>Subcategory</label>
              <input style={fieldInput} value={o.subcategory} onChange={e => set("subcategory", e.target.value)} placeholder="e.g. Trade Finance" />
            </div>
            <div>
              <label style={fieldLabel}>Location</label>
              <input style={fieldInput} value={o.location} onChange={e => set("location", e.target.value)} />
            </div>
          </div>

          <div>
            <label style={fieldLabel}>Description</label>
            <textarea style={{ ...fieldInput, minHeight: 70, resize: "vertical" }} value={o.description} onChange={e => set("description", e.target.value)} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={fieldLabel}>Operator</label>
              <input style={fieldInput} value={o.operator} onChange={e => set("operator", e.target.value)} placeholder="Who runs this opportunity" />
            </div>
            <div>
              <label style={fieldLabel}>Image URL</label>
              <input style={fieldInput} value={o.image} onChange={e => set("image", e.target.value)} placeholder="https://..." />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
            <div>
              <label style={fieldLabel}>Funding Required (UGX)</label>
              <input style={fieldInput} inputMode="numeric" value={o.fundingRequired.toLocaleString()} onChange={e => set("fundingRequired", num(e.target.value))} />
            </div>
            <div>
              <label style={fieldLabel}>Funding Received (UGX)</label>
              <input style={fieldInput} inputMode="numeric" value={o.fundingReceived.toLocaleString()} onChange={e => set("fundingReceived", num(e.target.value))} />
            </div>
            <div>
              <label style={fieldLabel}>Min Investment (UGX)</label>
              <input style={fieldInput} inputMode="numeric" value={o.minInvestment.toLocaleString()} onChange={e => set("minInvestment", num(e.target.value))} />
            </div>
            <div>
              <label style={fieldLabel}>Unit Price (UGX)</label>
              <input style={fieldInput} inputMode="numeric" value={o.unitPrice.toLocaleString()} onChange={e => set("unitPrice", num(e.target.value))} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
            <div>
              <label style={fieldLabel}>Duration Label</label>
              <input style={fieldInput} value={o.durationLabel} onChange={e => set("durationLabel", e.target.value)} placeholder="e.g. 4 months" />
            </div>
            <div>
              <label style={fieldLabel}>Duration (months)</label>
              <input style={fieldInput} inputMode="numeric" value={o.durationMonths} onChange={e => set("durationMonths", num(e.target.value))} />
            </div>
            <div>
              <label style={fieldLabel}>Return Min (%)</label>
              <input style={fieldInput} inputMode="numeric" value={o.targetReturnMin} onChange={e => set("targetReturnMin", num(e.target.value))} />
            </div>
            <div>
              <label style={fieldLabel}>Return Max (%)</label>
              <input style={fieldInput} inputMode="numeric" value={o.targetReturnMax} onChange={e => set("targetReturnMax", num(e.target.value))} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
            <div>
              <label style={fieldLabel}>Return Period</label>
              <select style={{ ...fieldInput, cursor: "pointer" }} value={o.returnPeriod} onChange={e => set("returnPeriod", e.target.value as "total" | "p.a.")}>
                <option value="total">Total (over the duration)</option>
                <option value="p.a.">Per annum</option>
              </select>
            </div>
            <div>
              <label style={fieldLabel}>Risk Level</label>
              <select style={{ ...fieldInput, cursor: "pointer" }} value={o.riskLevel} onChange={e => set("riskLevel", e.target.value as RiskLevel)}>
                {["Lower", "Moderate", "Higher"].map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label style={fieldLabel}>Status</label>
              <select style={{ ...fieldInput, cursor: "pointer" }} value={o.status} onChange={e => set("status", e.target.value as OpportunityStatus)}>
                {ADMIN_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={fieldLabel}>Revenue Model — how investors make money</label>
            <textarea style={{ ...fieldInput, minHeight: 56, resize: "vertical" }} value={o.revenueModel} onChange={e => set("revenueModel", e.target.value)} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={fieldLabel}>Security (one per line — only real protections)</label>
              <textarea style={{ ...fieldInput, minHeight: 66, resize: "vertical" }} value={o.security.join("\n")} onChange={e => set("security", e.target.value.split("\n").map(s => s.trim()).filter(Boolean))} />
            </div>
            <div>
              <label style={fieldLabel}>Risks (one per line — never hidden)</label>
              <textarea style={{ ...fieldInput, minHeight: 66, resize: "vertical" }} value={o.risks.join("\n")} onChange={e => set("risks", e.target.value.split("\n").map(s => s.trim()).filter(Boolean))} />
            </div>
          </div>

          <div>
            <label style={fieldLabel}>Expected Exit</label>
            <input style={fieldInput} value={o.expectedExit} onChange={e => set("expectedExit", e.target.value)} placeholder="e.g. On contract payment (est. 4 months)" />
          </div>

          {error && (
            <p style={{ fontSize: 12.5, fontWeight: 600, color: "#dc2626", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", margin: 0, lineHeight: 1.55 }}>{error}</p>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={onClose} style={{ flex: 1, padding: "12px 0", borderRadius: 11, border: "1.5px solid #e2e8f0", backgroundColor: "#fff", color: "#46536b", fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
            <button onClick={save} disabled={busy}
              style={{ flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "12px 0", borderRadius: 11, border: "none", cursor: busy ? "wait" : "pointer", background: busy ? "#93c5fd" : "linear-gradient(135deg, #2563eb, #4f46e5)", color: "#fff", fontSize: 14, fontWeight: 750 }}>
              <CheckIcon style={{ width: 15, height: 15 }} />
              {busy ? "Saving..." : isNew ? "Create & Publish" : "Save Changes"}
            </button>
          </div>
          <p style={{ fontSize: 11, color: "#a6b2c3", margin: 0, textAlign: "center" }}>
            Changes appear on the marketplace immediately after saving. Target returns are projections — never promise a return.
          </p>
        </div>
      </div>
    </div>
  )
}
