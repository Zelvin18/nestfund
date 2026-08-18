import { getSupabase } from "./supabase"
import type { WalletTransaction } from "./data/portfolio"
import type { ShareOffer } from "./data/exchange"

/* ═══════════════════════════════════════════════════════════════
   LEDGER — Phase 1 simulated-money engine.

   Every shilling moves through ledger_transactions (append-only,
   supabase/phase1-foundation.sql). Balance is derived by summing
   completed entries — never stored, never edited. Holdings are the
   current position snapshot, updated alongside each INVESTMENT.
   Golden Rule 3: no ownership change without a recorded transaction.
═══════════════════════════════════════════════════════════════ */

const FOUNDATION_HINT =
  "The ledger tables aren't set up yet — run supabase/phase1-foundation.sql in the Supabase SQL editor."

const isMissingTable = (msg: string) =>
  msg.includes("does not exist") || msg.includes("schema cache")

/** NF-TX-2026-483920 style reference */
const newTxRef = () =>
  `NF-TX-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`

/** Notify open pages (navbar wallet pill, portfolio) that money moved */
export const LEDGER_EVENT = "nf-ledger-changed"
const announceLedgerChange = () => {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(LEDGER_EVENT))
}

/* ── Reads ───────────────────────────────────────────────────── */

/** Cash balance = sum of completed ledger entries (signed amounts). Null = tables unavailable. */
export async function fetchWalletBalance(userId: string): Promise<number | null> {
  const sb = getSupabase()
  if (!sb) return null
  const { data, error } = await sb
    .from("ledger_transactions")
    .select("amount")
    .eq("user_id", userId)
    .eq("status", "completed")
  if (error || !data) return null
  return data.reduce((sum, r) => sum + Number(r.amount), 0)
}

export async function fetchLedgerTransactions(userId: string): Promise<WalletTransaction[] | null> {
  const sb = getSupabase()
  if (!sb) return null
  const { data, error } = await sb
    .from("ledger_transactions")
    .select("id, type, amount, memo, status, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50)
  if (error || !data) return null
  return data.map(r => ({
    id: r.id,
    type: r.type === "DEPOSIT" ? "deposit"
        : r.type === "WITHDRAWAL" ? "withdraw"
        : r.type === "INVESTMENT" ? "buy"
        : "income",
    label: r.memo ?? r.type,
    amount: Number(r.amount),
    date: new Date(r.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    status: r.status === "completed" ? "completed" : "pending",
  }))
}

export interface LedgerHolding {
  propertyId: string
  units: number
  avgCost: number
}

export async function fetchHoldings(userId: string): Promise<LedgerHolding[] | null> {
  const sb = getSupabase()
  if (!sb) return null
  const { data, error } = await sb
    .from("holdings")
    .select("property_id, units, avg_cost")
    .eq("user_id", userId)
    .gt("units", 0)
  if (error || !data) return null
  return data.map(r => ({ propertyId: r.property_id, units: Number(r.units), avgCost: Number(r.avg_cost) }))
}

/* ── Writes ──────────────────────────────────────────────────── */

/** Simulated-money beta: top up the wallet with demo funds via a real DEPOSIT entry. */
export async function demoTopUp(userId: string, amount: number): Promise<void> {
  const sb = getSupabase()
  if (!sb) throw new Error("The database isn't connected.")
  const { data, error } = await sb.from("ledger_transactions").insert({
    ref: newTxRef(),
    user_id: userId,
    type: "DEPOSIT",
    amount,
    status: "completed",
    memo: "Demo deposit — simulated beta funds",
    idempotency_key: crypto.randomUUID(),
  }).select("id")
  if (error) {
    if (isMissingTable(error.message)) throw new Error(FOUNDATION_HINT)
    throw new Error(error.message)
  }
  if (!data || data.length === 0) throw new Error(FOUNDATION_HINT)
  announceLedgerChange()
}

/* ── Exchange: P2P share listings + trade settlement ─────────── */

const EXCHANGE_HINT =
  "The exchange tables aren't set up yet — run supabase/exchange-v2.sql in the Supabase SQL editor."

const timeAgoLabel = (iso: string) => {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 90) return "just now"
  if (s < 3600) return `${Math.floor(s / 60)} min ago`
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`
  return `${Math.floor(s / 86400)} d ago`
}

/** Open sell offers from the database; null keeps the demo order book showing. */
export async function fetchShareListings(): Promise<ShareOffer[] | null> {
  const sb = getSupabase()
  if (!sb) return null
  const { data, error } = await sb
    .from("share_listings")
    .select("id, seller_id, seller_name, asset_id, units, price_per_share, created_at")
    .eq("status", "Open")
    .order("created_at", { ascending: false })
  if (error || !data) return null
  return data.map(r => ({
    id: r.id,
    assetId: r.asset_id,
    sellerId: r.seller_id ?? undefined,
    sellerName: r.seller_name,
    units: Number(r.units),
    pricePerShare: Number(r.price_per_share),
    listedAgo: timeAgoLabel(r.created_at),
  }))
}

/** Publish a sell offer — only for shares the seller actually holds. */
export async function createShareListing(input: {
  userId: string
  sellerName: string
  assetId: string
  units: number
  pricePerShare: number
}): Promise<void> {
  const sb = getSupabase()
  if (!sb) throw new Error("The database isn't connected.")
  const holdings = await fetchHoldings(input.userId)
  if (holdings === null) throw new Error(FOUNDATION_HINT)
  const position = holdings.find(h => h.propertyId === input.assetId)
  if (!position || position.units < input.units) {
    throw new Error(
      `You hold ${(position?.units ?? 0).toLocaleString()} shares of this asset — you can't list ${input.units.toLocaleString()}.`
    )
  }
  const { data, error } = await sb.from("share_listings").insert({
    seller_id: input.userId,
    seller_name: input.sellerName,
    asset_id: input.assetId,
    units: input.units,
    price_per_share: input.pricePerShare,
    status: "Open",
  }).select("id")
  if (error) {
    if (isMissingTable(error.message)) throw new Error(EXCHANGE_HINT)
    throw new Error(error.message)
  }
  if (!data || data.length === 0) throw new Error(EXCHANGE_HINT)
  announceLedgerChange()
}

