import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { COMPETITORS } from "@/lib/comparisons"
import { Check, X, ArrowRight, ShieldCheck, Zap, Globe, ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "Compare URL Shorteners (2026 Breakdown)",
  description: "Fact-checked comparison of the top URL shorteners: UL0 vs Bitly, Dub.co, TinyURL, Short.io, Rebrandly, T.ly, and Cutt.ly. Compare free limits, custom domains, and pricing.",
  alternates: {
    canonical: "https://ul0.site/compare",
  },
  openGraph: {
    title: "Compare URL Shorteners (2026 Breakdown) | UL0",
    description: "Fact-checked comparison of top URL shorteners: UL0 vs Bitly, Dub, TinyURL, Short.io, and Rebrandly.",
    url: "https://ul0.site/compare",
    type: "website",
    images: [{
      url: "https://ul0.site/social-card.png",
      width: 1376,
      height: 768,
      alt: "Compare URL Shorteners — UL0",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare URL Shorteners (2026 Breakdown) | UL0",
    description: "Fact-checked comparison of top URL shorteners: UL0 vs Bitly, Dub, TinyURL, Short.io, and Rebrandly.",
    images: ["https://ul0.site/social-card.png"],
  },
}

export default function CompareHubPage() {
  const competitorList = Object.values(COMPETITORS)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="py-12 sm:py-16 border-b bg-muted/20">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
              <span>Fact-Checked Comparison</span>
              <span className="text-muted-foreground">•</span>
              <span>Last verified: October 2026</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Compare URL Shorteners
            </h1>
            <p className="mt-4 text-base text-muted-foreground max-w-2xl mx-auto sm:text-lg">
              Choosing the right link shortener depends on your volume, custom domain needs, and budget. Here is an honest, side-by-side breakdown.
            </p>
          </div>
        </section>

        {/* Matrix Snapshot */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-xl font-semibold text-foreground mb-6">Quick Overview</h2>
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border">
                      <th className="p-4 font-semibold text-foreground">Platform</th>
                      <th className="p-4 font-semibold text-center">Free Short Links</th>
                      <th className="p-4 font-semibold text-center">Free Custom Domain</th>
                      <th className="p-4 font-semibold text-center">No Signup Needed</th>
                      <th className="p-4 font-semibold text-center">Paid Starting Price</th>
                      <th className="p-4 font-semibold text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border text-muted-foreground">
                    <tr className="bg-primary/5 font-medium text-foreground">
                      <td className="p-4 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                        <span className="font-semibold text-primary">UL0</span>
                      </td>
                      <td className="p-4 text-center">Unlimited</td>
                      <td className="p-4 text-center text-emerald-600 dark:text-emerald-400 font-semibold">1 domain free</td>
                      <td className="p-4 text-center text-emerald-600 dark:text-emerald-400">✓ Yes</td>
                      <td className="p-4 text-center font-semibold text-primary">$3 / mo</td>
                      <td className="p-4 text-right">
                        <span className="text-xs font-semibold text-primary">Current Site</span>
                      </td>
                    </tr>
                    {competitorList.map((c) => (
                      <tr key={c.slug} className="hover:bg-muted/20 transition-colors">
                        <td className="p-4 font-medium text-foreground">{c.name}</td>
                        <td className="p-4 text-center">{c.freePlan}</td>
                        <td className="p-4 text-center">
                          {c.customDomainOnFree ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Yes</span>
                          ) : (
                            <span className="text-muted-foreground/60">No</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {c.signupRequiredForBasic ? (
                            <span className="text-muted-foreground/60">Signup required</span>
                          ) : (
                            <span className="text-emerald-600 dark:text-emerald-400">Yes</span>
                          )}
                        </td>
                        <td className="p-4 text-center font-medium text-foreground">{c.paidStartPrice}</td>
                        <td className="p-4 text-right">
                          <Link
                            href={`/compare/${c.slug}`}
                            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                          >
                            <span>Compare</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground italic">
              * Data verified on October 11, 2026 from competitors&apos; public pricing and feature pages.
            </p>
          </div>
        </section>

        {/* Competitor Cards Grid */}
        <section className="py-10 border-t bg-muted/10">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-xl font-semibold text-foreground mb-6">Detailed In-Depth Breakdowns</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {competitorList.map((c) => (
                <div
                  key={c.slug}
                  className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between hover:border-primary/40 transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-semibold text-foreground">{c.name} vs UL0</h3>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {c.paidStartPrice}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                      {c.tagline}
                    </p>
                    <div className="space-y-2 text-xs text-muted-foreground mb-4">
                      <div className="flex items-center justify-between border-t border-border/50 pt-2">
                        <span>Free custom domain:</span>
                        <span className="font-medium text-foreground">{c.customDomainOnFree ? "Yes" : "Paid tier only"}</span>
                      </div>
                      <div className="flex items-center justify-between border-t border-border/50 pt-2">
                        <span>Best for:</span>
                        <span className="font-medium text-foreground text-right truncate max-w-[150px]">{c.bestFor}</span>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/compare/${c.slug}`}
                    className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2 text-xs font-semibold text-foreground hover:bg-accent hover:text-primary transition-colors"
                  >
                    Read full comparison →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-14 border-t">
          <div className="container mx-auto px-4 max-w-xl text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              Ready to create your first short link?
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Shorten links for free with no signup, or connect your custom domain in 2 minutes.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-[#136759] transition-colors"
            >
              Shorten a link now
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
