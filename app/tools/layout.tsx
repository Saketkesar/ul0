import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Free Web, SEO, QR & PDF Utilities Suite",
  description:
    "12+ free privacy-first tools built by UL0: HTTP redirect checker, URL expander, OpenGraph previewer, meta tag generator, PDF splitter, QR studio, UTM builder, and WhatsApp link maker.",
  keywords: [
    "free seo tools",
    "redirect checker",
    "url expander",
    "opengraph previewer",
    "meta tag generator",
    "free pdf splitter",
    "qr code generator",
    "utm builder",
    "whatsapp link generator",
  ],
  alternates: {
    canonical: "https://ul0.site/tools",
  },
  openGraph: {
    title: "Free Web, SEO, QR & PDF Utilities Suite | UL0",
    description:
      "Fast browser utilities for marketers and developers: redirect checker, URL expander, OG previewer, PDF splitter, QR generator, and UTM builder.",
    url: "https://ul0.site/tools",
    siteName: "UL0",
    type: "website",
    images: [
      {
        url: "https://ul0.site/social-card.png",
        width: 1376,
        height: 768,
        alt: "UL0 Free Web & SEO Tools Suite",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Web, SEO, QR & PDF Utilities Suite | UL0",
    description:
      "12+ free browser utilities: redirect checker, URL unshortener, meta tag builder, PDF splitter, QR codes & UTM tags.",
    images: ["https://ul0.site/social-card.png"],
  },
}

const toolsSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      name: "UL0 Free Web, SEO & Productivity Tools",
      url: "https://ul0.site/tools",
      description:
        "Suite of free browser utilities for link management, SEO inspection, QR code generation, and client-side PDF workflows.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://ul0.site" },
        { "@type": "ListItem", position: 2, name: "Tools", item: "https://ul0.site/tools" },
      ],
    },
  ],
}

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolsSchema) }}
      />
      {children}
    </>
  )
}
