import type { ActivityItem, TradeRecord } from "./rentals"

/* ═══════════════════════════════════════════════════════════════
   CONSTRUCTION PROJECTS — single source of truth.
   Used by the Construction Market list, project detail pages,
   and the Exchange. `image` is the card thumbnail; `images` the
   full detail-page gallery.
═══════════════════════════════════════════════════════════════ */

export interface ConstructionProject {
  id: string
  name: string
  location: string
  developer: string
  image: string
  images: string[]
  projectCost: number
  developerInvestment: number
  capitalNeeded: number
  capitalRaised: number
  fundingProgress: number
  constructionProgress: number
  expectedCompletion: string
  projectedYield: number
  projectedROI: number
  sharePrice: number
  sharePriceStart: number
  sharePriceAtCompletion: number
  estimatedPropertyValue: number
  totalShares: number
  availableShares: number
  investors: number
  stage: string
  stageColor: string
  beds: number
  baths: number
  sqm: number
  type: string
  status: string
}

export const constructionProjects: ConstructionProject[] = [
  {
    id: "ibis-residences-ii",
    name: "Ibis Residences Phase II",
    location: "Kiira, Wakiso",
    developer: "Ibis Properties Ltd",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=70",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&q=70",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=70",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=70",
    ],
    projectCost: 10000000000,
    developerInvestment: 3000000000,
    capitalNeeded: 7000000000,
    capitalRaised: 2940000000,
    fundingProgress: 42,
    constructionProgress: 0,
    expectedCompletion: "June 2028",
    projectedYield: 13.2,
    projectedROI: 38.5,
    sharePrice: 4200,
    sharePriceStart: 3500,
    sharePriceAtCompletion: 4800,
    estimatedPropertyValue: 12500000000,
    totalShares: 5000,
    availableShares: 2900,
    investors: 131,
    stage: "Construction funding",
    stageColor: "#f59e0b",
    beds: 3, baths: 2, sqm: 120, type: "Residential", status: "Under Construction",
  },
  {
    id: "kololo-towers-ii",
    name: "Kololo Towers Phase II",
    location: "Kololo, Kampala",
    developer: "Skyline Developers",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&q=70",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=70",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=70",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=70",
    ],
    projectCost: 25000000000,
    developerInvestment: 8000000000,
    capitalNeeded: 17000000000,
    capitalRaised: 9520000000,
    fundingProgress: 56,
    constructionProgress: 15,
    expectedCompletion: "March 2027",
    projectedYield: 11.8,
    projectedROI: 26.3,
    sharePrice: 5450,
    sharePriceStart: 5200,
    sharePriceAtCompletion: 6800,
    estimatedPropertyValue: 32000000000,
    totalShares: 5000,
    availableShares: 2200,
    investors: 289,
    stage: "Construction funding",
    stageColor: "#f59e0b",
    beds: 0, baths: 0, sqm: 2800, type: "Commercial", status: "Foundation Stage",
  },
  {
    id: "naalya-eco-park",
    name: "Naalya Eco Business Park",
    location: "Naalya, Wakiso",
    developer: "GreenBuild Africa",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&q=80",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=70",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=70",
      "https://images.unsplash.com/photo-1464146072230-91cabc968266?w=400&q=70",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=70",
    ],
    projectCost: 8500000000,
    developerInvestment: 2500000000,
    capitalNeeded: 6000000000,
    capitalRaised: 4794000000,
    fundingProgress: 79.9,
    constructionProgress: 32,
    expectedCompletion: "December 2026",
    projectedYield: 12.5,
    projectedROI: 43.5,
    sharePrice: 3200,
    sharePriceStart: 2800,
    sharePriceAtCompletion: 4020,
    estimatedPropertyValue: 11000000000,
    totalShares: 5000,
    availableShares: 1005,
    investors: 275,
    stage: "Construction funding",
    stageColor: "#f59e0b",
    beds: 0, baths: 0, sqm: 4500, type: "Commercial", status: "32% Built",
  },
  {
    id: "muyenga-hillside",
    name: "Muyenga Hillside Villas",
    location: "Muyenga, Kampala",
    developer: "Hill Estates Ltd",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=900&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=70",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=70",
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=70",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=70",
    ],
    projectCost: 6000000000,
    developerInvestment: 2000000000,
    capitalNeeded: 4000000000,
    capitalRaised: 2080000000,
    fundingProgress: 52,
    constructionProgress: 5,
    expectedCompletion: "September 2027",
    projectedYield: 10.9,
    projectedROI: 31.7,
    sharePrice: 2350,
    sharePriceStart: 2200,
    sharePriceAtCompletion: 3100,
    estimatedPropertyValue: 7800000000,
    totalShares: 5000,
    availableShares: 2400,
    investors: 164,
    stage: "Initial funding",
    stageColor: "#2563eb",
    beds: 4, baths: 3, sqm: 280, type: "Residential", status: "Initial Stage",
  },
]

export const getConstructionProject = (id: string) => constructionProjects.find(p => p.id === id)

/* Shared mock feeds shown on every project detail page */
export const constructionTradeHistory: TradeRecord[] = [
  { hash: "0xe84...46ef6", date: "07.08.2026", time: "00:07", shares: 4, price: 4200, volume: 16800, status: "Sold" },
  { hash: "0x97a...1c2ee", date: "05.08.2026", time: "14:11", shares: 1, price: 4200, volume: 4200, status: "Sold" },
  { hash: "0x7dd...4eb71", date: "05.08.2026", time: "11:57", shares: 6, price: 4180, volume: 25080, status: "Sold" },
  { hash: "0x3c7...56b5b", date: "05.08.2026", time: "11:55", shares: 2, price: 4200, volume: 8400, status: "Sold" },
  { hash: "0x1cc...4ce97", date: "04.08.2026", time: "18:22", shares: 10, price: 4150, volume: 41500, status: "Sold" },
]

export const constructionActivityFeed: ActivityItem[] = [
  {
    icon: "report",
    title: "Construction Report — August 2026",
    desc: "Foundation work completed. Structural steel installation begins next week. Project on schedule.",
    date: "Aug 5",
    photos: [
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=120&q=70",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=120&q=70",
    ],
    extra: "+4 more",
    attachment: "Developer Interview — Progress Update",
  },
  {
    icon: "payment",
    title: "Construction Funds Released — Tranche 2",
    desc: "UGX 980M released from escrow following independent engineering milestone verification.",
    date: "Jul 15",
    photos: [],
  },
  {
    icon: "report",
    title: "Construction Report — July 2026",
    desc: "Site clearing complete. Foundation excavation 60% done. Drone footage available.",
    date: "Jul 1",
    photos: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=120&q=70",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=120&q=70",
    ],
    extra: "+3 more",
  },
]
