import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NestFund — The Real Estate Investment Market",
  description:
    "Buy shares of verified properties, earn monthly rental income, and trade real estate like stocks. NestFund is the financial intelligence layer for property investment.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900 antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
