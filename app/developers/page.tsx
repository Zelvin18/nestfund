import type { Metadata } from "next"
import DevelopersPage from "@/components/developers/DevelopersPage"

export const metadata: Metadata = {
  title: "For Businesses — NestFund",
  description:
    "Turn your business into an investment opportunity. Eligible businesses apply for contract, invoice, trade, asset and development financing — NestFund vets every application before it is listed for investors.",
}

export default function Developers() {
  return <DevelopersPage />
}
