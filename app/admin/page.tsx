"use client"

import Link from "next/link"
import {
  BuildingOffice2Icon,
  WrenchScrewdriverIcon,
  NewspaperIcon,
  UserGroupIcon,
  ArrowRightIcon,
  PlusIcon,
} from "@heroicons/react/24/outline"
import { PageHeader, Card } from "@/components/admin/AdminShell"
import { rentalProperties, monthlyIncomeOf } from "@/lib/data/rentals"
import { constructionProjects } from "@/lib/data/construction"
import { intelligenceFeed } from "@/lib/data/intelligence"

const fmtB = (v: number) => v >= 1e9 ? `UGX ${(v / 1e9).toFixed(1)}B` : `UGX ${(v / 1e6).toFixed(0)}M`

export default function AdminDashboard() {
  const totalValue = rentalProperties.reduce((s, p) => s + p.currentPrice, 0)
  const totalInvestors = rentalProperties.reduce((s, p) => s + p.investors, 0) + constructionProjects.reduce((s, p) => s + p.investors, 0)
  const monthlyIncome = rentalProperties.reduce((s, p) => s + monthlyIncomeOf(p), 0)
  const capitalRaised = constructionProjects.reduce((s, p) => s + p.capitalRaised, 0)

  const stats = [
    { label: "Rental Properties", value: String(rentalProperties.length), sub: fmtB(totalValue) + " under management", color: "#2563eb" },
    { label: "Construction Projects", value: String(constructionProjects.length), sub: fmtB(capitalRaised) + " capital raised", color: "#f59e0b" },
    { label: "Total Investors", value: totalInvestors.toLocaleString(), sub: "across all listings", color: "#7c3aed" },
    { label: "Monthly Distributions", value: fmtB(monthlyIncome), sub: "rental income / month", color: "#10b981" },
  ]

  const quickActions = [
    { href: "/admin/properties", label: "Manage Properties", desc: "Pricing, images, documents, activities", icon: BuildingOffice2Icon, color: "#2563eb", bg: "#eff6ff" },
    { href: "/admin/construction", label: "Construction Projects", desc: "Funding, progress, milestones", icon: WrenchScrewdriverIcon, color: "#d97706", bg: "#fffbeb" },
    { href: "/admin/intelligence", label: "Post Intelligence", desc: "Market news and risk alerts", icon: NewspaperIcon, color: "#7c3aed", bg: "#f5f3ff" },
    { href: "/admin/settings", label: "Site Settings", desc: "Featured properties, platform stats", icon: UserGroupIcon, color: "#0d9488", bg: "#f0fdfa" },
  ]

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle="Everything on the public site is managed from here."
        action={
          <Link href="/admin/properties/new" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 10, background: "linear-gradient(135deg, #2563eb, #4f46e5)", color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
            <PlusIcon style={{ width: 15, height: 15 }} />
            New Property
          </Link>
        }
      />

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))", gap: 14, marginBottom: 22 }}>
        {stats.map(s => (
          <Card key={s.label}>
            <div style={{ width: 34, height: 4, borderRadius: 99, backgroundColor: s.color, marginBottom: 12 }} />
            <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500, margin: "0 0 4px 0" }}>{s.label}</p>
            <p style={{ fontSize: 24, fontWeight: 800, color: "#0f172a", margin: "0 0 2px 0", letterSpacing: "-0.5px" }}>{s.value}</p>
            <p style={{ fontSize: 11.5, color: "#b6c1cf", margin: 0 }}>{s.sub}</p>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(230px, 100%), 1fr))", gap: 14, marginBottom: 22 }}>
        {quickActions.map(a => (
          <Link key={a.href} href={a.href} style={{ textDecoration: "none" }}>
            <Card style={{ height: "100%", cursor: "pointer" }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, backgroundColor: a.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 13 }}>
                <a.icon style={{ width: 19, height: 19, color: a.color }} />
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 3px 0" }}>{a.label}</p>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 10px 0", lineHeight: 1.5 }}>{a.desc}</p>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: a.color }}>
                Open <ArrowRightIcon style={{ width: 12, height: 12 }} />
              </span>
            </Card>
          </Link>
        ))}
      </div>

      {/* Two-column: properties overview + latest intelligence */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))", gap: 14 }}>
        <Card title="Properties Overview" subtitle="Live listings and their key numbers">
          {rentalProperties.map(p => (
            <Link key={p.id} href={`/admin/properties/${p.id}`} style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderTop: "1px solid #f4f6f9" }}>
                <img src={p.image} alt="" style={{ width: 42, height: 34, borderRadius: 7, objectFit: "cover", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</p>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{p.location}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontSize: 12.5, fontWeight: 700, color: "#0f172a", margin: 0 }}>UGX {p.pricePerShare.toLocaleString()}</p>
                  <p style={{ fontSize: 11, fontWeight: 600, color: p.priceChangePercent >= 0 ? "#10b981" : "#ef4444", margin: 0 }}>
                    {p.priceChangePercent >= 0 ? "+" : ""}{p.priceChangePercent}%
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </Card>

        <Card title="Latest Intelligence" subtitle="Most recent market updates on the site">
          {intelligenceFeed.slice(0, 5).map(item => (
            <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderTop: "1px solid #f4f6f9" }}>
              <span style={{
                fontSize: 9.5, fontWeight: 800, letterSpacing: "0.04em", flexShrink: 0,
                color: item.type === "decline" ? "#dc2626" : item.type === "approval" ? "#2563eb" : "#0d9488",
                backgroundColor: item.type === "decline" ? "#fef2f2" : item.type === "approval" ? "#eff6ff" : "#f0fdfa",
                padding: "3px 8px", borderRadius: 99,
              }}>{item.category}</span>
              <p style={{ flex: 1, fontSize: 12.5, fontWeight: 600, color: "#0f172a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</p>
              <span style={{ fontSize: 11, color: "#b6c1cf", flexShrink: 0 }}>{item.timeAgo}</span>
            </div>
          ))}
          <Link href="/admin/intelligence" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 700, color: "#2563eb", textDecoration: "none", marginTop: 12 }}>
            Manage all updates <ArrowRightIcon style={{ width: 12, height: 12 }} />
          </Link>
        </Card>
      </div>
    </>
  )
}
