import { ClerkProvider } from "@clerk/nextjs"
import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Autotag } from "@/components/autotag"
import { hreflangAlternates } from "@/lib/i18n"
import Script from "next/script"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://ul0.site"),
  title: {
    default: "Free URL Shortener, QR Codes & Custom Domains | UL0",
    template: "%s | UL0",
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
    title: "Free URL Shortener, QR Codes & Custom Domains | UL0",
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
    title: "Free URL Shortener, QR Codes & Custom Domains | UL0",
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
        name: "UL0",
        description: "Free URL shortener, custom branded domains, and click analytics.",
        publisher: { "@id": "https://ul0.site/#organization" },
        inLanguage: "en-US",
      },
      // Organization
      {
        "@type": "Organization",
        "@id": "https://ul0.site/#organization",
        name: "UL0",
        url: "https://ul0.site",
        logo: {
          "@type": "ImageObject",
          "@id": "https://ul0.site/#logo",
          url: "https://ul0.site/ul0.png",
          contentUrl: "https://ul0.site/ul0.png",
          width: 512,
          height: 512,
          caption: "UL0 Logo",
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
          "https://www.producthunt.com/products/ul0",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          url: "https://ul0.site/contact",
        },
      },
      // SoftwareApplication
      {
        "@type": "SoftwareApplication",
        "@id": "https://ul0.site/#app",
        name: "UL0",
        applicationCategory: "BusinessApplication",
        operatingSystem: "All (Web)",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        description: "Free modern link management platform with branded custom domains, dynamic vector QR codes, and real-time privacy-first analytics.",
        url: "https://ul0.site",
      },
    ],
  }

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://ul0.site" />
        <link rel="llms.txt" href="/llms.txt" />
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

        {/* Immediate theme restoration: Dark mode strictly allowed inside /dashboard only; rest of website is strictly clean white */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var path = window.location.pathname || '';
                  if (!path.startsWith('/dashboard')) {
                    document.documentElement.classList.remove('dark');
                    return;
                  }
                  var stored = localStorage.getItem('theme');
                  var cookieMatch = document.cookie.match(/(?:^|; )theme=([^;]*)/);
                  var cookieTheme = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;
                  var theme = stored || cookieTheme;
                  var supportDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && supportDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ClerkProvider>
          <div className="relative">
            {children}
          </div>
          <Autotag />
          {/* Simple Analytics - Privacy-friendly cookieless analytics */}
          <Script 
            src="https://scripts.simpleanalyticscdn.com/latest.js"
            strategy="afterInteractive"
            data-collect-dnt="true"
          />
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