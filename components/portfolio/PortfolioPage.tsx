"use client"

import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  WalletIcon, 
  ChartPieIcon, 
  ChartBarIcon 
} from "@heroicons/react/24/outline"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { featuredProperties } from "@/lib/mockData"
import Link from "next/link"

const mockPortfolio = [
  { propertyId: "sunrise-apartments", shares: 800, invested: 1000000, currentValue: 1045000 },
  { propertyId: "acacia-office-park", shares: 200, invested: 420000, currentValue: 504000 },
  { propertyId: "green-heights", shares: 630, invested: 504000, currentValue: 474500 },
]

const performanceData = Array.from({ length: 12 }, (_, i) => ({
  month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i],
  value: 12000000 + i * 420000 + Math.random() * 180000,
}))

const COLORS = ["#3b82f6", "#10b981", "#8b5cf6"]

export default function PortfolioPage() {
  const totalValue = mockPortfolio.reduce((s, p) => s + p.currentValue, 0)
  const totalInvested = mockPortfolio.reduce((s, p) => s + p.invested, 0)
  const totalGain = totalValue - totalInvested
  const totalGainPct = (totalGain / totalInvested) * 100

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">My Portfolio</h1>
          <p className="text-lg text-gray-600">Track your real estate investments and income</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Summary Cards */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard title="Portfolio Value" value={`UGX ${formatCurrency(totalValue)}`} change={totalGainPct} icon={ChartPieIcon} />
          <SummaryCard title="Total Invested" value={`UGX ${formatCurrency(totalInvested)}`} neutral icon={WalletIcon} />
          <SummaryCard title="Total Gain" value={`UGX ${formatCurrency(totalGain)}`} change={totalGainPct} icon={ArrowTrendingUpIcon} />
          <SummaryCard title="Monthly Income" value="UGX 185,000" change={2.4} icon={ChartBarIcon} />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Performance Chart */}
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100 lg:col-span-2">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Portfolio Performance</h2>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={performanceData}>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb" }}
                  formatter={(v: unknown) => [`UGX ${formatCurrency(Number(v))}`, "Value"]}
                />
                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2.5} dot={false} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Allocation */}
          <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Allocation</h2>
            <div className="flex justify-center">
              <PieChart width={180} height={180}>
                <Pie data={mockPortfolio.map((p) => ({ name: p.propertyId, value: p.currentValue }))} cx="50%" cy="50%" outerRadius={75} innerRadius={35} dataKey="value" paddingAngle={3}>
                  {mockPortfolio.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
              </PieChart>
            </div>
            <div className="mt-4 space-y-3">
              {mockPortfolio.map((p, i) => {
                const prop = featuredProperties.find(f => f.id === p.propertyId)
                return (
                  <div key={p.propertyId} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ background: COLORS[i] }} />
                      <span className="text-sm text-gray-700">{prop?.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {((p.currentValue / totalValue) * 100).toFixed(1)}%
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Holdings */}
        <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="border-b border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900">My Holdings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {["Property", "Shares", "Invested", "Current Value", "Gain/Loss", "Action"].map((h) => (
                    <th key={h} className={`px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 ${h === "Property" ? "text-left" : "text-right"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {mockPortfolio.map((holding) => {
                  const prop = featuredProperties.find(f => f.id === holding.propertyId)
                  if (!prop) return null
                  const gain = holding.currentValue - holding.invested
                  const gainPct = (gain / holding.invested) * 100
                  return (
                    <tr key={holding.propertyId} className="transition hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={prop.image} alt={prop.name} className="h-12 w-12 rounded-lg object-cover" />
                          <div>
                            <p className="font-semibold text-gray-900">{prop.name}</p>
                            <p className="text-sm text-gray-500">{prop.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-gray-900">{holding.shares.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right text-gray-700">UGX {formatCurrency(holding.invested)}</td>
                      <td className="px-6 py-4 text-right font-semibold text-gray-900">UGX {formatCurrency(holding.currentValue)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className={`flex items-center justify-end gap-1 font-semibold ${gain >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {gain >= 0 ? <ArrowTrendingUpIcon className="h-4 w-4" /> : <ArrowTrendingDownIcon className="h-4 w-4" />}
                          <span>{formatPercentage(gainPct)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/property/${prop.id}`} className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-100 transition">
                          Manage
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({ title, value, change, icon: Icon, neutral }: {
  title: string; value: string; change?: number; icon: React.ElementType; neutral?: boolean
}) {
  const isPositive = (change ?? 0) >= 0
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
        <Icon className="h-5 w-5 text-blue-600" />
      </div>
      <p className="mb-1 text-sm text-gray-500">{title}</p>
      <p className="mb-1 text-2xl font-bold text-gray-900">{value}</p>
      {!neutral && change !== undefined && (
        <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
          {isPositive ? <ArrowTrendingUpIcon className="h-3.5 w-3.5" /> : <ArrowTrendingDownIcon className="h-3.5 w-3.5" />}
          {formatPercentage(change)} all time
        </div>
      )}
    </div>
  )
}
