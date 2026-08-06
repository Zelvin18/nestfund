"use client"

import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Building2, Brain, RefreshCw } from "lucide-react"
import { marketIntelligence } from "@/lib/mockData"

const extendedIntelligence = [
  ...marketIntelligence,
  {
    id: "4",
    title: "New University Campus Planned",
    type: "development" as const,
    location: "Nansana, Wakiso",
    impact: "Student housing demand expected to increase significantly",
    change: 15,
    timeAgo: "12h ago",
  },
  {
    id: "5",
    title: "Property Tax Increase in Kololo",
    type: "decline" as const,
    location: "Kololo, Kampala",
    impact: "Investor yields in the area may decrease by 0.5–1.2%",
    change: -4,
    timeAgo: "1d ago",
  },
  {
    id: "6",
    title: "New Industrial Park Approved",
    type: "approval" as const,
    location: "Namanve, Mukono",
    impact: "Surrounding residential areas expected to see worker housing demand rise",
    change: 9,
    timeAgo: "2d ago",
  },
]

export default function IntelligencePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-2 inline-flex items-center space-x-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
                <Brain className="h-4 w-4" />
                <span>AI-Powered Intelligence</span>
              </div>
              <h1 className="mb-2 text-4xl font-bold text-gray-900">Market Intelligence</h1>
              <p className="text-lg text-gray-600">Real-time updates that impact property values in your area</p>
            </div>
            <button className="flex items-center space-x-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 py-2">
            {["All", "Positive", "Negative", "Government", "Development"].map((tab) => (
              <button
                key={tab}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  tab === "All"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Intelligence Feed */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-2">
          {extendedIntelligence.map((item) => (
            <IntelligenceCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

function IntelligenceCard({ item }: { item: typeof extendedIntelligence[0] }) {
  const isPositive = item.change >= 0

  const config = {
    approval: { icon: CheckCircle, bg: "bg-green-50", iconColor: "text-green-600", ring: "ring-green-200", label: "Approval" },
    development: { icon: Building2, bg: "bg-blue-50", iconColor: "text-blue-600", ring: "ring-blue-200", label: "Development" },
    decline: { icon: AlertCircle, bg: "bg-red-50", iconColor: "text-red-600", ring: "ring-red-200", label: "Alert" },
  }

  const { icon: Icon, bg, iconColor, ring, label } = config[item.type]

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ring-2 ${bg} ${iconColor} ${ring}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${bg} ${iconColor}`}>
              {label}
            </span>
            <span className="text-xs text-gray-400">{item.timeAgo}</span>
          </div>
          <h3 className="mb-1 text-lg font-bold text-gray-900">{item.title}</h3>
          <p className="mb-2 text-sm font-medium text-gray-600">📍 {item.location}</p>
          <p className="mb-3 text-sm text-gray-600">{item.impact}</p>
          <div className={`inline-flex items-center space-x-1.5 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${
            isPositive ? "bg-green-50 text-green-700 ring-green-200" : "bg-red-50 text-red-700 ring-red-200"
          }`}>
            {isPositive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
            <span>Expected property value impact: {isPositive ? "+" : ""}{item.change}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
