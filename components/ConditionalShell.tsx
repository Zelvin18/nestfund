"use client"

import { usePathname } from "next/navigation"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import MobileBottomNav from "@/components/MobileBottomNav"

export default function ConditionalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Landing page "/" gets its own nav/footer built-in
  const isLanding = pathname === "/"

  return (
    <>
      {!isLanding && <Navbar />}
      {children}
      {!isLanding && <Footer />}
      <MobileBottomNav />
    </>
  )
}
