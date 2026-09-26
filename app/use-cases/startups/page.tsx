import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  Rocket,
  CheckCircle2,
  ArrowRight,
  Code2,
  BarChart3,
  HelpCircle,
  ShieldCheck,
  Terminal,
  Layers,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Link Infrastructure & Pitch Deck Tracking for Startups | UL0",
  description: "Track investor pitch deck clicks, measure Product Hunt launch traffic, and integrate developer REST APIs for programmatic short links with UL0.",
  alternates: {
    canonical: "https://ul0.site/use-cases/startups",
  },
  openGraph: {
    title: "Link Infrastructure & Pitch Deck Tracking for Startups — UL0",
    description: "Pitch deck CTR tracking, launch campaign attribution, and developer APIs for growing tech startups.",
    url: "https://ul0.site/use-cases/startups",
    type: "article",
  },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How can founders track investor engagement on pitch decks using UL0?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "By creating a dedicated short link for each investor or VC firm (e.g. ul0.site/sequoia-deck or pitch.yourstartup.com/a16z), you can see exactly when the link was opened, what country and city the partner is in, and whether they revisited the deck."
      }
    },
    {
      "@type": "Question",
      name: "Does UL0 offer a programmatic REST API for automated link shortening?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. UL0 provides a simple, high-speed REST API that developers can call using cURL, Node.js, Python, or Go to generate short links and retrieve click analytics programmatically."
      }
    },
    {
      "@type": "Question",
      name: "How does UL0 handle high traffic spikes from Product Hunt or Hacker News launches?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "UL0 runs on global edge infrastructure backed by Upstash Redis and distributed CDNs, ensuring sub-25ms redirect response times even during massive viral traffic surges."
      }
    }
  ]
}

export default function StartupsUseCasePage() {
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
            <span className="text-foreground">Startups &amp; Developers</span>
          </div>

          {/* Hero */}
          <div className="mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-500 mb-4">
              <Rocket className="h-3.5 w-3.5" />
              Startup &amp; Developer Growth
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-5 leading-tight">
              Developer-First Link Infrastructure That Scales With Your Startup
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
              From tracking which VC partner actually reviewed your DocSend pitch deck to measuring Product Hunt launch referral conversions, UL0 gives tech startups clean branded vanity links, robust REST APIs, and edge-cached redirects that never go down during traffic spikes.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/docs"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                Read Developer API Docs
              </Link>
              <Link
                href="/pricing"
                className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
              >
                Startup Custom Domain Plans
              </Link>
            </div>
          </div>

          {/* Startup Capabilities */}
          <div className="grid gap-6 md:grid-cols-3 mb-16">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="rounded-xl bg-indigo-500/10 text-indigo-500 p-3 w-fit mb-4">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Investor Deck Tracking</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Create unique links for angel investors and venture funds. Know the moment a partner opens your deck and track if they share it with partners.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="rounded-xl bg-emerald-500/10 text-emerald-500 p-3 w-fit mb-4">
                <Rocket className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Launch Attribution</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Separate traffic from Hacker News, Product Hunt, X, and Reddit. See which launch channels deliver high-activation users vs casual bounces.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="rounded-xl bg-blue-500/10 text-blue-500 p-3 w-fit mb-4">
                <Terminal className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Clean REST API</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Automate short link creation for transactional notifications, referral programs, or customer invite links with straightforward API keys.
              </p>
            </div>
          </div>

          {/* Quick API Snippet */}
          <div className="mb-16 rounded-2xl border border-border bg-card overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-border bg-muted/20 flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">cURL Example: Programmatic Link Generation</span>
              <span className="text-[11px] font-mono text-emerald-500 font-bold">200 OK</span>
            </div>
            <pre className="p-4 sm:p-6 text-xs font-mono text-muted-foreground overflow-x-auto bg-black/40">
{`curl -X POST https://ul0.site/api/shorten \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://yourstartup.com/launch?utm_source=hackernews",
    "customSlug": "hn-launch"
  }'`}
            </pre>
          </div>

          {/* FAQ */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight text-foreground text-center mb-8">
              Startup &amp; Developer FAQ
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
              Build On High-Reliability Link Infrastructure
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-6">
              Create your custom links or explore API keys for automated programmatic generation.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/docs"
                className="rounded-xl bg-primary px-6 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                View API Documentation
              </Link>
              <Link
                href="/pricing"
                className="rounded-xl border border-border bg-background px-6 py-2.5 text-xs sm:text-sm font-semibold text-foreground hover:bg-accent transition-colors"
              >
                Startup Plans ($3/mo)
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
