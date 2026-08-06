"use client"

import { 
  CpuChipIcon,
  ChartBarSquareIcon, 
  ShieldCheckIcon, 
  BoltIcon, 
  UserGroupIcon, 
  LockClosedIcon 
} from "@heroicons/react/24/outline"

export default function WhyNestFund() {
  const features = [
    {
      icon: CpuChipIcon,
      title: "AI-Powered Intelligence",
      description: "Advanced algorithms analyze market trends, predict property values, and recommend optimal investment opportunities.",
    },
    {
      icon: ChartBarSquareIcon,
      title: "Real-Time Market Data",
      description: "Track property performance with live pricing, historical trends, and comprehensive analytics like a stock market.",
    },
    {
      icon: ShieldCheckIcon,
      title: "Secure & Regulated",
      description: "All properties are verified, legally compliant, and backed by transparent documentation and records.",
    },
    {
      icon: BoltIcon,
      title: "Instant Liquidity",
      description: "Buy and sell property shares instantly on our marketplace. No waiting months to exit your investment.",
    },
    {
      icon: UserGroupIcon,
      title: "Fractional Ownership",
      description: "Start investing with small amounts. Own premium real estate that was previously accessible only to the wealthy.",
    },
    {
      icon: LockClosedIcon,
      title: "Transparent Transactions",
      description: "Every transaction is recorded and traceable. Full visibility into rental income and property expenses.",
    },
  ]

  return (
    <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-bold text-gray-900">Why Choose NestFund?</h2>
          <p className="text-lg text-gray-600">
            The most advanced real estate investment platform in East Africa
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-100 transition hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
