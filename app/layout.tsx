import {ClerkProvider} from "@clerk/nextjs";
import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Autotag } from "@/components/autotag"
import { hreflangAlternates } from "@/lib/i18n"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://ul0.site"),
  title: {
    default: "ul0 — Free URL Shortener, QR Codes & Expense Splitting",
    template: "%s | ul0 - Free Link Shortener"
  },
  description:
    "ul0 is a free URL shortener with branded custom domain links, QR code generation, click analytics, UTM campaign tools, and expense splitting. Shorten links instantly with no signup required.",
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

    // Primary keywords - English
    "url shortener",
    "free url shortener",
    "link shortener",
    "shorten url",
    "short link",
    "tiny url",
    "short url generator",
    "link shortener free",
    "url shortener free",
    "shorten link free",
    "free link shortener",
    "online url shortener",
    "best url shortener",
    "url shortener online",
    "short link generator",
    "link compressor",
    "shrink url",
    "compress url",
    "make link shorter",
    "shorten my link",
    "url shortener no signup",
    "free link shortener no signup",
    "link shortener without login",
    "anonymous url shortener",
    "url shortener without registration",
    // Competitor alternatives
    "bitly alternative",
    "bitly alternative free",
    "tinyurl alternative",
    "rebrandly alternative",
    "free bitly alternative",
    "bit.ly alternative",
    "ow.ly alternative",
    "t.co alternative",
    "goo.gl alternative",
    "is.gd alternative",
    "cutt.ly alternative",
    "short.io alternative",
    // Year-based searches
    "best url shortener 2026",
    "best url shortener 2026",
    "best link shortener 2026",
    "free url shortener 2026",
    "top url shortener 2026",
    // Feature keywords
    "custom short link",
    "custom url shortener",
    "branded short links",
    "url shortener with analytics",
    "link shortener with qr code",
    "qr code generator",
    "free qr code generator",
    "qr code maker",
    "wifi qr code",
    "qr code from link",
    "url to qr code",
    // Use case keywords
    "shorten youtube link",
    "shorten amazon link",
    "shorten instagram link",
    "shorten twitter link",
    "shorten facebook link",
    "shorten tiktok link",
    "shorten affiliate link",
    "marketing link shortener",
    "social media link shortener",
    // Question keywords
    "how to shorten url",
    "how to shorten a link",
    "how to make short link",
    "how to create short url",
    "how to shorten url free",
    // Split expenses keywords
    "split expenses",
    "bill splitter",
    "expense splitter",
    "split bill app",
    "splitwise alternative",
    "upi qr code",
    "payment qr code",
    "share expenses",
    // International - Spanish
    "acortador de enlaces",
    "acortador de url gratis",
    "acortar link",
    "acortador de links",
    // International - Portuguese
    "encurtador de link",
    "encurtador de url gratis",
    "encurtar link",
    // International - Hindi
    "url shortener hindi",
    "link shortener india",
    "free url shortener india",
    // International - Indonesian
    "pemendek link",
    "pemendek url gratis",
    // International - Vietnamese
    "rút gọn link",
    "rút gọn url miễn phí",
    // International - Thai
    "ย่อลิงค์",
    "ย่อ url ฟรี",
    // International - French
    "raccourcir url",
    "raccourcisseur de lien gratuit",
    // International - German
    "url kürzen",
    "link kürzer kostenlos",
    // International - Japanese
    "url短縮",
    "リンク短縮無料",
    // International - Korean
    "url 단축",
    "링크 단축기 무료",
    // International - Arabic
    "اختصار الروابط",
    "تقصير الرابط مجانا",
    // Long-tail keywords
    "shorten url online free without registration",
    "best free url shortener without ads",
    "simple url shortener no account needed",
    "fast link shortener free",
    "instant url shortener",
    "bulk url shortener free",
    "private url shortener",
    "secure link shortener",
  ],
  authors: [{ name: "ul0", url: "https://ul0.site" }],
  creator: "ul0",
  publisher: "ul0",
  applicationName: "ul0 URL Shortener",
  category: "Technology",
  classification: "URL Shortener, Link Management, QR Code Generator",
  alternates: {
    canonical: "https://ul0.site",
    languages: hreflangAlternates,
  },
  openGraph: {
    title: "ul0 — Free URL Shortener, QR Codes & Expense Splitting",
    description: "Free URL shortener with QR codes, click tracking, UTM tools, and expense splitting. No signup required.",
    url: "https://ul0.site",
    type: "website",
    locale: "en_US",
    siteName: "ul0 - Free URL Shortener & QR Code Generator",
    images: [
      {
        url: "https://ul0.site/ul0.png",
        width: 512,
        height: 512,
        alt: "ul0 - Best Free URL Shortener 2026",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ul0 — Free URL Shortener, QR Codes & Expense Splitting",
    description: "Free URL shortener with QR codes, click tracking, UTM tools, and expense splitting.",
    images: ["https://ul0.site/ul0.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  icons: {
    icon: [
      { url: "/ul0.png", type: "image/png" },
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/ul0.png",
    shortcut: "/ul0.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      // Website
      {
        "@type": "WebSite",
        "@id": "https://ul0.site/#website",
        url: "https://ul0.site",
        name: "ul0 - Free URL Shortener",
        description: "Best free URL shortener 2026. Shorten links instantly without signup. Create short URLs, QR codes & track clicks.",
        publisher: { "@id": "https://ul0.site/#organization" },
        potentialAction: [
          {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: "https://ul0.site/?q={search_term_string}"
            },
            "query-input": "required name=search_term_string",
          },
        ],
        inLanguage: "en-US",
      },
      // Organization
      {
        "@type": "Organization",
        "@id": "https://ul0.site/#organization",
        name: "ul0",
        url: "https://ul0.site",
        logo: {
          "@type": "ImageObject",
          "@id": "https://ul0.site/#logo",
          url: "https://ul0.site/ul0.png",
          contentUrl: "https://ul0.site/ul0.png",
          width: 512,
          height: 512,
          caption: "ul0 - Free URL Shortener"
        },
        image: { "@id": "https://ul0.site/#logo" },
        sameAs: [
          "https://twitter.com/ul0site"
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          url: "https://ul0.site/contact"
        }
      },
      // SiteNavigationElement for sitelinks
      {
        "@type": "SiteNavigationElement",
        "@id": "https://ul0.site/#navigation",
        name: "Main Navigation",
        hasPart: [
          {
            "@type": "WebPage",
            name: "URL Shortener",
            description: "Shorten any URL for free in seconds",
            url: "https://ul0.site"
          },
          {
            "@type": "WebPage",
            name: "QR Code Generator",
            description: "Create QR codes from URLs instantly",
            url: "https://ul0.site/qr"
          },
          {
            "@type": "WebPage",
            name: "Split Expenses",
            description: "Split bills with friends easily",
            url: "https://ul0.site/split"
          },
          {
            "@type": "WebPage",
            name: "WiFi QR Code",
            description: "Generate WiFi sharing QR codes",
            url: "https://ul0.site/wifi"
          },
          {
            "@type": "WebPage",
            name: "UTM Builder",
            description: "Create UTM tracking links",
            url: "https://ul0.site/utm"
          },
          {
            "@type": "WebPage",
            name: "JSON Formatter",
            description: "Format and validate JSON online",
            url: "https://ul0.site/json"
          }
        ]
      }
    ],
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://ul0.site" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Simple Analytics - Privacy-friendly analytics */}
        <script 
          data-collect-dnt="true" 
          async 
          src="https://scripts.simpleanalyticscdn.com/latest.js"
        />
        {/* Google AdSense account verification */}
        <meta name="google-adsense-account" content="ca-pub-8018312015732327" />
        {/* Google AdSense - Auto Ads tag */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8018312015732327"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ClerkProvider dynamic>
          <div className="relative">
          {children}
          </div>
          <Analytics />
          <Autotag />
          {/* Simple Analytics noscript fallback */}
          <noscript>
          <img 
          src="https://queue.simpleanalyticscdn.com/noscript.gif?collect-dnt=true" 
          alt="" 
          referrerPolicy="no-referrer-when-downgrade"
          />
          </noscript>
        </ClerkProvider>
      </body>
    </html>
  )
}