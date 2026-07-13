import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Daily Quotes — Motivational & Inspiring Quotes | ul0.site",
  description: "Get daily motivational, inspiring, and thought-provoking quotes. Browse curated quotes by category — free, no signup required.",
  keywords: ["daily quotes online", "motivational quotes", "inspiring quotes", "quote generator", "free quotes tool"],
  alternates: { canonical: "https://ul0.site/quotes" },
  openGraph: { title: "Free Daily Quotes | ul0.site", description: "Curated daily motivational and inspiring quotes. Free online.", url: "https://ul0.site/quotes", siteName: "ul0.site", type: "website" },
}
export default function QuotesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
