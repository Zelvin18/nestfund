import PortfolioPage from "@/components/portfolio/PortfolioPage"
import SignInGate from "@/components/auth/SignInGate"

export const metadata = {
  title: "Portfolio — NestFund",
  description: "Track your investment portfolio",
}

export default function Portfolio() {
  return (
    <SignInGate
      title="Your portfolio is private"
      description="Sign in to see your holdings, returns and portfolio performance. This page only ever shows your own investments."
    >
      <PortfolioPage />
    </SignInGate>
  )
}
