"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { XMarkIcon, Bars3Icon, ArrowRightStartOnRectangleIcon, ChartPieIcon, Cog6ToothIcon } from "@heroicons/react/24/outline"
import NavSearch from "@/components/NavSearch"
import NotificationBell from "@/components/NotificationBell"
import { WalletIcon, ChevronRightIcon } from "@heroicons/react/24/solid"
import { useSession, useWallet, useBalanceVisibility } from "@/lib/hooks"
import { signOut } from "@/lib/auth"

const publicLinks = [
  { href: "/opportunities", label: "Opportunities",  sub: "The investment marketplace" },
  { href: "/market",        label: "Property",       sub: "Rental & construction" },
  { href: "/exchange",      label: "Exchange",       sub: "Sell your shares P2P" },
  { href: "/developers",    label: "For Businesses", sub: "Apply for funding" },
]

/* Personal pages — only in the nav once someone is signed in */
const memberLinks = [
  { href: "/portfolio",     label: "Portfolio",      sub: "Track investments" },
  { href: "/wallet",        label: "Wallet",         sub: "Manage funds" },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  const { user } = useSession()
  const { balance, live: walletLive } = useWallet(user)
  const { shown: balanceShown } = useBalanceVisibility()

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) || user?.email?.split("@")[0] || "Investor"
  const initials = displayName
    .split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? "").join("") || "N"

  // Close the account menu on outside click
  useEffect(() => {
    if (!userMenuOpen) return
    const onDown = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [userMenuOpen])

  const handleSignOut = async () => {
    setUserMenuOpen(false)
    setMenuOpen(false)
    await signOut()
    router.push("/")
  }

  // Portfolio and Wallet are personal — they appear only when signed in
  const navLinks = user ? [...publicLinks.slice(0, 3), ...memberLinks, publicLinks[3]] : publicLinks

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

          {/* Desktop nav links — pushed right: the flexible space sits after the logo */}
          <nav
            className="nav-links"
            style={{ display: "flex", alignItems: "center", gap: 2, marginLeft: "auto" }}
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

          {/* Desktop search — live results from the marketplace feed */}
          <div className="nav-search" style={{ width: 260, flexShrink: 0 }}>
            <NavSearch />
          </div>

          {/* Right actions — pinned to the far edge (marginLeft:auto keeps the
              avatar + hamburger hard right once the links/search are hidden) */}
          <div className="nav-actions" style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {/* Bell + wallet pill are personal — hidden until signed in */}
            {user && (
              <>
                <NotificationBell user={user} />

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
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#111827", fontVariantNumeric: "tabular-nums" }}>
                    {balanceShown
                      ? `UGX ${walletLive && balance !== null ? balance.toLocaleString() : "0"}`
                      : "UGX ••••••"}
                  </span>
                </Link>
              </>
            )}

            {user ? (
              /* Signed in: initials avatar + account menu */
              <div ref={userMenuRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setUserMenuOpen(o => !o)}
                  aria-label="Account menu"
                  style={{
                    width: 36, height: 36, borderRadius: "50%", border: "none", cursor: "pointer",
                    background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
                    color: "#fff", fontSize: 13, fontWeight: 800, letterSpacing: "0.02em",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: userMenuOpen ? "0 0 0 3px rgba(37,99,235,0.25)" : "none",
                  }}
                >{initials}</button>

                {userMenuOpen && (
                  <div style={{
                    position: "absolute", right: 0, top: 46, width: 230, backgroundColor: "#fff",
                    borderRadius: 14, border: "1px solid #e8ecf0", boxShadow: "0 16px 48px rgba(0,0,0,0.14)",
                    overflow: "hidden", zIndex: 60, animation: "fade-up 0.18s ease-out",
                  }}>
                    <div style={{ padding: "13px 16px", borderBottom: "1px solid #f1f5f9" }}>
                      <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{displayName}</p>
                      <p style={{ fontSize: 11.5, color: "#94a3b8", margin: "2px 0 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</p>
                    </div>
                    <div style={{ padding: 6 }}>
                      {[
                        { href: "/portfolio", label: "My Portfolio", icon: ChartPieIcon },
                        { href: "/wallet", label: "Wallet", icon: WalletIcon },
                        { href: "/onboarding", label: "Account Setup", icon: Cog6ToothIcon },
                      ].map(item => (
                        <Link key={item.href} href={item.href} onClick={() => setUserMenuOpen(false)}
                          style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 11px", borderRadius: 9, textDecoration: "none", fontSize: 13.5, fontWeight: 600, color: "#374151" }}>
                          <item.icon style={{ width: 16, height: 16, color: "#94a3b8" }} />{item.label}
                        </Link>
                      ))}
                      <button onClick={handleSignOut}
                        style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 11px", borderRadius: 9, border: "none", background: "none", cursor: "pointer", fontSize: 13.5, fontWeight: 600, color: "#dc2626", width: "100%", textAlign: "left" }}>
                        <ArrowRightStartOnRectangleIcon style={{ width: 16, height: 16 }} />Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
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
            )}

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
            {/* Search on mobile — same live results */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9" }}>
              <div onClick={() => setMenuOpen(true)}>
                <NavSearch compact />
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
            {user ? (
              <div style={{ padding: "12px 20px 20px", borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%", flexShrink: 0,
                  background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
                  color: "#fff", fontSize: 14, fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{initials}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{displayName}</p>
                  <p style={{ fontSize: 11.5, color: "#94a3b8", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</p>
                </div>
                <button onClick={handleSignOut}
                  style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 10, border: "1.5px solid #fecaca", background: "#fef2f2", cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#dc2626", flexShrink: 0 }}>
                  <ArrowRightStartOnRectangleIcon style={{ width: 15, height: 15 }} />Sign Out
                </button>
              </div>
            ) : (
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
                >Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
