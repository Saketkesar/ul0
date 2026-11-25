import { ClerkProvider } from "@clerk/nextjs"
import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { ConditionalAnalytics } from "@/components/conditional-analytics"
import { hreflangAlternates } from "@/lib/i18n"
import { Toaster } from "@/components/ui/sonner"
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
    default: "UL0: Free Branded Short Links, QR Codes & Analytics",
    template: "%s | UL0",
  },
  description:
    "Shorten links free in 1 click—no signup required. Connect a free custom domain, create dynamic vector QR codes, and track clicks in real time without tracking cookies.",
  keywords: [
    "url shortener",
    "free url shortener",
    "custom domain url shortener",
    "branded short links",
    "bitly alternative",
    "qr code generator",
    "dynamic qr code",
    "utm link builder",
    "whatsapp link generator",
    "link management platform",
    "ul0",
  ],
  authors: [{ name: "UL0", url: "https://ul0.site" }],
  creator: "UL0",
  publisher: "UL0",
  applicationName: "UL0",
  category: "Technology",
  alternates: {
    canonical: "https://ul0.site",
    languages: hreflangAlternates,
  },
  openGraph: {
    title: "UL0: Free Branded Short Links, QR Codes & Analytics",
    description:
      "Shorten links instantly. Add a free custom domain, create dynamic vector QR codes, and track clicks without tracking cookies.",
    url: "https://ul0.site",
    type: "website",
    locale: "en_US",
    siteName: "UL0",
    images: [
      {
        url: "https://ul0.site/social-card.png",
        width: 1376,
        height: 768,
        alt: "UL0 - Free Branded Short Links, QR Codes & Analytics",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UL0: Free Branded Short Links, QR Codes & Analytics",
    description:
      "Shorten links instantly. Add a free custom domain, create dynamic vector QR codes, and track clicks without tracking cookies.",
    images: ["https://ul0.site/social-card.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "Apib7-x98H0j5cPqHWwSMm6dNU4GmODRoqxLiDzdx9I",
  },
  referrer: "origin-when-cross-origin",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#F4FAF8",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://ul0.site/#website",
        url: "https://ul0.site",
        name: "UL0",
        alternateName: ["ul0.site", "UL0 URL Shortener"],
        description:
          "Free URL shortener, branded custom domain links, dynamic vector QR codes, and privacy-first analytics.",
        publisher: { "@id": "https://ul0.site/#organization" },
        inLanguage: "en-US",
      },
      {
        "@type": "Organization",
        "@id": "https://ul0.site/#organization",
        name: "UL0",
        legalName: "ul0.site",
        url: "https://ul0.site",
        foundingDate: "2024",
        logo: {
          "@type": "ImageObject",
          "@id": "https://ul0.site/#logo",
          url: "https://ul0.site/ul0.png",
          contentUrl: "https://ul0.site/ul0.png",
          width: 512,
          height: 512,
          caption: "UL0 Logo",
        },
        sameAs: [
          "https://x.com/ul0site",
          "https://github.com/Saketkesar/ul0",
          "https://www.linkedin.com/company/ul0",
        ],
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          url: "https://ul0.site/contact",
          email: "support@ul0.site",
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://ul0.site/#app",
        name: "UL0",
        applicationCategory: "UtilitiesApplication",
        applicationSubCategory: "URL Shortener & Branded Link Management",
        operatingSystem: "All (Web)",
        screenshot: "https://ul0.site/social-card.png",
        featureList: [
          "Free URL shortener with no signup required",
          "Free custom branded domains with automated SSL",
          "Dynamic PNG and vector SVG QR code generator",
          "Privacy-first real-time click analytics without cookies",
          "UTM campaign builder and WhatsApp link generator",
          "Group expense splitter, PDF tools, and REST API",
        ],
        offers: [
          {
            "@type": "Offer",
            name: "Free",
            price: "0",
            priceCurrency: "USD",
            url: "https://ul0.site/pricing",
          },
          {
            "@type": "Offer",
            name: "Pro",
            price: "3",
            priceCurrency: "USD",
            url: "https://ul0.site/pricing",
          },
          {
            "@type": "Offer",
            name: "Business",
            price: "9",
            priceCurrency: "USD",
            url: "https://ul0.site/pricing",
          },
        ],
        description:
          "Free link management platform with branded custom domains, dynamic vector QR codes, and privacy-first real-time analytics.",
        url: "https://ul0.site",
        publisher: { "@id": "https://ul0.site/#organization" },
      },
    ],
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      style={{ colorScheme: "light" }}
      suppressHydrationWarning
    >
      <head>
        <link rel="dns-prefetch" href="https://ul0.site" />
        <link rel="llms.txt" href="/llms.txt" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta name="google-site-verification" content="Apib7-x98H0j5cPqHWwSMm6dNU4GmODRoqxLiDzdx9I" />

        {/* Force crisp light theme across all browsers and remove any legacy dark theme state */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.style.colorScheme = 'light';
                  localStorage.removeItem('theme');
                  document.cookie = 'theme=light; path=/; max-age=31536000; SameSite=Lax';
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground selection:bg-primary/20 selection:text-foreground" suppressHydrationWarning>
        <ClerkProvider
          appearance={{
            elements: {
              card: "shadow-none border border-border rounded-xl bg-card text-card-foreground",
              headerTitle: "text-foreground font-semibold",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton: "border border-border bg-card hover:bg-muted text-foreground transition-colors",
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-none text-xs font-semibold h-10 transition-colors",
              formFieldInput: "bg-background border-border text-foreground focus:ring-2 focus:ring-primary",
              formFieldLabel: "text-foreground",
              footerActionLink: "text-primary hover:underline",
              identityPreviewText: "text-foreground",
              userButtonPopoverCard: "bg-card border border-border text-card-foreground shadow-lg rounded-xl",
            },
          }}
        >
          <div className="relative min-h-screen flex flex-col">
            {children}
          </div>
          <ConditionalAnalytics />
          <Toaster richColors closeButton position="top-right" />
        </ClerkProvider>
      </body>
    </html>
  )
}
