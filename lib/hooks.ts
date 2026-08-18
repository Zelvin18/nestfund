"use client"

import { useCallback, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import {
  fetchRentalProperties, fetchIntelligence, fetchPlatformStats,
  fetchConstructionProjects, fetchExchangeListings, fetchSiteSetting,
  fetchInterestStats, fetchOpportunities, type PlatformStats, type InterestStats,
} from "./api"
import {
  demoOpportunities, rentalToOpportunity, constructionToOpportunity,
  categoryMeta, returnLabel, fundingProgress,
  type Opportunity,
} from "./data/opportunities"
import { getCurrentUser, onAuthChange } from "./auth"
import {
  fetchWalletBalance, fetchLedgerTransactions, fetchHoldings,
  LEDGER_EVENT, type LedgerHolding,
} from "./ledger"
import type { WalletTransaction } from "./data/portfolio"
import { rentalProperties as mockRentals, comingSoonProperties, mockInterestStats, type RentalProperty } from "./data/rentals"
import { intelligenceFeed as mockIntel, marketStats as mockStats, type IntelligenceItem } from "./data/intelligence"
import { constructionProjects as mockProjects, type ConstructionProject } from "./data/construction"
import { exchangeListings as mockListings, type ExchangeListing } from "./data/exchange"

/* ═══════════════════════════════════════════════════════════════
   LIVE DATA HOOKS

   Render instantly with lib/data mock records, then swap in the
   database rows once fetched. If the database is unreachable the
   mock stays — the site never breaks.
═══════════════════════════════════════════════════════════════ */

export function useRentals(): { rentals: RentalProperty[]; live: boolean } {
  const [state, setState] = useState<{ rentals: RentalProperty[]; live: boolean }>({ rentals: mockRentals, live: false })
  useEffect(() => {
    let active = true
    fetchRentalProperties()
      .then(d => { if (active && d) setState({ rentals: d, live: true }) })
      .catch(() => {})
    return () => { active = false }
  }, [])
  return state
}

export function useIntelligence(): { items: IntelligenceItem[]; live: boolean } {
  const [state, setState] = useState<{ items: IntelligenceItem[]; live: boolean }>({ items: mockIntel, live: false })
  useEffect(() => {
    let active = true
    fetchIntelligence()
      .then(d => { if (active && d) setState({ items: d, live: true }) })
      .catch(() => {})
    return () => { active = false }
  }, [])
  return state
}

export function usePlatformStats(): PlatformStats {
  const [stats, setStats] = useState<PlatformStats>(mockStats)
  useEffect(() => {
    let active = true
    fetchPlatformStats()
      .then(d => { if (active && d) setStats(d) })
      .catch(() => {})
    return () => { active = false }
  }, [])
  return stats
}

export function useConstruction(): { projects: ConstructionProject[]; live: boolean } {
  const [state, setState] = useState<{ projects: ConstructionProject[]; live: boolean }>({ projects: mockProjects, live: false })
  useEffect(() => {
    let active = true
    fetchConstructionProjects()
      .then(d => { if (active && d) setState({ projects: d, live: true }) })
      .catch(() => {})
    return () => { active = false }
  }, [])
  return state
}

export function useExchange(): { listings: (ExchangeListing & { dbId?: string })[]; live: boolean } {
  const [state, setState] = useState<{ listings: (ExchangeListing & { dbId?: string })[]; live: boolean }>({ listings: mockListings, live: false })
  useEffect(() => {
    let active = true
    fetchExchangeListings()
      .then(d => { if (active && d) setState({ listings: d, live: true }) })
      .catch(() => {})
    return () => { active = false }
  }, [])
  return state
}

/** Coming Soon queue: unopened listings ranked by reservations (leader first) */
export function useComingSoon(): {
  queue: (RentalProperty & { interest: InterestStats; progress: number })[]
  live: boolean
} {
  const { rentals, live } = useRentals()
  const [stats, setStats] = useState<Record<string, InterestStats>>(mockInterestStats)
  useEffect(() => {
    let active = true
    fetchInterestStats()
      .then(d => { if (active && d) setStats(prev => ({ ...prev, ...d })) })
      .catch(() => {})
    return () => { active = false }
  }, [])
  // If the database has no Coming Soon rows yet (coming-soon.sql not run),
  // fall back to the built-in queue so the section never goes dark
  const source = rentals.some(p => p.status === "Coming Soon")
    ? rentals
    : [...rentals, ...comingSoonProperties.filter(c => !rentals.some(r => r.id === c.id))]
  const queue = source
    .filter(p => p.status === "Coming Soon")
    .map(p => {
      const interest = stats[p.id] ?? { count: 0, amount: 0 }
      const threshold = p.interestThreshold ?? 100
      return { ...p, interest, progress: Math.min(100, Math.round((interest.count / threshold) * 100)) }
    })
    .sort((a, b) => b.progress - a.progress || b.interest.count - a.interest.count)
  return { queue, live }
}

/** The admin-selected property for the /home hero card */
export function useHomeHeroProperty(): RentalProperty {
  const { rentals } = useRentals()
  const [heroId, setHeroId] = useState<string | null>(null)
  useEffect(() => {
    let active = true
    fetchSiteSetting<{ featuredPropertyId: string }>("home_hero")
      .then(v => { if (active && v?.featuredPropertyId) setHeroId(v.featuredPropertyId) })
      .catch(() => {})
    return () => { active = false }
  }, [])
  const liveOnes = rentals.filter(p => p.status === "Live")
  return liveOnes.find(p => p.id === heroId) ?? liveOnes[0] ?? mockRentals[0]
}

/* ── NestFund 2.0: the unified opportunity marketplace ────────── */

/**
 * Every investable record on the platform in one list:
 * database opportunities (or the labelled demo set until the table
 * has rows) + existing rental/construction records adapted into the
 * same shape. Property pages keep their own richer detail views.
 */
export function useOpportunities(): { opportunities: Opportunity[]; live: boolean } {
  const { rentals } = useRentals()
  const { projects } = useConstruction()
  const [nonProperty, setNonProperty] = useState<{ items: Opportunity[]; live: boolean }>({ items: demoOpportunities, live: false })
  useEffect(() => {
    let active = true
    fetchOpportunities()
      .then(d => { if (active && d) setNonProperty({ items: d, live: true }) })
      .catch(() => {})
    return () => { active = false }
  }, [])
  const propertyOpps = [
    ...rentals.map(rentalToOpportunity),
    ...projects.map(constructionToOpportunity),
  ]
  return { opportunities: [...nonProperty.items, ...propertyOpps], live: nonProperty.live }
}

/* ── Phase 1: session + ledger hooks ─────────────────────────── */

/** The signed-in Supabase user, kept in sync with auth state changes. */
export function useSession(): { user: User | null; loading: boolean } {
  const [state, setState] = useState<{ user: User | null; loading: boolean }>({ user: null, loading: true })
  useEffect(() => {
    let active = true
    getCurrentUser()
      .then(u => { if (active) setState({ user: u, loading: false }) })
      .catch(() => { if (active) setState({ user: null, loading: false }) })
    const off = onAuthChange(u => { if (active) setState({ user: u, loading: false }) })
    return () => { active = false; off() }
  }, [])
  return state
}

/**
 * Real wallet data from the ledger for a signed-in user.
 * `live` stays false (mock numbers keep showing) until the ledger
 * tables answer. Re-fetches whenever a ledger write announces itself.
 */
export function useWallet(user: User | null): {
  balance: number | null
  transactions: WalletTransaction[] | null
  live: boolean
  refresh: () => void
} {
  const [state, setState] = useState<{ balance: number | null; transactions: WalletTransaction[] | null; live: boolean }>({ balance: null, transactions: null, live: false })
  const refresh = useCallback(() => {
    if (!user) {
      // Deferred so the sign-out reset never sets state synchronously inside an effect
      Promise.resolve().then(() => setState({ balance: null, transactions: null, live: false }))
      return
    }
    Promise.all([fetchWalletBalance(user.id), fetchLedgerTransactions(user.id)])
      .then(([balance, transactions]) => {
        if (balance !== null) setState({ balance, transactions, live: true })
      })
      .catch(() => {})
  }, [user])
  useEffect(() => {
    refresh()
    window.addEventListener(LEDGER_EVENT, refresh)
    return () => window.removeEventListener(LEDGER_EVENT, refresh)
  }, [refresh])
  return { ...state, refresh }
}

/** Real holdings for a signed-in user; null until the tables answer. */
export function useLedgerHoldings(user: User | null): { holdings: LedgerHolding[] | null; live: boolean } {
  const [state, setState] = useState<{ holdings: LedgerHolding[] | null; live: boolean }>({ holdings: null, live: false })
  const refresh = useCallback(() => {
    if (!user) {
      // Deferred so the sign-out reset never sets state synchronously inside an effect
      Promise.resolve().then(() => setState({ holdings: null, live: false }))
      return
    }
    fetchHoldings(user.id)
      .then(h => { if (h !== null) setState({ holdings: h, live: true }) })
      .catch(() => {})
  }, [user])
  useEffect(() => {
    refresh()
    window.addEventListener(LEDGER_EVENT, refresh)
    return () => window.removeEventListener(LEDGER_EVENT, refresh)
  }, [refresh])
  return state
}

export interface FeaturedCard {
  id: string
  name: string
  location: string
  price: number
  unitLabel: string
  returnTag: string
  progress: number
  img: string
  kind: string        // category label, e.g. "Property", "Growth"
  accent: string      // category color
  href: string
}

/** Admin-selected cards for the landing hero strip — any opportunity, not just property */
export function useLandingFeatured(): FeaturedCard[] {
  const { opportunities } = useOpportunities()
  // Default mix: one property, one trade, one asset — diversity visible up front
  const [ids, setIds] = useState<string[]>(["sunrise-apartments", "maize-trade-mubende", "ten-ton-truck-gulu"])
  useEffect(() => {
    let active = true
    fetchSiteSetting<{ featuredPropertyIds: string[] }>("landing_hero")
      .then(v => { if (active && v?.featuredPropertyIds?.length) setIds(v.featuredPropertyIds) })
      .catch(() => {})
    return () => { active = false }
  }, [])
  return ids
    .map((id): FeaturedCard | null => {
      const o = opportunities.find(x => x.id === id)
      if (!o) return null
      const cat = categoryMeta(o.category)
      return {
        id,
        name: o.title,
        location: o.location,
        price: o.unitPrice,
        unitLabel: o.category === "property" ? "per share" : "per unit",
        returnTag: `${returnLabel(o)} target`,
        progress: fundingProgress(o),
        img: o.image,
        kind: cat.label,
        accent: cat.accent,
        href: o.href ?? `/opportunity/${o.id}`,
      }
    })
    .filter((c): c is FeaturedCard => c !== null)
}
