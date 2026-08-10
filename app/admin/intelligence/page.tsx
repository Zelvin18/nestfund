"use client"

import { useState, useEffect } from "react"
import { PlusIcon, TrashIcon, XMarkIcon, MapPinIcon, PencilSquareIcon } from "@heroicons/react/24/outline"
import { PageHeader, Card, fieldLabel, fieldInput } from "@/components/admin/AdminShell"
import { type IntelligenceItem, type IntelType } from "@/lib/data/intelligence"
import { useIntelligence, useRentals, useConstruction } from "@/lib/hooks"
import { publishIntelligence, deleteIntelligence, updateIntelligence } from "@/lib/api"
import { isSupabaseConfigured } from "@/lib/supabase"

const typeMeta: Record<IntelType, { label: string; color: string; bg: string; category: string }> = {
  approval:    { label: "Government Approval", color: "#2563eb", bg: "#eff6ff", category: "GOVT. APPROVAL" },
  development: { label: "Development",         color: "#0d9488", bg: "#f0fdfa", category: "DEVELOPMENT" },
  decline:     { label: "Risk Alert",          color: "#dc2626", bg: "#fef2f2", category: "RISK ALERT" },
}

const emptyDraft = { type: "development" as IntelType, title: "", location: "", desc: "", change: 0, affected: 0, sourceLabel: "", image: "", affectedPropertyIds: [] as string[] }

/* Chip multi-select for linking news to listed properties */
function PropertyPicker({ selected, onToggle, options }: {
  selected: string[]
  onToggle: (id: string) => void
  options: { id: string; name: string; kind: string }[]
}) {
  return (
    <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
      {options.map(o => {
        const active = selected.includes(o.id)
        return (
          <button key={o.id} onClick={() => onToggle(o.id)} style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            padding: "7px 13px", borderRadius: 99, fontSize: 12, fontWeight: 650, cursor: "pointer",
            border: active ? "1.5px solid #2563eb" : "1.5px solid #e8ecf0",
            backgroundColor: active ? "#eff6ff" : "#fff",
            color: active ? "#1d4ed8" : "#64748b",
          }}>
            {active ? "✓ " : ""}{o.name}
            <span style={{ fontSize: 9, fontWeight: 800, color: active ? "#60a5fa" : "#b6c1cf", textTransform: "uppercase" }}>{o.kind}</span>
          </button>
        )
      })}
    </div>
  )
}

