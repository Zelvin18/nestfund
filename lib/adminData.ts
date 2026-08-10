import { generatePriceSeries } from "./chart"

/* ═══════════════════════════════════════════════════════════════
   ADMIN ANALYTICS — seeded platform-activity series.
   Deterministic synthetic data until real transactions accumulate;
   swaps for aggregate SQL queries when the transaction ledger lands.
═══════════════════════════════════════════════════════════════ */

export type ActivityMetric = "investments" | "deposits" | "withdrawals" | "rental-income" | "payouts" | "exchange-volume"
export type ActivityRange = "24H" | "7D" | "30D" | "1Y"

export const metricMeta: Record<ActivityMetric, { label: string; color: string; base: number; drift: number }> = {
  "investments":     { label: "Investments",     color: "#3b82f6", base: 48_600_000_000, drift: 27.6 },
  "deposits":        { label: "Deposits",        color: "#8b5cf6", base: 6_400_000_000,  drift: 18.2 },
  "withdrawals":     { label: "Withdrawals",     color: "#f59e0b", base: 2_100_000_000,  drift: 9.4 },
  "rental-income":   { label: "Rental Income",   color: "#10b981", base: 1_240_000_000,  drift: 15.7 },
  "payouts":         { label: "Payouts",         color: "#0d9488", base: 1_180_000_000,  drift: 14.9 },
  "exchange-volume": { label: "Exchange Volume", color: "#ec4899", base: 840_000_000,    drift: 31.2 },
}

const rangeConfig: Record<ActivityRange, { points: number; label: (i: number, points: number) => string; driftShare: number }> = {
  "24H": {
    points: 24, driftShare: 0.02,
    label: (i, points) => {
      const d = new Date(); d.setHours(d.getHours() - (points - 1 - i))
      return `${d.getHours()}:00`
    },
  },
  "7D": {
    points: 7, driftShare: 0.06,
    label: (i, points) => {
      const d = new Date(); d.setDate(d.getDate() - (points - 1 - i))
      return d.toLocaleDateString("en-GB", { weekday: "short" })
    },
  },
  "30D": {
    points: 30, driftShare: 0.12,
    label: (i, points) => {
      const d = new Date(); d.setDate(d.getDate() - (points - 1 - i))
      return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
    },
  },
  "1Y": {
    points: 12, driftShare: 1,
    label: (i, points) => {
      const d = new Date(); d.setMonth(d.getMonth() - (points - 1 - i))
      return d.toLocaleDateString("en-GB", { month: "short" })
    },
  },
}

export function platformActivitySeries(metric: ActivityMetric, range: ActivityRange) {
  const m = metricMeta[metric]
  const cfg = rangeConfig[range]
  return generatePriceSeries(`platform-${metric}-${range}`, m.base, cfg.points, m.drift * cfg.driftShare, cfg.label)
}

export const fmtCompact = (v: number) =>
  v >= 1e9 ? `${(v / 1e9).toFixed(1)}B` : v >= 1e6 ? `${(v / 1e6).toFixed(0)}M` : v >= 1e3 ? `${(v / 1e3).toFixed(0)}K` : String(Math.round(v))
