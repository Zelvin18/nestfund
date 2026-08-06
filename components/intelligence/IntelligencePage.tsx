"use client"

import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon, 
  BuildingOffice2Icon, 
  CpuChipIcon, 
  ArrowPathIcon 
} from "@heroicons/react/24/outline"

const intelligenceItems = [
  {
    id: "1",
    title: "Gov't Approves New Expressway",
    type: "approval" as const,
    location: "Entebbe – Kampala",
    impact: "Properties near the corridor expected to surge in value",
    change: 11,
    timeAgo: "2h ago",
  },
  {
    id: "2",
    title: "New Shopping Mall Approved",
    type: "development" as const,
    location: "Kira Town, Wakiso",
    impact: "Commercial activity boost expected in 6 months",
    change: 7,
    timeAgo: "5h ago",
  },
  {
    id: "3",
    title: "Flooding Reported in Bwaise",
    type: "decline" as const,
    location: "Bwaise, Kampala",
    impact: "Properties in flood zone facing value risk",
    change: -8,
    timeAgo: "7h ago",
  },
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
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
                <CpuChipIcon className="h-4 w-4" />
                AI-Powered Intelligence
              </div>
              <h1 className="mb-2 text-4xl font-bold text-gray-900">Market Intelligence</h1>
              <p className="text-lg text-gray-600">Real-time updates that impact property values in your area</p>
            </div>
            <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
              <ArrowPathIcon className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 py-2">
            {["All", "Positive", "Negative", "Government", "Development"].map((tab, i) => (
              <button key={tab} className={`rounded-lg px-4 py-2 text-sm font-medium transition ${i === 0 ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 lg:grid-cols-2">
          {intelligenceItems.map((item) => (
            <IntelligenceCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}

function IntelligenceCard({ item }: { item: typeof intelligenceItems[0] }) {
  const isPositive = item.change >= 0

  const config = {
    approval: { icon: CheckCircleIcon, bg: "bg-green-50", color: "text-green-600", ring: "ring-green-200", label: "Approval" },
    development: { icon: BuildingOffice2Icon, bg: "bg-blue-50", color: "text-blue-600", ring: "ring-blue-200", label: "Development" },
    decline: { icon: ExclamationTriangleIcon, bg: "bg-red-50", color: "text-red-600", ring: "ring-red-200", label: "Alert" },
  }

  const { icon: Icon, bg, color, ring, label } = config[item.type]

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ring-2 ${bg} ${color} ${ring}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${bg} ${color}`}>{label}</span>
            <span className="text-xs text-gray-400">{item.timeAgo}</span>
          </div>
          <h3 className="mb-1 text-lg font-bold text-gray-900">{item.title}</h3>
          <p className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-600">
            <span>📍</span> {item.location}
          </p>
          <p className="mb-3 text-sm leading-relaxed text-gray-600">{item.impact}</p>
          <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${
            isPositive ? "bg-green-50 text-green-700 ring-green-200" : "bg-red-50 text-red-700 ring-red-200"
          }`}>
            {isPositive ? <ArrowTrendingUpIcon className="h-3.5 w-3.5" /> : <ArrowTrendingDownIcon className="h-3.5 w-3.5" />}
            Expected property value impact: {isPositive ? "+" : ""}{item.change}%
          </div>
        </div>
      </div>
    </div>
  )
}
