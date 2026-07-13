import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Live Clock — Current Time & Date | ul0.site",
  description: "View the current time and date with a clean live clock. Free browser-based digital and analog clock tool. No account, no ads.",
  keywords: ["live clock online", "current time clock", "digital clock browser", "analog clock tool", "free online clock"],
  alternates: { canonical: "https://ul0.site/clock" },
  openGraph: { title: "Free Live Clock | ul0.site", description: "Live current time and date clock. Free online tool.", url: "https://ul0.site/clock", siteName: "ul0.site", type: "website" },
}
export default function ClockLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
