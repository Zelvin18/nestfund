"use client"

import { useEffect, useState } from "react"
import {
  fetchRentalProperties, fetchIntelligence, fetchPlatformStats,
  fetchConstructionProjects, fetchExchangeListings, fetchSiteSetting,
  fetchInterestStats, type PlatformStats, type InterestStats,
} from "./api"
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

export interface FeaturedCard {
  id: string
  name: string
  location: string
  price: number
  changePct: number
  apr: number
  img: string
  kind: "Rental" | "Construction"
  href: string
}

/** The admin-selected property cards for the landing hero strip */
export function useLandingFeatured(): FeaturedCard[] {
  const { rentals } = useRentals()
  const { projects } = useConstruction()
  const [ids, setIds] = useState<string[]>(["sunrise-apartments", "acacia-office-park", "ibis-residences-ii"])
  useEffect(() => {
    let active = true
    fetchSiteSetting<{ featuredPropertyIds: string[] }>("landing_hero")
      .then(v => { if (active && v?.featuredPropertyIds?.length) setIds(v.featuredPropertyIds) })
      .catch(() => {})
    return () => { active = false }
  }, [])
  return ids
    .map((id): FeaturedCard | null => {
      const r = rentals.find(p => p.id === id)
      if (r) return { id, name: r.name, location: r.location, price: r.pricePerShare, changePct: r.priceChangePercent, apr: r.rentalYield, img: r.image, kind: "Rental", href: `/property/${id}` }
      const c = projects.find(p => p.id === id)
      if (c) return { id, name: c.name, location: c.location, price: c.sharePrice, changePct: Math.round(((c.sharePrice - c.sharePriceStart) / c.sharePriceStart) * 1000) / 10, apr: c.projectedYield, img: c.image, kind: "Construction", href: `/construction/${id}` }
      return null
    })
    .filter((c): c is FeaturedCard => c !== null)
}
