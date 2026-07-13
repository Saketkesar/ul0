import type { Metadata } from "next"
export const metadata: Metadata = {
  title: "Free QR Code Generator — Create Custom QR Codes | ul0.site",
  description: "Generate free QR codes instantly for URLs, WiFi, text, and more. Download high-resolution PNG QR codes for your brand, product, or event. No signup required.",
  keywords: ["QR code generator", "free QR code maker", "create QR code", "custom QR code", "QR code download"],
  alternates: { canonical: "https://ul0.site/qr" },
  openGraph: { title: "Free QR Code Generator | ul0.site", description: "Create free custom QR codes instantly. No signup.", url: "https://ul0.site/qr", siteName: "ul0.site", type: "website" },
}
export default function QrLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
