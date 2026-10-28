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
  ArrowRight,
  ExternalLink,
  ChevronRight,
  GitBranch,
} from "lucide-react"

export const metadata: Metadata = {
  title: "UL0 - URL Shortener, QR Codes and Custom Domains",
  description:
    "Shorten links, generate dynamic vector QR codes, and connect branded custom domains with privacy-first click analytics. Free to use with no account required.",
  alternates: {
    canonical: "https://ul0.site",
  },
}

const FAQS = [
  {
    q: "Are short links created on UL0 permanent?",
    a: "Yes. Short links created on ul0.site do not have an automated expiration date and will redirect reliably as long as they comply with our Acceptable Use Policy.",
  },
  {
    q: "Why do you use 307 redirects instead of 301?",
    a: "Standard 301 redirects are cached permanently by web browsers, which causes repeat clicks to bypass the server (resulting in inaccurate click counts) and prevents destination URL edits from taking effect. We use 307 temporary redirects to ensure every visitor click is counted and destinations can be updated in real time.",
  },
  {
    q: "Do you use advertising or tracking cookies?",
    a: "No. UL0 does not set any advertising or third-party behavioral cookies. Click analytics are aggregated using edge request headers without tracking individuals across sites.",
  },
  {
    q: "How does the free custom domain feature work?",
    a: "Every UL0 account includes 1 custom domain connection for free. You point a CNAME DNS record from your domain or subdomain (e.g., link.yourbrand.com) to cname.ul0.site. SSL certificates are issued and renewed automatically.",
  },
  {
    q: "What happens to abusive or phishing links?",
    a: "All destination URLs are screened against threat intelligence feeds. Links reported through our abuse portal or detected distributing malware are deactivated immediately.",
  },
  {
    q: "Can I manage links programmatically via API?",
    a: "Yes. Every account can generate secret API keys to shorten URLs, attach custom aliases, and query click metrics using standardized JSON REST endpoints.",
  },
]

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <section id="shortener" className="pt-14 pb-16 sm:pt-20 sm:pb-24 border-b border-border bg-card/20">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center space-y-5">
            <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.15]">
              Short links, QR codes and custom domains.
            </h1>
            <p className="mx-auto max-w-xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Create branded short links on your own domain, generate printable vector QR codes,
              and measure traffic with privacy-first click analytics.
            </p>

            {/* Creator Tool Inline */}
            <div className="pt-2">
              <LinkShortenerForm />
            </div>
          </div>
        </section>

        {/* 2. Trust Strip */}
        <section className="border-b border-border bg-muted/20 py-4">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-muted-foreground">
              <Link href="/status" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>99.98% Edge Uptime</span>
              </Link>
              <Link href="/security" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                <span>Automated Threat Screening</span>
              </Link>
              <Link href="/privacy" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors">
                <span>Zero Tracking Cookies</span>
              </Link>
              <a
                href="https://github.com/Saketkesar/ul0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
              >
                <GitBranch className="h-3.5 w-3.5" />
                <span>Open Source on GitHub</span>
              </a>
              <Link href="/report-abuse" className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors text-destructive">
                <span>Report Abuse</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 3. How It Works (Product UI preview, no icon cards) */}
        <section className="py-16 sm:py-24 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-12">
            <div className="max-w-xl space-y-2">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                How link shortening works
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Three straightforward steps to shorten, brand, and measure any URL.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-lg border border-border bg-card p-5 space-y-3">
                <span className="text-xs font-mono font-semibold text-primary">01</span>
                <h3 className="text-sm font-semibold text-foreground">Paste and shorten</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Enter any long URL or UTM link. Choose an optional custom slug or generate a random short back-half.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-5 space-y-3">
                <span className="text-xs font-mono font-semibold text-primary">02</span>
                <h3 className="text-sm font-semibold text-foreground">Brand your domain</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Connect your custom domain (such as link.yourbrand.com) via CNAME. SSL certificates are issued automatically.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-5 space-y-3">
                <span className="text-xs font-mono font-semibold text-primary">03</span>
                <h3 className="text-sm font-semibold text-foreground">Inspect performance</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Track visits by country, device, browser, and referring website in real time without cookies.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Product Deep-Dives (Alternating real UI representations) */}
        <section className="py-16 sm:py-24 border-b border-border space-y-20">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-20">
            {/* Feature 1: Fast redirects & editing */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-4">
                <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                  <Link2 className="h-4 w-4" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                  Edge redirection that never locks you in
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  UL0 uses 307 temporary redirects to ensure repeat clicks always register on the server.
                  If your target landing page changes or a campaign expires, edit the destination anytime
                  without breaking existing links.
                </p>
                <Link href="/docs" className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1">
                  <span>Learn about redirect behavior</span>
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Real UI Screen: Link Card */}
              <div className="rounded-lg border border-border bg-card p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="font-mono text-xs font-semibold text-foreground">ul0.site/r/launch</span>
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">Active</span>
                </div>
                <div className="space-y-1 text-xs">
                  <span className="text-muted-foreground text-[11px]">Destination</span>
                  <p className="font-mono text-xs text-muted-foreground truncate">
                    https://example.com/products/summer-sale?utm_source=twitter
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border text-center text-xs">
                  <div className="p-2 rounded bg-muted/30">
                    <span className="text-muted-foreground text-[10px] block">Clicks</span>
                    <span className="font-semibold text-foreground">1,420</span>
                  </div>
                  <div className="p-2 rounded bg-muted/30">
                    <span className="text-muted-foreground text-[10px] block">Top Country</span>
                    <span className="font-semibold text-foreground">US (64%)</span>
                  </div>
                  <div className="p-2 rounded bg-muted/30">
                    <span className="text-muted-foreground text-[10px] block">Mobile</span>
                    <span className="font-semibold text-foreground">78%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Vector QR Studio */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="order-2 lg:order-1 rounded-lg border border-border bg-card p-5 space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-xs font-semibold text-foreground">Vector QR Code Generator</span>
                  <span className="text-[11px] font-mono text-muted-foreground">SVG + PNG</span>
                </div>
                <div className="flex items-center justify-center p-4 bg-background rounded border border-border">
                  <div className="w-32 h-32 bg-foreground text-background flex items-center justify-center font-mono text-[10px] text-center p-2 rounded">
                    [High-Resolution Dynamic QR]
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded border border-border bg-muted/20">
                    <span className="text-[10px] text-muted-foreground block">Error Correction</span>
                    <span className="font-semibold text-foreground">Level H (30%)</span>
                  </div>
                  <div className="p-2 rounded border border-border bg-muted/20">
                    <span className="text-[10px] text-muted-foreground block">Color Contrast</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">18:1 (Optimal)</span>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2 space-y-4">
                <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                  <QrCode className="h-4 w-4" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                  Dynamic QR codes ready for print
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Export vector SVG codes that stay sharp at any print scale. Because codes point to a
                  dynamic short link, you can change the target URL anytime without reprinting menus,
                  packaging, or promotional cards.
                </p>
                <Link href="/qr" className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1">
                  <span>Open QR Code Studio</span>
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Feature 3: Custom Domains */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-4">
                <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                  <Globe className="h-4 w-4" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                  Branded short links on your own domain
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Branded domains improve click-through rates by establishing brand recognition.
                  Connect your subdomain in minutes with automatic SSL certificate provisioning and
                  zero maintenance overhead.
                </p>
                <Link href="/custom-domain-landing" className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1">
                  <span>View DNS setup guide</span>
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>

              {/* Real DNS UI card */}
              <div className="rounded-lg border border-border bg-card p-5 space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-xs font-semibold text-foreground">DNS Record Configuration</span>
                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400">Verified</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-muted-foreground border-b border-border/60">
                        <th className="py-1.5 font-medium">Type</th>
                        <th className="py-1.5 font-medium">Name</th>
                        <th className="py-1.5 font-medium">Target</th>
                      </tr>
                    </thead>
                    <tbody className="font-mono text-[11px] text-foreground">
                      <tr>
                        <td className="py-1.5">CNAME</td>
                        <td className="py-1.5">link</td>
                        <td className="py-1.5 text-primary">cname.ul0.site</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                  <span>SSL: Automated Let&apos;s Encrypt</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Active</span>
                </div>
              </div>
            </div>

            {/* Feature 4: Developer REST API */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="order-2 lg:order-1">
                <CodeBlock
                  title="Shorten URL via REST API"
                  language="bash"
                  code={`curl -X POST https://ul0.site/api/shorten \\
  -H "Authorization: Bearer ul0_live_••••••••" \\
  -H "Content-Type: application/json" \\
  -d '{
    "longUrl": "https://example.com/product/123",
    "customSlug": "my-promo"
  }'`}
                />
              </div>

              <div className="order-1 lg:order-2 space-y-4">
                <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                  <Code className="h-4 w-4" />
                </div>
                <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                  A simple REST API for developers
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Integrate link generation and analytics into your internal workflows, CI/CD jobs, or
                  applications. All endpoints accept JSON and return predictable responses.
                </p>
                <Link href="/docs" className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1">
                  <span>Explore Developer Documentation</span>
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Pricing Summary (3 columns with exact numbers, linking to /pricing) */}
        <section className="py-16 sm:py-24 border-b border-border bg-card/10">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-12">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <h2 className="text-xl sm:text-3xl font-semibold tracking-tight text-foreground">
                Predictable, transparent plans
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Start free. Upgrade only when you require additional custom domains or higher API throughput.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {/* Free Plan */}
              <div className="rounded-lg border border-border bg-card p-6 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Free</h3>
                    <div className="text-3xl font-bold text-foreground mt-1">$0</div>
                    <p className="text-xs text-muted-foreground mt-0.5">Free forever, no card needed</p>
                  </div>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>Unlimited links on ul0.site</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>1 custom branded domain</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>Dynamic vector QR codes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>Real-time click count analytics</span>
                    </li>
                  </ul>
                </div>
                <Button asChild variant="outline" size="sm" className="w-full text-xs font-semibold">
                  <Link href="/sign-up">Start free</Link>
                </Button>
              </div>

              {/* Pro Plan (Subtle border highlight) */}
              <div className="rounded-lg border-2 border-primary bg-card p-6 flex flex-col justify-between space-y-6 relative">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold text-primary uppercase tracking-wider">Pro</h3>
                    <div className="text-3xl font-bold text-foreground mt-1">
                      $3<span className="text-xs font-normal text-muted-foreground">/mo</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">For creators &amp; independent builders</p>
                  </div>
                  <ul className="space-y-2 text-xs text-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>3 custom branded domains</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>100 custom domain links</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>Geo, device &amp; referrer breakdown</span>
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
                <Button asChild size="sm" className="w-full text-xs font-semibold">
                  <Link href="/pricing">Upgrade to Pro</Link>
                </Button>
              </div>

              {/* Business Plan */}
              <div className="rounded-lg border border-border bg-card p-6 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Business</h3>
                    <div className="text-3xl font-bold text-foreground mt-1">
                      $9<span className="text-xs font-normal text-muted-foreground">/mo</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">For agencies and growing teams</p>
                  </div>
                  <ul className="space-y-2 text-xs text-muted-foreground">
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
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                </div>
                <Button asChild variant="outline" size="sm" className="w-full text-xs font-semibold">
                  <Link href="/pricing">View Business Plan</Link>
                </Button>
              </div>
            </div>

            <div className="text-center pt-2">
              <Link href="/compare" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-medium">
                <span>See side-by-side comparison against Bitly, Short.io, and Dub</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </section>

        {/* 6. FAQ Section (Accordion) */}
        <section className="py-16 sm:py-24 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl space-y-8">
            <div className="text-center space-y-2 max-w-lg mx-auto">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-muted-foreground">
                Literal, factual answers about redirection, privacy, and limits.
              </p>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-md border border-border bg-card p-4 transition-colors [&_summary::-webkit-details-marker]:hidden"
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
        <section className="py-16 sm:py-20 text-center">
          <div className="container mx-auto px-4 max-w-xl space-y-4">
            <h2 className="text-xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Create your first short link or QR code.
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Free to start. No credit card required. Connect a custom domain in minutes.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <a
                href="#shortener"
                className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Shorten a link now
              </a>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-md border border-border bg-card px-4 py-2.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                View plan details
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
