/* ═══════════════════════════════════════════════════════════════
   MOCK DATA BARREL

   All entity data now lives in lib/data/* as a single source of
   truth — one canonical record per property/project, with thin
   adapters for each page's display shape. This file re-exports
   everything so existing imports keep working.

   To swap in the real backend: replace the lib/data modules with
   API clients returning the same shapes.
═══════════════════════════════════════════════════════════════ */

export { generateChartData, generatePriceSeries } from "./chart"

export {
  rentalProperties,
  rentalProperties as featuredProperties,
  getRentalProperty,
  incomeProperties,
  propertyExtras,
  monthlyIncomeOf,
  type RentalProperty,
  type IncomeProperty,
  type ActivityItem,
  type TradeRecord,
  type PropertyKind,
  type GrowthTier,
} from "./data/rentals"

export {
  constructionProjects,
  getConstructionProject,
  constructionTradeHistory,
  constructionActivityFeed,
  type ConstructionProject,
} from "./data/construction"

export {
  exchangeStats,
  exchangeListings,
  tickerItems,
  traderNames,
  tradeTargets,
  type ExchangeListing,
  type MarketType,
  type TickerItem,
} from "./data/exchange"

export {
  mockPortfolio,
  walletTransactions,
  walletIncomeSeries,
  initialPayMethods,
  walletBalances,
  type PortfolioHolding,
  type WalletTransaction,
  type TransactionType,
  type MethodKind,
  type PayMethod,
} from "./data/portfolio"

export {
  intelligenceFeed,
  marketIntelligence,
  marketStats,
  type IntelligenceItem,
  type IntelType,
} from "./data/intelligence"
