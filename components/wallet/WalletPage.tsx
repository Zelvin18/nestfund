"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ArrowsRightLeftIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  DevicePhoneMobileIcon,
} from "@heroicons/react/24/outline"
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/solid"
import { formatCurrency } from "@/lib/utils"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

const incomeData = [
  { month: "Aug", income: 142000 },
  { month: "Sep", income: 158000 },
  { month: "Oct", income: 149000 },
  { month: "Nov", income: 171000 },
  { month: "Dec", income: 165000 },
  { month: "Jan", income: 185000 },
]

const transactions = [
  { id: "1", type: "income",    label: "Rental Income — Sunrise Apartments",  amount: 93333,  date: "Jan 30, 2026", status: "completed" },
  { id: "2", type: "income",    label: "Rental Income — Acacia Office Park",   amount: 54600,  date: "Jan 30, 2026", status: "completed" },
  { id: "3", type: "buy",       label: "Bought 100 shares — Sunrise Apartments", amount: -125000, date: "Jan 22, 2026", status: "completed" },
  { id: "4", type: "deposit",   label: "Deposit via MTN Mobile Money",         amount: 500000, date: "Jan 18, 2026", status: "completed" },
  { id: "5", type: "income",    label: "Rental Income — Green Heights",        amount: 37067,  date: "Dec 31, 2025", status: "completed" },
  { id: "6", type: "buy",       label: "Bought 50 shares — Green Heights",     amount: -42000, date: "Dec 14, 2025", status: "completed" },
  { id: "7", type: "withdraw",  label: "Withdrawal to Stanbic Bank",           amount: -200000, date: "Dec 5, 2025", status: "completed" },
  { id: "8", type: "deposit",   label: "Deposit via Bank Transfer",            amount: 1000000, date: "Nov 28, 2025", status: "completed" },
]

