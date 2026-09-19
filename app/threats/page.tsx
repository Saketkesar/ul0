import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ThreatRadarClient, BlockedThreatItem } from "@/components/threat-radar-client"
import { getFlaggedPhishingLinks } from "@/lib/appwrite/links"
import { BLOCKED_DOMAINS } from "@/lib/utils/slug"
import { ShieldAlert, ShieldCheck, Lock, ExternalLink, AlertTriangle } from "lucide-react"

export const revalidate = 60 // Refresh every 60 seconds

export const metadata: Metadata = {
  title: "Threat Intelligence Radar — Blocked Phishing & Scam Registry | ul0",
  description:
    "Real-time transparency registry of intercepted phishing links and permanently banned scam domains on ul0. Zero traffic, zero redirects, and zero backlink equity passed to attackers.",
  alternates: {
    canonical: "https://ul0.site/threats",
  },
  openGraph: {
    title: "Threat Intelligence Radar — Neutralized Phishing Database | ul0",
    description:
      "Public transparency registry of intercepted phishing links and blacklisted domains. 100% redirection lockout with zero backlink juice passed to scammers.",
    url: "https://ul0.site/threats",
    siteName: "ul0",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Threat Intelligence Radar | ul0",
    description: "Public transparency registry of neutralized phishing links and banned scam domains.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
}

function defangUrl(urlStr: string): string {
  try {
    const url = new URL(urlStr)
    const defangedProtocol = url.protocol === "https:" ? "hxxps://" : "hxxp://"
    const defangedHost = url.hostname.replace(/\./g, "[.]")
    return `${defangedProtocol}${defangedHost}${url.pathname}${url.search}`
  } catch {
    return urlStr.replace("https://", "hxxps://").replace("http://", "hxxp://").replace(/\./g, "[.]")
  }
}

function inferBrandAndCategory(url: string, targeting: any) {
  const lower = url.toLowerCase()
  if (targeting?.phishing_target?.includes("telegram") || lower.includes("telegram") || lower.includes("byphoccc") || lower.includes("bgp52")) {
    return {
      brand: "Telegram",
      category: "Telegram Credential Harvest",
      genuine: "https://telegram.org",
      score: 85,
    }
  }
  if (targeting?.phishing_target?.includes("libero") || lower.includes("libero") || lower.includes("mysecurity-info")) {
    return {
      brand: "Libero Mail",
      category: "Webmail Account Hijack",
      genuine: "https://libero.it",
      score: 90,
    }
  }
  if (lower.includes("paypal")) {
    return {
      brand: "PayPal",
      category: "Financial Phishing",
      genuine: "https://paypal.com",
      score: 95,
    }
  }
  if (lower.includes("google") || lower.includes("gmail")) {
    return {
      brand: "Google",
      category: "OAuth / Credential Harvest",
      genuine: "https://google.com",
      score: 92,
    }
  }
  return {
    brand: targeting?.phishing_target || "Generic Brand",
    category: "Deceptive Phishing Clone",
    genuine: targeting?.suspicious_original_url || "https://google.com",
    score: 80,
  }
}

export default async function ThreatsPage() {
  const flaggedDocs = await getFlaggedPhishingLinks(100)

  const threats: BlockedThreatItem[] = flaggedDocs.map((doc) => {
    let targeting: any = {}
    try {
      if (doc.targeting_json) targeting = JSON.parse(doc.targeting_json)
    } catch {}

    const { brand, category, genuine, score } = inferBrandAndCategory(doc.long_url, targeting)
    let domain = ""
    try {
      domain = new URL(doc.long_url).hostname
    } catch {
      domain = doc.long_url
    }

    const dateStr = targeting?.blocked_at
      ? new Date(targeting.blocked_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : doc.created_at
      ? new Date(doc.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Recently"

    return {
      id: doc.$id,
      slug: doc.slug,
      shortUrl: `https://ul0.site/${doc.slug}`,
      defangedUrl: defangUrl(doc.long_url),
      rawDomain: domain,
      threatCategory: category,
      spoofedBrand: brand,
      genuineUrl: genuine,
      dateBlocked: dateStr,
      threatScore: score,
      riskLevel: score >= 90 ? "CRITICAL" : "HIGH",
      serverLocation: "Cloudflare Anycast Proxy",
      isp: "Cloudflare, Inc.",
    }
  })

  // Schema markup
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "ul0 Threat Intelligence Radar",
    description: "Public transparency registry of intercepted phishing links and permanently banned scam domains.",
    publisher: {
      "@type": "Organization",
      name: "ul0",
      url: "https://ul0.site",
    },
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="flex-1 py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <ThreatRadarClient
            threats={threats}
            blacklistedDomains={BLOCKED_DOMAINS}
            basinFormUuid="16f38d46e9f3"
          />
        </div>
      </main>

      <Footer />
    </div>
  )
}
