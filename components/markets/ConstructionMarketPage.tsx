"use client"

import { useState } from "react"
import Link from "next/link"
import SharePriceChart from "@/components/ui/SharePriceChart"

type FilterKey = "All" | "Active" | "Fully Funded" | "Completed"
type SortKey = "roi-high" | "progress-high" | "price-low" | "price-high"

interface ConstructionProject {
  id: string
  name: string
  location: string
  developer: string
  image: string
  projectCost: number
  developerInvestment: number
  capitalNeeded: number
  capitalRaised: number
  fundingProgress: number
  constructionProgress: number
  expectedCompletion: string
  projectedYield: number
  projectedROI: number
  sharePrice: number
  sharePriceAtCompletion: number
  sharePriceStart: number
  totalShares: number
  availableShares: number
  investors: number
  stage: string
  stageColor: string
}

const constructionProjects: ConstructionProject[] = [
  {
    id: "ibis-residences-ii",
    name: "Ibis Residences Phase II",
    location: "Kiira, Wakiso",
    developer: "Ibis Properties Ltd",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80",
    projectCost: 10000000000,
    developerInvestment: 3000000000,
    capitalNeeded: 7000000000,
    capitalRaised: 2940000000,
    fundingProgress: 42,
    constructionProgress: 0,
    expectedCompletion: "June 2028",
    projectedYield: 13.2,
    projectedROI: 38.5,
    sharePrice: 4200,
    sharePriceStart: 3500,
    sharePriceAtCompletion: 4800,
    totalShares: 5000,
    availableShares: 2900,
    investors: 131,
    stage: "Construction funding",
    stageColor: "#f59e0b",
  },
  {
    id: "kololo-towers-ii",
    name: "Kololo Towers Phase II",
    location: "Kololo, Kampala",
    developer: "Skyline Developers",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80",
    projectCost: 25000000000,
    developerInvestment: 8000000000,
    capitalNeeded: 17000000000,
    capitalRaised: 9520000000,
    fundingProgress: 56,
    constructionProgress: 15,
    expectedCompletion: "March 2027",
    projectedYield: 11.8,
    projectedROI: 26.3,
    sharePrice: 5450,
    sharePriceStart: 5200,
    sharePriceAtCompletion: 6800,
    totalShares: 5000,
    availableShares: 2200,
    investors: 289,
    stage: "Construction funding",
    stageColor: "#f59e0b",
  },
  {
    id: "naalya-eco-park",
    name: "Naalya Eco Business Park",
    location: "Naalya, Wakiso",
    developer: "GreenBuild Africa",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80",
    projectCost: 8500000000,
    developerInvestment: 2500000000,
    capitalNeeded: 6000000000,
    capitalRaised: 4794000000,
    fundingProgress: 79.9,
    constructionProgress: 32,
    expectedCompletion: "December 2026",
    projectedYield: 12.5,
    projectedROI: 43.5,
    sharePrice: 3200,
    sharePriceStart: 2800,
    sharePriceAtCompletion: 4020,
    totalShares: 5000,
    availableShares: 1005,
    investors: 275,
    stage: "Construction funding",
    stageColor: "#f59e0b",
  },
  {
    id: "muyenga-hillside",
    name: "Muyenga Hillside Villas",
    location: "Muyenga, Kampala",
    developer: "Hill Estates Ltd",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
    projectCost: 6000000000,
    developerInvestment: 2000000000,
    capitalNeeded: 4000000000,
    capitalRaised: 2080000000,
    fundingProgress: 52,
    constructionProgress: 5,
    expectedCompletion: "September 2027",
    projectedYield: 10.9,
    projectedROI: 31.7,
    sharePrice: 2350,
    sharePriceStart: 2200,
    sharePriceAtCompletion: 3100,
    totalShares: 5000,
    availableShares: 2400,
    investors: 164,
    stage: "Initial funding",
    stageColor: "#2563eb",
  },
]

function formatUGX(value: number): string {
  if (value >= 1_000_000_000) return `UGX ${(value / 1_000_000_000).toFixed(1)}B`
  if (value >= 1_000_000) return `UGX ${(value / 1_000_000).toFixed(0)}M`
  return `UGX ${value.toLocaleString()}`
}

function formatPrice(value: number): string {
  return value.toLocaleString()
}

const filterTabs: { key: FilterKey; label: string }[] = [
  { key: "All", label: "All" },
  { key: "Active", label: "Active" },
  { key: "Fully Funded", label: "Fully Funded" },
  { key: "Completed", label: "Completed" },
]

