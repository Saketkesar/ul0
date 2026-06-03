import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Compare Anything with AI (Side-by-Side Product Comparison) | ul0",
  description: "Compare phones, laptops, AI tools, frameworks, websites, YouTube videos, SaaS products, hosting providers, and more side-by-side using advanced AI comparison analysis. Get overall winner, performance scores, and verdicts.",
  alternates: {
    canonical: "https://ul0.site/compare",
  },
  openGraph: {
    title: "Compare Anything with AI (Side-by-Side Product Comparison) | ul0",
    description: "Compare phones, laptops, AI tools, frameworks, websites, YouTube videos, SaaS products, hosting providers, and more side-by-side using advanced AI comparison analysis.",
    url: "https://ul0.site/compare",
    type: "website",
    siteName: "ul0 - Free URL Shortener",
  }
}

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
