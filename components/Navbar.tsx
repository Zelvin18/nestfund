"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MagnifyingGlassIcon, BellIcon } from "@heroicons/react/24/outline"
import { WalletIcon } from "@heroicons/react/24/solid"

const navLinks = [
  { href: "/market", label: "Market" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/intelligence", label: "Intelligence" },
  { href: "/about", label: "About" },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "rgba(255,255,255,0.97)",
        borderBottom: "1px solid #e5e7eb",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          gap: 32,
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 16,
              color: "#fff",
              letterSpacing: "-0.5px",
            }}
          >
            N
          </div>
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.3px",
            }}
          >
            NestFund
          </span>
        </Link>

        {/* Nav links */}
        <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {navLinks.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/")
            return (
              <Link
                key={href}
                href={href}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: active ? 600 : 500,
                  color: active ? "#2563eb" : "#4b5563",
                  backgroundColor: active ? "#eff6ff" : "transparent",
                  textDecoration: "none",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: 400 }}>
          <div style={{ position: "relative" }}>
            <MagnifyingGlassIcon
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                width: 16,
                height: 16,
                color: "#9ca3af",
              }}
            />
            <input
              type="text"
              placeholder="Search properties, locations..."
              style={{
                width: "100%",
                height: 38,
                paddingLeft: 38,
                paddingRight: 16,
                fontSize: 13,
                border: "1.5px solid #e5e7eb",
                borderRadius: 9,
                backgroundColor: "#f9fafb",
                color: "#111827",
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto", flexShrink: 0 }}>
          <button
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              border: "1.5px solid #e5e7eb",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <BellIcon style={{ width: 18, height: 18, color: "#4b5563" }} />
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              border: "1.5px solid #e5e7eb",
              borderRadius: 9,
              background: "#fff",
              cursor: "pointer",
            }}
          >
            <WalletIcon style={{ width: 15, height: 15, color: "#2563eb" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>UGX 0</span>
          </div>

          <Link
            href="/auth/register"
            style={{
              padding: "7px 18px",
              borderRadius: 9,
              background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Sign In
          </Link>
        </div>
      </div>
    </header>
  )
}
