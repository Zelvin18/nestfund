import { getSupabase } from "./supabase"
import { generateChartData } from "./chart"
import {
  rentalProperties as mockRentals,
  type RentalProperty,
  type ActivityItem,
  type TradeRecord,
} from "./data/rentals"
import {
  marketStats as mockStats,
  type IntelligenceItem,
  type IntelType,
} from "./data/intelligence"
import {
  constructionProjects as mockProjects,
  type ConstructionProject,
} from "./data/construction"
import {
  exchangeListings as mockListings,
  type ExchangeListing,
} from "./data/exchange"

/* ═══════════════════════════════════════════════════════════════
   DATA API — Supabase-backed with mock fallback.

   Fetchers return null when the database is unreachable so callers
   keep showing lib/data mock records. Mutations throw descriptive
   errors (including silent RLS write-blocks) so the admin UI can
   surface them honestly.
═══════════════════════════════════════════════════════════════ */

/* ── Row mapping ─────────────────────────────────────────────── */

const dateLabel = (iso: string | null) => {
  if (!iso) return ""
  const d = new Date(iso)
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
}

const timeAgo = (iso: string | null) => {
  if (!iso) return ""
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 90) return "just now"
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  return `${Math.floor(s / 86400)}d ago`
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapProperty(row: any): RentalProperty {
  const mock = mockRentals.find(m => m.id === row.id)

  const images: string[] = (row.property_images ?? [])
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((i: any) => i.url)

  const activities: ActivityItem[] = (row.property_activities ?? [])
    .sort((a: any, b: any) => (a.happened_at < b.happened_at ? 1 : -1))
    .map((a: any) => ({
      icon: a.icon, title: a.title, desc: a.description ?? "",
      date: dateLabel(a.happened_at), photos: a.photos ?? [],
      attachment: a.attachment ?? undefined,
    }))

  const trades: TradeRecord[] = (row.property_trades ?? [])
    .sort((a: any, b: any) => (a.traded_at < b.traded_at ? 1 : -1))
    .map((t: any) => ({
      hash: t.tx_hash ?? "—",
      date: dateLabel(t.traded_at), time: "",
      shares: t.shares, price: t.price, volume: Number(t.volume), status: t.status,
    }))

  const pricePerShare = row.price_per_share
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    type: row.type,
    description: row.description ?? mock?.description ?? "",
    image: row.image || images[0] || mock?.image || "",
    images: images.length ? images : mock?.images ?? (row.image ? [row.image] : []),
    currentPrice: Number(row.current_price),
    pricePerShare,
    totalShares: row.total_shares,
    availableShares: row.available_shares,
    priceChange: Number(row.price_change),
    priceChangePercent: Number(row.price_change_percent),
    rentalYield: Number(row.rental_yield),
    areaScore: row.area_score ?? 50,
    futureGrowth: row.future_growth,
    occupancy: row.occupancy ?? 0,
    investors: row.investors,
    status: row.status,
    lastActivity: row.last_activity ?? "",
    beds: row.beds ?? 0, baths: row.baths ?? 0, sqm: row.sqm ?? 0,
    parking: row.parking ?? 0, floors: row.floors ?? 0, yearBuilt: row.year_built ?? 0,
    activityFeed: activities.length ? activities : mock?.activityFeed ?? [],
    tradeHistory: trades.length ? trades : mock?.tradeHistory ?? [],
    chartData: generateChartData(pricePerShare, 30, Number(row.price_change_percent) >= 0 ? "up" : "down"),
  }
}

