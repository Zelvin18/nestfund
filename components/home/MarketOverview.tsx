"use client"

import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  UsersIcon, 
  ListBulletIcon, 
  CurrencyDollarIcon 
} from "@heroicons/react/24/outline"
import { formatPercentage } from "@/lib/utils"
import { marketStats } from "@/lib/mockData"

export default function MarketOverview() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold text-gray-900">Live Market Overview</h2>
          <p className="text-lg text-gray-600">Real-time market statistics and performance</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Market Volume"
            value={marketStats.marketVolume}
            change={marketStats.marketVolumeChange}
            icon={ArrowTrendingUpIcon}
            description="Total 24H Trading"
          />
          <StatCard
            title="Total Investors"
            value={marketStats.totalInvestors.toLocaleString()}
            change={marketStats.investorsChange}
            icon={UsersIcon}
            description="Active Platform Users"
          />
          <StatCard
            title="Active Listings"
            value={marketStats.activeListings}
            change={marketStats.listingsChange}
            icon={ListBulletIcon}
            description="Available Properties"
          />
          <StatCard
            title="Avg. Annual Return"
            value={`${marketStats.avgAnnualReturn}%`}
            change={marketStats.returnChange}
            icon={CurrencyDollarIcon}
            description="Historical Performance"
          />
        </div>
      </div>
    </section>
  )
}

interface StatCardProps {
  title: string
  value: string | number
  change: number
  icon: React.ElementType
  description: string
}

function StatCard({ title, value, change, icon: Icon, description }: StatCardProps) {
  const isPositive = change >= 0

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
          <Icon className="h-5 w-5 text-blue-600" />
        </div>
        <div className={`flex items-center space-x-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
          isPositive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
        }`}>
          {isPositive ? (
            <ArrowTrendingUpIcon className="h-3 w-3" />
          ) : (
            <ArrowTrendingDownIcon className="h-3 w-3" />
          )}
          <span>{formatPercentage(change)}</span>
        </div>
      </div>
      <h3 className="mb-1 text-sm font-medium text-gray-600">{title}</h3>
      <p className="mb-2 text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  )
}
