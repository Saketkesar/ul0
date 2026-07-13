import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "World Clock — Check Time in Any City | ul0.site",
  description: "Check the current time in any city or timezone worldwide. Free world clock tool with live updates — perfect for international meetings and remote teams.",
  keywords: ["world clock online", "time zones tool", "current time any city", "international time converter", "timezone checker"],
  alternates: { canonical: "https://ul0.site/worldclock" },
  openGraph: { title: "Free World Clock | ul0.site", description: "Check current time in any city or timezone. Free online world clock.", url: "https://ul0.site/worldclock", siteName: "ul0.site", type: "website" },
}
export default function WorldclockLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
