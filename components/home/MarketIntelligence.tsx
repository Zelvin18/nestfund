"use client"

import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Building2 } from "lucide-react"
import Link from "next/link"
import { marketIntelligence } from "@/lib/mockData"

export default function MarketIntelligenceSection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="mb-3 text-3xl font-bold text-gray-900">AI Market Intelligence</h2>
            <p className="text-lg text-gray-600">Real-time updates affecting property values</p>
          </div>
          <Link
            href="/intelligence"
            className="hidden text-sm font-medium text-blue-600 hover:text-blue-700 sm:block"
          >
            View All Updates →
          </Link>
        </div>

        <div className="space-y-4">
          {marketIntelligence.map((item) => (
            <IntelligenceCard key={item.id} item={item} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/intelligence" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View All Updates →
          </Link>
        </div>
      </div>
    </section>
  )
}

function IntelligenceCard({ item }: { item: typeof marketIntelligence[0] }) {
  const isPositive = item.change >= 0

  const iconMap = {
    approval: CheckCircle,
    development: Building2,
    decline: AlertCircle,
  }

  const Icon = iconMap[item.type]

  const colorMap = {
    approval: "bg-green-50 text-green-600 ring-green-200",
    development: "bg-blue-50 text-blue-600 ring-blue-200",
    decline: "bg-red-50 text-red-600 ring-red-200",
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        {/* Icon */}
        <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ring-2 ${colorMap[item.type]}`}>
          <Icon className="h-5 w-5" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <h3 className="mb-1 text-lg font-semibold text-gray-900">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.location}</p>
            </div>
            <span className="text-xs text-gray-500">{item.timeAgo}</span>
          </div>

          <p className="mb-3 text-sm text-gray-600">{item.impact}</p>

          <div className={`inline-flex items-center space-x-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
            isPositive
              ? "bg-green-50 text-green-700 ring-1 ring-green-200"
              : "bg-red-50 text-red-700 ring-1 ring-red-200"
          }`}>
            {isPositive ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            <span>Expected Impact: {isPositive ? "+" : ""}{item.change}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
