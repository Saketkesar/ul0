import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "World Clock — Check Time in Any City & Timezone | ul0",
  description: "Check the current time, UTC offset, and time difference in major cities worldwide. Free live world clock tool for remote teams and international meeting scheduling.",
  alternates: { canonical: "https://ul0.site/worldclock" },
  openGraph: {
    title: "Free World Clock — Check Time in Any City | ul0",
    description: "Check current time in any city or timezone worldwide with live seconds and offset comparison.",
    url: "https://ul0.site/worldclock",
    siteName: "ul0",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free World Clock | ul0",
    description: "Live world clock and timezone meeting planner for remote teams.",
  },
}
export default function WorldclockLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
