interface Section {
  title: string
  body: string
}

export default function LegalPage({ label, title, updated, sections }: {
  label: string
  title: string
  updated: string
  sections: Section[]
}) {
  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e8ecf0" }}>
        <div className="container" style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 36px" }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px 0" }}>{label}</p>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.8px", margin: "0 0 8px 0" }}>{title}</h1>
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>{updated}</p>
        </div>
      </div>

      {/* Body */}
      <div className="container" style={{ maxWidth: 760, margin: "0 auto", padding: "36px 24px 64px" }}>
        <div style={{ backgroundColor: "#fff", border: "1px solid #e8ecf0", borderRadius: 16, padding: "clamp(20px, 4vw, 40px)" }}>
          {sections.map((s, i) => (
            <div key={i} style={{ marginBottom: i === sections.length - 1 ? 0 : 28 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", margin: "0 0 8px 0" }}>{s.title}</h2>
              <p style={{ fontSize: 14.5, color: "#475569", lineHeight: 1.75, margin: 0 }}>{s.body}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", marginTop: 24 }}>
          Investments carry risk. Past performance is not indicative of future results.
        </p>
      </div>
    </div>
  )
}
