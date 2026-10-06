import {ClerkProvider} from "@clerk/nextjs";
import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Autotag } from "@/components/autotag"
import { hreflangAlternates } from "@/lib/i18n"
import { headers } from "next/headers"
import Script from "next/script"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://ul0.site"),
  title: {
    default: "UL0 — Free URL Shortener, QR Codes & Custom Domains",
    template: "%s | UL0"
  },
  description:
    "Shorten links free, connect your own custom domain, make dynamic QR codes, and track clicks without signup.",
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
    title: "UL0 — Free URL Shortener, QR Codes & Custom Domains",
    description: "Shorten links free, connect your own custom domain, make dynamic QR codes, and track clicks without signup.",
    url: "https://ul0.site",
    type: "website",
    locale: "en_US",
    siteName: "UL0",
    images: [
      {
        url: "https://ul0.site/social-card.png",
        width: 1376,
        height: 768,
        alt: "UL0 — Free URL Shortener, Custom Domains & QR Codes",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UL0 — Free URL Shortener, QR Codes & Custom Domains",
    description: "Shorten links free, connect your own custom domain, make dynamic QR codes, and track clicks without signup.",
    images: ["https://ul0.site/social-card.png"],
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
  verification: {
    google: "Apib7-x98H0j5cPqHWwSMm6dNU4GmODRoqxLiDzdx9I",
  },
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/ul0.png", type: "image/png" },
    ],
    apple: "/apple-icon.png",
    shortcut: "/icon.svg",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = await headers()
  const locale = headersList.get("x-locale") || "en"

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
          url: "https://ul0.site/contact"
        }
      },
      // SiteNavigationElement for Google search sitelinks
      {
        "@type": "SiteNavigationElement",
        "@id": "https://ul0.site/#navigation",
        name: "Main Navigation",
        hasPart: [
          {
            "@type": "WebPage",
            name: "URL Shortener",
            description: "High-performance short link generator with 301 redirects",
            url: "https://ul0.site"
          },
          {
            "@type": "WebPage",
            name: "Branded Custom Domains",
            description: "Connect your own custom root or sub-domain free",
            url: "https://ul0.site/custom-domain-landing"
          },
          {
            "@type": "WebPage",
            name: "Split Expenses Online",
            description: "Free group expense splitter with instant UPI QR code settlement",
            url: "https://ul0.site/split"
          },
          {
            "@type": "WebPage",
            name: "PDF Page Splitter",
            description: "Extract and download individual pages from any PDF",
            url: "https://ul0.site/tools/pdf-splitter"
          },
          {
            "@type": "WebPage",
            name: "Vector QR Generator",
            description: "Create SVG vector QR codes with colors and tracking",
            url: "https://ul0.site/qr"
          },
          {
            "@type": "WebPage",
            name: "301 Redirect Checker",
            description: "Audit HTTP status codes and redirect chains",
            url: "https://ul0.site/tools/redirect-checker"
          },
          {
            "@type": "WebPage",
            name: "UTM Campaign Builder",
            description: "Create Google Analytics & Meta campaign links",
            url: "https://ul0.site/utm"
          },
          {
            "@type": "WebPage",
            name: "Free Backlinks Directory",
            description: "Aesthetic badge backlink exchange for indie builders",
            url: "https://ul0.site/backlinks"
          },
          {
            "@type": "WebPage",
            name: "Link Management & SEO Blog",
            description: "Guides on link management, Bitly alternatives, and QR marketing",
            url: "https://ul0.site/blog"
          }
        ]
      },
      // SoftwareApplication
      {
        "@type": "SoftwareApplication",
        "@id": "https://ul0.site/#app",
        name: "UL0",
        applicationCategory: "BusinessApplication, LinkManagement, DeveloperApplication",
        operatingSystem: "All (Web, iOS, Android, macOS, Windows, Linux)",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD"
        },
        description: "Free modern link management platform with branded custom domains, dynamic vector QR codes, and real-time analytics.",
        url: "https://ul0.site"
      }
    ],
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://ul0.site" />
        <link rel="llms.txt" href="/llms.txt" />
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google Search Console verification */}
        <meta name="google-site-verification" content="Apib7-x98H0j5cPqHWwSMm6dNU4GmODRoqxLiDzdx9I" />

        {/* Google AdSense account verification */}
        <meta name="google-adsense-account" content="ca-pub-8018312015732327" />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ClerkProvider dynamic>
          <div className="relative">
          {children}
          </div>
          <Analytics />
          <Autotag />
          {/* Simple Analytics - Privacy-friendly analytics */}
          <Script 
            src="https://scripts.simpleanalyticscdn.com/latest.js"
            strategy="afterInteractive"
            data-collect-dnt="true"
          />
          {/* Simple Analytics noscript fallback with descriptive alt */}
          <noscript>
            <img 
              src="https://queue.simpleanalyticscdn.com/noscript.gif?collect-dnt=true" 
              alt="Simple Analytics Privacy-Friendly Visitor Tracking Pixel" 
              referrerPolicy="no-referrer-when-downgrade"
            />
          </noscript>
          {/* Google AdSense - LazyOnload to prevent INP blocking */}
          <Script 
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8018312015732327"
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        </ClerkProvider>
      </body>
    </html>
  )
}