/* ═══════════════════════════════════════════════════════════════
   USER DATA — portfolio holdings, wallet, payment methods.
   In production these become per-user API queries; the shapes
   below mirror the future tables.
═══════════════════════════════════════════════════════════════ */

/** Portfolio holdings — one row per property position */
export interface PortfolioHolding {
  propertyId: string
  shares: number
  invested: number
  currentValue: number
}

export const mockPortfolio: PortfolioHolding[] = [
  { propertyId: "sunrise-apartments", shares: 800, invested: 1000000, currentValue: 1045000 },
  { propertyId: "acacia-office-park", shares: 200, invested: 420000, currentValue: 504000 },
  { propertyId: "green-heights", shares: 630, invested: 504000, currentValue: 474500 },
]

/** Wallet transaction history */
export type TransactionType = "income" | "buy" | "deposit" | "withdraw"

export interface WalletTransaction {
  id: string
  type: TransactionType
  label: string
  amount: number
  date: string
  status: "completed" | "pending"
  /** ISO timestamp of the ledger entry — powers notifications */
  at?: string
}

export const walletTransactions: WalletTransaction[] = [
  { id: "1", type: "income",   label: "Rental Income — Sunrise Apartments",     amount: 93333,   date: "Jan 30, 2026", status: "completed" },
  { id: "2", type: "income",   label: "Rental Income — Acacia Office Park",     amount: 54600,   date: "Jan 30, 2026", status: "completed" },
  { id: "3", type: "buy",      label: "Bought 100 shares — Sunrise Apartments", amount: -125000, date: "Jan 22, 2026", status: "completed" },
  { id: "4", type: "deposit",  label: "Deposit via MTN Mobile Money",           amount: 500000,  date: "Jan 18, 2026", status: "completed" },
  { id: "5", type: "income",   label: "Rental Income — Green Heights",          amount: 37067,   date: "Dec 31, 2025", status: "completed" },
  { id: "6", type: "buy",      label: "Bought 50 shares — Green Heights",       amount: -42000,  date: "Dec 14, 2025", status: "completed" },
  { id: "7", type: "withdraw", label: "Withdrawal to Stanbic Bank",             amount: -200000, date: "Dec 5, 2025",  status: "completed" },
  { id: "8", type: "deposit",  label: "Deposit via Bank Transfer",              amount: 1000000, date: "Nov 28, 2025", status: "completed" },
]

/** Monthly rental income received (wallet chart) */
export const walletIncomeSeries = [
  { month: "Aug", income: 142000 },
  { month: "Sep", income: 158000 },
  { month: "Oct", income: 149000 },
  { month: "Nov", income: 171000 },
  { month: "Dec", income: 165000 },
  { month: "Jan", income: 185000 },
]

/** Linked payment methods */
export type MethodKind = "mtn" | "airtel" | "bank" | "card"

export interface PayMethod {
  id: number
  kind: MethodKind
  label: string
  detail: string
  isDefault: boolean
}

export const initialPayMethods: PayMethod[] = [
  { id: 1, kind: "mtn",    label: "MTN Mobile Money", detail: "+256 772 ••• 481", isDefault: true },
  { id: 2, kind: "airtel", label: "Airtel Money",     detail: "+256 750 ••• 921", isDefault: false },
  { id: 3, kind: "bank",   label: "Stanbic Bank",     detail: "•••• •••• 3421",   isDefault: false },
]

/** Wallet balances */
export const walletBalances = {
  cash: 2450000,
  invested: 2023500,
  totalEarnings: 184000,
  incomeThisMonth: 185000,
}