const payMethods = [
  { icon: DevicePhoneMobileIcon, label: "MTN Mobile Money", detail: "+256 77x xxx xxx", color: "#f59e0b", bg: "#fefce8" },
  { icon: DevicePhoneMobileIcon, label: "Airtel Money",      detail: "+256 75x xxx xxx", color: "#dc2626", bg: "#fef2f2" },
  { icon: BuildingLibraryIcon,   label: "Stanbic Bank",      detail: "xxxx xxxx 3421",   color: "#2563eb", bg: "#eff6ff" },
]

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState<"all" | "income" | "buy" | "deposit" | "withdraw">("all")
  const [showDeposit, setShowDeposit] = useState(false)
  const [showWithdraw, setShowWithdraw] = useState(false)

  const filtered = activeTab === "all" ? transactions : transactions.filter(t => t.type === activeTab)

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #4f46e5 100%)", padding: "0" }}>
        <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "36px 24px 40px" }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px 0" }}>
            Available Balance
          </p>
          <p style={{ fontSize: 44, fontWeight: 900, color: "#fff", margin: "0 0 6px 0", letterSpacing: "-1.5px" }}>
            UGX 2,450,000
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, backgroundColor: "rgba(16,185,129,0.15)", borderRadius: 99, padding: "4px 10px" }}>
              <ArrowTrendingUpIcon style={{ width: 13, height: 13, color: "#6ee7b7" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#6ee7b7" }}>+UGX 185,000 this month</span>
            </div>
          </div>
          {/* Action buttons */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { label: "Deposit", Icon: ArrowDownTrayIcon, action: () => setShowDeposit(true), primary: true },
              { label: "Withdraw", Icon: ArrowUpTrayIcon, action: () => setShowWithdraw(true), primary: false },
              { label: "Transfer", Icon: ArrowsRightLeftIcon, action: () => {}, primary: false },
            ].map(btn => (
              <button
                key={btn.label}
                onClick={btn.action}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "10px 22px", borderRadius: 10,
                  background: btn.primary ? "#fff" : "rgba(255,255,255,0.12)",
                  color: btn.primary ? "#1e3a8a" : "#fff",
                  border: btn.primary ? "none" : "1.5px solid rgba(255,255,255,0.25)",
                  fontSize: 14, fontWeight: 700, cursor: "pointer",
                }}
              >
                <btn.Icon style={{ width: 16, height: 16 }} />
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px" }}>
        <div className="wallet-grid">

          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Income chart */}
            <div style={{ backgroundColor: "#fff", borderRadius: 16, padding: "22px 20px", border: "1.5px solid #f1f5f9", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 3px 0" }}>Monthly Rental Income</h2>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>Income from all properties</p>
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
            <div style={{ backgroundColor: "#fff", borderRadius: 16, border: "1.5px solid #f1f5f9", boxShadow: "0 1px 6px rgba(0,0,0,0.04)", overflow: "hidden" }}>
              <div style={{ padding: "18px 20px", borderBottom: "1px solid #f8fafc" }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 14px 0" }}>Transaction History</h2>
                <div className="filter-tabs" style={{ display: "flex", gap: 4, overflowX: "auto" }}>
                  {(["all","income","buy","deposit","withdraw"] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setActiveTab(t)}
                      style={{
                        padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                        fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
                        backgroundColor: activeTab === t ? "#2563eb" : "#f8fafc",
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
                    income:   { color: "#10b981", bg: "#f0fdf4", label: "Income" },
                    buy:      { color: "#2563eb", bg: "#eff6ff", label: "Purchase" },
                    deposit:  { color: "#7c3aed", bg: "#f5f3ff", label: "Deposit" },
                    withdraw: { color: "#ea580c", bg: "#fff7ed", label: "Withdrawal" },
                  }
                  const cfg = typeConfig[tx.type as keyof typeof typeConfig]
                  return (
                    <div
                      key={tx.id}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", borderTop: i === 0 ? "none" : "1px solid #f8fafc" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: cfg.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <BanknotesIcon style={{ width: 18, height: 18, color: cfg.color }} />
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", margin: "0 0 2px 0" }}>{tx.label}</p>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, color: cfg.color, backgroundColor: cfg.bg, padding: "1px 7px", borderRadius: 99 }}>{cfg.label}</span>
                            <span style={{ fontSize: 11, color: "#94a3b8" }}>{tx.date}</span>
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 700, color: positive ? "#10b981" : "#0f172a", margin: 0 }}>
                          {positive ? "+" : ""}UGX {formatCurrency(Math.abs(tx.amount))}
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

          {/* Right — accounts summary */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Balances */}
            <div style={{ backgroundColor: "#fff", borderRadius: 16, padding: "20px", border: "1.5px solid #f1f5f9", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 16px 0" }}>Account Breakdown</h3>
              {[
                { label: "Cash Wallet",    value: 2450000,  color: "#2563eb",  note: "Available to invest" },
                { label: "Invested Value", value: 2023500,  color: "#7c3aed",  note: "Total property shares" },
                { label: "Total Earnings", value: 184000,   color: "#10b981",  note: "Rental income received" },
              ].map(a => (
                <div key={a.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f8fafc" }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", margin: 0 }}>{a.label}</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0 0 0" }}>{a.note}</p>
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 800, color: a.color, margin: 0 }}>UGX {formatCurrency(a.value)}</p>
                </div>
              ))}
            </div>

            {/* Payment methods */}
            <div style={{ backgroundColor: "#fff", borderRadius: 16, padding: "20px", border: "1.5px solid #f1f5f9", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: 0 }}>Payment Methods</h3>
                <button style={{ fontSize: 12, fontWeight: 600, color: "#2563eb", background: "none", border: "none", cursor: "pointer" }}>+ Add</button>
              </div>
              {payMethods.map(pm => (
                <div key={pm.label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, backgroundColor: "#f8fafc", marginBottom: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, backgroundColor: pm.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <pm.icon style={{ width: 18, height: 18, color: pm.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#0f172a", margin: 0 }}>{pm.label}</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0 0 0" }}>{pm.detail}</p>
                  </div>
                  <CheckBadgeIcon style={{ width: 16, height: 16, color: "#10b981" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
