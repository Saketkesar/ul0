import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Free QR Code Generator Online - Create QR Codes Instantly | ul0 [2026]",
  description: "Best free QR code generator 2026. Create QR codes for URLs, WiFi, text, email, phone instantly. No signup required. Download high-quality PNG. Better than QR Code Monkey!",
  keywords: [
    // Primary QR Keywords
    "qr code generator",
    "free qr code generator",
    "qr code maker",
    "create qr code",
    "qr code creator",
    "generate qr code",
    "make qr code",
    "qr code online",
    "qr code free",
    
    // Year-based
    "best qr code generator 2026",
    "free qr code generator 2026",
    "qr code maker 2026",
    
    // No signup keywords
    "qr code generator no signup",
    "free qr code no registration",
    "qr code maker without login",
    "anonymous qr code generator",
    
    // Competitor alternatives
    "qr code monkey alternative",
    "qrcode generator alternative",
    "flowcode alternative",
    "beaconstac alternative",
    "qr tiger alternative",
    
    // Type-specific keywords
    "url qr code generator",
    "website qr code generator",
    "link to qr code",
    "url to qr code free",
    "wifi qr code generator",
    "wifi qr code free",
    "email qr code generator",
    "phone qr code generator",
    "sms qr code generator",
    "text qr code generator",
    "vcard qr code generator",
    
    // Use case keywords
    "qr code for business card",
    "qr code for menu",
    "qr code for restaurant",
    "qr code for marketing",
    "qr code for flyer",
    "qr code for poster",
    "qr code for event",
    "qr code for instagram",
    "qr code for youtube",
    "qr code for website link",
    
    // Question keywords
    "how to create qr code",
    "how to make qr code free",
    "how to generate qr code",
    "how to create qr code for link",
    "how to make qr code for website",
    
    // Feature keywords
    "custom qr code generator",
    "qr code with logo",
    "high resolution qr code",
    "png qr code download",
    "qr code download free",
    "dynamic qr code free",
    "static qr code generator",
    "bulk qr code generator",
    
    // International - Spanish
    "generador de qr",
    "crear codigo qr gratis",
    "generador de codigo qr",
    
    // International - Portuguese
    "gerador de qr code",
    "criar qr code gratis",
    "gerador de codigo qr",
    
    // International - French
    "générateur qr code gratuit",
    "créer qr code",
    
    // International - German
    "qr code erstellen kostenlos",
    "qr code generator kostenlos",
    
    // Long-tail keywords
    "best free qr code generator online",
    "qr code generator free unlimited",
    "instant qr code generator",
    "simple qr code maker",
    "easy qr code generator",
    "quick qr code creator",
    "professional qr code generator",
  ],
  alternates: {
    canonical: "https://ul0.site/qr",
  },
  openGraph: {
    title: "Free QR Code Generator - Create QR Codes Instantly | ul0",
    description: "Best free QR code generator 2025. Create QR codes for URLs, WiFi, email, phone instantly. No signup required.",
    url: "https://ul0.site/qr",
    type: "website",
    siteName: "ul0 - Free QR Code Generator",
    images: [{
      url: "https://ul0.site/ul0.png",
      width: 1200,
      height: 630,
      alt: "ul0 Free QR Code Generator",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free QR Code Generator - Create QR Codes Instantly | ul0",
    description: "Best free QR code generator 2025. No signup required!",
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

export default function QRCodeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://ul0.site/qr#webpage",
        url: "https://ul0.site/qr",
        name: "Free QR Code Generator Online - Create QR Codes Instantly | ul0",
        description: "Best free QR code generator 2025. Create QR codes for URLs, WiFi, text, email, phone instantly.",
        isPartOf: { "@id": "https://ul0.site/#website" },
        breadcrumb: { "@id": "https://ul0.site/qr#breadcrumb" }
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://ul0.site/qr#app",
        name: "ul0 QR Code Generator",
        description: "Best free QR code generator 2025. Create QR codes instantly without signup.",
        applicationCategory: "UtilityApplication",
        applicationSubCategory: "QR Code Generator",
        operatingSystem: "Web Browser",
        url: "https://ul0.site/qr",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock"
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "3250",
          bestRating: "5",
          worstRating: "1"
        },
        featureList: [
          "URL QR Code",
          "WiFi QR Code",
          "Email QR Code",
          "Phone QR Code",
          "SMS QR Code",
          "Text QR Code",
          "High Quality PNG Download",
          "No Signup Required",
          "Unlimited QR Codes"
        ],
      },
      {
        "@type": "HowTo",
        "@id": "https://ul0.site/qr#howto",
        name: "How to Create a QR Code for Free",
        description: "Create free QR codes in 3 simple steps",
        totalTime: "PT30S",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Choose QR Type",
            text: "Select the type of QR code you want: URL, WiFi, Email, Phone, or Text"
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Enter Information",
            text: "Enter the URL, WiFi details, or other information you want to encode"
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Generate and Download",
            text: "Click Generate and download your QR code as a high-quality PNG"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://ul0.site/qr#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "Is this QR code generator free?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, ul0 QR code generator is 100% free with no limits. Create unlimited QR codes without signup."
            }
          },
          {
            "@type": "Question",
            name: "What types of QR codes can I create?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You can create QR codes for URLs/websites, WiFi networks, email addresses, phone numbers, SMS messages, and plain text."
            }
          },
          {
            "@type": "Question",
            name: "Do I need to sign up to create QR codes?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No signup or registration required. Just enter your information and generate QR codes instantly."
            }
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://ul0.site/qr#breadcrumb",
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
            name: "QR Code Generator",
            item: "https://ul0.site/qr"
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
