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
