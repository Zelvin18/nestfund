"use client"

import { useState } from "react"
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
  ArrowTrendingUpIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/solid"
import { formatCurrency } from "@/lib/utils"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

/* ── Mock data ────────────────────────────────────────────── */

const incomeData = [
  { month: "Aug", income: 142000 },
  { month: "Sep", income: 158000 },
  { month: "Oct", income: 149000 },
  { month: "Nov", income: 171000 },
  { month: "Dec", income: 165000 },
  { month: "Jan", income: 185000 },
]

const transactions = [
  { id: "1", type: "income",   label: "Rental Income — Sunrise Apartments",    amount: 93333,    date: "Jan 30, 2026", status: "completed" },
  { id: "2", type: "income",   label: "Rental Income — Acacia Office Park",    amount: 54600,    date: "Jan 30, 2026", status: "completed" },
  { id: "3", type: "buy",      label: "Bought 100 shares — Sunrise Apartments", amount: -125000,  date: "Jan 22, 2026", status: "completed" },
  { id: "4", type: "deposit",  label: "Deposit via MTN Mobile Money",          amount: 500000,   date: "Jan 18, 2026", status: "completed" },
  { id: "5", type: "income",   label: "Rental Income — Green Heights",         amount: 37067,    date: "Dec 31, 2025", status: "completed" },
  { id: "6", type: "buy",      label: "Bought 50 shares — Green Heights",      amount: -42000,   date: "Dec 14, 2025", status: "completed" },
  { id: "7", type: "withdraw", label: "Withdrawal to Stanbic Bank",            amount: -200000,  date: "Dec 5, 2025",  status: "completed" },
  { id: "8", type: "deposit",  label: "Deposit via Bank Transfer",             amount: 1000000,  date: "Nov 28, 2025", status: "completed" },
]

/* Payment method model — brand-styled */
type MethodKind = "mtn" | "airtel" | "bank" | "card"

interface PayMethod {
  id: number
  kind: MethodKind
  label: string
  detail: string
  isDefault: boolean
}

const methodBrand: Record<MethodKind, { name: string; short: string; color: string; bg: string; text: string; icon: typeof DevicePhoneMobileIcon }> = {
  mtn:    { name: "MTN Mobile Money", short: "MTN",    color: "#facc15", bg: "linear-gradient(135deg, #fbbf24, #f59e0b)", text: "#422006", icon: DevicePhoneMobileIcon },
  airtel: { name: "Airtel Money",     short: "airtel", color: "#ef4444", bg: "linear-gradient(135deg, #ef4444, #b91c1c)", text: "#fff",    icon: DevicePhoneMobileIcon },
  bank:   { name: "Bank Account",     short: "BANK",   color: "#2563eb", bg: "linear-gradient(135deg, #3b82f6, #1d4ed8)", text: "#fff",    icon: BuildingLibraryIcon },
  card:   { name: "Debit / Credit Card", short: "CARD", color: "#7c3aed", bg: "linear-gradient(135deg, #8b5cf6, #6d28d9)", text: "#fff",   icon: CreditCardIcon },
}

const initialMethods: PayMethod[] = [
  { id: 1, kind: "mtn",    label: "MTN Mobile Money", detail: "+256 772 ••• 481", isDefault: true },
  { id: 2, kind: "airtel", label: "Airtel Money",     detail: "+256 750 ••• 921", isDefault: false },
  { id: 3, kind: "bank",   label: "Stanbic Bank",     detail: "•••• •••• 3421",   isDefault: false },
]

const quickAmounts = [50000, 100000, 250000, 500000, 1000000]

