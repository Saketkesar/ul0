import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { COMPETITORS } from "@/lib/comparisons"
import { Check, X, ArrowRight, ExternalLink, ArrowLeft } from "lucide-react"

interface Props {
  params: Promise<{ competitor: string }>
}

export async function generateStaticParams() {
  const slugs = Object.keys(COMPETITORS)
  return [...slugs, "short"].map((competitor) => ({
    competitor,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { competitor } = await params
  const key = competitor === "short" ? "short-io" : competitor
  const data = COMPETITORS[key]
  if (!data) return {}

  const title = `UL0 vs ${data.name} — Feature & Pricing Comparison`
  const description = `Factual comparison between UL0 and ${data.name}. Compare free limits, custom domain pricing, click analytics, and redirect infrastructure.`

  return {
    title,
    description,
    alternates: {
      canonical: `https://ul0.site/compare/${data.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://ul0.site/compare/${data.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default async function CompetitorComparePage({ params }: Props) {
  const { competitor } = await params
  const key = competitor === "short" ? "short-io" : competitor
  const data = COMPETITORS[key]
  if (!data) notFound()

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-neutral-200 dark:selection:bg-neutral-800">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header />

      <main className="flex-1">
        {/* Navigation Breadcrumb */}
        <div className="border-b border-border">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/compare" className="hover:text-foreground inline-flex items-center gap-1 transition-colors">
              <ArrowLeft className="h-3 w-3" />
              <span>Comparisons</span>
            </Link>
            <span className="text-muted-foreground/40">/</span>
            <span className="text-foreground font-medium">UL0 vs {data.name}</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-14 sm:py-20 border-b border-border bg-card/20">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-mono text-muted-foreground">
              <span>Fact-checked</span>
              <span className="text-muted-foreground/40">•</span>
              <span>Updated {data.verifiedDate}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
              UL0 vs {data.name}
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              An objective, side-by-side comparison of features, custom domain pricing, free-tier limits, and infrastructure speed.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-md bg-foreground text-background px-6 h-10 text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Create a short link free
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-md border border-border bg-card px-6 h-10 text-xs font-semibold text-foreground hover:bg-muted/50 transition-colors"
              >
                View pricing plans
              </Link>
            </div>
          </div>
        </section>

        {/* Executive Summary Cards */}
        <section className="py-12 border-b border-border">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid gap-6 sm:grid-cols-2">
              {/* UL0 Card */}
              <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Platform</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md border border-border bg-muted/30 text-foreground font-semibold">
                    1 Free Domain
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">UL0</h2>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    Fast link management with instant 307 temporary redirects, free custom domain connections, vector QR codes, cookieless analytics, and zero ads.
                  </p>
                </div>
                <div className="pt-3 border-t border-border space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Free plan:</span>
                    <span className="text-foreground font-semibold">1 domain, unlimited links</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Paid plan:</span>
                    <span className="text-foreground font-semibold">$3 / mo ($24 / yr)</span>
                  </div>
                </div>
              </div>

              {/* Competitor Card */}
              <div className="rounded-xl border border-border bg-card p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Alternative</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md border border-border bg-muted/30 text-muted-foreground">
                    Benchmark
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{data.name}</h2>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {data.whoItsFor}
                  </p>
                </div>
                <div className="pt-3 border-t border-border space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Free plan:</span>
                    <span className="text-foreground truncate max-w-[180px]">{data.freePlan}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Starting paid:</span>
                    <span className="text-foreground font-semibold">{data.paidStartPrice}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="py-12 border-b border-border">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                Feature Breakdown
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Side-by-side specifications checked against public documentation.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-muted/40 border-b border-border">
                    <th className="p-4 font-semibold text-foreground w-2/5">Feature</th>
                    <th className="p-4 font-semibold text-foreground w-3/10 bg-muted/30">UL0</th>
                    <th className="p-4 font-semibold text-muted-foreground w-3/10">{data.name}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.featuresTable.map((row) => (
                    <tr key={row.feature} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4 font-medium text-foreground">{row.feature}</td>
                      <td className="p-4 font-semibold text-foreground bg-muted/10 font-mono text-[11px]">{row.ul0}</td>
                      <td className="p-4 text-muted-foreground font-mono text-[11px]">{row.competitor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
              <span>Verified as of {data.verifiedDate}</span>
              <a
                href={data.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-foreground underline underline-offset-4"
              >
                <span>{data.name} public pricing page</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </section>

        {/* When to Choose Which */}
        <section className="py-12 border-b border-border bg-card/10">
          <div className="max-w-4xl mx-auto px-4 space-y-6">
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              When to choose which platform
            </h2>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-6 space-y-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Choose UL0 if:
                </h3>
                <ul className="space-y-2.5 text-xs text-muted-foreground">
                  {data.whenUl0Better.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 text-foreground mt-0.5 shrink-0" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-border bg-card p-6 space-y-3">
                <h3 className="text-sm font-semibold text-foreground">
                  Choose {data.name} if:
                </h3>
                <ul className="space-y-2.5 text-xs text-muted-foreground">
                  {data.whenCompetitorBetter.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-muted-foreground/60 mt-0.5">•</span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Migration Steps */}
        <section className="py-12 border-b border-border">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              How to migrate from {data.name} to UL0
            </h2>

            <div className="rounded-xl border border-border bg-card p-6">
              <ol className="space-y-3 text-xs text-muted-foreground list-decimal list-inside">
                {data.migrationSteps.map((step, idx) => (
                  <li key={idx} className="leading-relaxed">
                    <span className="text-foreground font-medium">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12 border-b border-border bg-card/20">
          <div className="max-w-4xl mx-auto px-4 space-y-6">
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Frequently Asked Questions
            </h2>

            <div className="space-y-3">
              {data.faqs.map((faq) => (
                <div key={faq.q} className="rounded-xl border border-border bg-card p-5 space-y-1.5">
                  <h3 className="text-sm font-semibold text-foreground">{faq.q}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-16">
          <div className="max-w-xl mx-auto px-4 text-center space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Ready to create branded links?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Start with 1 free custom domain and unlimited short links. No credit card required.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-md bg-foreground text-background px-6 h-10 text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Create a link
              </Link>
              <Link
                href="/compare"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-md border border-border bg-card px-6 h-10 text-xs font-semibold text-foreground hover:bg-muted/50 transition-colors"
              >
                Browse all comparisons
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
