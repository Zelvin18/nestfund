"use client"

import Link from "next/link"
import { Search, Bell, User, Wallet } from "lucide-react"
import { Button } from "./ui/Button"

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <span className="text-lg font-bold text-white">N</span>
            </div>
            <span className="text-xl font-bold text-gray-900">NestFund</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden items-center space-x-8 md:flex">
            <Link href="/market" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Market
            </Link>
            <Link href="/portfolio" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Portfolio
            </Link>
            <Link href="/intelligence" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Intelligence
            </Link>
            <Link href="/about" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              About
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden flex-1 max-w-lg mx-8 lg:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search properties, locations..."
                className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <button className="rounded-lg p-2 hover:bg-gray-100">
              <Bell className="h-5 w-5 text-gray-600" />
            </button>
            <button className="flex items-center space-x-2 rounded-lg border border-gray-200 px-3 py-2 hover:bg-gray-50">
              <Wallet className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">UGX 0</span>
            </button>
            <Button variant="primary" size="sm">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
