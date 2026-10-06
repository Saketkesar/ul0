import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Free QR Code Generator — Create Custom & Dynamic QR Codes | ul0",
  description: "Generate high-resolution PNG & SVG vector QR codes for websites, WiFi networks, vCards, and text. Completely free with custom colors, zero expiration, and no signup.",
  alternates: { canonical: "https://ul0.site/qr" },
  openGraph: {
    title: "Free QR Code Generator | ul0",
    description: "Create free custom QR codes instantly with logo support and high-resolution export.",
    url: "https://ul0.site/qr",
    siteName: "ul0",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free QR Code Generator | ul0",
    description: "Create high-resolution custom vector QR codes for free with no signup required.",
  },
}
export default function QrLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
