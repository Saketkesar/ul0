import React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LinkShortenerForm } from "@/components/link-shortener-form"
import { FloatingActionDock } from "@/components/floating-action-dock"
import { AnimatedIconBackground } from "@/components/animated-icon-background"
import { UL0Icon } from "@/components/ul0-icon"

export const metadata: Metadata = {
  title: "UL0: Shorten Links the Cute, Clean Way",
  description:
    "Paste a long URL, get a tiny ul0.site link with vector QR and click stats. 1 custom domain free forever, zero tracking cookies, no account needed.",
  alternates: {
    canonical: "https://ul0.site",
  },
  openGraph: {
    title: "UL0: Shorten Links the Cute, Clean Way",
    description:
      "Paste a long URL, get a tiny ul0.site link with vector QR and click stats. 1 custom domain free forever, zero tracking cookies, no account needed.",
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
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-[#3DDBB8]/30">
      {/* FAQ Schema for Google Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header />

      <main className="flex-1">
        {/* 1. Hero Section - Inspired by Heytaby & Bharpai with Animated SVG Icons in Background */}
        <section
          id="shortener"
          className="relative pt-20 pb-28 sm:pt-28 sm:pb-36 border-b border-border overflow-hidden"
        >
          {/* Animated SVG Icons Drifting in Background */}
          <AnimatedIconBackground />

          <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center space-y-6 sm:space-y-8 relative z-10">
            {/* Top Pill Badge */}
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-card/95 backdrop-blur-xs border border-border shadow-xs text-xs sm:text-sm font-medium text-foreground select-none">
                <span className="h-2.5 w-2.5 rounded-full bg-primary inline-block animate-pulse shrink-0" />
                <span>Simple, private link shortener &amp; QR studio</span>
              </div>
            </div>

            {/* Main Title: Clean, Large, Tactile */}
            <h1 className="text-4xl sm:text-6xl lg:text-[76px] font-extrabold tracking-tight text-foreground leading-[1.05]">
              Shorten links the<br />cute, clean way.
            </h1>

            {/* Subhead */}
            <p className="mx-auto max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              Paste a long URL, get a tiny ul0.site link with vector QR and click stats.<br className="hidden sm:inline" />
              Free forever. No account needed.
            </p>

            {/* Link Shortener Form */}
            <div className="pt-2 max-w-2xl mx-auto">
              <LinkShortenerForm />
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
              <div className="space-y-4 flex flex-col items-center md:items-start group">
                <div className="h-16 w-16 rounded-2xl bg-surface-2 border border-border/80 flex items-center justify-center p-3 shadow-2xs group-hover:scale-110 transition-transform">
                  <UL0Icon name="scissors" animated={true} size={42} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-foreground">Short links</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    ul0.site/your-name in 2 seconds. Works everywhere, forever.
                  </p>
                </div>
              </div>

              {/* Col 2: Your domain */}
              <div className="space-y-4 flex flex-col items-center md:items-start group">
                <div className="h-16 w-16 rounded-2xl bg-surface-2 border border-border/80 flex items-center justify-center p-3 shadow-2xs group-hover:scale-110 transition-transform">
                  <UL0Icon name="domain" animated={true} size={42} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-foreground">Your domain</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Connect your domain once. 1 free, setup in 5 minutes.
                  </p>
                </div>
              </div>

              {/* Col 3: QR + stats */}
              <div className="space-y-4 flex flex-col items-center md:items-start group">
                <div className="h-16 w-16 rounded-2xl bg-surface-2 border border-border/80 flex items-center justify-center p-3 shadow-2xs group-hover:scale-110 transition-transform">
                  <UL0Icon name="qr" animated={true} size={42} />
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

        {/* 3. "Free tiny tools" Section in Soft Mint Container */}
        <section className="py-20 sm:py-28 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <div className="rounded-3xl border border-border/80 bg-surface-2 dark:bg-surface-2/40 p-6 sm:p-10 space-y-6">
              <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4">
                <div className="flex items-center gap-2.5">
                  <UL0Icon name="tools" size={24} />
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                    Free tiny tools
                  </h2>
                </div>
                <Link
                  href="/tools"
                  className="text-xs sm:text-sm font-semibold text-foreground underline hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  <span>View all</span>
                  <UL0Icon name="arrowright" size={12} />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {TINY_TOOLS.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/50 transition-all shadow-2xs group hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-3">
                      <UL0Icon name={tool.iconName} animated={true} size={30} />
                      <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {tool.name}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-muted-foreground px-2.5 py-1 rounded-full bg-surface-2 border border-border/60">
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
                No credit card required to start. No hidden surprises.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {/* Free Plan Card */}
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xs">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-muted-foreground">Free</span>
                    <UL0Icon name="gift" size={18} />
                  </div>
                  <div className="text-4xl font-extrabold text-foreground tracking-tight">₹0</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    1 custom domain, unlimited short links, vector QR + stats.
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
              <div className="rounded-3xl bg-[#0B1A17] dark:bg-[#0E211E] text-white p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl relative border border-[#3DDBB8]/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">Pro</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#3DDBB8] text-[#0B1A17] text-[10px] font-bold">
                        popular
                      </span>
                    </div>
                    <UL0Icon name="crown" size={20} animated={true} />
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
                  className="w-full text-center py-2.5 rounded-full bg-[#3DDBB8] text-[#0B1A17] text-xs font-bold hover:opacity-90 transition-opacity shadow-xs"
                >
                  Get Pro
                </Link>
              </div>

              {/* Business Plan Card */}
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xs">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-muted-foreground">Business</span>
                    <UL0Icon name="diamond" size={18} />
                  </div>
                  <div className="text-4xl font-extrabold text-foreground tracking-tight">
                    $9<span className="text-xs font-normal text-muted-foreground">/mo</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    10 domains, unlimited links, high-speed API.
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

        {/* 5. Bharpai / Heytaby Style "Why UL0" Cards */}
        <section className="py-20 sm:py-28 border-b border-border bg-surface-2/30">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl space-y-12">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Built for people who hate clutter
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                No tracking cookies, no monthly link expiration, no corporate bloat.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-2xs hover:border-primary/40 transition-all group">
                <div className="h-14 w-14 rounded-2xl bg-surface-2 border border-border flex items-center justify-center p-2.5 group-hover:scale-105 transition-transform">
                  <UL0Icon name="shield" animated={true} size={36} />
                </div>
                <h3 className="text-base font-bold text-foreground">Zero tracking cookies</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  We don&apos;t drop tracking pixels or sell click streams. Only aggregate country, device, and referrer insights.
                </p>
              </div>

              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-2xs hover:border-primary/40 transition-all group">
                <div className="h-14 w-14 rounded-2xl bg-surface-2 border border-border flex items-center justify-center p-2.5 group-hover:scale-105 transition-transform">
                  <UL0Icon name="bolt" animated={true} size={36} />
                </div>
                <h3 className="text-base font-bold text-foreground">Fast 307 edge redirects</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Sub-15ms worldwide edge routing. Unlike 301 cached links, destinations can be edited anytime without breaking.
                </p>
              </div>

              <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-4 shadow-2xs hover:border-primary/40 transition-all group">
                <div className="h-14 w-14 rounded-2xl bg-surface-2 border border-border flex items-center justify-center p-2.5 group-hover:scale-105 transition-transform">
                  <UL0Icon name="domain" animated={true} size={36} />
                </div>
                <h3 className="text-base font-bold text-foreground">1 free custom domain</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Connect your brand domain free forever with automated SSL. No $35 monthly upsell just to use your name.
                </p>
              </div>
            </div>

            <div className="text-center pt-2">
              <Link
                href="/compare"
                className="text-xs sm:text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1.5"
              >
                <span>Compare features with legacy shorteners</span>
                <UL0Icon name="arrowright" size={12} />
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
        <section className="py-20 sm:py-28 text-center bg-card/30">
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
                className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity shadow-xs"
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
