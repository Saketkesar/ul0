import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { UL0Icon } from "@/components/ul0-icon"

export const metadata: Metadata = {
  title: "P2P File Sharing — Coming Back Soon | ul0",
  description: "ul0 P2P file sharing is temporarily unavailable for maintenance. Check back soon.",
  robots: { index: false, follow: false },
}

export default function SharePage() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "#f9fafb" }}>
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "24px",
            padding: "48px 40px",
            maxWidth: 440,
            width: "100%",
            textAlign: "center",
            fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "16px",
              background: "#fef3c7",
              border: "1px solid #fde68a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <UL0Icon name="tools" className="w-6 h-6 text-amber-600" />
          </div>

          <h1
            style={{
              margin: "0 0 10px",
              fontSize: 22,
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.02em",
            }}
          >
            Temporarily Unavailable
          </h1>

          <p style={{ margin: "0 0 28px", fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>
            P2P File Sharing is down for a quick maintenance.
            We&apos;ll be back up shortly.
          </p>

          <a
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 24px",
              borderRadius: "9999px",
              background: "#1B685C",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            ← Back to Home
          </a>
        </div>
      </main>
      <Footer />
    </div>
  )
}
