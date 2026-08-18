import type { Metadata } from "next"
import ApplyPage from "@/components/developers/ApplyPage"

export const metadata: Metadata = {
  title: "Apply for Funding — NestFund",
  description: "Apply for contract, invoice, trade, asset or development financing. NestFund vets every application before listing it for investors.",
}

export default function Apply() {
  return <ApplyPage />
}