export default function ConstructionMarketPage() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>("All")
  const [sort, setSort] = useState<SortKey>("roi-high")

  const filtered = constructionProjects
    .filter(p => {
      if (activeFilter === "All") return true
      if (activeFilter === "Active") return p.fundingProgress < 100 && p.constructionProgress < 100
      if (activeFilter === "Fully Funded") return p.fundingProgress >= 100
      if (activeFilter === "Completed") return p.constructionProgress === 100
      return true
    })
    .sort((a, b) => {
      if (sort === "roi-high") return b.projectedROI - a.projectedROI
      if (sort === "progress-high") return b.fundingProgress - a.fundingProgress
      if (sort === "price-low") return a.sharePrice - b.sharePrice
      if (sort === "price-high") return b.sharePrice - a.sharePrice
      return 0
    })

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f6f8" }}>

      {/* Page Header */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e8ecf0" }}>
        <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px 0" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
            <Link href="/market" style={{ fontSize: 13, color: "#64748b", textDecoration: "none", fontWeight: 500 }}>
              Markets
            </Link>
            <span style={{ fontSize: 13, color: "#c4cad4" }}>/</span>
            <span style={{ fontSize: 13, color: "#2563eb", fontWeight: 600 }}>Construction Market</span>
          </div>

          <h1 style={{ fontSize: 30, fontWeight: 800, color: "#0f172a", margin: "0 0 6px 0", letterSpacing: "-0.6px" }}>
            Construction Market
          </h1>
          <p style={{ fontSize: 15, color: "#64748b", margin: "0 0 24px 0" }}>
            Help finance tomorrow&apos;s buildings and own them from day one.
          </p>

          {/* Stats */}
          <div className="stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
            <StatCard label="Total Projects" value="12" />
            <StatCard label="Total Capital Needed" value="UGX 28.5B" />
            <StatCard label="Avg. Projected ROI" value="34.8%" highlight />
            <StatCard label="Active Investors" value="859" />
          </div>

          {/* Filter tabs + sort */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div className="filter-tabs" style={{ display: "flex", gap: 0 }}>
              {filterTabs.map(tab => {
                const isActive = activeFilter === tab.key
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveFilter(tab.key)}
                    style={{
                      padding: "9px 20px", fontSize: 13, fontWeight: 600, border: "none",
                      background: "transparent", cursor: "pointer",
                      color: isActive ? "#2563eb" : "#64748b",
                      borderBottom: isActive ? "2px solid #2563eb" : "2px solid transparent",
                      transition: "all 0.15s", whiteSpace: "nowrap",
                    }}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 2 }}>
              <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>Sort by</span>
              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortKey)}
                style={{ padding: "7px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 13, fontWeight: 500, color: "#374151", background: "#fff", outline: "none", cursor: "pointer" }}
              >
                <option value="roi-high">ROI: High to Low</option>
                <option value="progress-high">Funding Progress</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px 48px" }}>
        <HowItWorksBanner />

        {/* Investor protections strip */}
        <div style={{
          backgroundColor: "#f8faff", border: "1px solid #e8ecf0",
          borderLeft: "3px solid #2563eb", borderRadius: 8,
          padding: "10px 16px", marginBottom: 24,
          display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.5px", whiteSpace: "nowrap" }}>
            Investor Protections
          </span>
          <span style={{ fontSize: 12, color: "#64748b" }}>
            Construction milestones &nbsp;&middot;&nbsp; Independent engineering &nbsp;&middot;&nbsp; Monthly reports &nbsp;&middot;&nbsp; Escrow-controlled releases &nbsp;&middot;&nbsp; Live progress tracking
          </span>
        </div>

        <p style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20, fontWeight: 500 }}>
          Showing <strong style={{ color: "#374151" }}>{filtered.length}</strong> projects
        </p>

        <div
          className="property-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(640px, 1fr))", gap: 22 }}
        >
          {filtered.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── How It Works Banner ── */
function HowItWorksBanner() {
  const steps = [
    { number: 1, title: "Developers list projects", desc: "Raise construction capital before breaking ground" },
    { number: 2, title: "NestFund verifies", desc: "Independent legal and engineering checks on every project" },
    { number: 3, title: "You invest and own", desc: "Buy shares, track build progress, and earn on completion" },
  ]
  return (
    <div style={{
      backgroundColor: "#fff", border: "1px solid #e8ecf0", borderRadius: 12,
      padding: "18px 24px", marginBottom: 20,
      display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap",
    }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.6px", marginRight: 24, whiteSpace: "nowrap" }}>
        How It Works
      </span>
      {steps.map((step, idx) => (
        <div key={step.number} style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 180, paddingRight: idx < steps.length - 1 ? 20 : 0 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", backgroundColor: "#eff6ff", border: "2px solid #2563eb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#2563eb" }}>{step.number}</span>
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "0 0 1px 0" }}>{step.title}</p>
            <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{step.desc}</p>
          </div>
          {idx < steps.length - 1 && (
            <div style={{ fontSize: 16, color: "#d1d5db", marginLeft: "auto", paddingLeft: 8, flexShrink: 0 }}>&rsaquo;</div>
          )}
        </div>
      ))}
    </div>
  )
}

