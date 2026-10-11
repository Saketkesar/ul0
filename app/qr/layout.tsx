import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Free QR Code Generator with Logo & Scan Tracking",
  description: "Generate high-resolution PNG & SVG vector QR codes for websites, WiFi networks, vCards, and text. Completely free with custom colors, zero expiration, and no signup.",
  alternates: { canonical: "https://ul0.site/qr" },
  openGraph: {
    title: "Free QR Code Generator with Logo & Scan Tracking | UL0",
    description: "Create free custom QR codes instantly with logo support and high-resolution export.",
    url: "https://ul0.site/qr",
    siteName: "UL0",
    type: "website",
    images: [{
      url: "https://ul0.site/social-card.png",
      width: 1376,
      height: 768,
      alt: "Free QR Code Generator — UL0",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free QR Code Generator with Logo & Scan Tracking | UL0",
    description: "Create high-resolution custom vector QR codes for free with no signup required.",
    images: ["https://ul0.site/social-card.png"],
  },
}
export default function QrLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
