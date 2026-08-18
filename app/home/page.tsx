import HeroSection from "@/components/home/HeroSection"
import LiveTicker from "@/components/home/LiveTicker"
import MarketOverview from "@/components/home/MarketOverview"
import TrendingProperties from "@/components/home/TrendingProperties"
import { ComingSoonSection } from "@/components/comingsoon/ComingSoon"
import MarketIntelligenceSection from "@/components/home/MarketIntelligence"
import HowItWorks from "@/components/home/HowItWorks"
import WhyNestFund from "@/components/home/WhyNestFund"
import CTASection from "@/components/home/CTASection"

export const metadata = { title: "NestFund — Live Market" }

export default function AppHome() {
  return (
    <main>
      <HeroSection />
      <LiveTicker />
      <MarketOverview />
      <TrendingProperties />
      <ComingSoonSection />
      <MarketIntelligenceSection />
      <HowItWorks />
      <WhyNestFund />
      <CTASection />
    </main>
  )
}
