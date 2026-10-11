import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LinkShortenerForm } from "@/components/link-shortener-form"
import { FeaturesSection } from "@/components/features-section"
import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { hreflangAlternates } from "@/lib/i18n"
import { Sparkles, ArrowRight, Check, Zap, Globe, BarChart3, QrCode, Shield, Layers, ChevronRight } from "lucide-react"

export const metadata: Metadata = {
  title: "UL0 — Free branded short links, QR codes and click analytics",
  description:
    "Create short links on your own domain, generate QR codes and track clicks with privacy-friendly analytics. Free to start, no credit card.",
  alternates: {
    canonical: "https://ul0.site",
    languages: hreflangAlternates,
  },
  openGraph: {
    title: "UL0 — Free branded short links, QR codes and click analytics",
    description:
      "Create short links on your own domain, generate QR codes and track clicks with privacy-friendly analytics. Free to start, no credit card.",
    url: "https://ul0.site",
    type: "website",
    siteName: "UL0",
    locale: "en_US",
    images: [{
      url: "https://ul0.site/social-card.png",
      width: 1376,
      height: 768,
      alt: "UL0 — Free branded short links, QR codes and click analytics",
      type: "image/png",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "UL0 — Free branded short links, QR codes and click analytics",
    description:
      "Create short links on your own domain, generate QR codes and track clicks with privacy-friendly analytics. Free to start, no credit card.",
    images: ["https://ul0.site/social-card.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// JSON-LD Schema for Homepage
const homePageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://ul0.site/#organization",
      name: "UL0",
      alternateName: "ul0.site",
      url: "https://ul0.site",
      logo: {
        "@type": "ImageObject",
        url: "https://ul0.site/ul0.png",
        width: 512,
        height: 512
      },
      description: "Free branded short links, custom domain management, dynamic QR codes, and click analytics.",
      foundingDate: "2024",
      email: "getul0site@gmail.com",
      sameAs: [
        "https://x.com/ul0site",
        "https://twitter.com/ul0site",
        "https://github.com/Saketkesar/ul0",
        "https://www.linkedin.com/company/ul0",
        "https://www.youtube.com/@ul0site",
        "https://www.instagram.com/ul0site",
        "https://www.facebook.com/ul0site",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "getul0site@gmail.com",
        url: "https://ul0.site/contact",
        availableLanguage: ["English", "Hindi"]
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://ul0.site/#website",
      url: "https://ul0.site",
      name: "UL0",
      alternateName: "ul0.site",
      publisher: { "@id": "https://ul0.site/#organization" },
      inLanguage: "en-US"
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://ul0.site/#software",
      name: "UL0",
      applicationCategory: "BusinessApplication",
      operatingSystem: "All (Web)",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD"
      },
      description: "Free branded short links, custom domains, dynamic QR codes, and click analytics.",
      url: "https://ul0.site"
    },
    {
      "@type": "WebPage",
      "@id": "https://ul0.site/#webpage",
      url: "https://ul0.site",
      name: "UL0 — Free branded short links, QR codes and click analytics",
      description: "Create short links on your own domain, generate QR codes and track clicks with privacy-friendly analytics. Free to start, no credit card.",
      isPartOf: { "@id": "https://ul0.site/#website" },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: "https://ul0.site/ul0.png"
      },
      datePublished: "2024-01-01",
      dateModified: "2026-10-11",
      inLanguage: "en-US",
    },
    {
      "@type": "HowTo",
      "@id": "https://ul0.site/#howto",
      name: "How to Shorten a URL for Free",
      description: "Shorten any long URL into a short, shareable link in 3 steps. No signup required.",
      totalTime: "PT30S",
      estimatedCost: {
        "@type": "MonetaryAmount",
        currency: "USD",
        value: "0"
      },
      tool: [
        {
          "@type": "HowToTool",
          name: "Web browser"
        }
      ],
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Paste your URL",
          text: "Copy the long URL and paste it into the input box on ul0.site",
          url: "https://ul0.site/#step1"
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Click Shorten",
          text: "Click the Shorten URL button to generate your short link",
          url: "https://ul0.site/#step2"
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Copy and share",
          text: "Copy your new short URL and share it anywhere",
          url: "https://ul0.site/#step3"
        },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://ul0.site/#homepage-faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is ul0 really free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. The public shortener on ul0.site is free to use without signup. Paid plans add custom domains, full analytics, and link management features."
          }
        },
        {
          "@type": "Question",
          name: "How do I shorten a URL?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Paste your long URL in the box on ul0.site and click Shorten URL. You get a short link instantly — no account needed."
          }
        },
        {
          "@type": "Question",
          name: "Do shortened URLs expire?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Short URLs created on ul0 are permanent and will keep working."
          }
        },
        {
          "@type": "Question",
          name: "Can I use my own domain?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Connect a custom domain (like link.yourbrand.com) via CNAME and create branded short links. One domain is included free on every plan."
          }
        },
        {
          "@type": "Question",
          name: "Does ul0 track clicks?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. ul0 provides privacy-friendly click analytics — country, device, browser, and referrer — without cookies or personal data collection."
          }
        },
      ]
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://ul0.site/#breadcrumb-home",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://ul0.site"
        }
      ]
    }
  ],
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }}
      />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section id="shortener" className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28">
          {/* Ambient aurora lighting mesh */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none -z-10">
            <div className="absolute top-[-10%] left-1/4 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-primary/15 rounded-full blur-[100px] sm:blur-[140px]" />
            <div className="absolute top-[10%] right-1/4 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-emerald-500/10 rounded-full blur-[90px] sm:blur-[120px]" />
          </div>

          <div className="container mx-auto px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-surface-2 border border-border shadow-2xs hover:border-primary/40 transition-colors">
                <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-foreground font-semibold">UL0 2.0 Engine</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">Free Links, QR &amp; Custom Domains</span>
              </div>

              {/* Headline */}
              <h1 className="text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.12]">
                Branded short links, vector QR codes &amp;{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-emerald-500 to-teal-400">
                  privacy analytics
                </span>
              </h1>

              {/* Subheadline */}
              <p className="mx-auto max-w-2xl text-pretty text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
                Shorten any URL in milliseconds. Connect your own custom domain for free. Track real-time visitor clicks with zero cookies or tracking pixels.
              </p>

              {/* Feature Trust Pills */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap pt-1 text-[11px] sm:text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-2 border border-border">
                  <Zap className="h-3 w-3 text-amber-500 fill-amber-500" />
                  <span>Instant 301 Edge Speed</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-2 border border-border">
                  <Globe className="h-3 w-3 text-primary" />
                  <span>1 Custom Domain Free</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-2 border border-border">
                  <Shield className="h-3 w-3 text-emerald-500" />
                  <span>Zero Cookies / Tracking</span>
                </span>
              </div>

              {/* Shortener Container */}
              <div className="pt-4 sm:pt-6">
                <LinkShortenerForm />
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 sm:py-20 border-y border-border bg-surface-2/60 relative">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto space-y-10">
              <div className="text-center space-y-2">
                <span className="text-xs font-mono font-semibold text-primary uppercase tracking-wider">
                  Workflow
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  How UL0 Works
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
                  Streamlined three-step process to shorten, brand, and track any destination URL.
                </p>
              </div>

              <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3">
                <div className="rounded-2xl border border-border bg-surface-1 p-6 space-y-3 relative overflow-hidden group hover:border-primary/40 transition-colors">
                  <div className="font-mono text-2xl font-black text-primary/30 group-hover:text-primary transition-colors">
                    01
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-foreground">
                    Paste Your Link
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Drop any long, messy, or UTM-tagged URL into the shortener box above.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-surface-1 p-6 space-y-3 relative overflow-hidden group hover:border-primary/40 transition-colors">
                  <div className="font-mono text-2xl font-black text-primary/30 group-hover:text-primary transition-colors">
                    02
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-foreground">
                    Generate &amp; Brand
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Instantly receive your lightning-fast 301 short link with dynamic QR code preview.
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-surface-1 p-6 space-y-3 relative overflow-hidden group hover:border-primary/40 transition-colors">
                  <div className="font-mono text-2xl font-black text-primary/30 group-hover:text-primary transition-colors">
                    03
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-foreground">
                    Monitor Telemetry
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Inspect visitor device breakdown, geographical locations, and referrers with full privacy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <FeaturesSection />

        {/* Pricing Teaser */}
        <section className="py-16 sm:py-24 border-t border-border bg-surface-2/40">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <div className="text-center space-y-3 mb-12 sm:mb-16">
              <span className="text-xs font-mono font-semibold text-primary uppercase tracking-wider">
                Transparent Plans
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
                Free forever. Upgrade when your brand grows.
              </h2>
              <p className="text-xs sm:text-base text-muted-foreground max-w-xl mx-auto">
                No surprises. One custom domain included on every account. Upgrade for high-volume limits.
              </p>
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-3 items-stretch">
              {/* Free */}
              <div className="rounded-2xl border border-border bg-surface-1 p-6 sm:p-7 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-mono font-semibold text-muted-foreground uppercase">Hobby</span>
                    <div className="text-3xl font-extrabold text-foreground mt-1">$0</div>
                    <p className="text-xs text-muted-foreground mt-1">Free public link management</p>
                  </div>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>Unlimited short links on ul0.site</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>1 custom domain connection</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>Standard dynamic QR codes</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/sign-up"
                  className="w-full text-center py-2.5 rounded-xl border border-border bg-surface-2 hover:bg-surface-3 text-xs font-semibold text-foreground transition-colors"
                >
                  Get Started Free
                </Link>
              </div>

              {/* Pro (Highlighted) */}
              <div className="rounded-2xl border-2 border-primary bg-surface-1 p-6 sm:p-7 flex flex-col justify-between space-y-6 relative shadow-lg shadow-primary/10">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                  Most Popular
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-mono font-semibold text-primary uppercase">Pro Marketer</span>
                    <div className="text-3xl font-extrabold text-foreground mt-1">
                      $3<span className="text-xs font-normal text-muted-foreground">/mo</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">For creators &amp; small startups</p>
                  </div>
                  <ul className="space-y-2 text-xs text-foreground">
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>3 custom branded domains</span>
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>100 custom domain links</span>
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>Real-time click &amp; country analytics</span>
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>Custom UTM parameters</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/pricing"
                  className="w-full text-center py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-md transition-all"
                >
                  Upgrade to Pro →
                </Link>
              </div>

              {/* Business */}
              <div className="rounded-2xl border border-border bg-surface-1 p-6 sm:p-7 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-mono font-semibold text-muted-foreground uppercase">Business</span>
                    <div className="text-3xl font-extrabold text-foreground mt-1">
                      $9<span className="text-xs font-normal text-muted-foreground">/mo</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">For agencies &amp; high volume teams</p>
                  </div>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>10 custom branded domains</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>Unlimited domain links</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>Full API access &amp; webhook relay</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>Priority 24/7 developer support</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/pricing"
                  className="w-full text-center py-2.5 rounded-xl border border-border bg-surface-2 hover:bg-surface-3 text-xs font-semibold text-foreground transition-colors"
                >
                  View Business Plan
                </Link>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link href="/pricing" className="text-xs sm:text-sm font-semibold text-primary hover:underline inline-flex items-center gap-1">
                <span>Compare all tier features and limits</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 sm:py-20 border-t border-border">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
            <div className="text-center space-y-2 mb-10">
              <span className="text-xs font-mono font-semibold text-primary uppercase tracking-wider">
                Support
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {[
                {
                  q: "Is UL0 completely free to use?",
                  a: "Yes. The public shortener on ul0.site is 100% free to use with permanent link durability and zero credit card required. Upgrading unlocks custom domains, detailed geo analytics, and UTM builders.",
                },
                {
                  q: "Do shortened links ever expire?",
                  a: "Never. Short URLs created on UL0 are permanent and will reliably redirect forever.",
                },
                {
                  q: "Can I connect my own branded domain?",
                  a: "Yes! You can connect your domain (like link.yourbrand.com or yourcompany.to) with 1 free custom domain included on every account with automated SSL.",
                },
                {
                  q: "Does UL0 use tracking cookies or sell visitor data?",
                  a: "No. UL0 is privacy-first. Our analytics engine records aggregate country, device, and referrer counts without cookies, IP storage, or personal telemetry tracking.",
                },
                {
                  q: "Can I generate high-res QR codes for print?",
                  a: "Yes. Every link has a companion vector QR code studio supporting custom colors, embedded center icons, and high-DPI downloads for packaging, print flyers, and billboards.",
                },
                {
                  q: "Is there a developer REST API?",
                  a: "Yes. You can create, inspect, and delete links programmatically using standard JSON endpoints and API tokens from your dashboard.",
                },
              ].map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-2xl border border-border bg-surface-2 p-4 sm:p-5 transition-all [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="text-xs sm:text-sm font-bold text-foreground cursor-pointer flex items-center justify-between select-none">
                    <span>{faq.q}</span>
                    <span className="ml-4 flex h-6 w-6 items-center justify-center rounded-lg bg-surface-3 text-muted-foreground transition-transform group-open:rotate-45 shrink-0 text-base">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed pr-6">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="py-16 sm:py-24 border-t border-border relative overflow-hidden bg-gradient-to-b from-surface-2/60 to-background">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

          <div className="container mx-auto px-4 sm:px-6 max-w-2xl text-center space-y-6">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Ready to elevate your link presence?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
              Join thousands of creators, founders, and developers using UL0 for clean, branded short links and instant QR codes.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <a
                href="#shortener"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 text-xs sm:text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-all shadow-md hover:scale-[1.02] cursor-pointer"
              >
                <span>Shorten a Link Now ↑</span>
              </a>
              <Link
                href="/sign-up"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-surface-1 px-6 py-3 text-xs sm:text-sm font-semibold text-foreground hover:bg-surface-2 transition-all cursor-pointer"
              >
                <span>Create Free Account</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
