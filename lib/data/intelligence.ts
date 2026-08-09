import { MarketIntelligence } from "../types"

/* ═══════════════════════════════════════════════════════════════
   MARKET INTELLIGENCE + PLATFORM STATS
═══════════════════════════════════════════════════════════════ */

export type IntelType = "approval" | "development" | "decline"

export interface IntelligenceItem {
  id: string
  type: IntelType
  category: string
  title: string
  location: string
  affectedProps: number
  desc: string
  change: number
  timeAgo: string
  image: string
  sourceLabel: string
  sourceUrl: string
}

export const intelligenceFeed: IntelligenceItem[] = [
  {
    id: "1",
    type: "approval",
    category: "GOVT. APPROVAL",
    title: "Gov't Approves New Expressway",
    location: "Entebbe – Kampala",
    affectedProps: 312,
    desc: "Properties along the 51km corridor expected to see significant value appreciation. New access roads open 3 untapped residential zones.",
    change: 11,
    timeAgo: "2h ago",
    image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=600&q=70",
    sourceLabel: "Uganda National Roads Authority",
    sourceUrl: "https://www.unra.go.ug",
  },
  {
    id: "2",
    type: "development",
    category: "DEVELOPMENT",
    title: "New Shopping Mall Approved",
    location: "Kira Town, Wakiso",
    affectedProps: 89,
    desc: "Commercial activity boost expected within 6 months. Nearby residential properties historically increase 7–12% after mall construction.",
    change: 7,
    timeAgo: "5h ago",
    image: "https://images.unsplash.com/photo-1586864387789-628af9feed72?w=600&q=70",
    sourceLabel: "Wakiso District Council",
    sourceUrl: "#",
  },
  {
    id: "3",
    type: "decline",
    category: "RISK ALERT",
    title: "Flooding Reported in Bwaise",
    location: "Bwaise, Kampala",
    affectedProps: 47,
    desc: "High-risk flood zone alert. Properties in low-lying areas facing devaluation risk. Insurance premiums expected to rise.",
    change: -8,
    timeAgo: "7h ago",
    image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&q=70",
    sourceLabel: "KCCA Flood Risk Report",
    sourceUrl: "#",
  },
  {
    id: "4",
    type: "development",
    category: "DEVELOPMENT",
    title: "New University Campus Planned",
    location: "Nansana, Wakiso",
    affectedProps: 134,
    desc: "Student housing demand expected to surge. Purpose-built student accommodation currently under-supplied in this corridor.",
    change: 15,
    timeAgo: "12h ago",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=70",
    sourceLabel: "Ministry of Education Uganda",
    sourceUrl: "#",
  },
  {
    id: "5",
    type: "decline",
    category: "RISK ALERT",
    title: "Property Tax Increase in Kololo",
    location: "Kololo, Kampala",
    affectedProps: 28,
    desc: "Local council approved 12% property tax increase. Net rental yields in the area may decrease by 0.5–1.2% for investors.",
    change: -4,
    timeAgo: "1d ago",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=70",
    sourceLabel: "Kampala Capital City Authority",
    sourceUrl: "#",
  },
  {
    id: "6",
    type: "approval",
    category: "GOVT. APPROVAL",
    title: "New Industrial Park Approved",
    location: "Namanve, Mukono",
    affectedProps: 201,
    desc: "20,000+ workers expected to relocate to the area. Worker housing demand rising. Strong buy signal for budget residential.",
    change: 9,
    timeAgo: "2d ago",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=70",
    sourceLabel: "Uganda Investment Authority",
    sourceUrl: "#",
  },
]

/* Compact preview used on the homepage — derived from the full feed */
export const marketIntelligence: MarketIntelligence[] = intelligenceFeed.slice(0, 3).map(i => ({
  id: i.id,
  title: i.title,
  type: i.type,
  location: i.location,
  impact: i.desc.split(".")[0],
  change: i.change,
  timeAgo: i.timeAgo,
}))

/* Platform-wide stats (homepage market overview) */
export const marketStats = {
  marketVolume: "UGX 24.6B",
  marketVolumeChange: 4.49,
  totalInvestors: 14250,
  investorsChange: 8.32,
  activeListings: 47,
  listingsChange: 5,
  avgAnnualReturn: 8.64,
  returnChange: -1.2,
}
