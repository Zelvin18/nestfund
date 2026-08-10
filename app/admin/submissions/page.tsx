"use client"

import { useState, useEffect } from "react"
import { InboxArrowDownIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline"
import { PageHeader, Card, fieldInput } from "@/components/admin/AdminShell"
import { fetchSubmissions, updateSubmissionStatus, type ProjectSubmission } from "@/lib/api"

const statusMeta: Record<string, { label: string; color: string; bg: string }> = {
  "submitted":    { label: "New", color: "#2563eb", bg: "#eff6ff" },
  "under-review": { label: "Under Review", color: "#d97706", bg: "#fffbeb" },
  "needs-info":   { label: "Needs Info", color: "#7c3aed", bg: "#f5f3ff" },
  "approved":     { label: "Approved", color: "#16a34a", bg: "#f0fdf4" },
  "rejected":     { label: "Rejected", color: "#dc2626", bg: "#fef2f2" },
  "listed":       { label: "Listed", color: "#0d9488", bg: "#f0fdfa" },
}

const typeLabel: Record<string, string> = {
  "land": "Land",
  "apartment-development": "Apartment Development",
  "commercial-property": "Commercial Property",
  "residential-property": "Residential Property",
  "hotel": "Hotel",
  "construction-project": "Construction Project",
  "other": "Other",
}

const fmtUGX = (v: number) => v >= 1e9 ? `UGX ${(v / 1e9).toFixed(1)}B` : v >= 1e6 ? `UGX ${(v / 1e6).toFixed(0)}M` : `UGX ${v.toLocaleString()}`

export default function AdminSubmissions() {
  const [subs, setSubs] = useState<ProjectSubmission[] | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
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

  return (
    <>
      <PageHeader
        title="Project Submissions"
        subtitle="Applications from developers, landowners, and property owners — the supply side of the marketplace"
      />

      {error && (
        <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 11, padding: "11px 16px", marginBottom: 16 }}>
          <p style={{ fontSize: 12.5, fontWeight: 600, color: "#dc2626", margin: 0, lineHeight: 1.55 }}>{error}</p>
        </div>
      )}

      {!loaded && (
        <Card><p style={{ fontSize: 13, color: "#94a3b8", margin: 0, padding: "12px 0" }}>Loading submissions…</p></Card>
      )}

      {loaded && (!subs || subs.length === 0) && (
        <Card>
          <div style={{ textAlign: "center", padding: "28px 0" }}>
            <InboxArrowDownIcon style={{ width: 36, height: 36, color: "#cbd5e1", margin: "0 auto 12px" }} />
            <p style={{ fontSize: 14.5, fontWeight: 700, color: "#0b1220", margin: "0 0 5px 0" }}>No submissions yet</p>
            <p style={{ fontSize: 12.5, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>
              Applications from the For Developers page will appear here.<br />
              If you expect data, make sure supabase/developers-schema.sql has been run.
            </p>
          </div>
        </Card>
      )}

      {subs && subs.length > 0 && (
        <Card style={{ padding: 0 }} title={`${subs.length} application${subs.length === 1 ? "" : "s"}`} subtitle="Newest first" icon={InboxArrowDownIcon} accent="#0d9488">
          <div style={{ marginTop: -4 }}>
            {subs.map(s => {
              const meta = statusMeta[s.status] ?? statusMeta["submitted"]
              const open = openId === s.id
              return (
                <div key={s.id} style={{ borderTop: "1px solid #f2f5f9" }}>
                  {/* Row */}
                  <button
                    onClick={() => setOpenId(open ? null : s.id)}
                    className="admin-table-row"
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "15px 22px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 750, color: "#0b1220", margin: "0 0 2px 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.projectName}</p>
                      <p style={{ fontSize: 11.5, color: "#94a3b8", margin: 0 }}>
                        {typeLabel[s.submissionType] ?? s.submissionType} · {s.location} · {s.contactName}{s.company ? ` (${s.company})` : ""}
                      </p>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#0b1220", flexShrink: 0, whiteSpace: "nowrap" }}>{fmtUGX(s.capitalSought)}</span>
                    <span style={{ fontSize: 10.5, fontWeight: 750, color: meta.color, backgroundColor: meta.bg, padding: "4px 12px", borderRadius: 99, flexShrink: 0, whiteSpace: "nowrap" }}>{meta.label}</span>
                    {open ? <ChevronUpIcon style={{ width: 15, height: 15, color: "#94a3b8", flexShrink: 0 }} /> : <ChevronDownIcon style={{ width: 15, height: 15, color: "#94a3b8", flexShrink: 0 }} />}
                  </button>

                  {/* Detail */}
                  {open && (
                    <div style={{ padding: "0 22px 20px", animation: "fade-up 0.25s ease-out" }}>
                      <div style={{ backgroundColor: "#f8fafc", borderRadius: 12, padding: "16px 18px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))", gap: "12px 20px", marginBottom: 14 }}>
                          {[
                            ["Estimated Value", s.estimatedValue ? fmtUGX(s.estimatedValue) : "—"],
                            ["Size", s.sizeDetails || "—"],
                            ["Stage", s.developmentStage || "—"],
                            ["Completion", s.expectedCompletion || "—"],
                            ["Ownership", s.ownership || "—"],
                            ["Contact", `${s.contactEmail}${s.contactPhone ? ` · ${s.contactPhone}` : ""}`],
                          ].map(([label, value]) => (
                            <div key={label as string}>
                              <p style={{ fontSize: 10.5, fontWeight: 750, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 3px 0" }}>{label}</p>
                              <p style={{ fontSize: 13, fontWeight: 600, color: "#0b1220", margin: 0, wordBreak: "break-word" }}>{value}</p>
                            </div>
                          ))}
                        </div>
                        {s.description && (
                          <p style={{ fontSize: 13, color: "#46536b", lineHeight: 1.65, margin: "0 0 12px 0", borderTop: "1px solid #eef1f5", paddingTop: 12 }}>{s.description}</p>
                        )}
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
                          {s.capitalUses.map(u => (
                            <span key={u} style={{ fontSize: 10.5, fontWeight: 700, color: "#0f766e", backgroundColor: "#f0fdfa", border: "1px solid #ccfbf1", borderRadius: 99, padding: "3px 10px" }}>{u}</span>
                          ))}
                          {s.documentsAvailable.map(d => (
                            <span key={d} style={{ fontSize: 10.5, fontWeight: 700, color: "#1d4ed8", backgroundColor: "#eff6ff", border: "1px solid #dbeafe", borderRadius: 99, padding: "3px 10px" }}>📄 {d}</span>
                          ))}
                        </div>
                      </div>

                      {/* Status control */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#46536b" }}>Set status:</span>
                        <select
                          value={s.status}
                          onChange={e => setStatus(s.id, e.target.value)}
                          style={{ ...fieldInput, width: "auto", cursor: "pointer", padding: "8px 12px" }}
                        >
                          {Object.entries(statusMeta).map(([key, m]) => (
                            <option key={key} value={key}>{m.label}</option>
                          ))}
                        </select>
                        <span style={{ fontSize: 11.5, color: "#a6b2c3" }}>
                          Submitted {new Date(s.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </>
  )
}
