import { rentalProperties, getRentalProperty } from "./rentals"
import { getConstructionProject } from "./construction"

/* ═══════════════════════════════════════════════════════════════
   EXCHANGE — secondary-market listings, ticker, and trade feed.
   Listings are DERIVED from the canonical property/project records
   so names and base prices always agree; only market premiums and
   order-book depth live here.
═══════════════════════════════════════════════════════════════ */

export const exchangeStats = {
  monthlyVolume: "UGX 18.5B",
  avgSellTime: "38 min",
  participants: 892,
  totalListings: 47,
}

export type MarketType = "income" | "construction"

export interface ExchangeListing {
  id: string
  name: string
  location: string
  type: string
  image: string
  propertyValue: number
  currentSharePrice: number
  originalSharePrice: number
  priceChange: number
  apr: number
  occupancy: number | null
  availableBuyShares: number
  availableSellShares: number
  lastTradePrice: number
  lastTradeTime: string
  marketType: MarketType
}

/* market state per listing: current secondary-market price + depth */
const listingBook: Array<{
  id: string
  marketType: MarketType
  currentSharePrice: number
  availableBuyShares: number
  availableSellShares: number
  lastTradePrice: number
  lastTradeTime: string
}> = [
  { id: "sunrise-apartments",   marketType: "income",       currentSharePrice: 1290, availableBuyShares: 1427, availableSellShares: 342, lastTradePrice: 1285, lastTradeTime: "2 min ago" },
  { id: "kololo-towers-ii",     marketType: "construction", currentSharePrice: 5450, availableBuyShares: 890,  availableSellShares: 156, lastTradePrice: 5440, lastTradeTime: "12 min ago" },
  { id: "acacia-office-park",   marketType: "income",       currentSharePrice: 2140, availableBuyShares: 1369, availableSellShares: 201, lastTradePrice: 2135, lastTradeTime: "5 min ago" },
  { id: "naalya-business-park", marketType: "income",       currentSharePrice: 2455, availableBuyShares: 620,  availableSellShares: 450, lastTradePrice: 2450, lastTradeTime: "18 min ago" },
]

export const exchangeListings: ExchangeListing[] = listingBook.map(book => {
  if (book.marketType === "income") {
    const p = getRentalProperty(book.id)!
    return {
      ...book,
      name: p.name,
      location: p.location,
      type: p.type,
      image: p.image,
      propertyValue: p.currentPrice,
      originalSharePrice: p.pricePerShare,
      priceChange: Math.round(((book.currentSharePrice - p.pricePerShare) / p.pricePerShare) * 10000) / 100,
      apr: p.rentalYield,
      occupancy: p.occupancy,
    }
  }
  const c = getConstructionProject(book.id)!
  return {
    ...book,
    name: c.name,
    location: c.location,
    type: "Construction",
    image: c.image,
    propertyValue: c.projectCost,
    originalSharePrice: c.sharePriceStart,
    priceChange: Math.round(((book.currentSharePrice - c.sharePriceStart) / c.sharePriceStart) * 10000) / 100,
    apr: c.projectedYield,
    occupancy: null,
  }
})

/* ── P2P sell offers — individual investors' listings ─────────
   Demo records give the order book depth until real listings
   exist in the database (supabase/exchange-v2.sql). */

export interface ShareOffer {
  id: string
  assetId: string
  sellerId?: string        // real user id when the listing is live in the DB
  sellerName: string
  units: number
  pricePerShare: number
  listedAgo: string
  demo?: boolean
}

export const demoSellOffers: ShareOffer[] = [
  { id: "offer-sunrise-1",  assetId: "sunrise-apartments",   sellerName: "James K.",  units: 180, pricePerShare: 1290, listedAgo: "14 min ago", demo: true },
  { id: "offer-sunrise-2",  assetId: "sunrise-apartments",   sellerName: "Amina N.",  units: 92,  pricePerShare: 1275, listedAgo: "1 h ago",    demo: true },
  { id: "offer-sunrise-3",  assetId: "sunrise-apartments",   sellerName: "Peter M.",  units: 70,  pricePerShare: 1305, listedAgo: "3 h ago",    demo: true },
  { id: "offer-kololo-1",   assetId: "kololo-towers-ii",     sellerName: "Grace T.",  units: 60,  pricePerShare: 5450, listedAgo: "25 min ago", demo: true },
  { id: "offer-kololo-2",   assetId: "kololo-towers-ii",     sellerName: "David O.",  units: 96,  pricePerShare: 5420, listedAgo: "2 h ago",    demo: true },
  { id: "offer-acacia-1",   assetId: "acacia-office-park",   sellerName: "Sarah L.",  units: 140, pricePerShare: 2140, listedAgo: "8 min ago",  demo: true },
  { id: "offer-acacia-2",   assetId: "acacia-office-park",   sellerName: "Brian S.",  units: 61,  pricePerShare: 2120, listedAgo: "5 h ago",    demo: true },
  { id: "offer-naalya-1",   assetId: "naalya-business-park", sellerName: "Joan A.",   units: 250, pricePerShare: 2455, listedAgo: "42 min ago", demo: true },
  { id: "offer-naalya-2",   assetId: "naalya-business-park", sellerName: "Moses W.",  units: 200, pricePerShare: 2430, listedAgo: "1 d ago",    demo: true },
]

/* ── Live ticker (homepage) — derived from canonical rentals ── */
export interface TickerItem {
  name: string
  price: number
  change: number
  img: string
}

export const tickerItems: TickerItem[] = rentalProperties
  .filter(p => p.status === "Live")
  .map(p => ({
    name: p.name,
    price: p.pricePerShare,
    change: p.priceChangePercent,
    img: p.image.replace("w=600", "w=56&h=56&fit=crop"),
  }))

/* ── Recent-trades feed (Exchange sidebar) ── */
export const traderNames = ["James K.", "Amina N.", "David O.", "Grace T.", "Peter M.", "Sarah L.", "Brian S.", "Joan A.", "Moses W.", "Diana R."]

export const tradeTargets = exchangeListings.map(l => ({ name: l.name, price: l.currentSharePrice }))
