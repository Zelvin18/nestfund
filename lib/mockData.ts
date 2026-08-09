import { Property, MarketIntelligence } from "./types"

/* Deterministic PRNG — charts stay identical across reloads instead of
   re-rolling random walks on every render */
const mulberry32 = (seed: number) => () => {
  seed |= 0
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const hashSeed = (s: string) => {
  let h = 9
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 387420489)
  return h
}

/**
 * Price series that tells a coherent story: starts at endPrice/(1+drift%),
 * trends smoothly toward endPrice with seeded noise, and ends exactly at
 * endPrice so the chart always agrees with the displayed share price.
 */
export const generatePriceSeries = (
  seedKey: string,
  endPrice: number,
  points: number,
  totalDriftPct: number,
  labelFor: (i: number, points: number) => string,
) => {
  const rand = mulberry32(hashSeed(seedKey) + points * 7919)
  const start = endPrice / (1 + totalDriftPct / 100)
  const data: { time: string; value: number }[] = []
  let wobble = 0
  for (let i = 0; i < points; i++) {
    const progress = points === 1 ? 1 : i / (points - 1)
    const target = start * Math.pow(endPrice / start, progress)
    // Mean-reverting wobble keeps the line organic without drifting off-story
    wobble = wobble * 0.55 + (rand() - 0.5) * 0.035
    const value = i === points - 1 ? endPrice : target * (1 + wobble)
    data.push({ time: labelFor(i, points), value: Math.round(value) })
  }
  return data
}

/* Legacy generator (cards/sparklines) — now seeded so it's stable */
export const generateChartData = (base: number, points: number = 30, trend: "up" | "down" | "volatile" = "up") => {
  const drift = trend === "up" ? 8 : trend === "down" ? -5 : 2
  return generatePriceSeries(`legacy-${base}-${trend}`, base, points, drift, i => `Day ${i + 1}`)
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
