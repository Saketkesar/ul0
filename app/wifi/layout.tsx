import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Free WiFi QR Code Generator — Connect Without Typing Passwords",
  description:
    "Create free printable WiFi QR codes for homes, offices, cafes, and Airbnbs. Let guests scan to connect immediately across iOS and Android without typing passwords.",
  alternates: { canonical: "https://ul0.site/wifi" },
  openGraph: {
    title: "Free WiFi QR Code Generator | UL0",
    description: "Generate instant WiFi QR codes for guests. No typing passwords, 100% free.",
    url: "https://ul0.site/wifi",
    siteName: "UL0",
    type: "website",
    images: [
      {
        url: "https://ul0.site/social-card.png",
        width: 1376,
        height: 768,
        alt: "UL0 Free WiFi QR Code Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free WiFi QR Code Generator | UL0",
    description: "Create printable WiFi QR codes for instant guest network connection.",
    images: ["https://ul0.site/social-card.png"],
  },
}

const wifiSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "UL0 WiFi QR Code Generator",
      url: "https://ul0.site/wifi",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "All",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://ul0.site" },
        { "@type": "ListItem", position: 2, name: "WiFi QR", item: "https://ul0.site/wifi" },
      ],
    },
  ],
}

export default function WifiLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(wifiSchema) }}
      />
      {children}
    </>
  )
}