/* ── Stat Card ── */
function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ backgroundColor: "#f8f9fb", border: "1px solid #e8ecf0", borderRadius: 12, padding: "16px 20px" }}>
      <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600, margin: "0 0 5px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
        {label}
      </p>
      <p style={{ fontSize: 24, fontWeight: 800, color: highlight ? "#0d9488" : "#0f172a", margin: 0, letterSpacing: "-0.5px" }}>
        {value}
      </p>
    </div>
  )
}

/* ── Fundraising Stages indicator ── */
function FundraisingStages({ stage }: { stage: string }) {
  const stages = [
    { key: "initial", label: "Initial Funding" },
    { key: "construction", label: "Construction Funding" },
    { key: "strategy", label: "Investment Strategy" },
  ]
  const activeIdx = stage.toLowerCase().includes("initial") ? 0 : stage.toLowerCase().includes("construction") ? 1 : 2

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 12, position: "relative" }}>
      {/* dashed connector line behind circles */}
      <div style={{ position: "absolute", top: 8, left: 8, right: 8, height: 1, borderTop: "1.5px dashed #e2e8f0", zIndex: 0 }} />
      {stages.map((s, i) => {
        const isActive = i === activeIdx
        const isPast = i < activeIdx
        return (
          <div key={s.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, position: "relative", zIndex: 1 }}>
            <div style={{
              width: 16, height: 16, borderRadius: "50%",
              backgroundColor: isActive ? "#0d9488" : isPast ? "#e2e8f0" : "#fff",
              border: isActive ? "2px solid #0d9488" : "2px solid #e2e8f0",
              marginBottom: 4,
            }} />
            <span style={{ fontSize: 9, fontWeight: isActive ? 700 : 500, color: isActive ? "#0d9488" : "#94a3b8", textAlign: "center", lineHeight: 1.2 }}>
              {s.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/* ── Project Card ── */
function ProjectCard({ project }: { project: ConstructionProject }) {
  const soldShares = project.totalShares - project.availableShares
  const soldPct = Math.round((soldShares / project.totalShares) * 100)

  return (
    <Link href={`/construction/${project.id}`} style={{ textDecoration: "none", display: "block" }}>
    <div
      style={{
        backgroundColor: "#fff", border: "1px solid #e8ecf0", borderRadius: 14,
        overflow: "hidden", display: "flex", flexDirection: "row",
        transition: "box-shadow 0.2s, transform 0.2s", cursor: "pointer",
      }}
      className="construction-card-row"
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow = "0 8px 32px rgba(37,99,235,0.10)"
        el.style.transform = "translateY(-2px)"
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement
        el.style.boxShadow = "none"
        el.style.transform = "translateY(0)"
      }}
    >
      {/* Left: Image panel */}
      <div className="card-image" style={{ width: "40%", minWidth: 200, position: "relative", flexShrink: 0, minHeight: 300 }}>
        <img
          src={project.image}
          alt={project.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        {/* Dark overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)" }} />
        {/* ROI badge top-left */}
        <div style={{ position: "absolute", top: 12, left: 12 }}>
          <span style={{ display: "inline-block", backgroundColor: "#0d9488", color: "#fff", fontSize: 12, fontWeight: 700, padding: "4px 9px", borderRadius: 6 }}>
            {project.projectedROI}% ROI
          </span>
        </div>
        {/* Developer name bottom */}
        <div style={{ position: "absolute", bottom: 12, left: 12, right: 12 }}>
          <span style={{
            display: "inline-block", backgroundColor: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(4px)", color: "#fff", fontSize: 10, fontWeight: 600,
            padding: "3px 8px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.25)",
          }}>
            {project.developer}
          </span>
        </div>
      </div>

      {/* Right: Content panel */}
      <div style={{ flex: 1, padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>

        {/* Stage badges */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{
            display: "inline-block", backgroundColor: `${project.stageColor}18`, color: project.stageColor,
            fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 99,
            border: `1px solid ${project.stageColor}40`, textTransform: "uppercase", letterSpacing: "0.3px",
          }}>
            {project.stage}
          </span>
          <span style={{ display: "inline-block", backgroundColor: "#f1f5f9", color: "#475569", fontSize: 10, fontWeight: 600, padding: "3px 9px", borderRadius: 99 }}>
            {project.investors} Investors
          </span>
        </div>

        {/* Fundraising stages indicator */}
        <FundraisingStages stage={project.stage} />

        {/* Name + location */}
        <div>
          <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: "0 0 3px 0", letterSpacing: "-0.3px", lineHeight: 1.2 }}>
            {project.name}
          </h3>
          <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, fontWeight: 500 }}>{project.location}</p>
        </div>

        {/* Funding progress */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
            <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Total raised</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: "#0d9488" }}>{project.fundingProgress.toFixed(1)}%</span>
          </div>
          <div style={{ height: 6, backgroundColor: "#f1f4f8", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.min(project.fundingProgress, 100)}%`, backgroundColor: "#2563eb", borderRadius: 99, transition: "width 0.4s ease" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <span style={{ fontSize: 11, color: "#0d9488", fontWeight: 700 }}>{formatUGX(project.capitalRaised)}</span>
            <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500 }}>of {formatUGX(project.capitalNeeded)}</span>
          </div>
        </div>

        {/* Info grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <InfoCell label="Required Funds" value={formatUGX(project.capitalNeeded)} />
          <InfoCell label="Expected Completion" value={project.expectedCompletion} />
        </div>

        {/* Share Price Trajectory Chart */}
        <div style={{ backgroundColor: "#f8faff", border: "1px solid #e2eaf8", borderRadius: 10, padding: "12px 14px" }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#64748b", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Share Price Trajectory
          </p>
          <SharePriceChart
            startPrice={project.sharePriceStart}
            currentPrice={project.sharePrice}
            endPrice={project.sharePriceAtCompletion}
            currency="UGX"
          />
        </div>

        {/* Construction progress */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.4px" }}>
              Construction Progress
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#0d9488" }}>{project.constructionProgress}% complete</span>
          </div>
          <div style={{ height: 4, backgroundColor: "#f1f4f8", borderRadius: 99, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${project.constructionProgress}%`,
              backgroundColor: project.constructionProgress === 0 ? "#e2e8f0" : "#0d9488",
              borderRadius: 99, transition: "width 0.4s ease",
              minWidth: project.constructionProgress > 0 ? 4 : 0,
            }} />
          </div>
          {project.constructionProgress === 0 && (
            <p style={{ fontSize: 10, color: "#94a3b8", margin: "3px 0 0 0" }}>
              Construction starts once funding target is reached
            </p>
          )}
        </div>

        {/* Buy button + share price */}
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 2 }}>
          <button
            style={{
              flex: 1, padding: "10px 0", borderRadius: 9,
              backgroundColor: "#0f172a", color: "#fff", fontSize: 13,
              fontWeight: 700, border: "none", cursor: "pointer", transition: "background 0.15s",
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#1e293b")}
            onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#0f172a")}
          >
            View Details
          </button>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", flexShrink: 0 }}>
            <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, whiteSpace: "nowrap" }}>Per share</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#0f172a" }}>UGX {formatPrice(project.sharePrice)}</span>
          </div>
        </div>

        {/* Shares left */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, height: 3, backgroundColor: "#f1f4f8", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${soldPct}%`, backgroundColor: soldPct >= 80 ? "#ef4444" : "#64748b", borderRadius: 99 }} />
          </div>
          <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500, whiteSpace: "nowrap" }}>
            {project.availableShares.toLocaleString()} shares left
          </span>
        </div>
      </div>
    </div>
    </Link>
  )
}

/* ── Info Cell ── */
function InfoCell({ label, value, valueColor = "#0f172a", bold }: { label: string; value: string; valueColor?: string; bold?: boolean }) {
  return (
    <div style={{ backgroundColor: "#f8f9fb", borderRadius: 8, padding: "7px 10px" }}>
      <p style={{ fontSize: 9, color: "#94a3b8", fontWeight: 600, margin: "0 0 3px 0", textTransform: "uppercase", letterSpacing: "0.4px" }}>
        {label}
      </p>
      <p style={{ fontSize: 12, fontWeight: bold ? 800 : 600, color: valueColor, margin: 0 }}>
        {value}
      </p>
    </div>
  )
}
