"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import type { User } from "@supabase/supabase-js"
import {
  BellIcon, ArrowDownTrayIcon, ArrowUpTrayIcon,
  ShoppingCartIcon, BanknotesIcon, ArrowsRightLeftIcon,
} from "@heroicons/react/24/outline"
import { useWallet } from "@/lib/hooks"

const SEEN_KEY = "nf-notifications-seen"

const timeAgo = (iso?: string) => {
  if (!iso) return ""
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 90) return "just now"
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

/**
 * Real notifications from the investor's own ledger — every deposit,
 * investment, trade and distribution lands here the moment it happens.
 * Read state is tracked locally per device.
 */
export default function NotificationBell({ user }: { user: User }) {
  const { transactions } = useWallet(user)
  const [open, setOpen] = useState(false)
  const [seenAt, setSeenAt] = useState<number>(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = localStorage.getItem(SEEN_KEY)
    if (stored) {
      // Deferred so the effect never sets state synchronously
      Promise.resolve().then(() => setSeenAt(parseInt(stored, 10) || 0))
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [open])

  const items = (transactions ?? []).slice(0, 12).map(t => ({
    id: t.id,
    title:
      t.type === "deposit" ? "Deposit received" :
      t.type === "withdraw" ? "Withdrawal processed" :
      t.type === "buy" ? (t.label.includes("Exchange") ? "Trade settled" : "Investment confirmed") :
      "Income received",
    desc: t.label,
    amount: t.amount,
    at: t.at,
    Icon:
      t.type === "deposit" ? ArrowDownTrayIcon :
      t.type === "withdraw" ? ArrowUpTrayIcon :
      t.type === "buy" ? (t.label.includes("Exchange") ? ArrowsRightLeftIcon : ShoppingCartIcon) :
      BanknotesIcon,
  }))

  const unread = items.filter(i => i.at && new Date(i.at).getTime() > seenAt).length

  const openPanel = () => {
    setOpen(o => {
      if (!o) {
        const now = Date.now()
        localStorage.setItem(SEEN_KEY, String(now))
        // Badge clears when the panel closes; while open, items keep their unread tint
        setTimeout(() => setSeenAt(now), 400)
      }
      return !o
    })
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        className="nav-bell"
        onClick={openPanel}
        aria-label="Notifications"
        style={{
          position: "relative",
          width: 36, height: 36, borderRadius: 8,
          border: "1.5px solid #e5e7eb", background: open ? "#f8fafc" : "#fff",
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
        }}
      >
        <BellIcon style={{ width: 18, height: 18, color: "#4b5563" }} />
        {unread > 0 && (
          <span style={{ position: "absolute", top: -5, right: -5, minWidth: 17, height: 17, borderRadius: 99, backgroundColor: "#dc2626", color: "#fff", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px", border: "2px solid #fff", boxSizing: "content-box" }}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{ position: "absolute", right: 0, top: 46, width: 330, backgroundColor: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", boxShadow: "0 20px 56px rgba(15,23,42,0.16)", overflow: "hidden", zIndex: 60, animation: "fade-up 0.18s ease-out" }}>
          <div style={{ padding: "14px 18px 12px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontSize: 14.5, fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.2px" }}>Notifications</p>
            {items.length > 0 && <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{items.length} recent</span>}
          </div>

          <div style={{ maxHeight: 360, overflowY: "auto" }}>
            {items.length === 0 ? (
              <div style={{ padding: "32px 20px", textAlign: "center" }}>
                <BellIcon style={{ width: 28, height: 28, color: "#cbd5e1", margin: "0 auto 10px" }} />
                <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", margin: "0 0 3px 0" }}>Nothing yet</p>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>
                  Deposits, investments, trades and income land here as they happen.
                </p>
              </div>
            ) : items.map(n => {
              const isUnread = !!n.at && new Date(n.at).getTime() > seenAt
              return (
                <div key={n.id} style={{ display: "flex", alignItems: "flex-start", gap: 11, padding: "12px 18px", borderBottom: "1px solid #f7f9fb", backgroundColor: isUnread ? "#f6f9ff" : "#fff" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                    <n.Icon style={{ width: 16, height: 16, color: "#64748b" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                      <p style={{ fontSize: 12.5, fontWeight: 750, color: "#0f172a", margin: 0 }}>{n.title}</p>
                      <span style={{ fontSize: 10.5, color: "#94a3b8", flexShrink: 0 }}>{timeAgo(n.at)}</span>
                    </div>
                    <p style={{ fontSize: 11.5, color: "#64748b", margin: "2px 0 0 0", lineHeight: 1.5, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{n.desc}</p>
                    <p style={{ fontSize: 11.5, fontWeight: 750, color: n.amount > 0 ? "#16a34a" : "#0f172a", margin: "3px 0 0 0" }}>
                      {n.amount > 0 ? "+" : "−"}UGX {Math.abs(n.amount).toLocaleString()}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <Link href="/wallet" onClick={() => setOpen(false)} style={{ display: "block", textAlign: "center", padding: "11px 0", fontSize: 12.5, fontWeight: 750, color: "#2563eb", textDecoration: "none", borderTop: "1px solid #f1f5f9" }}>
            View full history in Wallet
          </Link>
        </div>
      )}
    </div>
  )
}
