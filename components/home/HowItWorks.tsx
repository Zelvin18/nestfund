"use client"

import { Search, PieChart, TrendingUp, Wallet } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Discover Properties",
      description: "Browse AI-curated investment opportunities with complete market intelligence and growth projections.",
    },
    {
      icon: PieChart,
      title: "Buy Shares",
      description: "Invest from as low as UGX 50,000. Own a fraction of high-value real estate assets.",
    },
    {
      icon: TrendingUp,
      title: "Earn Returns",
      description: "Receive monthly rental income and benefit from property value appreciation over time.",
    },
    {
      icon: Wallet,
      title: "Trade & Manage",
      description: "Buy, sell, or hold your shares. Track performance in your portfolio like stocks.",
    },
  ]

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-gray-900">How NestFund Works</h2>
          <p className="text-lg text-gray-600">Real estate investing made simple in 4 steps</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-12 hidden h-0.5 w-full bg-gradient-to-r from-blue-200 to-blue-100 lg:block" />
              )}

              <div className="relative text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg">
                  <step.icon className="h-9 w-9 text-white" />
                </div>
                <div className="absolute -top-2 right-1/2 flex h-8 w-8 translate-x-1/2 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-md">
                  {index + 1}
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
