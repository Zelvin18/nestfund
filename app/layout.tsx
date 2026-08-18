import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ConditionalShell from "@/components/ConditionalShell"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NestFund — Put Your Money to Work",
  description:
    "Invest from UGX 50,000 in verified opportunities across contracts, businesses, productive assets and real estate. NestFund is the investment marketplace for East Africa.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ backgroundColor: "#fff", margin: 0, padding: 0 }}>
        <ConditionalShell>{children}</ConditionalShell>
      </body>
    </html>
  )
}
