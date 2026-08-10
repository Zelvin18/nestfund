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
  UsersIcon,
  InboxArrowDownIcon,
} from "@heroicons/react/24/outline"
import { isSupabaseConfigured } from "@/lib/supabase"

const navSections: Array<{ label: string; items: Array<{ href: string; label: string; icon: typeof Squares2X2Icon; exact?: boolean; soon?: boolean }> }> = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: Squares2X2Icon, exact: true },
    ],
  },
  {
    label: "Markets",
    items: [
      { href: "/admin/properties", label: "Properties", icon: BuildingOffice2Icon },
      { href: "/admin/construction", label: "Construction", icon: WrenchScrewdriverIcon },
      { href: "/admin/exchange", label: "Exchange", icon: ArrowsRightLeftIcon },
      { href: "/admin/submissions", label: "Submissions", icon: InboxArrowDownIcon },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/intelligence", label: "Intelligence", icon: NewspaperIcon },
      { href: "/admin/settings", label: "Site Settings", icon: Cog6ToothIcon },
    ],
  },
  {
    label: "Platform",
    items: [
      { href: "/admin/managers", label: "Managers", icon: UserGroupIcon, soon: true },
      { href: "/admin/investors", label: "Investors", icon: UsersIcon, soon: true },
    ],
  },
]

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const live = isSupabaseConfigured()

  return (
    <div className="admin-root" style={{ minHeight: "100vh", display: "flex", backgroundColor: "#f2f5f9" }}>

      {/* ── Sidebar ── */}
      <aside className="admin-sidebar" style={{
        width: 240, flexShrink: 0,
        background: "linear-gradient(180deg, #0a1120 0%, #0d1730 60%, #101d3d 100%)",
        display: "flex", flexDirection: "column",
        position: "sticky", top: 0, height: "100vh",
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "22px 20px 20px" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #3b82f6, #6366f1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 17, color: "#fff", flexShrink: 0,
            boxShadow: "0 0 22px rgba(59,130,246,0.45)",
          }}>N</div>
          <div>
            <p style={{ fontSize: 15.5, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1.2, letterSpacing: "-0.2px" }}>NestFund</p>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#4c5c7a", margin: 0, textTransform: "uppercase", letterSpacing: "0.14em" }}>Control Center</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="admin-nav" style={{ flex: 1, padding: "4px 14px 14px", overflowY: "auto" }}>
          {navSections.map(section => (
            <div key={section.label} style={{ marginBottom: 6 }}>
              <p className="admin-nav-label" style={{ fontSize: 9.5, fontWeight: 800, color: "#3d4c68", textTransform: "uppercase", letterSpacing: "0.16em", margin: "14px 10px 7px" }}>
                {section.label}
              </p>
              {section.items.map(item => {
                const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.soon ? "#" : item.href}
                    style={{
                      display: "flex", alignItems: "center", gap: 11,
                      padding: "10px 12px", borderRadius: 10, marginBottom: 2,
                      background: active ? "linear-gradient(90deg, rgba(59,130,246,0.28), rgba(99,102,241,0.12))" : "transparent",
                      color: active ? "#dbeafe" : item.soon ? "#334463" : "#8598b8",
                      fontSize: 13.5, fontWeight: active ? 700 : 600, textDecoration: "none",
                      cursor: item.soon ? "default" : "pointer",
                      boxShadow: active ? "inset 0 0 0 1px rgba(96,165,250,0.35)" : "none",
                      transition: "all 0.15s",
                    }}
                  >
                    <item.icon style={{ width: 17, height: 17, flexShrink: 0, color: active ? "#60a5fa" : undefined }} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.soon && <span style={{ fontSize: 8, fontWeight: 800, color: "#41527a", border: "1px solid #223052", borderRadius: 5, padding: "2px 6px", letterSpacing: "0.06em" }}>SOON</span>}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Footer: connection state + view site */}
        <div className="admin-side-footer" style={{ padding: "14px 16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8, marginBottom: 12,
            backgroundColor: live ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)",
            border: `1px solid ${live ? "rgba(16,185,129,0.25)" : "rgba(245,158,11,0.25)"}`,
            borderRadius: 9, padding: "8px 11px",
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
              backgroundColor: live ? "#10b981" : "#f59e0b",
              animation: "pulse-dot 2s ease-in-out infinite",
            }} />
            <span style={{ fontSize: 11.5, fontWeight: 700, color: live ? "#6ee7b7" : "#fbbf24" }}>
              {live ? "Database live" : "Mock mode"}
            </span>
          </div>
          <Link href="/home" target="_blank" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, fontSize: 12.5, fontWeight: 700, color: "#8598b8", textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, padding: "9px 0" }}>
            <ArrowTopRightOnSquareIcon style={{ width: 14, height: 14 }} />
            View live site
          </Link>
        </div>
      </aside>

      {/* ── Content ── */}
      <main className="admin-main" style={{ flex: 1, minWidth: 0, padding: "30px 34px 56px" }}>
        {children}
      </main>
    </div>
  )
}

