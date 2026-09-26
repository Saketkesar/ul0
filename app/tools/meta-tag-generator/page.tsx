import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MetaTagClient } from "./meta-tag-client"
import { HelpCircle, Code, Search, Globe, CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Meta Tag Generator — Generate SEO & Social Meta Tags Online | UL0",
  description:
    "Free online Meta Tag Generator. Create SEO-optimized HTML meta tags, OpenGraph cards, and Twitter tags with instant live SERP preview and copyable code.",
  alternates: {
    canonical: "https://ul0.site/tools/meta-tag-generator",
  },
  openGraph: {
    title: "Meta Tag Generator & SEO Snippet Builder — UL0 Tools",
    description: "Generate complete SEO meta tags, Google SERP snippets, and OpenGraph code instantly.",
    url: "https://ul0.site/tools/meta-tag-generator",
    type: "website",
  },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Where should I paste the generated meta tags?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Paste the generated HTML snippet inside the <head>...</head> section of your web page or website template.",
      },
    },
    {
      "@type": "Question",
      name: "How long should a page title and meta description be for SEO?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Page titles should ideally be 50 to 60 characters to fit within Google's 600-pixel desktop display limit. Meta descriptions should be between 120 and 155 characters to avoid truncation on mobile screens.",
      },
    },
    {
      "@type": "Question",
      name: "What does the canonical URL tag do?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The canonical tag (<link rel='canonical'>) informs search engines of the primary, authoritative URL for a page, preventing duplicate content penalties when the same page can be accessed via multiple URLs (e.g. with UTM parameters or HTTP/HTTPS variants).",
      },
    },
  ],
}

export default function MetaTagGeneratorPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header />

      <main className="flex-1 py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-foreground">
              Tools
            </Link>
            <span>/</span>
            <span className="text-foreground">Meta Tag Generator</span>
          </div>

          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              Meta Tag Generator &amp; SEO Previewer
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Generate perfectly structured HTML meta tags, OpenGraph attributes, and Twitter cards. Preview how your pages render in Google Search and social media feeds.
            </p>
          </div>

          {/* Interactive Client Component */}
          <MetaTagClient />

          {/* Educational SEO Guide */}
          <div className="mt-16 space-y-8 border-t border-border pt-12">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">
                The Anatomy of High-Ranking Webpage Metadata
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Search engines such as Google, Bing, and DuckDuckGo crawl HTML meta tags to understand the subject matter and target audience of your content. Well-crafted metadata not only improves search index accuracy but directly influences your organic Click-Through-Rate (CTR) in search results.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 text-xs">
              <div className="p-4 rounded-xl border border-border bg-card">
                <Search className="h-5 w-5 text-blue-500 mb-2" />
                <h4 className="font-bold text-foreground mb-1">Title Tag Optimization</h4>
                <p className="text-muted-foreground">
                  Front-load your primary target keywords and keep brand identifiers at the end separated by a dash or vertical pipe.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card">
                <Globe className="h-5 w-5 text-emerald-500 mb-2" />
                <h4 className="font-bold text-foreground mb-1">Canonical Link Defense</h4>
                <p className="text-muted-foreground">
                  Always declare a canonical URL to protect ranking authority when distributing links across newsletters and ad campaigns with UTM parameters.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card">
                <Code className="h-5 w-5 text-purple-500 mb-2" />
                <h4 className="font-bold text-foreground mb-1">Robots Directives</h4>
                <p className="text-muted-foreground">
                  Direct search engine crawlers precisely using index/noindex directives to keep staging or admin routes out of public indices.
                </p>
              </div>
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
                    <p className="text-xs text-muted-foreground leading-relaxed pl-5">{item.acceptedAnswer.text}</p>
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
