/* ═══════════════════════════════════════════════════════════════
   OPPORTUNITIES — the NestFund 2.0 core model.

   An Opportunity is anything investors can put capital into:
   a contract, an invoice, a trade, an asset, a property, or a
   future stable product. Property records stay in their own
   canonical files (rentals/construction) and are adapted into
   this shape at the hook layer, so nothing existing breaks.

   Demo records below are SAMPLE DATA for development — every one
   carries `demo: true` and the UI labels them as demonstrations.
   Never present them as real investments.
═══════════════════════════════════════════════════════════════ */

import type { RentalProperty } from "./rentals"
import type { ConstructionProject } from "./construction"

export type OpportunityCategory = "cashflow" | "growth" | "assets" | "property" | "stable"

export type RiskLevel = "Lower" | "Moderate" | "Higher"

export type OpportunityStatus =
  | "Coming Soon"
  | "Open"
  | "Almost Funded"
  | "Fully Funded"
  | "Active"
  | "Repayment"
  | "Completed"
  | "Cancelled"

export interface CategoryMeta {
  key: OpportunityCategory
  label: string
  tagline: string
  description: string
  duration: string
  risk: string
  accent: string     // primary color for chips, buttons, progress
  accentBg: string   // soft background for chips/tiles
  examples: string[]
  comingSoon?: boolean
}

/** The five investment categories — single source of truth for colors and copy */
export const CATEGORIES: CategoryMeta[] = [
  {
    key: "cashflow",
    label: "Cashflow",
    tagline: "Short-term opportunities",
    description: "Contract, invoice and purchase-order financing designed to put capital to work faster.",
    duration: "30–180 days",
    risk: "Moderate",
    accent: "#0d9488",
    accentBg: "#f0fdfa",
    examples: ["Contract financing", "Invoice financing", "LPO financing"],
  },
  {
    key: "growth",
    label: "Growth",
    tagline: "Business & trade opportunities",
    description: "Back productive businesses and transactions — commodity trade, inventory and working capital.",
    duration: "3–12 months",
    risk: "Moderate–Higher",
    accent: "#16a34a",
    accentBg: "#f0fdf4",
    examples: ["Commodity trade", "Working capital", "Trade finance"],
  },
  {
    key: "assets",
    label: "Assets",
    tagline: "Income-producing physical assets",
    description: "Trucks, machinery and equipment designed to generate recurring cash flow.",
    duration: "1–3 years",
    risk: "Moderate",
    accent: "#d97706",
    accentBg: "#fffbeb",
    examples: ["Trucks & logistics", "Construction equipment", "Solar equipment"],
  },
  {
    key: "property",
    label: "Property",
    tagline: "Real estate & development",
    description: "Build long-term wealth through rental income, construction and property development.",
    duration: "1–5+ years",
    risk: "Lower–Moderate",
    accent: "#2563eb",
    accentBg: "#eff6ff",
    examples: ["Rental apartments", "Construction projects", "Development"],
  },
  {
    key: "stable",
    label: "Stable",
    tagline: "Lower-risk opportunities",
    description: "Opportunities designed around capital preservation and stability.",
    duration: "Varies",
    risk: "Lower",
    accent: "#475569",
    accentBg: "#f1f5f9",
    examples: ["Government securities", "Secured financing"],
    comingSoon: true,
  },
]

export const categoryMeta = (key: OpportunityCategory): CategoryMeta =>
  CATEGORIES.find(c => c.key === key) ?? CATEGORIES[3]

export interface Opportunity {
  id: string
  title: string
  category: OpportunityCategory
  subcategory: string          // e.g. "Contract Finance", "Trade Finance", "Asset Finance"
  description: string
  location: string
  operator: string
  image: string
  fundingRequired: number      // UGX
  fundingReceived: number      // UGX
  minInvestment: number        // UGX
  unitPrice: number            // UGX per unit — keeps the ledger/holdings model consistent
  durationLabel: string        // e.g. "4 months", "24 months"
  durationMonths: number       // for filtering
  targetReturnMin: number      // %
  targetReturnMax: number      // %
  returnPeriod: "total" | "p.a."
  riskLevel: RiskLevel
  status: OpportunityStatus
  revenueModel: string         // how the money is made, plain language
  security: string[]           // only what actually exists
  risks: string[]              // plain-language risks — never hidden
  expectedExit: string
  href?: string                // property records point at their existing pages
  demo?: boolean               // sample record for development — labelled in the UI
}

export const fundingProgress = (o: Opportunity) =>
  o.fundingRequired > 0 ? Math.min(100, Math.round((o.fundingReceived / o.fundingRequired) * 100)) : 0

/** Status shown to investors — "Almost Funded" is derived, not stored */
export const displayStatus = (o: Opportunity): OpportunityStatus =>
  o.status === "Open" && fundingProgress(o) >= 80 ? "Almost Funded" : o.status

export const returnLabel = (o: Opportunity) =>
  (o.targetReturnMin === o.targetReturnMax
    ? `${o.targetReturnMin}%`
    : `${o.targetReturnMin}–${o.targetReturnMax}%`) + (o.returnPeriod === "p.a." ? " p.a." : "")

