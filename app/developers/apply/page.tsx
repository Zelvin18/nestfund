import type { Metadata } from "next"
import ApplyPage from "@/components/developers/ApplyPage"

export const metadata: Metadata = {
  title: "Submit Your Project — NestFund",
  description: "Apply to list your land, property, or development project on NestFund and connect with investors.",
}

export default function Apply() {
  return <ApplyPage />
}
