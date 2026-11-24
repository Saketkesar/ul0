import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Split Bills Over UPI — Free, No App",
  description:
    "Split group bills instantly. Friends pay via Google Pay, PhonePe, or Paytm from a link. No app install, no signup for friends. Free forever.",
  icons: {
    icon: "/ul0split-logo-dark.png",
    shortcut: "/ul0split-logo-dark.png",
    apple: "/ul0split-logo-dark.png",
  },
  keywords: [
    "split bills upi",
    "splitwise alternative free",
    "split expenses online",
    "upi bill splitter",
    "split bills with friends",
    "group expense splitter free",
    "split restaurant bill gst",
    "roommate expense calculator",
  ],
  alternates: { canonical: "https://ul0.site/split" },
  openGraph: {
    title: "Split Bills Over UPI — Free, No App | UL0",
    description:
      "Split group bills instantly. Friends pay from Google Pay, PhonePe, or Paytm via a link. No app install. Free forever.",
    url: "https://ul0.site/split",
    siteName: "UL0",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Split Bills Over UPI — Free, No App | UL0",
    description:
      "Split group bills instantly. Friends pay via UPI from a link. No app install, no signup for friends.",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "UL0 Split",
      "url": "https://ul0.site/split",
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR"
      },
      "description": "Free online UPI bill splitter. Split restaurant receipts, rent, and trips over Google Pay, PhonePe, and Paytm with zero app install for friends."
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Is UL0 Split free to use?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, 100% free forever. There are no transaction fees, daily expense limits, or subscription paywalls."
          }
        },
        {
          "@type": "Question",
          "name": "Do my friends need to install an app or create an account?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. Friends simply click the shared link in WhatsApp or scan your QR code. They do not need to sign up, enter payment details, or download anything."
          }
        },
        {
          "@type": "Question",
          "name": "Does UL0 hold or touch any money?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Never. UL0 provides direct NPCI UPI deep links and QR codes. Funds transfer directly from your friend's bank account into yours. We never custody funds."
          }
        },
        {
          "@type": "Question",
          "name": "Which payment apps are supported?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "All major UPI applications are supported: Google Pay, PhonePe, Paytm, CRED, BHIM, and any bank UPI app."
          }
        },
        {
          "@type": "Question",
          "name": "How does itemized splitting distribute taxes and tips?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Taxes (GST), service charges, and tips are distributed proportionally according to each friend's order subtotal using the largest-remainder method, ensuring total shares sum to the exact paise."
          }
        }
      ]
    }
  ]
}

export default function SplitLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
