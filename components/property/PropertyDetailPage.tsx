"use client"

import { useState } from "react"
import { 
  ArrowLeftIcon, 
  MapPinIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  ShareIcon, 
  HeartIcon, 
  CheckBadgeIcon 
} from "@heroicons/react/24/outline"
import Link from "next/link"
import { featuredProperties } from "@/lib/mockData"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

export default function PropertyDetailPage({ id }: { id: string }) {
  const property = featuredProperties.find((p) => p.id === id)
  const [shareAmount, setShareAmount] = useState(100)

  if (!property) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Property not found</p>
      </div>
    )
  }

  const isPositive = property.priceChangePercent >= 0
  const totalCost = shareAmount * property.pricePerShare
  const estimatedMonthlyIncome = (totalCost * (property.rentalYield / 100)) / 12

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/market" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Market
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left */}
          <div className="space-y-6 lg:col-span-2">
            {/* Image */}
            <div className="relative overflow-hidden rounded-2xl">
              <img src={property.image} alt={property.name} className="h-96 w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-1.5 text-white">
                <MapPinIcon className="h-4 w-4" />
                <span className="text-lg font-medium">{property.location}</span>
              </div>
              <div className="absolute right-4 top-4 flex gap-2">
                <button className="rounded-full bg-white/90 p-2 backdrop-blur hover:bg-white">
                  <HeartIcon className="h-5 w-5 text-gray-700" />
                </button>
                <button className="rounded-full bg-white/90 p-2 backdrop-blur hover:bg-white">
                  <ShareIcon className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Title & Stats */}
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h1 className="mb-2 text-3xl font-bold text-gray-900">{property.name}</h1>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4" />
                      {property.location}
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-200">
                      <CheckBadgeIcon className="h-3.5 w-3.5" />
                      Verified Property
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="mb-1 text-3xl font-bold text-gray-900">UGX {formatCurrency(property.pricePerShare)}</p>
                  <div className={`flex items-center justify-end gap-1 font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                    {isPositive ? <ArrowTrendingUpIcon className="h-4 w-4" /> : <ArrowTrendingDownIcon className="h-4 w-4" />}
                    <span>{formatPercentage(property.priceChangePercent)} (24h)</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { label: "Rental Yield", value: `${property.rentalYield}%`, color: "text-green-600" },
                  { label: "Area Score", value: `${property.areaScore}/100`, color: "text-gray-900" },
                  { label: "Growth Potential", value: property.futureGrowth, color: "text-blue-600" },
                  { label: "Shares Available", value: `${((property.availableShares / property.totalShares) * 100).toFixed(0)}%`, color: "text-gray-900" },
                ].map((metric) => (
                  <div key={metric.label} className="rounded-lg bg-gray-50 p-4 text-center">
                    <p className="mb-1 text-sm text-gray-500">{metric.label}</p>
                    <p className={`text-xl font-bold ${metric.color}`}>{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Chart */}
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h2 className="mb-4 text-xl font-bold text-gray-900">Share Price History</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={property.chartData}>
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                    formatter={(v: unknown) => [`UGX ${formatCurrency(Number(v))}`, "Price"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={isPositive ? "#10b981" : "#ef4444"}
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: isPositive ? "#10b981" : "#ef4444" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* About */}
            <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <h2 className="mb-4 text-xl font-bold text-gray-900">About This Property</h2>
              <p className="mb-4 leading-relaxed text-gray-700">
                {property.name} is a premium property located in {property.location}. The property features modern
                architecture, excellent amenities, and is situated in one of the fastest-growing areas in the region.
              </p>
              <p className="leading-relaxed text-gray-700">
                With a current rental yield of {property.rentalYield}% and strong growth projections, this property
                represents an excellent opportunity for both income and capital appreciation.
              </p>
            </div>
          </div>

          {/* Right — Buy Widget */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-xl bg-white p-6 shadow-lg ring-1 ring-gray-100">
              <h2 className="mb-4 text-xl font-bold text-gray-900">Buy Shares</h2>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">Number of Shares</label>
                <input
                  type="number"
                  value={shareAmount}
                  onChange={(e) => setShareAmount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-lg font-semibold focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  min="1"
                  max={property.availableShares}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Max: {property.availableShares.toLocaleString()} shares available
                </p>
              </div>

              <div className="mb-6 space-y-3 rounded-lg bg-gray-50 p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price per share</span>
                  <span className="font-semibold text-gray-900">UGX {formatCurrency(property.pricePerShare)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Number of shares</span>
                  <span className="font-semibold text-gray-900">{shareAmount}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-900">Total Cost</span>
                    <span className="text-xl font-bold text-gray-900">UGX {formatCurrency(totalCost)}</span>
                  </div>
                </div>
                <div className="rounded-lg bg-green-50 p-3 ring-1 ring-green-200">
                  <p className="mb-0.5 text-xs font-medium text-green-700">Est. Monthly Income</p>
                  <p className="text-lg font-bold text-green-700">UGX {formatCurrency(estimatedMonthlyIncome)}</p>
                </div>
              </div>

              <Button variant="primary" size="lg" className="mb-3 w-full">
                Buy Shares — UGX {formatCurrency(totalCost)}
              </Button>

              <p className="text-center text-xs text-gray-500">
                By proceeding, you agree to our{" "}
                <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
