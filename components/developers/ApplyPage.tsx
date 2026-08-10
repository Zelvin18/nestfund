"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ArrowRightIcon, ArrowLeftIcon,
  BuildingOffice2Icon, BanknotesIcon, DocumentTextIcon, ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline"
import { CheckCircleIcon, ShieldCheckIcon } from "@heroicons/react/24/solid"
import { submitProject } from "@/lib/api"

const submissionTypes = [
  { key: "land", label: "Land" },
  { key: "apartment-development", label: "Apartment Development" },
  { key: "commercial-property", label: "Commercial Property" },
  { key: "residential-property", label: "Residential Property" },
  { key: "hotel", label: "Hotel" },
  { key: "construction-project", label: "Construction Project" },
  { key: "other", label: "Other" },
]

const capitalUseOptions = ["Construction", "Land acquisition", "Renovation", "Infrastructure", "Expansion"]

const documentOptions = [
  "Title / deed documents",
  "Ownership documents",
  "Building plans",
  "Government approvals",
  "Valuation report",
  "Company documents",
  "Financial projections",
  "Construction plans",
]

const stages = ["Concept / Planning", "Approvals in progress", "Ready to break ground", "Under construction", "Completed / Operational"]

const steps = [
  { num: 1, title: "Project Type", icon: ClipboardDocumentListIcon },
  { num: 2, title: "Property Info", icon: BuildingOffice2Icon },
  { num: 3, title: "Investment", icon: BanknotesIcon },
  { num: 4, title: "Documents", icon: DocumentTextIcon },
]

const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", border: "1.5px solid #e2e8f0", borderRadius: 11,
  padding: "12px 15px", fontSize: 14, fontWeight: 500, color: "#0f172a", outline: "none",
}
const labelStyle: React.CSSProperties = {
  fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 7,
}