/* ── Demo marketplace records (SAMPLE DATA — labelled in the UI) ── */

export const demoOpportunities: Opportunity[] = [
  {
    id: "kampala-school-supply-contract",
    title: "Kampala School Supply Contract",
    category: "cashflow",
    subcategory: "Contract Finance",
    description: "Financing the delivery of furniture and scholastic materials under a signed supply contract with a group of Kampala schools. Capital funds procurement and delivery; repayment comes from the contract payment on completion.",
    location: "Kampala, Uganda",
    operator: "Sample operator — demonstration record",
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=900&q=80",
    fundingRequired: 180_000_000,
    fundingReceived: 129_600_000,
    minInvestment: 100_000,
    unitPrice: 10_000,
    durationLabel: "4 months",
    durationMonths: 4,
    targetReturnMin: 12,
    targetReturnMax: 16,
    returnPeriod: "total",
    riskLevel: "Moderate",
    status: "Open",
    revenueModel: "The supplier delivers goods under a signed contract. When the buyer pays the contract value, investor capital plus the financing margin is repaid.",
    security: ["Signed supply contract", "Escrow-controlled disbursement"],
    risks: ["The buyer may pay later than the expected date.", "Delivery costs may run above budget.", "Contract disputes could delay repayment."],
    expectedExit: "On contract payment (est. 4 months)",
    demo: true,
  },
  {
    id: "medical-supplies-invoice",
    title: "Medical Supplies Invoice — Mukono",
    category: "cashflow",
    subcategory: "Invoice Finance",
    description: "Advancing capital against a verified invoice for medical supplies already delivered to a regional distributor. Repayment comes directly from the invoice settlement.",
    location: "Mukono, Uganda",
    operator: "Sample operator — demonstration record",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=900&q=80",
    fundingRequired: 95_000_000,
    fundingReceived: 39_000_000,
    minInvestment: 50_000,
    unitPrice: 10_000,
    durationLabel: "60 days",
    durationMonths: 2,
    targetReturnMin: 3,
    targetReturnMax: 5,
    returnPeriod: "total",
    riskLevel: "Lower",
    status: "Open",
    revenueModel: "Goods are already delivered and invoiced. When the invoice is settled, the advance plus the discount margin is repaid to investors.",
    security: ["Verified delivered invoice", "Payment routed through escrow"],
    risks: ["The invoice may be settled later than its due date.", "A dispute over the delivery could delay payment."],
    expectedExit: "On invoice settlement (est. 60 days)",
    demo: true,
  },
  {
    id: "maize-trade-mubende",
    title: "Maize Trade — Mubende → Kampala",
    category: "growth",
    subcategory: "Trade Finance",
    description: "Working capital to purchase maize at source in Mubende, transport it, and sell to wholesale buyers in Kampala over a repeating trade cycle.",
    location: "Mubende → Kampala",
    operator: "Sample operator — demonstration record",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=900&q=80",
    fundingRequired: 250_000_000,
    fundingReceived: 152_500_000,
    minInvestment: 100_000,
    unitPrice: 10_000,
    durationLabel: "3 months",
    durationMonths: 3,
    targetReturnMin: 8,
    targetReturnMax: 14,
    returnPeriod: "total",
    riskLevel: "Moderate",
    status: "Open",
    revenueModel: "Capital buys grain at farm-gate prices. The margin between purchase and wholesale price, less logistics costs, produces the trade return.",
    security: ["Stock held in bonded storage", "Offtake commitments from buyers"],
    risks: ["Commodity prices may move against the trade.", "Post-harvest losses or transport delays may reduce margin.", "Buyers may take longer to pay."],
    expectedExit: "End of trade cycle (est. 3 months)",
    demo: true,
  },
  {
    id: "coffee-export-working-capital",
    title: "Coffee Export Working Capital",
    category: "growth",
    subcategory: "Working Capital",
    description: "Financing a licensed coffee exporter's purchasing season — buying parchment coffee from farmer cooperatives, processing, and exporting under confirmed orders.",
    location: "Mbale, Uganda",
    operator: "Sample operator — demonstration record",
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=900&q=80",
    fundingRequired: 400_000_000,
    fundingReceived: 112_000_000,
    minInvestment: 250_000,
    unitPrice: 10_000,
    durationLabel: "9 months",
    durationMonths: 9,
    targetReturnMin: 14,
    targetReturnMax: 20,
    returnPeriod: "total",
    riskLevel: "Higher",
    status: "Open",
    revenueModel: "Capital funds coffee purchases and processing. Export proceeds under confirmed orders repay investors after each shipment cycle.",
    security: ["Confirmed export orders", "Stock monitoring at the processing facility"],
    risks: ["Global coffee prices can move significantly.", "A weak harvest could reduce volumes.", "Export logistics may face delays.", "Business performance may be below projections."],
    expectedExit: "End of export season (est. 9 months)",
    demo: true,
  },
  {
    id: "ten-ton-truck-gulu",
    title: "10-Ton Truck — Kampala–Gulu Route",
    category: "assets",
    subcategory: "Asset Finance",
    description: "Financing a 10-ton cargo truck operated on the Kampala–Gulu freight corridor under contract with established cargo brokers. The truck generates recurring haulage income.",
    location: "Kampala–Gulu corridor",
    operator: "Sample operator — demonstration record",
    image: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=900&q=80",
    fundingRequired: 120_000_000,
    fundingReceived: 66_000_000,
    minInvestment: 100_000,
    unitPrice: 10_000,
    durationLabel: "24 months",
    durationMonths: 24,
    targetReturnMin: 15,
    targetReturnMax: 18,
    returnPeriod: "p.a.",
    riskLevel: "Moderate",
    status: "Open",
    revenueModel: "The truck earns haulage fees on scheduled freight routes. Net operating income after fuel, driver and maintenance costs is distributed to investors.",
    security: ["Asset comprehensively insured", "Tracker-fitted, operator-managed"],
    risks: ["Freight demand may fluctuate.", "Downtime for repairs reduces income.", "Operating costs may rise above projections."],
    expectedExit: "Asset sale or refinancing (est. 24 months)",
    demo: true,
  },
  {
    id: "concrete-mixer-fleet",
    title: "Concrete Mixer Fleet — 3 Units",
    category: "assets",
    subcategory: "Equipment Finance",
    description: "Financing three self-loading concrete mixers leased to active construction sites around Kampala and Wakiso on monthly hire agreements.",
    location: "Kampala & Wakiso",
    operator: "Sample operator — demonstration record",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=900&q=80",
    fundingRequired: 300_000_000,
    fundingReceived: 99_000_000,
    minInvestment: 250_000,
    unitPrice: 10_000,
    durationLabel: "36 months",
    durationMonths: 36,
    targetReturnMin: 14,
    targetReturnMax: 17,
    returnPeriod: "p.a.",
    riskLevel: "Moderate",
    status: "Open",
    revenueModel: "Each mixer earns monthly hire fees from construction sites. Net hire income after maintenance and management is distributed to investors.",
    security: ["Equipment insured", "Hire agreements with active sites"],
    risks: ["Construction activity may slow, reducing hire demand.", "Equipment downtime reduces income.", "Hire rates may soften over time."],
    expectedExit: "Equipment sale (est. 36 months)",
    demo: true,
  },
]

