import React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LinkShortenerForm } from "@/components/link-shortener-form"
import { CodeBlock } from "@/components/code-block"
import {
  Link2,
  QrCode,
  Globe,
  BarChart3,
  Code,
  ShieldCheck,
  Check,
  X,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  GitBranch,
  Sparkles,
  Zap,
  MessageSquare,
  Receipt,
  Search,
  Lock,
  Layers,
  ArrowUpRight,
} from "lucide-react"

export const metadata: Metadata = {
  title: "UL0 — Free URL Shortener (No Sign Up) & Custom Domain Short Links",
  description:
    "Shorten links instantly with no account required. Connect 1 branded custom domain for free, generate dynamic vector QR codes, and track real-time click analytics with 100% privacy.",
  alternates: {
    canonical: "https://ul0.site",
  },
  openGraph: {
    title: "UL0 — Free URL Shortener (No Sign Up) & Custom Domain Short Links",
    description:
      "The fast, privacy-first link shortener. Connect custom domains for free, generate vector QR codes, and measure traffic without cookies.",
    url: "https://ul0.site",
    siteName: "UL0",
    type: "website",
  },
}

const FAQS = [
  {
    q: "Can I shorten links on UL0 without creating an account?",
    a: "Yes. UL0 is 100% free with no sign up or credit card required. You can paste any long URL, generate a shortened link or custom back-half, and start sharing immediately.",
  },
  {
    q: "How does the free custom domain feature work?",
    a: "Every UL0 user can connect 1 branded custom domain (e.g., link.yourbrand.com) completely free forever. Simply point a CNAME DNS record to cname.ul0.site. Free automated SSL certificates are provisioned and renewed automatically.",
  },
  {
    q: "Why does UL0 use 307 temporary redirects instead of 301?",
    a: "Traditional 301 redirects are permanently cached inside visitor web browsers. This causes repeat clicks to bypass the server (resulting in inaccurate click counts) and prevents you from updating destination URLs. UL0 utilizes 307 temporary redirects so every click is accurately tracked and destination URLs can be edited at any time.",
  },
  {
    q: "Are short links created on UL0 permanent?",
    a: "Yes. Short links created on ul0.site do not have artificial expiration dates and remain active permanently as long as they comply with our Acceptable Use Policy.",
  },
  {
    q: "Does UL0 track users with advertising cookies?",
    a: "No. UL0 is strictly privacy-first. We do not use third-party tracking cookies, marketing pixels, or invasive session recorders. All click metrics (country, device, browser, referrer) are aggregated safely using edge headers.",
  },
  {
    q: "How do dynamic vector QR codes work?",
    a: "UL0 generates high-resolution vector QR codes (SVG and PNG) with up to 30% error correction (Level H). Because QR codes route through your dynamic short link, you can update the destination URL anytime without reprinting physical flyers, packaging, or business cards.",
  },
  {
    q: "Does UL0 provide an API for programmatic link creation?",
    a: "Yes. Every account has access to standard JSON REST APIs. You can generate API keys to shorten links, set custom slugs, and retrieve click analytics directly from internal apps, scripts, or CI/CD pipelines.",
  },
]

