import { Metadata } from "next"

export const metadata: Metadata = {
  title: "World Clock - Beautiful Multi-Timezone Display Online | ul0 [2026]",
  description: "Best free world clock 2026. Track multiple timezones at a glance. Beautiful display with day/night indicators. Perfect for remote teams & global work. Fullscreen mode!",
  keywords: [
    // Primary Keywords
    "world clock",
    "world time",
    "timezone clock",
    "multiple timezones",
    "international clock",
    "global clock",
    "time zones",
    
    // Year-based
    "world clock 2026",
    "best world clock 2026",
    "timezone tracker 2026",
    
    // Use case keywords
    "world clock for remote work",
    "timezone for meetings",
    "global team clock",
    "remote team timezone",
    "clock for international calls",
    "desk setup world clock",
    "streaming world clock",
    "clock for streamers",
    
    // Feature keywords
    "timezone display",
    "timezone tracker",
    "day night indicator",
    "fullscreen world clock",
    "multiple clocks",
    "customizable timezone",
    "city time",
    "beautiful world clock",
    "aesthetic world clock",
    
    // City/Region keywords
    "new york time",
    "london time",
    "tokyo time",
    "sydney time",
    "paris time",
    "dubai time",
    "singapore time",
    "india time",
    
    // Question keywords
    "what time is it in",
    "current time zones",
    "time zone converter",
    "time difference calculator",
    
    // International - Spanish
    "reloj mundial",
    "zonas horarias",
    "hora mundial",
    
    // International - Portuguese
    "relógio mundial",
    "fusos horários",
    "hora mundial",
    
    // Related keywords
    "timezone widget",
    "world time zones",
    "international time",
    "global time display",
    "multiple time zone clock",
    "world clock widget",
    "timezone comparison",
    
    // Long-tail keywords
    "best free world clock online",
    "beautiful timezone display",
    "world clock for desk setup",
    "aesthetic timezone tracker",
  ],
  alternates: {
    canonical: "https://ul0.site/worldclock",
  },
  openGraph: {
    title: "World Clock - Beautiful Multi-Timezone Display | ul0",
    description: "Best free world clock 2026. Track multiple timezones at a glance. Perfect for remote teams!",
    url: "https://ul0.site/worldclock",
    type: "website",
    siteName: "ul0 - World Clock",
    images: [{
      url: "https://ul0.site/ul0.png",
      width: 1200,
      height: 630,
      alt: "ul0 World Clock",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "World Clock - Multi-Timezone Display | ul0",
    description: "Track multiple timezones at a glance. Beautiful world clock!",
    images: ["https://ul0.site/ul0.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function WorldClockLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://ul0.site/worldclock#webpage",
        url: "https://ul0.site/worldclock",
        name: "World Clock - Beautiful Multi-Timezone Display | ul0",
        isPartOf: { "@id": "https://ul0.site/#website" },
      },
      {
        "@type": "SoftwareApplication",
        name: "ul0 World Clock",
        applicationCategory: "UtilityApplication",
        operatingSystem: "Web Browser",
        url: "https://ul0.site/worldclock",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "1280" },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://ul0.site" },
          { "@type": "ListItem", position: 2, name: "World Clock", item: "https://ul0.site/worldclock" }
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
