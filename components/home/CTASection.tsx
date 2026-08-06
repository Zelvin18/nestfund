"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/Button"

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-blue-600 py-20">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-blue-500 opacity-40 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-indigo-500 opacity-40 blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mb-4 text-4xl font-extrabold text-white lg:text-5xl">
          Start Building Wealth
          <br />
          Through Real Estate
        </h2>
        <p className="mb-8 text-xl text-blue-100">
          Join 14,000+ investors already earning passive income from property shares.
          Start with as little as UGX 50,000.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/auth/register">
            <Button size="lg" className="w-full bg-white text-blue-600 hover:bg-blue-50 sm:w-auto">
              Create Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/market">
            <Button size="lg" variant="outline" className="w-full border-white text-white hover:bg-white/10 sm:w-auto">
              Browse Properties
            </Button>
          </Link>
        </div>

        <p className="mt-6 text-sm text-blue-200">
          No hidden fees. Secure & regulated. Cancel anytime.
        </p>
      </div>
    </section>
  )
}
