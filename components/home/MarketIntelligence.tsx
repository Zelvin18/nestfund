"use client"

import Link from "next/link"
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/solid"
import {
  CheckCircleIcon,
  BuildingOffice2Icon,
  ExclamationTriangleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline"
import { marketIntelligence } from "@/lib/mockData"

export default function MarketIntelligenceSection() {
  return (
    <section style={{ backgroundColor: "#f8fafc", padding: "72px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40 }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
              🤖 AI-Powered
            </p>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", margin: "0 0 8px 0" }}>
              Market Intelligence
            </h2>
            <p style={{ fontSize: 16, color: "#64748b", margin: 0 }}>
              Real-time events affecting property values across the region
            </p>
          </div>
          <Link
            href="/intelligence"
            style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 14, fontWeight: 600, color: "#2563eb", textDecoration: "none" }}
          >
            View All Updates
            <ChevronRightIcon style={{ width: 16, height: 16 }} />
          </Link>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {marketIntelligence.map((item) => (
            <IntelCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}

function IntelCard({ item }: { item: typeof marketIntelligence[0] }) {
  const positive = item.change >= 0

  const config = {
    approval: { Icon: CheckCircleIcon, bg: "#f0fdf4", color: "#16a34a", ring: "#bbf7d0", label: "Government Approval" },
    development: { Icon: BuildingOffice2Icon, bg: "#eff6ff", color: "#2563eb", ring: "#bfdbfe", label: "Development" },
    decline: { Icon: ExclamationTriangleIcon, bg: "#fef2f2", color: "#dc2626", ring: "#fecaca", label: "Risk Alert" },
  }
  const { Icon, bg, color, ring, label } = config[item.type]

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: "20px 22px",
        border: "1.5px solid #f1f5f9",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        display: "flex",
        alignItems: "flex-start",
        gap: 16,
        transition: "box-shadow 0.2s",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          backgroundColor: bg,
          border: `1.5px solid ${ring}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon style={{ width: 22, height: 22, color }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
          <div>
            <span
              style={{
                display: "inline-block",
                fontSize: 10,
                fontWeight: 700,
                color,
                backgroundColor: bg,
                padding: "2px 8px",
                borderRadius: 99,
                marginBottom: 5,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {label}
            </span>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 }}>{item.title}</h3>
          </div>
          <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, flexShrink: 0 }}>{item.timeAgo}</span>
        </div>

        <p style={{ fontSize: 13, color: "#475569", margin: "0 0 10px 0", display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 12 }}>📍</span> {item.location}
        </p>
        <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 12px 0", lineHeight: 1.6 }}>{item.impact}</p>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "5px 12px",
            borderRadius: 99,
            fontSize: 12,
            fontWeight: 700,
            backgroundColor: positive ? "#f0fdf4" : "#fef2f2",
            color: positive ? "#16a34a" : "#dc2626",
            border: `1px solid ${positive ? "#bbf7d0" : "#fecaca"}`,
          }}
        >
          {positive
            ? <ArrowTrendingUpIcon style={{ width: 13, height: 13 }} />
            : <ArrowTrendingDownIcon style={{ width: 13, height: 13 }} />
          }
          Expected impact: {positive ? "+" : ""}{item.change}% on nearby properties
        </div>
      </div>
    </div>
  )
}