export default function ApplyPage() {
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    submissionType: "",
    projectName: "", location: "", sizeDetails: "", estimatedValue: 0,
    developmentStage: "", expectedCompletion: "", ownership: "", description: "",
    capitalSought: 0, capitalUses: [] as string[],
    documentsAvailable: [] as string[],
    contactName: "", contactEmail: "", contactPhone: "", company: "",
  })

  // Preselect the type from ?type= (client-only read avoids a Suspense boundary)
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("type")
    if (t && submissionTypes.some(s => s.key === t)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time init from the URL
      setForm(prev => prev.submissionType ? prev : { ...prev, submissionType: t })
    }
  }, [])

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
    setError(null)
  }

  const toggle = (key: "capitalUses" | "documentsAvailable", value: string) =>
    set(key, form[key].includes(value) ? form[key].filter(v => v !== value) : [...form[key], value])

  const num = (v: string) => { const n = parseInt(v.replace(/[^0-9]/g, ""), 10); return isNaN(n) ? 0 : n }

  const canNext =
    step === 1 ? form.submissionType !== "" :
    step === 2 ? form.projectName.trim().length >= 3 && form.location.trim().length >= 3 :
    step === 3 ? form.capitalSought >= 1000000 && form.contactName.trim().length >= 3 && /\S+@\S+\.\S+/.test(form.contactEmail) :
    true

  const submit = async () => {
    setSubmitting(true)
    setError(null)
    try {
      await submitProject(form)
      setDone(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Submission failed — please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div style={{ minHeight: "80vh", backgroundColor: "#f5f7fa", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ backgroundColor: "#fff", borderRadius: 20, border: "1px solid #e8ecf0", padding: "clamp(28px, 5vw, 44px)", maxWidth: 480, textAlign: "center", animation: "fade-up 0.35s ease-out" }}>
          <CheckCircleIcon style={{ width: 64, height: 64, color: "#10b981", margin: "0 auto 18px" }} />
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: "0 0 10px 0", letterSpacing: "-0.4px" }}>
            Application received
          </h1>
          <p style={{ fontSize: 14.5, color: "#64748b", lineHeight: 1.7, margin: "0 0 8px 0" }}>
            <strong style={{ color: "#0f172a" }}>{form.projectName}</strong> has been submitted for review.
            Our team verifies every application within <strong style={{ color: "#0f172a" }}>5 business days</strong> and
            will contact you at <strong style={{ color: "#0f172a" }}>{form.contactEmail}</strong>.
          </p>
          <p style={{ fontSize: 12.5, color: "#94a3b8", margin: "0 0 26px 0" }}>
            Next step: our verification team may request the documents you indicated.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/developers/dashboard" style={{ padding: "12px 24px", borderRadius: 11, background: "linear-gradient(135deg, #0d9488, #0f766e)", color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none" }}>
              Preview Dashboard
            </Link>
            <Link href="/developers" style={{ padding: "12px 22px", borderRadius: 11, border: "1.5px solid #e2e8f0", color: "#374151", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
              Back to For Developers
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e8ecf0" }}>
        <div className="container" style={{ maxWidth: 720, margin: "0 auto", padding: "26px 24px 22px" }}>
          <p style={{ fontSize: 11.5, fontWeight: 700, color: "#0d9488", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px 0" }}>NestFund Project Application</p>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: "0 0 4px 0", letterSpacing: "-0.4px" }}>Submit Your Project</h1>
          <p style={{ fontSize: 13.5, color: "#94a3b8", margin: 0 }}>About 10 minutes · reviewed within 5 business days</p>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 720, margin: "0 auto", padding: "28px 24px 64px" }}>
        {/* Stepper */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 30 }}>
          {steps.map((s, i) => {
            const state = step > s.num ? "done" : step === s.num ? "active" : "todo"
            return (
              <div key={s.num} style={{ display: "flex", alignItems: "center", flex: i === steps.length - 1 ? "0 0 auto" : 1 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, minWidth: 70 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    backgroundColor: state === "done" ? "#0d9488" : state === "active" ? "#2563eb" : "#fff",
                    border: state === "todo" ? "2px solid #e2e8f0" : "none",
                    transition: "all 0.3s",
                  }}>
                    {state === "done"
                      ? <CheckCircleIcon style={{ width: 20, height: 20, color: "#fff" }} />
                      : <s.icon style={{ width: 17, height: 17, color: state === "active" ? "#fff" : "#94a3b8" }} />}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: state === "active" ? 700 : 500, color: state === "active" ? "#0f172a" : state === "done" ? "#0d9488" : "#94a3b8", whiteSpace: "nowrap" }}>
                    {s.title}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ flex: 1, height: 2, borderRadius: 99, margin: "0 8px 22px", backgroundColor: step > s.num ? "#0d9488" : "#e2e8f0", transition: "background-color 0.3s" }} />
                )}
              </div>
            )
          })}
        </div>

        <div style={{ backgroundColor: "#fff", borderRadius: 18, border: "1px solid #e8ecf0", padding: "clamp(22px, 4vw, 32px)", animation: "fade-up 0.3s ease-out" }}>

          {/* ── STEP 1: Type ── */}
          {step === 1 && (
            <>
              <h2 style={{ fontSize: 19, fontWeight: 800, color: "#0f172a", margin: "0 0 6px 0" }}>What are you submitting?</h2>
              <p style={{ fontSize: 13.5, color: "#64748b", margin: "0 0 20px 0" }}>Choose the option that best describes your opportunity.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(200px, 100%), 1fr))", gap: 10 }}>
                {submissionTypes.map(t => {
                  const active = form.submissionType === t.key
                  return (
                    <button key={t.key} onClick={() => set("submissionType", t.key)} style={{
                      display: "flex", alignItems: "center", gap: 10, textAlign: "left", cursor: "pointer",
                      padding: "14px 15px", borderRadius: 12,
                      border: active ? "1.5px solid #0d9488" : "1.5px solid #eef1f5",
                      backgroundColor: active ? "#f0fdfa" : "#fff",
                    }}>
                      <div style={{
                        width: 18, height: 18, borderRadius: "50%", flexShrink: 0, boxSizing: "border-box",
                        border: active ? "5.5px solid #0d9488" : "2px solid #cbd5e1",
                      }} />
                      <span style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>{t.label}</span>
                    </button>
                  )
                })}
              </div>
            </>
          )}

          {/* ── STEP 2: Property info ── */}
          {step === 2 && (
            <>
              <h2 style={{ fontSize: 19, fontWeight: 800, color: "#0f172a", margin: "0 0 6px 0" }}>Tell us about the property</h2>
              <p style={{ fontSize: 13.5, color: "#64748b", margin: "0 0 20px 0" }}>The more detail you provide, the faster verification goes.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Project / Property Name *</label>
                  <input style={inputStyle} value={form.projectName} onChange={e => set("projectName", e.target.value)} placeholder="e.g. Kampala Heights" />
                </div>
                <div>
                  <label style={labelStyle}>Location *</label>
                  <input style={inputStyle} value={form.location} onChange={e => set("location", e.target.value)} placeholder="Area, District" />
                </div>
                <div>
                  <label style={labelStyle}>Size</label>
                  <input style={inputStyle} value={form.sizeDetails} onChange={e => set("sizeDetails", e.target.value)} placeholder="e.g. 3 acres / 120 units / 8,500 sqm" />
                </div>
                <div>
                  <label style={labelStyle}>Current Estimated Value (UGX)</label>
                  <input style={inputStyle} inputMode="numeric" value={form.estimatedValue ? form.estimatedValue.toLocaleString() : ""} onChange={e => set("estimatedValue", num(e.target.value))} placeholder="e.g. 2,500,000,000" />
                </div>
                <div>
                  <label style={labelStyle}>Development Stage</label>
                  <select style={{ ...inputStyle, cursor: "pointer" }} value={form.developmentStage} onChange={e => set("developmentStage", e.target.value)}>
                    <option value="">Select stage...</option>
                    {stages.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Expected Completion</label>
                  <input style={inputStyle} value={form.expectedCompletion} onChange={e => set("expectedCompletion", e.target.value)} placeholder="e.g. December 2027" />
                </div>
                <div>
                  <label style={labelStyle}>Current Ownership</label>
                  <input style={inputStyle} value={form.ownership} onChange={e => set("ownership", e.target.value)} placeholder="e.g. Sole owner, freehold title" />
                </div>
                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={labelStyle}>Project Description</label>
                  <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical", fontFamily: "inherit", lineHeight: 1.6 }} value={form.description} onChange={e => set("description", e.target.value)} placeholder="What are you building or offering? What makes this opportunity attractive to investors?" />
                </div>
              </div>
            </>
          )}

          {/* ── STEP 3: Investment ── */}
          {step === 3 && (
            <>
              <h2 style={{ fontSize: 19, fontWeight: 800, color: "#0f172a", margin: "0 0 6px 0" }}>Investment information</h2>
              <p style={{ fontSize: 13.5, color: "#64748b", margin: "0 0 20px 0" }}>How much capital are you seeking, and how will it be used?</p>
              <div style={{ marginBottom: 18 }}>
                <label style={labelStyle}>Capital Sought (UGX) *</label>
                <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "13px 16px" }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "#94a3b8", marginRight: 8 }}>UGX</span>
                  <input
                    style={{ flex: 1, border: "none", outline: "none", fontSize: 19, fontWeight: 800, color: "#0f172a", minWidth: 0, background: "transparent" }}
                    inputMode="numeric"
                    value={form.capitalSought ? form.capitalSought.toLocaleString() : ""}
                    onChange={e => set("capitalSought", num(e.target.value))}
                    placeholder="e.g. 2,500,000,000"
                  />
                </div>
                <p style={{ fontSize: 11.5, color: "#94a3b8", margin: "6px 0 0 0" }}>Minimum UGX 1,000,000</p>
              </div>

              <label style={labelStyle}>What will the capital be used for?</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
                {capitalUseOptions.map(u => {
                  const active = form.capitalUses.includes(u)
                  return (
                    <button key={u} onClick={() => toggle("capitalUses", u)} style={{
                      padding: "9px 16px", borderRadius: 99, fontSize: 13, fontWeight: 600, cursor: "pointer",
                      border: active ? "1.5px solid #0d9488" : "1.5px solid #e8ecf0",
                      backgroundColor: active ? "#f0fdfa" : "#fff",
                      color: active ? "#0f766e" : "#64748b",
                    }}>
                      {active ? "✓ " : ""}{u}
                    </button>
                  )
                })}
              </div>

              <div style={{ borderTop: "1px solid #f1f4f8", paddingTop: 20 }}>
                <label style={{ ...labelStyle, marginBottom: 12 }}>Contact details</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label style={labelStyle}>Full Name *</label>
                    <input style={inputStyle} value={form.contactName} onChange={e => set("contactName", e.target.value)} placeholder="Your name" />
                  </div>
                  <div>
                    <label style={labelStyle}>Email *</label>
                    <input style={inputStyle} type="email" value={form.contactEmail} onChange={e => set("contactEmail", e.target.value)} placeholder="you@company.com" />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone</label>
                    <input style={inputStyle} inputMode="tel" value={form.contactPhone} onChange={e => set("contactPhone", e.target.value)} placeholder="+256 7XX XXX XXX" />
                  </div>
                  <div>
                    <label style={labelStyle}>Company (optional)</label>
                    <input style={inputStyle} value={form.company} onChange={e => set("company", e.target.value)} placeholder="e.g. Skyline Developers Ltd" />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ── STEP 4: Documents ── */}
          {step === 4 && (
            <>
              <h2 style={{ fontSize: 19, fontWeight: 800, color: "#0f172a", margin: "0 0 6px 0" }}>Documents</h2>
              <p style={{ fontSize: 13.5, color: "#64748b", margin: "0 0 20px 0" }}>
                Tick the documents you can provide. Our verification team will request them securely after review — this is central to NestFund&apos;s verification process.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(240px, 100%), 1fr))", gap: 10, marginBottom: 20 }}>
                {documentOptions.map(d => {
                  const active = form.documentsAvailable.includes(d)
                  return (
                    <button key={d} onClick={() => toggle("documentsAvailable", d)} style={{
                      display: "flex", alignItems: "center", gap: 10, textAlign: "left", cursor: "pointer",
                      padding: "12px 14px", borderRadius: 11,
                      border: active ? "1.5px solid #0d9488" : "1.5px solid #eef1f5",
                      backgroundColor: active ? "#f0fdfa" : "#fff",
                    }}>
                      <span style={{
                        width: 18, height: 18, borderRadius: 6, flexShrink: 0, boxSizing: "border-box",
                        border: active ? "none" : "2px solid #cbd5e1",
                        backgroundColor: active ? "#0d9488" : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: "#fff", fontSize: 11, fontWeight: 800,
                      }}>{active ? "✓" : ""}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{d}</span>
                    </button>
                  )
                })}
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: 9, backgroundColor: "#f0fdf4", border: "1px solid #dcfce7", borderRadius: 11, padding: "11px 15px" }}>
                <ShieldCheckIcon style={{ width: 16, height: 16, color: "#16a34a", flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 12, color: "#166534", margin: 0, lineHeight: 1.6 }}>
                  Your information is confidential and used only for NestFund&apos;s verification and due-diligence process. Secure document upload is provided after your application is reviewed.
                </p>
              </div>
            </>
          )}

          {error && (
            <p style={{ fontSize: 12.5, fontWeight: 600, color: "#dc2626", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", margin: "18px 0 0 0", lineHeight: 1.55 }}>
              {error}
            </p>
          )}

          {/* Nav buttons */}
          <div style={{ display: "flex", gap: 10, marginTop: 26 }}>
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "13px 22px", borderRadius: 11, border: "1.5px solid #e2e8f0", backgroundColor: "#fff", color: "#374151", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                <ArrowLeftIcon style={{ width: 15, height: 15 }} />
                Back
              </button>
            )}
            <button
              onClick={() => step === 4 ? submit() : canNext && setStep(s => s + 1)}
              disabled={!canNext || submitting}
              style={{
                flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
                padding: "13px 0", borderRadius: 11, border: "none",
                cursor: canNext && !submitting ? "pointer" : "not-allowed",
                background: canNext ? "linear-gradient(135deg, #0d9488, #0f766e)" : "#e2e8f0",
                color: canNext ? "#fff" : "#94a3b8",
                fontSize: 15, fontWeight: 700,
              }}
            >
              {submitting ? "Submitting..." : step === 4 ? "Submit Application" : "Continue"}
              {!submitting && <ArrowRightIcon style={{ width: 16, height: 16 }} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
