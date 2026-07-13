import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Countdown Timer — Free Online Countdown | ul0.site",
  description: "Set a free countdown timer for any event, deadline, or launch. Shareable countdown links with real-time updates. No signup required.",
  keywords: ["countdown timer online", "event countdown", "deadline timer", "launch countdown", "free timer tool"],
  alternates: { canonical: "https://ul0.site/countdown" },
  openGraph: { title: "Free Countdown Timer | ul0.site", description: "Create countdown timers for events and deadlines. Free online tool.", url: "https://ul0.site/countdown", siteName: "ul0.site", type: "website" },
}
export default function CountdownLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
