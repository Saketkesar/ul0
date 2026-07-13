import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "JSON Formatter & Validator — Free Online Tool | ul0.site",
  description: "Format, validate, and beautify JSON data instantly in your browser. Free JSON formatter with syntax highlighting and error detection. No signup required.",
  keywords: ["JSON formatter", "JSON validator online", "beautify JSON", "JSON pretty print", "JSON viewer free"],
  alternates: { canonical: "https://ul0.site/json" },
  openGraph: { title: "Free JSON Formatter & Validator | ul0.site", description: "Format and validate JSON instantly in your browser.", url: "https://ul0.site/json", siteName: "ul0.site", type: "website" },
}
export default function JsonLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