/* ── Page ─────────────────────────────────────────────────── */

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState<"all" | "income" | "buy" | "deposit" | "withdraw">("all")
  const [modal, setModal] = useState<"deposit" | "withdraw" | "add-method" | null>(null)
  const [methods, setMethods] = useState<PayMethod[]>(initialMethods)
  const [balanceHidden, setBalanceHidden] = useState(false)

  const filtered = activeTab === "all" ? transactions : transactions.filter(t => t.type === activeTab)

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

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}>

      {/* ── Header / balance card ── */}
      <div style={{ backgroundColor: "#0a1628", position: "relative", overflow: "hidden" }}>
        {/* City skyline behind the balance */}
        <div style={{ position: "absolute", inset: 0 }}>
          <img
            src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1800&q=80"
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 60%" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(8,18,36,0.96) 0%, rgba(13,28,58,0.9) 50%, rgba(20,38,74,0.8) 100%)" }} />
        </div>
        <div style={{ position: "absolute", top: -140, right: "10%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.22) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "34px 24px 38px", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.12em", margin: 0 }}>
                  Available Balance
                </p>
                <button
                  onClick={() => setBalanceHidden(h => !h)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex" }}
                  aria-label={balanceHidden ? "Show balance" : "Hide balance"}
                >
                  {balanceHidden
                    ? <EyeIcon style={{ width: 16, height: 16, color: "rgba(255,255,255,0.5)" }} />
                    : <EyeSlashIcon style={{ width: 16, height: 16, color: "rgba(255,255,255,0.5)" }} />}
                </button>
              </div>
              <p style={{ fontSize: "clamp(34px, 5vw, 46px)", fontWeight: 900, color: "#fff", margin: "0 0 8px 0", letterSpacing: "-1.5px", lineHeight: 1 }}>
                {balanceHidden ? "UGX ••••••••" : "UGX 2,450,000"}
              </p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 5, backgroundColor: "rgba(16,185,129,0.14)", border: "1px solid rgba(16,185,129,0.25)", borderRadius: 99, padding: "4px 12px" }}>
                <ArrowTrendingUpIcon style={{ width: 13, height: 13, color: "#6ee7b7" }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6ee7b7" }}>+UGX 185,000 income this month</span>
              </div>
            </div>

            {/* Security note */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 16px" }}>
              <ShieldCheckIcon style={{ width: 18, height: 18, color: "#34d399", flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.9)", margin: 0 }}>Funds held in trust</p>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: 0 }}>Segregated client account · CMA regulated</p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { label: "Deposit", Icon: ArrowDownTrayIcon, action: () => setModal("deposit"), primary: true },
              { label: "Withdraw", Icon: ArrowUpTrayIcon, action: () => setModal("withdraw"), primary: false },
              { label: "Transfer", Icon: ArrowsRightLeftIcon, action: () => {}, primary: false },
            ].map(btn => (
              <button
                key={btn.label}
                onClick={btn.action}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "11px 24px", borderRadius: 11,
                  background: btn.primary ? "#fff" : "rgba(255,255,255,0.08)",
                  color: btn.primary ? "#0f172a" : "#fff",
                  border: btn.primary ? "none" : "1.5px solid rgba(255,255,255,0.18)",
                  fontSize: 14, fontWeight: 700, cursor: "pointer",
                  boxShadow: btn.primary ? "0 6px 20px rgba(0,0,0,0.25)" : "none",
                }}
              >
                <btn.Icon style={{ width: 16, height: 16 }} />
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px 56px" }}>
        <div className="wallet-grid">

          {/* ── Left column ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Account breakdown tiles */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(180px, 100%), 1fr))", gap: 14 }}>
              {[
                { label: "Cash Wallet",    value: 2450000, note: "Available to invest",     color: "#2563eb" },
                { label: "Invested Value", value: 2023500, note: "Across 3 properties",     color: "#7c3aed" },
                { label: "Total Earnings", value: 184000,  note: "All-time rental income",  color: "#10b981" },
              ].map(a => (
                <div key={a.label} style={{ backgroundColor: "#fff", borderRadius: 14, padding: "16px 18px", border: "1px solid #e8ecf0" }}>
                  <div style={{ width: 34, height: 4, borderRadius: 99, backgroundColor: a.color, marginBottom: 12 }} />
                  <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500, margin: "0 0 4px 0" }}>{a.label}</p>
                  <p style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 2px 0", letterSpacing: "-0.4px" }}>
                    {balanceHidden ? "UGX ••••••" : `UGX ${formatCurrency(a.value)}`}
                  </p>
                  <p style={{ fontSize: 11, color: "#cbd5e1", margin: 0 }}>{a.note}</p>
                </div>
              ))}
            </div>

            {/* Income chart */}
            <div style={{ backgroundColor: "#fff", borderRadius: 16, padding: "22px 20px", border: "1px solid #e8ecf0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 3px 0" }}>Monthly Rental Income</h2>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>Distributions from all properties, last 6 months</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 2px 0" }}>This Month</p>
                  <p style={{ fontSize: 18, fontWeight: 800, color: "#10b981", margin: 0 }}>UGX 185,000</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={incomeData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ borderRadius: 10, border: "1px solid #f1f5f9", fontSize: 12 }}
                    formatter={(v: unknown) => [`UGX ${formatCurrency(Number(v))}`, "Income"]}
                    cursor={{ fill: "#f8fafc" }}
                  />
                  <Bar dataKey="income" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Transactions */}
            <div style={{ backgroundColor: "#fff", borderRadius: 16, border: "1px solid #e8ecf0", overflow: "hidden" }}>
              <div style={{ padding: "18px 20px", borderBottom: "1px solid #f4f6f9" }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 14px 0" }}>Transaction History</h2>
                <div className="filter-tabs" style={{ display: "flex", gap: 4, overflowX: "auto" }}>
                  {(["all","income","buy","deposit","withdraw"] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setActiveTab(t)}
                      style={{
                        padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                        fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
                        backgroundColor: activeTab === t ? "#0f172a" : "#f4f6f9",
                        color: activeTab === t ? "#fff" : "#64748b",
                        transition: "all 0.15s",
                      }}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ padding: "8px 0" }}>
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
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "13px 20px", borderTop: i === 0 ? "none" : "1px solid #f7f9fb" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 11, backgroundColor: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <cfg.Icon style={{ width: 18, height: 18, color: cfg.color }} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", margin: "0 0 3px 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tx.label}</p>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: cfg.color, backgroundColor: cfg.bg, padding: "1px 7px", borderRadius: 99 }}>{cfg.label}</span>
                            <span style={{ fontSize: 11, color: "#94a3b8" }}>{tx.date}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: positive ? "#10b981" : "#0f172a", margin: "0 0 2px 0" }}>
                          {positive ? "+" : "−"}UGX {formatCurrency(Math.abs(tx.amount))}
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

          {/* ── Right column: linked accounts ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            <div style={{ backgroundColor: "#fff", borderRadius: 16, padding: "20px", border: "1px solid #e8ecf0" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0f172a", margin: 0 }}>Linked Accounts</h3>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8" }}>{methods.length} linked</span>
              </div>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 16px 0", lineHeight: 1.5 }}>
                Deposit and withdraw using mobile money, bank accounts, or cards.
              </p>

              {methods.map(pm => {
                const brand = methodBrand[pm.kind]
                return (
                  <div key={pm.id} style={{ border: "1.5px solid #eef1f5", borderRadius: 13, padding: "13px 14px", marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      {/* Brand tile */}
                      <div style={{ width: 42, height: 42, borderRadius: 11, background: brand.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
                        <brand.icon style={{ width: 20, height: 20, color: brand.text }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pm.label}</p>
                          {pm.isDefault && (
                            <span style={{ fontSize: 9.5, fontWeight: 700, color: "#2563eb", backgroundColor: "#eff6ff", padding: "1px 7px", borderRadius: 99, flexShrink: 0 }}>DEFAULT</span>
                          )}
                        </div>
                        <p style={{ fontSize: 11.5, color: "#94a3b8", margin: 0, fontVariantNumeric: "tabular-nums" }}>{pm.detail}</p>
                      </div>
                      <CheckBadgeIcon style={{ width: 17, height: 17, color: "#10b981", flexShrink: 0 }} />
                    </div>
                    {/* Row actions */}
                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      {!pm.isDefault && (
                        <button onClick={() => setDefault(pm.id)} style={{ fontSize: 11, fontWeight: 600, color: "#2563eb", background: "#f6f9ff", border: "none", borderRadius: 7, padding: "5px 12px", cursor: "pointer" }}>
                          Set as default
                        </button>
                      )}
                      <button onClick={() => removeMethod(pm.id)} style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", background: "#f8fafc", border: "none", borderRadius: 7, padding: "5px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                        <TrashIcon style={{ width: 12, height: 12 }} />
                        Remove
                      </button>
                    </div>
                  </div>
                )
              })}

              {/* Add account button */}
              <button
                onClick={() => setModal("add-method")}
                style={{
                  width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  padding: "12px 0", borderRadius: 12,
                  border: "1.5px dashed #cbd5e1", backgroundColor: "#fafbfd",
                  color: "#2563eb", fontSize: 13, fontWeight: 700, cursor: "pointer",
                  marginTop: 4,
                }}
              >
                <PlusIcon style={{ width: 16, height: 16 }} />
                Add Account
              </button>

              {/* Supported strip */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, paddingTop: 14, borderTop: "1px solid #f4f6f9" }}>
                <ShieldCheckIcon style={{ width: 14, height: 14, color: "#94a3b8", flexShrink: 0 }} />
                <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>
                  Supports MTN MoMo, Airtel Money, all major Ugandan banks, and Visa/Mastercard.
                </p>
              </div>
            </div>

            {/* Next payout card */}
            <div style={{ background: "linear-gradient(135deg, #0d9488, #0f766e)", borderRadius: 16, padding: "20px", color: "#fff" }}>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "rgba(255,255,255,0.65)", margin: "0 0 10px 0" }}>
                Next Rental Payout
              </p>
              <p style={{ fontSize: 28, fontWeight: 900, margin: "0 0 4px 0", letterSpacing: "-0.5px" }}>≈ UGX 185,000</p>
              <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.75)", margin: "0 0 16px 0" }}>
                Expected Feb 5, 2026 · paid to your default account
              </p>
              <div style={{ backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 99, height: 7, overflow: "hidden", marginBottom: 6 }}>
                <div style={{ width: "78%", height: "100%", backgroundColor: "#fff", borderRadius: 99 }} />
              </div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", margin: 0 }}>22 days into the current cycle</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {modal === "deposit" && <MoveMoneyModal mode="deposit" methods={methods} onClose={() => setModal(null)} />}
      {modal === "withdraw" && <MoveMoneyModal mode="withdraw" methods={methods} onClose={() => setModal(null)} />}
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

function MoveMoneyModal({ mode, methods, onClose }: {
  mode: "deposit" | "withdraw"; methods: PayMethod[]; onClose: () => void
}) {
  const [amount, setAmount] = useState(250000)
  const [methodId, setMethodId] = useState(methods.find(m => m.isDefault)?.id ?? methods[0]?.id)
  const [done, setDone] = useState(false)

  const isDeposit = mode === "deposit"
  const selected = methods.find(m => m.id === methodId)

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
            {isDeposit
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
      subtitle={isDeposit ? "Top up your wallet to invest" : "Available balance: UGX 2,450,000"}
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

      <button
        onClick={() => amount > 0 && setDone(true)}
        disabled={amount <= 0 || !selected}
        style={{
          width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
          background: amount > 0 ? "linear-gradient(135deg, #2563eb, #4f46e5)" : "#e2e8f0",
          color: amount > 0 ? "#fff" : "#94a3b8",
          fontSize: 15, fontWeight: 700, cursor: amount > 0 ? "pointer" : "not-allowed",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
        }}
      >
        {isDeposit ? "Deposit" : "Withdraw"} UGX {amount.toLocaleString()}
        <ChevronRightIcon style={{ width: 16, height: 16 }} />
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
