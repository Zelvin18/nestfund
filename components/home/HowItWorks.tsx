"use client"

import {
  MagnifyingGlassCircleIcon,
  ChartPieIcon,
  BanknotesIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/24/outline"
import { ArrowTrendingUpIcon } from "@heroicons/react/24/solid"
import Sparkline from "@/components/ui/Sparkline"

const steps = [
  {
    icon: MagnifyingGlassCircleIcon,
    color: "#2563eb", bg: "#eff6ff", step: "01",
    title: "Discover Opportunities",
    description: "Browse verified opportunities across contracts, trade, productive assets and property — each with its duration, target return and risks.",
    stat: { label: "Opportunities Listed", value: "312+" },
    sparkData: [10,14,12,16,15,19,18,22,20,25,23,28,26,30,28,32,30,34,32,36,34,38,36,40,38,42],
  },
  {
    icon: ChartPieIcon,
    color: "#7c3aed", bg: "#f5f3ff", step: "02",
    title: "Invest Any Amount",
    description: "Invest from as little as UGX 50,000. Own a fractional stake in any opportunity instantly.",
    stat: { label: "Min. Investment", value: "UGX 50K" },
    sparkData: [5,8,7,11,10,14,13,17,16,20,19,23,22,26,25,29,28,32,31,35,34,38,37,41,40,44],
  },
  {
    icon: BanknotesIcon,
    color: "#16a34a", bg: "#f0fdf4", step: "03",
    title: "Earn As It Pays Out",
    description: "Receive your share of the proceeds — rental income, contract payments or trade profits — straight to your NestFund wallet.",
    stat: { label: "Avg. Yield", value: "8.6%" },
    sparkData: [30,32,31,34,33,36,35,38,37,40,39,42,41,44,43,46,45,48,47,50,49,52,51,54,53,56],
  },
  {
    icon: ArrowsRightLeftIcon,
    color: "#ea580c", bg: "#fff7ed", step: "04",
    title: "Trade & Grow",
    description: "Sell property shares on our live Exchange at any time, and reinvest proceeds into new opportunities as they open.",
    stat: { label: "Avg. Growth", value: "+18%" },
    sparkData: [20,22,21,25,24,28,27,31,30,34,33,37,36,40,39,43,42,46,45,49,48,52,51,55,54,58],
  },
]

export default function HowItWorks() {
  return (
    <section className="section-pad" style={{ backgroundColor: "#fff", padding: "80px 0" }}>
      <div className="container" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>

        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
            Process
          </p>
          <h2 style={{ fontSize: 34, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.6px", margin: "0 0 12px 0" }}>
            How NestFund Works
          </h2>
          <p style={{ fontSize: 16, color: "#64748b", maxWidth: 480, margin: "0 auto" }}>
            Start earning from real opportunities in 4 simple steps
          </p>
        </div>

        <div className="steps-grid" style={{ position: "relative" }}>
          {/* Connector line */}
          <div
            className="steps-connector"
            style={{
              position: "absolute", top: 52, left: "12.5%", right: "12.5%",
              height: 1,
              background: "linear-gradient(90deg, #bfdbfe 0%, #c4b5fd 50%, #bbf7d0 100%)",
              zIndex: 0,
            }}
          />

          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                position: "relative", zIndex: 1,
                backgroundColor: "#fff",
                borderRadius: 16,
                border: "1.5px solid #f1f5f9",
                padding: "24px 20px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {/* Icon + step number — uniform grey, one calm style */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  backgroundColor: "#f1f5f9", border: "1px solid #e8edf4",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <step.icon style={{ width: 26, height: 26, color: "#64748b" }} />
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 800, color: "#64748b",
                  backgroundColor: "#f1f5f9", padding: "4px 10px",
                  borderRadius: 99, letterSpacing: "0.05em",
                }}>
                  {step.step}
                </span>
              </div>

              {/* Title + description */}
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 8px 0" }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: "#64748b", margin: 0 }}>
                  {step.description}
                </p>
              </div>

              {/* Sparkline + stat — fills empty space */}
              <div style={{
                borderTop: "1px solid #f8fafc",
                paddingTop: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
              }}>
                <div>
                  <p style={{ fontSize: 10, color: "#94a3b8", margin: "0 0 2px 0", fontWeight: 500 }}>
                    {step.stat.label}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <ArrowTrendingUpIcon style={{ width: 12, height: 12, color: "#10b981" }} />
                    <p style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", margin: 0 }}>
                      {step.stat.value}
                    </p>
                  </div>
                </div>
                <Sparkline
                  data={step.sparkData}
                  width={80}
                  height={32}
                  positive={true}
                  strokeWidth={1.8}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
