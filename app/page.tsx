import React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LinkShortenerForm } from "@/components/link-shortener-form"
import { FloatingActionDock } from "@/components/floating-action-dock"
import { UL0Icon } from "@/components/ul0-icon"
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
  Users,
  Copy,
} from "lucide-react"

export const metadata: Metadata = {
  title: "UL0: Shorten Links the Cute, Clean Way",
  description:
    "Paste a long URL, get a tiny ul0.in link with vector QR and click stats. 1 custom domain free forever, zero tracking cookies, no account needed.",
  alternates: {
    canonical: "https://ul0.site",
  },
  openGraph: {
    title: "UL0: Shorten Links the Cute, Clean Way",
    description:
      "Paste a long URL, get a tiny ul0.in link with vector QR and click stats. 1 custom domain free forever, zero tracking cookies, no account needed.",
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

const TINY_TOOLS = [
  {
    name: "QR generator",
    tag: "PNG + SVG",
    href: "/qr",
    iconName: "qr",
  },
  {
    name: "WhatsApp link",
    tag: "2 clicks",
    href: "/whatsapp",
    iconName: "whatsapp",
  },
  {
    name: "Wi-Fi QR",
    tag: "for cafés",
    href: "/wifi",
    iconName: "wifi",
  },
  {
    name: "UTM builder",
    tag: "for ads",
    href: "/utm",
    iconName: "target",
  },
  {
    name: "Split bills",
    tag: "with friends",
    href: "/split",
    iconName: "splitbill",
  },
  {
    name: "PDF tools",
    tag: "in browser",
    href: "/pdf",
    iconName: "pdf",
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
        {/* 1. Hero Section - Matching UL0Homecuteclean.png */}
        <section
          id="shortener"
          className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-border overflow-hidden"
        >
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center space-y-6 sm:space-y-8 relative z-10">
            {/* Top Row: Floating Stickers + Badge */}
            <div className="flex items-center justify-center gap-3 sm:gap-6 relative">
              {/* Left tilted sticker */}
              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#0F1E36] border border-border/80 shadow-2xs -rotate-6 text-xs font-mono text-muted-foreground select-none">
                ✦ ul0.in/
              </div>

              {/* Center badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#0F1E36] border border-border/80 shadow-2xs text-xs font-medium text-foreground select-none">
                <span className="h-2 w-2 rounded-full bg-[#EE6123] inline-block" />
                <span>Free link shortener, QR + custom domains</span>
              </div>

              {/* Right tilted sticker */}
              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B1736] dark:bg-white text-white dark:text-[#0B1736] shadow-2xs rotate-6 text-xs font-mono select-none">
                <UL0Icon name="qr" size={13} />
                <span>scan me</span>
              </div>
            </div>

            {/* Main Title: 2 lines */}
            <h1 className="text-4xl sm:text-6xl lg:text-[76px] font-extrabold tracking-tight text-foreground leading-[1.05]">
              Shorten links the<br />cute, clean way.
            </h1>

            {/* Subhead */}
            <p className="mx-auto max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              Paste a long URL, get a tiny ul0.in link with QR and click stats.<br className="hidden sm:inline" />
              Free, no account needed.
            </p>

            {/* Link Shortener Form */}
            <div className="pt-2 max-w-2xl mx-auto">
              <LinkShortenerForm />
            </div>

            {/* Sample Result Preview Card (Visible as Cute Inspiration) */}
            <div className="pt-2">
              <div className="relative max-w-xl mx-auto rounded-2xl border border-border/70 bg-white dark:bg-[#0F1E36] p-4 sm:p-5 shadow-2xs text-left">
                <div className="absolute -top-3 left-6 px-2.5 py-0.5 rounded-full bg-[#EE6123]/10 border border-[#EE6123]/30 text-[#EE6123] text-[10px] font-bold tracking-tight select-none">
                  no sign-up ↗
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
                  <div className="flex items-center gap-3.5 w-full sm:w-auto">
                    <div className="h-12 w-12 rounded-xl border border-border bg-white p-1 shrink-0 flex items-center justify-center">
                      <UL0Icon name="qr" size={38} />
                    </div>
                    <div>
                      <div className="text-sm sm:text-base font-bold text-foreground">
                        ul0.in/diwali-sale
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        1,248 clicks
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border bg-card text-xs font-semibold text-foreground shadow-2xs select-none">
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0B1736] dark:bg-white text-white dark:text-[#0B1736] text-xs font-semibold shadow-2xs select-none">
                      <BarChart3 className="h-3.5 w-3.5" />
                      <span>Stats</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. "Three things, done well" Section */}
        <section className="py-20 sm:py-28 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-14 sm:space-y-16">
            <div className="text-center space-y-2 max-w-md mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Three things, done well
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Nothing else to learn.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 text-center md:text-left">
              {/* Col 1: Short links */}
              <div className="space-y-4 flex flex-col items-center md:items-start">
                <div className="h-14 w-14 rounded-2xl bg-[#EE6123]/10 flex items-center justify-center p-2.5">
                  <UL0Icon name="scissors" size={36} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-foreground">Short links</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    ul0.in/your-name in 2 seconds. Works everywhere, forever.
                  </p>
                </div>
              </div>

              {/* Col 2: Your domain */}
              <div className="space-y-4 flex flex-col items-center md:items-start">
                <div className="h-14 w-14 rounded-2xl bg-[#3DDBB8]/15 flex items-center justify-center p-2.5">
                  <UL0Icon name="domain" size={36} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-foreground">Your domain</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Connect shop.in once. 1 free, setup in 5 minutes.
                  </p>
                </div>
              </div>

              {/* Col 3: QR + stats */}
              <div className="space-y-4 flex flex-col items-center md:items-start">
                <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center p-2.5">
                  <UL0Icon name="qr" size={36} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-foreground">QR + stats</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    One QR you can re-point. See clicks by city &amp; app.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. "Free tiny tools" Section in Sand Beige Container */}
        <section className="py-20 sm:py-28 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <div className="rounded-3xl border border-border/60 bg-[#F5EFE6] dark:bg-[#162B4D]/30 p-6 sm:p-10 space-y-6">
              <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  Free tiny tools
                </h2>
                <Link
                  href="/tools"
                  className="text-xs sm:text-sm font-semibold text-foreground underline hover:text-[#EE6123] transition-colors"
                >
                  View all
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {TINY_TOOLS.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#0F1E36] border border-black/5 dark:border-white/5 hover:border-[#EE6123]/40 transition-all shadow-2xs group"
                  >
                    <div className="flex items-center gap-3">
                      <UL0Icon name={tool.iconName} size={28} />
                      <span className="text-sm font-bold text-foreground group-hover:text-[#EE6123] transition-colors">
                        {tool.name}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground px-2.5 py-1 rounded-full bg-muted/60">
                      {tool.tag}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. "Free forever. Upgrade if you grow." (Pricing Section) */}
        <section className="py-20 sm:py-28 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-12">
            <div className="text-center space-y-2 max-w-lg mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Free forever. Upgrade if you grow.
              </h2>
              <p className="text-sm text-muted-foreground">
                No credit card required to start. No surprise bills.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {/* Free Plan Card */}
              <div className="rounded-3xl border border-border bg-white dark:bg-card p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xs">
                <div className="space-y-4">
                  <div className="text-sm font-bold text-muted-foreground">Free</div>
                  <div className="text-4xl font-extrabold text-foreground tracking-tight">₹0</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    1 custom domain, unlimited short links, QR + stats.
                  </p>
                </div>
                <a
                  href="#shortener"
                  className="w-full text-center py-2.5 rounded-full border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  Start free
                </a>
              </div>

              {/* Pro Plan Card (Dark Inverted Card with popular badge matching mockup) */}
              <div className="rounded-3xl bg-[#18181B] text-white p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl relative">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">Pro</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#EE6123] text-white text-[10px] font-bold">
                      popular
                    </span>
                  </div>
                  <div className="text-4xl font-extrabold text-white tracking-tight">
                    $3<span className="text-xs font-normal text-white/60">/mo</span>
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed">
                    3 domains, 100 links, API + full stats.
                  </p>
                </div>
                <Link
                  href="/pricing"
                  className="w-full text-center py-2.5 rounded-full bg-[#EE6123] text-white text-xs font-semibold hover:bg-[#EE6123]/90 transition-colors shadow-xs"
                >
                  Get Pro
                </Link>
              </div>

              {/* Business Plan Card */}
              <div className="rounded-3xl border border-border bg-white dark:bg-card p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xs">
                <div className="space-y-4">
                  <div className="text-sm font-bold text-muted-foreground">Business</div>
                  <div className="text-4xl font-extrabold text-foreground tracking-tight">
                    $9<span className="text-xs font-normal text-muted-foreground">/mo</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    10 domains, unlimited links, API.
                  </p>
                </div>
                <Link
                  href="/pricing"
                  className="w-full text-center py-2.5 rounded-full border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  Get Business
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Competitor Comparison Table */}
        <section className="py-20 sm:py-28 border-b border-border bg-card/20">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-10">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                How UL0 compares to legacy shorteners
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Dated, verified comparison against Bitly, TinyURL, and Cuttly.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-border bg-card">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30 text-muted-foreground font-medium">
                    <th className="py-3.5 px-4">Feature</th>
                    <th className="py-3.5 px-4 font-bold text-[#EE6123]">UL0</th>
                    <th className="py-3.5 px-4">Bitly</th>
                    <th className="py-3.5 px-4">TinyURL</th>
                    <th className="py-3.5 px-4">Cuttly</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-foreground">Custom domain on free</td>
                    <td className="py-3.5 px-4 font-bold text-[#EE6123]">1 domain ($0)</td>
                    <td className="py-3.5 px-4 text-muted-foreground">Paid only ($35/mo)</td>
                    <td className="py-3.5 px-4 text-muted-foreground">Paid only ($12.99/mo)</td>
                    <td className="py-3.5 px-4 text-muted-foreground">Paid only ($12/mo)</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-foreground">Free monthly link cap</td>
                    <td className="py-3.5 px-4 font-bold text-[#EE6123]">Unlimited public links</td>
                    <td className="py-3.5 px-4 text-muted-foreground">5 links / month</td>
                    <td className="py-3.5 px-4 text-muted-foreground">Limited active links</td>
                    <td className="py-3.5 px-4 text-muted-foreground">30 links / month</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-foreground">Signup required to shorten</td>
                    <td className="py-3.5 px-4 font-bold text-[#EE6123]">No (instant)</td>
                    <td className="py-3.5 px-4 text-muted-foreground">Yes</td>
                    <td className="py-3.5 px-4 text-muted-foreground">No</td>
                    <td className="py-3.5 px-4 text-muted-foreground">Yes</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-foreground">Redirect architecture</td>
                    <td className="py-3.5 px-4 font-bold text-[#EE6123]">307 (editable live)</td>
                    <td className="py-3.5 px-4 text-muted-foreground">301 (cached)</td>
                    <td className="py-3.5 px-4 text-muted-foreground">301 (cached)</td>
                    <td className="py-3.5 px-4 text-muted-foreground">301 (cached)</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-foreground">Starting paid plan</td>
                    <td className="py-3.5 px-4 font-bold text-[#EE6123]">$3 / month</td>
                    <td className="py-3.5 px-4 text-muted-foreground">$10–$35 / month</td>
                    <td className="py-3.5 px-4 text-muted-foreground">$12.99 / month</td>
                    <td className="py-3.5 px-4 text-muted-foreground">$12 / month</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="text-center pt-2">
              <Link href="/compare" className="text-xs sm:text-sm font-semibold text-[#EE6123] hover:underline inline-flex items-center gap-1">
                View full in-depth competitor breakdown
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 6. FAQ Section */}
        <section className="py-20 sm:py-28 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl space-y-8">
            <div className="text-center space-y-2 max-w-md mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Frequently Asked Questions
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Honest answers about redirection, custom domains, and privacy.
              </p>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-2xl border border-border bg-card p-5 transition-colors [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="text-sm sm:text-base font-semibold text-foreground cursor-pointer flex items-center justify-between select-none">
                    <span>{faq.q}</span>
                    <span className="text-xs font-mono text-muted-foreground group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed pr-4">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Final Clean CTA */}
        <section className="py-20 sm:py-28 text-center bg-card/20">
          <div className="container mx-auto px-4 max-w-xl space-y-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Ready to create your branded link?
            </h2>
            <p className="text-sm text-muted-foreground">
              Free to start. 1 custom domain included. Zero tracking cookies.
            </p>
            <div className="pt-2">
              <a
                href="#shortener"
                className="inline-flex items-center justify-center rounded-full bg-[#EE6123] px-8 py-3 text-sm font-semibold text-white hover:bg-[#EE6123]/90 transition-colors shadow-xs"
              >
                Create your free link now
              </a>
            </div>
          </div>
        </section>
      </main>

      <FloatingActionDock />
      <Footer />
    </div>
  )
}
