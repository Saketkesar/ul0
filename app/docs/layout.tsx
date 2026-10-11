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
export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
