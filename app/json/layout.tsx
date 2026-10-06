import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "JSON Formatter & Validator — Free Online Tool | ul0",
  description: "Format, validate, beautify, and minify JSON data instantly in your browser. Real-time syntax error detection, custom indentation, and zero data logging.",
  alternates: { canonical: "https://ul0.site/json" },
  openGraph: {
    title: "Free JSON Formatter & Validator | ul0",
    description: "Format, validate, and minify JSON instantly in your browser.",
    url: "https://ul0.site/json",
    siteName: "ul0",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free JSON Formatter & Validator | ul0",
    description: "Format, validate, and minify JSON data instantly in your browser with zero data logging.",
  },
}
export default function JsonLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
