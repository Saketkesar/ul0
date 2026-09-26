import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { RedirectCheckerClient } from "./redirect-checker-client"
import { HelpCircle, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "HTTP Redirect Checker & 301 Redirect Chain Tracer | UL0",
  description: "Free online HTTP redirect checker. Trace 301, 302, and 307 redirect chains, inspect status codes and response headers, and diagnose redirect loops.",
  alternates: {
    canonical: "https://ul0.site/tools/redirect-checker",
  },
  openGraph: {
    title: "HTTP Redirect Checker & 301 Chain Tracer — UL0 Tools",
    description: "Inspect HTTP status codes, detect redirect chains, and measure landing page latency.",
    url: "https://ul0.site/tools/redirect-checker",
    type: "website",
  },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a 301 redirect and how does it affect SEO?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A 301 redirect indicates that a resource has moved permanently to a new URL. Search engines like Google transfer 99% to 100% of link equity (PageRank) from the old URL to the new destination."
      }
    },
    {
      "@type": "Question",
      name: "Why are redirect chains bad for website performance and rankings?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Redirect chains (e.g. Page A -> Page B -> Page C) force browsers to make multiple round-trip HTTP requests before rendering content. This increases Time to First Byte (TTFB), slows mobile load times, and can cause search engine crawlers to abandon the page."
      }
    },
    {
      "@type": "Question",
      name: "What is the difference between a 301 and a 302 redirect?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A 301 redirect is permanent and transfers search ranking equity to the target URL. A 302 redirect is temporary and tells search engines to keep indexing the original URL, which does not pass link equity."
      }
    }
  ]
}

export default function RedirectCheckerPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header />

      <main className="flex-1 py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-foreground">Tools</Link>
            <span>/</span>
            <span className="text-foreground">Redirect Checker</span>
          </div>

          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              HTTP Redirect Checker &amp; 301 Tracer
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Trace full HTTP redirect chains, inspect status codes (301, 302, 307, 308, 200), measure server response latency, and diagnose redirect loops in real time.
            </p>
          </div>

          {/* Interactive Client Component */}
          <RedirectCheckerClient />

          {/* Educational SEO Content */}
          <div className="mt-16 space-y-8 border-t border-border pt-12">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">Understanding HTTP Status Codes in Redirect Chains</h2>
              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                <div className="p-4 rounded-xl border border-border bg-card">
                  <span className="font-mono font-bold text-emerald-500 text-sm">301 Moved Permanently</span>
                  <p className="text-muted-foreground mt-1.5 leading-relaxed">
                    Instructs browsers and Googlebot that the page has permanently relocated. Passes full link authority (PageRank) to the target destination.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card">
                  <span className="font-mono font-bold text-amber-500 text-sm">302 Found (Temporary)</span>
                  <p className="text-muted-foreground mt-1.5 leading-relaxed">
                    Temporary redirection. Search engines retain the original URL in their search index and do not transfer long-term link equity.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card">
                  <span className="font-mono font-bold text-blue-500 text-sm">307 Temporary Redirect</span>
                  <p className="text-muted-foreground mt-1.5 leading-relaxed">
                    HTTP/1.1 equivalent of 302 that strictly prohibits the browser from altering the HTTP request method (e.g. POST to GET).
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-border bg-card">
                  <span className="font-mono font-bold text-purple-500 text-sm">308 Permanent Redirect</span>
                  <p className="text-muted-foreground mt-1.5 leading-relaxed">
                    HTTP/1.1 equivalent of 301 that permanently relocates the URL while guaranteeing request method preservation.
                  </p>
                </div>
              </div>
            </div>

            {/* Why Redirect Chains Hurt SEO */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-base font-bold text-foreground mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Why Redirect Chains Damage Your Google Rankings
              </h3>
              <ul className="space-y-2 text-xs text-muted-foreground mt-3 list-disc list-inside">
                <li><strong>Crawl Budget Waste:</strong> Googlebot will typically abort crawling if it encounters more than 5 consecutive redirect hops.</li>
                <li><strong>Higher TTFB &amp; Core Web Vitals:</strong> Every redirect adds 100ms–500ms of round-trip latency, degrading your Largest Contentful Paint (LCP) score.</li>
                <li><strong>Link Equity Dilution:</strong> While Google passes PageRank through single 301 redirects, complex multi-hop chains risk signal degradation.</li>
              </ul>
            </div>

            {/* FAQ */}
            <div>
              <h3 className="text-lg font-bold text-foreground mb-4">Frequently Asked Questions</h3>
              <div className="space-y-3">
                {faqSchema.mainEntity.map((item, idx) => (
                  <div key={idx} className="rounded-xl border border-border bg-card p-4">
                    <h4 className="text-xs font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                      <HelpCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>{item.name}</span>
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed pl-5">
                      {item.acceptedAnswer.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
