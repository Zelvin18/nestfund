import type { Metadata } from "next"
import ComingSoonPage from "@/components/comingsoon/ComingSoonPage"

export const metadata: Metadata = {
  title: "Coming Soon — NestFund",
  description: "Upcoming properties open when enough investors reserve interest. Reserve priority access and invest before everyone else.",
}

export default function ComingSoon() {
  return <ComingSoonPage />
}
