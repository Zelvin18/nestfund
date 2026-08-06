"use client"

import { useState } from "react"
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, MapPinIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { featuredProperties } from "@/lib/mockData"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import { Button } from "@/components/ui/Button"

export default function MarketPage() {
  const [filter, setFilter] = useState<"all" | "high-growth" | "high-yield">("all")
  const [sort, setSort] = useState<"trending" | "price-low" | "price-high" | "yield">("trending")

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">Property Market</h1>
          <p className="text-lg text-gray-600">Discover and invest in verified real estate opportunities</p>
        </div>
      </div>

      {/* Filters */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {(["all", "high-growth", "high-yield"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                    filter === f ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {f === "all" ? "All Properties" : f === "high-growth" ? "High Growth" : "High Yield"}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as typeof sort)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700"
              >
                <option value="trending">Trending</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="yield">Rental Yield</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="mb-6 text-sm text-gray-600">
          Showing <span className="font-semibold text-gray-900">{featuredProperties.length}</span> properties
        </p>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </div>
  )
}

function PropertyCard({ property }: { property: typeof featuredProperties[0] }) {
  const isPositive = property.priceChangePercent >= 0
  return (
    <Link
      href={`/property/${property.id}`}
      className="group overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-gray-100 transition hover:shadow-xl"
    >
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <img
          src={property.image}
          alt={property.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute right-3 top-3">
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            property.futureGrowth === "High" ? "bg-green-500 text-white" :
            property.futureGrowth === "Medium" ? "bg-yellow-500 text-white" : "bg-gray-500 text-white"
          }`}>{property.futureGrowth} Growth</span>
        </div>
        <div className="absolute bottom-3 left-3 flex items-center space-x-1 text-white">
          <MapPinIcon className="h-3.5 w-3.5" />
          <span className="text-sm font-medium">{property.location}</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="mb-1 text-lg font-bold text-gray-900 group-hover:text-blue-600">{property.name}</h3>
        <p className="mb-4 text-sm text-gray-500">
          {property.availableShares.toLocaleString()} of {property.totalShares.toLocaleString()} shares available
        </p>
        <div className="mb-4 flex h-12 items-end justify-between gap-0.5 overflow-hidden rounded-md bg-gray-50 px-2 pb-1">
          {property.chartData.slice(-20).map((point, i) => {
            const vals = property.chartData.slice(-20).map(d => d.value)
            const h = ((point.value - Math.min(...vals)) / (Math.max(...vals) - Math.min(...vals))) * 100
            return <div key={i} className={`flex-1 rounded-sm ${isPositive ? "bg-green-400" : "bg-red-400"} opacity-70`} style={{ height: `${Math.max(h, 8)}%` }} />
          })}
        </div>
        <div className="mb-4 grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-gray-50 p-2 text-center">
            <p className="text-xs text-gray-500">Price/Share</p>
            <p className="text-sm font-bold text-gray-900">UGX {formatCurrency(property.pricePerShare)}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-2 text-center">
            <p className="text-xs text-gray-500">Rental Yield</p>
            <p className="text-sm font-bold text-green-600">{property.rentalYield}%</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-2 text-center">
            <p className="text-xs text-gray-500">Area Score</p>
            <p className="text-sm font-bold text-gray-900">{property.areaScore}/100</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-1 font-semibold ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? <ArrowTrendingUpIcon className="h-4 w-4" /> : <ArrowTrendingDownIcon className="h-4 w-4" />}
            <span className="text-sm">{formatPercentage(property.priceChangePercent)}</span>
          </div>
          <Button variant="primary" size="sm">Buy Now</Button>
        </div>
      </div>
    </Link>
  )
}
