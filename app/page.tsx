import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LinkShortenerForm } from "@/components/link-shortener-form"
import { FeaturesSection } from "@/components/features-section"
import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { hreflangAlternates } from "@/lib/i18n"

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
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homePageSchema) }}
      />
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section id="shortener" className="relative overflow-hidden py-10 sm:py-16 lg:py-20">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/8 via-background to-background" />

          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="mb-4 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                Branded short links, QR codes and analytics
              </h1>
              <p className="mb-8 text-pretty text-base text-muted-foreground sm:text-lg">
                Shorten a link in seconds. Add your own domain for free. See who clicks, without cookies.
              </p>

              <LinkShortenerForm />
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-12 border-t bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-semibold mb-8 text-center text-foreground">How it works</h2>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center p-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-base font-semibold text-primary">1</span>
                  </div>
                  <h3 className="font-semibold mb-1 text-sm">Paste your URL</h3>
                  <p className="text-xs text-muted-foreground">Any link — long, tracked, ugly — paste it in the box above.</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-base font-semibold text-primary">2</span>
                  </div>
                  <h3 className="font-semibold mb-1 text-sm">Click Shorten</h3>
                  <p className="text-xs text-muted-foreground">Get a clean short link instantly. No signup required.</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-base font-semibold text-primary">3</span>
                  </div>
                  <h3 className="font-semibold mb-1 text-sm">Share anywhere</h3>
                  <p className="text-xs text-muted-foreground">Copy your short URL or download a QR code. Track clicks in your dashboard.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <FeaturesSection />

        {/* Pricing teaser */}
        <section className="py-12 border-t bg-muted/20">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Free to start. Upgrade when you need more.
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
              The public shortener is always free. Paid plans add custom domains, full analytics, link management, and priority support.
            </p>
            <div className="grid gap-4 sm:grid-cols-3 max-w-2xl mx-auto text-left">
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="text-xs font-semibold text-muted-foreground mb-1">Free</div>
                <div className="text-xl font-bold text-foreground">$0</div>
                <p className="text-xs text-muted-foreground mt-2">Unlimited short links on ul0.site. 1 custom domain, 1 domain link.</p>
              </div>
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 ring-1 ring-primary/20">
                <div className="text-xs font-semibold text-primary mb-1">Pro</div>
                <div className="text-xl font-bold text-foreground">$3<span className="text-xs font-normal text-muted-foreground">/mo</span></div>
                <p className="text-xs text-muted-foreground mt-2">3 custom domains, 100 domain links, full analytics, link deletion.</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="text-xs font-semibold text-muted-foreground mb-1">Business</div>
                <div className="text-xl font-bold text-foreground">$9<span className="text-xs font-normal text-muted-foreground">/mo</span></div>
                <p className="text-xs text-muted-foreground mt-2">10 custom domains, unlimited domain links, full analytics, dedicated support.</p>
              </div>
            </div>
            <div className="mt-6">
              <Link href="/pricing" className="text-sm font-medium text-primary hover:underline">
                Compare plans in detail →
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 border-t">
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="text-xl font-semibold text-foreground mb-6 text-center">Frequently asked questions</h2>
            <div className="space-y-4">
              {[
                {
                  q: "Is ul0 really free?",
                  a: "Yes. The public shortener on ul0.site is free to use without signup. Paid plans add custom domains, full analytics, and link management."
                },
                {
                  q: "Do shortened URLs expire?",
                  a: "No. Short URLs created on ul0 are permanent and will keep working."
                },
                {
                  q: "Can I use my own domain?",
                  a: "Yes. Connect a custom domain (like link.yourbrand.com) via CNAME. One domain is included free on every plan."
                },
                {
                  q: "Does ul0 use cookies?",
                  a: "No. Click analytics use privacy-friendly counting (no cookies, no raw IP storage). We show country, device, browser, and referrer."
                },
                {
                  q: "Can I shorten YouTube, Amazon, or social media links?",
                  a: "Yes. ul0 can shorten any URL. On mobile, it also detects the right app (YouTube, Instagram, etc.) for faster opens."
                },
                {
                  q: "Is there an API?",
                  a: "Yes. Create and manage links programmatically with our JSON API. Get an API key from your dashboard."
                },
              ].map((faq) => (
                <details key={faq.q} className="group rounded-xl border border-border bg-card p-4">
                  <summary className="text-sm font-semibold text-foreground cursor-pointer list-none flex items-center justify-between">
                    {faq.q}
                    <span className="text-muted-foreground transition-transform group-open:rotate-45 text-lg">+</span>
                  </summary>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Developer tools callout */}
        <section className="py-10 border-t bg-muted/20">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h3 className="text-base font-semibold text-foreground mb-2">Free developer tools</h3>
            <p className="text-sm text-muted-foreground mb-4">
              UTM builder, QR generator, redirect checker, URL expander, and more.
            </p>
            <Link
              href="/tools"
              className="inline-flex items-center text-sm font-medium text-primary hover:underline"
            >
              Browse all free tools →
            </Link>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-14 border-t">
          <div className="container mx-auto px-4 max-w-xl text-center">
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              Shorten your first link
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              No signup needed. Paste a URL, click Shorten, and you're done.
            </p>
            <a
              href="#shortener"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-[#136759] transition-colors"
            >
              Go to shortener ↑
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
