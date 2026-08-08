"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeftIcon, MapPinIcon, HeartIcon, ShareIcon,
  DocumentTextIcon, ArrowTopRightOnSquareIcon, ClipboardDocumentIcon,
} from "@heroicons/react/24/outline"
import {
  ArrowTrendingUpIcon, CheckBadgeIcon,
  BuildingOffice2Icon,
} from "@heroicons/react/24/solid"
import SharePriceChart from "@/components/ui/SharePriceChart"

/* ── Data ─────────────────────────────────────────────────── */
const constructionProjects = [
  {
    id: "ibis-residences-ii",
    name: "Ibis Residences Phase II",
    location: "Kiira, Wakiso",
    developer: "Ibis Properties Ltd",
    images: [
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=70",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&q=70",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=70",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=70",
    ],
    projectCost: 10000000000, developerInvestment: 3000000000,
    capitalNeeded: 7000000000, capitalRaised: 2940000000,
    fundingProgress: 42, constructionProgress: 0,
    expectedCompletion: "June 2028", projectedYield: 13.2, projectedROI: 38.5,
    sharePrice: 4200, sharePriceStart: 3500, sharePriceAtCompletion: 4800,
    estimatedPropertyValue: 12500000000,
    totalShares: 5000, availableShares: 2900, investors: 131,
    stage: "Construction funding", stageColor: "#f59e0b",
    beds: 3, baths: 2, sqm: 120, type: "Residential", status: "Under Construction",
  },
  {
    id: "kololo-towers-ii",
    name: "Kololo Towers Phase II",
    location: "Kololo, Kampala",
    developer: "Skyline Developers",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&q=70",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=70",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=70",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=70",
    ],
    projectCost: 25000000000, developerInvestment: 8000000000,
    capitalNeeded: 17000000000, capitalRaised: 9520000000,
    fundingProgress: 56, constructionProgress: 15,
    expectedCompletion: "March 2027", projectedYield: 11.8, projectedROI: 26.3,
    sharePrice: 5450, sharePriceStart: 5200, sharePriceAtCompletion: 6800,
    estimatedPropertyValue: 32000000000,
    totalShares: 5000, availableShares: 2200, investors: 289,
    stage: "Construction funding", stageColor: "#f59e0b",
    beds: 0, baths: 0, sqm: 2800, type: "Commercial", status: "Foundation Stage",
  },
  {
    id: "naalya-eco-park",
    name: "Naalya Eco Business Park",
    location: "Naalya, Wakiso",
    developer: "GreenBuild Africa",
    images: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=70",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=70",
      "https://images.unsplash.com/photo-1464146072230-91cabc968266?w=400&q=70",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=70",
    ],
    projectCost: 8500000000, developerInvestment: 2500000000,
    capitalNeeded: 6000000000, capitalRaised: 4794000000,
    fundingProgress: 79.9, constructionProgress: 32,
    expectedCompletion: "December 2026", projectedYield: 12.5, projectedROI: 43.5,
    sharePrice: 3200, sharePriceStart: 2800, sharePriceAtCompletion: 4020,
    estimatedPropertyValue: 11000000000,
    totalShares: 5000, availableShares: 1005, investors: 275,
    stage: "Construction funding", stageColor: "#f59e0b",
    beds: 0, baths: 0, sqm: 4500, type: "Commercial", status: "32% Built",
  },
  {
    id: "muyenga-hillside",
    name: "Muyenga Hillside Villas",
    location: "Muyenga, Kampala",
    developer: "Hill Estates Ltd",
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=70",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=70",
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=70",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=70",
    ],
    projectCost: 6000000000, developerInvestment: 2000000000,
    capitalNeeded: 4000000000, capitalRaised: 2080000000,
    fundingProgress: 52, constructionProgress: 5,
    expectedCompletion: "September 2027", projectedYield: 10.9, projectedROI: 31.7,
    sharePrice: 2350, sharePriceStart: 2200, sharePriceAtCompletion: 3100,
    estimatedPropertyValue: 7800000000,
    totalShares: 5000, availableShares: 2400, investors: 164,
    stage: "Initial funding", stageColor: "#2563eb",
    beds: 4, baths: 3, sqm: 280, type: "Residential", status: "Initial Stage",
  },
]

