import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowLeft, Check, Sparkles, BarChart2, ShieldCheck, Zap } from "lucide-react"

export const metadata: Metadata = {
  title: "UTM Campaign Tracking Guide 2026: Attribute Every Conversion | ul0",
  description:
    "Master UTM parameter tagging and campaign tracking in 2026. Learn best practices for Google Analytics 4, avoid fractured reporting, and shorten tagged links cleanly.",
  alternates: {
    canonical: "https://ul0.site/blog/utm-builder-tracking-guide-2026",
  },
  openGraph: {
    title: "UTM Campaign Tracking Guide 2026: Attribute Every Conversion | ul0",
    description: "Learn how to build bulletproof UTM links, avoid messy multi-channel attribution, and clean up 200-character URLs with branded short links.",
    url: "https://ul0.site/blog/utm-builder-tracking-guide-2026",
    type: "article",
    images: [{ url: "https://ul0.site/ul0.png" }],
  },
}

export default function UtmTrackingGuidePage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-1 py-10 px-4 sm:px-6">
        <article className="mx-auto max-w-3xl space-y-8">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/blog" className="hover:text-foreground inline-flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" /> Back to blog
            </Link>
            <span>/</span>
            <span className="text-foreground">Analytics &amp; Attribution</span>
          </div>

          <header className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500 border border-blue-500/20">
              <Sparkles className="h-3 w-3" />
              Analytics Masterclass 2026
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl leading-tight">
              How to Build UTM Campaign Links that Track Every Conversion in 2026
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Eliminate dark social blindspots, standardize naming conventions across your marketing team, and pair UTM tags with clean branded short URLs.
            </p>
          </header>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
            <h2 className="text-2xl font-bold">1. Why Standardized UTM Naming Matters</h2>
            <p>
              Google Analytics 4 is strictly case-sensitive. If one team member tags <code>utm_source=Facebook</code>, another uses <code>facebook</code>, and an agency writes <code>fb</code>, your analytics dashboards fragment into three disconnected rows.
            </p>
            <p>
              Always enforce strictly lowercase naming conventions with hyphens instead of spaces or underscores:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><code>utm_source</code>: The specific platform (e.g., <code>twitter</code>, <code>linkedin</code>, <code>newsletter</code>)</li>
              <li><code>utm_medium</code>: The marketing channel medium (e.g., <code>social</code>, <code>cpc</code>, <code>email</code>, <code>qr</code>)</li>
              <li><code>utm_campaign</code>: The specific initiative (e.g., <code>q4-holiday-sale</code>, <code>creator-collab</code>)</li>
              <li><code>utm_content</code>: The creative variant (e.g., <code>blue-cta-banner</code>, <code>founder-headshot</code>)</li>
            </ul>

            <h2 className="text-2xl font-bold">2. The Ugly URL Problem and the Solution</h2>
            <p>
              Adding 5 UTM parameters often expands a clean 30-character URL into an unwieldy 250-character monster. Sharing these links directly on LinkedIn, SMS, or Discord causes line breaks and screams "you are being tracked" to prospective buyers.
            </p>
            <p>
              The solution is to shorten the tagged URL using a modern branded shortener. ul0 preserves 100% of your UTM query parameters while redirecting in under 30ms, boosting CTR by over 30%.
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
