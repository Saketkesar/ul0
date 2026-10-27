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
        <section id="shortener" className="pt-10 pb-14 sm:pt-16 sm:pb-20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border/80 bg-muted/40 text-xs font-mono text-muted-foreground">
                <span>Free URL Shortener &amp; File Utilities</span>
              </div>

              {/* Headline */}
              <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.12]">
                Shorten links. Generate QR codes. Free forever.
              </h1>

              {/* Subheadline */}
              <p className="mx-auto max-w-xl text-pretty text-xs sm:text-sm lg:text-base text-muted-foreground leading-relaxed">
                Create branded short links with custom domains, track clicks with privacy-friendly analytics, and split expenses online. No credit card or signup required.
              </p>

              {/* Shortener Container */}
              <div className="pt-2 sm:pt-4">
                <LinkShortenerForm />
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-14 sm:py-16 border-y border-border/80 bg-muted/20">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center space-y-1">
                <span className="text-xs font-mono font-medium text-muted-foreground uppercase tracking-wider">
                  Workflow
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  How UL0 Works
                </h2>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Three simple steps to shorten, brand, and track any link.
                </p>
              </div>

              <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                <div className="rounded-lg border border-border/80 bg-card p-5 space-y-2.5 hover:border-foreground/30 transition-colors">
                  <div className="font-mono text-xs font-bold text-muted-foreground bg-muted/60 w-6 h-6 rounded flex items-center justify-center">
                    01
                  </div>
                  <h3 className="font-semibold text-sm text-foreground">
                    Paste Your Link
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Drop any long URL or UTM link into the shortener box above.
                  </p>
                </div>

                <div className="rounded-lg border border-border/80 bg-card p-5 space-y-2.5 hover:border-foreground/30 transition-colors">
                  <div className="font-mono text-xs font-bold text-muted-foreground bg-muted/60 w-6 h-6 rounded flex items-center justify-center">
                    02
                  </div>
                  <h3 className="font-semibold text-sm text-foreground">
                    Generate &amp; Brand
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Instantly receive your permanent 301 short link with dynamic QR code preview.
                  </p>
                </div>

                <div className="rounded-lg border border-border/80 bg-card p-5 space-y-2.5 hover:border-foreground/30 transition-colors">
                  <div className="font-mono text-xs font-bold text-muted-foreground bg-muted/60 w-6 h-6 rounded flex items-center justify-center">
                    03
                  </div>
                  <h3 className="font-semibold text-sm text-foreground">
                    Share &amp; Analyze
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Inspect visitor device breakdown, country locations, and referrers with full privacy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <FeaturesSection />

        {/* Pricing Teaser */}
        <section className="py-14 sm:py-20 border-t border-border/80">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <div className="text-center space-y-2 mb-10 sm:mb-12">
              <span className="text-xs font-mono font-medium text-muted-foreground uppercase tracking-wider">
                Transparent Plans
              </span>
              <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-foreground">
                Free forever. Upgrade when your brand grows.
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                No surprises. One custom domain included on every account.
              </p>
            </div>

            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-3 items-stretch">
              {/* Free */}
              <div className="rounded-lg border border-border/80 bg-card p-5 sm:p-6 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-mono font-semibold text-muted-foreground uppercase">Hobby</span>
                    <div className="text-3xl font-bold text-foreground mt-1">$0</div>
                    <p className="text-xs text-muted-foreground mt-0.5">Free public link management</p>
                  </div>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-foreground shrink-0" />
                      <span>Unlimited short links on ul0.site</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-foreground shrink-0" />
                      <span>1 custom domain connection</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-foreground shrink-0" />
                      <span>Standard dynamic QR codes</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/sign-up"
                  className="w-full text-center py-2 rounded-md border border-border/80 bg-muted/40 hover:bg-muted text-xs font-medium text-foreground transition-colors"
                >
                  Get Started Free
                </Link>
              </div>

              {/* Pro (Highlighted) */}
              <div className="rounded-lg border-2 border-foreground bg-card p-5 sm:p-6 flex flex-col justify-between space-y-6 relative shadow-xs">
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-foreground text-background px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                  Most Popular
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-mono font-semibold text-foreground uppercase">Pro Marketer</span>
                    <div className="text-3xl font-bold text-foreground mt-1">
                      $3<span className="text-xs font-normal text-muted-foreground">/mo</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">For creators &amp; small startups</p>
                  </div>
                  <ul className="space-y-2 text-xs text-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-foreground shrink-0" />
                      <span>3 custom branded domains</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-foreground shrink-0" />
                      <span>100 custom domain links</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-foreground shrink-0" />
                      <span>Real-time click &amp; country analytics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-foreground shrink-0" />
                      <span>Custom UTM parameters</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/pricing"
                  className="w-full text-center py-2 rounded-md bg-foreground text-background hover:bg-foreground/90 text-xs font-medium transition-all"
                >
                  Upgrade to Pro
                </Link>
              </div>

              {/* Business */}
              <div className="rounded-lg border border-border/80 bg-card p-5 sm:p-6 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-mono font-semibold text-muted-foreground uppercase">Business</span>
                    <div className="text-3xl font-bold text-foreground mt-1">
                      $9<span className="text-xs font-normal text-muted-foreground">/mo</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">For agencies &amp; teams</p>
                  </div>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-foreground shrink-0" />
                      <span>10 custom branded domains</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-foreground shrink-0" />
                      <span>Unlimited domain links</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-foreground shrink-0" />
                      <span>Full API access &amp; webhook relay</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-foreground shrink-0" />
                      <span>Priority developer support</span>
                    </li>
                  </ul>
                </div>
                <Link
                  href="/pricing"
                  className="w-full text-center py-2 rounded-md border border-border/80 bg-muted/40 hover:bg-muted text-xs font-medium text-foreground transition-colors"
                >
                  View Business Plan
                </Link>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link href="/pricing" className="text-xs font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
                <span>Compare all tier features and limits</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-14 sm:py-16 border-t border-border/80 bg-muted/10">
          <div className="container mx-auto px-4 sm:px-6 max-w-2xl">
            <div className="text-center space-y-1 mb-8">
              <span className="text-xs font-mono font-medium text-muted-foreground uppercase tracking-wider">
                FAQ
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  q: "Is UL0 completely free to use?",
                  a: "Yes. The public shortener on ul0.site is 100% free with permanent links and zero credit card required. Upgrading unlocks custom domains, detailed geo analytics, and UTM builders.",
                },
                {
                  q: "Do shortened links ever expire?",
                  a: "Never. Short URLs created on UL0 are permanent and will reliably redirect forever.",
                },
                {
                  q: "Can I connect my own branded domain?",
                  a: "Yes. You can connect your domain (like link.yourbrand.com) with 1 free custom domain included on every account with automated SSL.",
                },
                {
                  q: "Are the file tools really 100% private?",
                  a: "Yes. All file and PDF tools (splitting, merging, image conversion, scanning) process locally inside your browser using WebAssembly. Your files are never uploaded to any server.",
                },
                {
                  q: "Can I install UL0 as an app on my phone?",
                  a: "Yes. On the Files page (/files), tap 'Add to Home Screen' (or tap Share > Add to Home Screen in Safari) to install it directly onto your phone without an app store.",
                },
              ].map((faq) => (
                <details
                  key={faq.q}
                  className="group rounded-md border border-border/80 bg-card p-4 transition-all [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="text-xs sm:text-sm font-semibold text-foreground cursor-pointer flex items-center justify-between select-none">
                    <span>{faq.q}</span>
                    <span className="ml-4 text-xs font-mono text-muted-foreground transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed pr-4">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="py-14 sm:py-20 border-t border-border/80">
          <div className="container mx-auto px-4 sm:px-6 max-w-xl text-center space-y-4">
            <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-foreground">
              Ready to shorten your first link?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Join thousands of creators, founders, and developers using UL0 for clean, branded short links, vector QR codes, and private document utilities.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <a
                href="#shortener"
                className="inline-flex items-center justify-center rounded-md bg-foreground text-background px-5 py-2 text-xs font-medium hover:bg-foreground/90 transition-all cursor-pointer"
              >
                <span>Shorten a Link</span>
              </a>
              <Link
                href="/files"
                className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-muted transition-all cursor-pointer"
              >
                <span>Open Files &amp; PDF</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
