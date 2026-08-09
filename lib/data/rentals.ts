import { generateChartData } from "../chart"

/* ═══════════════════════════════════════════════════════════════
   RENTAL PROPERTIES — single source of truth.

   One canonical record per property. Every page (market cards,
   income market, detail page, exchange, ticker) derives its view
   from this list, so names/prices/yields always agree.

   When the real backend lands, this module becomes an API client
   and the adapters below keep their signatures.
═══════════════════════════════════════════════════════════════ */

export type PropertyKind = "Residential" | "Commercial" | "Hotels"
export type GrowthTier = "High" | "Medium" | "Low"

export interface ActivityItem {
  icon: string
  title: string
  desc: string
  date: string
  photos?: string[]
  extra?: string
  attachment?: string
}

export interface TradeRecord {
  hash: string
  date: string
  time: string
  shares: number
  price: number
  volume: number
  status: string
}

export interface RentalProperty {
  id: string
  name: string
  location: string
  type: PropertyKind
  description?: string
  image: string
  images: string[]
  /** Total property valuation in UGX */
  currentPrice: number
  pricePerShare: number
  totalShares: number
  availableShares: number
  priceChange: number
  priceChangePercent: number
  rentalYield: number
  areaScore: number
  futureGrowth: GrowthTier
  occupancy: number
  investors: number
  status: string
  lastActivity: string
  beds: number
  baths: number
  sqm: number
  parking: number
  floors: number
  yearBuilt: number
  activityFeed: ActivityItem[]
  tradeHistory: TradeRecord[]
  chartData: { time: string; value: number }[]
}

/* monthly rental income implied by valuation × yield */
export const monthlyIncomeOf = (p: RentalProperty) =>
  Math.round((p.currentPrice * (p.rentalYield / 100)) / 12)

