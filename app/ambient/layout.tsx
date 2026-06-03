import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Ambient Sounds - Mix Relaxing Sounds for Focus, Study & Sleep | ul0 [2026]",
  description: "Best free ambient sound mixer 2026. Combine rain, café, ocean, fireplace, lo-fi and more. Perfect for studying, working, sleeping. Noisli alternative - 100% free!",
  keywords: [
    // Primary Keywords
    "ambient sounds",
    "ambient mixer",
    "background sounds",
    "focus sounds",
    "study sounds",
    "relaxing sounds",
    "white noise",
    
    // Year-based
    "ambient sounds 2026",
    "best ambient mixer 2026",
    "study sounds 2026",
    
    // Competitor alternatives
    "noisli alternative",
    "noisli alternative free",
    "coffitivity alternative",
    "mynoise alternative",
    "brain.fm alternative",
    
    // Sound types
    "rain sounds",
    "cafe sounds",
    "coffee shop sounds",
    "ocean sounds",
    "fireplace sounds",
    "thunder sounds",
    "forest sounds",
    "wind sounds",
    "lo-fi sounds",
    "nature sounds",
    "water sounds",
    "birds sounds",
    
    // Use case keywords
    "sounds for studying",
    "sounds for focus",
    "sounds for concentration",
    "sounds for sleep",
    "sounds for relaxation",
    "sounds for work",
    "sounds for meditation",
    "sounds for coding",
    "sounds for writing",
    "sounds for reading",
    "background noise for work",
    "white noise for sleep",
    
    // Feature keywords
    "sound mixer online",
    "ambient sound generator",
    "custom sound mixer",
    "mix background sounds",
    "productivity sounds",
    "focus music",
    "study music",
    "concentration music",
    
    // International - Spanish
    "sonidos ambientales",
    "sonidos para estudiar",
    "sonidos relajantes",
    
    // International - Portuguese
    "sons ambientes",
    "sons para estudar",
    "sons relaxantes",
    
    // Question keywords
    "best sounds for studying",
    "best background noise for focus",
    "sounds to help concentrate",
    "sounds to help sleep",
    
    // Long-tail keywords
    "free ambient sound mixer online",
    "customizable background sounds",
    "best focus sounds online",
    "mix rain and cafe sounds",
    "combine nature sounds",
  ],
  alternates: {
    canonical: "https://ul0.site/ambient",
  },
  openGraph: {
    title: "Ambient Sounds - Mix Relaxing Sounds for Focus & Sleep | ul0",
    description: "Best free ambient sound mixer 2025. Combine rain, café, ocean, lo-fi for studying or relaxing. Noisli alternative!",
    url: "https://ul0.site/ambient",
    type: "website",
    siteName: "ul0 - Ambient Sounds",
    images: [{
      url: "https://ul0.site/ul0.png",
      width: 1200,
      height: 630,
      alt: "ul0 Ambient Sounds",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ambient Sounds - Focus & Relaxation | ul0",
    description: "Mix relaxing sounds for studying, working, or sleeping. Free!",
    images: ["https://ul0.site/ul0.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function AmbientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://ul0.site/ambient#webpage",
        url: "https://ul0.site/ambient",
        name: "Ambient Sounds - Mix Relaxing Sounds | ul0",
        isPartOf: { "@id": "https://ul0.site/#website" },
      },
      {
        "@type": "SoftwareApplication",
        name: "ul0 Ambient Sounds",
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Web Browser",
        url: "https://ul0.site/ambient",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "1680" },
        featureList: ["Rain Sounds", "Café Sounds", "Ocean Waves", "Fireplace", "Thunder", "Lo-fi", "Custom Mixing"],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What ambient sounds help with focus?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Rain sounds, café ambiance, and lo-fi music are popular choices for focus. Our mixer lets you combine multiple sounds for your perfect focus environment."
            }
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://ul0.site" },
          { "@type": "ListItem", position: 2, name: "Ambient Sounds", item: "https://ul0.site/ambient" }
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
