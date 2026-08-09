"use client"

import { usePathname } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import MobileBottomNav from "@/components/MobileBottomNav"

export default function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

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
