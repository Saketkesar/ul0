import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { OgPreviewClient } from "./og-preview-client"
import { HelpCircle, Share2, Sparkles, Layout, CheckCircle2 } from "lucide-react"

export const metadata: Metadata = {
  title: "OpenGraph & Social Card Previewer — Test Meta Tags Online | UL0",
  description:
    "Free OpenGraph debugger and social media card previewer. Test how your links display across X (Twitter), Facebook, LinkedIn, and Discord before sharing.",
  alternates: {
    canonical: "https://ul0.site/tools/og-preview",
  },
  openGraph: {
    title: "OpenGraph & Social Card Previewer — UL0 Tools",
    description: "Preview and debug social media share cards across Twitter, Facebook, LinkedIn, and Discord.",
    url: "https://ul0.site/tools/og-preview",
    type: "website",
  },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are OpenGraph (OG) meta tags?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "OpenGraph tags are HTML metadata protocols introduced by Facebook that allow webpage authors to control what title, image, description, and canonical URL are displayed when a web page is shared on social media platforms and messaging apps.",
      },
    },
    {
      "@type": "Question",
      name: "What is the optimal size for an og:image preview?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The universally recommended resolution for OpenGraph share images is 1200 x 630 pixels (an aspect ratio of 1.91:1). This ensures high-definition rendering on desktop monitors and mobile retina screens without cropping.",
      },
    },
    {
      "@type": "Question",
      name: "Why does Twitter show a small square thumbnail instead of a large card?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Twitter defaults to summary mode unless you explicitly declare <meta name='twitter:card' content='summary_large_image'> in your HTML head section.",
      },
    },
  ],
}

export default function OgPreviewPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Header />

      <main className="flex-1 py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
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
            <span className="text-foreground">Social Previewer</span>
          </div>

          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              OpenGraph &amp; Social Card Previewer
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Debug and preview how your URLs appear when shared on X (Twitter), Facebook, LinkedIn, and Discord. Audit title lengths, descriptions, and banner dimensions.
            </p>
          </div>

          {/* Interactive Client Component */}
          <OgPreviewClient />

          {/* Educational Content */}
          <div className="mt-16 space-y-8 border-t border-border pt-12">
            <div>
              <h2 className="text-xl font-bold text-foreground mb-3">
                Why Optimized OpenGraph Tags Drive Higher Click-Through Rates (CTR)
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                When links are shared on social media feeds, rich media cards earn over 2.4x higher engagement and click-through rates compared to plain text links. Without proper <code className="text-primary font-mono text-xs">og:image</code>, <code className="text-primary font-mono text-xs">og:title</code>, and <code className="text-primary font-mono text-xs">og:description</code> tags, social platforms fall back to scraping random images or leaving posts blank, severely hurting organic reach.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 text-xs">
              <div className="p-4 rounded-xl border border-border bg-card">
                <Layout className="h-5 w-5 text-blue-500 mb-2" />
                <h4 className="font-bold text-foreground mb-1">Standard 1.91:1 Ratio</h4>
                <p className="text-muted-foreground">
                  Using 1200x630px ensures seamless scaling across X/Twitter feeds, Facebook newsfeeds, and LinkedIn posts without awkward sidebars.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card">
                <Sparkles className="h-5 w-5 text-purple-500 mb-2" />
                <h4 className="font-bold text-foreground mb-1">Title &amp; Subtitle Clarity</h4>
                <p className="text-muted-foreground">
                  Keep titles under 60 characters so they are fully legible on mobile feeds without being truncated with ellipses.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mb-2" />
                <h4 className="font-bold text-foreground mb-1">Cache Invalidation</h4>
                <p className="text-muted-foreground">
                  Social platforms cache previews for days. Inspecting tags early lets you catch formatting errors before publishing campaign URLs.
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
