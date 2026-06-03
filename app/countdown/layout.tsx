import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Countdown Timer Creator - Beautiful Event Countdown Online | ul0 [2026]",
  description: "Best free countdown timer creator 2026. Create beautiful countdown timers for events, streaming, new year, weddings. Shareable links, fullscreen mode. 100% Free!",
  keywords: [
    // Primary Keywords
    "countdown timer",
    "countdown creator",
    "event countdown",
    "countdown clock",
    "countdown timer online",
    "countdown generator",
    "countdown maker",
    
    // Year-based
    "countdown timer 2026",
    "new year countdown 2026",
    "countdown creator 2026",
    
    // Event-specific keywords
    "new year countdown",
    "christmas countdown",
    "birthday countdown",
    "wedding countdown",
    "vacation countdown",
    "holiday countdown",
    "graduation countdown",
    "baby countdown",
    "retirement countdown",
    "exam countdown",
    
    // Use case keywords
    "countdown for streaming",
    "countdown for twitch",
    "countdown for youtube",
    "countdown for events",
    "countdown for parties",
    "countdown for desk setup",
    "countdown widget",
    "countdown display",
    "stream countdown",
    
    // Feature keywords
    "shareable countdown",
    "fullscreen countdown",
    "custom countdown",
    "countdown with themes",
    "aesthetic countdown",
    "beautiful countdown",
    "countdown link",
    
    // International - Spanish
    "temporizador cuenta regresiva",
    "contador de tiempo",
    "cuenta regresiva online",
    
    // International - Portuguese
    "temporizador contagem regressiva",
    "countdown online gratis",
    
    // Question keywords
    "how to create countdown timer",
    "how many days until",
    "days until event",
    "countdown to date",
    
    // Related keywords
    "event timer",
    "timer for events",
    "countdown display",
    "countdown screen",
    "timer creator",
    "time until calculator",
    
    // Long-tail keywords
    "free online countdown timer creator",
    "shareable countdown link",
    "beautiful event countdown",
    "countdown timer for streaming",
  ],
  alternates: {
    canonical: "https://ul0.site/countdown",
  },
  openGraph: {
    title: "Countdown Timer Creator - Beautiful Event Countdown | ul0",
    description: "Create and share beautiful countdown timers for any event. Multiple themes, fullscreen mode. Free!",
    url: "https://ul0.site/countdown",
    type: "website",
    siteName: "ul0 - Countdown Creator",
    images: [{
      url: "https://ul0.site/ul0.png",
      width: 1200,
      height: 630,
      alt: "ul0 Countdown Timer Creator",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Countdown Timer Creator | ul0",
    description: "Create beautiful countdown timers for any event. Free!",
    images: ["https://ul0.site/ul0.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function CountdownLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://ul0.site/countdown#webpage",
        url: "https://ul0.site/countdown",
        name: "Countdown Timer Creator | ul0",
        isPartOf: { "@id": "https://ul0.site/#website" },
      },
      {
        "@type": "SoftwareApplication",
        name: "ul0 Countdown Creator",
        applicationCategory: "UtilityApplication",
        operatingSystem: "Web Browser",
        url: "https://ul0.site/countdown",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "1350" },
        featureList: ["Custom Events", "Multiple Themes", "Shareable Links", "Fullscreen Mode", "Beautiful Design"],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://ul0.site" },
          { "@type": "ListItem", position: 2, name: "Countdown", item: "https://ul0.site/countdown" }
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
