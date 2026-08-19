import Link from "next/link"

export default function NotFound() {
  return (
    <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 24px", textAlign: "center", backgroundColor: "#f8fafc" }}>
      <p style={{ fontSize: 13, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 12px 0" }}>404 — Page Not Found</p>
      <h1 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: 800, color: "#0f172a", letterSpacing: "-1px", margin: "0 0 14px 0" }}>
        This page doesn&apos;t exist
      </h1>
      <p style={{ fontSize: 16, color: "#64748b", maxWidth: 440, margin: "0 0 32px 0", lineHeight: 1.65 }}>
        The page you&apos;re looking for was moved, removed, or never listed. Head back to the marketplace to keep exploring.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/" style={{ padding: "12px 28px", borderRadius: 10, background: "linear-gradient(135deg, #2563eb, #4f46e5)", color: "#fff", fontSize: 15, fontWeight: 700, textDecoration: "none" }}>
          Back to Home
        </Link>
        <Link href="/opportunities" style={{ padding: "12px 24px", borderRadius: 10, border: "1.5px solid #e2e8f0", backgroundColor: "#fff", color: "#374151", fontSize: 15, fontWeight: 600, textDecoration: "none" }}>
          Browse Opportunities
        </Link>
      </div>
    </div>
  )
}
