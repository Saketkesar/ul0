import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LinkShortenerForm } from "@/components/link-shortener-form"
import { FeaturesSection } from "@/components/features-section"
import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { hreflangAlternates } from "@/lib/i18n"
import { Badge } from "@/components/ui/badge"
import { Globe } from "lucide-react"

export const metadata: Metadata = {
  title: "Free URL Shortener, QR Codes & Custom Domains | UL0",
  description:
    "Shorten links free, connect your own custom domain, make QR codes and track clicks. No signup. Branded links without paid plans.",
  alternates: {
    canonical: "https://ul0.site",
    languages: hreflangAlternates,
  },
  openGraph: {
    title: "Free URL Shortener, QR Codes & Custom Domains | UL0",
    description:
      "Shorten links free, connect your own custom domain, make QR codes and track clicks. No signup. Branded links without paid plans.",
    url: "https://ul0.site",
    type: "website",
    siteName: "UL0",
    locale: "en_US",
    images: [{
      url: "https://ul0.site/social-card.png",
      width: 1376,
      height: 768,
      alt: "UL0 — Free URL Shortener, Custom Domains & QR Code Generator",
      type: "image/png",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free URL Shortener, QR Codes & Custom Domains | UL0",
    description:
      "Shorten links free, connect your own custom domain, make QR codes and track clicks. No signup. Branded links without paid plans.",
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
      description: "Free branded short links, custom domain management, dynamic QR codes, and real-time click analytics.",
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
        "https://www.producthunt.com/products/ul0"
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
      operatingSystem: "All (Web, iOS, Android, macOS, Windows, Linux)",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD"
      },
      description: "Free branded short links, custom domain management, dynamic vector QR codes, and real-time click attribution.",
      url: "https://ul0.site"
    },
    {
      "@type": "WebPage",
      "@id": "https://ul0.site/#webpage",
      url: "https://ul0.site",
      name: "Free URL Shortener 2026 - Shorten Links Instantly | ul0",
      description: "Best free URL shortener 2026. Shorten any URL for free in seconds. No signup required. Fast, reliable & 100% free link shortener.",
      isPartOf: { "@id": "https://ul0.site/#website" },
      about: { "@id": "https://ul0.site/#webapp" },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: "https://ul0.site/ul0.png"
      },
      datePublished: "2024-01-01",
      dateModified: "2026-07-06",
      inLanguage: "en-US",
      potentialAction: [
        {
          "@type": "ReadAction",
          target: ["https://ul0.site"]
        }
      ]
    },
    {
      "@type": "HowTo",
      "@id": "https://ul0.site/#howto",
      name: "How to Shorten a URL for Free",
      description: "Learn how to shorten any long URL into a short, shareable link in just 3 easy steps. No signup required.",
      image: "https://ul0.site/ul0.png",
      totalTime: "PT30S",
      estimatedCost: {
        "@type": "MonetaryAmount",
        currency: "USD",
        value: "0"
      },
      supply: [],
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
          text: "Copy your long URL and paste it into the input box on ul0.site",
          url: "https://ul0.site/#step1"
        },
        {
          "@type": "HowToStep", 
          position: 2,
          name: "Click Shorten",
          text: "Click the 'Shorten URL' button to generate your short link instantly",
          url: "https://ul0.site/#step2"
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Copy and Share",
          text: "Copy your new short URL and share it anywhere - social media, emails, or messages",
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
          name: "What is the best free URL shortener in 2026?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "ul0 is the best free URL shortener in 2026. It offers instant link shortening without signup, custom short URLs, QR code generation, and click tracking - all completely free with no limits."
          }
        },
        {
          "@type": "Question",
          name: "How do I shorten a URL for free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "To shorten a URL for free: 1) Go to ul0.site, 2) Paste your long URL in the input box, 3) Click 'Shorten URL' button, 4) Copy your new short link. No signup or registration required!"
          }
        },
        {
          "@type": "Question",
          name: "Is ul0 a good Bitly alternative?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, ul0 is an excellent Bitly alternative. It offers all the essential features of Bitly completely free - URL shortening, QR codes, and click tracking - without requiring any signup or paid plans."
          }
        },
        {
          "@type": "Question",
          name: "Do shortened URLs expire?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No, short URLs created on ul0 are permanent and never expire. Your shortened links will continue working indefinitely at no cost."
          }
        },
        {
          "@type": "Question",
          name: "Can I shorten YouTube, Amazon, or social media links?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, ul0 can shorten any URL including YouTube videos, Amazon products, Instagram posts, Twitter links, TikTok videos, Spotify tracks, and any other website URL."
          }
        },
        {
          "@type": "Question",
          name: "Is there a URL shortener without signup?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, ul0 is a completely free URL shortener that requires no signup, no registration, and no account creation. Just paste your URL and get a short link instantly."
          }
        }
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
        <section className="relative overflow-hidden py-8 sm:py-12">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-3 text-balance text-2xl font-bold tracking-tight text-foreground sm:mb-5 sm:text-4xl lg:text-5xl">
                Free Branded Short Links, QR Codes & Click Analytics
              </h1>
              <p className="mb-2 text-pretty text-base text-muted-foreground sm:text-xl">
                Shorten links free, generate trackable QR codes, and connect custom branded domains. <strong>No signup required to start.</strong>
              </p>
              <p className="mb-5 text-pretty text-sm text-muted-foreground sm:mb-6 sm:text-base">
                Fast Edge Redirects • Dynamic QR Codes • Real-Time Click Attribution • Custom Domain Support
              </p>

              <div className="mb-6 flex justify-center">
                <Link
                  href="/custom-domain-landing"
                  className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs sm:text-sm font-medium text-primary hover:bg-primary/20 transition-all shadow-xs"
                >
                  <Globe className="h-4 w-4" />
                  <span>Connect Your Own Domain Free (CNAME)</span>
                  <span className="font-semibold underline underline-offset-2 ml-1">Explore &rarr;</span>
                </Link>
              </div>

              <LinkShortenerForm />

              {/* Product Visual Showcase (Real 4K Brand & Vector QR) */}
              <div className="mt-10 grid gap-4 sm:grid-cols-2 text-left">
                <div className="rounded-2xl border border-border/80 bg-card/60 p-5 flex flex-col justify-between shadow-xs">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                      Brand Authority
                    </span>
                    <h3 className="text-base font-semibold text-foreground mt-1 mb-1">
                      Crisp Branded Links
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Shorten links with authority. Share clean, custom-domain URLs across social profiles, SMS, and ad campaigns.
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-center p-3 rounded-xl bg-background/80 border border-border/60">
                    <Image
                      src="/ulo_4k.webp"
                      alt="UL0 Official Platform"
                      width={240}
                      height={108}
                      className="h-12 w-auto object-contain"
                      unoptimized
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-border/80 bg-card/60 p-5 flex flex-col justify-between shadow-xs">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                      Print-Ready Matrix
                    </span>
                    <h3 className="text-base font-semibold text-foreground mt-1 mb-1">
                      High-Resolution QR Codes
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Auto-generate dynamic vector QR codes with embedded center brand marks and high error-correction (Level H).
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-center p-3 rounded-xl bg-background/80 border border-border/60">
                    <Image
                      src="/ulo_qr_logo.webp"
                      alt="UL0 Branded QR Code"
                      width={120}
                      height={120}
                      className="h-14 w-14 object-contain"
                      unoptimized
                    />
                  </div>
                </div>
              </div>

              {/* SEO-rich content below form */}
              <div className="mt-10 text-left text-sm text-muted-foreground space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Why Modern Teams Choose UL0</h3>
                  <ul className="space-y-1.5 list-disc list-inside">
                    <li><strong>Fast Edge Redirects</strong> - Instant navigation with global edge routing and referrer retention</li>
                    <li><strong>Branded Custom Domains</strong> - Boost brand trust and click-through rates with your own domain</li>
                    <li><strong>Privacy-Conscious Analytics</strong> - Track clicks, country, device, and referrer without cookies</li>
                    <li><strong>High-Resolution QR Codes</strong> - Auto-generated vector QR codes ready for print and digital marketing</li>
                    <li><strong>Instant Access</strong> - Shorten links immediately with zero mandatory registration</li>
                  </ul>
                </div>

                <div className="space-y-3 leading-relaxed text-sm">
                  <h3 className="text-lg font-semibold text-foreground">Clean, Fast Link Management</h3>
                  <p>
                    UL0 transforms unwieldy, tracking-heavy URLs into clean, secure, and professional branded links. Whether you are running multichannel marketing campaigns across LinkedIn, Instagram, and YouTube, or printing flyers with QR codes, UL0 ensures your links look trustworthy and load with fast edge redirects.
                  </p>
                  <p>
                    Every shortened link is screened against safety and phishing heuristics to protect both your brand reputation and your visitors. With built-in UTM campaign tagging, device attribution, and custom domain CNAME routing, UL0 delivers reliable link management with a free custom domain on every plan.
                  </p>
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
                  <h4 className="font-semibold text-foreground text-sm mb-1">Looking for Developer & Web Utilities?</h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    Explore our free online tools including UTM Builder, QR Generator, HTTP Redirect Tracer, URL Expander, and OpenGraph Previewer.
                  </p>
                  <Link
                    href="/tools"
                    className="inline-flex items-center text-xs font-semibold text-primary hover:underline"
                  >
                    Browse all free developer tools →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Editorial Publications Section */}
        <section className="py-14 bg-background border-t">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-5xl text-center mb-10">
              <Badge variant="secondary" className="mb-3">Editorial & Research</Badge>
              <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Featured Link Management & Marketing Guides
              </h2>
              <p className="mt-3 text-base text-muted-foreground max-w-2xl mx-auto">
                Deep-dive research, infrastructure standards, and best practices published by our engineering team.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              <Link href="/blog/link-shortening-best-practices-2026" className="group rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary">
                <Badge variant="outline" className="mb-3 text-xs">Best Practices</Badge>
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                  10 Link Shortening Best Practices in 2026
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  Master link shortening with 10 expert rules to increase CTR by 34%, protect link equity, and avoid cold email spam filters.
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                  <span>Saket Kesar</span>
                  <span>9 min read</span>
                </div>
              </Link>

              <Link href="/blog/qr-code-generator-security-guide" className="group rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary">
                <Badge variant="outline" className="mb-3 text-xs">Security</Badge>
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                  QR Code Security Guide: Preventing Quishing Scams
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  Learn how to protect visual matrix codes against physical sticker overrides, malicious redirects, and privacy tracking.
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                  <span>Saket Kesar</span>
                  <span>8 min read</span>
                </div>
              </Link>

              <Link href="/blog/custom-domain-dns-cname-setup-guide" className="group rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary">
                <Badge variant="outline" className="mb-3 text-xs">Infrastructure</Badge>
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                  Custom Domain CNAME DNS & SSL Setup Guide
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  Step-by-step configuration for CNAME records, Cloudflare DNS proxying, and automated Let's Encrypt SSL handshakes.
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t">
                  <span>Saket Kesar</span>
                  <span>7 min read</span>
                </div>
              </Link>
            </div>

            <div className="text-center mt-8">
              <Link href="/blog" className="inline-flex items-center justify-center rounded-xl bg-muted px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted/80 transition-colors">
                Explore All Published Guides &amp; Tutorials →
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <FeaturesSection />

        {/* Technical Infrastructure Overview */}
        <section className="py-12 bg-muted/20 border-t">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <Badge variant="secondary" className="mb-3">Link Infrastructure</Badge>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              Engineered for Speed, Deliverability &amp; Custom Domains
            </h2>
            <p className="text-muted-foreground mt-4 leading-relaxed max-w-2xl mx-auto">
              ul0 is built on global edge infrastructure emitting standard HTTP 301 Permanent Redirect headers, preserving 100% of link equity (PageRank) for SEO and ensuring near-instant redirects worldwide.
            </p>
            <p className="text-muted-foreground mt-3 leading-relaxed max-w-2xl mx-auto">
              Connect your own custom domain for free to maximize brand trust and avoid spam filters across SMS and email campaigns. Learn more in our <Link href="/blog/custom-domain-dns-cname-setup-guide" className="text-primary font-medium hover:underline">Custom Domain DNS Guide</Link> or explore all <Link href="/features" className="text-primary font-medium hover:underline">Core Features</Link>.
            </p>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-center">How to Shorten a URL</h2>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="font-semibold mb-2">Paste Your Long URL</h3>
                  <p className="text-sm text-muted-foreground">Copy the long URL you want to shorten and paste it in the input box above</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="font-semibold mb-2">Click Shorten</h3>
                  <p className="text-sm text-muted-foreground">Hit the &quot;Shorten URL&quot; button and get your short link instantly</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="font-semibold mb-2">Share Anywhere</h3>
                  <p className="text-sm text-muted-foreground">Copy your new short URL and share it on social media, emails, or anywhere</p>
                </div>
              </div>

              <div className="mt-10 prose prose-sm dark:prose-invert max-w-none">
                <h2 className="text-xl font-bold mb-4">Best Free URL Shortener - ul0.site</h2>
                <p className="text-muted-foreground">
                  Looking for the <strong>best free URL shortener</strong>? ul0 is a fast, reliable link shortening service that lets you create short URLs without any signup or registration. Whether you need to shorten links for social media posts, email campaigns, or just to make long URLs more manageable, ul0 has you covered.
                </p>
                <p className="text-muted-foreground mt-3">
                  Unlike other URL shorteners that require accounts or limit your usage, ul0 is <strong>completely free with no restrictions</strong>. Your shortened links are permanent and will continue to work as long as you need them. Connect your own <Link href="/custom-domain-landing" className="text-primary hover:underline font-medium">custom branded domain</Link> to create trust-building short links, or generate dynamic <Link href="/qr" className="text-primary hover:underline font-medium">vector QR codes</Link> ready for print and packaging.
                </p>
                <p className="text-muted-foreground mt-3">
                  Our link compression engine utilizes premium 301 Permanent Redirect headers. This ensures that 100% of your link equity (PageRank) is passed seamlessly to the target destination. This means search engines like Google, Bing, and Yahoo will attribute all the indexing credit directly to your original URL, making ul0 a highly safe choice for digital marketing agencies, brand developers, and SEO consultants looking to shorten domain paths.
                </p>
                <p className="text-muted-foreground mt-3">
                  Privacy and safety are at the core of our platform. We scan every shortened URL for phishing, spam, and malware before execution, protecting your audience from malicious redirects. Additionally, our platform processes requests with strict privacy controls, never selling click analytics or harvesting personal data.
                </p>
                <h3 className="text-lg font-semibold mt-6 mb-3">Popular Uses for Short URLs</h3>
                <ul className="text-muted-foreground list-disc list-inside space-y-1">
                  <li>Share links on Twitter/X with character limits</li>
                  <li>Create clean links for Instagram bio</li>
                  <li>Shorten affiliate links for marketing</li>
                  <li>Make QR codes more scannable</li>
                  <li>Track link clicks and engagement</li>
                  <li>Share long URLs in text messages</li>
                </ul>
              </div>

              <div className="mt-12 border-t pt-10">
                <h2 className="text-xl font-bold mb-4 text-center">Compare URL Shorteners: ul0 vs Competitors</h2>
                <p className="text-muted-foreground text-center mb-6 max-w-lg mx-auto text-sm">
                  See how ul0 stacks up against major link shorteners like Bitly, TinyURL, and Rebrandly. No paid walls, no limits.
                </p>
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border">
                        <th className="p-3 font-semibold text-foreground">Feature</th>
                        <th className="p-3 font-semibold text-primary">ul0</th>
                        <th className="p-3 font-semibold text-foreground">Bitly</th>
                        <th className="p-3 font-semibold text-foreground">TinyURL</th>
                        <th className="p-3 font-semibold text-foreground">Rebrandly</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="p-3 font-medium">Free Limit</td>
                        <td className="p-3 text-green-600 font-semibold">Unlimited</td>
                        <td className="p-3 text-muted-foreground">5 links/mo</td>
                        <td className="p-3 text-muted-foreground">Limited</td>
                        <td className="p-3 text-muted-foreground">Limited</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">No Signup Required</td>
                        <td className="p-3 text-green-600 font-semibold">Yes</td>
                        <td className="p-3 text-muted-foreground">No</td>
                        <td className="p-3 text-muted-foreground">Yes</td>
                        <td className="p-3 text-muted-foreground">No</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">QR Code Generator</td>
                        <td className="p-3 text-green-600 font-semibold">Free</td>
                        <td className="p-3 text-muted-foreground">Paid Only</td>
                        <td className="p-3 text-muted-foreground">Paid Only</td>
                        <td className="p-3 text-muted-foreground">Paid (Limited)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Custom Domain Support</td>
                        <td className="p-3 text-green-600 font-semibold">1 Free Domain</td>
                        <td className="p-3 text-muted-foreground">Paid Only</td>
                        <td className="p-3 text-muted-foreground">Paid Only</td>
                        <td className="p-3 text-muted-foreground">Paid Only</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">WiFi QR Generator</td>
                        <td className="p-3 text-green-600 font-semibold">Yes (Free)</td>
                        <td className="p-3 text-muted-foreground">No</td>
                        <td className="p-3 text-muted-foreground">No</td>
                        <td className="p-3 text-muted-foreground">No</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Pricing</td>
                        <td className="p-3 text-green-600 font-semibold">100% Free</td>
                        <td className="p-3 text-muted-foreground">From $8/mo</td>
                        <td className="p-3 text-muted-foreground">From $12.99/mo</td>
                        <td className="p-3 text-muted-foreground">From $13/mo</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <section className="mt-12 rounded-3xl border bg-card p-6 shadow-sm sm:p-8">
                <div className="max-w-3xl">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">Explore more ul0 tools and guides</h2>
                  <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                    These internal links help visitors find the right tool faster and give search engines a clearer map of the site.
                  </p>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { href: "/custom-domain-landing", label: "Custom Domains", desc: "Shorten links with your own brand" },
                    { href: "/qr", label: "QR Code Generator", desc: "Turn any link into a QR code" },
                    { href: "/utm", label: "UTM Builder", desc: "Track campaigns with clean links" },
                    { href: "/use-cases", label: "Use Cases", desc: "For marketing, creators & SMS" },
                    { href: "/tools", label: "Free Tools Directory", desc: "WiFi, JSON, PDF & Splitter" },
                    { href: "/blog", label: "Blog Guides", desc: "SEO, tools, and comparisons" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="group rounded-2xl border bg-background p-4 transition-colors hover:border-primary hover:bg-primary/5"
                    >
                      <div className="text-sm font-semibold text-foreground group-hover:text-primary">
                        {item.label}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{item.desc}</p>
                    </Link>
                  ))}
                </div>
              </section>

        {/* ...existing code... */}
            </div>
          </div>
        </section>

  {/* ...existing code... */}
      </main>

      <Footer />
    </div>
  )
}
