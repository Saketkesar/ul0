import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Free WiFi QR Code Generator — Connect Without Typing Passwords | ul0",
  description: "Create free printable WiFi QR codes for homes, offices, cafes, and Airbnbs. Let guests scan to connect immediately across iOS and Android without typing passwords.",
  alternates: { canonical: "https://ul0.site/wifi" },
  openGraph: {
    title: "Free WiFi QR Code Generator | ul0",
    description: "Generate instant WiFi QR codes for guests. No typing passwords, 100% free.",
    url: "https://ul0.site/wifi",
    siteName: "ul0",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free WiFi QR Code Generator | ul0",
    description: "Create printable WiFi QR codes for instant guest network connection.",
  },
}
export default function WifiLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
