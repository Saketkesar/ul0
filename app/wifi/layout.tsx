import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Free WiFi QR Code Generator — Share WiFi Instantly | ul0.site",
  description: "Generate a WiFi QR code in seconds. Let guests connect to your network by scanning — no password typing needed. Free, instant, no signup.",
  keywords: ["WiFi QR code generator", "share WiFi QR code", "free WiFi QR code", "WiFi password QR", "guest network QR code"],
  alternates: { canonical: "https://ul0.site/wifi" },
  openGraph: { title: "Free WiFi QR Code Generator | ul0.site", description: "Share your WiFi with a QR code. Instant and free.", url: "https://ul0.site/wifi", siteName: "ul0.site", type: "website" },
}
export default function WifiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