/* ── Adapters: existing property records → Opportunity shape ── */

export function rentalToOpportunity(r: RentalProperty): Opportunity {
  const sold = r.totalShares - r.availableShares
  return {
    id: r.id,
    title: r.name,
    category: "property",
    subcategory: "Rental Property",
    description: `Verified income-producing ${r.type.toLowerCase()} in ${r.location}. Investors own shares and receive proportional rental income.`,
    location: r.location,
    operator: "NestFund-verified property",
    image: r.image,
    fundingRequired: r.totalShares * r.pricePerShare,
    fundingReceived: sold * r.pricePerShare,
    minInvestment: r.pricePerShare,
    unitPrice: r.pricePerShare,
    durationLabel: "Open-ended",
    durationMonths: 60,
    targetReturnMin: r.rentalYield,
    targetReturnMax: r.rentalYield,
    returnPeriod: "p.a.",
    riskLevel: "Lower",
    status: r.status === "Coming Soon" ? "Coming Soon" : "Open",
    revenueModel: "Tenants pay rent; net rental income is distributed to shareholders monthly. Shares can be listed on the Exchange.",
    security: ["Verified title & documentation"],
    risks: ["Occupancy and rental income may vary.", "Property values can go down as well as up."],
    expectedExit: "Sell shares on the Exchange anytime",
    href: `/property/${r.id}`,
  }
}

export function constructionToOpportunity(c: ConstructionProject): Opportunity {
  return {
    id: c.id,
    title: c.name,
    category: "property",
    subcategory: "Construction",
    description: `Funding the construction of ${c.name} in ${c.location}. Share value is designed to appreciate as construction milestones complete.`,
    location: c.location,
    operator: "NestFund-verified project",
    image: c.image,
    fundingRequired: c.capitalNeeded,
    fundingReceived: c.capitalRaised,
    minInvestment: c.sharePrice,
    unitPrice: c.sharePrice,
    durationLabel: `Until ${c.expectedCompletion}`,
    durationMonths: 20,
    targetReturnMin: c.projectedROI,
    targetReturnMax: c.projectedROI,
    returnPeriod: "total",
    riskLevel: "Moderate",
    status: "Open",
    revenueModel: "Capital funds construction in staged releases. Completed value above build cost drives the projected development return.",
    security: ["Milestone-based fund releases", "Verified project documentation"],
    risks: ["Construction may take longer than planned.", "Build costs may exceed budget.", "The completed value may differ from projections."],
    expectedExit: `Completion ${c.expectedCompletion}`,
    href: `/construction/${c.id}`,
  }
}
