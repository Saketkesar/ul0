import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Free JSON Formatter & Validator Online - Beautify JSON | ul0 [2026]",
  description: "Best free JSON formatter 2026. Format, validate, beautify & minify JSON online. Pretty print JSON with custom indentation. No signup required! JSONLint alternative.",
  keywords: [
    // Primary Keywords
    "json formatter",
    "json validator",
    "json beautifier",
    "json minifier",
    "format json",
    "json formatter online",
    "json validator online",
    "json beautify",
    
    // Year-based
    "json formatter 2026",
    "best json formatter 2026",
    "json validator 2026",
    
    // No signup keywords
    "free json formatter",
    "json formatter free online",
    "json validator no signup",
    "free json beautifier",
    
    // Competitor alternatives
    "jsonlint alternative",
    "json lint alternative",
    "jsonformatter alternative",
    "codebeautify json alternative",
    
    // Feature keywords
    "pretty print json",
    "json pretty print",
    "json prettify",
    "format json online free",
    "validate json syntax",
    "minify json online",
    "compress json",
    "json viewer",
    "json editor online",
    "json parser",
    
    // Question keywords
    "how to format json",
    "how to validate json",
    "how to beautify json",
    "how to minify json",
    "how to pretty print json",
    
    // Use case keywords
    "json formatter for api",
    "json formatter for developers",
    "json validator for api response",
    "json beautifier for code",
    "format json from api",
    "validate json file",
    "json syntax checker",
    "json error checker",
    
    // International - Spanish
    "formateador json",
    "validador json",
    "formatear json online",
    
    // International - Portuguese
    "formatador json",
    "validar json online",
    "formatear json",
    
    // International - French
    "formateur json",
    "json en ligne",
    
    // International - German
    "json formatieren",
    "json validator online",
    
    // Related keywords
    "json tool",
    "json online",
    "json editor",
    "json checker",
    "json linter",
    "json tidy",
    "json indent",
    "json formatter with line numbers",
    "json formatter copy paste",
    
    // Long-tail keywords
    "best free json formatter online",
    "simple json beautifier",
    "easy json validator",
    "quick json formatter",
    "instant json validator",
    "professional json tool",
  ],
  alternates: {
    canonical: "https://ul0.site/json",
  },
  openGraph: {
    title: "Free JSON Formatter & Validator Online | ul0",
    description: "Best free JSON formatter 2025. Format, validate, beautify JSON online. JSONLint alternative - no signup!",
    url: "https://ul0.site/json",
    type: "website",
    siteName: "ul0 - Free JSON Formatter",
    images: [{
      url: "https://ul0.site/ul0.png",
      width: 1200,
      height: 630,
      alt: "ul0 Free JSON Formatter",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free JSON Formatter Online | ul0",
    description: "Format, validate, and minify JSON online. Free JSON beautifier 2025.",
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

export default function JsonLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://ul0.site/json#webpage",
        url: "https://ul0.site/json",
        name: "Free JSON Formatter & Validator Online | ul0",
        description: "Best free JSON formatter 2025. Format, validate, beautify JSON online.",
        isPartOf: { "@id": "https://ul0.site/#website" },
        breadcrumb: { "@id": "https://ul0.site/json#breadcrumb" }
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://ul0.site/json#app",
        name: "ul0 JSON Formatter",
        description: "Best free JSON formatter and validator. Beautify and minify JSON online.",
        applicationCategory: "DeveloperApplication",
        applicationSubCategory: "JSON Formatter",
        operatingSystem: "Web Browser",
        url: "https://ul0.site/json",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock"
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "2100",
          bestRating: "5",
          worstRating: "1"
        },
        featureList: [
          "JSON Formatting",
          "JSON Validation",
          "JSON Beautification",
          "JSON Minification",
          "Custom Indentation",
          "Syntax Error Detection",
          "Copy to Clipboard",
          "No Signup Required"
        ],
      },
      {
        "@type": "HowTo",
        "@id": "https://ul0.site/json#howto",
        name: "How to Format JSON Online",
        description: "Format and validate JSON in 3 simple steps",
        totalTime: "PT30S",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Paste JSON",
            text: "Paste your JSON data into the input field"
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Format",
            text: "Click Format to beautify or Minify to compress your JSON"
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Copy Result",
            text: "Copy the formatted JSON to use in your project"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://ul0.site/json#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "Is this JSON formatter free?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, ul0 JSON formatter is 100% free. Format, validate, and minify unlimited JSON without signup."
            }
          },
          {
            "@type": "Question",
            name: "Does it validate JSON syntax?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, our JSON validator checks for syntax errors and shows you exactly where the error is in your JSON."
            }
          },
          {
            "@type": "Question",
            name: "Is my JSON data secure?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, all JSON formatting happens in your browser. Your data is never sent to our servers."
            }
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://ul0.site/json#breadcrumb",
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
            name: "JSON Formatter",
            item: "https://ul0.site/json"
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
