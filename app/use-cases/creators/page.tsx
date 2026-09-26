import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Share2,
  BarChart3,
  HelpCircle,
  Video,
  Instagram,
  Youtube,
  DollarSign,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Link Tracking & Branded Bio Links for Creators | UL0",
  description: "Create memorable short links for YouTube descriptions, Instagram bios, podcast audio ads, and brand sponsor verification with UL0.",
  alternates: {
    canonical: "https://ul0.site/use-cases/creators",
  },
  openGraph: {
    title: "Link Tracking & Branded Bio Links for Creators — UL0",
    description: "Track affiliate clicks, verify brand sponsor traffic, and brand your link-in-bio.",
    url: "https://ul0.site/use-cases/creators",
    type: "article",
  },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Why should creators use branded short links instead of Linktree?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Using a generic bio link service promotes third-party branding and introduces extra clicks between your follower and your content. A branded short link (like you.link/merch) keeps all brand equity, boosts follower trust, and lets you route fans directly."
      }
    },
    {
      "@type": "Question",
      name: "Can I show UL0 analytics to brand sponsors as proof of performance?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. UL0 tracks unique clicks, geographic countries, referring platforms (YouTube, Instagram, X), and device types. You can export these reports to verify real campaign engagement for brand partnerships."
      }
    },
    {
      "@type": "Question",
      name: "How do short links help podcast audio sponsorships?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Listeners hear sponsors on audio and must type the URL from memory. A short, clean link like ul0.site/coffee or yourdomain.link/deal is easy to recall and type while driving or commuting."
      }
    }
  ]
}

export default function CreatorsUseCasePage() {
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
            <span className="text-foreground">Content Creators</span>
          </div>

          {/* Hero */}
          <div className="mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-xs font-semibold text-purple-500 mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              Creator Economy
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-5 leading-tight">
              Sponsor Proof, Affiliate Tracking &amp; Clean Branded Bio Links
            </h1>
            <p className="text-base sm:text-xl text-muted-foreground leading-relaxed max-w-3xl">
              Creators leave thousands of dollars on the table when messy affiliate links get flagged or when sponsors demand verification of clicks. UL0 provides clean vanity short links, podcast-friendly URLs, and real-time click analytics that prove your audience engagement.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                Create a Creator Short Link
              </Link>
              <Link
                href="/pricing"
                className="rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
              >
                Connect Your Custom Domain
              </Link>
            </div>
          </div>

          {/* Platforms Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="rounded-xl bg-rose-500/10 text-rose-500 p-3 w-fit mb-4">
                <Youtube className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">YouTube Description Links</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Shorten multi-line Amazon affiliate tags into clean aliases like <code>/my-camera</code> or <code>/lighting-kit</code> that fit cleanly above the description fold.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="rounded-xl bg-purple-500/10 text-purple-500 p-3 w-fit mb-4">
                <Instagram className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Instagram &amp; TikTok Bio</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Route followers directly to your latest video, Patreon, or newsletter with a high-CTR branded domain rather than generic bio-link landing pages.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="rounded-xl bg-emerald-500/10 text-emerald-500 p-3 w-fit mb-4">
                <DollarSign className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">Sponsor Proof &amp; Media Kits</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Export real-time click volume, geographic breakdowns (US, UK, Canada), and device stats to prove your sponsorship ROI to brand partners.
              </p>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold tracking-tight text-foreground text-center mb-8">
              Creator FAQ
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
              Own Your Creator Audience Links
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mb-6">
              Start shortening links and verifying sponsor engagement in seconds. Free with no signup required.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="rounded-xl bg-primary px-6 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                Shorten Link Free
              </Link>
              <Link
                href="/pricing"
                className="rounded-xl border border-border bg-background px-6 py-2.5 text-xs sm:text-sm font-semibold text-foreground hover:bg-accent transition-colors"
              >
                Get Custom Domain ($3/mo)
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
