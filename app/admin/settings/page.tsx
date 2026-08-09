"use client"

import { useState, useEffect } from "react"
import { CheckCircleIcon } from "@heroicons/react/24/solid"
import { PageHeader, Card, SaveBar, fieldLabel, fieldInput } from "@/components/admin/AdminShell"
import { constructionProjects } from "@/lib/data/construction"
import { useRentals, usePlatformStats } from "@/lib/hooks"
import { fetchSiteSetting, saveSiteSetting } from "@/lib/api"

export default function AdminSettings() {
  const { rentals: rentalProperties } = useRentals()
  const liveStats = usePlatformStats()
  // Featured content selections
  const [homeHeroId, setHomeHeroId] = useState("sunrise-apartments")
  const [landingIds, setLandingIds] = useState<string[]>(["sunrise-apartments", "acacia-office-park", "ibis-residences-ii"])
  const [stats, setStats] = useState({ ...liveStats })
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dirty, setDirty] = useState(false)

  // Load stored selections from the database
  /* eslint-disable react-hooks/set-state-in-effect -- syncing form state to async-loaded settings */
  useEffect(() => {
    if (!dirty) setStats({ ...liveStats })
  }, [liveStats, dirty])

  useEffect(() => {
    let active = true
    fetchSiteSetting<{ featuredPropertyId: string }>("home_hero")
      .then(v => { if (active && v?.featuredPropertyId) setHomeHeroId(v.featuredPropertyId) })
      .catch(() => {})
    fetchSiteSetting<{ featuredPropertyIds: string[] }>("landing_hero")
      .then(v => { if (active && v?.featuredPropertyIds) setLandingIds(v.featuredPropertyIds) })
      .catch(() => {})
    return () => { active = false }
  }, [])
  /* eslint-enable react-hooks/set-state-in-effect */

  const save = async () => {
    setSaving(true)
    setError(null)
    try {
      await saveSiteSetting("platform_stats", stats)
      await saveSiteSetting("home_hero", { featuredPropertyId: homeHeroId })
      await saveSiteSetting("landing_hero", { featuredPropertyIds: landingIds })
      setSaved(true)
      setDirty(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  const allFeaturable = [
    ...rentalProperties.map(p => ({ id: p.id, name: p.name, image: p.image, sub: `Rental · UGX ${p.pricePerShare.toLocaleString()}/share` })),
    ...constructionProjects.map(p => ({ id: p.id, name: p.name, image: p.image, sub: `Construction · UGX ${p.sharePrice.toLocaleString()}/share` })),
  ]

  const toggleLanding = (id: string) => {
    setSaved(false)
    setLandingIds(prev => prev.includes(id)
      ? prev.filter(x => x !== id)
      : prev.length >= 3 ? [...prev.slice(1), id] : [...prev, id])
  }

  return (
    <>
      <PageHeader
        title="Site Settings"
        subtitle="Control what appears on the landing page, home hero, and platform stats — no code changes needed"
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(400px, 100%), 1fr))", gap: 16, alignItems: "start" }}>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Home hero featured property */}
          <Card title="Home Hero — Featured Property" subtitle="The property card shown next to the headline on /home">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {rentalProperties.map(p => {
                const active = homeHeroId === p.id
                return (
                  <button key={p.id} onClick={() => { setHomeHeroId(p.id); setSaved(false) }} style={{
                    display: "flex", alignItems: "center", gap: 12, textAlign: "left", cursor: "pointer",
                    padding: "9px 11px", borderRadius: 11,
                    border: active ? "1.5px solid #2563eb" : "1.5px solid #eef1f5",
                    backgroundColor: active ? "#f6f9ff" : "#fff",
                  }}>
                    <img src={p.image} alt="" style={{ width: 46, height: 36, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: 0 }}>{p.name}</p>
                      <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{p.location} · {p.rentalYield}% yield</p>
                    </div>
                    {active && <CheckCircleIcon style={{ width: 18, height: 18, color: "#2563eb", flexShrink: 0 }} />}
                  </button>
                )
              })}
            </div>
          </Card>

          {/* Platform stats */}
          <Card title="Platform Statistics" subtitle="Shown on the landing page and Live Market Overview">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={fieldLabel}>Market Volume</label>
                <input style={fieldInput} value={stats.marketVolume} onChange={e => { setStats(s => ({ ...s, marketVolume: e.target.value })); setSaved(false); setDirty(true) }} />
              </div>
              <div>
                <label style={fieldLabel}>Total Investors</label>
                <input style={fieldInput} inputMode="numeric" value={String(stats.totalInvestors)} onChange={e => { setStats(s => ({ ...s, totalInvestors: parseInt(e.target.value.replace(/\D/g, "")) || 0 })); setSaved(false); setDirty(true) }} />
              </div>
              <div>
                <label style={fieldLabel}>Active Listings</label>
                <input style={fieldInput} inputMode="numeric" value={String(stats.activeListings)} onChange={e => { setStats(s => ({ ...s, activeListings: parseInt(e.target.value.replace(/\D/g, "")) || 0 })); setSaved(false); setDirty(true) }} />
              </div>
              <div>
                <label style={fieldLabel}>Avg. Annual Return (%)</label>
                <input style={fieldInput} inputMode="decimal" value={String(stats.avgAnnualReturn)} onChange={e => { setStats(s => ({ ...s, avgAnnualReturn: parseFloat(e.target.value) || 0 })); setSaved(false); setDirty(true) }} />
              </div>
            </div>
            <p style={{ fontSize: 11.5, color: "#b6c1cf", margin: "12px 0 0 0", lineHeight: 1.55 }}>
              Once the database is connected these become live-computed from real data — investor counts, volumes, and returns update automatically as the platform grows.
            </p>
          </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Landing hero cards */}
          <Card title="Landing Page — Hero Property Cards" subtitle="Pick up to 3 properties shown in the landing hero strip">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {allFeaturable.map(p => {
                const active = landingIds.includes(p.id)
                return (
                  <button key={p.id} onClick={() => toggleLanding(p.id)} style={{
                    display: "flex", alignItems: "center", gap: 12, textAlign: "left", cursor: "pointer",
                    padding: "9px 11px", borderRadius: 11,
                    border: active ? "1.5px solid #0d9488" : "1.5px solid #eef1f5",
                    backgroundColor: active ? "#f0fdfa" : "#fff",
                  }}>
                    <img src={p.image} alt="" style={{ width: 46, height: 36, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: 0 }}>{p.name}</p>
                      <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{p.sub}</p>
                    </div>
                    <span style={{
                      width: 18, height: 18, borderRadius: 6, flexShrink: 0, boxSizing: "border-box",
                      border: active ? "none" : "2px solid #cbd5e1",
                      backgroundColor: active ? "#0d9488" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {active && <span style={{ color: "#fff", fontSize: 11, fontWeight: 800, lineHeight: 1 }}>✓</span>}
                    </span>
                  </button>
                )
              })}
            </div>
            <p style={{ fontSize: 11.5, color: "#b6c1cf", margin: "12px 0 0 0" }}>
              {landingIds.length}/3 selected — selecting a 4th replaces the oldest pick.
            </p>
          </Card>

          <SaveBar onSave={save} saved={saved} saving={saving} error={error} label="Save Settings" />
        </div>
      </div>
    </>
  )
}
