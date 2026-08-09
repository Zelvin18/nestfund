"use client"

import { useState } from "react"
import Link from "next/link"
import { MagnifyingGlassIcon, PlusIcon, PencilSquareIcon } from "@heroicons/react/24/outline"
import { PageHeader, Card } from "@/components/admin/AdminShell"
import { monthlyIncomeOf } from "@/lib/data/rentals"
import { useRentals } from "@/lib/hooks"

export default function AdminProperties() {
  const [query, setQuery] = useState("")
  const { rentals: rentalProperties } = useRentals()

  const filtered = rentalProperties.filter(p =>
    (p.name + p.location + p.type).toLowerCase().includes(query.toLowerCase())
  )

  return (
    <>
      <PageHeader
        title="Properties"
        subtitle={`${rentalProperties.length} rental properties listed on the platform`}
        action={
          <Link href="/admin/properties/new" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 10, background: "linear-gradient(135deg, #2563eb, #4f46e5)", color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
            <PlusIcon style={{ width: 15, height: 15 }} />
            New Property
          </Link>
        }
      />

      <Card style={{ padding: 0 }}>
        {/* Search */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #f0f2f6" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "9px 14px", maxWidth: 360 }}>
            <MagnifyingGlassIcon style={{ width: 15, height: 15, color: "#94a3b8", flexShrink: 0 }} />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search by name, location, type..."
              style={{ flex: 1, border: "none", outline: "none", fontSize: 13, color: "#0f172a", minWidth: 0 }}
            />
          </div>
        </div>

        {/* Table */}
        <div className="responsive-table">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1.5px solid #f0f2f6" }}>
                {["Property", "Type", "Share Price", "24h", "Yield", "Occupancy", "Monthly Income", "Investors", "Status", ""].map(h => (
                  <th key={h} style={{ padding: "11px 16px", textAlign: h === "Property" ? "left" : "right", fontSize: 10.5, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid #f6f8fa" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                      <img src={p.image} alt="" style={{ width: 46, height: 36, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: 0, whiteSpace: "nowrap" }}>{p.name}</p>
                        <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, whiteSpace: "nowrap" }}>{p.location}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 12.5, color: "#64748b", whiteSpace: "nowrap" }}>{p.type}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap" }}>UGX {p.pricePerShare.toLocaleString()}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 12.5, fontWeight: 700, color: p.priceChangePercent >= 0 ? "#10b981" : "#ef4444", whiteSpace: "nowrap" }}>
                    {p.priceChangePercent >= 0 ? "+" : ""}{p.priceChangePercent}%
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 12.5, fontWeight: 600, color: "#0d9488", whiteSpace: "nowrap" }}>{p.rentalYield}%</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 12.5, color: "#64748b", whiteSpace: "nowrap" }}>{p.occupancy}%</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 12.5, color: "#64748b", whiteSpace: "nowrap" }}>UGX {(monthlyIncomeOf(p) / 1e6).toFixed(2)}M</td>
                  <td style={{ padding: "12px 16px", textAlign: "right", fontSize: 12.5, color: "#64748b" }}>{p.investors}</td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: "#16a34a", backgroundColor: "#f0fdf4", border: "1px solid #dcfce7", padding: "3px 10px", borderRadius: 99 }}>{p.status}</span>
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                    <Link href={`/admin/properties/${p.id}`} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 700, color: "#2563eb", textDecoration: "none", whiteSpace: "nowrap" }}>
                      <PencilSquareIcon style={{ width: 14, height: 14 }} />
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <p style={{ padding: "28px 20px", textAlign: "center", fontSize: 13, color: "#94a3b8" }}>No properties match &ldquo;{query}&rdquo;</p>
        )}
      </Card>
    </>
  )
}