function mapIntelligence(row: any): IntelligenceItem {
  return {
    id: row.id,
    type: row.type as IntelType,
    category: row.category,
    title: row.title,
    location: row.location ?? "",
    affectedProps: row.affected_properties ?? 0,
    desc: row.description ?? "",
    change: Number(row.change_percent),
    timeAgo: timeAgo(row.published_at),
    image: row.image ?? "",
    sourceLabel: row.source_label ?? "",
    sourceUrl: row.source_url ?? "#",
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapConstruction(row: any): ConstructionProject {
  const mock = mockProjects.find(m => m.id === row.id)
  const images: string[] = (row.construction_images ?? [])
    .sort((a: any, b: any) => a.sort_order - b.sort_order)
    .map((i: any) => i.url)
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    developer: row.developer,
    image: row.image || images[0] || mock?.image || "",
    images: images.length ? images : mock?.images ?? (row.image ? [row.image] : []),
    projectCost: Number(row.project_cost),
    developerInvestment: Number(row.developer_investment),
    capitalNeeded: Number(row.capital_needed),
    capitalRaised: Number(row.capital_raised),
    fundingProgress: Number(row.funding_progress),
    constructionProgress: Number(row.construction_progress),
    expectedCompletion: row.expected_completion ?? "",
    projectedYield: Number(row.projected_yield ?? 0),
    projectedROI: Number(row.projected_roi ?? 0),
    sharePrice: row.share_price,
    sharePriceStart: row.share_price_start,
    sharePriceAtCompletion: row.share_price_at_completion,
    estimatedPropertyValue: Number(row.estimated_property_value ?? 0),
    totalShares: row.total_shares,
    availableShares: row.available_shares,
    investors: row.investors,
    stage: row.stage ?? "",
    stageColor: row.stage_color ?? "#f59e0b",
    beds: row.beds ?? 0, baths: row.baths ?? 0, sqm: row.sqm ?? 0,
    type: row.type ?? "Residential",
    status: row.status ?? "",
  }
}

function mapExchangeListing(row: any): ExchangeListing & { dbId: string } {
  const p = row.properties
  const c = row.construction_projects
  const original = row.market_type === "income" ? (p?.price_per_share ?? row.current_share_price) : (c?.share_price_start ?? row.current_share_price)
  return {
    dbId: row.id,
    id: row.property_id ?? row.project_id ?? row.id,
    name: p?.name ?? c?.name ?? "Unknown",
    location: p?.location ?? c?.location ?? "",
    type: row.market_type === "income" ? (p?.type ?? "Residential") : "Construction",
    image: p?.image ?? c?.image ?? "",
    propertyValue: Number(p?.current_price ?? c?.project_cost ?? 0),
    currentSharePrice: row.current_share_price,
    originalSharePrice: original,
    priceChange: original ? Math.round(((row.current_share_price - original) / original) * 10000) / 100 : 0,
    apr: Number(p?.rental_yield ?? c?.projected_yield ?? 0),
    occupancy: row.market_type === "income" ? (p?.occupancy ?? null) : null,
    availableBuyShares: row.available_buy_shares,
    availableSellShares: row.available_sell_shares,
    lastTradePrice: row.last_trade_price ?? row.current_share_price,
    lastTradeTime: row.last_trade_at ? timeAgo(row.last_trade_at) : "recently",
    marketType: row.market_type,
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/* ── Fetchers (null = keep mock fallback) ────────────────────── */

export async function fetchRentalProperties(): Promise<RentalProperty[] | null> {
  const sb = getSupabase()
  if (!sb) return null
  const { data, error } = await sb
    .from("properties")
    .select("*, property_images(url, sort_order), property_activities(*), property_trades(*)")
    .order("created_at", { ascending: true })
  if (error || !data || data.length === 0) return null
  return data.map(mapProperty)
}

export async function fetchIntelligence(): Promise<IntelligenceItem[] | null> {
  const sb = getSupabase()
  if (!sb) return null
  const { data, error } = await sb
    .from("intelligence_items")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
  if (error || !data || data.length === 0) return null
  return data.map(mapIntelligence)
}

export async function fetchConstructionProjects(): Promise<ConstructionProject[] | null> {
  const sb = getSupabase()
  if (!sb) return null
  const { data, error } = await sb
    .from("construction_projects")
    .select("*, construction_images(url, sort_order)")
    .order("created_at", { ascending: true })
  if (error || !data || data.length === 0) return null
  return data.map(mapConstruction)
}

export async function fetchExchangeListings(): Promise<(ExchangeListing & { dbId: string })[] | null> {
  const sb = getSupabase()
  if (!sb) return null
  const { data, error } = await sb
    .from("exchange_listings")
    .select("*, properties(name, location, type, image, current_price, price_per_share, rental_yield, occupancy), construction_projects(name, location, image, project_cost, share_price_start, projected_yield)")
    .eq("is_active", true)
  if (error || !data || data.length === 0) return null
  return data.map(mapExchangeListing)
}

export type PlatformStats = typeof mockStats

export async function fetchPlatformStats(): Promise<PlatformStats | null> {
  const sb = getSupabase()
  if (!sb) return null
  const { data, error } = await sb.from("site_settings").select("value").eq("key", "platform_stats").single()
  if (error || !data) return null
  return { ...mockStats, ...(data.value as Partial<PlatformStats>) }
}

export async function fetchSiteSetting<T>(key: string): Promise<T | null> {
  const sb = getSupabase()
  if (!sb) return null
  const { data, error } = await sb.from("site_settings").select("value").eq("key", key).single()
  if (error || !data) return null
  return data.value as T
}

/* ── Mutations (admin) ───────────────────────────────────────── */

const WRITE_BLOCKED =
  "The database rejected the write (row-level security). Run supabase/dev-open-policies.sql in the Supabase SQL editor to allow admin writes until login is added."

export async function savePropertyFields(id: string, p: RentalProperty): Promise<void> {
  const sb = getSupabase()
  if (!sb) throw new Error("Database not connected")
  const { data, error } = await sb
    .from("properties")
    .update({
      name: p.name, location: p.location, type: p.type, status: p.status,
      description: p.description ?? null,
      image: p.images[0] ?? p.image,
      current_price: p.currentPrice, price_per_share: p.pricePerShare,
      total_shares: p.totalShares, available_shares: p.availableShares,
      price_change: p.priceChange, price_change_percent: p.priceChangePercent,
      rental_yield: p.rentalYield, area_score: p.areaScore,
      future_growth: p.futureGrowth, occupancy: p.occupancy, investors: p.investors,
      beds: p.beds, baths: p.baths, sqm: p.sqm,
      parking: p.parking, floors: p.floors, year_built: p.yearBuilt,
    })
    .eq("id", id)
    .select("id")
  if (error) throw new Error(error.message)
  if (!data || data.length === 0) throw new Error(WRITE_BLOCKED)
}

/** Wholesale gallery replace keeps ordering simple */
export async function savePropertyImages(id: string, urls: string[]): Promise<void> {
  const sb = getSupabase()
  if (!sb) throw new Error("Database not connected")
  const del = await sb.from("property_images").delete().eq("property_id", id)
  if (del.error) throw new Error(del.error.message)
  if (urls.length) {
    const ins = await sb.from("property_images").insert(urls.map((url, i) => ({ property_id: id, url, sort_order: i })))
    if (ins.error) throw new Error(ins.error.message.includes("row-level security") ? WRITE_BLOCKED : ins.error.message)
  }
}

export async function addPropertyActivity(id: string, a: { icon: string; title: string; desc: string }): Promise<void> {
  const sb = getSupabase()
  if (!sb) throw new Error("Database not connected")
  const { error } = await sb.from("property_activities").insert({
    property_id: id, icon: a.icon, title: a.title, description: a.desc,
  })
  if (error) throw new Error(error.message.includes("row-level security") ? WRITE_BLOCKED : error.message)
}

export async function publishIntelligence(item: {
  type: IntelType; category: string; title: string; location: string
  affected: number; desc: string; change: number; sourceLabel: string; image?: string
}): Promise<IntelligenceItem | null> {
  const sb = getSupabase()
  if (!sb) throw new Error("Database not connected")
  const { data, error } = await sb
    .from("intelligence_items")
    .insert({
      type: item.type, category: item.category, title: item.title,
      location: item.location, affected_properties: item.affected,
      description: item.desc, change_percent: item.change,
      source_label: item.sourceLabel, source_url: "#",
      image: item.image?.trim() || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=70",
    })
    .select()
    .single()
  if (error) throw new Error(error.message.includes("row-level security") ? WRITE_BLOCKED : error.message)
  return data ? mapIntelligence(data) : null
}

export async function saveConstructionFields(id: string, c: ConstructionProject): Promise<void> {
  const sb = getSupabase()
  if (!sb) throw new Error("Database not connected")
  const { data, error } = await sb
    .from("construction_projects")
    .update({
      name: c.name, location: c.location, developer: c.developer,
      type: c.type, status: c.status, image: c.images[0] ?? c.image,
      project_cost: c.projectCost, developer_investment: c.developerInvestment,
      capital_needed: c.capitalNeeded, capital_raised: c.capitalRaised,
      funding_progress: c.fundingProgress, construction_progress: c.constructionProgress,
      expected_completion: c.expectedCompletion,
      projected_yield: c.projectedYield, projected_roi: c.projectedROI,
      share_price: c.sharePrice, share_price_start: c.sharePriceStart,
      share_price_at_completion: c.sharePriceAtCompletion,
      estimated_property_value: c.estimatedPropertyValue,
      total_shares: c.totalShares, available_shares: c.availableShares,
      investors: c.investors, stage: c.stage, stage_color: c.stageColor,
      beds: c.beds, baths: c.baths, sqm: c.sqm,
    })
    .eq("id", id)
    .select("id")
  if (error) throw new Error(error.message)
  if (!data || data.length === 0) throw new Error(WRITE_BLOCKED)
}

export async function saveExchangeListing(dbId: string, fields: { currentSharePrice: number; availableBuyShares: number; availableSellShares: number }): Promise<void> {
  const sb = getSupabase()
  if (!sb) throw new Error("Database not connected")
  const { data, error } = await sb
    .from("exchange_listings")
    .update({
      current_share_price: fields.currentSharePrice,
      available_buy_shares: fields.availableBuyShares,
      available_sell_shares: fields.availableSellShares,
    })
    .eq("id", dbId)
    .select("id")
  if (error) throw new Error(error.message)
  if (!data || data.length === 0) throw new Error(WRITE_BLOCKED)
}

export async function deleteIntelligence(id: string): Promise<void> {
  const sb = getSupabase()
  if (!sb) throw new Error("Database not connected")
  const { error } = await sb.from("intelligence_items").delete().eq("id", id)
  if (error) throw new Error(error.message)
}

/* ── Developer project submissions ───────────────────────────── */

export interface ProjectSubmissionInput {
  submissionType: string
  projectName: string
  location: string
  sizeDetails: string
  estimatedValue: number
  developmentStage: string
  expectedCompletion: string
  ownership: string
  description: string
  capitalSought: number
  capitalUses: string[]
  documentsAvailable: string[]
  contactName: string
  contactEmail: string
  contactPhone: string
  company: string
}

export interface ProjectSubmission extends ProjectSubmissionInput {
  id: string
  status: string
  createdAt: string
}

export async function submitProject(input: ProjectSubmissionInput): Promise<void> {
  const sb = getSupabase()
  if (!sb) throw new Error("Database not connected")
  const { error } = await sb.from("project_submissions").insert({
    submission_type: input.submissionType,
    project_name: input.projectName,
    location: input.location,
    size_details: input.sizeDetails,
    estimated_value: input.estimatedValue,
    development_stage: input.developmentStage,
    expected_completion: input.expectedCompletion,
    ownership: input.ownership,
    description: input.description,
    capital_sought: input.capitalSought,
    capital_uses: input.capitalUses,
    documents_available: input.documentsAvailable,
    contact_name: input.contactName,
    contact_email: input.contactEmail,
    contact_phone: input.contactPhone,
    company: input.company,
  })
  if (error) {
    if (error.message.includes("does not exist") || error.message.includes("Could not find the table") || error.message.includes("schema cache")) {
      throw new Error("The submissions table is missing — run supabase/developers-schema.sql in the Supabase SQL editor, then try again.")
    }
    throw new Error(error.message)
  }
}

export async function fetchSubmissions(): Promise<ProjectSubmission[] | null> {
  const sb = getSupabase()
  if (!sb) return null
  const { data, error } = await sb
    .from("project_submissions")
    .select("*")
    .order("created_at", { ascending: false })
  if (error || !data) return null
  /* eslint-disable @typescript-eslint/no-explicit-any */
  return data.map((row: any) => ({
    id: row.id,
    submissionType: row.submission_type,
    projectName: row.project_name,
    location: row.location,
    sizeDetails: row.size_details ?? "",
    estimatedValue: Number(row.estimated_value ?? 0),
    developmentStage: row.development_stage ?? "",
    expectedCompletion: row.expected_completion ?? "",
    ownership: row.ownership ?? "",
    description: row.description ?? "",
    capitalSought: Number(row.capital_sought),
    capitalUses: row.capital_uses ?? [],
    documentsAvailable: row.documents_available ?? [],
    contactName: row.contact_name,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone ?? "",
    company: row.company ?? "",
    status: row.status,
    createdAt: row.created_at,
  }))
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

export async function updateSubmissionStatus(id: string, status: string): Promise<void> {
  const sb = getSupabase()
  if (!sb) throw new Error("Database not connected")
  const { data, error } = await sb
    .from("project_submissions")
    .update({ status, reviewed_at: new Date().toISOString() })
    .eq("id", id)
    .select("id")
  if (error) throw new Error(error.message)
  if (!data || data.length === 0) throw new Error(WRITE_BLOCKED)
}

export async function saveSiteSetting(key: string, value: unknown): Promise<void> {
  const sb = getSupabase()
  if (!sb) throw new Error("Database not connected")
  const { data, error } = await sb
    .from("site_settings")
    .upsert({ key, value }, { onConflict: "key" })
    .select("key")
  if (error) throw new Error(error.message.includes("row-level security") ? WRITE_BLOCKED : error.message)
  if (!data || data.length === 0) throw new Error(WRITE_BLOCKED)
}