export const rentalProperties: RentalProperty[] = [
  {
    id: "sunrise-apartments",
    name: "Sunrise Apartments",
    location: "Kiira, Wakiso",
    type: "Residential",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=70",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=70",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=70",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=70",
    ],
    currentPrice: 245000000,
    pricePerShare: 1250,
    totalShares: 5000,
    availableShares: 3452,
    priceChange: 52,
    priceChangePercent: 4.34,
    rentalYield: 11.2,
    areaScore: 87,
    futureGrowth: "High",
    occupancy: 100,
    investors: 312,
    status: "Live",
    lastActivity: "Rent paid — Jan 2026",
    beds: 2, baths: 2, sqm: 85, parking: 1, floors: 6, yearBuilt: 2021,
    activityFeed: [
      { icon: "payment", title: "Rental Income Distributed — Jan 2026", desc: "Monthly rental income distributed to all shareholders proportionally. Yield maintained at 11.2%.", date: "Jan 30", photos: [] },
      { icon: "update", title: "100% Occupancy Maintained", desc: "All 24 units remain occupied. Tenant renewal rate 94%. New 2-year lease signed for units 301 and 412.", date: "Jan 15", photos: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=120&q=70", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=120&q=70"], extra: "+2 more" },
      { icon: "payment", title: "Rental Income Distributed — Dec 2025", desc: "Monthly rental income distributed. Annual yield 11.2%.", date: "Dec 31", photos: [] },
      { icon: "update", title: "Property Valuation Completed", desc: "Independent valuation confirms 12% value increase year-over-year. Current estimated value: UGX 274M.", date: "Dec 10", photos: [], attachment: "Download Valuation Report" },
    ],
    tradeHistory: [
      { hash: "0xe84...46ef6", date: "07.08.2026", time: "00:07", shares: 4, price: 1250, volume: 5000, status: "Sold" },
      { hash: "0x97a...1c2ee", date: "05.08.2026", time: "14:11", shares: 1, price: 1250, volume: 1250, status: "Sold" },
      { hash: "0x7dd...4eb71", date: "05.08.2026", time: "11:57", shares: 10, price: 1240, volume: 12400, status: "Sold" },
      { hash: "0x3c7...56b5b", date: "04.08.2026", time: "09:55", shares: 5, price: 1250, volume: 6250, status: "Sold" },
    ],
    chartData: generateChartData(1250, 30, "up"),
  },
  {
    id: "green-heights",
    name: "Green Heights",
    location: "Bunga, Kampala",
    type: "Residential",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=900&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=70",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=70",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=70",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=70",
    ],
    currentPrice: 184000000,
    pricePerShare: 840,
    totalShares: 5000,
    availableShares: 2800,
    priceChange: -11,
    priceChangePercent: -1.29,
    rentalYield: 9.6,
    areaScore: 81,
    futureGrowth: "Medium",
    occupancy: 96,
    investors: 201,
    status: "Live",
    lastActivity: "96% Occupied — Jan 2026",
    beds: 3, baths: 2, sqm: 110, parking: 1, floors: 8, yearBuilt: 2019,
    activityFeed: [
      { icon: "payment", title: "Rental Income Distributed — Jan 2026", desc: "Monthly income distributed. Yield at 9.6% p.a.", date: "Jan 31" },
      { icon: "update", title: "96% Occupancy — Strong Demand", desc: "One unit temporarily vacant during renovation. Expected re-let by Feb 2026.", date: "Jan 5" },
    ],
    tradeHistory: [
      { hash: "0xab1...33ef2", date: "06.08.2026", time: "13:20", shares: 2, price: 840, volume: 1680, status: "Sold" },
      { hash: "0xcc4...71ab9", date: "04.08.2026", time: "10:05", shares: 5, price: 840, volume: 4200, status: "Sold" },
    ],
    chartData: generateChartData(840, 30, "down"),
  },
  {
    id: "acacia-office-park",
    name: "Acacia Office Park",
    location: "Nakasero, Kampala",
    type: "Commercial",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=70",
      "https://images.unsplash.com/photo-1464146072230-91cabc968266?w=400&q=70",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&q=70",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=70",
    ],
    currentPrice: 420000000,
    pricePerShare: 2100,
    totalShares: 5000,
    availableShares: 1400,
    priceChange: 89,
    priceChangePercent: 4.43,
    rentalYield: 10.8,
    areaScore: 92,
    futureGrowth: "High",
    occupancy: 98,
    investors: 489,
    status: "Live",
    lastActivity: "Rent paid — Jan 2026",
    beds: 0, baths: 4, sqm: 3200, parking: 80, floors: 12, yearBuilt: 2020,
    activityFeed: [
      { icon: "payment", title: "Commercial Rent Distributed — Jan 2026", desc: "Commercial tenants' monthly rent distributed. Offices 98% leased.", date: "Jan 28" },
      { icon: "update", title: "New Anchor Tenant Signed", desc: "MTN Uganda signed a 5-year lease for floors 9–11. Expected to boost yield by 0.4%.", date: "Dec 15", attachment: "Lease Agreement Summary" },
    ],
    tradeHistory: [
      { hash: "0xf12...88ac3", date: "07.08.2026", time: "11:30", shares: 8, price: 2100, volume: 16800, status: "Sold" },
      { hash: "0xd44...22bc1", date: "05.08.2026", time: "16:45", shares: 3, price: 2100, volume: 6300, status: "Sold" },
    ],
    chartData: generateChartData(2100, 30, "up"),
  },
  {
    id: "lake-view-residences",
    name: "Lake View Residences",
    location: "Entebbe Road, Wakiso",
    type: "Hotels",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=70",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=70",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=70",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=70",
    ],
    currentPrice: 312000000,
    pricePerShare: 1680,
    totalShares: 5000,
    availableShares: 2100,
    priceChange: 43,
    priceChangePercent: 2.63,
    rentalYield: 8.9,
    areaScore: 79,
    futureGrowth: "High",
    occupancy: 94,
    investors: 156,
    status: "Live",
    lastActivity: "Revenue distributed — Jan 2026",
    beds: 2, baths: 2, sqm: 95, parking: 1, floors: 5, yearBuilt: 2022,
    activityFeed: [
      { icon: "payment", title: "Rental Income Distributed — Jan 2026", desc: "Distributions completed this month. Lake view premium driving strong rental demand.", date: "Jan 29" },
    ],
    tradeHistory: [
      { hash: "0xa91...55de4", date: "06.08.2026", time: "09:10", shares: 6, price: 1680, volume: 10080, status: "Sold" },
    ],
    chartData: generateChartData(1680, 30, "up"),
  },
  {
    id: "kololo-heights",
    name: "Kololo Heights",
    location: "Kololo, Kampala",
    type: "Residential",
    image: "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=900&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&q=70",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=70",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=70",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=70",
    ],
    currentPrice: 148000000,
    pricePerShare: 740,
    totalShares: 5000,
    availableShares: 4100,
    priceChange: 4,
    priceChangePercent: 0.54,
    rentalYield: 8.9,
    areaScore: 84,
    futureGrowth: "Medium",
    occupancy: 100,
    investors: 98,
    status: "Live",
    lastActivity: "100% Occupied",
    beds: 3, baths: 2, sqm: 130, parking: 2, floors: 4, yearBuilt: 2018,
    activityFeed: [
      { icon: "payment", title: "Rental Income Distributed — Jan 2026", desc: "Monthly income distributed to shareholders. Yield steady at 8.9% p.a.", date: "Jan 30" },
      { icon: "update", title: "Full Occupancy Renewed", desc: "All units renewed their annual leases. Zero vacancy going into 2026.", date: "Jan 8" },
    ],
    tradeHistory: [
      { hash: "0xb27...91cd0", date: "05.08.2026", time: "15:42", shares: 12, price: 740, volume: 8880, status: "Sold" },
      { hash: "0x6f3...20aa8", date: "03.08.2026", time: "10:18", shares: 3, price: 738, volume: 2214, status: "Sold" },
    ],
    chartData: generateChartData(740, 30, "volatile"),
  },
  {
    id: "naalya-business-park",
    name: "Naalya Business Park",
    location: "Naalya, Wakiso",
    type: "Commercial",
    image: "https://images.unsplash.com/photo-1464146072230-91cabc968266?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1464146072230-91cabc968266?w=900&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=70",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=70",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&q=70",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=70",
    ],
    currentPrice: 480000000,
    pricePerShare: 2400,
    totalShares: 5000,
    availableShares: 680,
    priceChange: 117,
    priceChangePercent: 5.12,
    rentalYield: 11.8,
    areaScore: 88,
    futureGrowth: "High",
    occupancy: 91,
    investors: 421,
    status: "Live",
    lastActivity: "Rent paid — Jan 2026",
    beds: 0, baths: 6, sqm: 4200, parking: 120, floors: 9, yearBuilt: 2021,
    activityFeed: [
      { icon: "payment", title: "Commercial Rent Distributed — Jan 2026", desc: "Monthly rent from 34 business tenants distributed. Yield at 11.8% p.a.", date: "Jan 28" },
      { icon: "update", title: "Two New Retail Tenants", desc: "Ground-floor retail units leased to a pharmacy and a bank branch. Occupancy now 91%.", date: "Jan 12" },
    ],
    tradeHistory: [
      { hash: "0x8e2...47fb1", date: "06.08.2026", time: "12:05", shares: 5, price: 2400, volume: 12000, status: "Sold" },
      { hash: "0x51c...09de7", date: "04.08.2026", time: "17:33", shares: 2, price: 2395, volume: 4790, status: "Sold" },
    ],
    chartData: generateChartData(2400, 30, "up"),
  },
]

