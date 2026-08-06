import HeroSection from "@/components/home/HeroSection"
import LiveTicker from "@/components/home/LiveTicker"
import MarketOverview from "@/components/home/MarketOverview"
import TrendingProperties from "@/components/home/TrendingProperties"
import MarketIntelligenceSection from "@/components/home/MarketIntelligence"
import HowItWorks from "@/components/home/HowItWorks"
import WhyNestFund from "@/components/home/WhyNestFund"
import CTASection from "@/components/home/CTASection"

export default function Home() {
  return (
    <main>
      <HeroSection />
      <LiveTicker />
      <MarketOverview />
      <TrendingProperties />
      <MarketIntelligenceSection />
      <HowItWorks />
      <WhyNestFund />
      <CTASection />
    </main>
  )
}
