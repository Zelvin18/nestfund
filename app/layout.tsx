import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import ConditionalShell from "@/components/ConditionalShell"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NestFund — Own Real Estate. Earn Monthly. Trade Anytime.",
  description:
    "Buy shares of verified properties from UGX 50,000. Earn monthly rental income. Trade anytime. NestFund is the real estate investment market for East Africa.",
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
