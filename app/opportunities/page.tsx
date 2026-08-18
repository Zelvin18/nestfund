import type { Metadata } from "next"
import OpportunitiesPage from "@/components/opportunities/OpportunitiesPage"

export const metadata: Metadata = {
  title: "Explore Opportunities — NestFund",
  description: "Discover verified investment opportunities across contracts, trade, productive assets and real estate.",
}

export default function Page() {
  return <OpportunitiesPage />
}
