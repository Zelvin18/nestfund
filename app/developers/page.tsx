import type { Metadata } from "next"
import DevelopersPage from "@/components/developers/DevelopersPage"

export const metadata: Metadata = {
  title: "For Developers — NestFund",
  description:
    "Turn your property into an investment opportunity. NestFund helps developers, landowners, and property owners prepare projects for investment and connect with thousands of investors.",
}

export default function Developers() {
  return <DevelopersPage />
}
