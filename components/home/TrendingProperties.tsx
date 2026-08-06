"use client"

import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, MapPinIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { featuredProperties } from "@/lib/mockData"
import { formatCurrency, formatPercentage } from "@/lib/utils"

export default function TrendingProperties() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="mb-3 text-3xl font-bold text-gray-900">Trending Properties</h2>
            <p className="text-lg text-gray-600">Hot investment opportunities right now</p>
          </div>
          <Link
            href="/market"
            className="hidden text-sm font-medium text-blue-600 hover:text-blue-700 sm:block"
          >
            View All Properties →
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProperties.slice(0, 3).map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/market" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View All Properties →
          </Link>
        </div>
      </div>
    </section>
  )
}

function PropertyCard({ property }: { property: typeof featuredProperties[0] }) {
  const isPositive = property.priceChangePercent >= 0

  return (
    <Link
      href={`/property/${property.id}`}
      className="group overflow-hidden rounded-xl bg-white shadow-md ring-1 ring-gray-100 transition hover:shadow-xl"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <img
          src={property.image}
          alt={property.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute right-3 top-3">
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            property.futureGrowth === "High"
              ? "bg-green-500 text-white"
              : property.futureGrowth === "Medium"
              ? "bg-yellow-500 text-white"
              : "bg-gray-500 text-white"
          }`}>
            {property.futureGrowth} Growth
          </span>
        </div>
        <div className="absolute bottom-3 left-3 flex items-center space-x-1 text-white">
          <MapPinIcon className="h-3.5 w-3.5" />
          <span className="text-sm font-medium">{property.location}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="mb-1 text-lg font-bold text-gray-900 group-hover:text-blue-600">
              {property.name}
            </h3>
            <p className="text-sm text-gray-500">
              {property.availableShares.toLocaleString()} of {property.totalShares.toLocaleString()} shares available
            </p>
          </div>
        </div>

        {/* Mini chart */}
        <div className="mb-4 flex h-12 items-end justify-between gap-0.5 overflow-hidden rounded-md bg-gray-50 px-2 pb-1">
          {property.chartData.slice(-20).map((point, i) => {
            const minVal = Math.min(...property.chartData.slice(-20).map(d => d.value))
            const maxVal = Math.max(...property.chartData.slice(-20).map(d => d.value))
            const height = ((point.value - minVal) / (maxVal - minVal)) * 100
            return (
              <div
                key={i}
                className={`flex-1 rounded-sm ${isPositive ? "bg-green-400" : "bg-red-400"} opacity-70`}
                style={{ height: `${Math.max(height, 8)}%` }}
              />
            )
          })}
        </div>

        {/* Stats */}
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

        {/* Price change */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">24h Change:</span>
            <div className={`flex items-center space-x-1 font-semibold ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}>
              {isPositive
                ? <ArrowTrendingUpIcon className="h-4 w-4" />
                : <ArrowTrendingDownIcon className="h-4 w-4" />
              }
              <span className="text-sm">{formatPercentage(property.priceChangePercent)}</span>
            </div>
          </div>
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
            Buy Now
          </button>
        </div>
      </div>
    </Link>
  )
}
