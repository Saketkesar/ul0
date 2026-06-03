import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Free UTM Link Builder - Create UTM Tracking URLs Online | ul0 [2026]",
  description: "Best free UTM link builder 2026. Create UTM tracking URLs for Google Analytics. Campaign URL builder with source, medium, campaign parameters. No signup required!",
  keywords: [
    // Primary Keywords
    "utm builder",
    "utm link builder",
    "utm generator",
    "utm creator",
    "utm tracking",
    "utm parameters",
    "campaign url builder",
    "utm link generator",
    
    // Year-based
    "utm builder 2026",
    "best utm generator 2026",
    "campaign url builder 2026",
    
    // No signup keywords
    "free utm builder",
    "utm generator free",
    "utm builder no signup",
    "free campaign url builder",
    
    // Google Analytics specific
    "google analytics utm builder",
    "google campaign url builder",
    "ga4 utm builder",
    "google analytics tracking url",
    "utm builder for google analytics",
    
    // UTM parameter keywords
    "utm_source generator",
    "utm_medium builder",
    "utm_campaign creator",
    "utm_term builder",
    "utm_content generator",
    "utm tag builder",
    "utm code generator",
    
    // Use case keywords
    "utm link for facebook",
    "utm link for instagram",
    "utm link for email",
    "utm link for ads",
    "utm builder for social media",
    "utm for paid campaigns",
    "utm for email marketing",
    "marketing url builder",
    "campaign tracking link",
    
    // Question keywords
    "how to create utm link",
    "how to add utm parameters",
    "how to track campaign with utm",
    "what is utm code",
    "how to build utm url",
    
    // Competitor alternatives
    "google url builder alternative",
    "campaign url builder free",
    "bitly utm alternative",
    
    // International - Spanish
    "generador utm",
    "creador de enlaces utm",
    "utm builder español",
    
    // International - Portuguese
    "gerador de utm",
    "criador de link utm",
    
    // Long-tail keywords
    "best free utm link builder",
    "simple utm generator",
    "easy utm builder",
    "quick campaign url maker",
    "utm tracking url generator",
    "marketing campaign tracker",
    "attribution link builder",
  ],
  alternates: {
    canonical: "https://ul0.site/utm",
  },
  openGraph: {
    title: "Free UTM Link Builder - Create Tracking URLs | ul0",
    description: "Best free UTM link builder 2026. Create UTM tracking URLs for Google Analytics campaigns. No signup required!",
    url: "https://ul0.site/utm",
    type: "website",
    siteName: "ul0 - Free UTM Builder",
    images: [{
      url: "https://ul0.site/ul0.png",
      width: 1200,
      height: 630,
      alt: "ul0 Free UTM Link Builder",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free UTM Link Builder | ul0",
    description: "Create UTM tracking URLs for Google Analytics. Free UTM link generator 2026.",
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

export default function UtmLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://ul0.site/utm#webpage",
        url: "https://ul0.site/utm",
        name: "Free UTM Link Builder | ul0",
        description: "Best free UTM link builder 2026. Create UTM tracking URLs for Google Analytics.",
        isPartOf: { "@id": "https://ul0.site/#website" },
        breadcrumb: { "@id": "https://ul0.site/utm#breadcrumb" }
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://ul0.site/utm#app",
        name: "ul0 UTM Link Builder",
        description: "Best free UTM link builder. Create campaign tracking URLs for Google Analytics.",
        applicationCategory: "UtilityApplication",
        applicationSubCategory: "UTM Builder",
        operatingSystem: "Web Browser",
        url: "https://ul0.site/utm",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock"
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          ratingCount: "1650",
          bestRating: "5",
          worstRating: "1"
        },
        featureList: [
          "UTM Source Parameter",
          "UTM Medium Parameter",
          "UTM Campaign Parameter",
          "UTM Term Parameter",
          "UTM Content Parameter",
          "Google Analytics Compatible",
          "Copy to Clipboard",
          "No Signup Required"
        ],
      },
      {
        "@type": "HowTo",
        "@id": "https://ul0.site/utm#howto",
        name: "How to Create UTM Tracking Links",
        description: "Create UTM tracking URLs in 4 simple steps",
        totalTime: "PT1M",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Enter Your URL",
            text: "Paste the destination URL you want to track"
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Add Campaign Source",
            text: "Enter the traffic source (google, facebook, newsletter, etc.)"
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Add Campaign Details",
            text: "Fill in medium, campaign name, and optional term/content"
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: "Copy Your URL",
            text: "Copy the generated UTM URL and use it in your campaigns"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://ul0.site/utm#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is a UTM link?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "UTM links are URLs with special parameters (utm_source, utm_medium, utm_campaign) that help track where your website traffic comes from in Google Analytics."
            }
          },
          {
            "@type": "Question",
            name: "Is this UTM builder free?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, ul0 UTM builder is 100% free. Create unlimited UTM tracking URLs without signup or registration."
            }
          },
          {
            "@type": "Question",
            name: "Does this work with Google Analytics 4?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, UTM parameters work with all versions of Google Analytics including GA4. The tracking parameters are automatically detected."
            }
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://ul0.site/utm#breadcrumb",
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
            name: "UTM Builder",
            item: "https://ul0.site/utm"
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
