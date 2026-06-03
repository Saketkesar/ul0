import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Free Bill Splitter & Expense Calculator - Split Expenses Online | ul0 [2026]",
  description: "Best free bill splitter 2026. Split expenses with friends easily. Supports UPI, PayPal, Venmo, Cash App, PIX & more. Calculate who owes what. Splitwise alternative - no signup!",
  keywords: [
    // Primary Keywords
    "bill splitter",
    "expense splitter",
    "split expenses",
    "split bill",
    "expense calculator",
    "bill split calculator",
    "split expenses online",
    "free bill splitter",
    
    // Year-based
    "best bill splitter 2026",
    "expense splitter 2026",
    "split expenses app 2026",
    
    // Competitor alternatives
    "splitwise alternative",
    "splitwise alternative free",
    "tricount alternative",
    "settle up alternative",
    "splid alternative",
    "billr alternative",
    
    // No signup keywords
    "bill splitter no signup",
    "expense splitter no account",
    "split bill without app",
    "expense calculator no login",
    
    // Payment method keywords
    "upi bill splitter",
    "paypal expense splitter",
    "venmo bill split",
    "cash app split expenses",
    "pix expense splitter",
    "wise bill splitter",
    "revolut expense split",
    
    // Use case keywords
    "split restaurant bill",
    "split trip expenses",
    "split vacation expenses",
    "split rent with roommates",
    "split grocery bill",
    "split dinner bill",
    "split hotel bill",
    "split uber fare",
    "group expense tracker",
    "roommate expense tracker",
    "travel expense splitter",
    
    // Question keywords
    "how to split expenses",
    "how to split bill equally",
    "how to split expenses with friends",
    "who owes who calculator",
    "how to calculate expense split",
    
    // Feature keywords
    "expense splitter with qr code",
    "bill splitter with upi",
    "shareable expense link",
    "expense splitter pdf",
    "group expense calculator",
    
    // International - Spanish
    "dividir gastos",
    "calculadora de gastos",
    "dividir cuenta",
    
    // International - Portuguese
    "dividir despesas",
    "rachar conta",
    "calculadora de despesas",
    
    // International - Hindi
    "bill splitter india",
    "upi expense splitter",
    "split karo",
    
    // International - Indonesian
    "bagi tagihan",
    "kalkulator pengeluaran",
    
    // Country-specific
    "split expenses india",
    "split expenses usa",
    "split expenses uk",
    "split expenses brazil",
    "split expenses europe",
    "split expenses philippines",
    "split expenses singapore",
    
    // Long-tail keywords
    "free online bill splitter",
    "instant expense calculator",
    "simple bill split",
    "easy expense splitter",
    "quick bill calculator",
    "best free expense splitter",
    "multi currency expense splitter",
  ],
  alternates: {
    canonical: "https://ul0.site/split",
  },
  openGraph: {
    title: "Free Bill Splitter & Expense Calculator | ul0",
    description: "Best free bill splitter 2025. Split expenses with UPI, PayPal, Venmo, Cash App & more. No signup required!",
    url: "https://ul0.site/split",
    type: "website",
    siteName: "ul0 - Free Bill Splitter",
    images: [{
      url: "https://ul0.site/ul0.png",
      width: 1200,
      height: 630,
      alt: "ul0 Free Bill Splitter",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Bill Splitter - Split Expenses Online | ul0",
    description: "Best free bill splitter 2025. Split expenses with friends easily!",
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

export default function SplitLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // JSON-LD Schema for Split Expenses
  const splitPageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://ul0.site/split#webpage",
        url: "https://ul0.site/split",
        name: "Free Bill Splitter & Expense Calculator | ul0",
        description: "Best free bill splitter 2025. Split expenses with UPI, PayPal, Venmo, Cash App & more.",
        isPartOf: { "@id": "https://ul0.site/#website" },
        breadcrumb: { "@id": "https://ul0.site/split#breadcrumb" }
      },
      {
        "@type": "HowTo",
        "@id": "https://ul0.site/split#howto",
        name: "How to Split Expenses with Friends",
        description: "Split bills and expenses with friends using UPI, PayPal, Venmo, or any payment method.",
        totalTime: "PT2M",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Add Group Members",
            text: "Enter names of everyone in the group. Add payment IDs (UPI, PayPal, Venmo, etc.) for easy settlements.",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Add Expenses",
            text: "Enter each expense with amount and who paid. Split equally or set custom amounts.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Share & Settle",
            text: "Share the link with friends. Pay directly via QR code or payment links.",
          },
        ],
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://ul0.site/split#app",
        name: "ul0 Bill Splitter",
        description: "Best free bill splitter 2025. Split expenses with 11+ payment methods worldwide.",
        applicationCategory: "FinanceApplication",
        applicationSubCategory: "Expense Splitter",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock"
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "1850",
          bestRating: "5",
          worstRating: "1"
        },
        featureList: [
          "Split expenses equally or custom",
          "11+ Payment Methods (UPI, PayPal, Venmo, Cash App, PIX, Wise, Revolut, GCash, GrabPay, Paytm)",
          "QR code payment generation",
          "Shareable expense links",
          "PDF download",
          "Multi-currency support",
          "No signup required"
        ],
      },
      {
        "@type": "FAQPage",
        "@id": "https://ul0.site/split#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "Is this bill splitter free?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, ul0 bill splitter is 100% free. Split unlimited expenses without signup or hidden fees."
            }
          },
          {
            "@type": "Question",
            name: "What payment methods are supported?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "ul0 supports 11+ payment methods: UPI (India), PayPal (Global), Venmo (USA), Cash App (USA/UK), PIX (Brazil), Wise (Global), Revolut (EU/UK/US), GCash (Philippines), GrabPay (Southeast Asia), Paytm (India), and bank transfers."
            }
          },
          {
            "@type": "Question",
            name: "Is this better than Splitwise?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "ul0 offers all essential Splitwise features for free - expense splitting, shareable links, and payment QR codes. No app download or account required."
            }
          },
          {
            "@type": "Question",
            name: "Can I share expense splits with friends?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes! Create a shareable link that friends can view on any device. They can see all expenses and settle payments directly."
            }
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://ul0.site/split#breadcrumb",
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
            name: "Split Expenses",
            item: "https://ul0.site/split"
          }
        ]
      }
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(splitPageSchema) }}
      />
      {children}
    </>
  )
}