export default function AdminIntelligence() {
  const { items: liveItems, live } = useIntelligence()
  const { rentals } = useRentals()
  const { projects } = useConstruction()
  const propertyOptions = [
    ...rentals.map(p => ({ id: p.id, name: p.name, kind: "Rental" })),
    ...projects.map(p => ({ id: p.id, name: p.name, kind: "Build" })),
  ]
  const [items, setItems] = useState<IntelligenceItem[]>(liveItems)
  const [showForm, setShowForm] = useState(false)
  const [draft, setDraft] = useState(emptyDraft)
  const [editing, setEditing] = useState<IntelligenceItem | null>(null)
  const [posted, setPosted] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing list to async-loaded records
    setItems(liveItems)
  }, [liveItems])

  const flash = (msg: string) => { setPosted(msg); setTimeout(() => setPosted(null), 4000) }

  const publish = async () => {
    if (!draft.title.trim()) return
    const meta = typeMeta[draft.type]
    const payload = {
      type: draft.type, category: meta.category, title: draft.title.trim(),
      location: draft.location.trim(), affected: draft.affected,
      desc: draft.desc.trim(), change: draft.change,
      sourceLabel: draft.sourceLabel.trim() || "NestFund Research",
      image: draft.image.trim(),
      affectedPropertyIds: draft.affectedPropertyIds,
    }
    setError(null)
    setBusy(true)
    try {
      let newItem: IntelligenceItem | null = null
      if (live) newItem = await publishIntelligence(payload)
      setItems(prev => [newItem ?? {
        id: String(Date.now()), type: payload.type, category: payload.category,
        title: payload.title, location: payload.location, affectedProps: payload.affected,
        affectedPropertyIds: payload.affectedPropertyIds,
        desc: payload.desc, change: payload.change, timeAgo: "just now",
        image: payload.image || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=70",
        sourceLabel: payload.sourceLabel, sourceUrl: "#",
      }, ...prev])
      setDraft(emptyDraft)
      setShowForm(false)
      flash("Published — live on the site")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Publish failed")
    } finally { setBusy(false) }
  }

  const saveEdit = async () => {
    if (!editing) return
    setError(null)
    setBusy(true)
    try {
      if (live) await updateIntelligence(editing.id, {
        title: editing.title, location: editing.location, desc: editing.desc,
        change: editing.change, affected: editing.affectedProps,
        image: editing.image, sourceLabel: editing.sourceLabel,
        affectedPropertyIds: editing.affectedPropertyIds,
      })
      setItems(prev => prev.map(x => x.id === editing.id ? editing : x))
      setEditing(null)
      flash("Update saved — live on the site")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed")
    } finally { setBusy(false) }
  }

  const remove = async (id: string) => {
    setError(null)
    try {
      if (live) await deleteIntelligence(id)
      setItems(prev => prev.filter(x => x.id !== id))
      setEditing(null)
      flash("Deleted")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed")
    }
  }

  return (
    <>
      <PageHeader
        title="Market Intelligence"
        subtitle="News and alerts on the Intelligence page and homepage feed — click a card to edit it"
        action={
          <button onClick={() => setShowForm(s => !s)} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer", background: showForm ? "#64748b" : "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "#fff", fontSize: 13, fontWeight: 750, boxShadow: showForm ? "none" : "0 4px 14px rgba(124,58,237,0.3)" }}>
            {showForm ? <XMarkIcon style={{ width: 15, height: 15 }} /> : <PlusIcon style={{ width: 15, height: 15 }} />}
            {showForm ? "Cancel" : "Post Update"}
          </button>
        }
      />

      {posted && (
        <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #dcfce7", borderRadius: 11, padding: "11px 16px", marginBottom: 16 }}>
          <p style={{ fontSize: 12.5, fontWeight: 650, color: "#166534", margin: 0 }}>✓ {posted}{!isSupabaseConfigured() && " (session only)"}</p>
        </div>
      )}
      {error && (
        <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 11, padding: "11px 16px", marginBottom: 16 }}>
          <p style={{ fontSize: 12.5, fontWeight: 650, color: "#dc2626", margin: 0, lineHeight: 1.55 }}>{error}</p>
        </div>
      )}

      {/* Compose form */}
      {showForm && (
        <Card title="New Intelligence Update" style={{ marginBottom: 18 }}>
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
          <div style={{ marginBottom: 14 }}>
            <label style={fieldLabel}>Media — Cover Image URL</label>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <input style={{ ...fieldInput, flex: 1 }} value={draft.image} onChange={e => setDraft(d => ({ ...d, image: e.target.value }))} placeholder="Paste image URL — shown on the news card (file uploads come with storage)" />
              {draft.image.trim() && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={draft.image.trim()} alt="Preview" style={{ width: 96, height: 60, borderRadius: 9, objectFit: "cover", border: "1.5px solid #e2e8f0", flexShrink: 0 }} />
              )}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={fieldLabel}>Affected Properties — shown to investors as clickable chips</label>
            <PropertyPicker
              selected={draft.affectedPropertyIds}
              onToggle={id => setDraft(d => ({ ...d, affectedPropertyIds: d.affectedPropertyIds.includes(id) ? d.affectedPropertyIds.filter(x => x !== id) : [...d.affectedPropertyIds, id] }))}
              options={propertyOptions}
            />
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <label style={fieldLabel}>Source</label>
              <input style={fieldInput} value={draft.sourceLabel} onChange={e => setDraft(d => ({ ...d, sourceLabel: e.target.value }))} placeholder="e.g. Uganda National Roads Authority" />
            </div>
            <button onClick={publish} disabled={busy} style={{ padding: "11px 26px", borderRadius: 10, border: "none", cursor: "pointer", background: "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "#fff", fontSize: 13, fontWeight: 750, opacity: busy ? 0.7 : 1 }}>
              {busy ? "Publishing..." : "Publish"}
            </button>
          </div>
        </Card>
      )}

      {/* ── Card grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(310px, 100%), 1fr))", gap: 15 }}>
        {items.map(item => {
          const meta = typeMeta[item.type]
          return (
            <button key={item.id} onClick={() => setEditing({ ...item })} style={{ textAlign: "left", border: "none", background: "none", padding: 0, cursor: "pointer" }}>
              <div className="admin-card" style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #e5eaf2", overflow: "hidden", boxShadow: "0 1px 3px rgba(15,23,42,0.04)" }}>
                {/* Banner */}
                <div style={{ position: "relative", height: 140 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", backgroundColor: "#f1f5f9" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,17,32,0.55) 0%, transparent 55%)" }} />
                  <span style={{ position: "absolute", top: 11, left: 11, fontSize: 9.5, fontWeight: 800, color: meta.color, backgroundColor: "rgba(255,255,255,0.94)", padding: "4px 11px", borderRadius: 99, letterSpacing: "0.04em" }}>{item.category}</span>
                  <span style={{
                    position: "absolute", top: 11, right: 11, fontSize: 12.5, fontWeight: 800,
                    color: "#fff", backgroundColor: item.change >= 0 ? "rgba(16,185,129,0.92)" : "rgba(239,68,68,0.92)",
                    padding: "4px 11px", borderRadius: 99,
                  }}>{item.change >= 0 ? "+" : ""}{item.change}%</span>
                  <span style={{ position: "absolute", bottom: 10, left: 12, display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 650, color: "rgba(255,255,255,0.92)" }}>
                    <MapPinIcon style={{ width: 12, height: 12 }} /> {item.location}
                  </span>
                </div>
                {/* Body */}
                <div style={{ padding: "14px 16px 16px" }}>
                  <h3 style={{ fontSize: 15, fontWeight: 750, color: "#0b1220", margin: "0 0 6px 0", lineHeight: 1.35 }}>{item.title}</h3>
                  <p style={{ fontSize: 12.5, color: "#7c8ba1", margin: "0 0 12px 0", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{item.desc}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: "#a6b2c3" }}>{item.sourceLabel} · {item.timeAgo}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5, fontWeight: 750, color: "#7c3aed" }}>
                      <PencilSquareIcon style={{ width: 13, height: 13 }} /> Edit
                    </span>
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* ── Edit modal ── */}
      {editing && (
        <div onClick={() => setEditing(null)} style={{ position: "fixed", inset: 0, zIndex: 100, backgroundColor: "rgba(10,17,32,0.55)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: "#fff", borderRadius: 20, width: "100%", maxWidth: 560, maxHeight: "92vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.35)", animation: "modal-in 0.25s ease-out" }}>
            {/* Banner preview */}
            <div style={{ position: "relative", height: 150 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={editing.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", backgroundColor: "#f1f5f9", borderRadius: "20px 20px 0 0" }} />
              <button onClick={() => setEditing(null)} style={{ position: "absolute", top: 12, right: 12, width: 32, height: 32, borderRadius: 9, border: "none", cursor: "pointer", backgroundColor: "rgba(10,17,32,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <XMarkIcon style={{ width: 16, height: 16, color: "#fff" }} />
              </button>
              <span style={{ position: "absolute", bottom: 10, left: 14, fontSize: 9.5, fontWeight: 800, color: typeMeta[editing.type].color, backgroundColor: "rgba(255,255,255,0.94)", padding: "4px 11px", borderRadius: 99 }}>{editing.category}</span>
            </div>
            <div style={{ padding: "20px 24px 24px" }}>
              <div style={{ marginBottom: 13 }}>
                <label style={fieldLabel}>Headline</label>
                <input style={fieldInput} value={editing.title} onChange={e => setEditing(v => v ? { ...v, title: e.target.value } : v)} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 13 }}>
                <div>
                  <label style={fieldLabel}>Location</label>
                  <input style={fieldInput} value={editing.location} onChange={e => setEditing(v => v ? { ...v, location: e.target.value } : v)} />
                </div>
                <div>
                  <label style={fieldLabel}>Impact (%)</label>
                  <input style={fieldInput} inputMode="decimal" value={String(editing.change)} onChange={e => setEditing(v => v ? { ...v, change: parseFloat(e.target.value) || 0 } : v)} />
                </div>
                <div>
                  <label style={fieldLabel}>Affected</label>
                  <input style={fieldInput} inputMode="numeric" value={String(editing.affectedProps)} onChange={e => setEditing(v => v ? { ...v, affectedProps: parseInt(e.target.value) || 0 } : v)} />
                </div>
              </div>
              <div style={{ marginBottom: 13 }}>
                <label style={fieldLabel}>Details</label>
                <textarea style={{ ...fieldInput, minHeight: 84, resize: "vertical", fontFamily: "inherit", lineHeight: 1.6 }} value={editing.desc} onChange={e => setEditing(v => v ? { ...v, desc: e.target.value } : v)} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 13 }}>
                <div>
                  <label style={fieldLabel}>Cover Image URL</label>
                  <input style={fieldInput} value={editing.image} onChange={e => setEditing(v => v ? { ...v, image: e.target.value } : v)} />
                </div>
                <div>
                  <label style={fieldLabel}>Source</label>
                  <input style={fieldInput} value={editing.sourceLabel} onChange={e => setEditing(v => v ? { ...v, sourceLabel: e.target.value } : v)} />
                </div>
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={fieldLabel}>Affected Properties</label>
                <PropertyPicker
                  selected={editing.affectedPropertyIds}
                  onToggle={id => setEditing(v => v ? { ...v, affectedPropertyIds: v.affectedPropertyIds.includes(id) ? v.affectedPropertyIds.filter(x => x !== id) : [...v.affectedPropertyIds, id] } : v)}
                  options={propertyOptions}
                />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={saveEdit} disabled={busy} style={{ flex: 1, padding: "12px 0", borderRadius: 11, border: "none", cursor: "pointer", background: "linear-gradient(135deg, #7c3aed, #6d28d9)", color: "#fff", fontSize: 14, fontWeight: 750, opacity: busy ? 0.7 : 1 }}>
                  {busy ? "Saving..." : "Save Changes"}
                </button>
                <button onClick={() => remove(editing.id)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "12px 18px", borderRadius: 11, border: "1.5px solid #fecaca", backgroundColor: "#fef2f2", color: "#dc2626", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  <TrashIcon style={{ width: 14, height: 14 }} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
