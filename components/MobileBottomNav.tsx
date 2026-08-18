"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  {
    href: "/home",
    label: "Home",
    icon: (active: boolean) => (
      <svg width={22} height={22} viewBox="0 0 24 24" fill={active ? "#2563eb" : "none"} stroke={active ? "#2563eb" : "#94a3b8"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/opportunities",
    label: "Opportunities",
    icon: (active: boolean) => (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={active ? "#2563eb" : "#94a3b8"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/exchange",
    label: "Exchange",
    icon: (active: boolean) => (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={active ? "#2563eb" : "#94a3b8"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="17 1 21 5 17 9" />
        <path d="M3 11V9a4 4 0 014-4h14" />
        <polyline points="7 23 3 19 7 15" />
        <path d="M21 13v2a4 4 0 01-4 4H3" />
      </svg>
    ),
  },
  {
    href: "/portfolio",
    label: "Portfolio",
    icon: (active: boolean) => (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={active ? "#2563eb" : "#94a3b8"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    href: "/wallet",
    label: "Wallet",
    icon: (active: boolean) => (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={active ? "#2563eb" : "#94a3b8"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 12V22H4V12" />
        <path d="M22 7H2v5h20V7z" />
        <path d="M12 22V7" />
        <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
      </svg>
    ),
  },
]

export default function MobileBottomNav() {
  const pathname = usePathname()

  // Hide on landing page
  if (pathname === "/") return null

  return (
    <nav
      className="mobile-bottom-nav"
      style={{
        display: "none", // shown via CSS media query
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 60,
        backgroundColor: "rgba(255,255,255,0.98)",
        borderTop: "1px solid #e8ecf0",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          height: 60,
        }}
      >
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                textDecoration: "none",
                paddingTop: 8,
                paddingBottom: 6,
                position: "relative",
                transition: "opacity 0.15s",
              }}
            >
              {/* Active indicator dot */}
              {active && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 28,
                    height: 3,
                    borderRadius: "0 0 3px 3px",
                    backgroundColor: "#2563eb",
                  }}
                />
              )}
              {item.icon(active)}
              <span
                style={{
                  fontSize: 9,
                  fontWeight: active ? 700 : 500,
                  color: active ? "#2563eb" : "#94a3b8",
                  letterSpacing: "0.02em",
                  lineHeight: 1,
                }}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
