import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Free Expense Splitter & Splitwise Alternative Online (No App Needed) | UL0",
  description: "Split group expenses, dinners, trips, and roommate bills online instantly. 100% free alternative to Splitwise without app downloads, daily limits, or wait timers. Supports UPI QR codes & instant payment links.",
  keywords: [
    "splitwise alternative online",
    "free splitwise alternative no app",
    "expense splitter online free",
    "split bills with friends online",
    "roommate expense calculator",
    "trip bill splitter",
    "splitwise alternative without account",
    "upi bill splitter",
    "group cost calculator",
  ],
  alternates: { canonical: "https://ul0.site/split" },
  openGraph: {
    title: "Free Expense Splitter & Splitwise Alternative Online | UL0",
    description: "Split group bills and expenses instantly online without downloading an app. Zero paywalls, instant UPI QR settlements.",
    url: "https://ul0.site/split",
    siteName: "UL0",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Expense Splitter & Splitwise Alternative Online | UL0",
    description: "Split group bills and expenses instantly online without downloading an app. Zero paywalls, instant UPI QR settlements.",
  },
}
export default function SplitLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
