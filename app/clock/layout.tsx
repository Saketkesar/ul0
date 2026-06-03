import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Aesthetic Clock - Beautiful Fullscreen Clock for Desk Setups | ul0 [2026]",
  description: "Best aesthetic clock 2026 for desk setups, streaming, or second monitor. Multiple themes: Neon, Minimal, Retro, Gradient. Beautiful fullscreen clock - 100% free!",
  keywords: [
    // Primary Keywords
    "aesthetic clock",
    "fullscreen clock",
    "digital clock",
    "online clock",
    "desk clock",
    "desktop clock",
    "beautiful clock",
    
    // Year-based
    "aesthetic clock 2026",
    "best digital clock 2026",
    "desk setup clock 2026",
    
    // Use case keywords
    "streaming clock",
    "streamer clock",
    "clock for streamers",
    "clock for twitch",
    "clock for youtube",
    "second monitor clock",
    "desk setup clock",
    "aesthetic desk setup",
    "home office clock",
    
    // Theme keywords
    "neon clock",
    "minimal clock",
    "minimalist clock",
    "retro clock",
    "gradient clock",
    "dark mode clock",
    "glowing clock",
    "animated clock",
    
    // Feature keywords
    "fullscreen mode clock",
    "screensaver clock",
    "clock widget",
    "clock for desktop",
    "clock for monitor",
    "digital clock online free",
    "clock with date",
    
    // International - Spanish
    "reloj estético",
    "reloj digital online",
    "reloj de escritorio",
    
    // International - Portuguese
    "relógio estético",
    "relógio digital online",
    
    // Related keywords
    "clock display",
    "time display",
    "big digital clock",
    "large clock display",
    "clock for wall",
    "clock for tv",
    "ambient clock",
    "decorative clock",
    
    // Long-tail keywords
    "best aesthetic clock online",
    "free fullscreen clock",
    "beautiful digital clock online",
    "clock for gaming setup",
    "clock for work from home",
  ],
  alternates: {
    canonical: "https://ul0.site/clock",
  },
  openGraph: {
    title: "Aesthetic Clock - Beautiful Fullscreen Clock | ul0",
    description: "Best aesthetic clock 2026 for desk setups and streaming. Multiple themes, fullscreen mode. Free!",
    url: "https://ul0.site/clock",
    type: "website",
    siteName: "ul0 - Aesthetic Clock",
    images: [{
      url: "https://ul0.site/ul0.png",
      width: 1200,
      height: 630,
      alt: "ul0 Aesthetic Clock",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aesthetic Clock - Beautiful Fullscreen Clock | ul0",
    description: "Beautiful aesthetic clock for desk setups. Multiple themes!",
    images: ["https://ul0.site/ul0.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function ClockLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://ul0.site/clock#webpage",
        url: "https://ul0.site/clock",
        name: "Aesthetic Clock - Beautiful Fullscreen Clock | ul0",
        isPartOf: { "@id": "https://ul0.site/#website" },
      },
      {
        "@type": "SoftwareApplication",
        name: "ul0 Aesthetic Clock",
        applicationCategory: "UtilityApplication",
        operatingSystem: "Web Browser",
        url: "https://ul0.site/clock",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "1450" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://ul0.site" },
          { "@type": "ListItem", position: 2, name: "Aesthetic Clock", item: "https://ul0.site/clock" }
        ]
      }
    ]
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
