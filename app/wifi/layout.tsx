import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Free WiFi QR Code Generator - Share WiFi Password Instantly | ul0 [2026]",
  description: "Best free WiFi QR code generator 2026. Create WiFi QR codes to share password with guests instantly. Perfect for homes, restaurants, hotels, cafes, offices. No signup!",
  keywords: [
    // Primary Keywords
    "wifi qr code generator",
    "wifi qr code",
    "share wifi password",
    "wifi password qr code",
    "create wifi qr code",
    "wifi qr",
    "wifi qr code maker",
    "wifi password share",
    
    // Year-based
    "wifi qr code generator 2026",
    "best wifi qr generator 2026",
    
    // No signup keywords
    "wifi qr code free",
    "wifi qr code no signup",
    "free wifi qr generator",
    "wifi qr code online free",
    
    // Use case keywords
    "restaurant wifi qr code",
    "hotel wifi qr code",
    "cafe wifi qr code",
    "office wifi qr code",
    "airbnb wifi qr code",
    "guest wifi qr code",
    "home wifi qr code",
    "business wifi qr code",
    "event wifi qr code",
    "shop wifi qr code",
    
    // Question keywords
    "how to create wifi qr code",
    "how to share wifi with qr code",
    "how to make wifi qr code",
    "how to generate wifi qr",
    "how to share wifi password qr",
    
    // Feature keywords
    "wifi qr code wpa2",
    "wifi qr code wpa3",
    "hidden wifi qr code",
    "wifi qr code png download",
    "wifi qr code print",
    "wifi qr code sticker",
    
    // International - Spanish
    "codigo qr wifi",
    "compartir wifi qr",
    "generador qr wifi",
    
    // International - Portuguese
    "qr code wifi",
    "compartilhar wifi qr",
    "gerador qr wifi",
    
    // International - French
    "qr code wifi gratuit",
    "partager wifi qr",
    
    // International - German
    "wlan qr code erstellen",
    "wifi qr code kostenlos",
    
    // Related keywords
    "wifi sharing app",
    "share wifi without password",
    "wifi connect qr",
    "scan to connect wifi",
    "instant wifi connection",
    "touchless wifi sharing",
    "contactless wifi",
    "wifi access qr",
    
    // Long-tail keywords
    "best wifi qr code generator free",
    "simple wifi qr maker",
    "easy wifi qr code",
    "quick wifi qr generator",
    "printable wifi qr code",
    "wifi qr code for poster",
    "wifi qr code for menu",
  ],
  alternates: {
    canonical: "https://ul0.site/wifi",
  },
  openGraph: {
    title: "Free WiFi QR Code Generator - Share WiFi Password | ul0",
    description: "Best free WiFi QR code generator 2025. Let guests scan and connect instantly. No signup required!",
    url: "https://ul0.site/wifi",
    type: "website",
    siteName: "ul0 - Free WiFi QR Generator",
    images: [{
      url: "https://ul0.site/ul0.png",
      width: 1200,
      height: 630,
      alt: "ul0 Free WiFi QR Code Generator",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free WiFi QR Code Generator | ul0",
    description: "Share WiFi password with QR code. Guests scan and connect instantly!",
    images: ["https://ul0.site/ul0.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function WifiLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://ul0.site/wifi#webpage",
        url: "https://ul0.site/wifi",
        name: "Free WiFi QR Code Generator | ul0",
        description: "Best free WiFi QR code generator. Share WiFi password with guests instantly.",
        isPartOf: { "@id": "https://ul0.site/#website" },
        breadcrumb: { "@id": "https://ul0.site/wifi#breadcrumb" }
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://ul0.site/wifi#app",
        name: "ul0 WiFi QR Code Generator",
        description: "Best free WiFi QR code generator 2025. Create WiFi sharing QR codes instantly.",
        applicationCategory: "UtilityApplication",
        applicationSubCategory: "WiFi QR Code Generator",
        operatingSystem: "Web Browser",
        url: "https://ul0.site/wifi",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock"
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "2420",
          bestRating: "5",
          worstRating: "1"
        },
        featureList: [
          "WiFi QR Code Generation",
          "WPA/WPA2/WPA3 Support",
          "Hidden Network Support",
          "High Quality PNG Download",
          "Instant Guest Connection",
          "No Signup Required",
          "Print-Ready QR Codes"
        ],
      },
      {
        "@type": "HowTo",
        "@id": "https://ul0.site/wifi#howto",
        name: "How to Create a WiFi QR Code",
        description: "Create WiFi QR codes in 3 simple steps",
        totalTime: "PT30S",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Enter WiFi Details",
            text: "Enter your WiFi network name (SSID) and password"
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Select Encryption",
            text: "Choose your WiFi security type (WPA/WPA2/WPA3)"
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Generate & Download",
            text: "Click Generate and download your WiFi QR code"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://ul0.site/wifi#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "Is this WiFi QR generator free?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, ul0 WiFi QR code generator is 100% free. Create unlimited WiFi QR codes without signup."
            }
          },
          {
            "@type": "Question",
            name: "How do guests connect using the QR code?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Guests simply scan the QR code with their phone camera. They'll be prompted to connect to your WiFi automatically - no typing passwords!"
            }
          },
          {
            "@type": "Question",
            name: "Is my WiFi password safe?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Your WiFi password is encoded in the QR code but never stored on our servers. The QR is generated entirely in your browser."
            }
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://ul0.site/wifi#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://ul0.site"
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "WiFi QR Code",
            item: "https://ul0.site/wifi"
          }
        ]
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  )
}
