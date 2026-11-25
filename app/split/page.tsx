import type { Metadata } from "next"
import { LandingBoldTheme } from "@/components/split/landing-bold-theme"

export const metadata: Metadata = {
  title: "Free Splitwise Alternative for India: Split Bills over UPI",
  description:
    "Split bills instantly over UPI. Friends pay from Google Pay, PhonePe, or Paytm with zero app install and zero signup. Direct bank-to-bank.",
  alternates: {
    canonical: "https://ul0.site/split",
  },
  openGraph: {
    title: "Free Splitwise Alternative for India: Split Bills over UPI | UL0",
    description:
      "Split bills instantly over UPI. Friends pay from Google Pay, PhonePe, or Paytm with zero app install and zero signup. Direct bank-to-bank.",
    url: "https://ul0.site/split",
    siteName: "UL0 Split",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "https://ul0.site/social-card.png",
        width: 1376,
        height: 768,
        alt: "UL0 Split — Split Bills Over UPI Free",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Splitwise Alternative for India: Split Bills over UPI | UL0",
    description:
      "Split bills instantly over UPI. Friends pay from Google Pay, PhonePe, or Paytm with zero app install and zero signup. Direct bank-to-bank.",
    images: ["https://ul0.site/social-card.png"],
  },
}

export default function SplitPage() {
  return <LandingBoldTheme />
}
