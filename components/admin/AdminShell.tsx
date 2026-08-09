"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Squares2X2Icon,
  BuildingOffice2Icon,
  WrenchScrewdriverIcon,
  NewspaperIcon,
  Cog6ToothIcon,
  ArrowsRightLeftIcon,
  UserGroupIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline"
import { isSupabaseConfigured } from "@/lib/supabase"

const nav = [
  { href: "/admin", label: "Dashboard", icon: Squares2X2Icon, exact: true },
  { href: "/admin/properties", label: "Properties", icon: BuildingOffice2Icon },
  { href: "/admin/construction", label: "Construction", icon: WrenchScrewdriverIcon },
  { href: "/admin/exchange", label: "Exchange", icon: ArrowsRightLeftIcon, soon: true },
  { href: "/admin/intelligence", label: "Intelligence", icon: NewspaperIcon },
  { href: "/admin/managers", label: "Managers", icon: UserGroupIcon, soon: true },
  { href: "/admin/settings", label: "Site Settings", icon: Cog6ToothIcon },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const live = isSupabaseConfigured()

  return (
    <div className="admin-root" style={{ minHeight: "100vh", display: "flex", backgroundColor: "#f4f6fa" }}>

      {/* ── Sidebar ── */}
      <aside className="admin-sidebar" style={{
        width: 232, flexShrink: 0, backgroundColor: "#0c1425",
        display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh",
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "20px 20px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "linear-gradient(135deg, #2563eb, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: "#fff", flexShrink: 0 }}>N</div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.2 }}>NestFund</p>
            <p style={{ fontSize: 10.5, fontWeight: 600, color: "#475569", margin: 0, textTransform: "uppercase", letterSpacing: "0.1em" }}>Admin Console</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="admin-nav" style={{ flex: 1, padding: "14px 12px", overflowY: "auto" }}>
          {nav.map(item => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.soon ? "#" : item.href}
                style={{
                  display: "flex", alignItems: "center", gap: 11,
                  padding: "10px 12px", borderRadius: 9, marginBottom: 3,
                  backgroundColor: active ? "rgba(37,99,235,0.18)" : "transparent",
                  color: active ? "#93c5fd" : item.soon ? "#3b4a63" : "#8fa3bf",
                  fontSize: 13.5, fontWeight: 600, textDecoration: "none",
                  cursor: item.soon ? "default" : "pointer",
                  borderLeft: active ? "3px solid #3b82f6" : "3px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                <item.icon style={{ width: 17, height: 17, flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.soon && <span style={{ fontSize: 8.5, fontWeight: 700, color: "#475569", border: "1px solid #26334d", borderRadius: 5, padding: "1px 5px", letterSpacing: "0.05em" }}>SOON</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer: connection state + view site */}
        <div className="admin-side-footer" style={{ padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
              backgroundColor: live ? "#10b981" : "#f59e0b",
            }} />
            <span style={{ fontSize: 11.5, fontWeight: 600, color: live ? "#6ee7b7" : "#fbbf24" }}>
              {live ? "Database connected" : "Mock mode — DB not connected"}
            </span>
          </div>
          <Link href="/home" target="_blank" style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 600, color: "#64748b", textDecoration: "none" }}>
            <ArrowTopRightOnSquareIcon style={{ width: 14, height: 14 }} />
            View live site
          </Link>
        </div>
      </aside>

      {/* ── Content ── */}
      <main className="admin-main" style={{ flex: 1, minWidth: 0, padding: "28px 32px 48px" }}>
        {children}
      </main>
    </div>
  )
}

/* ── Shared admin UI primitives ── */

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginBottom: 24 }}>
      <div>
        <h1 style={{ fontSize: 23, fontWeight: 800, color: "#0f172a", margin: "0 0 4px 0", letterSpacing: "-0.4px" }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 13.5, color: "#8395ab", margin: 0 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function Card({ title, subtitle, children, style }: { title?: string; subtitle?: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ backgroundColor: "#fff", borderRadius: 14, border: "1px solid #e6eaf0", padding: "20px 22px", ...style }}>
      {title && (
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 }}>{title}</h2>
          {subtitle && <p style={{ fontSize: 12, color: "#94a3b8", margin: "3px 0 0 0" }}>{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  )
}

export const fieldLabel: React.CSSProperties = {
  fontSize: 12, fontWeight: 700, color: "#3f4c60", display: "block", marginBottom: 6,
}

export const fieldInput: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", border: "1.5px solid #e2e8f0", borderRadius: 10,
  padding: "10px 13px", fontSize: 13.5, fontWeight: 500, color: "#0f172a", outline: "none",
  backgroundColor: "#fff",
}

export function SaveBar({ onSave, saved, label = "Save Changes" }: { onSave: () => void; saved: boolean; label?: string }) {
  const live = isSupabaseConfigured()
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 4 }}>
      <button
        onClick={onSave}
        style={{
          padding: "11px 26px", borderRadius: 10, border: "none", cursor: "pointer",
          background: "linear-gradient(135deg, #2563eb, #4f46e5)", color: "#fff",
          fontSize: 13.5, fontWeight: 700,
        }}
      >
        {label}
      </button>
      {saved && (
        <span style={{ fontSize: 12.5, fontWeight: 600, color: "#10b981" }}>
          ✓ Saved{live ? "" : " (session only — connect the database to persist)"}
        </span>
      )}
    </div>
  )
}
