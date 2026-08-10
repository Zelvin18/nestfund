"use client"

import { useState, useEffect } from "react"
import { BriefcaseIcon, EnvelopeIcon, PhoneIcon, DocumentTextIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline"
import { PageHeader, Card, fieldInput } from "@/components/admin/AdminShell"
import { fetchSubmissions, updateSubmissionStatus, type ProjectSubmission } from "@/lib/api"

const TOTAL_DOCS = 8

const statusMeta: Record<string, { label: string; color: string; bg: string; weight: number }> = {
  "submitted":    { label: "New", color: "#2563eb", bg: "#eff6ff", weight: 15 },
  "under-review": { label: "Under Review", color: "#d97706", bg: "#fffbeb", weight: 40 },
  "needs-info":   { label: "Needs Info", color: "#7c3aed", bg: "#f5f3ff", weight: 50 },
  "approved":     { label: "Approved", color: "#16a34a", bg: "#f0fdf4", weight: 85 },
  "rejected":     { label: "Rejected", color: "#dc2626", bg: "#fef2f2", weight: 100 },
  "listed":       { label: "Listed", color: "#0d9488", bg: "#f0fdfa", weight: 100 },
}

const typeLabel: Record<string, string> = {
  "land": "Land", "apartment-development": "Apartment Development",
  "commercial-property": "Commercial Property", "residential-property": "Residential Property",
  "hotel": "Hotel", "construction-project": "Construction Project", "other": "Other",
}

const fmtUGX = (v: number) => v >= 1e9 ? `UGX ${(v / 1e9).toFixed(1)}B` : v >= 1e6 ? `UGX ${(v / 1e6).toFixed(0)}M` : `UGX ${v.toLocaleString()}`

/** Application progress: half from documents provided, half from review stage */
const progressOf = (s: ProjectSubmission) =>
  Math.min(100, Math.round((s.documentsAvailable.length / TOTAL_DOCS) * 50 + (statusMeta[s.status]?.weight ?? 15) * 0.5))

interface Developer {
  email: string
  name: string
  phone: string
  company: string
  projects: ProjectSubmission[]
}

export default function AdminDevelopers() {
  const [subs, setSubs] = useState<ProjectSubmission[] | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [openEmail, setOpenEmail] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    fetchSubmissions()
      .then(d => { if (active) { setSubs(d); setLoaded(true) } })
      .catch(() => { if (active) setLoaded(true) })
    return () => { active = false }
  }, [])

  const setStatus = async (id: string, status: string) => {
    setError(null)
    try {
      await updateSubmissionStatus(id, status)
      setSubs(prev => prev ? prev.map(s => s.id === id ? { ...s, status } : s) : prev)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed")
    }
  }

  /* Group submissions by developer (contact email) */
  const developers: Developer[] = Object.values(
    (subs ?? []).reduce<Record<string, Developer>>((acc, s) => {
      const key = s.contactEmail.toLowerCase()
      if (!acc[key]) acc[key] = { email: s.contactEmail, name: s.contactName, phone: s.contactPhone, company: s.company, projects: [] }
      acc[key].projects.push(s)
      return acc
    }, {})
  )

  const totals = {
    developers: developers.length,
    projects: (subs ?? []).length,
    capital: (subs ?? []).reduce((sum, s) => sum + s.capitalSought, 0),
    live: (subs ?? []).filter(s => s.status === "listed").length,
  }

  return (
    <>
      <PageHeader
        title="Developers"
        subtitle="Everyone bringing properties and projects to NestFund — their submissions, documents, and application progress"
      />

      {error && (
        <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 11, padding: "11px 16px", marginBottom: 16 }}>
          <p style={{ fontSize: 12.5, fontWeight: 650, color: "#dc2626", margin: 0, lineHeight: 1.55 }}>{error}</p>
        </div>
      )}

      {/* Totals strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(180px, 100%), 1fr))", gap: 13, marginBottom: 18 }}>
        {[
          { label: "Developers", value: String(totals.developers) },
          { label: "Projects Submitted", value: String(totals.projects) },
          { label: "Capital Sought", value: totals.capital ? fmtUGX(totals.capital) : "—" },
          { label: "Listed on Platform", value: String(totals.live) },
        ].map(s => (
          <Card key={s.label} style={{ padding: "15px 18px" }}>
            <p style={{ fontSize: 20, fontWeight: 850, color: "#0b1220", margin: "0 0 2px 0", letterSpacing: "-0.4px" }}>{s.value}</p>
            <p style={{ fontSize: 11.5, fontWeight: 700, color: "#7c8ba1", margin: 0 }}>{s.label}</p>
          </Card>
        ))}
      </div>

      {!loaded && <Card><p style={{ fontSize: 13, color: "#94a3b8", margin: 0, padding: "10px 0" }}>Loading developers…</p></Card>}

      {loaded && developers.length === 0 && (
        <Card>
          <div style={{ textAlign: "center", padding: "28px 0" }}>
            <BriefcaseIcon style={{ width: 34, height: 34, color: "#cbd5e1", margin: "0 auto 12px" }} />
            <p style={{ fontSize: 14.5, fontWeight: 700, color: "#0b1220", margin: "0 0 5px 0" }}>No developers yet</p>
            <p style={{ fontSize: 12.5, color: "#94a3b8", margin: 0 }}>Everyone who applies through the For Developers page appears here with their projects.</p>
          </div>
        </Card>
      )}

      {/* Developer cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {developers.map(dev => {
          const open = openEmail === dev.email
          const totalSought = dev.projects.reduce((s, p) => s + p.capitalSought, 0)
          return (
            <Card key={dev.email} style={{ padding: 0 }}>
              {/* Header row */}
              <button
                onClick={() => setOpenEmail(open ? null : dev.email)}
                className="admin-table-row"
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "18px 22px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
              >
                <div style={{ width: 46, height: 46, borderRadius: "50%", backgroundColor: "#f1f5f9", border: "1px solid #e8edf4", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 17, color: "#64748b", flexShrink: 0 }}>
                  {dev.name.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 15, fontWeight: 800, color: "#0b1220", margin: "0 0 2px 0" }}>{dev.name}</p>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><EnvelopeIcon style={{ width: 12, height: 12 }} />{dev.email}</span>
                    {dev.phone && <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><PhoneIcon style={{ width: 12, height: 12 }} />{dev.phone}</span>}
                    {dev.company && <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}><BriefcaseIcon style={{ width: 12, height: 12 }} />{dev.company}</span>}
                  </p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontSize: 13.5, fontWeight: 800, color: "#0b1220", margin: 0 }}>{dev.projects.length} project{dev.projects.length === 1 ? "" : "s"}</p>
                  <p style={{ fontSize: 11.5, color: "#94a3b8", margin: 0 }}>{fmtUGX(totalSought)} sought</p>
                </div>
                {open ? <ChevronUpIcon style={{ width: 16, height: 16, color: "#94a3b8", flexShrink: 0 }} /> : <ChevronDownIcon style={{ width: 16, height: 16, color: "#94a3b8", flexShrink: 0 }} />}
              </button>

              {/* Projects */}
              {open && (
                <div style={{ padding: "0 22px 20px", animation: "fade-up 0.25s ease-out" }}>
                  {dev.projects.map(p => {
                    const meta = statusMeta[p.status] ?? statusMeta["submitted"]
                    const progress = progressOf(p)
                    return (
                      <div key={p.id} style={{ border: "1.5px solid #eef1f5", borderRadius: 14, padding: "16px 18px", marginBottom: 12 }}>
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
                          <div>
                            <p style={{ fontSize: 14.5, fontWeight: 750, color: "#0b1220", margin: "0 0 2px 0" }}>{p.projectName}</p>
                            <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                              {typeLabel[p.submissionType] ?? p.submissionType} · {p.location}
                              {p.estimatedValue ? ` · valued ${fmtUGX(p.estimatedValue)}` : ""}
                            </p>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 13.5, fontWeight: 800, color: "#0b1220" }}>{fmtUGX(p.capitalSought)}</span>
                            <span style={{ fontSize: 10.5, fontWeight: 750, color: meta.color, backgroundColor: meta.bg, padding: "4px 12px", borderRadius: 99 }}>{meta.label}</span>
                          </div>
                        </div>

                        {/* Application progress */}
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                          <span style={{ fontSize: 11.5, fontWeight: 650, color: "#64748b" }}>Application progress</span>
                          <span style={{ fontSize: 11.5, fontWeight: 800, color: "#0b1220" }}>{progress}%</span>
                        </div>
                        <div style={{ height: 6, borderRadius: 99, backgroundColor: "#f1f5f9", overflow: "hidden", marginBottom: 6 }}>
                          <div style={{ height: "100%", width: `${progress}%`, borderRadius: 99, backgroundColor: progress >= 85 ? "#10b981" : progress >= 40 ? "#2563eb" : "#f59e0b" }} />
                        </div>
                        <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 12px 0", display: "flex", alignItems: "center", gap: 5 }}>
                          <DocumentTextIcon style={{ width: 12, height: 12 }} />
                          Documents: {p.documentsAvailable.length}/{TOTAL_DOCS} confirmed
                        </p>

                        {/* Documents chips */}
                        {p.documentsAvailable.length > 0 && (
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
                            {p.documentsAvailable.map(d => (
                              <span key={d} style={{ fontSize: 10.5, fontWeight: 650, color: "#1d4ed8", backgroundColor: "#eff6ff", border: "1px solid #dbeafe", borderRadius: 99, padding: "3px 10px" }}>✓ {d}</span>
                            ))}
                          </div>
                        )}

                        {/* Action */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 11.5, fontWeight: 750, color: "#46536b" }}>Action:</span>
                          <select
                            value={p.status}
                            onChange={e => setStatus(p.id, e.target.value)}
                            style={{ ...fieldInput, width: "auto", cursor: "pointer", padding: "8px 12px", fontSize: 12.5 }}
                          >
                            {Object.entries(statusMeta).map(([key, m]) => <option key={key} value={key}>{m.label}</option>)}
                          </select>
                          <span style={{ fontSize: 11, color: "#b6c1cf" }}>
                            Submitted {new Date(p.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </Card>
          )
        })}
      </div>
    </>
  )
}
