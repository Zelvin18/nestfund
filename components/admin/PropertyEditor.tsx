"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import {
  ArrowLeftIcon,
  PhotoIcon,
  DocumentTextIcon,
  TrashIcon,
  PlusIcon,
  ArrowTopRightOnSquareIcon,
  BellAlertIcon,
  BuildingOfficeIcon,
  BanknotesIcon,
  Squares2X2Icon,
  ChartBarIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline"
import { CheckCircleIcon } from "@heroicons/react/24/solid"
import { PageHeader, Card, SaveBar, fieldLabel, fieldInput } from "@/components/admin/AdminShell"
import { type RentalProperty, type ActivityItem } from "@/lib/data/rentals"
import { useRentals } from "@/lib/hooks"
import { savePropertyFields, savePropertyImages, addPropertyActivity } from "@/lib/api"

const emptyProperty: RentalProperty = {
  id: "", name: "", location: "", type: "Residential",
  image: "", images: [],
  currentPrice: 0, pricePerShare: 0, totalShares: 5000, availableShares: 5000,
  priceChange: 0, priceChangePercent: 0, rentalYield: 0, areaScore: 50,
  futureGrowth: "Medium", occupancy: 0, investors: 0,
  status: "Draft", lastActivity: "",
  beds: 0, baths: 0, sqm: 0, parking: 0, floors: 0, yearBuilt: new Date().getFullYear(),
  activityFeed: [], tradeHistory: [], chartData: [],
}

