import React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LinkShortenerForm } from "@/components/link-shortener-form"
import {
  Link2,
  QrCode,
  Globe,
  BarChart3,
  Check,
  ChevronRight,
  GitBranch,
  ShieldCheck,
  Lock,
  Zap,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Search,
  Layers,
  Sparkles,
} from "lucide-react"

export const metadata: Metadata = {
  title: "UL0: Free Branded Short Links, QR Codes & Analytics",
  description:
    "Shorten links instantly. Add a free custom domain, create dynamic vector QR codes, and track clicks without tracking cookies.",
  alternates: {
    canonical: "https://ul0.site",
  },
  openGraph: {
    title: "UL0: Free Branded Short Links, QR Codes & Analytics",
    description:
      "Shorten links instantly. Add a free custom domain, create dynamic vector QR codes, and track clicks without tracking cookies.",
    url: "https://ul0.site",
    siteName: "UL0",
    type: "website",
  },
}

const FAQS = [
  {
    q: "Can I shorten links on UL0 without creating an account?",
    a: "Yes. You can paste any URL and shorten it instantly with no account, signup, or credit card required. If you want to track analytics and edit destination URLs later, you can create a free account anytime.",
  },
  {
    q: "How does the free custom domain work and what are the limits?",
    a: "Every UL0 account includes 1 custom domain free forever with automatic SSL provisioning. The Free plan allows 1 active short link on your custom domain, while Pro ($3/mo) gives you 3 domains and 100 links per domain.",
  },
  {
    q: "Why does UL0 use 307 temporary redirects instead of 301?",
    a: "Traditional 301 redirects are permanently cached inside visitor web browsers, meaning repeat clicks bypass your analytics and destination edits never take effect. UL0 uses 307 temporary redirects so every click is counted and destinations can be updated instantly.",
  },
  {
    q: "Does UL0 track visitors with advertising cookies?",
    a: "No. UL0 is strictly privacy-first. We do not use third-party tracking cookies, marketing pixels, or session recorders. All click metrics (country, device, browser, referrer) are aggregated safely without invading visitor privacy.",
  },
]

const FREE_TOOLS = [
  {
    name: "Vector QR Studio",
    desc: "Generate SVG and PNG vector QR codes with high error correction.",
    href: "/qr",
    icon: QrCode,
  },
  {
    name: "UTM Campaign Builder",
    desc: "Build tracking parameters for GA4 and marketing campaigns.",
    href: "/utm",
    icon: Layers,
  },
  {
    name: "HTTP Redirect Checker",
    desc: "Trace HTTP status codes, 301/302 redirects, and destination paths.",
    href: "/tools/redirect-checker",
    icon: Search,
  },
  {
    name: "URL Target Expander",
    desc: "Inspect short URLs safely before clicking to detect phishing or malware.",
    href: "/tools/url-expander",
    icon: ShieldCheck,
  },
  {
    name: "OpenGraph Previewer",
    desc: "Preview how your links appear on Twitter, LinkedIn, Facebook, and Slack.",
    href: "/tools/og-preview",
    icon: BarChart3,
  },
  {
    name: "Meta Tag Generator",
    desc: "Create SEO and social share tags with preview and instant HTML copy.",
    href: "/tools/meta-tag-generator",
    icon: Sparkles,
  },
  {
    name: "WiFi Network QR",
    desc: "Generate scannable WiFi login codes with zero data sent to servers.",
    href: "/wifi",
    icon: Zap,
  },
  {
    name: "WhatsApp Click-to-Chat",
    desc: "Create pre-filled WhatsApp direct chat links and scannable QR codes.",
    href: "/whatsapp",
    icon: MessageSquare,
  },
]

