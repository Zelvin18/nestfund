"use client"

import { useState, useEffect } from "react"
import { PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { PageHeader, Card, fieldLabel, fieldInput } from "@/components/admin/AdminShell"
import { type IntelligenceItem, type IntelType } from "@/lib/data/intelligence"
import { useIntelligence } from "@/lib/hooks"
import { publishIntelligence, deleteIntelligence } from "@/lib/api"
import { isSupabaseConfigured } from "@/lib/supabase"

const typeMeta: Record<IntelType, { label: string; color: string; bg: string; category: string }> = {
  approval:    { label: "Government Approval", color: "#2563eb", bg: "#eff6ff", category: "GOVT. APPROVAL" },
  development: { label: "Development",         color: "#0d9488", bg: "#f0fdfa", category: "DEVELOPMENT" },
  decline:     { label: "Risk Alert",          color: "#dc2626", bg: "#fef2f2", category: "RISK ALERT" },
}

export default function AdminIntelligence() {
  const { items: liveItems, live } = useIntelligence()
  const [items, setItems] = useState<IntelligenceItem[]>(liveItems)
  const [showForm, setShowForm] = useState(false)
  const [draft, setDraft] = useState({ type: "development" as IntelType, title: "", location: "", desc: "", change: 0, affected: 0, sourceLabel: "" })
  const [posted, setPosted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Adopt database rows when they arrive
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing list to async-loaded records
    setItems(liveItems)
  }, [liveItems])

  const publish = async () => {
    if (!draft.title.trim()) return
    const meta = typeMeta[draft.type]
    const payload = {
      type: draft.type,
      category: meta.category,
      title: draft.title.trim(),
      location: draft.location.trim(),
      affected: draft.affected,
      desc: draft.desc.trim(),
      change: draft.change,
      sourceLabel: draft.sourceLabel.trim() || "NestFund Research",
    }
    setError(null)
    try {
      let newItem: IntelligenceItem | null = null
      if (live) newItem = await publishIntelligence(payload)
      setItems(prev => [newItem ?? {
        id: String(Date.now()),
        type: payload.type,
        category: payload.category,
        title: payload.title,
        location: payload.location,
        affectedProps: payload.affected,
        desc: payload.desc,
        change: payload.change,
        timeAgo: "just now",
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=70",
        sourceLabel: payload.sourceLabel,
        sourceUrl: "#",
      }, ...prev])
      setDraft({ type: "development", title: "", location: "", desc: "", change: 0, affected: 0, sourceLabel: "" })
      setShowForm(false)
      setPosted(true)
      setTimeout(() => setPosted(false), 4000)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Publish failed")
    }
  }

  const remove = async (id: string) => {
    setError(null)
    try {
      if (live) await deleteIntelligence(id)
      setItems(prev => prev.filter(x => x.id !== id))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed")
    }
  }

  return (
    <>
      <PageHeader
        title="Market Intelligence"
        subtitle="News and alerts shown on the Intelligence page and homepage feed"
        action={
          <button onClick={() => setShowForm(s => !s)} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer", background: showForm ? "#64748b" : "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "#fff", fontSize: 13, fontWeight: 700 }}>
            {showForm ? <XMarkIcon style={{ width: 15, height: 15 }} /> : <PlusIcon style={{ width: 15, height: 15 }} />}
            {showForm ? "Cancel" : "Post Update"}
          </button>
        }
      />

      {posted && (
        <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #dcfce7", borderRadius: 11, padding: "11px 16px", marginBottom: 16 }}>
          <p style={{ fontSize: 12.5, fontWeight: 600, color: "#166534", margin: 0 }}>
            ✓ Published{isSupabaseConfigured() ? " to database — live on the site" : " (session only — connect the database to persist)"}
          </p>
        </div>
      )}
      {error && (
        <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 11, padding: "11px 16px", marginBottom: 16 }}>
          <p style={{ fontSize: 12.5, fontWeight: 600, color: "#dc2626", margin: 0, lineHeight: 1.55 }}>{error}</p>
        </div>
      )}

      {/* Compose form */}
      {showForm && (
        <Card title="New Intelligence Update" style={{ marginBottom: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))", gap: 14, marginBottom: 14 }}>
            <div>
              <label style={fieldLabel}>Type</label>
              <select style={{ ...fieldInput, cursor: "pointer" }} value={draft.type} onChange={e => setDraft(d => ({ ...d, type: e.target.value as IntelType }))}>
                {(Object.keys(typeMeta) as IntelType[]).map(t => <option key={t} value={t}>{typeMeta[t].label}</option>)}
              </select>
            </div>
            <div>
              <label style={fieldLabel}>Location</label>
              <input style={fieldInput} value={draft.location} onChange={e => setDraft(d => ({ ...d, location: e.target.value }))} placeholder="e.g. Kira Town, Wakiso" />
            </div>
            <div>
              <label style={fieldLabel}>Expected Impact (%)</label>
              <input style={fieldInput} inputMode="decimal" value={String(draft.change)} onChange={e => setDraft(d => ({ ...d, change: parseFloat(e.target.value) || 0 }))} placeholder="+11 or -8" />
            </div>
            <div>
              <label style={fieldLabel}>Affected Properties</label>
              <input style={fieldInput} inputMode="numeric" value={String(draft.affected)} onChange={e => setDraft(d => ({ ...d, affected: parseInt(e.target.value) || 0 }))} />
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={fieldLabel}>Headline</label>
            <input style={fieldInput} value={draft.title} onChange={e => setDraft(d => ({ ...d, title: e.target.value }))} placeholder="e.g. New Ring Road Approved for Wakiso" />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={fieldLabel}>Details</label>
            <textarea style={{ ...fieldInput, minHeight: 70, resize: "vertical", fontFamily: "inherit" }} value={draft.desc} onChange={e => setDraft(d => ({ ...d, desc: e.target.value }))} placeholder="What happened and what it means for property values..." />
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={fieldLabel}>Source</label>
              <input style={fieldInput} value={draft.sourceLabel} onChange={e => setDraft(d => ({ ...d, sourceLabel: e.target.value }))} placeholder="e.g. Uganda National Roads Authority" />
            </div>
            <button onClick={publish} style={{ padding: "11px 26px", borderRadius: 10, border: "none", cursor: "pointer", background: "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "#fff", fontSize: 13, fontWeight: 700 }}>
              Publish
            </button>
          </div>
        </Card>
      )}

      {/* Feed */}
      <Card style={{ padding: 0 }}>
        {items.map((item, i) => {
          const meta = typeMeta[item.type]
          return (
            <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", borderTop: i === 0 ? "none" : "1px solid #f4f6f9" }}>
              <span style={{ fontSize: 9.5, fontWeight: 800, color: meta.color, backgroundColor: meta.bg, padding: "4px 10px", borderRadius: 99, letterSpacing: "0.04em", flexShrink: 0 }}>{item.category}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</p>
                <p style={{ fontSize: 11.5, color: "#94a3b8", margin: 0 }}>{item.location} · {item.affectedProps} properties affected · {item.sourceLabel}</p>
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: item.change >= 0 ? "#10b981" : "#ef4444", flexShrink: 0 }}>
                {item.change >= 0 ? "+" : ""}{item.change}%
              </span>
              <span style={{ fontSize: 11, color: "#b6c1cf", flexShrink: 0, minWidth: 52, textAlign: "right" }}>{item.timeAgo}</span>
              <button onClick={() => remove(item.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", flexShrink: 0 }}>
                <TrashIcon style={{ width: 14, height: 14, color: "#cbd5e1" }} />
              </button>
            </div>
          )
        })}
      </Card>
    </>
  )
}