export default function PropertyEditor({ id }: { id: string }) {
  const isNew = id === "new"
  const { rentals, live } = useRentals()
  const source = isNew ? emptyProperty : rentals.find(r => r.id === id)
  const [p, setP] = useState<RentalProperty | undefined>(source ? { ...source, images: [...source.images], activityFeed: [...source.activityFeed] } : undefined)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newImageUrl, setNewImageUrl] = useState("")
  const [newActivity, setNewActivity] = useState({ title: "", desc: "", icon: "update" })
  const dirty = useRef(false)

  // When database rows replace the mock (or arrive late), refresh the form —
  // but never clobber edits in progress
  useEffect(() => {
    if (dirty.current || isNew) return
    const fresh = rentals.find(r => r.id === id)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing form state to async-loaded record
    if (fresh) setP({ ...fresh, images: [...fresh.images], activityFeed: [...fresh.activityFeed] })
  }, [rentals, id, isNew])

  if (!p) return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <p style={{ fontSize: 14, color: "#94a3b8" }}>Property not found.</p>
      <Link href="/admin/properties" style={{ fontSize: 13, fontWeight: 700, color: "#2563eb", textDecoration: "none" }}>← Back to properties</Link>
    </div>
  )

  const set = <K extends keyof RentalProperty>(key: K, value: RentalProperty[K]) => {
    dirty.current = true
    setP(prev => prev ? { ...prev, [key]: value } : prev)
    setSaved(false)
    setError(null)
  }

  const num = (v: string) => { const n = parseFloat(v.replace(/,/g, "")); return isNaN(n) ? 0 : n }

  const save = async () => {
    if (!p) return
    setSaving(true)
    setError(null)
    try {
      if (live && !isNew) {
        await savePropertyFields(id, p)
        await savePropertyImages(id, p.images)
      }
      dirty.current = false
      setSaved(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed")
    } finally {
      setSaving(false)
    }
  }

  const addImage = () => {
    if (!newImageUrl.trim()) return
    set("images", [...p.images, newImageUrl.trim()])
    if (!p.image) set("image", newImageUrl.trim())
    setNewImageUrl("")
  }

  const addActivity = async () => {
    if (!newActivity.title.trim()) return
    const entry: ActivityItem = {
      icon: newActivity.icon, title: newActivity.title.trim(),
      desc: newActivity.desc.trim(),
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
    }
    setError(null)
    try {
      if (live && !isNew) await addPropertyActivity(id, { icon: entry.icon, title: entry.title, desc: entry.desc })
      set("activityFeed", [entry, ...p.activityFeed])
      setNewActivity({ title: "", desc: "", icon: "update" })
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not post activity")
    }
  }

  return (
    <>
      <div style={{ marginBottom: 14 }}>
        <Link href="/admin/properties" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: "#94a3b8", textDecoration: "none" }}>
          <ArrowLeftIcon style={{ width: 13, height: 13 }} />
          Properties
        </Link>
      </div>
      <PageHeader
        title={isNew ? "New Property" : p.name}
        subtitle={isNew ? "List a new rental property on the platform" : `${p.location} · ${p.type}`}
        action={!isNew ? (
          <Link href={`/property/${p.id}`} target="_blank" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 10, border: "1.5px solid #e2e8f0", backgroundColor: "#fff", color: "#374151", fontSize: 12.5, fontWeight: 700, textDecoration: "none" }}>
            <ArrowTopRightOnSquareIcon style={{ width: 14, height: 14 }} />
            View on site
          </Link>
        ) : undefined}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(400px, 100%), 1fr))", gap: 16, alignItems: "start" }}>

        {/* ── Left column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          <Card title="General Information" icon={BuildingOfficeIcon}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={fieldLabel}>Property Name</label>
                <input style={fieldInput} value={p.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Sunrise Apartments" />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={fieldLabel}>Description</label>
                <textarea
                  style={{ ...fieldInput, minHeight: 76, resize: "vertical", fontFamily: "inherit", lineHeight: 1.6 }}
                  value={p.description ?? ""}
                  onChange={e => set("description", e.target.value)}
                  placeholder="What investors should know about this property — location advantages, tenants, condition..."
                />
              </div>
              <div>
                <label style={fieldLabel}>Location</label>
                <input style={fieldInput} value={p.location} onChange={e => set("location", e.target.value)} placeholder="Area, District" />
              </div>
              <div>
                <label style={fieldLabel}>Type</label>
                <select style={{ ...fieldInput, cursor: "pointer" }} value={p.type} onChange={e => set("type", e.target.value as RentalProperty["type"])}>
                  <option>Residential</option><option>Commercial</option><option>Hotels</option>
                </select>
              </div>
              <div>
                <label style={fieldLabel}>Status</label>
                <select style={{ ...fieldInput, cursor: "pointer" }} value={p.status} onChange={e => set("status", e.target.value)}>
                  <option>Draft</option><option>Live</option><option>Paused</option><option>Sold</option>
                </select>
              </div>
              <div>
                <label style={fieldLabel}>Growth Outlook</label>
                <select style={{ ...fieldInput, cursor: "pointer" }} value={p.futureGrowth} onChange={e => set("futureGrowth", e.target.value as RentalProperty["futureGrowth"])}>
                  <option>High</option><option>Medium</option><option>Low</option>
                </select>
              </div>
            </div>
          </Card>

          <Card title="Pricing & Shares" subtitle="Share price changes here update every page on the site" icon={BanknotesIcon} accent="#0d9488">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={fieldLabel}>Property Valuation (UGX)</label>
                <input style={fieldInput} inputMode="numeric" value={p.currentPrice.toLocaleString()} onChange={e => set("currentPrice", num(e.target.value))} />
              </div>
              <div>
                <label style={fieldLabel}>Price per Share (UGX)</label>
                <input style={fieldInput} inputMode="numeric" value={p.pricePerShare.toLocaleString()} onChange={e => set("pricePerShare", num(e.target.value))} />
              </div>
              <div>
                <label style={fieldLabel}>Total Shares</label>
                <input style={fieldInput} inputMode="numeric" value={p.totalShares.toLocaleString()} onChange={e => set("totalShares", num(e.target.value))} />
              </div>
              <div>
                <label style={fieldLabel}>Available Shares</label>
                <input style={fieldInput} inputMode="numeric" value={p.availableShares.toLocaleString()} onChange={e => set("availableShares", num(e.target.value))} />
              </div>
              <div>
                <label style={fieldLabel}>Annual Rental Yield (%)</label>
                <input style={fieldInput} inputMode="decimal" value={String(p.rentalYield)} onChange={e => set("rentalYield", num(e.target.value))} />
              </div>
              <div>
                <label style={fieldLabel}>Occupancy (%)</label>
                <input style={fieldInput} inputMode="numeric" value={String(p.occupancy)} onChange={e => set("occupancy", Math.min(100, num(e.target.value)))} />
              </div>
            </div>
            {/* Derived figures preview */}
            <div style={{ marginTop: 14, backgroundColor: "#f8fafc", borderRadius: 10, padding: "11px 14px", display: "flex", gap: 22, flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: "#64748b" }}>
                Implied monthly income: <strong style={{ color: "#0d9488" }}>UGX {Math.round((p.currentPrice * (p.rentalYield / 100)) / 12).toLocaleString()}</strong>
              </span>
              <span style={{ fontSize: 12, color: "#64748b" }}>
                Shares sold: <strong style={{ color: "#0f172a" }}>{p.totalShares ? Math.round(((p.totalShares - p.availableShares) / p.totalShares) * 100) : 0}%</strong>
              </span>
            </div>
          </Card>

          <Card title="Property Specifications" icon={Squares2X2Icon} accent="#7c3aed">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {([
                ["beds", "Bedrooms"], ["baths", "Bathrooms"], ["sqm", "Size (sqm)"],
                ["parking", "Parking"], ["floors", "Floors"], ["yearBuilt", "Year Built"],
              ] as const).map(([key, label]) => (
                <div key={key}>
                  <label style={fieldLabel}>{label}</label>
                  <input style={fieldInput} inputMode="numeric" value={String(p[key])} onChange={e => set(key, num(e.target.value))} />
                </div>
              ))}
            </div>
          </Card>

          <Card title="Post Activity Update" subtitle="Shown in the property's Activities feed — income distributions, occupancy news, valuations" icon={BellAlertIcon} accent="#d97706">
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 140px", gap: 12 }}>
                <div>
                  <label style={fieldLabel}>Title</label>
                  <input style={fieldInput} value={newActivity.title} onChange={e => setNewActivity(a => ({ ...a, title: e.target.value }))} placeholder="e.g. Rental Income Distributed — Feb 2026" />
                </div>
                <div>
                  <label style={fieldLabel}>Type</label>
                  <select style={{ ...fieldInput, cursor: "pointer" }} value={newActivity.icon} onChange={e => setNewActivity(a => ({ ...a, icon: e.target.value }))}>
                    <option value="payment">Payment</option>
                    <option value="update">Update</option>
                    <option value="report">Report</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={fieldLabel}>Description</label>
                <textarea style={{ ...fieldInput, minHeight: 64, resize: "vertical", fontFamily: "inherit" }} value={newActivity.desc} onChange={e => setNewActivity(a => ({ ...a, desc: e.target.value }))} placeholder="Details investors will see..." />
              </div>
              <button onClick={addActivity} style={{ justifySelf: "start", display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 9, border: "none", cursor: "pointer", backgroundColor: "#0f172a", color: "#fff", fontSize: 12.5, fontWeight: 700 }}>
                <BellAlertIcon style={{ width: 14, height: 14 }} />
                Post Update
              </button>
            </div>
            {/* Existing feed */}
            {p.activityFeed.length > 0 && (
              <div style={{ marginTop: 16, borderTop: "1px solid #f0f2f6", paddingTop: 6 }}>
                {p.activityFeed.map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #f7f9fb" }}>
                    <span style={{ fontSize: 9.5, fontWeight: 800, color: a.icon === "payment" ? "#0d9488" : "#2563eb", backgroundColor: a.icon === "payment" ? "#f0fdfa" : "#eff6ff", padding: "2px 8px", borderRadius: 99, flexShrink: 0, textTransform: "uppercase" }}>{a.icon}</span>
                    <p style={{ flex: 1, fontSize: 12.5, fontWeight: 600, color: "#0f172a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.title}</p>
                    <span style={{ fontSize: 11, color: "#b6c1cf", flexShrink: 0 }}>{a.date}</span>
                    <button onClick={() => set("activityFeed", p.activityFeed.filter((_, j) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex" }}>
                      <TrashIcon style={{ width: 13, height: 13, color: "#cbd5e1" }} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* ── Right column ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          <Card title="Images" subtitle="First image is the card thumbnail and gallery cover" icon={PhotoIcon} accent="#0ea5e9">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 14 }}>
              {p.images.map((url, i) => (
                <div key={i} style={{ position: "relative", borderRadius: 9, overflow: "hidden", aspectRatio: "4/3", backgroundColor: "#f1f5f9" }}>
                  <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  {i === 0 && <span style={{ position: "absolute", top: 5, left: 5, fontSize: 8.5, fontWeight: 800, color: "#fff", backgroundColor: "rgba(37,99,235,0.9)", padding: "2px 7px", borderRadius: 99 }}>COVER</span>}
                  <button onClick={() => set("images", p.images.filter((_, j) => j !== i))} style={{ position: "absolute", top: 5, right: 5, width: 22, height: 22, borderRadius: 7, border: "none", cursor: "pointer", backgroundColor: "rgba(15,23,42,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <TrashIcon style={{ width: 12, height: 12, color: "#fff" }} />
                  </button>
                </div>
              ))}
              {p.images.length === 0 && (
                <div style={{ gridColumn: "1 / -1", border: "1.5px dashed #cbd5e1", borderRadius: 10, padding: "22px 0", textAlign: "center" }}>
                  <PhotoIcon style={{ width: 22, height: 22, color: "#cbd5e1", margin: "0 auto 6px" }} />
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>No images yet</p>
                </div>
              )}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input style={{ ...fieldInput, flex: 1 }} value={newImageUrl} onChange={e => setNewImageUrl(e.target.value)} placeholder="Paste image URL (uploads come with storage)" />
              <button onClick={addImage} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "0 16px", borderRadius: 9, border: "none", cursor: "pointer", backgroundColor: "#2563eb", color: "#fff", fontSize: 12.5, fontWeight: 700, flexShrink: 0 }}>
                <PlusIcon style={{ width: 14, height: 14 }} />
                Add
              </button>
            </div>
          </Card>

          <Card title="Documents" subtitle="Title deeds, valuations, prospectus — visible on the property page" icon={DocumentTextIcon} accent="#2563eb">
            {[
              { name: `Title Deed — ${p.name || "Property"}.pdf`, source: "Uganda Land Registry" },
              { name: "Independent Valuation Report.pdf", source: "Knight Frank Uganda" },
              { name: "Investment Prospectus.pdf", source: "NestFund Legal" },
            ].map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 0", borderBottom: "1px solid #f7f9fb" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <DocumentTextIcon style={{ width: 15, height: 15, color: "#2563eb" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12.5, fontWeight: 700, color: "#0f172a", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</p>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{d.source}</p>
                </div>
                <button style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex" }}>
                  <TrashIcon style={{ width: 13, height: 13, color: "#cbd5e1" }} />
                </button>
              </div>
            ))}
            <button style={{ marginTop: 12, width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 0", borderRadius: 10, border: "1.5px dashed #cbd5e1", backgroundColor: "#fafbfd", color: "#2563eb", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}>
              <PlusIcon style={{ width: 14, height: 14 }} />
              Upload Document (needs storage connection)
            </button>
          </Card>

          <Card title="Verification Passport" subtitle="Every check must pass before a property can go Live — the workflow engine ships with admin roles" icon={ShieldCheckIcon} accent="#16a34a">
            {["Title / deed verified", "Owner identity verified", "Independent valuation", "Physical inspection", "Legal review", "Insurance policy"].map(check => (
              <div key={check} style={{ display: "flex", alignItems: "center", gap: 9, padding: "6px 0" }}>
                <CheckCircleIcon style={{ width: 17, height: 17, color: p.status === "Live" ? "#16a34a" : "#cbd5e1", flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: p.status === "Live" ? "#0f172a" : "#94a3b8" }}>{check}</span>
              </div>
            ))}
            <div style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 7, backgroundColor: p.status === "Live" ? "#f0fdf4" : "#fffbeb", border: `1px solid ${p.status === "Live" ? "#dcfce7" : "#fde68a"}`, borderRadius: 99, padding: "6px 16px" }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: p.status === "Live" ? "#16a34a" : "#d97706" }} />
              <span style={{ fontSize: 12, fontWeight: 800, color: p.status === "Live" ? "#166534" : "#92400e", letterSpacing: "0.05em" }}>
                {p.status === "Live" ? "VERIFIED" : p.status.toUpperCase()}
              </span>
            </div>
          </Card>

          <Card title="Market Data" subtitle="24-hour movement shown next to the share price" icon={ChartBarIcon} accent="#dc2626">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={fieldLabel}>Price Change (UGX)</label>
                <input style={fieldInput} inputMode="numeric" value={String(p.priceChange)} onChange={e => set("priceChange", num(e.target.value))} />
              </div>
              <div>
                <label style={fieldLabel}>Change (%)</label>
                <input style={fieldInput} inputMode="decimal" value={String(p.priceChangePercent)} onChange={e => set("priceChangePercent", num(e.target.value))} />
              </div>
              <div>
                <label style={fieldLabel}>Area Score (0–100)</label>
                <input style={fieldInput} inputMode="numeric" value={String(p.areaScore)} onChange={e => set("areaScore", Math.min(100, num(e.target.value)))} />
              </div>
              <div>
                <label style={fieldLabel}>Investors</label>
                <input style={fieldInput} inputMode="numeric" value={String(p.investors)} onChange={e => set("investors", num(e.target.value))} />
              </div>
            </div>
          </Card>

          <SaveBar onSave={save} saved={saved} saving={saving} error={error} label={isNew ? "Create Property" : "Save Changes"} />
        </div>
      </div>
    </>
  )
}
