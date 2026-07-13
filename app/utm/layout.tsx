import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "UTM Link Builder — Free Campaign URL Generator | ul0.site",
  description: "Build UTM tracking links for Google Analytics, Facebook Ads, and email campaigns in seconds. Free campaign URL generator with custom source, medium, and campaign tags.",
  keywords: ["UTM link builder", "UTM parameter generator", "campaign URL builder", "Google Analytics UTM", "marketing link tracker"],
  alternates: { canonical: "https://ul0.site/utm" },
  openGraph: { title: "Free UTM Campaign Link Builder | ul0.site", description: "Generate UTM tracking links for your marketing campaigns. 100% free.", url: "https://ul0.site/utm", siteName: "ul0.site", type: "website" },
}
export default function UtmLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
