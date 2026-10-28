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
    default: "UL0 - URL Shortener, QR Codes and Custom Domains",
    template: "%s | UL0",
  },
  description:
    "Shorten links, generate dynamic vector QR codes, and connect branded custom domains with privacy-first click analytics.",
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
    title: "UL0 - URL Shortener, QR Codes and Custom Domains",
    description:
      "Shorten links, generate dynamic vector QR codes, and connect branded custom domains with privacy-first click analytics.",
    url: "https://ul0.site",
    type: "website",
    locale: "en_US",
    siteName: "UL0",
    images: [
      {
        url: "https://ul0.site/social-card.png",
        width: 1376,
        height: 768,
        alt: "UL0 - URL Shortener, QR Codes and Custom Domains",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UL0 - URL Shortener, QR Codes and Custom Domains",
    description:
      "Shorten links, generate dynamic vector QR codes, and connect branded custom domains with privacy-first click analytics.",
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
    { media: "(prefers-color-scheme: dark)", color: "#08100E" },
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
      {
        "@type": "WebSite",
        "@id": "https://ul0.site/#website",
        url: "https://ul0.site",
        name: "UL0",
        description: "URL shortener, custom domains, vector QR codes, and click analytics.",
        publisher: { "@id": "https://ul0.site/#organization" },
        inLanguage: "en-US",
      },
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
        applicationCategory: "BusinessApplication",
        operatingSystem: "All (Web)",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        description: "Link management platform with branded custom domains, dynamic vector QR codes, and privacy-first analytics.",
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
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta name="google-site-verification" content="Apib7-x98H0j5cPqHWwSMm6dNU4GmODRoqxLiDzdx9I" />

        {/* Immediate theme restoration supporting system preference & saved user toggle */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('theme');
                  var cookieMatch = document.cookie.match(/(?:^|; )theme=([^;]*)/);
                  var cookieTheme = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;
                  var theme = stored || cookieTheme;
                  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && prefersDark)) {
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
      <body className="font-sans antialiased bg-background text-foreground selection:bg-primary/20 selection:text-foreground" suppressHydrationWarning>
        <ClerkProvider
          appearance={{
            variables: {
              colorPrimary: "#168270",
              colorBackground: "#FFFFFF",
              colorText: "#0B1412",
              colorInputBackground: "#FFFFFF",
              colorInputBorder: "rgba(14, 61, 56, 0.15)",
              borderRadius: "6px",
              fontFamily: "var(--font-geist-sans), sans-serif",
            },
            elements: {
              card: "shadow-none border border-border rounded-lg",
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-none text-xs font-semibold h-10",
              footerActionLink: "text-primary hover:text-primary/90",
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
