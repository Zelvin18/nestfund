"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import {
  BuildingOffice2Icon,
  WrenchScrewdriverIcon,
  NewspaperIcon,
  Cog6ToothIcon,
  ArrowRightIcon,
  PlusIcon,
  ArrowTopRightOnSquareIcon,
  BanknotesIcon,
  UsersIcon,
  ChartBarIcon,
  ArrowsRightLeftIcon,
  InboxArrowDownIcon,
  ShieldExclamationIcon,
  CheckBadgeIcon,
  BellAlertIcon,
} from "@heroicons/react/24/outline"
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts"
import { PageHeader, Card } from "@/components/admin/AdminShell"
import CountUp from "@/components/ui/CountUp"
import { monthlyIncomeOf } from "@/lib/data/rentals"
import { useRentals, useIntelligence, useConstruction, useExchange, usePlatformStats } from "@/lib/hooks"
import { fetchSubmissions } from "@/lib/api"
import { platformActivitySeries, metricMeta, fmtCompact, type ActivityMetric, type ActivityRange } from "@/lib/adminData"

const fmtB = (v: number) => v >= 1e9 ? `UGX ${(v / 1e9).toFixed(1)}B` : `UGX ${(v / 1e6).toFixed(0)}M`
const ranges: ActivityRange[] = ["24H", "7D", "30D", "1Y"]
const lineColors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"]

