import type { Metadata } from "next"
import DeveloperDashboard from "@/components/developers/DeveloperDashboard"

export const metadata: Metadata = {
  title: "Developer Dashboard — NestFund",
  description: "Track your project applications, verification progress, funding, and investor interest.",
}

export default function Dashboard() {
  return <DeveloperDashboard />
}