/* ── Shared admin UI primitives ── */

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginBottom: 26 }}>
      <div>
        <h1 style={{ fontSize: 25, fontWeight: 850, color: "#0b1220", margin: "0 0 5px 0", letterSpacing: "-0.6px" }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 13.5, color: "#7c8ba1", margin: 0 }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function Card({ title, subtitle, icon: Icon, accent = "#2563eb", children, style }: {
  title?: string; subtitle?: string
  icon?: React.ComponentType<{ style?: React.CSSProperties }>
  accent?: string
  children: React.ReactNode; style?: React.CSSProperties
}) {
  return (
    <div className="admin-card" style={{
      backgroundColor: "#fff", borderRadius: 16, border: "1px solid #e5eaf2",
      boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
      padding: "22px 24px", ...style,
    }}>
      {title && (
        <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 18 }}>
          {Icon && (
            <div style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: `${accent}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon style={{ width: 17, height: 17, color: accent }} />
            </div>
          )}
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 750, color: "#0b1220", margin: 0, letterSpacing: "-0.2px" }}>{title}</h2>
            {subtitle && <p style={{ fontSize: 12, color: "#94a3b8", margin: "2px 0 0 0" }}>{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  )
}

export const fieldLabel: React.CSSProperties = {
  fontSize: 11.5, fontWeight: 700, color: "#46536b", display: "block", marginBottom: 6,
  textTransform: "uppercase", letterSpacing: "0.04em",
}

export const fieldInput: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", border: "1.5px solid #e2e8f0", borderRadius: 10,
  padding: "10px 13px", fontSize: 13.5, fontWeight: 500, color: "#0f172a", outline: "none",
  backgroundColor: "#fbfcfe",
}

export function SaveBar({ onSave, saved, saving, error, label = "Save Changes" }: {
  onSave: () => void; saved: boolean; saving?: boolean; error?: string | null; label?: string
}) {
  const live = isSupabaseConfigured()
  return (
    <div style={{ marginTop: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button
          onClick={onSave}
          disabled={saving}
          style={{
            padding: "12px 30px", borderRadius: 11, border: "none",
            cursor: saving ? "wait" : "pointer", opacity: saving ? 0.7 : 1,
            background: "linear-gradient(135deg, #2563eb, #4f46e5)", color: "#fff",
            fontSize: 13.5, fontWeight: 750,
            boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
          }}
        >
          {saving ? "Saving..." : label}
        </button>
        {saved && !error && (
          <span style={{ fontSize: 12.5, fontWeight: 700, color: "#10b981" }}>
            ✓ Saved{live ? " — live on the site" : " (session only — connect the database to persist)"}
          </span>
        )}
      </div>
      {error && (
        <p style={{ fontSize: 12.5, fontWeight: 600, color: "#dc2626", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", margin: "12px 0 0 0", lineHeight: 1.55 }}>
          {error}
        </p>
      )}
    </div>
  )
}
