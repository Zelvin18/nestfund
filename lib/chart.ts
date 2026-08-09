/* Seeded chart-data generators.
   Deterministic: the same inputs always produce the same series, so the UI
   is stable across reloads and server/client renders. */

const mulberry32 = (seed: number) => () => {
  seed |= 0
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const hashSeed = (s: string) => {
  let h = 9
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 387420489)
  return h
}

/**
 * Price series that tells a coherent story: starts at endPrice/(1+drift%),
 * trends smoothly toward endPrice with seeded noise, and ends exactly at
 * endPrice so the chart always agrees with the displayed share price.
 */
export const generatePriceSeries = (
  seedKey: string,
  endPrice: number,
  points: number,
  totalDriftPct: number,
  labelFor: (i: number, points: number) => string,
) => {
  const rand = mulberry32(hashSeed(seedKey) + points * 7919)
  const start = endPrice / (1 + totalDriftPct / 100)
  const data: { time: string; value: number }[] = []
  let wobble = 0
  for (let i = 0; i < points; i++) {
    const progress = points === 1 ? 1 : i / (points - 1)
    const target = start * Math.pow(endPrice / start, progress)
    // Mean-reverting wobble keeps the line organic without drifting off-story
    wobble = wobble * 0.55 + (rand() - 0.5) * 0.035
    const value = i === points - 1 ? endPrice : target * (1 + wobble)
    data.push({ time: labelFor(i, points), value: Math.round(value) })
  }
  return data
}

/* Card/sparkline series keyed by price + trend */
export const generateChartData = (base: number, points: number = 30, trend: "up" | "down" | "volatile" = "up") => {
  const drift = trend === "up" ? 8 : trend === "down" ? -5 : 2
  return generatePriceSeries(`legacy-${base}-${trend}`, base, points, drift, i => `Day ${i + 1}`)
}
