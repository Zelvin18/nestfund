"use client"

import {
  MagnifyingGlassCircleIcon,
  ChartPieIcon,
  BanknotesIcon,
  ArrowsRightLeftIcon,
} from "@heroicons/react/24/outline"

const steps = [
  {
    icon: MagnifyingGlassCircleIcon,
    color: "#2563eb",
    bg: "#eff6ff",
    step: "01",
    title: "Discover Properties",
    description:
      "Browse AI-curated opportunities with full market intelligence — area scores, growth projections, and rental yield data.",
  },
  {
    icon: ChartPieIcon,
    color: "#7c3aed",
    bg: "#f5f3ff",
    step: "02",
    title: "Buy Shares",
    description:
      "Invest from as little as UGX 50,000. Own a fractional share of premium real estate instantly.",
  },
  {
    icon: BanknotesIcon,
    color: "#16a34a",
    bg: "#f0fdf4",
    step: "03",
    title: "Earn Monthly Income",
    description:
      "Receive your share of rental income every month, automatically deposited to your NestFund wallet.",
  },
  {
    icon: ArrowsRightLeftIcon,
    color: "#ea580c",
    bg: "#fff7ed",
    step: "04",
    title: "Trade & Grow",
    description:
      "Sell shares on our live marketplace at any time. Benefit as property values appreciate over time.",
  },
]

export default function HowItWorks() {
  return (
    <section style={{ backgroundColor: "#fff", padding: "80px 0" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>

        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
            Simple Process
          </p>
          <h2 style={{ fontSize: 34, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.6px", margin: "0 0 12px 0" }}>
            How NestFund Works
          </h2>
          <p style={{ fontSize: 17, color: "#64748b", maxWidth: 500, margin: "0 auto" }}>
            Start earning from real estate in 4 simple steps
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 28, position: "relative" }}>
          {/* Connector line */}
          <div
            style={{
              position: "absolute",
              top: 52,
              left: "12.5%",
              right: "12.5%",
              height: 2,
              background: "linear-gradient(90deg, #bfdbfe 0%, #c4b5fd 50%, #bbf7d0 100%)",
              zIndex: 0,
            }}
          />

          {steps.map((step, i) => (
            <div
              key={i}
              style={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              {/* Step number ring */}
              <div style={{ position: "relative", marginBottom: 24 }}>
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 20,
                    backgroundColor: step.bg,
                    border: `2px solid ${step.color}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 4px 16px ${step.color}20`,
                  }}
                >
                  <step.icon style={{ width: 36, height: 36, color: step.color }} />
                </div>
                {/* Step badge */}
                <div
                  style={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    backgroundColor: step.color,
                    color: "#fff",
                    fontSize: 11,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #fff",
                  }}
                >
                  {i + 1}
                </div>
              </div>

              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: "0 0 10px 0" }}>
                {step.title}
              </h3>
              <p style={{ fontSize: 13, lineHeight: 1.65, color: "#64748b", margin: 0 }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