function fmtUGX(v: number) {
  if (v >= 1_000_000_000) return `UGX ${(v / 1_000_000_000).toFixed(1)}B`
  if (v >= 1_000_000)     return `UGX ${(v / 1_000_000).toFixed(0)}M`
  return `UGX ${v.toLocaleString()}`
}
function fmtPrice(v: number) { return v.toLocaleString() }

const tradeHistory = [
  { hash: "0xe84...46ef6", date: "07.08.2026", time: "00:07", shares: 4, price: 4200, volume: 16800, status: "Sold" },
  { hash: "0x97a...1c2ee", date: "05.08.2026", time: "14:11", shares: 1, price: 4200, volume: 4200,  status: "Sold" },
  { hash: "0x7dd...4eb71", date: "05.08.2026", time: "11:57", shares: 6, price: 4180, volume: 25080, status: "Sold" },
  { hash: "0x3c7...56b5b", date: "05.08.2026", time: "11:55", shares: 2, price: 4200, volume: 8400,  status: "Sold" },
  { hash: "0x1cc...4ce97", date: "04.08.2026", time: "18:22", shares: 10,price: 4150, volume: 41500, status: "Sold" },
]

const activityFeed = [
  {
    icon: "report",
    title: "Construction Report — August 2026",
    desc: "Foundation work completed. Structural steel installation begins next week. Project on schedule.",
    date: "Aug 5",
    photos: [
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=120&q=70",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=120&q=70",
    ],
    extra: "+4 more",
    attachment: "Developer Interview — Progress Update",
  },
  {
    icon: "payment",
    title: "Construction Funds Released — Tranche 2",
    desc: "UGX 980M released from escrow following independent engineering milestone verification.",
    date: "Jul 15",
    photos: [],
  },
  {
    icon: "report",
    title: "Construction Report — July 2026",
    desc: "Site clearing complete. Foundation excavation 60% done. Drone footage available.",
    date: "Jul 1",
    photos: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=120&q=70",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=120&q=70",
    ],
    extra: "+3 more",
  },
]

type TabKey = "overview" | "documents" | "calculator" | "activities" | "trades"