/**
 * Buy shares from another investor's listing. Settlement:
 * 1. buyer balance check
 * 2. buyer: TRADE_SETTLEMENT (−total) + holdings up
 * 3. seller (real listings): TRADE_SETTLEMENT (+total) + holdings down
 * 4. listing decremented / closed; audit event
 * Demo offers settle the buyer side only (no real counterparty).
 */
export async function buyFromListing(input: {
  buyerId: string
  offer: ShareOffer
  units: number
  assetName: string
}): Promise<{ ref: string; total: number }> {
  const sb = getSupabase()
  if (!sb) throw new Error("The database isn't connected.")
  const { offer } = input
  const units = Math.min(input.units, offer.units)
  const total = units * offer.pricePerShare

  const balance = await fetchWalletBalance(input.buyerId)
  if (balance === null) throw new Error(FOUNDATION_HINT)
  if (balance < total) {
    throw new Error(
      `INSUFFICIENT_FUNDS:Your wallet has UGX ${balance.toLocaleString()} but this trade needs UGX ${total.toLocaleString()}. Top up in your Wallet first.`
    )
  }

  // Buyer leg
  const ref = newTxRef()
  const { data, error } = await sb.from("ledger_transactions").insert({
    ref,
    user_id: input.buyerId,
    type: "TRADE_SETTLEMENT",
    amount: -total,
    property_id: offer.assetId,
    units,
    status: "completed",
    memo: `Bought ${units.toLocaleString()} shares of ${input.assetName} from ${offer.sellerName} (Exchange)`,
    idempotency_key: crypto.randomUUID(),
  }).select("id")
  if (error) {
    if (isMissingTable(error.message)) throw new Error(FOUNDATION_HINT)
    throw new Error(error.message)
  }
  if (!data || data.length === 0) throw new Error(FOUNDATION_HINT)

  // Buyer position
  const { data: existing } = await sb
    .from("holdings")
    .select("units, avg_cost")
    .eq("user_id", input.buyerId)
    .eq("property_id", offer.assetId)
    .maybeSingle()
  const oldUnits = existing ? Number(existing.units) : 0
  const oldCost = existing ? Number(existing.avg_cost) : 0
  const newUnits = oldUnits + units
  const newAvg = Math.round((oldUnits * oldCost + total) / newUnits)
  await sb.from("holdings").upsert({
    user_id: input.buyerId,
    property_id: offer.assetId,
    units: newUnits,
    avg_cost: newAvg,
    updated_at: new Date().toISOString(),
  })

  // Seller leg — only for real listings with a real counterparty
  if (offer.sellerId && !offer.demo) {
    await sb.from("ledger_transactions").insert({
      ref: newTxRef(),
      user_id: offer.sellerId,
      type: "TRADE_SETTLEMENT",
      amount: total,
      property_id: offer.assetId,
      units: -units,
      status: "completed",
      memo: `Sold ${units.toLocaleString()} shares of ${input.assetName} on the Exchange`,
      idempotency_key: crypto.randomUUID(),
    })
    const { data: sellerPos } = await sb
      .from("holdings")
      .select("units, avg_cost")
      .eq("user_id", offer.sellerId)
      .eq("property_id", offer.assetId)
      .maybeSingle()
    if (sellerPos) {
      await sb.from("holdings").upsert({
        user_id: offer.sellerId,
        property_id: offer.assetId,
        units: Math.max(0, Number(sellerPos.units) - units),
        avg_cost: Number(sellerPos.avg_cost),
        updated_at: new Date().toISOString(),
      })
    }
    // Decrement or close the listing
    const remaining = offer.units - units
    await sb.from("share_listings").update({
      units: Math.max(0, remaining),
      status: remaining <= 0 ? "Sold" : "Open",
      updated_at: new Date().toISOString(),
    }).eq("id", offer.id)
  }

  await sb.from("platform_events").insert({
    type: "TRADE_EXECUTED",
    actor: input.buyerId,
    entity_type: "share_listing",
    entity_id: offer.id,
    after: { assetId: offer.assetId, units, total, ref, seller: offer.sellerName },
  })

  announceLedgerChange()
  return { ref, total }
}

