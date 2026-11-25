import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Free WhatsApp Link Generator with Pre-filled Message & QR Code",
  description:
    "Generate instant wa.me click-to-chat links with custom pre-filled messages, trackable short URLs, and high-res vector QR codes. Free, instant, no signup required.",
  keywords: [
    "whatsapp link generator",
    "wa.me link generator",
    "whatsapp click to chat link",
    "whatsapp link with message",
    "whatsapp qr code generator",
    "create whatsapp link",
    "short whatsapp link",
  ],
  alternates: {
    canonical: "https://ul0.site/whatsapp",
  },
  openGraph: {
    title: "Free WhatsApp Link Generator & QR Code Studio | UL0",
    description:
      "Create direct WhatsApp chat links with pre-filled messages, trackable short URLs, and vector QR codes.",
    url: "https://ul0.site/whatsapp",
    siteName: "UL0",
    type: "website",
    images: [
      {
        url: "https://ul0.site/whatsapp-social-card.png",
        width: 1200,
        height: 630,
        alt: "Free WhatsApp Link Generator & QR Code Studio | UL0",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free WhatsApp Link Generator with Message & QR Code | UL0",
    description:
      "Generate instant wa.me click-to-chat links with custom messages and trackable QR codes.",
    images: ["https://ul0.site/whatsapp-social-card.png"],
  },
}

const whatsappSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "UL0 WhatsApp Link & QR Code Generator",
      url: "https://ul0.site/whatsapp",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "All",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://ul0.site" },
        { "@type": "ListItem", position: 2, name: "WhatsApp Link Generator", item: "https://ul0.site/whatsapp" },
      ],
    },
  ],
}

export default function WhatsAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(whatsappSchema) }}
      />
      {children}
    </>
  )
}
