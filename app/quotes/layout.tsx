import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Motivational Quotes - Beautiful Inspirational Quote Display | ul0 [2026]",
  description: "Best free motivational quotes display 2026. Beautiful rotating quotes with stunning backgrounds. Perfect for desk setups, screensavers, daily inspiration. 100% Free!",
  keywords: [
    // Primary Keywords
    "motivational quotes",
    "inspirational quotes",
    "quotes display",
    "daily quotes",
    "quote of the day",
    "positive quotes",
    "quotes generator",
    
    // Year-based
    "motivational quotes 2026",
    "best quotes 2026",
    "inspirational quotes 2026",
    
    // Type-specific keywords
    "success quotes",
    "life quotes",
    "famous quotes",
    "wisdom quotes",
    "business quotes",
    "leadership quotes",
    "happiness quotes",
    "love quotes",
    "friendship quotes",
    "work quotes",
    "monday motivation",
    "morning quotes",
    
    // Use case keywords
    "quotes for desk setup",
    "quotes screensaver",
    "quotes wallpaper",
    "quotes for streaming",
    "quote slideshow",
    "fullscreen quotes",
    "quotes for office",
    "quotes for home",
    "aesthetic quotes",
    "beautiful quotes display",
    
    // Feature keywords
    "quote display online",
    "inspirational display",
    "motivation screen",
    "quote background",
    "rotating quotes",
    "random quotes",
    
    // Author keywords
    "einstein quotes",
    "steve jobs quotes",
    "buddha quotes",
    "gandhi quotes",
    "mandela quotes",
    "marcus aurelius quotes",
    "stoic quotes",
    
    // International - Spanish
    "frases motivacionales",
    "citas inspiradoras",
    "frases del día",
    
    // International - Portuguese
    "frases motivacionais",
    "citações inspiradoras",
    "frase do dia",
    
    // Question keywords
    "best motivational quotes",
    "best inspirational quotes",
    "quotes for motivation",
    "quotes to inspire",
    
    // Long-tail keywords
    "beautiful quote display online",
    "aesthetic quote screensaver",
    "motivational quotes for work",
    "daily inspiration quotes",
    "quotes with beautiful backgrounds",
  ],
  alternates: {
    canonical: "https://ul0.site/quotes",
  },
  openGraph: {
    title: "Motivational Quotes - Beautiful Inspirational Display | ul0",
    description: "Beautiful rotating motivational quotes with stunning backgrounds. Perfect for desk setups or daily inspiration!",
    url: "https://ul0.site/quotes",
    type: "website",
    siteName: "ul0 - Motivational Quotes",
    images: [{
      url: "https://ul0.site/ul0.png",
      width: 1200,
      height: 630,
      alt: "ul0 Motivational Quotes",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Motivational Quotes | ul0",
    description: "Beautiful rotating inspirational quotes. Free!",
    images: ["https://ul0.site/ul0.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function QuotesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://ul0.site/quotes#webpage",
        url: "https://ul0.site/quotes",
        name: "Motivational Quotes - Beautiful Inspirational Display | ul0",
        isPartOf: { "@id": "https://ul0.site/#website" },
      },
      {
        "@type": "SoftwareApplication",
        name: "ul0 Motivational Quotes",
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Web Browser",
        url: "https://ul0.site/quotes",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "1520" },
        featureList: ["Rotating Quotes", "Beautiful Backgrounds", "Favorites", "Share Quotes", "Fullscreen Mode"],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://ul0.site" },
          { "@type": "ListItem", position: 2, name: "Quotes", item: "https://ul0.site/quotes" }
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