export const getRentalProperty = (id: string) => rentalProperties.find(p => p.id === id)

/* ── Adapters (legacy component shapes) ─────────────────────── */

/** Income Market card shape */
export interface IncomeProperty {
  id: string
  name: string
  location: string
  type: string
  image: string
  status: string
  occupancy: number
  monthlyIncome: number
  annualYield: number
  sharePrice: number
  totalShares: number
  availableShares: number
  investors: number
  priceChange: number
  lastActivity: string
}

export const toIncomeProperty = (p: RentalProperty): IncomeProperty => ({
  id: p.id,
  name: p.name,
  location: p.location,
  type: p.type,
  image: p.image,
  status: p.status,
  occupancy: p.occupancy,
  monthlyIncome: monthlyIncomeOf(p),
  annualYield: p.rentalYield,
  sharePrice: p.pricePerShare,
  totalShares: p.totalShares,
  availableShares: p.availableShares,
  investors: p.investors,
  priceChange: p.priceChangePercent,
  lastActivity: p.lastActivity,
})

export const incomeProperties: IncomeProperty[] = rentalProperties.map(toIncomeProperty)

/** Property detail extras keyed by id (legacy shape) */
export const propertyExtras: Record<string, {
  beds: number; baths: number; sqm: number; parking: number; floors: number; yearBuilt: number
  images: string[]
  activityFeed: ActivityItem[]
  tradeHistory: TradeRecord[]
}> = Object.fromEntries(
  rentalProperties.map(p => [p.id, {
    beds: p.beds, baths: p.baths, sqm: p.sqm, parking: p.parking, floors: p.floors, yearBuilt: p.yearBuilt,
    images: p.images,
    activityFeed: p.activityFeed,
    tradeHistory: p.tradeHistory,
  }]),
)