/** Simulated withdrawal — balance-checked, recorded as a real WITHDRAWAL entry. */
export async function demoWithdraw(userId: string, amount: number): Promise<void> {
  const sb = getSupabase()
  if (!sb) throw new Error("The database isn't connected.")
  const balance = await fetchWalletBalance(userId)
  if (balance === null) throw new Error(FOUNDATION_HINT)
  if (balance < amount) {
    throw new Error(`Your wallet has UGX ${balance.toLocaleString()} — you can't withdraw UGX ${amount.toLocaleString()}.`)
  }
  const { data, error } = await sb.from("ledger_transactions").insert({
    ref: newTxRef(),
    user_id: userId,
    type: "WITHDRAWAL",
    amount: -amount,
    status: "completed",
    memo: "Demo withdrawal — simulated beta funds",
    idempotency_key: crypto.randomUUID(),
  }).select("id")
  if (error) {
    if (isMissingTable(error.message)) throw new Error(FOUNDATION_HINT)
    throw new Error(error.message)
  }
  if (!data || data.length === 0) throw new Error(FOUNDATION_HINT)
  announceLedgerChange()
}

export interface PurchaseInput {
  userId: string
  propertyId: string
  propertyName: string
  units: number
  pricePerShare: number
}

/**
 * Buy shares with simulated wallet money:
 * 1. balance check against the ledger
 * 2. append INVESTMENT transaction (negative amount)
 * 3. upsert holdings with recalculated average cost
 * 4. append INVESTMENT_PURCHASED platform event
 */
export async function purchaseShares(input: PurchaseInput): Promise<{ ref: string; total: number }> {
  const sb = getSupabase()
  if (!sb) throw new Error("The database isn't connected.")
  const total = input.units * input.pricePerShare

  const balance = await fetchWalletBalance(input.userId)
  if (balance === null) throw new Error(FOUNDATION_HINT)
  if (balance < total) {
    throw new Error(
      `INSUFFICIENT_FUNDS:Your wallet has UGX ${balance.toLocaleString()} but this order needs UGX ${total.toLocaleString()}. Top up in your Wallet first.`
    )
  }

  const ref = newTxRef()
  const { data, error } = await sb.from("ledger_transactions").insert({
    ref,
    user_id: input.userId,
    type: "INVESTMENT",
    amount: -total,
    property_id: input.propertyId,
    units: input.units,
    status: "completed",
    memo: `Bought ${input.units.toLocaleString()} shares — ${input.propertyName}`,
    idempotency_key: crypto.randomUUID(),
  }).select("id")
  if (error) {
    if (isMissingTable(error.message)) throw new Error(FOUNDATION_HINT)
    throw new Error(error.message)
  }
  if (!data || data.length === 0) throw new Error(FOUNDATION_HINT)

  // Position update: new average cost across old + new units
  const { data: existing } = await sb
    .from("holdings")
    .select("units, avg_cost")
    .eq("user_id", input.userId)
    .eq("property_id", input.propertyId)
    .maybeSingle()
  const oldUnits = existing ? Number(existing.units) : 0
  const oldCost = existing ? Number(existing.avg_cost) : 0
  const newUnits = oldUnits + input.units
  const newAvg = Math.round((oldUnits * oldCost + total) / newUnits)
  const { error: holdErr } = await sb.from("holdings").upsert({
    user_id: input.userId,
    property_id: input.propertyId,
    units: newUnits,
    avg_cost: newAvg,
    updated_at: new Date().toISOString(),
  })
  if (holdErr) throw new Error(`Payment recorded (${ref}) but the position update failed: ${holdErr.message}`)

  // Audit trail — best-effort, never blocks the purchase
  await sb.from("platform_events").insert({
    type: "INVESTMENT_PURCHASED",
    actor: input.userId,
    entity_type: "property",
    entity_id: input.propertyId,
    after: { units: input.units, total, ref },
  })

  announceLedgerChange()
  return { ref, total }
}
