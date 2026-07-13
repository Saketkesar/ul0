import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Developer API Reference — URL Shortening API | ul0.site",
  description: "Integrate ul0.site's link shortening API into your app. Full REST API docs with cURL, Node.js, Python, and Go examples. Authentication, rate limits, and error codes included.",
  keywords: ["URL shortener API", "link shortening API", "branded short link API", "custom domain API", "URL shortener developer docs"],
  alternates: { canonical: "https://ul0.site/docs" },
  openGraph: { title: "URL Shortening API Docs | ul0.site", description: "Build branded short links programmatically with the ul0.site REST API.", url: "https://ul0.site/docs", siteName: "ul0.site", type: "website" },
}
export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
