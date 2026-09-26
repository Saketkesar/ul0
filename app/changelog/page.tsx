import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Sparkles, CheckCircle2, Zap, Shield, GitCommit, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Changelog — Product Updates & Release Notes | UL0",
  description:
    "See what's new in UL0: platform updates, new tools, performance optimizations, custom domain features, and API improvements.",
  alternates: {
    canonical: "https://ul0.site/changelog",
  },
  openGraph: {
    title: "UL0 Product Changelog & Release Notes",
    description: "Track our continuous progress building modern link management infrastructure.",
    url: "https://ul0.site/changelog",
    type: "website",
  },
}

export default function ChangelogPage() {
  const releases = [
    {
      version: "v2.4.0",
      date: "September 2026",
      title: "Free SEO & Web Developer Tools Suite",
      description:
        "Launched a dedicated suite of standalone web utilities with SSRF protection and edge caching to assist engineers and marketers.",
      tags: ["New Tools", "Developer"],
      changes: [
        "HTTP Redirect Checker: Trace multi-hop 301/302/307/308 redirect chains with status codes, latency, and server headers.",
        "URL Expander: Unshorten obfuscated links from Bitly, TinyURL, and t.co with domain safety analysis.",
        "OpenGraph & Social Card Previewer: Live mockups for X/Twitter, Facebook, LinkedIn, and Discord feeds.",
        "Meta Tag Generator: Interactive HTML tag builder with real-time Google SERP simulation and 1-click clipboard export.",
      ],
    },
    {
      version: "v2.3.0",
      date: "August 2026",
      title: "Industry Use-Case Solutions & UTM Taxonomy",
      description:
        "Tailored workflow landing pages and attribution guides for marketing agencies, real estate professionals, creators, and small businesses.",
      tags: ["Features", "Solutions"],
      changes: [
        "Created specialized use-case guides for 8 core commercial verticals.",
        "Introduced agency-focused custom domain delegation workflows.",
        "Standardized UTM taxonomy presets (source, medium, campaign, term, content).",
        "Added open-source cURL examples for programmatic link generation.",
      ],
    },
    {
      version: "v2.2.0",
      date: "July 2026",
      title: "Multi-Tenant Custom Domains & Edge 301 Engine",
      description:
        "Complete overhaul of DNS verification and edge redirection infrastructure to provide sub-15ms redirect latency globally.",
      tags: ["Infrastructure", "Speed"],
      changes: [
        "Automated Let's Encrypt SSL provisioning for custom user domains.",
        "Edge 301 cache nodes deployed across North America, Europe, and Asia-Pacific.",
        "Custom 404 fallback routing configuration directly from the user dashboard.",
        "Strict anti-phishing heuristic scanner and blocked domain protection.",
      ],
    },
    {
      version: "v2.1.0",
      date: "June 2026",
      title: "Dynamic Vector QR Code Engine",
      description:
        "High-definition QR code generation with instant destination redirection and real-time scan analytics.",
      tags: ["Features", "QR Engine"],
      changes: [
        "Lossless SVG and high-resolution PNG export for commercial print layouts.",
        "Dynamic destination URL re-routing without altering printed physical QR codes.",
        "Real-time scan counter and geographic breakdown on QR management screens.",
        "Custom foreground hex color selection and margin padding controls.",
      ],
    },
    {
      version: "v2.0.0",
      date: "May 2026",
      title: "UL0 Platform Architecture 2.0",
      description:
        "Transitioned to Next.js App Router, Clerk enterprise authentication, Redis rate-limiting, and PostgreSQL storage.",
      tags: ["Major", "Security"],
      changes: [
        "Re-engineered link management dashboard with real-time analytics graphs.",
        "Clerk multi-factor authentication and organization session handling.",
        "Upstash Redis rate-limiting to prevent API abuse and bot crawler floods.",
        "Comprehensive REST API documentation for programmatic integrations.",
      ],
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">Changelog</span>
          </div>

          {/* Heading */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Continuous Improvement</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              Product Changelog
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Discover the latest updates, new features, developer tools, and performance enhancements across the UL0 platform.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative border-l border-border pl-6 ml-4 space-y-12">
            {releases.map((rel, idx) => (
              <div key={idx} className="relative">
                {/* Timeline node */}
                <div className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full border-2 border-primary bg-background" />

                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-primary text-primary-foreground">
                      {rel.version}
                    </span>
                    <span className="text-xs text-muted-foreground">{rel.date}</span>
                    <div className="flex items-center gap-1.5 ml-auto">
                      {rel.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-foreground">{rel.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{rel.description}</p>

                  <div className="p-4 rounded-2xl border border-border bg-card shadow-xs">
                    <ul className="space-y-2">
                      {rel.changes.map((change, cIdx) => (
                        <li key={cIdx} className="text-xs text-muted-foreground flex items-start gap-2.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Feedback & Newsletter */}
          <div className="mt-16 rounded-2xl border border-border bg-card p-6 text-center space-y-3">
            <h4 className="text-base font-bold text-foreground">Have a Feature Request?</h4>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              We ship updates weekly based on user feedback. Let us know what integrations or analytics you&apos;d like to see next.
            </p>
            <div className="pt-2">
              <Link href="/contact">
                <Button variant="outline" size="sm" className="rounded-xl text-xs gap-1.5">
                  Submit Feedback <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
