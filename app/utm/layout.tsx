import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "UTM Link Builder — Free Campaign URL Generator",
  description:
    "Build UTM tracking links for Google Analytics 4, Meta Ads, and email campaigns in seconds. Free campaign URL generator with custom source, medium, and campaign tags.",
  keywords: [
    "UTM link builder",
    "UTM parameter generator",
    "campaign URL builder",
    "Google Analytics UTM",
    "marketing link tracker",
  ],
  alternates: { canonical: "https://ul0.site/utm" },
  openGraph: {
    title: "UTM Link Builder — Free Campaign URL Generator | UL0",
    description: "Generate clean UTM tracking links for your marketing campaigns. 100% free.",
    url: "https://ul0.site/utm",
    siteName: "UL0",
    type: "website",
    images: [
      {
        url: "https://ul0.site/social-card.png",
        width: 1376,
        height: 768,
        alt: "UL0 Free UTM Campaign Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UTM Link Builder — Free Campaign URL Generator | UL0",
    description: "Standardize Google Analytics UTM parameters and shorten campaign URLs free.",
    images: ["https://ul0.site/social-card.png"],
  },
}

const utmSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "UL0 UTM Campaign Link Builder",
      url: "https://ul0.site/utm",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "All",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://ul0.site" },
        { "@type": "ListItem", position: 2, name: "UTM Builder", item: "https://ul0.site/utm" },
      ],
    },
  ],
}

export default function UtmLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(utmSchema) }}
      />
      {children}
    </>
  )
}
