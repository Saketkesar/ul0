import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Report Abusive or Malicious Short Link — Trust & Safety",
  description:
    "Report phishing, malware, spam, or unsafe destinations routed via ul0.site short links. Rapid safety review and deactivation.",
  alternates: {
    canonical: "https://ul0.site/report-abuse",
  },
  openGraph: {
    title: "Report Abusive or Malicious Short Link | UL0",
    description:
      "Trust & Safety abuse reporting portal for ul0.site short URLs.",
    url: "https://ul0.site/report-abuse",
    siteName: "UL0",
    type: "website",
    images: [
      {
        url: "https://ul0.site/social-card.png",
        width: 1376,
        height: 768,
        alt: "UL0 Trust & Safety Report Abuse Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Report Abusive or Malicious Short Link | UL0",
    description:
      "Report unsafe or abusive ul0.site links for immediate Trust & Safety review.",
    images: ["https://ul0.site/social-card.png"],
  },
}

export default function ReportAbuseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
