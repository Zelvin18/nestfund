"use client"

import { useEffect, useState } from "react"
import { fetchRentalProperties, fetchIntelligence, fetchPlatformStats, type PlatformStats } from "./api"
import { rentalProperties as mockRentals, type RentalProperty } from "./data/rentals"
import { intelligenceFeed as mockIntel, marketStats as mockStats, type IntelligenceItem } from "./data/intelligence"

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
