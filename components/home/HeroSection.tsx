"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { ArrowRightIcon, PlayCircleIcon } from "@heroicons/react/24/outline"
import { ArrowTrendingUpIcon, CheckBadgeIcon } from "@heroicons/react/24/solid"
import { useLandingFeatured } from "@/lib/hooks"

export default function HeroSection() {
  // The rotating cards are the featured opportunities from Admin → Site Settings
  const featured = useLandingFeatured()
  const [slide, setSlide] = useState(0)
  const hovering = useRef(false)

  useEffect(() => {
    if (featured.length < 2) return
    const t = setInterval(() => {
      if (!hovering.current) setSlide(s => (s + 1) % featured.length)
    }, 5000)
    return () => clearInterval(t)
  }, [featured.length])

  return (
    <section
      className="hero-section"
      style={{
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#0a1628",
        padding: "76px 0 68px",
        maxWidth: "100vw",
      }}
    >
      {/* Full-bleed architecture photo */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img
          src="https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=1800&q=80"
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }}
        />
        {/* Navy overlay keeps text readable while the towers show through */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(8,18,36,0.96) 0%, rgba(10,26,54,0.88) 45%, rgba(12,30,62,0.72) 100%)" }} />
        {/* Soft glow accents */}
        <div style={{ position: "absolute", top: -180, right: "8%", width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 65%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -220, left: "-6%", width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(13,148,136,0.14) 0%, transparent 65%)", pointerEvents: "none" }} />
      </div>

      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
        }}
        className="hero-grid container"
      >
        {/* Left — copy */}
        <div>
          {/* Eyebrow label */}
          <p style={{
            fontSize: 12.5,
            fontWeight: 500,
            color: "rgba(255,255,255,0.55)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            margin: "0 0 18px 0",
          }}>
            The Investment Marketplace
          </p>

          {/* Headline — clean, landing-page style */}
          <h1
            style={{
              fontSize: "clamp(34px, 4.6vw, 54px)",
              fontWeight: 400,
              lineHeight: 1.18,
              letterSpacing: "-0.3px",
              color: "rgba(255,255,255,0.88)",
              margin: "0 0 22px 0",
            }}
          >
            Fund Real Opportunities.
            <br />
            <span style={{ fontWeight: 700, color: "#fff" }}>
              Earn Real Returns.
            </span>
          </h1>

          {/* Description */}
          <p
            className="hero-desc"
            style={{
              fontSize: 17,
              lineHeight: 1.75,
              color: "rgba(255,255,255,0.62)",
              margin: "0 0 34px 0",
              maxWidth: 480,
            }}
          >
            Invest from UGX 50,000 in verified opportunities — contracts, trade,
            productive assets and property — and receive proceeds as each one pays out.
          </p>

          {/* CTA buttons */}
          <div className="hero-ctas" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link
              href="/opportunities"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                borderRadius: 11,
                background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: "0 8px 28px rgba(37,99,235,0.45)",
              }}
            >
              Start Investing
              <ArrowRightIcon style={{ width: 18, height: 18 }} />
            </Link>
            <Link
              href="/exchange"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 24px",
                borderRadius: 11,
                border: "1.5px solid rgba(255,255,255,0.18)",
                backgroundColor: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.92)",
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                backdropFilter: "blur(6px)",
              }}
            >
              <PlayCircleIcon style={{ width: 19, height: 19 }} />
              See the Exchange
            </Link>
          </div>

        </div>

        {/* Right — live property card */}
        <div style={{ position: "relative" }} className="hero-right">
          {/* Floating portfolio value chip */}
          <div
            style={{
              position: "absolute",
              top: 18,
              left: -26,
              zIndex: 10,
              backgroundColor: "rgba(255,255,255,0.98)",
              borderRadius: 13,
              padding: "11px 15px",
              boxShadow: "0 16px 48px rgba(0,0,0,0.35)",
              border: "1px solid rgba(255,255,255,0.6)",
              minWidth: 150,
              animation: "float-a 5.5s ease-in-out infinite",
            }}
          >
            <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 2px 0", fontWeight: 500 }}>Portfolio Value</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 2px 0" }}>UGX 14.8M</p>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 700, color: "#10b981" }}>
              <ArrowTrendingUpIcon style={{ width: 12, height: 12 }} />
              +4.62% Today
            </div>
          </div>

          {/* Floating income chip */}
          <div
            style={{
              position: "absolute",
              bottom: 74,
              right: -22,
              zIndex: 10,
              backgroundColor: "rgba(255,255,255,0.98)",
              borderRadius: 13,
              padding: "11px 15px",
              boxShadow: "0 16px 48px rgba(0,0,0,0.35)",
              border: "1px solid rgba(255,255,255,0.6)",
              animation: "float-b 6.5s ease-in-out infinite",
            }}
          >
            <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 2px 0", fontWeight: 500 }}>Monthly Income</p>
            <p style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: "0 0 2px 0" }}>UGX 185K</p>
            <p style={{ fontSize: 11, color: "#10b981", fontWeight: 600, margin: 0 }}>Paid on the 5th, automatically</p>
          </div>

          {/* Rotating opportunity carousel — one slide per featured record */}
          <div
            onMouseEnter={() => { hovering.current = true }}
            onMouseLeave={() => { hovering.current = false }}
            style={{ position: "relative", maxWidth: 420, marginLeft: "auto", minHeight: 442 }}
          >
            {featured.map((c, i) => {
              const active = i === slide
              return (
                <div
                  key={c.id}
                  style={{
                    position: i === 0 ? "relative" : "absolute",
                    inset: i === 0 ? undefined : 0,
                    opacity: active ? 1 : 0,
                    transform: active ? "translateX(0) scale(1)" : "translateX(28px) scale(0.98)",
                    transition: "opacity 0.65s ease, transform 0.65s ease",
                    pointerEvents: active ? "auto" : "none",
                    zIndex: active ? 2 : 1,
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: 20,
                      boxShadow: "0 32px 80px rgba(0,0,0,0.45)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    {/* Image */}
                    <div style={{ position: "relative", height: 200, overflow: "hidden", flexShrink: 0 }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.img} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)" }} />
                      <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6 }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, backgroundColor: "rgba(255,255,255,0.94)", borderRadius: 99, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "#16a34a", backdropFilter: "blur(4px)" }}>
                          <CheckBadgeIcon style={{ width: 13, height: 13 }} />
                          Verified
                        </span>
                        <span style={{ display: "inline-flex", alignItems: "center", backgroundColor: c.accent, borderRadius: 99, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "#fff", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                          {c.kind}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, gap: 10 }}>
                        <div style={{ minWidth: 0 }}>
                          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: "0 0 3px 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {c.name}
                          </h3>
                          <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.location}</p>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <p style={{ fontSize: 20, fontWeight: 800, color: "#0f172a", margin: "0 0 2px 0", letterSpacing: "-0.5px" }}>
                            UGX {c.price.toLocaleString()}
                          </p>
                          <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{c.unitLabel}</p>
                        </div>
                      </div>

                      {/* Funding progress */}
                      <div style={{ backgroundColor: "#f8fafc", borderRadius: 10, padding: "10px 14px", marginBottom: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Funding progress</span>
                          <span style={{ fontSize: 11, fontWeight: 800, color: "#0f172a" }}>{c.progress}%</span>
                        </div>
                        <div style={{ height: 6, borderRadius: 99, backgroundColor: "#eef1f5", overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${c.progress}%`, borderRadius: 99, backgroundColor: c.accent, transition: "width 0.6s ease" }} />
                        </div>
                      </div>

                      {/* Stat tiles */}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                        <div style={{ backgroundColor: "#f8fafc", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                          <p style={{ fontSize: 10, color: "#94a3b8", margin: "0 0 3px 0", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.03em" }}>Target Return</p>
                          <p style={{ fontSize: 13.5, fontWeight: 750, color: "#10b981", margin: 0, whiteSpace: "nowrap" }}>{c.returnTag}</p>
                        </div>
                        <div style={{ backgroundColor: "#f8fafc", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
                          <p style={{ fontSize: 10, color: "#94a3b8", margin: "0 0 3px 0", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.03em" }}>Category</p>
                          <p style={{ fontSize: 13.5, fontWeight: 750, color: c.accent, margin: 0 }}>{c.kind}</p>
                        </div>
                      </div>

                      {/* CTA */}
                      <Link
                        href={c.href}
                        style={{
                          display: "block", width: "100%", marginTop: "auto",
                          padding: "12px 0", borderRadius: 10,
                          background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
                          color: "#fff", fontSize: 13, fontWeight: 700,
                          textAlign: "center", textDecoration: "none", boxSizing: "border-box",
                        }}
                      >
                        View Opportunity — UGX {c.price.toLocaleString()}/{c.unitLabel.replace("per ", "")}
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Slide dots */}
            {featured.length > 1 && (
              <div style={{ position: "absolute", bottom: -26, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 7, zIndex: 3 }}>
                {featured.map((c, i) => (
                  <button
                    key={c.id}
                    onClick={() => setSlide(i)}
                    aria-label={`Show ${c.name}`}
                    style={{
                      width: i === slide ? 22 : 8, height: 8, borderRadius: 99, border: "none", cursor: "pointer",
                      backgroundColor: i === slide ? "#fff" : "rgba(255,255,255,0.35)",
                      transition: "all 0.3s ease", padding: 0,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