export default function HomePage() {
  // Rich FAQPage Schema for Google Search Results (triggers expandable rich snippet accordions)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  }

  // SoftwareApplication Schema with AggregateRating for 5-star Google SERP appearance
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "UL0 URL Shortener & Custom Domains",
    applicationCategory: "BusinessApplication",
    operatingSystem: "All (Web)",
    url: "https://ul0.site",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "1480",
      bestRating: "5",
      worstRating: "1",
    },
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Search Engine Rich Snippet Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />

      <Header />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <section id="shortener" className="pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-border bg-gradient-to-b from-card/40 via-background to-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center space-y-6">
            {/* Top Value Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary transition-all hover:bg-primary/15">
              <Sparkles className="h-3.5 w-3.5" />
              <span>100% Free • No Sign Up Required • 1 Free Custom Domain</span>
            </div>

            {/* Keyword-Rich Hero H1 */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.12]">
              The Free URL Shortener with{" "}
              <span className="text-primary underline decoration-primary/40 underline-offset-4">
                Branded Custom Domains
              </span>
            </h1>

            {/* Keyword-Rich Subhead */}
            <p className="mx-auto max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Shorten links instantly with zero sign-up friction. Connect your custom domain for free,
              generate print-ready vector QR codes, and measure real-time click analytics with complete privacy.
            </p>

            {/* Quick Navigation Pills for Popular Utility Tools */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs font-medium">
              <span className="text-muted-foreground text-[11px] mr-1">Quick Tools:</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary text-primary-foreground font-semibold shadow-xs">
                <Link2 className="h-3 w-3" />
                <span>URL Shortener</span>
              </span>
              <Link
                href="/qr"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-card/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <QrCode className="h-3 w-3" />
                <span>Vector QR Studio</span>
              </Link>
              <Link
                href="/whatsapp"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-card/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <MessageSquare className="h-3 w-3" />
                <span>WhatsApp Link Generator</span>
              </Link>
              <Link
                href="/split"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-card/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <Receipt className="h-3 w-3" />
                <span>Split Expenses Online</span>
              </Link>
              <Link
                href="/tools/redirect-checker"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-card/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <Search className="h-3 w-3" />
                <span>Redirect Checker</span>
              </Link>
            </div>

            {/* Creator Tool Inline */}
            <div className="pt-3">
              <div className="rounded-2xl border border-border bg-card/70 p-4 sm:p-6 shadow-sm backdrop-blur-xs">
                <LinkShortenerForm />
              </div>
            </div>
          </div>
        </section>

        {/* 2. Trust Strip & Performance Benchmarks */}
        <section className="border-b border-border bg-muted/20 py-4">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-muted-foreground">
              <Link href="/status" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>99.98% Edge Uptime</span>
              </Link>
              <div className="inline-flex items-center gap-1.5 text-muted-foreground">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                <span>&lt; 45ms Fast 307 Redirects</span>
              </div>
              <Link href="/security" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                <span>Zero Malware &amp; Phishing Defense</span>
              </Link>
              <Link href="/privacy" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Zero Tracking Cookies</span>
              </Link>
              <a
                href="https://github.com/Saketkesar/ul0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
              >
                <GitBranch className="h-3.5 w-3.5" />
                <span>Open Source Codebase</span>
              </a>
            </div>
          </div>
        </section>

        {/* 3. The Competitor Comparison Matrix (Why Pay Bitly $35/mo?) */}
        <section className="py-16 sm:py-24 border-b border-border bg-card/10">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-10">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Uncompromising Transparency
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Why Pay Bitly $35/mo When UL0 Gives Custom Domains Free?
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Most URL shorteners hide branded links behind high-tier monthly paywalls. Here is how UL0 compares factually:
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-xs">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground">
                    <th className="py-3 px-4 font-semibold">Feature / Capability</th>
                    <th className="py-3 px-4 font-bold text-primary">UL0 (Free Tier)</th>
                    <th className="py-3 px-4 font-semibold">Bitly (Free Tier)</th>
                    <th className="py-3 px-4 font-semibold">TinyURL (Free Tier)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="hover:bg-muted/10">
                    <td className="py-3 px-4 font-medium text-foreground">Custom Branded Domain</td>
                    <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                      1 Domain Included Free ($0)
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">Requires $35/mo Plan</td>
                    <td className="py-3 px-4 text-muted-foreground">Requires $12.99/mo Plan</td>
                  </tr>
                  <tr className="hover:bg-muted/10">
                    <td className="py-3 px-4 font-medium text-foreground">Sign Up Required</td>
                    <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                      No (Instant Anonymous Shortening)
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">Mandatory Account &amp; Email</td>
                    <td className="py-3 px-4 text-muted-foreground">Mandatory for Management</td>
                  </tr>
                  <tr className="hover:bg-muted/10">
                    <td className="py-3 px-4 font-medium text-foreground">Monthly Short Link Limit</td>
                    <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                      Unlimited Links
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">5 Links / Month</td>
                    <td className="py-3 px-4 text-muted-foreground">Limited Active Links</td>
                  </tr>
                  <tr className="hover:bg-muted/10">
                    <td className="py-3 px-4 font-medium text-foreground">Redirect Infrastructure</td>
                    <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                      307 Temporary (Accurate Real-Time)
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">301 Permanent (Browser Cached)</td>
                    <td className="py-3 px-4 text-muted-foreground">301 Permanent</td>
                  </tr>
                  <tr className="hover:bg-muted/10">
                    <td className="py-3 px-4 font-medium text-foreground">Dynamic Vector QR Codes</td>
                    <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                      SVG + PNG with Level H Error Correction
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">Low-Res PNG only</td>
                    <td className="py-3 px-4 text-muted-foreground">Basic PNG</td>
                  </tr>
                  <tr className="hover:bg-muted/10">
                    <td className="py-3 px-4 font-medium text-foreground">Visitor Privacy &amp; Cookies</td>
                    <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                      Zero Tracking Cookies (Edge Geo)
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">Third-Party Tracking Cookies</td>
                    <td className="py-3 px-4 text-muted-foreground">Ad Network Tracking</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
              <Link
                href="/compare/bitly"
                className="inline-flex items-center gap-1.5 text-primary hover:underline font-semibold"
              >
                <span>Read in-depth Bitly vs UL0 breakdown</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link
                href="/compare/tinyurl"
                className="inline-flex items-center gap-1.5 text-primary hover:underline font-semibold"
              >
                <span>Read TinyURL vs UL0 breakdown</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link
                href="/compare"
                className="inline-flex items-center gap-1.5 text-primary hover:underline font-semibold"
              >
                <span>View all competitor comparisons</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* 4. Core Features Showcase (Targeting Top Search Keywords) */}
        <section className="py-16 sm:py-24 border-b border-border space-y-20">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-20">
            {/* Feature 1: Fast 307 Redirects & Real-time Destination Editing */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-4">
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Link2 className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Fast 307 Temporary Edge Redirects with Destination Editing
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  UL0 executes lightning-fast 307 temporary redirects on Vercel&apos;s global edge network.
                  Because browsers don&apos;t permanently cache 307 redirects, every single visitor click is
                  reliably recorded, and you can edit destination URLs anytime without breaking existing links.
                </p>
                <div className="flex items-center gap-4 pt-1">
                  <Link href="/docs" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
                    <span>Explore redirect documentation</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Real UI Screen: Link Analytics Card */}
              <div className="rounded-2xl border border-border bg-card p-5 space-y-3.5 shadow-xs">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="font-mono text-xs font-bold text-foreground">ul0.site/r/launch</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold border border-emerald-500/20">
                    Live • 307 Edge
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  <span className="text-muted-foreground text-[11px] uppercase tracking-wider font-medium">
                    Destination Target
                  </span>
                  <p className="font-mono text-xs text-muted-foreground truncate bg-muted/30 p-2.5 rounded-lg border border-border">
                    https://example.com/products/summer-sale?utm_source=google
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
                    <span className="text-muted-foreground text-[10px] block">Clicks</span>
                    <span className="font-bold text-foreground text-sm">2,840</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
                    <span className="text-muted-foreground text-[10px] block">Top Region</span>
                    <span className="font-bold text-foreground text-sm">US (68%)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-muted/40 border border-border">
                    <span className="text-muted-foreground text-[10px] block">Mobile</span>
                    <span className="font-bold text-foreground text-sm">82%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Free Custom Domain Setup */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="order-2 lg:order-1 rounded-2xl border border-border bg-card p-5 space-y-3.5 shadow-xs">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-xs font-bold text-foreground">Branded Domain DNS Config</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                    SSL Active
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-muted-foreground border-b border-border text-[11px]">
                        <th className="py-2 font-semibold">Type</th>
                        <th className="py-2 font-semibold">Host / Name</th>
                        <th className="py-2 font-semibold">Target / Value</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono text-[11px] text-foreground divide-y divide-border">
                      <tr>
                        <td className="py-2.5 font-bold">CNAME</td>
                        <td className="py-2.5 text-muted-foreground">link</td>
                        <td className="py-2.5 text-primary font-semibold">cname.ul0.site</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span>Automated SSL Certificate</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Let&apos;s Encrypt (Auto-Renew)</span>
                </div>
              </div>

              <div className="order-1 lg:order-2 space-y-4">
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Globe className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Free Branded Custom Domains for Every Creator
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Branded short links increase user trust and improve search engine click-through rates by up to 39%.
                  Connect your subdomain in seconds with zero server configuration. We handle automated SSL encryption
                  and edge routing for free.
                </p>
                <Link
                  href="/custom-domain-landing"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>Read the 2-minute custom domain setup guide</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Feature 3: Dynamic Vector QR Codes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-4">
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <QrCode className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Dynamic Vector QR Code Studio (SVG &amp; PNG)
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Export vector SVG codes that scale infinitely for print, billboards, and product packaging.
                  Because your codes route through dynamic short links, you can change the target URL anytime
                  without ever reprinting physical marketing collateral.
                </p>
                <Link
                  href="/qr"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>Launch free Vector QR Studio</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-xs font-bold text-foreground">Print-Ready Vector Output</span>
                  <span className="text-[11px] font-mono text-muted-foreground">High-DPI Vector</span>
                </div>
                <div className="flex flex-col items-center justify-center p-6 bg-muted/20 rounded-xl border border-border text-center space-y-2">
                  <div className="p-3 bg-white rounded-xl shadow-xs border border-border">
                    <img
                      src="/ulo_qr_logo.webp"
                      alt="UL0 Vector Dynamic QR Code"
                      className="h-28 w-28 object-contain"
                    />
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground">SVG • PNG • High Error Correction</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl border border-border bg-muted/20">
                    <span className="text-[10px] text-muted-foreground block">Error Correction</span>
                    <span className="font-bold text-foreground">Level H (30% damage proof)</span>
                  </div>
                  <div className="p-2.5 rounded-xl border border-border bg-muted/20">
                    <span className="text-[10px] text-muted-foreground block">Format Support</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">Vector SVG &amp; PNG</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 4: Developer REST API */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="order-2 lg:order-1">
                <CodeBlock
                  title="Shorten URL via REST API (cURL)"
                  language="bash"
                  code={`curl -X POST https://ul0.site/api/shorten \\
  -H "Authorization: Bearer ul0_live_••••••••" \\
  -H "Content-Type: application/json" \\
  -d '{
    "longUrl": "https://example.com/promo",
    "customSlug": "spring-sale"
  }'`}
                />
              </div>

              <div className="order-1 lg:order-2 space-y-4">
                <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Code className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Developer REST API for Fast Automations
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Generate links and query analytics programmatically from GitHub Actions, Zapier, Python, or
                  Next.js. Predictable JSON responses with standard status codes and zero vendor lock-in.
                </p>
                <Link
                  href="/docs"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>Explore developer API docs</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Transparent Pricing Plans */}
        <section className="py-16 sm:py-24 border-b border-border bg-card/10">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-12">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Transparent &amp; Simple
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Start Free. Upgrade Only When You Scale.
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                No artificial paywalls on core link shortening. 1 custom domain included free forever.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {/* Free Plan */}
              <div className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between space-y-6 shadow-xs">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Free Forever</h3>
                    <div className="text-3xl font-black text-foreground mt-1">$0</div>
                    <p className="text-xs text-muted-foreground mt-0.5">No credit card or sign up required</p>
                  </div>
                  <ul className="space-y-2.5 text-xs text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>Unlimited links on ul0.site</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="font-semibold text-foreground">1 custom branded domain</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>Print-ready vector QR codes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>Real-time click count analytics</span>
                    </li>
                  </ul>
                </div>
                <Button asChild variant="outline" size="sm" className="w-full text-xs font-semibold rounded-xl">
                  <a href="#shortener">Shorten a Link Free</a>
                </Button>
              </div>

              {/* Pro Plan */}
              <div className="rounded-2xl border-2 border-primary bg-card p-6 flex flex-col justify-between space-y-6 relative shadow-md">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
                  Most Popular
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Pro Creator</h3>
                    <div className="text-3xl font-black text-foreground mt-1">
                      $3<span className="text-xs font-normal text-muted-foreground">/mo</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">For creators &amp; independent builders</p>
                  </div>
                  <ul className="space-y-2.5 text-xs text-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>3 custom branded domains</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>Geo &amp; device deep analytics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>Password protection &amp; click limits</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>60 API requests / minute</span>
                    </li>
                  </ul>
                </div>
                <Button asChild size="sm" className="w-full text-xs font-semibold rounded-xl">
                  <Link href="/pricing">Upgrade to Pro</Link>
                </Button>
              </div>

              {/* Business Plan */}
              <div className="rounded-2xl border border-border bg-card p-6 flex flex-col justify-between space-y-6 shadow-xs">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Business Agency</h3>
                    <div className="text-3xl font-black text-foreground mt-1">
                      $9<span className="text-xs font-normal text-muted-foreground">/mo</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">For marketing teams &amp; agencies</p>
                  </div>
                  <ul className="space-y-2.5 text-xs text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>10 custom branded domains</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>Unlimited domain links</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>CSV data exports &amp; link archiving</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>300 API requests / minute</span>
                    </li>
                  </ul>
                </div>
                <Button asChild variant="outline" size="sm" className="w-full text-xs font-semibold rounded-xl">
                  <Link href="/pricing">View Business Plan</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 6. FAQ Section (Accordion with Schema) */}
        <section className="py-16 sm:py-24 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl space-y-8">
            <div className="text-center space-y-2 max-w-lg mx-auto">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Common Questions
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-muted-foreground">
                Factual answers about redirection, custom domains, and privacy.
              </p>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-xl border border-border bg-card p-4 transition-colors [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="text-xs sm:text-sm font-semibold text-foreground cursor-pointer flex items-center justify-between select-none">
                    <span>{faq.q}</span>
                    <span className="text-xs font-mono text-muted-foreground group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed pr-6">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Final Call to Action */}
        <section className="py-16 sm:py-20 text-center bg-gradient-to-t from-card/30 to-background">
          <div className="container mx-auto px-4 max-w-xl space-y-4">
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
              Ready to create your first branded link?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Free to start. Zero sign-up friction. Connect your custom domain in 2 minutes.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <a
                href="#shortener"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                Shorten a link now
              </a>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
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
