"use client"

import { CheckBadgeIcon } from "@heroicons/react/24/solid"

/* Shared left-side showcase panel for the auth pages — a living
   preview of the market instead of a flat blue box. */
export default function AuthPanel() {
  return (
    <div className="auth-left" style={{ position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "40px 44px", minHeight: "100vh" }}>
      {/* Background photo + overlay */}
      <div style={{ position: "absolute", inset: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80"
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(8,18,36,0.94) 0%, rgba(10,30,60,0.88) 55%, rgba(13,60,80,0.82) 100%)" }} />
      </div>

      {/* Top: logo */}
      <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #2563eb, #4f46e5)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 17, color: "#fff" }}>N</div>
        <span style={{ fontSize: 19, fontWeight: 700, color: "#fff", letterSpacing: "-0.3px" }}>NestFund</span>
      </div>

      {/* Middle: pitch + floating property card */}
      <div style={{ position: "relative" }}>
        <h2 style={{ fontSize: "clamp(26px, 2.6vw, 36px)", fontWeight: 400, color: "rgba(255,255,255,0.88)", lineHeight: 1.25, letterSpacing: "-0.4px", margin: "0 0 4px 0" }}>
          Your money shouldn&apos;t sit idle.
        </h2>
        <h2 style={{ fontSize: "clamp(26px, 2.6vw, 36px)", fontWeight: 700, color: "#fff", lineHeight: 1.25, letterSpacing: "-0.4px", margin: "0 0 16px 0" }}>
          Put it to work.
        </h2>
        <p style={{ fontSize: 14.5, color: "rgba(255,255,255,0.6)", lineHeight: 1.75, maxWidth: 380, margin: "0 0 28px 0" }}>
          Invest from UGX 50,000 in verified opportunities — contracts, trade, productive assets and real estate — and track every shilling as it works.
        </p>

        {/* Mini property card */}
        <div style={{ backgroundColor: "rgba(255,255,255,0.08)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.14)", borderRadius: 16, padding: "16px 18px", maxWidth: 340 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", margin: "0 0 2px 0" }}>Sunrise Apartments</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: 0 }}>Kiira, Wakiso · 100% occupied</p>
            </div>
            <CheckBadgeIcon style={{ width: 20, height: 20, color: "#34d399", flexShrink: 0 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <p style={{ fontSize: 17, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.3px" }}>UGX 1,250</p>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", margin: 0 }}>per share</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#34d399", margin: 0 }}>+4.34%</p>
              <p style={{ fontSize: 11, color: "#5eead4", margin: 0 }}>11.2% yield</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: stats + trust line */}
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", gap: 22, flexWrap: "wrap", marginBottom: 16 }}>
          {[
            { value: "14,250+", label: "investors" },
            { value: "UGX 24.6B", label: "invested" },
            { value: "UGX 4.2B", label: "paid out" },
          ].map(s => (
            <div key={s.label}>
              <p style={{ fontSize: 19, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.4px" }}>{s.value}</p>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.4)", margin: 0 }}>
          Every opportunity independently verified · Investments carry risk
        </p>
      </div>
    </div>
  )
}