export default function AdminDashboard() {
  const { rentals, live } = useRentals()
  const { items: intelligenceFeed } = useIntelligence()
  const { projects } = useConstruction()
  const { listings } = useExchange()
  const stats = usePlatformStats()
  const [pendingSubs, setPendingSubs] = useState<number | null>(null)
  const [metric, setMetric] = useState<ActivityMetric>("investments")
  const [range, setRange] = useState<ActivityRange>("30D")

  useEffect(() => {
    let active = true
    fetchSubmissions()
      .then(d => { if (active && d) setPendingSubs(d.filter(s => s.status === "submitted" || s.status === "under-review").length) })
      .catch(() => {})
    return () => { active = false }
  }, [])

  /* KPIs */
  const totalAssets = rentals.reduce((s, p) => s + p.currentPrice, 0) + projects.reduce((s, p) => s + p.estimatedPropertyValue, 0)
  const activeInvestments = rentals.reduce((s, p) => s + (p.totalShares - p.availableShares) * p.pricePerShare, 0) + projects.reduce((s, p) => s + p.capitalRaised, 0)
  const monthlyIncome = rentals.reduce((s, p) => s + monthlyIncomeOf(p), 0)
  const pendingCount = (pendingSubs ?? 0) + 2 // + payout & verification placeholders

  const kpis = [
    { label: "Total Users", value: stats.totalInvestors.toLocaleString(), trend: `+${stats.investorsChange}%`, up: true, icon: UsersIcon, grad: "linear-gradient(135deg, #3b82f6, #2563eb)" },
    { label: "Assets on Platform", value: fmtB(totalAssets), trend: "+27.6%", up: true, icon: BuildingOffice2Icon, grad: "linear-gradient(135deg, #6366f1, #4f46e5)" },
    { label: "Active Investments", value: fmtB(activeInvestments), trend: "+18.4%", up: true, icon: ChartBarIcon, grad: "linear-gradient(135deg, #8b5cf6, #7c3aed)" },
    { label: "Rental Revenue / mo", value: fmtB(monthlyIncome), trend: `+${stats.marketVolumeChange}%`, up: true, icon: BanknotesIcon, grad: "linear-gradient(135deg, #10b981, #059669)" },
    { label: "Verified Properties", value: String(rentals.length + projects.length), trend: `${rentals.length} rental · ${projects.length} build`, up: true, icon: CheckBadgeIcon, grad: "linear-gradient(135deg, #0d9488, #0f766e)" },
    { label: "Exchange Volume", value: "UGX 18.5B", trend: "+31.2%", up: true, icon: ArrowsRightLeftIcon, grad: "linear-gradient(135deg, #ec4899, #db2777)" },
    { label: "Construction Projects", value: String(projects.length), trend: fmtB(projects.reduce((s, p) => s + p.capitalRaised, 0)) + " raised", up: true, icon: WrenchScrewdriverIcon, grad: "linear-gradient(135deg, #f59e0b, #d97706)" },
    { label: "Pending Approvals", value: String(pendingCount), trend: pendingSubs === null ? "loading…" : `${pendingSubs} submissions`, up: false, icon: InboxArrowDownIcon, grad: "linear-gradient(135deg, #ef4444, #dc2626)" },
  ]

  /* Platform activity chart */
  const activityData = useMemo(() => platformActivitySeries(metric, range), [metric, range])
  const m = metricMeta[metric]

  /* Market performance: normalized % change for top properties */
  const marketPerf = useMemo(() => {
    const top = rentals.slice(0, 4)
    if (top.length === 0) return []
    const len = Math.min(...top.map(p => p.chartData.length))
    return Array.from({ length: len }, (_, i) => {
      const row: Record<string, number | string> = { time: top[0].chartData[i].time }
      top.forEach(p => {
        const base = p.chartData[0].value
        row[p.name] = Math.round(((p.chartData[i].value - base) / base) * 1000) / 10
      })
      return row
    })
  }, [rentals])

  const alerts = [
    ...(pendingSubs ? [{ tone: "#d97706", bg: "#fffbeb", text: `${pendingSubs} project submission${pendingSubs === 1 ? "" : "s"} awaiting review`, href: "/admin/submissions" }] : []),
    ...projects.filter(p => p.fundingProgress >= 75).map(p => ({ tone: "#0d9488", bg: "#f0fdfa", text: `${p.name} is ${p.fundingProgress}% funded — prepare completion plan`, href: `/admin/construction/${p.id}` })),
    { tone: "#dc2626", bg: "#fef2f2", text: "Dev write-policies are open — add admin login before public launch", href: "/admin/settings" },
  ].slice(0, 4)

  const recentActivity = [
    ...rentals.slice(0, 6).flatMap(p => p.activityFeed.slice(0, 1).map(a => ({ icon: a.icon === "payment" ? BanknotesIcon : BellAlertIcon, color: a.icon === "payment" ? "#10b981" : "#3b82f6", text: `${p.name}: ${a.title}`, when: a.date }))),
  ].slice(0, 6)

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle={live ? "Live overview of the NestFund platform" : "Mock mode — connect the database for live data"}
        action={
          <div style={{ display: "flex", gap: 10 }}>
            <Link href="/admin/properties/new" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 10, background: "linear-gradient(135deg, #2563eb, #4f46e5)", color: "#fff", fontSize: 13, fontWeight: 750, textDecoration: "none", boxShadow: "0 4px 14px rgba(37,99,235,0.3)" }}>
              <PlusIcon style={{ width: 15, height: 15 }} />
              New Property
            </Link>
            <Link href="/home" target="_blank" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 18px", borderRadius: 10, border: "1.5px solid #e2e8f0", backgroundColor: "#fff", color: "#374151", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
              <ArrowTopRightOnSquareIcon style={{ width: 14, height: 14 }} />
              View site
            </Link>
          </div>
        }
      />

      {/* ── KPI grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(215px, 100%), 1fr))", gap: 13, marginBottom: 20 }}>
        {kpis.map(k => (
          <Card key={k.label} style={{ padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: k.grad, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 3px 10px rgba(15,23,42,0.16)" }}>
                <k.icon style={{ width: 18, height: 18, color: "#fff" }} />
              </div>
              <p style={{ fontSize: 11.5, fontWeight: 700, color: "#7c8ba1", margin: 0, lineHeight: 1.3 }}>{k.label}</p>
            </div>
            <p style={{ fontSize: 22, fontWeight: 850, color: "#0b1220", margin: "0 0 3px 0", letterSpacing: "-0.5px" }}>
              <CountUp value={k.value} />
            </p>
            <p style={{ fontSize: 11, fontWeight: 650, color: k.up ? "#10b981" : "#d97706", margin: 0 }}>{k.trend}</p>
          </Card>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(420px, 100%), 1fr))", gap: 15, marginBottom: 20 }}>

        {/* Platform activity */}
        <Card style={{ padding: "20px 22px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 6 }}>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 750, color: "#0b1220", margin: "0 0 2px 0" }}>Platform Activity</h2>
              <p style={{ fontSize: 11.5, color: "#94a3b8", margin: 0 }}>How money is moving through NestFund</p>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <select value={metric} onChange={e => setMetric(e.target.value as ActivityMetric)} style={{ border: "1.5px solid #e2e8f0", borderRadius: 9, padding: "7px 11px", fontSize: 12, fontWeight: 650, color: "#0b1220", outline: "none", cursor: "pointer", backgroundColor: "#fbfcfe" }}>
                {(Object.keys(metricMeta) as ActivityMetric[]).map(k => <option key={k} value={k}>{metricMeta[k].label}</option>)}
              </select>
              <div style={{ display: "flex", gap: 2, backgroundColor: "#f2f5f9", borderRadius: 9, padding: 3 }}>
                {ranges.map(r => (
                  <button key={r} onClick={() => setRange(r)} style={{ padding: "5px 11px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 11.5, fontWeight: 700, backgroundColor: range === r ? "#fff" : "transparent", color: range === r ? "#0b1220" : "#94a3b8", boxShadow: range === r ? "0 1px 4px rgba(15,23,42,0.12)" : "none" }}>{r}</button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 24, fontWeight: 850, color: "#0b1220", letterSpacing: "-0.6px" }}>UGX {fmtCompact(activityData[activityData.length - 1]?.value ?? 0)}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#10b981" }}>+{(m.drift * (range === "24H" ? 0.02 : range === "7D" ? 0.06 : range === "30D" ? 0.12 : 1)).toFixed(1)}% this period</span>
          </div>
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={activityData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="activityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={m.color} stopOpacity={0.22} />
                  <stop offset="100%" stopColor={m.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f6" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} interval={Math.max(0, Math.ceil(activityData.length / 8) - 1)} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} width={44} tickFormatter={v => fmtCompact(Number(v))} domain={[(min: number) => min * 0.97, (max: number) => max * 1.02]} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #eef1f5", fontSize: 12 }} formatter={(v: unknown) => [`UGX ${Number(v).toLocaleString()}`, m.label]} />
              <Area type="monotone" dataKey="value" stroke={m.color} strokeWidth={2.5} fill="url(#activityGrad)" dot={false} activeDot={{ r: 4, fill: m.color, stroke: "#fff", strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Market performance */}
        <Card style={{ padding: "20px 22px" }}>
          <div style={{ marginBottom: 14 }}>
            <h2 style={{ fontSize: 15, fontWeight: 750, color: "#0b1220", margin: "0 0 2px 0" }}>Market Performance</h2>
            <p style={{ fontSize: 11.5, color: "#94a3b8", margin: 0 }}>Share-price change (30 days, %) — how the market is responding</p>
          </div>
          <ResponsiveContainer width="100%" height={266}>
            <LineChart data={marketPerf} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f6" vertical={false} />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} interval={Math.max(0, Math.ceil(marketPerf.length / 6) - 1)} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} width={38} tickFormatter={v => `${v}%`} />
              <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #eef1f5", fontSize: 12 }} formatter={(v: unknown) => [`${v}%`]} />
              <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" iconSize={7} />
              {rentals.slice(0, 4).map((p, i) => (
                <Line key={p.id} type="monotone" dataKey={p.name} stroke={lineColors[i]} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* ── Operations row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))", gap: 15, marginBottom: 20 }}>

        {/* Pending approvals */}
        <Card title="Pending Approvals" subtitle="Items waiting on the team" icon={InboxArrowDownIcon} accent="#d97706">
          {[
            { label: "Project submissions", count: pendingSubs ?? "…", href: "/admin/submissions", hot: (pendingSubs ?? 0) > 0 },
            { label: "KYC verifications", count: "—", href: "#", hot: false, soon: true },
            { label: "Payout approvals", count: "—", href: "#", hot: false, soon: true },
            { label: "Withdrawal requests", count: "—", href: "#", hot: false, soon: true },
          ].map(row => (
            <Link key={row.label} href={row.href} style={{ textDecoration: "none" }}>
              <div className="admin-table-row" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 8px", borderTop: "1px solid #f2f5f9", borderRadius: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 650, color: row.soon ? "#a6b2c3" : "#0b1220" }}>
                  {row.label}
                  {row.soon && <span style={{ fontSize: 8.5, fontWeight: 800, color: "#94a3b8", border: "1px solid #e2e8f0", borderRadius: 5, padding: "1px 5px", marginLeft: 7, letterSpacing: "0.05em" }}>WITH AUTH</span>}
                </span>
                <span style={{
                  minWidth: 26, textAlign: "center", fontSize: 12, fontWeight: 800, borderRadius: 99, padding: "3px 9px",
                  color: row.hot ? "#fff" : "#7c8ba1",
                  backgroundColor: row.hot ? "#d97706" : "#f2f5f9",
                }}>{row.count}</span>
              </div>
            </Link>
          ))}
        </Card>

        {/* Alerts */}
        <Card title="Alerts" subtitle="Needs your attention" icon={ShieldExclamationIcon} accent="#dc2626">
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {alerts.map((a, i) => (
              <Link key={i} href={a.href} style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 9, backgroundColor: a.bg, border: `1px solid ${a.tone}30`, borderRadius: 11, padding: "10px 13px" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: a.tone, flexShrink: 0, marginTop: 5 }} />
                  <p style={{ fontSize: 12.5, fontWeight: 650, color: "#0b1220", margin: 0, lineHeight: 1.5 }}>{a.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        {/* Recent activity */}
        <Card title="Recent Activity" subtitle="Latest events across properties" icon={BellAlertIcon} accent="#3b82f6">
          {recentActivity.map((a, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 11, padding: "8px 4px", borderTop: i === 0 ? "none" : "1px solid #f2f5f9" }}>
              <div style={{ width: 30, height: 30, borderRadius: 9, backgroundColor: `${a.color}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <a.icon style={{ width: 14, height: 14, color: a.color }} />
              </div>
              <p style={{ flex: 1, fontSize: 12, fontWeight: 600, color: "#0b1220", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.text}</p>
              <span style={{ fontSize: 10.5, color: "#c3ccd9", flexShrink: 0 }}>{a.when}</span>
            </div>
          ))}
        </Card>
      </div>

      {/* ── Bottom row: markets snapshot + intelligence ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(340px, 100%), 1fr))", gap: 15 }}>
        <Card title="Exchange Snapshot" subtitle="Live listings and premiums" icon={ArrowsRightLeftIcon} accent="#ec4899">
          {listings.map(l => {
            const premium = l.originalSharePrice ? Math.round(((l.currentSharePrice - l.originalSharePrice) / l.originalSharePrice) * 1000) / 10 : 0
            return (
              <Link key={l.id} href="/admin/exchange" style={{ textDecoration: "none" }}>
                <div className="admin-table-row" style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 8px", borderTop: "1px solid #f2f5f9", borderRadius: 8 }}>
                  <img src={l.image} alt="" style={{ width: 42, height: 32, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12.5, fontWeight: 700, color: "#0b1220", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.name}</p>
                    <p style={{ fontSize: 10.5, color: "#a6b2c3", margin: 0 }}>{l.availableBuyShares.toLocaleString()} buy · {l.availableSellShares.toLocaleString()} sell</p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ fontSize: 12.5, fontWeight: 750, color: "#0b1220", margin: 0 }}>UGX {l.currentSharePrice.toLocaleString()}</p>
                    <p style={{ fontSize: 11, fontWeight: 700, color: premium >= 0 ? "#10b981" : "#ef4444", margin: 0 }}>{premium >= 0 ? "+" : ""}{premium}%</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </Card>

        <Card title="Latest Intelligence" subtitle="What the market is reading" icon={NewspaperIcon} accent="#7c3aed">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {intelligenceFeed.slice(0, 3).map(item => (
              <Link key={item.id} href="/admin/intelligence" style={{ textDecoration: "none" }}>
                <div className="admin-table-row" style={{ display: "flex", alignItems: "center", gap: 12, borderRadius: 10, padding: 6 }}>
                  <img src={item.image} alt="" style={{ width: 62, height: 44, borderRadius: 9, objectFit: "cover", flexShrink: 0, backgroundColor: "#f1f5f9" }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12.5, fontWeight: 700, color: "#0b1220", margin: "0 0 2px 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.title}</p>
                    <p style={{ fontSize: 10.5, color: "#a6b2c3", margin: 0 }}>{item.location} · {item.timeAgo}</p>
                  </div>
                  <span style={{ fontSize: 12.5, fontWeight: 800, color: item.change >= 0 ? "#10b981" : "#ef4444", flexShrink: 0 }}>{item.change >= 0 ? "+" : ""}{item.change}%</span>
                </div>
              </Link>
            ))}
          </div>
          <Link href="/admin/intelligence" style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12.5, fontWeight: 750, color: "#7c3aed", textDecoration: "none", marginTop: 12 }}>
            Manage intelligence <ArrowRightIcon style={{ width: 12, height: 12 }} />
          </Link>
        </Card>

        <Card title="Quick Actions" subtitle="Jump straight in" icon={Cog6ToothIcon} accent="#0d9488">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { href: "/admin/properties/new", label: "Add Property", icon: PlusIcon, color: "#2563eb" },
              { href: "/admin/submissions", label: "Review Submissions", icon: InboxArrowDownIcon, color: "#d97706" },
              { href: "/admin/intelligence", label: "Post Intelligence", icon: NewspaperIcon, color: "#7c3aed" },
              { href: "/admin/exchange", label: "Manage Exchange", icon: ArrowsRightLeftIcon, color: "#ec4899" },
              { href: "/admin/construction", label: "Construction", icon: WrenchScrewdriverIcon, color: "#f59e0b" },
              { href: "/admin/settings", label: "Site Settings", icon: Cog6ToothIcon, color: "#0d9488" },
            ].map(a => (
              <Link key={a.label} href={a.href} style={{ textDecoration: "none" }}>
                <div className="admin-table-row" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, border: "1.5px solid #eef1f5", borderRadius: 12, padding: "14px 8px", textAlign: "center" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: `${a.color}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <a.icon style={{ width: 16, height: 16, color: a.color }} />
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: "#0b1220" }}>{a.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </>
  )
}
