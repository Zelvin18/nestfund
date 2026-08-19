"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ArrowsRightLeftIcon,
  BuildingLibraryIcon,
  DevicePhoneMobileIcon,
  CreditCardIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  HomeModernIcon,
  ShoppingCartIcon,
  PlusIcon,
  TrashIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline"
import {
  CheckBadgeIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid"
import { formatCurrency } from "@/lib/utils"
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"
import ChartBox from "@/components/ui/ChartBox"

import {
  initialPayMethods,
  type MethodKind,
  type PayMethod,
} from "@/lib/data/portfolio"
import { useSession, useWallet, useLedgerHoldings, useBalanceVisibility } from "@/lib/hooks"
import { demoTopUp, demoWithdraw } from "@/lib/ledger"

/* Payment method branding — UI concern, stays with the component */
const methodBrand: Record<MethodKind, { name: string; short: string; color: string; bg: string; text: string; icon: typeof DevicePhoneMobileIcon }> = {
  mtn:    { name: "MTN Mobile Money", short: "MTN",    color: "#facc15", bg: "linear-gradient(135deg, #fbbf24, #f59e0b)", text: "#422006", icon: DevicePhoneMobileIcon },
  airtel: { name: "Airtel Money",     short: "airtel", color: "#ef4444", bg: "linear-gradient(135deg, #ef4444, #b91c1c)", text: "#fff",    icon: DevicePhoneMobileIcon },
  bank:   { name: "Bank Account",     short: "BANK",   color: "#2563eb", bg: "linear-gradient(135deg, #3b82f6, #1d4ed8)", text: "#fff",    icon: BuildingLibraryIcon },
  card:   { name: "Debit / Credit Card", short: "CARD", color: "#7c3aed", bg: "linear-gradient(135deg, #8b5cf6, #6d28d9)", text: "#fff",   icon: CreditCardIcon },
}

const quickAmounts = [50000, 100000, 250000, 500000, 1000000]

/* ── Page ─────────────────────────────────────────────────── */

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState<"all" | "income" | "buy" | "deposit" | "withdraw">("all")
  const [modal, setModal] = useState<"deposit" | "withdraw" | "add-method" | null>(null)
  const [methods, setMethods] = useState<PayMethod[]>(initialPayMethods)

  // Money on screen is opt-in — masked until the investor taps the eye
  const { shown: balanceShown, toggle: toggleBalance } = useBalanceVisibility()

  // This page renders behind SignInGate — always the signed-in user's REAL
  // ledger figures (virtual beta money), never mock showcase data
  const { user } = useSession()
  const { balance, transactions: liveTx } = useWallet(user)
  const { holdings } = useLedgerHoldings(user)

  const cash = balance ?? 0
  const invested = (holdings ?? []).reduce((sum, h) => sum + h.units * h.avgCost, 0)
  const positionCount = holdings?.length ?? 0
  const earnings = (liveTx ?? [])
    .filter(t => t.type === "income" && t.amount > 0)
    .reduce((s, t) => s + t.amount, 0)
  const transactions = liveTx ?? []

  const filtered = activeTab === "all" ? transactions : transactions.filter(t => t.type === activeTab)

  /* One masking rule for every figure on the page */
  const money = (n: number, compact = false) =>
    balanceShown ? `UGX ${compact ? formatCurrency(n) : n.toLocaleString()}` : "UGX ••••••"

  const setDefault = (id: number) =>
    setMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === id })))

  const removeMethod = (id: number) =>
    setMethods(prev => {
      const next = prev.filter(m => m.id !== id)
      if (next.length && !next.some(m => m.isDefault)) next[0] = { ...next[0], isDefault: true }
      return next
    })

  const addMethod = (m: Omit<PayMethod, "id" | "isDefault">) =>
    setMethods(prev => [...prev, { ...m, id: Date.now(), isDefault: prev.length === 0 }])

  const actions = [
    { label: "Add Money", Icon: ArrowDownTrayIcon,   onClick: () => setModal("deposit"),  primary: true },
    { label: "Withdraw",  Icon: ArrowUpTrayIcon,     onClick: () => setModal("withdraw"), primary: false },
    { label: "Transfer",  Icon: ArrowsRightLeftIcon, onClick: () => {},                   primary: false },
  ]

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f4f5f7" }}>

      {/* ══ Hero — the wallet pass ══════════════════════════════════ */}
      <div style={{ backgroundColor: "#07131a", position: "relative", overflow: "hidden" }}>
        {/* Blurred city photo gives the dark hero depth; the card stays the subject */}
        <div style={{ position: "absolute", inset: -24 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=1600&q=70"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%", filter: "blur(10px) saturate(1.1)", transform: "scale(1.06)" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(4,15,20,0.94) 0%, rgba(6,26,32,0.88) 45%, rgba(8,40,44,0.8) 100%)" }} />
        </div>
        {/* Soft teal ambience */}
        <div style={{ position: "absolute", top: -220, left: "-6%", width: 540, height: 540, borderRadius: "50%", background: "radial-gradient(circle, rgba(20,184,166,0.22) 0%, transparent 68%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -280, right: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.16) 0%, transparent 68%)", pointerEvents: "none" }} />

        <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px 32px", position: "relative" }}>

          {/* Title row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.6px" }}>Wallet</h1>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.11)", borderRadius: 99, padding: "6px 13px" }}>
              <ShieldCheckIcon style={{ width: 14, height: 14, color: "#34d399", flexShrink: 0 }} />
              <span style={{ fontSize: 11.5, fontWeight: 600, color: "rgba(255,255,255,0.78)" }}>Funds held in trust · Every movement on your ledger</span>
            </div>
          </div>

          <div style={{ maxWidth: 480 }}>

            {/* ── The card — deep teal over a faint architectural texture ── */}
            <div
              style={{
                position: "relative",
                borderRadius: 22,
                overflow: "hidden",
                padding: "20px 22px 18px",
                boxShadow: "0 24px 60px rgba(2,6,23,0.55), inset 0 1px 0 rgba(255,255,255,0.22)",
              }}
            >
              {/* Texture photo under the teal wash */}
              <div style={{ position: "absolute", inset: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=70"
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(142deg, rgba(12,74,66,0.97) 0%, rgba(15,95,84,0.93) 48%, rgba(17,124,109,0.86) 100%)" }} />
              </div>

              {/* Sheen */}
              <div style={{ position: "absolute", top: -110, right: -50, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 68%)", pointerEvents: "none" }} />

              {/* Card head */}
              <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 30 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                  <div style={{ width: 27, height: 27, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.95)", color: "#0f6b5c", fontSize: 13, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>N</div>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: "#fff", letterSpacing: "-0.2px" }}>NestFund Cash</span>
                </div>
                <span style={{ fontSize: 10.5, fontWeight: 800, color: "rgba(255,255,255,0.7)", letterSpacing: "0.14em" }}>UGX</span>
              </div>

              {/* Balance */}
              <div style={{ position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                  <p style={{ fontSize: 10.5, fontWeight: 700, color: "rgba(255,255,255,0.62)", textTransform: "uppercase", letterSpacing: "0.14em", margin: 0 }}>
                    Available Balance
                  </p>
                  <button
                    onClick={toggleBalance}
                    aria-label={balanceShown ? "Hide balance" : "Show balance"}
                    style={{ background: "rgba(255,255,255,0.14)", border: "none", borderRadius: 99, cursor: "pointer", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                  >
                    {balanceShown
                      ? <EyeSlashIcon style={{ width: 13, height: 13, color: "rgba(255,255,255,0.85)" }} />
                      : <EyeIcon style={{ width: 13, height: 13, color: "rgba(255,255,255,0.85)" }} />}
                  </button>
                </div>
                <p style={{ fontSize: "clamp(32px, 8vw, 42px)", fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-1.6px", lineHeight: 1.05, fontVariantNumeric: "tabular-nums" }}>
                  {balanceShown ? `UGX ${cash.toLocaleString()}` : "UGX ••••••••"}
                </p>
              </div>

              {/* Card foot — the two figures that matter next to cash */}
              <div style={{ position: "relative", display: "flex", marginTop: 22, paddingTop: 15, borderTop: "1px solid rgba(255,255,255,0.16)" }}>
                {[
                  { label: "Invested", value: invested, note: `${positionCount} ${positionCount === 1 ? "position" : "positions"}` },
                  { label: "Income Received", value: earnings, note: "All time" },
                ].map((f, i) => (
                  <div key={f.label} style={{ flex: 1, paddingLeft: i === 0 ? 0 : 18, borderLeft: i === 0 ? "none" : "1px solid rgba(255,255,255,0.16)", minWidth: 0 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.58)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px 0" }}>{f.label}</p>
                    <p style={{ fontSize: 16, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.4px", fontVariantNumeric: "tabular-nums", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {money(f.value, true)}
                    </p>
                    <p style={{ fontSize: 10.5, color: "rgba(255,255,255,0.5)", margin: "2px 0 0 0" }}>{f.note}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Actions — three equal tiles under the card ── */}
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              {actions.map(a => (
                <button
                  key={a.label}
                  onClick={a.onClick}
                  style={{
                    flex: 1, minWidth: 0,
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                    padding: "14px 4px 12px", borderRadius: 17, cursor: "pointer",
                    backgroundColor: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.13)",
                    backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
                    transition: "background 0.15s",
                  }}
                >
                  <span style={{
                    width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                    backgroundColor: a.primary ? "#fff" : "rgba(255,255,255,0.14)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <a.Icon style={{ width: 17, height: 17, color: a.primary ? "#0f6b5c" : "#fff" }} />
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 650, color: "#fff", whiteSpace: "nowrap" }}>{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 24px 56px" }}>
        <div className="wallet-grid">

          {/* ── Left column ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* Income chart — real distributions only */}
            <div style={{ backgroundColor: "#fff", borderRadius: 18, padding: "20px 20px 18px", border: "1px solid #e9edf2", boxShadow: "0 1px 2px rgba(15,23,42,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, flexWrap: "wrap", gap: 8 }}>
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 750, color: "#0f172a", margin: "0 0 3px 0", letterSpacing: "-0.2px" }}>Income Received</h2>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>Distributions from your investments</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 2px 0" }}>All Time</p>
                  <p style={{ fontSize: 18, fontWeight: 800, color: "#10b981", margin: 0, fontVariantNumeric: "tabular-nums" }}>{money(earnings, true)}</p>
                </div>
              </div>
              {earnings > 0 ? (
                <ChartBox height={180}>
                  {w => (
                    <BarChart width={w} height={180} data={transactions.filter(t => t.type === "income").map(t => ({ month: t.date, income: t.amount })).reverse()} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                      <YAxis hide />
                      <Tooltip
                        contentStyle={{ borderRadius: 10, border: "1px solid #f1f5f9", fontSize: 12 }}
                        formatter={(v: unknown) => [`UGX ${formatCurrency(Number(v))}`, "Income"]}
                        cursor={{ fill: "#f8fafc" }}
                      />
                      <Bar dataKey="income" fill="#2563eb" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  )}
                </ChartBox>
              ) : (
                <div style={{ height: 124, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#f7f9fc", borderRadius: 14 }}>
                  <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", margin: "0 0 3px 0" }}>No income received yet</p>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, textAlign: "center", padding: "0 16px", lineHeight: 1.6 }}>
                    Distributions from your opportunities will chart here as they arrive.
                  </p>
                </div>
              )}
            </div>

            {/* Transactions */}
            <div style={{ backgroundColor: "#fff", borderRadius: 18, border: "1px solid #e9edf2", overflow: "hidden", boxShadow: "0 1px 2px rgba(15,23,42,0.04)" }}>
              <div style={{ padding: "18px 20px 14px" }}>
                <h2 style={{ fontSize: 16, fontWeight: 750, color: "#0f172a", margin: "0 0 13px 0", letterSpacing: "-0.2px" }}>Transaction History</h2>
                <div className="filter-tabs" style={{ display: "flex", gap: 5, overflowX: "auto" }}>
                  {(["all","income","buy","deposit","withdraw"] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setActiveTab(t)}
                      style={{
                        padding: "6px 14px", borderRadius: 99, border: "none", cursor: "pointer",
                        fontSize: 12, fontWeight: 650, whiteSpace: "nowrap",
                        backgroundColor: activeTab === t ? "#0f172a" : "#f2f5f9",
                        color: activeTab === t ? "#fff" : "#64748b",
                        transition: "all 0.15s",
                      }}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                {filtered.length === 0 && (
                  <div style={{ padding: "34px 20px 40px", textAlign: "center" }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 4px 0" }}>No transactions yet</p>
                    <p style={{ fontSize: 12.5, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>
                      Add money to start investing — every movement lands here.
                    </p>
                  </div>
                )}
                {filtered.map((tx, i) => {
                  const positive = tx.amount > 0
                  const typeConfig = {
                    income:   { color: "#10b981", bg: "#ecfdf5", label: "Income",     Icon: HomeModernIcon },
                    buy:      { color: "#2563eb", bg: "#eff6ff", label: "Purchase",   Icon: ShoppingCartIcon },
                    deposit:  { color: "#7c3aed", bg: "#f5f3ff", label: "Deposit",    Icon: ArrowDownTrayIcon },
                    withdraw: { color: "#ea580c", bg: "#fff7ed", label: "Withdrawal", Icon: ArrowUpTrayIcon },
                  }
                  const cfg = typeConfig[tx.type as keyof typeof typeConfig]
                  return (
                    <div
                      key={tx.id}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "13px 20px", borderTop: i === 0 ? "1px solid #f4f7fa" : "1px solid #f7f9fb" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <cfg.Icon style={{ width: 18, height: 18, color: cfg.color }} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 650, color: "#0f172a", margin: "0 0 3px 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tx.label}</p>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: cfg.color, backgroundColor: cfg.bg, padding: "1px 7px", borderRadius: 99 }}>{cfg.label}</span>
                            <span style={{ fontSize: 11, color: "#94a3b8" }}>{tx.date}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: positive ? "#10b981" : "#0f172a", margin: "0 0 2px 0", fontVariantNumeric: "tabular-nums" }}>
                          {balanceShown
                            ? `${positive ? "+" : "−"}UGX ${formatCurrency(Math.abs(tx.amount))}`
                            : "UGX ••••••"}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3 }}>
                          <CheckBadgeIcon style={{ width: 11, height: 11, color: "#10b981" }} />
                          <span style={{ fontSize: 10, color: "#94a3b8" }}>Completed</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── Right column: cards & accounts ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            <div style={{ backgroundColor: "#fff", borderRadius: 18, padding: "20px", border: "1px solid #e9edf2", boxShadow: "0 1px 2px rgba(15,23,42,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                <h3 style={{ fontSize: 15.5, fontWeight: 750, color: "#0f172a", margin: 0, letterSpacing: "-0.2px" }}>Cards &amp; Accounts</h3>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8" }}>{methods.length} linked</span>
              </div>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 16px 0", lineHeight: 1.5 }}>
                Move money with mobile money, a bank account, or a card.
              </p>

              {/* Each method rendered as its own branded pass */}
              <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                {methods.map(pm => {
                  const brand = methodBrand[pm.kind]
                  return (
                    <div key={pm.id}>
                      <div
                        style={{
                          position: "relative", overflow: "hidden",
                          background: brand.bg, borderRadius: 15,
                          padding: "14px 16px 13px",
                          boxShadow: "0 6px 18px rgba(15,23,42,0.16)",
                        }}
                      >
                        <div style={{ position: "absolute", top: -60, right: -30, width: 150, height: 150, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.22) 0%, transparent 70%)", pointerEvents: "none" }} />
                        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                          <brand.icon style={{ width: 17, height: 17, color: brand.text, flexShrink: 0 }} />
                          <span style={{ fontSize: 12.5, fontWeight: 750, color: brand.text, letterSpacing: "-0.1px", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {pm.label}
                          </span>
                          {pm.isDefault && (
                            <span style={{ fontSize: 9, fontWeight: 800, color: brand.text, backgroundColor: "rgba(255,255,255,0.22)", padding: "2px 8px", borderRadius: 99, letterSpacing: "0.06em", flexShrink: 0 }}>DEFAULT</span>
                          )}
                        </div>
                        <div style={{ position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: brand.text, fontVariantNumeric: "tabular-nums", letterSpacing: "0.02em", opacity: 0.95 }}>
                            {pm.detail}
                          </span>
                          <CheckBadgeIcon style={{ width: 16, height: 16, color: brand.text, opacity: 0.85, flexShrink: 0 }} />
                        </div>
                      </div>
                      {/* Row actions sit outside the pass so the card stays clean */}
                      <div style={{ display: "flex", gap: 8, marginTop: 7, paddingLeft: 2 }}>
                        {!pm.isDefault && (
                          <button onClick={() => setDefault(pm.id)} style={{ fontSize: 11, fontWeight: 650, color: "#2563eb", background: "none", border: "none", padding: "2px 0", cursor: "pointer" }}>
                            Set as default
                          </button>
                        )}
                        <button onClick={() => removeMethod(pm.id)} style={{ fontSize: 11, fontWeight: 650, color: "#94a3b8", background: "none", border: "none", padding: "2px 0", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                          <TrashIcon style={{ width: 12, height: 12 }} />
                          Remove
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Add account */}
              <button
                onClick={() => setModal("add-method")}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  padding: "13px 0", borderRadius: 15,
                  border: "1.5px dashed #cbd5e1", backgroundColor: "#fafbfd",
                  color: "#2563eb", fontSize: 13, fontWeight: 700, cursor: "pointer",
                  marginTop: 14,
                }}
              >
                <PlusIcon style={{ width: 16, height: 16 }} />
                Add Card or Account
              </button>

              {/* Supported strip */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, paddingTop: 14, borderTop: "1px solid #f4f6f9" }}>
                <ShieldCheckIcon style={{ width: 14, height: 14, color: "#94a3b8", flexShrink: 0 }} />
                <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>
                  Supports MTN MoMo, Airtel Money, all major Ugandan banks, and Visa/Mastercard.
                </p>
              </div>
            </div>

            {/* Next payout card — only meaningful once the investor holds positions */}
            {positionCount > 0 ? (
              <div style={{ background: "linear-gradient(140deg, #0f766e, #115e59)", borderRadius: 18, padding: "20px", color: "#fff", boxShadow: "0 8px 24px rgba(15,118,110,0.28)" }}>
                <p style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.65)", margin: "0 0 10px 0" }}>
                  Distributions
                </p>
                <p style={{ fontSize: 22, fontWeight: 850, margin: "0 0 4px 0", letterSpacing: "-0.5px" }}>{positionCount} active {positionCount === 1 ? "position" : "positions"}</p>
                <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.75)", margin: 0, lineHeight: 1.6 }}>
                  Proceeds are paid to your wallet as your opportunities generate income or repay at exit.
                </p>
              </div>
            ) : (
              <div style={{ background: "linear-gradient(140deg, #0f766e, #115e59)", borderRadius: 18, padding: "20px", color: "#fff", boxShadow: "0 8px 24px rgba(15,118,110,0.28)" }}>
                <p style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "rgba(255,255,255,0.65)", margin: "0 0 10px 0" }}>
                  Start Earning
                </p>
                <p style={{ fontSize: 20, fontWeight: 850, margin: "0 0 4px 0", letterSpacing: "-0.4px" }}>Put your balance to work</p>
                <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.75)", margin: "0 0 14px 0", lineHeight: 1.6 }}>
                  Add money, then invest in any open opportunity — contracts, trade, assets or property. Income lands right here.
                </p>
                <Link href="/opportunities" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 11, backgroundColor: "#fff", color: "#0f766e", fontSize: 13, fontWeight: 750, textDecoration: "none" }}>
                  Explore Opportunities
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {modal === "deposit" && (
        <MoveMoneyModal mode="deposit" methods={methods} onClose={() => setModal(null)}
          onMove={user ? a => demoTopUp(user.id, a) : undefined} />
      )}
      {modal === "withdraw" && (
        <MoveMoneyModal mode="withdraw" methods={methods} onClose={() => setModal(null)} available={cash}
          onMove={user ? a => demoWithdraw(user.id, a) : undefined} />
      )}
      {modal === "add-method" && <AddMethodModal onClose={() => setModal(null)} onAdd={m => { addMethod(m); setModal(null) }} />}
    </div>
  )
}

/* ── Shared modal shell ───────────────────────────────────── */

function ModalShell({ title, subtitle, onClose, children }: {
  title: string; subtitle: string; onClose: () => void; children: React.ReactNode
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        backgroundColor: "rgba(10,22,40,0.55)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: "#fff", borderRadius: 20, width: "100%", maxWidth: 440,
          maxHeight: "90vh", overflowY: "auto",
          boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
          animation: "modal-in 0.25s ease-out",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "22px 24px 0" }}>
          <div>
            <h2 style={{ fontSize: 19, fontWeight: 800, color: "#0f172a", margin: "0 0 3px 0", letterSpacing: "-0.3px" }}>{title}</h2>
            <p style={{ fontSize: 12.5, color: "#94a3b8", margin: 0 }}>{subtitle}</p>
          </div>
          <button onClick={onClose} style={{ background: "#f4f6f9", border: "none", borderRadius: 9, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <XMarkIcon style={{ width: 17, height: 17, color: "#64748b" }} />
          </button>
        </div>
        <div style={{ padding: "20px 24px 24px" }}>{children}</div>
      </div>
    </div>
  )
}

/* ── Deposit / Withdraw modal ─────────────────────────────── */

function MoveMoneyModal({ mode, methods, onClose, onMove, available }: {
  mode: "deposit" | "withdraw"; methods: PayMethod[]; onClose: () => void
  /** When signed in, writes a real ledger entry (simulated beta funds) */
  onMove?: (amount: number) => Promise<void>
  available?: number
}) {
  const [amount, setAmount] = useState(250000)
  const [methodId, setMethodId] = useState(methods.find(m => m.isDefault)?.id ?? methods[0]?.id)
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isDeposit = mode === "deposit"
  const selected = methods.find(m => m.id === methodId)

  const confirm = async () => {
    if (amount <= 0 || busy) return
    if (!onMove) { setDone(true); return }
    setBusy(true)
    setError(null)
    try {
      await onMove(amount)
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong — please try again.")
    }
    setBusy(false)
  }

  if (done) {
    return (
      <ModalShell
        title={isDeposit ? "Deposit initiated" : "Withdrawal initiated"}
        subtitle="You can track it in Transaction History"
        onClose={onClose}
      >
        <div style={{ textAlign: "center", padding: "12px 0 4px" }}>
          <CheckCircleIcon style={{ width: 62, height: 62, color: "#10b981", margin: "0 auto 14px" }} />
          <p style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", margin: "0 0 6px 0", letterSpacing: "-0.5px" }}>
            UGX {amount.toLocaleString()}
          </p>
          <p style={{ fontSize: 13.5, color: "#64748b", margin: "0 0 22px 0", lineHeight: 1.6 }}>
            {onMove
              ? <>{isDeposit ? "Your wallet has been credited" : "Your wallet has been debited"} — this is <strong>simulated beta money</strong>, recorded on your real transaction ledger.</>
              : isDeposit
              ? <>A prompt has been sent to <strong>{selected?.detail}</strong>. Approve it to complete your deposit.</>
              : <>Your withdrawal to <strong>{selected?.label}</strong> is being processed. Funds typically arrive within 30 minutes.</>}
          </p>
          <button onClick={onClose} style={{ width: "100%", padding: "13px 0", borderRadius: 11, border: "none", background: "linear-gradient(135deg, #2563eb, #4f46e5)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            Done
          </button>
        </div>
      </ModalShell>
    )
  }

  return (
    <ModalShell
      title={isDeposit ? "Deposit Funds" : "Withdraw Funds"}
      subtitle={isDeposit ? "Top up your wallet to invest" : `Available balance: UGX ${(available ?? 2450000).toLocaleString()}`}
      onClose={onClose}
    >
      {/* Amount */}
      <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 8 }}>Amount</label>
      <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #e2e8f0", borderRadius: 12, padding: "13px 16px", marginBottom: 10 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#94a3b8", marginRight: 8 }}>UGX</span>
        <input
          type="text"
          inputMode="numeric"
          value={amount.toLocaleString()}
          onChange={e => {
            const n = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10)
            setAmount(isNaN(n) ? 0 : Math.min(n, 100000000))
          }}
          style={{ flex: 1, border: "none", outline: "none", fontSize: 20, fontWeight: 800, color: "#0f172a", minWidth: 0, background: "transparent" }}
        />
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 22 }}>
        {quickAmounts.map(a => (
          <button key={a} onClick={() => setAmount(a)} style={{
            padding: "6px 12px", borderRadius: 99, fontSize: 12, fontWeight: 600, cursor: "pointer",
            border: amount === a ? "1.5px solid #2563eb" : "1.5px solid #e8ecf0",
            backgroundColor: amount === a ? "#eff6ff" : "#fff",
            color: amount === a ? "#2563eb" : "#64748b",
          }}>
            {a >= 1000000 ? `${a / 1000000}M` : `${a / 1000}K`}
          </button>
        ))}
      </div>

      {/* Method picker */}
      <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 8 }}>
        {isDeposit ? "Pay with" : "Withdraw to"}
      </label>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 22 }}>
        {methods.map(pm => {
          const brand = methodBrand[pm.kind]
          const active = pm.id === methodId
          return (
            <button key={pm.id} onClick={() => setMethodId(pm.id)} style={{
              display: "flex", alignItems: "center", gap: 12, textAlign: "left",
              padding: "11px 13px", borderRadius: 12, cursor: "pointer",
              border: active ? "1.5px solid #2563eb" : "1.5px solid #eef1f5",
              backgroundColor: active ? "#f6f9ff" : "#fff",
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: brand.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <brand.icon style={{ width: 17, height: 17, color: brand.text }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: 0 }}>{pm.label}</p>
                <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{pm.detail}</p>
              </div>
              <div style={{
                width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                border: active ? "5.5px solid #2563eb" : "2px solid #cbd5e1",
                boxSizing: "border-box",
              }} />
            </button>
          )
        })}
      </div>

      {/* Fee summary */}
      <div style={{ backgroundColor: "#f8fafc", borderRadius: 12, padding: "12px 16px", marginBottom: 20 }}>
        {[
          { label: isDeposit ? "Deposit amount" : "Withdrawal amount", value: `UGX ${amount.toLocaleString()}` },
          { label: "Transaction fee", value: amount > 0 ? `UGX ${Math.max(500, Math.round(amount * 0.005)).toLocaleString()}` : "UGX 0" },
        ].map(r => (
          <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
            <span style={{ fontSize: 12.5, color: "#64748b" }}>{r.label}</span>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: "#0f172a" }}>{r.value}</span>
          </div>
        ))}
      </div>

      {error && (
        <p style={{ fontSize: 12.5, fontWeight: 600, color: "#dc2626", backgroundColor: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", margin: "0 0 14px 0", lineHeight: 1.55 }}>
          {error}
        </p>
      )}

      <button
        onClick={confirm}
        disabled={amount <= 0 || !selected || busy}
        style={{
          width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
          background: amount > 0 && !busy ? "linear-gradient(135deg, #2563eb, #4f46e5)" : "#e2e8f0",
          color: amount > 0 && !busy ? "#fff" : "#94a3b8",
          fontSize: 15, fontWeight: 700, cursor: amount > 0 && !busy ? "pointer" : "not-allowed",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
        }}
      >
        {busy ? "Processing..." : <>{isDeposit ? "Deposit" : "Withdraw"} UGX {amount.toLocaleString()}<ChevronRightIcon style={{ width: 16, height: 16 }} /></>}
      </button>
    </ModalShell>
  )
}

/* ── Add payment method modal ─────────────────────────────── */

function AddMethodModal({ onClose, onAdd }: {
  onClose: () => void
  onAdd: (m: { kind: MethodKind; label: string; detail: string }) => void
}) {
  const [kind, setKind] = useState<MethodKind | null>(null)
  const [field1, setField1] = useState("")
  const [field2, setField2] = useState("")

  const isMobile = kind === "mtn" || kind === "airtel"

  const mask = (v: string) => {
    const digits = v.replace(/\D/g, "")
    if (digits.length < 4) return v
    return isMobile
      ? `+256 ${digits.slice(-9, -6)} ••• ${digits.slice(-3)}`
      : `•••• •••• ${digits.slice(-4)}`
  }

  const canSave = kind !== null && field1.replace(/\D/g, "").length >= (isMobile ? 9 : 6) && (isMobile || field2.trim().length >= 2)

  /* Step 1 — choose type */
  if (!kind) {
    return (
      <ModalShell title="Add Account" subtitle="Choose how you want to move money" onClose={onClose}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(Object.keys(methodBrand) as MethodKind[]).map(k => {
            const brand = methodBrand[k]
            return (
              <button key={k} onClick={() => setKind(k)} style={{
                display: "flex", alignItems: "center", gap: 14, textAlign: "left",
                padding: "14px 15px", borderRadius: 13, cursor: "pointer",
                border: "1.5px solid #eef1f5", backgroundColor: "#fff",
              }}>
                <div style={{ width: 42, height: 42, borderRadius: 11, background: brand.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
                  <brand.icon style={{ width: 20, height: 20, color: brand.text }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 2px 0" }}>{brand.name}</p>
                  <p style={{ fontSize: 11.5, color: "#94a3b8", margin: 0 }}>
                    {k === "mtn" && "Instant deposits with a MoMo prompt"}
                    {k === "airtel" && "Instant deposits with an Airtel prompt"}
                    {k === "bank" && "Transfers from any Ugandan bank"}
                    {k === "card" && "Visa and Mastercard supported"}
                  </p>
                </div>
                <ChevronRightIcon style={{ width: 17, height: 17, color: "#cbd5e1", flexShrink: 0 }} />
              </button>
            )
          })}
        </div>
      </ModalShell>
    )
  }

  /* Step 2 — details form */
  const brand = methodBrand[kind]
  return (
    <ModalShell title={`Link ${brand.name}`} subtitle="Your details are encrypted and stored securely" onClose={onClose}>
      {/* Selected brand banner */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#f8fafc", borderRadius: 12, padding: "11px 14px", marginBottom: 20 }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: brand.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <brand.icon style={{ width: 18, height: 18, color: brand.text }} />
        </div>
        <p style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a", margin: 0, flex: 1 }}>{brand.name}</p>
        <button onClick={() => { setKind(null); setField1(""); setField2("") }} style={{ fontSize: 12, fontWeight: 600, color: "#2563eb", background: "none", border: "none", cursor: "pointer" }}>
          Change
        </button>
      </div>

      <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 7 }}>
        {isMobile ? "Phone Number" : kind === "bank" ? "Account Number" : "Card Number"}
      </label>
      <input
        type="text"
        inputMode="numeric"
        placeholder={isMobile ? "+256 7XX XXX XXX" : kind === "bank" ? "e.g. 9030012345678" : "XXXX XXXX XXXX XXXX"}
        value={field1}
        onChange={e => setField1(e.target.value)}
        style={{ width: "100%", boxSizing: "border-box", border: "1.5px solid #e2e8f0", borderRadius: 11, padding: "12px 15px", fontSize: 14, fontWeight: 600, color: "#0f172a", outline: "none", marginBottom: 16 }}
      />

      {!isMobile && (
        <>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 7 }}>
            {kind === "bank" ? "Bank Name" : "Name on Card"}
          </label>
          <input
            type="text"
            placeholder={kind === "bank" ? "e.g. Stanbic Bank" : "e.g. H. Mawire"}
            value={field2}
            onChange={e => setField2(e.target.value)}
            style={{ width: "100%", boxSizing: "border-box", border: "1.5px solid #e2e8f0", borderRadius: 11, padding: "12px 15px", fontSize: 14, fontWeight: 600, color: "#0f172a", outline: "none", marginBottom: 16 }}
          />
        </>
      )}

      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, backgroundColor: "#f0fdf4", border: "1px solid #dcfce7", borderRadius: 11, padding: "10px 14px", marginBottom: 20 }}>
        <ShieldCheckIcon style={{ width: 15, height: 15, color: "#16a34a", flexShrink: 0, marginTop: 1 }} />
        <p style={{ fontSize: 11.5, color: "#166534", margin: 0, lineHeight: 1.55 }}>
          We&apos;ll send a small verification prompt to confirm this account belongs to you before it can be used.
        </p>
      </div>

      <button
        onClick={() => canSave && onAdd({
          kind,
          label: kind === "bank" ? (field2.trim() || "Bank Account") : brand.name,
          detail: mask(field1),
        })}
        disabled={!canSave}
        style={{
          width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
          background: canSave ? "linear-gradient(135deg, #2563eb, #4f46e5)" : "#e2e8f0",
          color: canSave ? "#fff" : "#94a3b8",
          fontSize: 15, fontWeight: 700, cursor: canSave ? "pointer" : "not-allowed",
        }}
      >
        Link Account
      </button>
    </ModalShell>
  )
}
