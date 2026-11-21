import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Split Bills Over UPI — Free, No App | UL0",
  description:
    "Split group bills instantly. Friends pay via Google Pay, PhonePe, or Paytm from a link. No app install, no signup for friends. Free forever.",
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

export default function SplitLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
