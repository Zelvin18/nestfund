"use client"

import Link from "next/link"
import { LockClosedIcon, ArrowRightIcon } from "@heroicons/react/24/outline"
import { useSession } from "@/lib/hooks"

/**
 * Privacy gate for personal pages (Portfolio, Wallet).
 * Trades, balances and transaction history belong to one person —
 * nothing renders until that person is signed in.
 */
export default function SignInGate({ title, description, children }: {
  title: string
  description: string
  children: React.ReactNode
}) {
  const { user, loading } = useSession()

  if (user) return <>{children}</>

  // Brief blank while the session resolves — avoids flashing the gate at signed-in users
  if (loading) return <div style={{ minHeight: "60vh", backgroundColor: "#f5f6f8" }} />

  return (
    <div style={{ minHeight: "80vh", backgroundColor: "#f5f6f8", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 20px" }}>
      <div style={{ width: "100%", maxWidth: 440, backgroundColor: "#fff", borderRadius: 20, border: "1px solid #e8ecf0", boxShadow: "0 12px 40px rgba(15,23,42,0.08)", padding: "40px 32px", textAlign: "center", animation: "fade-up 0.3s ease-out" }}>
        <div style={{ width: 62, height: 62, borderRadius: "50%", backgroundColor: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
          <LockClosedIcon style={{ width: 26, height: 26, color: "#2563eb" }} />
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.4px", margin: "0 0 8px 0" }}>{title}</h1>
        <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, margin: "0 0 26px 0" }}>{description}</p>

        <Link href="/auth/login" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, width: "100%", boxSizing: "border-box", padding: "13px 0", borderRadius: 12, background: "linear-gradient(135deg, #2563eb, #4f46e5)", color: "#fff", fontSize: 14.5, fontWeight: 700, textDecoration: "none", marginBottom: 10 }}>
          Log In
          <ArrowRightIcon style={{ width: 15, height: 15 }} />
        </Link>
        <Link href="/auth/register" style={{ display: "block", width: "100%", boxSizing: "border-box", padding: "12px 0", borderRadius: 12, border: "1.5px solid #e2e8f0", color: "#374151", fontSize: 14, fontWeight: 650, textDecoration: "none", marginBottom: 20 }}>
          Create a Free Account
        </Link>

        <p style={{ fontSize: 12, color: "#b6c1cf", margin: 0, lineHeight: 1.6 }}>
          Your balances, holdings and transaction history are private — only visible to you when signed in.
        </p>
      </div>
    </div>
  )
}