export default function ConstructionDetailPage({ id }: { id: string }) {
  const project = constructionProjects.find(p => p.id === id)
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState<TabKey>("overview")
  const [docTab, setDocTab] = useState<"ownership"|"property"|"audit">("ownership")
  const [investment, setInvestment] = useState(1000000)
  const [page, setPage] = useState(1)
  const tradesPerPage = 4

  if (!project) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#64748b" }}>Project not found</p>
    </div>
  )

  const soldPct = Math.round(((project.totalShares - project.availableShares) / project.totalShares) * 100)
  const shares = Math.floor(investment / project.sharePrice)
  const actualInvestment = shares * project.sharePrice
  const projectedReturn = actualInvestment * (1 + project.projectedROI / 100)
  const profit = projectedReturn - actualInvestment
  const estPropertyValueAtCompletion = project.estimatedPropertyValue

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f6f8" }}>

      {/* Breadcrumb bar */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e8ecf0" }}>
        <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", height: 48, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Link href="/construction-market" style={{ fontSize: 13, color: "#64748b", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              <ArrowLeftIcon style={{ width: 14, height: 14 }} />
              Construction Market
            </Link>
            <span style={{ fontSize: 13, color: "#c4cad4" }}>/</span>
            <span style={{ fontSize: 13, color: "#0f172a", fontWeight: 600 }}>{project.name}</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setSaved(!saved)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 8, border: `1.5px solid ${saved ? "#fecaca" : "#e2e8f0"}`, background: saved ? "#fef2f2" : "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: saved ? "#dc2626" : "#64748b" }}>
              <HeartIcon style={{ width: 14, height: 14 }} />
              {saved ? "Saved" : "Save"}
            </button>
            <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#64748b" }}>
              <ShareIcon style={{ width: 14, height: 14 }} />
              Share
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px 48px" }}>
        <div className="property-detail-grid">

          {/* ── LEFT ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Image gallery — CSS-driven responsive */}
            <div className="property-gallery-row">
              <div className="property-gallery-main">
                <img src={project.images[0]} alt={project.name} />
                <div style={{ position: "absolute", top: 12, left: 12 }}>
                  <span style={{ backgroundColor: project.stageColor, color: "#fff", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 99 }}>{project.stage}</span>
                </div>
                <div style={{ position: "absolute", top: 12, right: 12 }}>
                  <span style={{ backgroundColor: "#0d9488", color: "#fff", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 6 }}>{project.projectedROI}% ROI</span>
                </div>
              </div>
              <div className="gallery-thumbs">
                {project.images.slice(1, 5).map((img, i) => (
                  <div key={i} className="gallery-thumb">
                    <img src={img} alt="" />
                    {i === 3 && (
                      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(15,23,42,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "#fff", fontSize: 14, fontWeight: 700 }}>+3</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Title + badges */}
            <div>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                <div>
                  <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: "0 0 5px 0", letterSpacing: "-0.5px" }}>{project.name}</h1>
                  <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#64748b" }}>
                    <MapPinIcon style={{ width: 14, height: 14 }} />
                    <span style={{ fontSize: 13 }}>{project.location}</span>
                    <span style={{ color: "#e2e8f0" }}>·</span>
                    <span style={{ fontSize: 13 }}>{project.developer}</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <CheckBadgeIcon style={{ width: 16, height: 16, color: "#16a34a" }} />
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#16a34a" }}>Verified Project</span>
                </div>
              </div>
            </div>

            {/* Property detail icons — proper SVG, no emojis */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                ...(project.beds > 0 ? [{ svg: <svg viewBox="0 0 24 24" fill="none" stroke="#0369a1" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v10m0-6h18M3 11v0a2 2 0 012-2h14a2 2 0 012 2v0M7 11V7a1 1 0 011-1h8a1 1 0 011 1v4" /></svg>, label: `${project.beds} Bed` }] : []),
                ...(project.baths > 0 ? [{ svg: <svg viewBox="0 0 24 24" fill="none" stroke="#0369a1" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16v4a4 4 0 01-4 4H8a4 4 0 01-4-4v-4z" /><path d="M6 12V6a3 3 0 013-3h1" /></svg>, label: `${project.baths} Bath` }] : []),
                { svg: <svg viewBox="0 0 24 24" fill="none" stroke="#0369a1" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l4-4m0 0L18 6a1 1 0 011 1L8 18l-4.4 1.1.4-1.1z" /></svg>, label: `${project.sqm.toLocaleString()} m²` },
                { svg: <svg viewBox="0 0 24 24" fill="none" stroke="#0369a1" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></svg>, label: project.type },
                { svg: <svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>, label: project.status, amber: true },
              ].map(d => (
                <div key={d.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, backgroundColor: (d as {amber?: boolean}).amber ? "#fffbeb" : "#f0f9ff", borderRadius: 12, padding: "10px 14px", minWidth: 70, border: `1px solid ${(d as {amber?: boolean}).amber ? "#fde68a" : "#e0f2fe"}` }}>
                  <div style={{ width: 22, height: 22 }}>{d.svg}</div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: (d as {amber?: boolean}).amber ? "#92400e" : "#0369a1" }}>{d.label}</span>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div style={{ backgroundColor: "#fff", borderRadius: 14, border: "1px solid #e8ecf0", overflow: "hidden" }}>
              <div style={{ display: "flex", borderBottom: "1px solid #f1f4f8", overflowX: "auto" }}>
                {(["overview","documents","calculator","activities","trades"] as TabKey[]).map(t => (
                  <button key={t} onClick={() => setTab(t)} style={{ padding: "13px 20px", border: "none", background: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: tab === t ? "#2563eb" : "#64748b", borderBottom: `2px solid ${tab === t ? "#2563eb" : "transparent"}`, whiteSpace: "nowrap", textTransform: "capitalize", transition: "all 0.15s" }}>{t === "activities" ? "Activities" : t === "trades" ? "Trade History" : t.charAt(0).toUpperCase() + t.slice(1)}</button>
                ))}
              </div>

              <div style={{ padding: "22px 24px" }}>

                {/* OVERVIEW TAB */}
                {tab === "overview" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <p style={{ fontSize: 14, lineHeight: 1.75, color: "#475569", margin: 0 }}>
                      <strong style={{ color: "#0f172a" }}>{project.name}</strong> is a premium {project.type.toLowerCase()} development by {project.developer}, located in {project.location}. Investors can participate from an early construction stage, benefiting from share price appreciation as the project progresses toward completion.
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                      {[
                        { label: "Project Cost",          value: fmtUGX(project.projectCost) },
                        { label: "Developer Investment",  value: fmtUGX(project.developerInvestment) },
                        { label: "Capital Needed",        value: fmtUGX(project.capitalNeeded) },
                        { label: "Expected Completion",   value: project.expectedCompletion },
                        { label: "Projected ROI",         value: `${project.projectedROI}%`, highlight: true },
                        { label: "Projected Yield (APR)", value: `${project.projectedYield}%`, highlight: true },
                      ].map(r => (
                        <div key={r.label} style={{ backgroundColor: "#f8f9fb", borderRadius: 10, padding: "11px 14px", border: "1px solid #f1f4f8" }}>
                          <p style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 4px 0" }}>{r.label}</p>
                          <p style={{ fontSize: 15, fontWeight: 700, color: (r as {highlight?: boolean}).highlight ? "#0d9488" : "#0f172a", margin: 0 }}>{r.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Estimated value at completion — special highlighted card */}
                    <div style={{ background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)", borderRadius: 12, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.6px", margin: "0 0 4px 0" }}>Est. Property Value at Completion</p>
                        <p style={{ fontSize: 24, fontWeight: 900, color: "#fff", margin: 0, letterSpacing: "-0.5px" }}>{fmtUGX(estPropertyValueAtCompletion)}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", margin: "0 0 4px 0" }}>Expected by</p>
                        <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0 }}>{project.expectedCompletion}</p>
                      </div>
                    </div>

                    {/* Share price chart */}
                    <div style={{ backgroundColor: "#f8faff", border: "1px solid #e2eaf8", borderRadius: 12, padding: "16px 18px" }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", margin: "0 0 12px 0" }}>Share Price Trajectory</p>
                      <SharePriceChart startPrice={project.sharePriceStart} currentPrice={project.sharePrice} endPrice={project.sharePriceAtCompletion} />
                    </div>
                  </div>
                )}

                {/* DOCUMENTS TAB */}
                {tab === "documents" && (
                  <div>
                    <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 18px 0", lineHeight: 1.6 }}>
                      Compilation of documents related to this project, including registrations, agreements, and comprehensive reports.
                    </p>
                    {/* Sub-tabs */}
                    <div style={{ display: "flex", backgroundColor: "#f1f4f8", borderRadius: 10, padding: 3, gap: 2, marginBottom: 18 }}>
                      {(["ownership","property","audit"] as const).map(dt => (
                        <button key={dt} onClick={() => setDocTab(dt)} style={{ flex: 1, padding: "8px 0", border: "none", cursor: "pointer", borderRadius: 8, fontSize: 13, fontWeight: 600, backgroundColor: docTab === dt ? "#fff" : "transparent", color: docTab === dt ? "#0f172a" : "#94a3b8", boxShadow: docTab === dt ? "0 1px 4px rgba(0,0,0,0.1)" : "none", transition: "all 0.15s", textTransform: "capitalize" }}>{dt}</button>
                      ))}
                    </div>

                    {/* Document list */}
                    {[
                      { icon: "📄", name: "Articles of Organization — NestFund DAO.pdf", type: "pdf", source: "Capital Markets Authority" },
                      { icon: "🔗", name: "Smart Contract", type: "link", source: "verified.nestfund.io" },
                      { icon: "🏛", name: "Developer Company Registration", type: "link", source: "URSB Uganda" },
                    ].map((doc, i) => (
                      <div key={i} style={{ border: "1.5px solid #f1f4f8", borderRadius: 11, padding: "14px 16px", marginBottom: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: doc.type === "link" ? 12 : 0 }}>
                          <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                            {doc.icon}
                          </div>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "0 0 2px 0" }}>{doc.name}</p>
                            <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{doc.source}</p>
                          </div>
                          {doc.type === "pdf" && <button style={{ padding: "5px 14px", borderRadius: 99, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", gap: 4 }}><ArrowTopRightOnSquareIcon style={{ width: 13, height: 13 }} /> Open</button>}
                        </div>
                        {doc.type === "link" && (
                          <div style={{ display: "flex", gap: 8 }}>
                            <button style={{ flex: 1, padding: "8px 0", borderRadius: 99, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}><ArrowTopRightOnSquareIcon style={{ width: 13, height: 13 }} /> Open</button>
                            <button style={{ flex: 1, padding: "8px 0", borderRadius: 99, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}><ClipboardDocumentIcon style={{ width: 13, height: 13 }} /> Copy</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* CALCULATOR TAB */}
                {tab === "calculator" && (
                  <div style={{ maxWidth: 480 }}>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", textAlign: "center", margin: "0 0 4px 0" }}>Investment Calculator</h3>
                    <p style={{ fontSize: 13, color: "#94a3b8", textAlign: "center", margin: "0 0 22px 0" }}>Initial investment</p>
                    <div style={{ border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 22, fontWeight: 800, color: "#0f172a" }}>UGX {investment.toLocaleString()}</span>
                      <span style={{ fontSize: 20, color: "#94a3b8" }}>✏️</span>
                    </div>
                    <input type="range" min={100000} max={50000000} step={100000} value={investment} onChange={e => setInvestment(Number(e.target.value))}
                      style={{ width: "100%", accentColor: "#0d9488", marginBottom: 22, cursor: "pointer" }} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 0, border: "1px solid #f1f4f8", borderRadius: 12, overflow: "hidden" }}>
                      {[
                        { label: "Actual investment amount",         value: `UGX ${actualInvestment.toLocaleString()}` },
                        { label: "Shares you will get",              value: shares.toLocaleString() },
                        { label: "Share price now",                  value: `UGX ${fmtPrice(project.sharePrice)}` },
                        { label: "Share price at end of construction",value: `UGX ${fmtPrice(project.sharePriceAtCompletion)}`, teal: true },
                        { label: "Projected ROI",                    value: `${project.projectedROI}%`, teal: true },
                        { label: "Annual percentage rate (APR)",      value: `${project.projectedYield}%`, teal: true },
                      ].map((r, i) => (
                        <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 16px", borderTop: i === 0 ? "none" : "1px solid #f8f9fb", backgroundColor: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                          <span style={{ fontSize: 13, color: "#64748b" }}>{r.label}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: (r as {teal?: boolean}).teal ? "#0d9488" : "#0f172a" }}>{r.value}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 14, backgroundColor: "#f0fdfa", border: "1.5px solid #99f6e4", borderRadius: 12, padding: "16px 20px", textAlign: "center" }}>
                      <p style={{ fontSize: 12, color: "#0d9488", fontWeight: 600, margin: "0 0 4px 0" }}>Projected investment return</p>
                      <p style={{ fontSize: 26, fontWeight: 900, color: "#0d9488", margin: 0, letterSpacing: "-0.5px" }}>UGX {Math.round(projectedReturn).toLocaleString()}</p>
                    </div>
                  </div>
                )}

                {/* ACTIVITIES TAB */}
                {tab === "activities" && (
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 4px 0" }}>Property Activities</h3>
                    <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 22px 0" }}>All events and updates related to this project, including progress reports and fund releases.</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                      {activityFeed.map((item, i) => (
                        <div key={i} style={{ display: "flex", gap: 14, paddingBottom: 28, position: "relative" }}>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                            <div style={{ width: 38, height: 38, borderRadius: "50%", backgroundColor: item.icon === "payment" ? "#f0fdf4" : "#eff6ff", border: `1.5px solid ${item.icon === "payment" ? "#bbf7d0" : "#bfdbfe"}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {item.icon === "report"
                                ? <BuildingOffice2Icon style={{ width: 17, height: 17, color: "#2563eb" }} />
                                : <ArrowTrendingUpIcon style={{ width: 17, height: 17, color: "#16a34a" }} />
                              }
                            </div>
                            {i < activityFeed.length - 1 && <div style={{ width: 1, flex: 1, backgroundColor: "#e8ecf0", marginTop: 8, borderLeft: "1.5px dashed #e8ecf0" }} />}
                          </div>
                          <div style={{ flex: 1, paddingBottom: 4 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: 0, lineHeight: 1.4 }}>{item.title}</h4>
                              <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500, flexShrink: 0, marginLeft: 12 }}>{item.date}</span>
                            </div>
                            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 10px 0", lineHeight: 1.65 }}>{item.desc}</p>
                            {item.photos && item.photos.length > 0 && (
                              <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                                {item.photos.map((p, pi) => (
                                  <div key={pi} style={{ width: 88, height: 66, borderRadius: 9, overflow: "hidden", border: "1px solid #f1f4f8" }}>
                                    <img src={p} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                  </div>
                                ))}
                                {item.extra && (
                                  <div style={{ width: 88, height: 66, borderRadius: 9, backgroundColor: "#f1f4f8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#64748b", border: "1px solid #e2e8f0" }}>
                                    {item.extra}
                                  </div>
                                )}
                              </div>
                            )}
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                              {item.attachment && (
                                <button style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 99, border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: "#374151" }}>
                                  <ArrowTopRightOnSquareIcon style={{ width: 12, height: 12 }} />
                                  {item.attachment}
                                </button>
                              )}
                              <a href="#" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "#2563eb", textDecoration: "none", fontWeight: 500 }}>
                                <ArrowTopRightOnSquareIcon style={{ width: 12, height: 12 }} />
                                View source report
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TRADE HISTORY TAB */}
                {tab === "trades" && (
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 4px 0" }}>Trade History</h3>
                    <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 0 18px 0" }}>Recent share transactions for this property.</p>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ borderBottom: "1.5px solid #f1f4f8" }}>
                            {["Transaction", "Date", "Shares", "Share Price", "Volume", "Status"].map(h => (
                              <th key={h} style={{ padding: "10px 14px", textAlign: h === "Transaction" ? "left" : "right", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.4px", whiteSpace: "nowrap" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {tradeHistory.slice((page - 1) * tradesPerPage, page * tradesPerPage).map((t, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid #f8f9fb" }}>
                              <td style={{ padding: "12px 14px" }}>
                                <span style={{ fontSize: 12, color: "#2563eb", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
                                  {t.hash}
                                  <ArrowTopRightOnSquareIcon style={{ width: 12, height: 12 }} />
                                </span>
                              </td>
                              <td style={{ padding: "12px 14px", textAlign: "right" }}>
                                <p style={{ fontSize: 12, color: "#374151", fontWeight: 600, margin: 0 }}>{t.date}</p>
                                <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{t.time}</p>
                              </td>
                              <td style={{ padding: "12px 14px", textAlign: "right", fontSize: 13, fontWeight: 600, color: "#0f172a" }}>{t.shares} {t.shares === 1 ? "Share" : "Shares"}</td>
                              <td style={{ padding: "12px 14px", textAlign: "right", fontSize: 13, color: "#374151" }}>UGX {fmtPrice(t.price)}</td>
                              <td style={{ padding: "12px 14px", textAlign: "right", fontSize: 13, fontWeight: 600, color: "#0f172a" }}>UGX {fmtPrice(t.volume)}</td>
                              <td style={{ padding: "12px 14px", textAlign: "right" }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: "#0d9488", backgroundColor: "#f0fdfa", border: "1px solid #99f6e4", padding: "3px 10px", borderRadius: 99 }}>{t.status}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* Pagination */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 18 }}>
                      {[1, 2, 3].map(p => (
                        <button key={p} onClick={() => setPage(p)} style={{ width: 32, height: 32, borderRadius: "50%", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 700, backgroundColor: page === p ? "#0f172a" : "#f1f4f8", color: page === p ? "#fff" : "#64748b" }}>{p}</button>
                      ))}
                      <span style={{ fontSize: 13, color: "#94a3b8" }}>...</span>
                      <button style={{ width: 32, height: 32, borderRadius: "50%", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, backgroundColor: "#f1f4f8", color: "#64748b" }}>861</button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* ── RIGHT — Buy widget ── */}
          <div className="buy-widget-col" style={{ minWidth: 0 }}>
            <div style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>

              {/* Header */}
              <div style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #4f46e5 100%)", padding: "16px 20px" }}>
                <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px 0" }}>Current Share Price</p>
                <p style={{ fontSize: 26, fontWeight: 900, color: "#fff", margin: 0, letterSpacing: "-0.5px" }}>UGX {fmtPrice(project.sharePrice)}</p>
              </div>

              <div style={{ padding: "18px 20px" }}>
                {/* Funding progress */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>Total raised</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#0d9488" }}>{project.fundingProgress.toFixed(1)}%</span>
                  </div>
                  <div style={{ height: 7, backgroundColor: "#f1f4f8", borderRadius: 99, overflow: "hidden", marginBottom: 5 }}>
                    <div style={{ height: "100%", width: `${project.fundingProgress}%`, backgroundColor: "#2563eb", borderRadius: 99 }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#0d9488" }}>{fmtUGX(project.capitalRaised)}</span>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>of {fmtUGX(project.capitalNeeded)}</span>
                  </div>
                </div>

                {/* Key info */}
                <div style={{ display: "flex", flexDirection: "column", gap: 0, border: "1px solid #f1f4f8", borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
                  {[
                    { label: "Required Funds",        value: fmtUGX(project.capitalNeeded) },
                    { label: "Expected Completion",   value: project.expectedCompletion },
                    { label: "Projected ROI",         value: `${project.projectedROI}%`, teal: true },
                    { label: "Est. Property Value",   value: fmtUGX(estPropertyValueAtCompletion), teal: true },
                  ].map((r, i) => (
                    <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "9px 14px", backgroundColor: i % 2 === 0 ? "#fff" : "#fafafa", borderBottom: i < 3 ? "1px solid #f8f9fb" : "none" }}>
                      <span style={{ fontSize: 12, color: "#64748b" }}>{r.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: (r as {teal?: boolean}).teal ? "#0d9488" : "#0f172a" }}>{r.value}</span>
                    </div>
                  ))}
                </div>

                {/* Buy button */}
                <button style={{ width: "100%", padding: "13px 0", borderRadius: 11, background: "linear-gradient(135deg, #2563eb, #4f46e5)", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(37,99,235,0.3)", marginBottom: 10 }}>
                  Buy Shares — UGX {fmtPrice(project.sharePrice)}/share
                </button>
                <button style={{ width: "100%", padding: "10px 0", borderRadius: 11, border: "1.5px solid #e2e8f0", background: "#fff", color: "#374151", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  Preview Order
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
