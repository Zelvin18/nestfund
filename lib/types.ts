export interface Property {
  id: string
  name: string
  location: string
  image: string
  currentPrice: number
  pricePerShare: number
  totalShares: number
  availableShares: number
  priceChange: number
  priceChangePercent: number
  rentalYield: number
  areaScore: number
  futureGrowth: "High" | "Medium" | "Low"
  chartData: { time: string; value: number }[]
}

export interface MarketIntelligence {
  id: string
  title: string
  type: "approval" | "development" | "decline"
  location: string
  impact: string
  change: number
  timeAgo: string
}

export interface PortfolioItem {
  id: string
  propertyName: string
  image: string
  shares: number
  currentValue: number
  invested: number
  change: number
  changePercent: number
}
