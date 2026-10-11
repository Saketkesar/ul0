import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { COMPETITORS } from "@/lib/comparisons"
import { Check, X, ArrowRight, ExternalLink, ShieldCheck, ArrowLeft } from "lucide-react"

interface Props {
  params: Promise<{ competitor: string }>
}

export async function generateStaticParams() {
  return Object.keys(COMPETITORS).map((competitor) => ({
    competitor,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { competitor } = await params
  const data = COMPETITORS[competitor]
  if (!data) return {}

  const title = `UL0 vs ${data.name} (2026 Comparison)`
  const description = `Detailed comparison: UL0 vs ${data.name}. Features, free tier limits, custom domains, pricing, and when to choose each platform.`

  return {
    title,
    description,
    alternates: {
      canonical: `https://ul0.site/compare/${data.slug}`,
    },
    openGraph: {
      title: `${title} | UL0`,
      description,
      url: `https://ul0.site/compare/${data.slug}`,
      type: "article",
      images: [{
        url: "https://ul0.site/social-card.png",
        width: 1376,
        height: 768,
        alt: `UL0 vs ${data.name}`,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | UL0`,
      description,
      images: ["https://ul0.site/social-card.png"],
    },
  }
}

export default async function CompetitorComparePage({ params }: Props) {
  const { competitor } = await params
  const data = COMPETITORS[competitor]
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
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header />
      <main className="flex-1">
        {/* Breadcrumb / Back */}
        <div className="border-b bg-muted/10 py-3">
          <div className="container mx-auto px-4 max-w-4xl flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/compare" className="hover:text-foreground inline-flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              <span>All Comparisons</span>
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">UL0 vs {data.name}</span>
          </div>
        </div>

        {/* Hero */}
        <section className="py-12 sm:py-16 border-b bg-muted/20">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
              <span>Verified Fact Sheet</span>
              <span className="text-muted-foreground">•</span>
              <span>Last verified: {data.verifiedDate}</span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              UL0 vs {data.name}
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg leading-relaxed max-w-2xl">
              A factual, side-by-side comparison between UL0 and {data.name}. Explore feature differences, free tier caps, custom domain support, and pricing.
            </p>
          </div>
        </section>

        {/* Overview Cards */}
        <section className="py-10 border-b">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">Overview</span>
                <h2 className="text-xl font-semibold text-foreground mt-1 mb-2">UL0</h2>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Modern branded link management with free custom domains, dynamic vector QR codes, cookieless analytics, and flat $3 Pro / $9 Business pricing.
                </p>
                <div className="text-xs space-y-1.5 text-muted-foreground border-t border-primary/10 pt-3">
                  <div><strong>Free tier:</strong> 1 custom domain, unlimited public short links</div>
                  <div><strong>Pro price:</strong> $3 / mo ($24/yr)</div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-6">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Overview</span>
                <h2 className="text-xl font-semibold text-foreground mt-1 mb-2">{data.name}</h2>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  {data.whoItsFor}
                </p>
                <div className="text-xs space-y-1.5 text-muted-foreground border-t border-border pt-3">
                  <div><strong>Free tier:</strong> {data.freePlan}</div>
                  <div><strong>Starting paid:</strong> {data.paidStartPrice}</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-xl font-semibold text-foreground mb-4">Feature Comparison</h2>
            <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-muted/40 border-b border-border">
                    <th className="p-4 font-semibold text-foreground w-2/5">Feature</th>
                    <th className="p-4 font-semibold text-center w-3/10 bg-primary/5 text-primary">UL0</th>
                    <th className="p-4 font-semibold text-center w-3/10 text-foreground">{data.name}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-muted-foreground">
                  {data.featuresTable.map((row) => (
                    <tr key={row.feature} className="hover:bg-muted/10 transition-colors">
                      <td className="p-4 font-medium text-foreground">{row.feature}</td>
                      <td className="p-4 text-center bg-primary/5 font-semibold text-primary">{row.ul0}</td>
                      <td className="p-4 text-center">{row.competitor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>Last verified: {data.verifiedDate}</span>
              <a
                href={data.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-foreground hover:underline"
              >
                <span>Official source: {data.name} Pricing</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </section>

        {/* Balanced "When Competitor is Better" & "When UL0 is Better" */}
        <section className="py-12 border-t bg-muted/10">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-xl font-semibold text-foreground mb-8 text-center">Honest Recommendations</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                  <span>When {data.name} is the better choice</span>
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Choose {data.name} if your business needs align with these requirements:
                </p>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {data.whenCompetitorBetter.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-muted-foreground/60 mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
                <h3 className="text-base font-semibold text-primary mb-2 flex items-center gap-2">
                  <span>When UL0 is the better choice</span>
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Choose UL0 if your priorities include:
                </p>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  {data.whenUl0Better.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Migration Guide */}
        <section className="py-12 border-t">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              How to Migrate from {data.name} to UL0
            </h2>
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
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

        {/* FAQ Section */}
        <section className="py-12 border-t bg-muted/10">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-xl font-semibold text-foreground mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {data.faqs.map((faq) => (
                <div key={faq.q} className="rounded-xl border border-border bg-card p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-1.5">{faq.q}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-14 border-t">
          <div className="container mx-auto px-4 max-w-xl text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              Try UL0 today for free
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Create short links without signup or connect 1 custom domain for free.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-[#136759] transition-colors"
              >
                Shorten a link now
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
              >
                View pricing plans
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
