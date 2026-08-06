"use client"

import Link from "next/link"
import { ArrowRightIcon, ShieldCheckIcon, BoltIcon } from "@heroicons/react/24/outline"
import { ArrowTrendingUpIcon, CheckBadgeIcon } from "@heroicons/react/24/solid"
import { Button } from "@/components/ui/Button"

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-28">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-100 opacity-30 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left copy */}
          <div>
            <div className="mb-4 inline-flex items-center space-x-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 ring-1 ring-blue-200">
              <BoltIcon className="h-4 w-4" />
              <span>The Real Estate Investment Market</span>
            </div>

            <h1 className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-gray-900 lg:text-6xl">
              Invest in Real Estate.
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Own the Future.
              </span>
            </h1>

            <p className="mb-8 text-xl leading-relaxed text-gray-600">
              Buy shares of verified properties, earn monthly rental income, and trade real estate like stocks.
              NestFund is the financial intelligence layer for property investment.
            </p>

            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Link href="/market">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Start Investing
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/market">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore Properties
                </Button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-500">Secure & Regulated</span>
              </div>
              <div className="flex items-center space-x-2">
                <ArrowTrendingUpIcon className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-500">Avg. 8.6% Annual Return</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-sm text-gray-500">14,250+ Active Investors</span>
              </div>
            </div>
          </div>

          {/* Right — live property card */}
          <div className="relative">
            <LivePropertyCard />
          </div>
        </div>
      </div>
    </section>
  )
}

function LivePropertyCard() {
  return (
    <div className="relative mx-auto max-w-md">
      {/* Floating metric cards */}
      <div className="absolute -left-8 top-10 z-10 rounded-xl bg-white p-3 shadow-lg ring-1 ring-gray-100">
        <p className="text-xs text-gray-500">Portfolio Value</p>
        <p className="text-lg font-bold text-gray-900">UGX 14.8M</p>
        <p className="flex items-center text-xs font-medium text-green-600">
          <ArrowTrendingUpIcon className="mr-1 h-3 w-3" />
          +4.62% Today
        </p>
      </div>

      <div className="absolute -right-8 bottom-24 z-10 rounded-xl bg-white p-3 shadow-lg ring-1 ring-gray-100">
        <p className="text-xs text-gray-500">Monthly Income</p>
        <p className="text-lg font-bold text-gray-900">UGX 185K</p>
        <p className="text-xs text-green-600 font-medium">Rental yield</p>
      </div>

      {/* Main card */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200">
        <div className="relative h-52 bg-gray-100">
          <img
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80"
            alt="Sunrise Apartments"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-4 left-4">
            <span className="inline-flex items-center gap-1 rounded-full bg-green-500 px-2.5 py-1 text-xs font-semibold text-white">
              <CheckBadgeIcon className="h-3.5 w-3.5" />
              Verified Property
            </span>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Sunrise Apartments</h3>
              <p className="text-sm text-gray-500">Kiira, Wakiso</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-gray-900">UGX 1,250</p>
              <p className="flex items-center justify-end gap-1 text-sm font-medium text-green-600">
                <ArrowTrendingUpIcon className="h-4 w-4" />
                +8.43% Today
              </p>
            </div>
          </div>

          {/* Sparkline */}
          <div className="my-4 flex h-16 items-end justify-between gap-0.5 overflow-hidden rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 px-2 pb-2">
            {[30, 45, 38, 52, 48, 60, 55, 70, 65, 80, 75, 88, 85, 92, 96].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm bg-blue-400 opacity-70"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-gray-50 p-2">
              <p className="text-xs text-gray-500">Rental Yield</p>
              <p className="text-sm font-bold text-gray-900">11.2%</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-2">
              <p className="text-xs text-gray-500">Area Score</p>
              <p className="text-sm font-bold text-gray-900">87/100</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-2">
              <p className="text-xs text-gray-500">Growth</p>
              <p className="text-sm font-bold text-green-600">High</p>
            </div>
          </div>

          <button className="mt-4 w-full rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700">
            Buy Shares — UGX 1,250/share
          </button>
        </div>
      </div>
    </div>
  )
}
