import { Property, MarketIntelligence } from "./types"

export const generateChartData = (base: number, points: number = 30, trend: "up" | "down" | "volatile" = "up") => {
  const data = []
  let current = base
  for (let i = 0; i < points; i++) {
    const change = trend === "up"
      ? (Math.random() * 40 - 10)
      : trend === "down"
      ? (Math.random() * 20 - 30)
      : (Math.random() * 60 - 30)
    current = Math.max(current + change, base * 0.7)
    data.push({ time: `Day ${i + 1}`, value: Math.round(current) })
  }
  return data
}

export const featuredProperties: Property[] = [
  {
    id: "sunrise-apartments",
    name: "Sunrise Apartments",
    location: "Kiira, Wakiso",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
    currentPrice: 245000000,
    pricePerShare: 1250,
    totalShares: 5000,
    availableShares: 3452,
    priceChange: 52,
    priceChangePercent: 4.34,
    rentalYield: 11.2,
    areaScore: 87,
    futureGrowth: "High",
    chartData: generateChartData(1200, 30, "up"),
  },
  {
    id: "green-heights",
    name: "Green Heights",
    location: "Bunga, Kampala",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80",
    currentPrice: 184000000,
    pricePerShare: 840,
    totalShares: 5000,
    availableShares: 2800,
    priceChange: -11,
    priceChangePercent: -1.29,
    rentalYield: 9.6,
    areaScore: 81,
    futureGrowth: "Medium",
    chartData: generateChartData(850, 30, "down"),
  },
  {
    id: "acacia-office-park",
    name: "Acacia Office Park",
    location: "Nakasero, Kampala",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
    currentPrice: 420000000,
    pricePerShare: 2100,
    totalShares: 5000,
    availableShares: 1400,
    priceChange: 89,
    priceChangePercent: 4.43,
    rentalYield: 10.8,
    areaScore: 92,
    futureGrowth: "High",
    chartData: generateChartData(2000, 30, "up"),
  },
  {
    id: "lake-view-residences",
    name: "Lake View Residences",
    location: "Entebbe Road, Wakiso",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
    currentPrice: 312000000,
    pricePerShare: 1680,
    totalShares: 5000,
    availableShares: 2100,
    priceChange: 43,
    priceChangePercent: 2.63,
    rentalYield: 8.9,
    areaScore: 79,
    futureGrowth: "High",
    chartData: generateChartData(1640, 30, "up"),
  },
]

export const marketIntelligence: MarketIntelligence[] = [
  {
    id: "1",
    title: "Gov't Approves New Expressway",
    type: "approval",
    location: "Entebbe – Kampala",
    impact: "Properties near corridor expected to surge",
    change: 11,
    timeAgo: "2h ago",
  },
  {
    id: "2",
    title: "New Shopping Mall Approved",
    type: "development",
    location: "Kira Town, Wakiso",
    impact: "Commercial activity boost expected in 6 months",
    change: 7,
    timeAgo: "5h ago",
  },
  {
    id: "3",
    title: "Flooding Reported in Bwaise",
    type: "decline",
    location: "Bwaise, Kampala",
    impact: "Properties in flood zone facing value risk",
    change: -8,
    timeAgo: "7h ago",
  },
]

export const marketStats = {
  marketVolume: "UGX 24.6B",
  marketVolumeChange: 4.49,
  totalInvestors: 14250,
  investorsChange: 8.32,
  activeListings: 312,
  listingsChange: 5,
  avgAnnualReturn: 8.64,
  returnChange: -1.2,
}
