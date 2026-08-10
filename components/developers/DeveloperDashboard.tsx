"use client"

import Link from "next/link"
import { PlusIcon, EyeIcon, BookmarkIcon, UsersIcon, BanknotesIcon } from "@heroicons/react/24/outline"
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid"

/* Preview dashboard with example projects — becomes per-developer
   once manager accounts (auth) land. */

const verification = [
  { label: "Property ownership", done: true },
  { label: "Developer identity", done: true },
  { label: "Valuation", done: true },
  { label: "Financials", done: false },
  { label: "Legal review", done: false },
]

const interest = [
  { icon: EyeIcon, value: "1,284", label: "viewed your project" },
  { icon: BookmarkIcon, value: "427", label: "saved it" },
  { icon: UsersIcon, value: "184", label: "expressed interest" },
  { icon: BanknotesIcon, value: "UGX 840M", label: "indicated commitment" },
]

const analytics = [
  { label: "Views", value: "24,820" },
  { label: "Investor interest", value: "1,284" },
  { label: "Funding progress", value: "71%" },
  { label: "Avg. investment", value: "UGX 5.6M" },
  { label: "Conversion", value: "8.4%" },
]

export default function DeveloperDashboard() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e8ecf0" }}>
        <div className="container" style={{ maxWidth: 1080, margin: "0 auto", padding: "28px 24px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 7, backgroundColor: "#fffbeb", border: "1px solid #fde68a", borderRadius: 99, padding: "4px 12px", marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#92400e" }}>PREVIEW — developer accounts launch soon</span>
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: "0 0 4px 0", letterSpacing: "-0.5px" }}>Developer Dashboard</h1>
              <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>Track applications, verification, funding, and investor interest — all in one place.</p>
            </div>
            <Link href="/developers/apply" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "11px 22px", borderRadius: 11, background: "linear-gradient(135deg, #0d9488, #0f766e)", color: "#fff", fontSize: 13.5, fontWeight: 700, textDecoration: "none" }}>
              <PlusIcon style={{ width: 15, height: 15 }} />
              Submit New Project
            </Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1080, margin: "0 auto", padding: "28px 24px 64px" }}>
        <h2 style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 14px 0" }}>My Projects</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(400px, 100%), 1fr))", gap: 18, alignItems: "start" }}>

          {/* ── Project 1: Under review ── */}
          <div style={{ backgroundColor: "#fff", borderRadius: 18, border: "1px solid #e8ecf0", overflow: "hidden" }}>
            <div style={{ height: 140, position: "relative" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=800&q=75" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <span style={{ position: "absolute", top: 12, left: 12, display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: "#92400e", backgroundColor: "rgba(255,251,235,0.96)", border: "1px solid #fde68a", borderRadius: 99, padding: "4px 12px" }}>
                <ClockIcon style={{ width: 12, height: 12 }} /> Under Review
              </span>
            </div>
            <div style={{ padding: "18px 22px 22px" }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 2px 0" }}>Kampala Heights</h3>
              <p style={{ fontSize: 12.5, color: "#94a3b8", margin: "0 0 16px 0" }}>Apartment development · Nakasero, Kampala</p>

              {/* Application progress */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Application progress</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#0f172a" }}>78%</span>
              </div>
              <div style={{ height: 7, borderRadius: 99, backgroundColor: "#f1f5f9", overflow: "hidden", marginBottom: 6 }}>
                <div style={{ height: "100%", width: "78%", borderRadius: 99, background: "linear-gradient(90deg, #f59e0b, #d97706)" }} />
              </div>
              <p style={{ fontSize: 11.5, color: "#94a3b8", margin: "0 0 16px 0" }}>Documents: 8/10 uploaded</p>

              {/* Verification checklist */}
              <p style={{ fontSize: 11.5, fontWeight: 700, color: "#46536b", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0" }}>Verification</p>
              {verification.map(v => (
                <div key={v.label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0" }}>
                  {v.done
                    ? <CheckCircleIcon style={{ width: 16, height: 16, color: "#10b981", flexShrink: 0 }} />
                    : <span style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid #e2e8f0", flexShrink: 0, boxSizing: "border-box" }} />}
                  <span style={{ fontSize: 13, fontWeight: 600, color: v.done ? "#0f172a" : "#94a3b8" }}>{v.label}</span>
                  {!v.done && <span style={{ marginLeft: "auto", fontSize: 10.5, fontWeight: 700, color: "#d97706", backgroundColor: "#fffbeb", borderRadius: 99, padding: "2px 9px" }}>Pending</span>}
                </div>
              ))}
            </div>
          </div>

          {/* ── Project 2: Live ── */}
          <div style={{ backgroundColor: "#fff", borderRadius: 18, border: "1px solid #e8ecf0", overflow: "hidden" }}>
            <div style={{ height: 140, position: "relative" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=75" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <span style={{ position: "absolute", top: 12, left: 12, display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: "#065f46", backgroundColor: "rgba(240,253,244,0.96)", border: "1px solid #bbf7d0", borderRadius: 99, padding: "4px 12px" }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: "#10b981", display: "inline-block", animation: "pulse-dot 2s ease-in-out infinite" }} /> Live
              </span>
            </div>
            <div style={{ padding: "18px 22px 22px" }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 2px 0" }}>Riverside Apartments</h3>
              <p style={{ fontSize: 12.5, color: "#94a3b8", margin: "0 0 16px 0" }}>Residential · Entebbe Road, Wakiso</p>

              {/* Funding */}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>Funding progress</span>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#0d9488" }}>71% funded</span>
              </div>
              <div style={{ height: 7, borderRadius: 99, backgroundColor: "#f1f5f9", overflow: "hidden", marginBottom: 6 }}>
                <div style={{ height: "100%", width: "71%", borderRadius: 99, background: "linear-gradient(90deg, #0d9488, #10b981)" }} />
              </div>
              <p style={{ fontSize: 11.5, color: "#94a3b8", margin: "0 0 16px 0" }}>
                <strong style={{ color: "#0f172a" }}>UGX 7.5B</strong> raised of UGX 10.5B target · <strong style={{ color: "#0f172a" }}>384</strong> investors
              </p>

              {/* Investor interest */}
              <p style={{ fontSize: 11.5, fontWeight: 700, color: "#46536b", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 10px 0" }}>Investor Interest</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {interest.map(i => (
                  <div key={i.label} style={{ display: "flex", alignItems: "center", gap: 9, backgroundColor: "#f8fafc", borderRadius: 10, padding: "9px 12px" }}>
                    <i.icon style={{ width: 15, height: 15, color: "#0d9488", flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: 13.5, fontWeight: 800, color: "#0f172a", margin: 0, lineHeight: 1.2 }}>{i.value}</p>
                      <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>{i.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Analytics strip */}
        <div style={{ backgroundColor: "#0a1628", borderRadius: 18, padding: "24px 26px", marginTop: 18 }}>
          <p style={{ fontSize: 11.5, fontWeight: 700, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 16px 0" }}>
            Project Performance — Riverside Apartments
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(140px, 100%), 1fr))", gap: 14 }}>
            {analytics.map(a => (
              <div key={a.label}>
                <p style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: "0 0 2px 0", letterSpacing: "-0.5px" }}>{a.value}</p>
                <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.5)", margin: 0 }}>{a.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 12.5, color: "#94a3b8", marginTop: 20, lineHeight: 1.65, textAlign: "center" }}>
          This is a preview with example projects. Once developer accounts launch, you&apos;ll see your own submissions,
          verification status, and live funding data here — <Link href="/developers/apply" style={{ color: "#0d9488", fontWeight: 700, textDecoration: "none" }}>submit a project</Link> to get started.
        </p>
      </div>
    </div>
  )
}
