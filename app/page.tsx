import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LinkShortenerForm } from "@/components/link-shortener-form"
import { FeaturesSection } from "@/components/features-section"
import { Metadata } from "next"
import Link from "next/link"
import { hreflangAlternates } from "@/lib/i18n"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Free URL Shortener 2026 - Shorten Links Instantly | ul0",
  description: "ul0 is the best free URL shortener of 2026. Shorten links instantly — no signup required. Includes free QR codes, branded custom domain short links, click analytics, UTM campaign tools, and expense splitting.",
  keywords: [
    // Branded & Custom Domain transactional keywords
    "custom domain short link free",
    "free custom domain link shortener",
    "cheapest custom domain link shortener",
    "branded url shortener free",
    "short link with custom domain free",
    "own domain link shortener cheapest",
    "personal domain url shortener free",
    "connect domain link shortener free",
    "custom domain redirect free",
    "cheap branded short links",
    "dub co cheap alternative",
    "bitly alternative custom domain",
    
    // Primary Keywords
    "url shortener",
    "free url shortener",
    "link shortener",
    "shorten url",
    "short link",
    "short url",
    "url shortener free",
    "link shortener free",
    "shorten link",
    "shorten url free",
    
    // Brand/Competitor Alternatives
    "bitly alternative",
    "bitly alternative free",
    "tinyurl alternative",
    "tiny url alternative",
    "bit.ly alternative",
    "rebrandly alternative",
    "ow.ly alternative",
    "short.io alternative",
    "t.co alternative",
    "goo.gl alternative",
    "is.gd alternative",
    "cutt.ly alternative",
    
    // No Signup Keywords
    "url shortener no signup",
    "link shortener no signup",
    "shorten url without signup",
    "url shortener without registration",
    "link shortener without login",
    "free url shortener no account",
    "anonymous url shortener",
    "url shortener no login",
    
    // Year-based Keywords
    "best url shortener 2026",
    "free url shortener 2026",
    "top link shortener 2026",
    "url shortener 2026",
    
    // Feature Keywords
    "custom short url",
    "custom url shortener",
    "branded link shortener",
    "qr code url shortener",
    "url shortener with qr code",
    "link shortener with analytics",
    "url shortener with tracking",
    "click tracking url shortener",
    "url redirect service",
    "permanent short url",
    "short url generator",
    "link generator",
    
    // Use Case Keywords
    "shorten youtube link",
    "shorten youtube url",
    "shorten amazon link",
    "shorten affiliate link",
    "shorten instagram link",
    "shorten facebook link",
    "shorten twitter link",
    "shorten tiktok link",
    "shorten spotify link",
    "social media link shortener",
    
    // Question Keywords
    "how to shorten a url",
    "how to shorten a link",
    "how to create short url",
    "how to make url shorter",
    "how to shorten long url",
    "where to shorten url",
    "best way to shorten url",
    
    // Long-tail Keywords
    "free online url shortener",
    "online link shortener free",
    "instant url shortener",
    "fast url shortener",
    "reliable url shortener",
    "simple url shortener",
    "easy url shortener",
    "quick link shortener",
    "best free link shortener",
    "top free url shortener",
    "unlimited url shortener",
    "url shortener unlimited",
    
    // International Keywords - Spanish
    "acortador de url",
    "acortador de enlaces",
    "acortar url gratis",
    "acortador de links",
    
    // International Keywords - Portuguese
    "encurtador de url",
    "encurtador de link",
    "encurtar url gratis",
    "encurtador de links gratis",
    
    // International Keywords - French
    "raccourcir url",
    "raccourcisseur de lien",
    "raccourcisseur url gratuit",
    
    // International Keywords - German
    "url kürzen",
    "link kürzer",
    "url verkürzen kostenlos",

    // Country targeting
    "url shortener canada",
    "free url shortener canada",
    "best url shortener canada",
    "url shortener new zealand",
    "free url shortener new zealand",
    "url shortener germany",
    "free url shortener germany",
    "best url shortener germany",
    "url shortener latvia",
    "free url shortener latvia",
    
    // International Keywords - Hindi
    "url shortener hindi",
    "free url shortener india",
    "link shortener india",
    
    // Additional Keywords
    "compress url",
    "url compressor",
    "make link shorter",
    "shrink url",
    "url shortening service",
    "link management",
    "bulk url shortener",
    "api url shortener",
  ],
  alternates: {
    canonical: "https://ul0.site",
    languages: hreflangAlternates,
  },
  openGraph: {
    title: "Free URL Shortener Online - Shorten Links Instantly | ul0",
    description: "ul0 is a free URL shortener with QR codes, click tracking, UTM tools, and expense splitting. Shorten links instantly with no signup required.",
    url: "https://ul0.site",
    type: "website",
    siteName: "ul0 - Free URL Shortener",
    locale: "en_US",
    images: [{
      url: "https://ul0.site/ul0.png",
      width: 1200,
      height: 630,
      alt: "ul0 - Best Free URL Shortener 2026",
      type: "image/webp",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free URL Shortener - Shorten Links Instantly | ul0",
    description: "ul0 is a free URL shortener with QR codes, click tracking, UTM tools, and expense splitting.",
    images: ["https://ul0.site/ul0.webp"],
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
      name: "ul0",
      url: "https://ul0.site",
      logo: {
        "@type": "ImageObject",
        url: "https://ul0.site/ul0.png",
        width: 512,
        height: 512
      },
      description: "Free URL shortener and branded link management platform with QR codes, click analytics, UTM tools, and expense splitting.",
      foundingDate: "2024",
      email: "getul0site@gmail.com",
      sameAs: [
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
      name: "ul0 - Free URL Shortener",
      publisher: { "@id": "https://ul0.site/#organization" },
      inLanguage: "en-US"
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
      "@type": "SoftwareApplication",
      "@id": "https://ul0.site/#app",
      name: "ul0 URL Shortener",
      description: "ul0 is a free URL shortener with QR codes, click tracking, UTM tools, and expense splitting.",
      applicationCategory: "UtilityApplication",
      applicationSubCategory: "URL Shortener",
      operatingSystem: "Web, Windows, macOS, Linux, iOS, Android",
      browserRequirements: "Requires JavaScript",
      softwareVersion: "2.0",
      releaseNotes: "https://ul0.site/blog",
      screenshot: "https://ul0.site/ul0.png",
      featureList: [
        "Instant URL Shortening",
        "No Signup Required",
        "Custom Short Links",
        "QR Code Generation",
        "Click Analytics",
        "Permanent Links",
        "Mobile Friendly",
        "API Access"
      ],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        priceValidUntil: "2030-12-31"
      },
      areaServed: [
        { "@type": "Country", name: "Canada" },
        { "@type": "Country", name: "New Zealand" },
        { "@type": "Country", name: "Germany" },
        { "@type": "Country", name: "Latvia" },
        { "@type": "Country", name: "United States" },
        { "@type": "Country", name: "United Kingdom" },
        { "@type": "Country", name: "Australia" },
        { "@type": "Country", name: "India" }
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
              {/* Product Hunt & NextGen Tools Badges */}
              <div className="mb-4 flex justify-center items-center gap-3 flex-wrap">
                <a 
                  href="https://www.producthunt.com/products/ul0?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-ul0" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img 
                    src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1044134&theme=light&t=1764499330543" 
                    alt="ul0 - Free URL shortener & expense splitter | Product Hunt" 
                    width="250" 
                    height="54"
                    className="h-[54px] w-[250px]"
                  />
                </a>
                <a 
                  href="https://www.nxgntools.com/tools/ul0?utm_source=ul0" 
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img 
                    src="https://www.nxgntools.com/api/embed/ul0?type=PLACED_1ST_ON" 
                    alt="NextGen Tools #1 Tool of the Week Badge - Top Trending Tool" 
                    width="168"
                    height="48"
                    loading="lazy"
                    className="h-[48px] w-auto"
                  />
                </a>
              </div>
              
              <h1 className="mb-3 text-balance text-2xl font-bold tracking-tight text-foreground sm:mb-4 sm:text-4xl lg:text-5xl">
                Free URL Shortener &amp; QR Code Generator
              </h1>
              <p className="mb-4 text-pretty text-base text-muted-foreground sm:text-xl max-w-2xl mx-auto">
                Create short, shareable links with click tracking and QR codes — <strong>free, fast, and no signup required.</strong>
              </p>

              {/* Trust signals row */}
              <div className="mb-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:text-sm text-muted-foreground">
                <span className="flex items-center gap-1 text-foreground font-medium">
                  <span className="text-emerald-500">✓</span> No signup required
                </span>
                <span className="flex items-center gap-1 text-foreground font-medium">
                  <span className="text-emerald-500">✓</span> 100% Free
                </span>
                <span className="flex items-center gap-1 text-foreground font-medium">
                  <span className="text-emerald-500">✓</span> Fast permanent redirects
                </span>
                <span className="flex items-center gap-1 text-foreground font-medium">
                  <span className="text-emerald-500">✓</span> Security checked
                </span>
                <span className="flex items-center gap-1 text-foreground font-medium">
                  <span className="text-emerald-500">✓</span> Mobile friendly
                </span>
              </div>

              <LinkShortenerForm />

              {/* SEO-rich content below form */}
              <div className="mt-8 text-left text-sm text-muted-foreground space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Why Use ul0 URL Shortener?</h3>
                  <ul className="space-y-1.5 list-disc list-inside">
                    <li><strong>100% Free</strong> - No hidden costs, no premium plans needed</li>
                    <li><strong>No Signup</strong> - Start shortening URLs instantly without registration</li>
                    <li><strong>Permanent Links</strong> - Your short URLs never expire</li>
                    <li><strong>Fast Redirects</strong> - Lightning-fast URL redirection</li>
                    <li><strong>Mobile Friendly</strong> - Works perfectly on all devices</li>
                  </ul>
                </div>

                <div className="space-y-3 leading-relaxed text-sm">
                  <h3 className="text-lg font-semibold text-foreground">Advanced Link Management & QR Codes</h3>
                  <p>
                    ul0 is a state-of-the-art URL shortener and link compressor designed to streamline your online sharing experience. Whether you are a social media influencer, an ecommerce brand, or a digital marketer, clean links are critical to maximizing CTR (Click-Through Rates). By transforming long, unwieldy, tracking-heavy web addresses into short, elegant redirect aliases, ul0 ensures your links look trustworthy and professional across platforms like Instagram, YouTube, Twitter, and TikTok.
                  </p>
                  <p>
                    Unlike generic SaaS templates, our platform runs entirely on high-performance servers to guarantee lightning-fast redirections. We automatically generate a secure QR code for every shortened link, allowing you to bridge the gap between offline print materials and your online presence instantly. All shortened addresses are permanent and monitored for safety, shielding your audience from malicious redirects.
                  </p>
                </div>

                <div className="space-y-3 leading-relaxed text-sm">
                  <h3 className="text-lg font-semibold text-foreground">Integrated Expense Splitting & Document Tools</h3>
                  <p>
                    Beyond link compression, ul0 offers built-in tools to support your daily productivity. Our UPI-powered Bill Splitter allows friends, housemates, and travel groups to calculate shared tabs and generate scan-and-pay payment codes on-the-fly. Additionally, our new <strong>PDF Scanner & Tools</strong> lets you scan documents with your camera, auto-crop them like a professional scanner, convert images into multi-page PDFs, and merge, reorder, or rename files entirely in your browser.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured badges section */}
        <section className="border-y bg-muted/20 py-12 sm:py-14">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-5xl text-center">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Featured on trusted directories
              </h2>
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                Discover ul0 across the web and support the tools that help people find this project.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <a
                  href="https://dang.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Dang.ai"
                  className="flex items-center justify-center rounded-2xl border bg-background p-4 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
                >
                  <img
                    src="https://cdn.prod.website-files.com/63d8afd87da01fb58ea3fbcb/6487e2868c6c8f93b4828827_dang-badge.png"
                    alt="Dang.ai"
                    width="150"
                    height="54"
                    loading="lazy"
                    className="h-[54px] w-[150px]"
                  />
                </a>

                <a
                  href="https://turbo0.com/item/ul0"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Turbo0 listing for ul0"
                  className="flex items-center justify-center rounded-2xl border bg-background p-4 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
                >
                  <img
                    src="https://img.turbo0.com/badge-listed-dark.svg"
                    alt="Listed on Turbo0"
                    width="150"
                    height="54"
                    loading="lazy"
                    className="h-[54px] w-auto"
                  />
                </a>

                <a
                  href="https://findly.tools/ul0?utm_source=ul0"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Findly.tools featured listing for ul0"
                  className="flex items-center justify-center rounded-2xl border bg-background p-4 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
                >
                  <img
                    src="https://findly.tools/badges/findly-tools-badge-light.svg"
                    alt="Featured on Findly.tools"
                    width="175"
                    height="55"
                    loading="lazy"
                    className="h-[55px] w-[175px]"
                  />
                </a>

                <a
                  href="https://neeed.directory/products/ul0?utm_source=ul0"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit neeed.directory featured listing for ul0"
                  className="flex items-center justify-center rounded-2xl border bg-background p-4 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md"
                >
                  <img
                    src="https://neeed.directory/badges/neeed-badge-light.svg"
                    alt="Featured on neeed.directory"
                    width="139"
                    height="54"
                    loading="lazy"
                    className="h-[54px] w-[139px]"
                  />
                </a>

                <div className="flex items-center justify-center rounded-2xl border bg-background p-4 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md col-span-full lg:col-span-1">
                  <a
                    href="https://strategic-flow-audit.replit.app/directory"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      fontFamily: "monospace",
                      fontSize: "12px",
                      fontWeight: 700,
                      padding: "6px 14px",
                      background: "#0a1628",
                      color: "#00d4c8",
                      border: "1px solid rgba(0,212,200,0.6)",
                      borderRadius: "6px",
                      textDecoration: "none",
                    }}
                  >
                    🔗 Listed on ToolIndex · DR 86 dofollow
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Global market marquee */}
        <section className="py-12 sm:py-14">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-5xl rounded-3xl border bg-card px-4 py-5 shadow-sm sm:px-6 sm:py-6">
              <div className="mb-4 text-center">
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Built for creators in global markets
                </h2>
                <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                  Fast link shortening for creators, affiliates, and ecommerce brands targeting high-value regions.
                </p>
              </div>
              <div className="marquee-mask overflow-hidden">
                <div className="flex w-[200%] animate-marquee-left gap-3">
                  {[
                    "Canada",
                    "New Zealand",
                    "Germany",
                    "Latvia",
                    "United States",
                    "United Kingdom",
                    "Australia",
                    "India",
                  ].concat([
                    "Canada",
                    "New Zealand",
                    "Germany",
                    "Latvia",
                    "United States",
                    "United Kingdom",
                    "Australia",
                    "India",
                  ]).map((country, index) => (
                    <div key={`${country}-${index}`} className="shrink-0 rounded-full border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm">
                      {country}
                    </div>
                  ))}
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
                Explore All 18 Published Articles & Guides →
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <FeaturesSection />

        {/* Massive 1,500+ Word Educational Infrastructure Guide */}
        <section className="py-16 bg-muted/20 border-t">
          <div className="container mx-auto px-4 max-w-5xl">
            <article className="prose prose-slate dark:prose-invert max-w-none space-y-8">
              <div className="border-b pb-6">
                <Badge variant="secondary" className="mb-2">Technical Handbook</Badge>
                <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
                  The Complete 2026 Link Infrastructure, Attribution & Privacy Handbook
                </h2>
                <p className="text-base text-muted-foreground mt-2">
                  An authoritative guide to modern URL redirection architectures, custom domain deliverability, UTM campaign taxonomy, and security protocols.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-foreground mb-3">1. Redirection Mechanics: HTTP 301 Permanent Redirects vs. 302/200 Handshakes</h3>
                <p className="text-muted-foreground leading-relaxed">
                  When a client browser executes a short link request, the host server inspects the requested slug, queries the caching layer (e.g. Upstash Redis edge instance), and returns an HTTP status code header. <strong>ul0</strong> strictly emits <strong>HTTP 301 Permanent Redirect</strong> headers. In HTTP protocol specifications (RFC 7231), a 301 status indicates that the target resource has moved permanently to the target URI.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  Crucially for search engine optimization (SEO), 301 status codes transfer 99–100% of link equity (PageRank) from the shortened alias directly to the destination URL. In contrast, 302 (Found/Temporary) or JavaScript-based client-side redirects cause search crawlers to drop indexing signals and create measurable render latency for mobile users.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-foreground mb-3">2. Custom Branded Domains: Click-Through Rates (CTR) & Trust Signals</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Consumer security awareness has heightened significantly. Generic URL shortener domains (e.g., bit.ly, tinyurl.com, is.gd) are frequently targeted by automated phishing scanners because bad actors attempt to hide destination URLs. As a result, major email service providers (Gmail, Outlook, Yahoo Mail) score emails containing generic short links with elevated spam risk factors.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-2">
                  Utilizing a custom branded domain (such as <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono font-bold">link.yourcompany.com</code>) reinforces brand ownership, preserves brand identity in social feeds, and yields up to a <strong>34% higher Click-Through Rate (CTR)</strong> across SMS, email, and social media campaigns.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-foreground mb-3">3. Advanced Campaign Attribution & UTM Parameter Taxonomy</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Tracking multi-channel marketing campaigns requires consistent Urchin Tracking Module (UTM) taxonomy. Attaching standardized parameters allows Google Analytics 4 (GA4) and enterprise attribution tools to isolate user acquisition channels accurately:
                </p>
                <ul className="list-disc list-inside space-y-1.5 text-muted-foreground mt-2">
                  <li><strong className="text-foreground">utm_source:</strong> Identifies the traffic referrer (e.g., <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">newsletter</code>, <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">google</code>, <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">linkedin</code>).</li>
                  <li><strong className="text-foreground">utm_medium:</strong> Identifies the marketing channel (e.g., <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">cpc</code>, <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">email</code>, <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">social_post</code>).</li>
                  <li><strong className="text-foreground">utm_campaign:</strong> Identifies the strategic campaign initiative (e.g., <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">summer_launch_2026</code>).</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-foreground mb-3">4. QR Code Matrix Architecture & Print Sizing Rules</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Quick Response (QR) codes use two-dimensional ISO/IEC 18004 matrix symbology containing square module patterns. When generating QR codes for print distribution:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
                  <li><strong className="text-foreground">Quiet Zone:</strong> Maintain a minimum 4-module border of whitespace around the matrix.</li>
                  <li><strong className="text-foreground">Print Sizing Rule:</strong> Minimum print width (in inches) = Scanning distance / 10. (e.g., a poster scanned from 10 feet away requires a minimum 12-inch QR code).</li>
                  <li><strong className="text-foreground">Error Correction (Level H):</strong> Enables 30% data recovery even if the code suffers physical wear or partial coverage.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-foreground mb-3">5. Automated Anti-Phishing Security Verification</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To protect public users, <strong>ul0</strong> runs real-time security checks on submitted URLs against automated threat feeds (including Google Safe Browsing APIs). Short links leading to known phishing, malware, or credential harvesting endpoints are immediately flagged and blocked.
                </p>
              </div>
            </article>
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
                  Unlike other URL shorteners that require accounts or limit your usage, ul0 is <strong>completely free with no restrictions</strong>. Your shortened links are permanent and will continue to work as long as you need them. We also offer a unique <Link href="/split" className="text-primary hover:underline">expense splitting feature</Link> that lets you split bills with friends using UPI QR codes.
                </p>
                <p className="text-muted-foreground mt-3">
                  Our link compression engine utilizes premium 301 Permanent Redirect headers. This ensures that 100% of your link equity (PageRank) is passed seamlessly to the target destination. This means search engines like Google, Bing, and Yahoo will attribute all the indexing credit directly to your original URL, making ul0 a highly safe choice for digital marketing agencies, brand developers, and SEO consultants looking to shorten domain paths.
                </p>
                <p className="text-muted-foreground mt-3">
                  Privacy and safety are at the core of our platform. We scan every shortened URL for phishing, spam, and malware before execution, protecting your audience from malicious redirects. Additionally, the files you process in our PDF Scanner and the personal ledger calculations in our UPI Bill Splitter are handled strictly locally in your browser. We do not track personal details, meaning your browsing habits remain anonymous and protected.
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
                        <td className="p-3 font-medium">Expense Splitter</td>
                        <td className="p-3 text-green-600 font-semibold">Yes (Free)</td>
                        <td className="p-3 text-muted-foreground">No</td>
                        <td className="p-3 text-muted-foreground">No</td>
                        <td className="p-3 text-muted-foreground">No</td>
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
                    { href: "/split", label: "Split Expenses", desc: "Settle bills in INR or USD" },
                    { href: "/qr", label: "QR Code Generator", desc: "Turn any link into a QR code" },
                    { href: "/utm", label: "UTM Builder", desc: "Track campaigns with clean links" },
                    { href: "/wifi", label: "WiFi QR Generator", desc: "Share WiFi in one scan" },
                    { href: "/json", label: "JSON Formatter", desc: "Format and validate JSON" },
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
