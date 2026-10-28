import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { COMPETITORS } from "@/lib/comparisons"
import { ArrowRight, Check, X } from "lucide-react"

export const metadata: Metadata = {
  title: "Compare URL Shorteners — UL0 vs Bitly, Dub, TinyURL, Short.io",
  description:
    "Factual side-by-side comparison of link management platforms: UL0 vs Bitly, Dub, TinyURL, Short.io, and Rebrandly. Compare custom domain limits, redirect speeds, and pricing.",
  alternates: {
    canonical: "https://ul0.site/compare",
  },
}

export default function CompareHubPage() {
  const competitorList = Object.values(COMPETITORS)

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-neutral-200 dark:selection:bg-neutral-800">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 sm:py-20 border-b border-border bg-card/20">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-mono text-muted-foreground">
              <span>Factual breakdown</span>
              <span className="text-muted-foreground/40">•</span>
              <span>Updated October 2026</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              Compare URL Shorteners
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Choosing the right link management platform depends on your link volume, custom domain needs, and budget. Here is an objective, side-by-side breakdown.
            </p>
          </div>
        </section>

        {/* Matrix Snapshot */}
        <section className="py-12 border-b border-border">
          <div className="max-w-5xl mx-auto px-4 space-y-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                Overview Matrix
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Key specifications compiled from competitors&apos; public pricing and documentation.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border">
                      <th className="p-4 font-semibold text-foreground">Platform</th>
                      <th className="p-4 font-semibold text-center">Free Short Links</th>
                      <th className="p-4 font-semibold text-center">Free Custom Domain</th>
                      <th className="p-4 font-semibold text-center">No Signup Needed</th>
                      <th className="p-4 font-semibold text-center">Starting Paid</th>
                      <th className="p-4 font-semibold text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="bg-muted/20 font-medium text-foreground">
                      <td className="p-4 flex items-center gap-2 font-bold">
                        <span className="w-2 h-2 rounded-full bg-foreground" />
                        <span>UL0</span>
                      </td>
                      <td className="p-4 text-center font-mono">Unlimited</td>
                      <td className="p-4 text-center font-mono font-semibold text-foreground">1 domain free</td>
                      <td className="p-4 text-center font-mono">Yes</td>
                      <td className="p-4 text-center font-mono font-semibold text-foreground">$3 / mo</td>
                      <td className="p-4 text-right">
                        <span className="text-[11px] font-mono text-muted-foreground">This site</span>
                      </td>
                    </tr>
                    {competitorList.map((c) => (
                      <tr key={c.slug} className="hover:bg-muted/10 transition-colors">
                        <td className="p-4 font-medium text-foreground">{c.name}</td>
                        <td className="p-4 text-center font-mono text-muted-foreground">{c.freePlan}</td>
                        <td className="p-4 text-center font-mono">
                          {c.customDomainOnFree ? (
                            <span className="text-foreground font-medium">Yes</span>
                          ) : (
                            <span className="text-muted-foreground/60">No</span>
                          )}
                        </td>
                        <td className="p-4 text-center font-mono">
                          {c.signupRequiredForBasic ? (
                            <span className="text-muted-foreground/60">Signup required</span>
                          ) : (
                            <span className="text-foreground font-medium">Yes</span>
                          )}
                        </td>
                        <td className="p-4 text-center font-mono font-medium text-foreground">{c.paidStartPrice}</td>
                        <td className="p-4 text-right">
                          <Link
                            href={`/compare/${c.slug}`}
                            className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:underline underline-offset-4"
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

            <p className="text-[11px] text-muted-foreground pt-1">
              * Data checked against publicly accessible pricing tiers in October 2026.
            </p>
          </div>
        </section>

        {/* Detailed Competitor Cards Grid */}
        <section className="py-12">
          <div className="max-w-5xl mx-auto px-4 space-y-6">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                In-Depth Comparisons
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Detailed breakdowns covering redirect protocols, analytics privacy, and migration paths.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {competitorList.map((c) => (
                <div
                  key={c.slug}
                  className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between hover:border-foreground/30 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-foreground">UL0 vs {c.name}</h3>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-md border border-border bg-muted/40 text-muted-foreground">
                        {c.paidStartPrice}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {c.tagline}
                    </p>

                    <div className="pt-2 border-t border-border space-y-1.5 text-xs text-muted-foreground font-mono">
                      <div className="flex items-center justify-between">
                        <span>Free custom domain:</span>
                        <span className="text-foreground font-medium">
                          {c.customDomainOnFree ? "Yes" : "Paid only"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Analytics:</span>
                        <span className="text-foreground truncate max-w-[140px] text-right">
                          {c.privacyAnalytics}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-border">
                    <Link
                      href={`/compare/${c.slug}`}
                      className="inline-flex items-center justify-between w-full text-xs font-semibold text-foreground hover:underline underline-offset-4"
                    >
                      <span>Read full comparison</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
