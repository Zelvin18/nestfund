import type { Metadata } from "next"
import OnboardingPage from "@/components/onboarding/OnboardingPage"

export const metadata: Metadata = {
  title: "Get Started — NestFund",
  description: "Set up your NestFund account in three quick steps: verify your identity, fund your wallet, and make your first investment.",
}

export default function Onboarding() {
  return <OnboardingPage />
}
