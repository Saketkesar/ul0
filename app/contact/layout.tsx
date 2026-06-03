import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Us - ul0 Free URL Shortener Support",
  description: "Contact ul0 support team for help with URL shortening, expense splitting, or any questions. We're here to help you.",
  keywords: [
    "contact ul0",
    "url shortener support",
    "ul0 help",
    "link shortener contact",
    "expense splitter support",
  ],
  alternates: {
    canonical: "https://ul0.site/contact",
  },
  openGraph: {
    title: "Contact Us - ul0 URL Shortener Support",
    description: "Contact ul0 support team for help with URL shortening or expense splitting.",
    url: "https://ul0.site/contact",
    type: "website",
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
