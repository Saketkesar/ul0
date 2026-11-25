import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "URL Shortener REST API Documentation",
  description: "Integrate UL0 link shortening API into your app. Full REST API docs with cURL, Node.js, Python, and Go examples. Authentication, rate limits, and error codes included.",
  keywords: ["URL shortener API", "link shortening API", "branded short link API", "custom domain API", "URL shortener developer docs"],
  alternates: { canonical: "https://ul0.site/docs" },
  openGraph: {
    title: "URL Shortener REST API Documentation | UL0",
    description: "Build branded short links programmatically with the UL0 REST API.",
    url: "https://ul0.site/docs",
    siteName: "UL0",
    type: "website",
    images: [{
      url: "https://ul0.site/social-card.png",
      width: 1376,
      height: 768,
      alt: "UL0 REST API Documentation",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "URL Shortener REST API Documentation | UL0",
    description: "Build branded short links programmatically with the UL0 REST API.",
    images: ["https://ul0.site/social-card.png"],
  },
}
const docsSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      headline: "UL0 URL Shortener REST API Documentation",
      url: "https://ul0.site/docs",
      description:
        "Complete REST API reference for shortening links, managing custom domains, and querying click analytics.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://ul0.site" },
        { "@type": "ListItem", position: 2, name: "API Docs", item: "https://ul0.site/docs" },
      ],
    },
  ],
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(docsSchema) }}
      />
      {children}
    </>
  )
}
