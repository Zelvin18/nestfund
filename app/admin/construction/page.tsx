"use client"

import Link from "next/link"
import { PlusIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline"
import { PageHeader, Card } from "@/components/admin/AdminShell"
import { constructionProjects } from "@/lib/data/construction"

const fmtB = (v: number) => v >= 1e9 ? `UGX ${(v / 1e9).toFixed(1)}B` : `UGX ${(v / 1e6).toFixed(0)}M`

export default function AdminConstruction() {
  return (
    <>
      <PageHeader
        title="Construction Projects"
        subtitle={`${constructionProjects.length} projects raising capital or under construction`}
        action={
          <button style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer", background: "linear-gradient(135deg, #d97706, #b45309)", color: "#fff", fontSize: 13, fontWeight: 700 }}>
            <PlusIcon style={{ width: 15, height: 15 }} />
            New Project
          </button>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(420px, 100%), 1fr))", gap: 14 }}>
        {constructionProjects.map(c => (
          <Card key={c.id} style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ display: "flex", gap: 0 }}>
              <img src={c.image} alt="" style={{ width: 130, objectFit: "cover", flexShrink: 0 }} />
              <div style={{ padding: "16px 18px", flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 2 }}>
                  <p style={{ fontSize: 14.5, fontWeight: 800, color: "#0f172a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</p>
                  <span style={{ fontSize: 10, fontWeight: 700, color: c.stageColor, backgroundColor: `${c.stageColor}18`, padding: "3px 9px", borderRadius: 99, whiteSpace: "nowrap", flexShrink: 0 }}>{c.stage}</span>
                </div>
                <p style={{ fontSize: 11.5, color: "#94a3b8", margin: "0 0 12px 0" }}>{c.location} · {c.developer}</p>

                {/* Funding bar */}
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#64748b" }}>Funding {c.fundingProgress}%</span>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>{fmtB(c.capitalRaised)} of {fmtB(c.capitalNeeded)}</span>
                </div>
                <div style={{ height: 6, borderRadius: 99, backgroundColor: "#f1f5f9", overflow: "hidden", marginBottom: 12 }}>
                  <div style={{ height: "100%", width: `${Math.min(100, c.fundingProgress)}%`, backgroundColor: "#2563eb", borderRadius: 99 }} />
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: 14 }}>
                    <span style={{ fontSize: 11.5, color: "#64748b" }}>Share <strong style={{ color: "#0f172a" }}>UGX {c.sharePrice.toLocaleString()}</strong></span>
                    <span style={{ fontSize: 11.5, color: "#64748b" }}>ROI <strong style={{ color: "#0d9488" }}>{c.projectedROI}%</strong></span>
                    <span style={{ fontSize: 11.5, color: "#64748b" }}>Built <strong style={{ color: "#0f172a" }}>{c.constructionProgress}%</strong></span>
                  </div>
                  <Link href={`/construction/${c.id}`} target="_blank" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5, fontWeight: 700, color: "#2563eb", textDecoration: "none" }}>
                    View <ArrowTopRightOnSquareIcon style={{ width: 12, height: 12 }} />
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <p style={{ fontSize: 12, color: "#b6c1cf", marginTop: 18 }}>
        Full project editing (funding tranches, milestone reports, progress photos) arrives with the database connection — same pattern as the property editor.
      </p>
    </>
  )
}
