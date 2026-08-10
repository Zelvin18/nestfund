"use client"

import { useState, useEffect } from "react"
import { UserGroupIcon, PlusIcon, XMarkIcon, EnvelopeIcon, PhoneIcon, BuildingOffice2Icon } from "@heroicons/react/24/outline"
import { PageHeader, Card, fieldLabel, fieldInput } from "@/components/admin/AdminShell"
import { fetchManagers, createManager, setManagerActive, setPropertyManager, type Manager } from "@/lib/api"
import { useRentals } from "@/lib/hooks"

const emptyForm = { fullName: "", email: "", phone: "", company: "" }

export default function AdminManagers() {
  const { rentals, live } = useRentals()
  const [managers, setManagers] = useState<Manager[]>([])
  const [loaded, setLoaded] = useState(false)
  const [assignments, setAssignments] = useState<Record<string, string | null>>({})
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [busy, setBusy] = useState(false)
  const [flash, setFlash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    fetchManagers()
      .then(d => { if (active) { if (d) setManagers(d); setLoaded(true) } })
      .catch(() => { if (active) setLoaded(true) })
    return () => { active = false }
  }, [])

  // Seed assignment map from property records
  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect -- syncing to async-loaded records */
    setAssignments(Object.fromEntries(rentals.map(p => [p.id, p.managerId ?? null])))
  }, [rentals])

  const notify = (msg: string) => { setFlash(msg); setTimeout(() => setFlash(null), 3500) }

  const add = async () => {
    if (form.fullName.trim().length < 3 || !/\S+@\S+\.\S+/.test(form.email)) return
    setBusy(true)
    setError(null)
    try {
      if (live) {
        const m = await createManager(form)
        setManagers(prev => [...prev, m])
      } else {
        setManagers(prev => [...prev, { id: String(Date.now()), ...form, isActive: true, createdAt: new Date().toISOString() }])
      }
      setForm(emptyForm)
      setShowForm(false)
      notify("Manager added")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not add manager")
    } finally { setBusy(false) }
  }

  const toggleActive = async (m: Manager) => {
    setError(null)
    try {
      if (live) await setManagerActive(m.id, !m.isActive)
      setManagers(prev => prev.map(x => x.id === m.id ? { ...x, isActive: !x.isActive } : x))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed")
    }
  }

  const assign = async (propertyId: string, managerId: string | null) => {
    setError(null)
    try {
      if (live) await setPropertyManager(propertyId, managerId)
      setAssignments(prev => ({ ...prev, [propertyId]: managerId }))
      notify(managerId ? "Property assigned" : "Property unassigned")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Assignment failed")
    }
  }

  const propsOf = (managerId: string) => rentals.filter(p => assignments[p.id] === managerId)
  const unassigned = rentals.filter(p => !assignments[p.id])

  return (
    <>
      <PageHeader
        title="Property Managers"
        subtitle="Each property can have a manager who maintains its details, income records, and updates — manager logins arrive with auth"
        action={
          <button onClick={() => setShowForm(s => !s)} style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer", background: showForm ? "#64748b" : "linear-gradient(135deg, #2563eb, #4f46e5)", color: "#fff", fontSize: 13, fontWeight: 750 }}>
            {showForm ? <XMarkIcon style={{ width: 15, height: 15 }} /> : <PlusIcon style={{ width: 15, height: 15 }} />}
            {showForm ? "Cancel" : "Add Manager"}
          </button>
        }
      />

      {flash && (
        <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #dcfce7", borderRadius: 11, padding: "11px 16px", marginBottom: 16 }}>
          <p style={{ fontSize: 12.5, fontWeight: 650, color: "#166534", margin: 0 }}>✓ {flash}{!live && " (session only)"}</p>
        </div>
      )}
      {error && (
        <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 11, padding: "11px 16px", marginBottom: 16 }}>
          <p style={{ fontSize: 12.5, fontWeight: 650, color: "#dc2626", margin: 0, lineHeight: 1.55 }}>{error}</p>
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <Card title="New Property Manager" subtitle="They receive a login invitation once accounts launch" style={{ marginBottom: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))", gap: 14, marginBottom: 16 }}>
            <div>
              <label style={fieldLabel}>Full Name *</label>
              <input style={fieldInput} value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="e.g. Henry Mawire" />
            </div>
            <div>
              <label style={fieldLabel}>Email *</label>
              <input style={fieldInput} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="manager@company.com" />
            </div>
            <div>
              <label style={fieldLabel}>Phone</label>
              <input style={fieldInput} inputMode="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+256 7XX XXX XXX" />
            </div>
            <div>
              <label style={fieldLabel}>Company</label>
              <input style={fieldInput} value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} placeholder="e.g. Ibis Properties Ltd" />
            </div>
          </div>
          <button onClick={add} disabled={busy} style={{ padding: "11px 26px", borderRadius: 10, border: "none", cursor: "pointer", background: "linear-gradient(135deg, #2563eb, #4f46e5)", color: "#fff", fontSize: 13, fontWeight: 750, opacity: busy ? 0.7 : 1 }}>
            {busy ? "Adding..." : "Add Manager"}
          </button>
        </Card>
      )}

      {/* Empty state */}
      {loaded && managers.length === 0 && (
        <Card style={{ marginBottom: 18 }}>
          <div style={{ textAlign: "center", padding: "26px 0" }}>
            <UserGroupIcon style={{ width: 34, height: 34, color: "#cbd5e1", margin: "0 auto 12px" }} />
            <p style={{ fontSize: 14.5, fontWeight: 700, color: "#0b1220", margin: "0 0 5px 0" }}>No managers yet</p>
            <p style={{ fontSize: 12.5, color: "#94a3b8", margin: 0 }}>Add your first property manager and assign them properties below.</p>
          </div>
        </Card>
      )}

      {/* Manager cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(340px, 100%), 1fr))", gap: 15, marginBottom: 18 }}>
        {managers.map(m => {
          const assigned = propsOf(m.id)
          return (
            <Card key={m.id} style={{ opacity: m.isActive ? 1 : 0.6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", backgroundColor: "#f1f5f9", border: "1px solid #e8edf4", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: "#64748b", flexShrink: 0 }}>
                  {m.fullName.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14.5, fontWeight: 750, color: "#0b1220", margin: 0 }}>{m.fullName}</p>
                  <p style={{ fontSize: 11.5, color: "#94a3b8", margin: 0 }}>{m.company || "Independent"}</p>
                </div>
                <button onClick={() => toggleActive(m)} style={{
                  fontSize: 10.5, fontWeight: 750, padding: "4px 12px", borderRadius: 99, cursor: "pointer",
                  border: `1px solid ${m.isActive ? "#dcfce7" : "#e2e8f0"}`,
                  backgroundColor: m.isActive ? "#f0fdf4" : "#f8fafc",
                  color: m.isActive ? "#16a34a" : "#94a3b8",
                }}>
                  {m.isActive ? "ACTIVE" : "INACTIVE"}
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 5, marginBottom: 14 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#64748b" }}>
                  <EnvelopeIcon style={{ width: 13, height: 13, flexShrink: 0 }} /> {m.email}
                </span>
                {m.phone && (
                  <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#64748b" }}>
                    <PhoneIcon style={{ width: 13, height: 13, flexShrink: 0 }} /> {m.phone}
                  </span>
                )}
              </div>

              {/* Assigned properties */}
              <p style={{ fontSize: 10.5, fontWeight: 750, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px 0" }}>
                Assigned Properties ({assigned.length})
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
                {assigned.map(p => (
                  <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 9, backgroundColor: "#f8fafc", border: "1px solid #eef1f5", borderRadius: 9, padding: "7px 10px" }}>
                    <img src={p.image} alt="" style={{ width: 32, height: 24, borderRadius: 6, objectFit: "cover", flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 12, fontWeight: 650, color: "#0b1220", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
                    <button onClick={() => assign(p.id, null)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex" }}>
                      <XMarkIcon style={{ width: 13, height: 13, color: "#cbd5e1" }} />
                    </button>
                  </div>
                ))}
                {assigned.length === 0 && <p style={{ fontSize: 12, color: "#c3ccd9", margin: 0 }}>None yet</p>}
              </div>

              {/* Assign dropdown */}
              {unassigned.length > 0 && m.isActive && (
                <select
                  value=""
                  onChange={e => e.target.value && assign(e.target.value, m.id)}
                  style={{ ...fieldInput, cursor: "pointer", fontSize: 12.5 }}
                >
                  <option value="">+ Assign a property…</option>
                  {unassigned.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              )}
            </Card>
          )
        })}
      </div>

      {/* Unassigned strip */}
      <Card title="Unassigned Properties" subtitle="Listings with no manager yet" icon={BuildingOffice2Icon}>
        {unassigned.length === 0 ? (
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Every property has a manager. ✓</p>
        ) : (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {unassigned.map(p => (
              <span key={p.id} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12, fontWeight: 650, color: "#92400e", backgroundColor: "#fffbeb", border: "1px solid #fde68a", borderRadius: 99, padding: "6px 13px" }}>
                {p.name}
              </span>
            ))}
          </div>
        )}
      </Card>
    </>
  )
}
