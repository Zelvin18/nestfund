"use client"

import Link from "next/link"
import {
  BuildingOffice2Icon,
  WrenchScrewdriverIcon,
  NewspaperIcon,
  Cog6ToothIcon,
  ArrowRightIcon,
  PlusIcon,
  ArrowTopRightOnSquareIcon,
  BanknotesIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline"
import { PageHeader, Card } from "@/components/admin/AdminShell"
import CountUp from "@/components/ui/CountUp"
import { monthlyIncomeOf } from "@/lib/data/rentals"
import { useRentals, useIntelligence, useConstruction } from "@/lib/hooks"

const fmtB = (v: number) => v >= 1e9 ? `UGX ${(v / 1e9).toFixed(1)}B` : `UGX ${(v / 1e6).toFixed(0)}M`

export default function AdminDashboard() {
  const { rentals: rentalProperties, live } = useRentals()
  const { items: intelligenceFeed } = useIntelligence()
  const { projects: constructionProjects } = useConstruction()
  const totalValue = rentalProperties.reduce((s, p) => s + p.currentPrice, 0)
  const totalInvestors = rentalProperties.reduce((s, p) => s + p.investors, 0) + constructionProjects.reduce((s, p) => s + p.investors, 0)
  const monthlyIncome = rentalProperties.reduce((s, p) => s + monthlyIncomeOf(p), 0)
  const capitalRaised = constructionProjects.reduce((s, p) => s + p.capitalRaised, 0)

  const stats = [
    { label: "Rental Properties", value: String(rentalProperties.length), sub: fmtB(totalValue) + " under management", icon: BuildingOffice2Icon, grad: "linear-gradient(135deg, #3b82f6, #2563eb)" },
    { label: "Construction Projects", value: String(constructionProjects.length), sub: fmtB(capitalRaised) + " capital raised", icon: WrenchScrewdriverIcon, grad: "linear-gradient(135deg, #f59e0b, #d97706)" },
    { label: "Total Investors", value: totalInvestors.toLocaleString(), sub: "across all listings", icon: UsersIcon, grad: "linear-gradient(135deg, #8b5cf6, #7c3aed)" },
    { label: "Monthly Distributions", value: fmtB(monthlyIncome), sub: "rental income / month", icon: BanknotesIcon, grad: "linear-gradient(135deg, #10b981, #059669)" },
  ]

  const quickActions = [
    { href: "/admin/properties", label: "Manage Properties", desc: "Pricing, images, documents, activities", icon: BuildingOffice2Icon, color: "#2563eb" },
    { href: "/admin/construction", label: "Construction Projects", desc: "Funding, progress, milestones", icon: WrenchScrewdriverIcon, color: "#d97706" },
    { href: "/admin/intelligence", label: "Post Intelligence", desc: "Market news and risk alerts", icon: NewspaperIcon, color: "#7c3aed" },
    { href: "/admin/settings", label: "Site Settings", desc: "Hero content, featured picks, stats", icon: Cog6ToothIcon, color: "#0d9488" },
  ]

  return (
    <>
      {/* Welcome banner */}
      <div style={{
        position: "relative", overflow: "hidden",
        background: "linear-gradient(120deg, #0a1120 0%, #10214a 60%, #1e3a8a 100%)",
        borderRadius: 20, padding: "30px 32px", marginBottom: 24,
      }}>
        <div style={{ position: "absolute", top: -120, right: "-4%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p style={{ fontSize: 11.5, fontWeight: 700, color: "#60a5fa", textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 8px 0" }}>
              {live ? "● All systems live" : "Mock mode"}
            </p>
            <h1 style={{ fontSize: 24, fontWeight: 850, color: "#fff", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
              Welcome back, Admin
            </h1>
            <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.6)", margin: 0, maxWidth: 460, lineHeight: 1.6 }}>
              Everything on the public site — properties, prices, news, and hero content — is controlled from here and syncs instantly.
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/admin/properties/new" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "11px 22px", borderRadius: 11, background: "linear-gradient(135deg, #3b82f6, #6366f1)", color: "#fff", fontSize: 13, fontWeight: 750, textDecoration: "none", boxShadow: "0 6px 20px rgba(59,130,246,0.4)" }}>
              <PlusIcon style={{ width: 15, height: 15 }} />
              New Property
            </Link>
            <Link href="/home" target="_blank" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "11px 20px", borderRadius: 11, border: "1.5px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
              <ArrowTopRightOnSquareIcon style={{ width: 14, height: 14 }} />
              View site
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(225px, 100%), 1fr))", gap: 15, marginBottom: 24 }}>
        {stats.map(s => (
          <Card key={s.label}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: s.grad, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(15,23,42,0.15)" }}>
                <s.icon style={{ width: 20, height: 20, color: "#fff" }} />
              </div>
              <ChartBarIcon style={{ width: 15, height: 15, color: "#dbe3ee" }} />
            </div>
            <p style={{ fontSize: 26, fontWeight: 850, color: "#0b1220", margin: "0 0 3px 0", letterSpacing: "-0.6px" }}>
              <CountUp value={s.value} />
            </p>
            <p style={{ fontSize: 12.5, fontWeight: 700, color: "#46536b", margin: "0 0 2px 0" }}>{s.label}</p>
            <p style={{ fontSize: 11.5, color: "#a6b2c3", margin: 0 }}>{s.sub}</p>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(230px, 100%), 1fr))", gap: 15, marginBottom: 24 }}>
        {quickActions.map(a => (
          <Link key={a.href} href={a.href} style={{ textDecoration: "none" }}>
            <Card style={{ height: "100%", cursor: "pointer", boxSizing: "border-box" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, backgroundColor: `${a.color}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <a.icon style={{ width: 18, height: 18, color: a.color }} />
                </div>
                <p style={{ fontSize: 14, fontWeight: 750, color: "#0b1220", margin: 0 }}>{a.label}</p>
              </div>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 10px 0", lineHeight: 1.55 }}>{a.desc}</p>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 750, color: a.color }}>
                Open <ArrowRightIcon style={{ width: 12, height: 12 }} />
              </span>
            </Card>
          </Link>
        ))}
      </div>

      {/* Two-column: properties overview + latest intelligence */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))", gap: 15 }}>
        <Card title="Properties Overview" subtitle="Live listings and their key numbers" icon={BuildingOffice2Icon}>
          {rentalProperties.map(p => (
            <Link key={p.id} href={`/admin/properties/${p.id}`} style={{ textDecoration: "none" }}>
              <div className="admin-table-row" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 8px", borderTop: "1px solid #f2f5f9", borderRadius: 8 }}>
                <img src={p.image} alt="" style={{ width: 44, height: 34, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#0b1220", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                  <p style={{ fontSize: 11, color: "#a6b2c3", margin: 0 }}>{p.location}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontSize: 12.5, fontWeight: 750, color: "#0b1220", margin: 0 }}>UGX {p.pricePerShare.toLocaleString()}</p>
                  <p style={{ fontSize: 11, fontWeight: 700, color: p.priceChangePercent >= 0 ? "#10b981" : "#ef4444", margin: 0 }}>
                    {p.priceChangePercent >= 0 ? "+" : ""}{p.priceChangePercent}%
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </Card>

        <Card title="Latest Intelligence" subtitle="Most recent market updates on the site" icon={NewspaperIcon} accent="#7c3aed">
          {intelligenceFeed.slice(0, 5).map(item => (
            <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 8px", borderTop: "1px solid #f2f5f9" }}>
              <span style={{
                fontSize: 9, fontWeight: 800, letterSpacing: "0.04em", flexShrink: 0,
                color: item.type === "decline" ? "#dc2626" : item.type === "approval" ? "#2563eb" : "#0d9488",
                backgroundColor: item.type === "decline" ? "#fef2f2" : item.type === "approval" ? "#eff6ff" : "#f0fdfa",
                padding: "3px 8px", borderRadius: 99,
              }}>{item.category}</span>
              <p style={{ flex: 1, fontSize: 12.5, fontWeight: 650, color: "#0b1220", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</p>
              <span style={{ fontSize: 11, color: "#c3ccd9", flexShrink: 0 }}>{item.timeAgo}</span>
            </div>
          ))}
          <Link href="/admin/intelligence" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 750, color: "#7c3aed", textDecoration: "none", marginTop: 12 }}>
            Manage all updates <ArrowRightIcon style={{ width: 12, height: 12 }} />
          </Link>
        </Card>
      </div>
    </>
  )
}
