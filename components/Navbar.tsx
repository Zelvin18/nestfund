"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MagnifyingGlassIcon, BellIcon, XMarkIcon, Bars3Icon } from "@heroicons/react/24/outline"
import { WalletIcon, ChevronRightIcon } from "@heroicons/react/24/solid"

const navLinks = [
  { href: "/market",       label: "Market",       sub: "Browse properties" },
  { href: "/portfolio",    label: "Portfolio",    sub: "Track investments" },
  { href: "/wallet",       label: "Wallet",       sub: "Manage funds" },
  { href: "/intelligence", label: "Intelligence", sub: "Market updates" },
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backgroundColor: "rgba(255,255,255,0.98)",
          borderBottom: "1px solid #e5e7eb",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            padding: "0 20px",
            height: 64,
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 }}
          >
            <div style={{
              width: 34, height: 34, borderRadius: 9,
              background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 800, fontSize: 16, color: "#fff",
            }}>N</div>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#111827", letterSpacing: "-0.3px" }}>
              NestFund
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav
            className="nav-links"
            style={{ display: "flex", alignItems: "center", gap: 2 }}
          >
            {navLinks.map(({ href, label }) => {
              const active = pathname === href || pathname.startsWith(href + "/")
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    padding: "6px 14px", borderRadius: 8,
                    fontSize: 14, fontWeight: active ? 600 : 500,
                    color: active ? "#2563eb" : "#4b5563",
                    backgroundColor: active ? "#eff6ff" : "transparent",
                    textDecoration: "none", transition: "all 0.15s", whiteSpace: "nowrap",
                  }}
                >{label}</Link>
              )
            })}
          </nav>

          {/* Desktop search */}
          <div className="nav-search" style={{ flex: 1, maxWidth: 400 }}>
            <div style={{ position: "relative" }}>
              <MagnifyingGlassIcon style={{
                position: "absolute", left: 12, top: "50%",
                transform: "translateY(-50%)", width: 16, height: 16, color: "#9ca3af",
              }} />
              <input
                type="text"
                placeholder="Search properties, locations..."
                style={{
                  width: "100%", height: 38, paddingLeft: 38, paddingRight: 16,
                  fontSize: 13, border: "1.5px solid #e5e7eb", borderRadius: 9,
                  backgroundColor: "#f9fafb", color: "#111827", outline: "none",
                }}
              />
            </div>
          </div>

          {/* Desktop right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: "auto", flexShrink: 0 }}>
            <button
              className="nav-bell"
              style={{
                width: 36, height: 36, borderRadius: 8,
                border: "1.5px solid #e5e7eb", background: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              }}
            >
              <BellIcon style={{ width: 18, height: 18, color: "#4b5563" }} />
            </button>

            <Link
              href="/wallet"
              className="nav-wallet"
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 12px", border: "1.5px solid #e5e7eb",
                borderRadius: 9, background: "#fff", cursor: "pointer",
                textDecoration: "none",
              }}
            >
              <WalletIcon style={{ width: 15, height: 15, color: "#2563eb" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>UGX 0</span>
            </Link>

            <Link
              className="nav-sign-in"
              href="/auth/register"
              style={{
                padding: "7px 18px", borderRadius: 9,
                background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
                color: "#fff", fontSize: 13, fontWeight: 600,
                textDecoration: "none", whiteSpace: "nowrap",
              }}
            >Sign In</Link>

            {/* Mobile hamburger */}
            <button
              className="nav-hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: "none",
                width: 38, height: 38, borderRadius: 9,
                border: "1.5px solid #e5e7eb", background: "#fff",
                alignItems: "center", justifyContent: "center",
                cursor: "pointer", flexShrink: 0,
              }}
              aria-label="Toggle menu"
            >
              {menuOpen
                ? <XMarkIcon style={{ width: 20, height: 20, color: "#374151" }} />
                : <Bars3Icon style={{ width: 20, height: 20, color: "#374151" }} />
              }
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE DRAWER ── */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 49,
          }}
        >
          {/* Backdrop */}
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              position: "absolute", inset: 0,
              backgroundColor: "rgba(0,0,0,0.35)",
              backdropFilter: "blur(2px)",
            }}
          />

          {/* Drawer panel */}
          <div
            style={{
              position: "absolute",
              top: 64,
              left: 0,
              right: 0,
              backgroundColor: "#fff",
              borderBottom: "1px solid #e5e7eb",
              boxShadow: "0 16px 48px rgba(0,0,0,0.12)",
              overflow: "hidden",
            }}
          >
            {/* Search on mobile */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
              <div style={{ position: "relative" }}>
                <MagnifyingGlassIcon style={{
                  position: "absolute", left: 12, top: "50%",
                  transform: "translateY(-50%)", width: 16, height: 16, color: "#9ca3af",
                }} />
                <input
                  type="text"
                  placeholder="Search properties..."
                  style={{
                    width: "100%", height: 42, paddingLeft: 40, paddingRight: 16,
                    fontSize: 14, border: "1.5px solid #e5e7eb", borderRadius: 10,
                    backgroundColor: "#f9fafb", color: "#111827", outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Nav links */}
            <nav style={{ padding: "8px 12px" }}>
              {navLinks.map(({ href, label, sub }) => {
                const active = pathname === href || pathname.startsWith(href + "/")
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "12px 14px", borderRadius: 12, textDecoration: "none",
                      backgroundColor: active ? "#eff6ff" : "transparent",
                      marginBottom: 2, transition: "background 0.15s",
                    }}
                  >
                    <div>
                      <p style={{
                        fontSize: 15, fontWeight: 600, margin: 0,
                        color: active ? "#2563eb" : "#0f172a",
                      }}>{label}</p>
                      <p style={{ fontSize: 12, color: "#94a3b8", margin: "2px 0 0 0" }}>{sub}</p>
                    </div>
                    <ChevronRightIcon style={{ width: 16, height: 16, color: active ? "#2563eb" : "#cbd5e1" }} />
                  </Link>
                )
              })}
            </nav>

            {/* Bottom CTA */}
            <div style={{ padding: "12px 20px 20px", borderTop: "1px solid #f1f5f9", display: "flex", gap: 10 }}>
              <Link
                href="/auth/login"
                onClick={() => setMenuOpen(false)}
                style={{
                  flex: 1, textAlign: "center", padding: "11px 0", borderRadius: 10,
                  border: "1.5px solid #e2e8f0", color: "#374151", fontSize: 14,
                  fontWeight: 600, textDecoration: "none",
                }}
              >Log In</Link>
              <Link
                href="/auth/register"
                onClick={() => setMenuOpen(false)}
                style={{
                  flex: 1, textAlign: "center", padding: "11px 0", borderRadius: 10,
                  background: "linear-gradient(135deg, #2563eb, #4f46e5)",
                  color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none",
                }}
              >Get Started</Link>            </div>
          </div>
        </div>
      )}
    </>
  )
}
