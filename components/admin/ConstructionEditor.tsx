"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon,
  WrenchScrewdriverIcon,
  BanknotesIcon,
  ChartBarIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/outline"
import { PageHeader, Card, SaveBar, fieldLabel, fieldInput } from "@/components/admin/AdminShell"
import { type ConstructionProject } from "@/lib/data/construction"
import { useConstruction } from "@/lib/hooks"
import { saveConstructionFields } from "@/lib/api"

export default function ConstructionEditor({ id }: { id: string }) {
  const { projects, live } = useConstruction()
  const source = projects.find(p => p.id === id)
  const [c, setC] = useState<ConstructionProject | undefined>(source ? { ...source } : undefined)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dirty = useRef(false)

  useEffect(() => {
    if (dirty.current) return
    const fresh = projects.find(p => p.id === id)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing form state to async-loaded record
    if (fresh) setC({ ...fresh })
  }, [projects, id])

  if (!c) return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <p style={{ fontSize: 14, color: "#94a3b8" }}>Project not found.</p>
      <Link href="/admin/construction" style={{ fontSize: 13, fontWeight: 700, color: "#2563eb", textDecoration: "none" }}>← Back to projects</Link>
    </div>
  )

  const set = <K extends keyof ConstructionProject>(key: K, value: ConstructionProject[K]) => {
    dirty.current = true
    setC(prev => prev ? { ...prev, [key]: value } : prev)
    setSaved(false)
    setError(null)
  }

  const num = (v: string) => { const n = parseFloat(v.replace(/,/g, "")); return isNaN(n) ? 0 : n }

  const save = async () => {
    if (!c) return
    setSaving(true)
    setError(null)
    try {
      if (live) await saveConstructionFields(id, c)
      dirty.current = false
      setSaved(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  const fundingPct = c.capitalNeeded ? Math.round((c.capitalRaised / c.capitalNeeded) * 1000) / 10 : 0

  return (
    <>
      <div style={{ marginBottom: 14 }}>
        <Link href="/admin/construction" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: "#94a3b8", textDecoration: "none" }}>
          <ArrowLeftIcon style={{ width: 13, height: 13 }} />
          Construction Projects
        </Link>
      </div>
      <PageHeader
        title={c.name}
        subtitle={`${c.location} · ${c.developer}`}
        action={
          <Link href={`/construction/${c.id}`} target="_blank" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 10, border: "1.5px solid #e2e8f0", backgroundColor: "#fff", color: "#374151", fontSize: 12.5, fontWeight: 700, textDecoration: "none" }}>
            <ArrowTopRightOnSquareIcon style={{ width: 14, height: 14 }} />
            View on site
          </Link>
        }
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(400px, 100%), 1fr))", gap: 16, alignItems: "start" }}>

        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card title="Project Information" icon={WrenchScrewdriverIcon} accent="#d97706">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={fieldLabel}>Project Name</label>
                <input style={fieldInput} value={c.name} onChange={e => set("name", e.target.value)} />
              </div>
              <div>
                <label style={fieldLabel}>Location</label>
                <input style={fieldInput} value={c.location} onChange={e => set("location", e.target.value)} />
              </div>
              <div>
                <label style={fieldLabel}>Developer</label>
                <input style={fieldInput} value={c.developer} onChange={e => set("developer", e.target.value)} />
              </div>
              <div>
                <label style={fieldLabel}>Stage Label</label>
                <input style={fieldInput} value={c.stage} onChange={e => set("stage", e.target.value)} placeholder="e.g. Construction funding" />
              </div>
              <div>
                <label style={fieldLabel}>Status</label>
                <input style={fieldInput} value={c.status} onChange={e => set("status", e.target.value)} placeholder="e.g. Foundation Stage" />
              </div>
              <div>
                <label style={fieldLabel}>Expected Completion</label>
                <input style={fieldInput} value={c.expectedCompletion} onChange={e => set("expectedCompletion", e.target.value)} placeholder="e.g. June 2028" />
              </div>
              <div>
                <label style={fieldLabel}>Investors</label>
                <input style={fieldInput} inputMode="numeric" value={String(c.investors)} onChange={e => set("investors", num(e.target.value))} />
              </div>
            </div>
          </Card>

          <Card title="Funding & Progress" subtitle="Drives the funding bars across the site" icon={ChartBarIcon} accent="#2563eb">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={fieldLabel}>Project Cost (UGX)</label>
                <input style={fieldInput} inputMode="numeric" value={c.projectCost.toLocaleString()} onChange={e => set("projectCost", num(e.target.value))} />
              </div>
              <div>
                <label style={fieldLabel}>Developer Investment (UGX)</label>
                <input style={fieldInput} inputMode="numeric" value={c.developerInvestment.toLocaleString()} onChange={e => set("developerInvestment", num(e.target.value))} />
              </div>
              <div>
                <label style={fieldLabel}>Capital Needed (UGX)</label>
                <input style={fieldInput} inputMode="numeric" value={c.capitalNeeded.toLocaleString()} onChange={e => set("capitalNeeded", num(e.target.value))} />
              </div>
              <div>
                <label style={fieldLabel}>Capital Raised (UGX)</label>
                <input style={fieldInput} inputMode="numeric" value={c.capitalRaised.toLocaleString()} onChange={e => { set("capitalRaised", num(e.target.value)); }} />
              </div>
              <div>
                <label style={fieldLabel}>Funding Progress (%)</label>
                <input style={fieldInput} inputMode="decimal" value={String(c.fundingProgress)} onChange={e => set("fundingProgress", Math.min(100, num(e.target.value)))} />
              </div>
              <div>
                <label style={fieldLabel}>Construction Progress (%)</label>
                <input style={fieldInput} inputMode="decimal" value={String(c.constructionProgress)} onChange={e => set("constructionProgress", Math.min(100, num(e.target.value)))} />
              </div>
            </div>
            <div style={{ marginTop: 14, backgroundColor: "#f8fafc", borderRadius: 10, padding: "11px 14px" }}>
              <span style={{ fontSize: 12, color: "#64748b" }}>
                Implied funding from capital figures: <strong style={{ color: "#2563eb" }}>{fundingPct}%</strong>
                {Math.abs(fundingPct - c.fundingProgress) > 1 && <span style={{ color: "#d97706" }}> — differs from the Funding Progress field above</span>}
              </span>
            </div>
          </Card>
        </div>

        {/* Right */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card title="Share Pricing" subtitle="Start price, current price, and projected value at completion" icon={BanknotesIcon} accent="#0d9488">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={fieldLabel}>Start Price (UGX)</label>
                <input style={fieldInput} inputMode="numeric" value={c.sharePriceStart.toLocaleString()} onChange={e => set("sharePriceStart", num(e.target.value))} />
              </div>
              <div>
                <label style={fieldLabel}>Current Price (UGX)</label>
                <input style={fieldInput} inputMode="numeric" value={c.sharePrice.toLocaleString()} onChange={e => set("sharePrice", num(e.target.value))} />
              </div>
              <div>
                <label style={fieldLabel}>Price at Completion (UGX)</label>
                <input style={fieldInput} inputMode="numeric" value={c.sharePriceAtCompletion.toLocaleString()} onChange={e => set("sharePriceAtCompletion", num(e.target.value))} />
              </div>
              <div>
                <label style={fieldLabel}>Est. Property Value (UGX)</label>
                <input style={fieldInput} inputMode="numeric" value={c.estimatedPropertyValue.toLocaleString()} onChange={e => set("estimatedPropertyValue", num(e.target.value))} />
              </div>
              <div>
                <label style={fieldLabel}>Projected Yield (%)</label>
                <input style={fieldInput} inputMode="decimal" value={String(c.projectedYield)} onChange={e => set("projectedYield", num(e.target.value))} />
              </div>
              <div>
                <label style={fieldLabel}>Projected ROI (%)</label>
                <input style={fieldInput} inputMode="decimal" value={String(c.projectedROI)} onChange={e => set("projectedROI", num(e.target.value))} />
              </div>
              <div>
                <label style={fieldLabel}>Total Shares</label>
                <input style={fieldInput} inputMode="numeric" value={c.totalShares.toLocaleString()} onChange={e => set("totalShares", num(e.target.value))} />
              </div>
              <div>
                <label style={fieldLabel}>Available Shares</label>
                <input style={fieldInput} inputMode="numeric" value={c.availableShares.toLocaleString()} onChange={e => set("availableShares", num(e.target.value))} />
              </div>
            </div>
          </Card>

          <Card title="Specifications" icon={Squares2X2Icon} accent="#7c3aed">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              <div>
                <label style={fieldLabel}>Bedrooms</label>
                <input style={fieldInput} inputMode="numeric" value={String(c.beds)} onChange={e => set("beds", num(e.target.value))} />
              </div>
              <div>
                <label style={fieldLabel}>Bathrooms</label>
                <input style={fieldInput} inputMode="numeric" value={String(c.baths)} onChange={e => set("baths", num(e.target.value))} />
              </div>
              <div>
                <label style={fieldLabel}>Size (sqm)</label>
                <input style={fieldInput} inputMode="numeric" value={String(c.sqm)} onChange={e => set("sqm", num(e.target.value))} />
              </div>
            </div>
          </Card>

          <SaveBar onSave={save} saved={saved} saving={saving} error={error} />
        </div>
      </div>
    </>
  )
}
