import { getSupabase } from "./supabase"
import { generateChartData } from "./chart"
import {
  rentalProperties as mockRentals,
  type RentalProperty,
  type ActivityItem,
  type TradeRecord,
} from "./data/rentals"
import {
  intelligenceFeed as mockIntel,
  marketStats as mockStats,
  type IntelligenceItem,
  type IntelType,
} from "./data/intelligence"

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
  affected: number; desc: string; change: number; sourceLabel: string
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
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=70",
    })
    .select()
    .single()
  if (error) throw new Error(error.message.includes("row-level security") ? WRITE_BLOCKED : error.message)
  return data ? mapIntelligence(data) : null
}

export async function deleteIntelligence(id: string): Promise<void> {
  const sb = getSupabase()
  if (!sb) throw new Error("Database not connected")
  const { error } = await sb.from("intelligence_items").delete().eq("id", id)
  if (error) throw new Error(error.message)
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
