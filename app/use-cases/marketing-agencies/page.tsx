import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  Megaphone,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  HelpCircle,
  Globe,
  Share2,
  TrendingUp,
  Layers,
  Database,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Link Management & UTM Tracking for Marketing Agencies | UL0",
  description: "Standardize client campaign tracking, connect multiple custom domains, enforce UTM parameter taxonomy, and eliminate inflated Bitly enterprise costs with UL0.",
  alternates: {
    canonical: "https://ul0.site/use-cases/marketing-agencies",
  },
  openGraph: {
    title: "Link Management & UTM Tracking for Marketing Agencies — UL0",
    description: "Multichannel campaign attribution, custom domains, and UTM taxonomy for agency teams.",
    url: "https://ul0.site/use-cases/marketing-agencies",
    type: "article",
  },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does UL0 help agencies standardize UTM parameter tracking?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "UL0 provides an integrated UTM Campaign Builder that automatically sanitizes inputs to lowercase, replaces spaces with underscores, and prevents duplicate channel groupings in Google Analytics 4 (GA4)."
      }
    },
    {
      "@type": "Question",
      name: "Can our agency manage multiple client domains under one UL0 account?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. With UL0 Pro and Business plans, you can connect multiple custom domains (e.g., links.clientA.com and go.clientB.com) and assign shortened links to individual client domains seamlessly."
      }
    },
    {
      "@type": "Question",
      name: "Do UL0 redirects preserve UTM parameters and affiliate tracking codes?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. UL0 uses permanent 301 HTTP redirects that preserve all incoming and destination query strings, ensuring seamless attribution across GA4, Meta Pixel, and affiliate tracking networks."
      }
    }
  ]
}

export default function MarketingAgenciesUseCasePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header />

      <main className="flex-1 py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Breadcrumbs */}
          <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/use-cases" className="hover:text-foreground">Use Cases</Link>
            <span>/</span>
            <span className="text-foreground">Marketing Agencies</span>
          </div>

          {/* Hero */}
          <div className="mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-500 mb-4">
              <Megaphone className="h-3.5 w-3.5" />
              Agency Campaign Infrastructure
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-5 leading-tight">
              Flawless Multichannel Attribution Without Bitly Enterprise Price Gouging
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
              Marketing agencies face a constant struggle with corrupted GA4 attribution from messy UTM naming conventions, broken redirects, and legacy tools charging $500+/month per seat. UL0 delivers high-speed link shortening, branded client domains, and standardized UTM campaign workflows at transparent pricing.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/utm"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                Open UTM Campaign Builder
              </Link>
              <Link
                href="/pricing"
                className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
              >
                Agency Custom Domain Plans
              </Link>
            </div>
          </div>

          {/* Core Agency Capabilities Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="rounded-xl bg-blue-500/10 text-blue-500 p-3 w-fit mb-4">
                <Globe className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Multi-Tenant Custom Domains</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Connect branded short domains for each of your agency clients. Manage links for <code>go.brandA.com</code> and <code>links.brandB.com</code> under one unified dashboard.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="rounded-xl bg-emerald-500/10 text-emerald-500 p-3 w-fit mb-4">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Standardized UTM Taxonomy</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Prevent junior media buyers from creating inconsistent tags like <code>utm_source=Facebook</code> vs <code>utm_source=facebook</code>. Standardize naming across all channels.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="rounded-xl bg-purple-500/10 text-purple-500 p-3 w-fit mb-4">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Granular Click Attribution</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Track clicks by country, city, referring application (Instagram, LinkedIn, X, Direct), device family, and operating system without violating privacy regulations.
              </p>
            </div>
          </div>

          {/* Agency Comparison: UL0 vs Legacy Enterprise Shorteners */}
          <div className="mb-16 rounded-2xl border border-border bg-card overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/20">
              <h3 className="font-bold text-foreground text-lg">UL0 vs Legacy Enterprise Shorteners (Bitly, Rebrandly)</h3>
              <p className="text-xs text-muted-foreground mt-1">Why modern digital marketing agencies are migrating to UL0.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/40 font-semibold text-foreground">
                  <tr>
                    <th className="p-4">Feature</th>
                    <th className="p-4 text-primary">UL0 Agency Solution</th>
                    <th className="p-4">Bitly / Legacy Providers</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-muted-foreground">
                  <tr>
                    <td className="p-4 font-medium text-foreground">Monthly Cost</td>
                    <td className="p-4 text-emerald-500 font-semibold">$3 – $15 / month</td>
                    <td className="p-4">$199 – $999+ / month</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-foreground">Custom Branded Domains</td>
                    <td className="p-4">Included across Pro &amp; Business plans</td>
                    <td className="p-4">Locked behind top enterprise tiers</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-foreground">Redirect Latency</td>
                    <td className="p-4">&lt; 25ms edge-cached global redirects</td>
                    <td className="p-4">Variable multi-hop redirects</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-foreground">Permanent 301 Status</td>
                    <td className="p-4">Guaranteed permanent link equity</td>
                    <td className="p-4">Subject to plan expirations and link locking</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-foreground">Vector QR Code Generator</td>
                    <td className="p-4">Free auto-generation with every link</td>
                    <td className="p-4">Separate paid add-on / monthly fee</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight text-foreground text-center mb-8">
              Frequently Asked Questions for Agencies
            </h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              {faqSchema.mainEntity.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-border bg-card p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                    <span>{item.name}</span>
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed pl-6">
                    {item.acceptedAnswer.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8 text-center max-w-3xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
              Upgrade Your Client Campaign Infrastructure
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-6">
              Connect your first branded domain in under 5 minutes with simple CNAME configuration.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/pricing"
                className="rounded-xl bg-primary px-6 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                Explore Agency Plans
              </Link>
              <Link
                href="/utm"
                className="rounded-xl border border-border bg-background px-6 py-2.5 text-xs sm:text-sm font-semibold text-foreground hover:bg-accent transition-colors"
              >
                Try the UTM Builder
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
