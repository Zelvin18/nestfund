"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import MobileBottomNav from "@/components/MobileBottomNav"

export default function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Every page opens from the very top. The html-level smooth scrolling
  // (kept for in-page anchors) otherwise animates/misses Next's reset,
  // leaving new pages showing mid-scroll below the navigation.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [pathname])

  // Pages with their own chrome: landing has a built-in nav/footer,
  // auth and onboarding are focused full-screen flows, admin has its own shell
  const bare =
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/admin")

  // Landing keeps the mobile bottom nav for quick access to the markets;
  // auth/onboarding flows stay fully focused
  const hideBottomNav = pathname.startsWith("/auth") || pathname.startsWith("/onboarding") || pathname.startsWith("/admin")

  return (
    <>
      {!bare && <Navbar />}
      {children}
      {!bare && <Footer />}
      {!hideBottomNav && <MobileBottomNav />}
    </>
  )
}