export default function HomePage() {
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

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* FAQ Schema for Google Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header />

      <main className="flex-1">
        {/* 1. Hero Section - Make a link in one step per PDF Section 6 */}
        <section id="shortener" className="pt-14 pb-16 sm:pt-24 sm:pb-28 border-b border-border bg-gradient-to-b from-card/50 via-background to-background">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center space-y-6">
            {/* H1 68px */}
            <h1 className="text-3xl sm:text-5xl lg:text-[68px] font-bold tracking-tight text-foreground leading-[1.08]">
              Branded short links, QR codes and analytics
            </h1>

            {/* One 20px subhead */}
            <p className="mx-auto max-w-2xl text-[17px] sm:text-[20px] text-muted-foreground leading-relaxed">
              Shorten a link in seconds. Add your own domain for free. See who clicks, without cookies.
            </p>

            {/* Link Shortener Form */}
            <div className="pt-4 max-w-2xl mx-auto">
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-7 shadow-xs">
                <LinkShortenerForm />
              </div>
            </div>

            {/* Memorable "0s" Proof Card per PDF Section 4 & 6 */}
            <div className="pt-2 flex items-center justify-center">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl border border-border bg-card/60 text-sm">
                <span className="text-2xl font-black text-primary font-mono tracking-tight">0s</span>
                <span className="text-muted-foreground text-left text-xs sm:text-sm">
                  wait time on short links • No forced delay • Direct 307 temporary redirects
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Trust Strip - 4 Checkable Facts per PDF Section 6 */}
        <section className="border-b border-border bg-card/30 py-4">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs sm:text-sm text-muted-foreground text-center">
              <div className="flex items-center justify-center gap-2">
                <Zap className="h-4 w-4 text-primary shrink-0" />
                <span className="text-foreground font-medium">Fast 307 Redirects</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Lock className="h-4 w-4 text-primary shrink-0" />
                <span className="text-foreground font-medium">Zero Tracking Cookies</span>
              </div>
              <a
                href="https://github.com/Saketkesar/ul0"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 hover:text-foreground transition-colors"
              >
                <GitBranch className="h-4 w-4 text-primary shrink-0" />
                <span className="text-foreground font-medium">100% Open Source</span>
              </a>
              <div className="flex items-center justify-center gap-2">
                <Globe className="h-4 w-4 text-primary shrink-0" />
                <span className="text-foreground font-medium">1 Free Custom Domain</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Features Section - Links, QR, Domains. Each ends in a limit link per PDF Section 6 */}
        <section className="py-20 sm:py-28 border-b border-border space-y-24">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-24">
            {/* Feature 1: Short Links */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Link2 className="h-5 w-5" />
                </div>
                <h2 className="text-2xl sm:text-[36px] font-bold tracking-tight text-foreground leading-tight">
                  Short links you own and can edit anytime
                </h2>
                <p className="text-[16px] sm:text-[17px] text-muted-foreground leading-relaxed">
                  Most URL shorteners use permanently cached 301 redirects, meaning repeat clicks bypass your analytics and destination edits break. UL0 serves fast 307 temporary edge redirects so you can update target destinations instantly without breaking printed material.
                </p>
                <div className="pt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Free plan limit:</span>
                  <Link href="/pricing" className="font-semibold text-primary hover:underline inline-flex items-center gap-1">
                    Unlimited public links, 1 custom domain link
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-sm font-semibold text-foreground">Real-Time Destination Update</span>
                  <span className="text-xs font-mono text-primary font-bold">HTTP 307</span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-surface-2 border border-border">
                    <span className="text-muted-foreground block text-[11px]">Short Link</span>
                    <span className="text-foreground font-semibold">https://ul0.site/r/summer-sale</span>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-2 border border-border">
                    <span className="text-muted-foreground block text-[11px]">Destination (editable live)</span>
                    <span className="text-foreground">https://yourstore.com/collections/summer-2026</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Vector QR Codes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="order-2 lg:order-1 rounded-2xl border border-border bg-card p-6 flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-white rounded-xl border border-border">
                  <Image
                    src="/ulo_qr.webp"
                    alt="UL0 Vector Dynamic QR Code"
                    width={180}
                    height={180}
                    className="h-36 w-36 object-contain"
                  />
                </div>
                <div className="text-center space-y-1">
                  <span className="text-xs font-mono text-muted-foreground block">
                    SVG • PNG • Level H (30% Damage Proof)
                  </span>
                  <span className="text-xs text-primary font-semibold">
                    Dynamic: Destination changes without reprinting
                  </span>
                </div>
              </div>

              <div className="order-1 lg:order-2 space-y-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <QrCode className="h-5 w-5" />
                </div>
                <h2 className="text-2xl sm:text-[36px] font-bold tracking-tight text-foreground leading-tight">
                  Dynamic vector QR codes ready for print
                </h2>
                <p className="text-[16px] sm:text-[17px] text-muted-foreground leading-relaxed">
                  Export vector SVG and high-resolution PNG QR codes tailored for product packaging, menus, and flyers. Because your QR code points to your dynamic short link, you can change where it goes anytime without reprinting.
                </p>
                <div className="pt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Free plan limit:</span>
                  <Link href="/pricing" className="font-semibold text-primary hover:underline inline-flex items-center gap-1">
                    Unlimited SVG &amp; PNG downloads
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Feature 3: Branded Custom Domains */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div className="space-y-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Globe className="h-5 w-5" />
                </div>
                <h2 className="text-2xl sm:text-[36px] font-bold tracking-tight text-foreground leading-tight">
                  1 branded custom domain included free
                </h2>
                <p className="text-[16px] sm:text-[17px] text-muted-foreground leading-relaxed">
                  Build brand trust by shortening links with your own custom domain (e.g., link.yourcompany.com). Bitly charges $35/month for branded links. UL0 includes 1 custom domain free forever on every single account.
                </p>
                <div className="pt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Free plan limit:</span>
                  <Link href="/pricing" className="font-semibold text-primary hover:underline inline-flex items-center gap-1">
                    1 domain, 1 domain link on free
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <span className="text-sm font-semibold text-foreground">Custom Domain DNS Verification</span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Automated SSL</span>
                </div>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-surface-2 border border-border flex items-center justify-between">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Type / Host</span>
                      <span className="text-foreground font-semibold">CNAME link</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Target Value</span>
                      <span className="text-primary font-semibold">cname.ul0.site</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-2 border border-border">
                    <span className="text-muted-foreground block text-[11px]">Resulting Branded Link</span>
                    <span className="text-foreground font-semibold">https://link.yourbrand.com/launch</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Compare Section - Dated, Sourced Table per PDF Section 6 */}
        <section className="py-20 sm:py-28 border-b border-border bg-card/20">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-10">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-[36px] font-bold tracking-tight text-foreground">
                How UL0 compares to traditional shorteners
              </h2>
              <p className="text-[16px] sm:text-[17px] text-muted-foreground">
                Dated, verified comparison against Bitly, TinyURL, and Cuttly. Last verified November 2026.
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border bg-surface-2 text-muted-foreground font-medium">
                    <th className="py-3.5 px-4">Feature</th>
                    <th className="py-3.5 px-4 font-bold text-primary">UL0</th>
                    <th className="py-3.5 px-4">Bitly</th>
                    <th className="py-3.5 px-4">TinyURL</th>
                    <th className="py-3.5 px-4">Cuttly</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-foreground">Custom domain on free</td>
                    <td className="py-3.5 px-4 font-semibold text-primary">1 domain ($0)</td>
                    <td className="py-3.5 px-4 text-muted-foreground">Paid only ($35/mo)</td>
                    <td className="py-3.5 px-4 text-muted-foreground">Paid only ($12.99/mo)</td>
                    <td className="py-3.5 px-4 text-muted-foreground">Paid only ($12/mo)</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-foreground">Free monthly link cap</td>
                    <td className="py-3.5 px-4 font-semibold text-primary">Unlimited public links</td>
                    <td className="py-3.5 px-4 text-muted-foreground">5 links / month</td>
                    <td className="py-3.5 px-4 text-muted-foreground">Limited active links</td>
                    <td className="py-3.5 px-4 text-muted-foreground">30 links / month</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-foreground">Signup required to shorten</td>
                    <td className="py-3.5 px-4 font-semibold text-primary">No (instant)</td>
                    <td className="py-3.5 px-4 text-muted-foreground">Yes</td>
                    <td className="py-3.5 px-4 text-muted-foreground">No</td>
                    <td className="py-3.5 px-4 text-muted-foreground">Yes</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-foreground">Redirect architecture</td>
                    <td className="py-3.5 px-4 font-semibold text-primary">307 (editable live)</td>
                    <td className="py-3.5 px-4 text-muted-foreground">301 (cached)</td>
                    <td className="py-3.5 px-4 text-muted-foreground">301 (cached)</td>
                    <td className="py-3.5 px-4 text-muted-foreground">301 (cached)</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-foreground">Starting paid plan</td>
                    <td className="py-3.5 px-4 font-semibold text-primary">$3 / month</td>
                    <td className="py-3.5 px-4 text-muted-foreground">$10–$35 / month</td>
                    <td className="py-3.5 px-4 text-muted-foreground">$12.99 / month</td>
                    <td className="py-3.5 px-4 text-muted-foreground">$12 / month</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="text-center pt-2">
              <Link href="/compare" className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1">
                View full in-depth competitor breakdown
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 5. Free Tools Section - Eight Cards per PDF Section 6 */}
        <section className="py-20 sm:py-28 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-[36px] font-bold tracking-tight text-foreground">
                Free web productivity tools
              </h2>
              <p className="text-[16px] sm:text-[17px] text-muted-foreground">
                Zero sign-up required. Fast, client-side, and privacy-first utilities.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {FREE_TOOLS.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="rounded-xl border border-border bg-card p-5 space-y-3 hover:border-primary/50 hover:bg-surface-2 transition-all group"
                >
                  <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <tool.icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center pt-2">
              <Link href="/tools" className="text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1">
                Browse all free tools
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 6. Pricing Section - Limits from plans.ts shown as written per PDF Section 6 */}
        <section className="py-20 sm:py-28 border-b border-border bg-card/20">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-12">
            <div className="text-center space-y-3 max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-[36px] font-bold tracking-tight text-foreground">
                Simple, transparent pricing
              </h2>
              <p className="text-[16px] sm:text-[17px] text-muted-foreground">
                Start free with no credit card. Upgrade only when you need more custom domains or API access.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {/* Free Plan */}
              <div className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Free</h3>
                    <div className="text-3xl font-bold text-foreground mt-1">$0</div>
                    <p className="text-xs text-muted-foreground mt-1">No credit card or signup required</p>
                  </div>
                  <ul className="space-y-2.5 text-xs text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>Unlimited public short links (ul0.site)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span className="font-semibold text-foreground">1 custom branded domain</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>1 link on custom domain</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>Print-ready vector QR codes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>Basic domain link analytics</span>
                    </li>
                  </ul>
                </div>
                <Button asChild variant="outline" size="sm" className="w-full text-xs font-semibold rounded-lg">
                  <a href="#shortener">Shorten a link free</a>
                </Button>
              </div>

              {/* Pro Plan */}
              <div className="rounded-xl border-2 border-primary bg-card p-6 flex flex-col justify-between space-y-6 relative shadow-sm">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
                  Popular
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Pro</h3>
                    <div className="text-3xl font-bold text-foreground mt-1">
                      $3<span className="text-xs font-normal text-muted-foreground">/mo</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">For creators &amp; independent builders</p>
                  </div>
                  <ul className="space-y-2.5 text-xs text-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>Up to 3 custom branded domains</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>100 short links per domain</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>Full analytics for all links</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>Link deletion &amp; archiving</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>REST API access (60 req/min)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                </div>
                <Button asChild size="sm" className="w-full text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/pricing">Upgrade to Pro</Link>
                </Button>
              </div>

              {/* Business Plan */}
              <div className="rounded-xl border border-border bg-card p-6 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Business</h3>
                    <div className="text-3xl font-bold text-foreground mt-1">
                      $9<span className="text-xs font-normal text-muted-foreground">/mo</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">For teams and marketing agencies</p>
                  </div>
                  <ul className="space-y-2.5 text-xs text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>Up to 10 custom branded domains</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>Unlimited domain short links</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>Full analytics &amp; CSV data export</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>High-speed API (300 req/min)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>Dedicated support</span>
                    </li>
                  </ul>
                </div>
                <Button asChild variant="outline" size="sm" className="w-full text-xs font-semibold rounded-lg">
                  <Link href="/pricing">View Business Plan</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 7. FAQ Section - Four Honest Answers Matching Product per PDF Section 6 */}
        <section className="py-20 sm:py-28 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl space-y-8">
            <div className="text-center space-y-3 max-w-lg mx-auto">
              <h2 className="text-2xl sm:text-[36px] font-bold tracking-tight text-foreground">
                Frequently Asked Questions
              </h2>
              <p className="text-[16px] text-muted-foreground">
                Honest answers about redirection, custom domains, and privacy.
              </p>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-xl border border-border bg-card p-5 transition-colors [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="text-[16px] font-semibold text-foreground cursor-pointer flex items-center justify-between select-none">
                    <span>{faq.q}</span>
                    <span className="text-sm font-mono text-muted-foreground group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-[15px] text-muted-foreground leading-relaxed pr-6">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Final CTA - One Button per PDF Section 6 */}
        <section className="py-20 sm:py-28 text-center bg-card/20">
          <div className="container mx-auto px-4 max-w-xl space-y-5">
            <h2 className="text-3xl sm:text-[44px] font-bold tracking-tight text-foreground">
              Ready to create your branded link?
            </h2>
            <p className="text-[16px] sm:text-[17px] text-muted-foreground">
              Free to start. 1 custom domain included. Zero tracking cookies.
            </p>
            <div className="pt-2">
              <a
                href="#shortener"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                Create your free link now
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
