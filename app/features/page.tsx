import { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  Link2,
  Globe,
  BarChart3,
  QrCode,
  ShieldCheck,
  Code2,
  Zap,
  Clock,
  Lock,
  ArrowRight,
  Check,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Features — Advanced Link Management & Real-Time Analytics | UL0",
  description:
    "Explore UL0's complete link infrastructure: custom branded domains, edge 301 redirects, real-time UTM analytics, dynamic vector QR codes, password protection, and REST API.",
  alternates: {
    canonical: "https://ul0.site/features",
  },
  openGraph: {
    title: "UL0 Platform Features — Next-Gen Link Management",
    description:
      "Enterprise link shortening, custom domains, real-time geo-attribution analytics, and vector QR codes.",
    url: "https://ul0.site/features",
    type: "website",
  },
}

export default function FeaturesPage() {
  const coreFeatures = [
    {
      icon: Zap,
      title: "Edge-Routed 301 Redirects",
      badge: "Sub-15ms Latency",
      description:
        "Every short link is distributed globally via edge nodes. Permanent 301 redirects ensure instant navigation with zero render-blocking delay.",
      highlights: ["Global CDN distribution", "99.99% uptime guarantee", "Preserves HTTP referrer headers"],
    },
    {
      icon: Globe,
      title: "Branded Custom Domains",
      badge: "Custom Domains",
      description:
        "Connect your company's domain (e.g. go.yourbrand.com) with automatic SSL certificates and custom 404 fallback routing.",
      highlights: ["Automatic Let's Encrypt SSL", "One-click DNS verification", "Custom root domain redirects"],
    },
    {
      icon: BarChart3,
      title: "Real-Time Geo Attribution",
      badge: "Privacy-Compliant",
      description:
        "Understand exactly who is clicking your links with real-time breakdowns by country, city, device type, operating system, and UTM source.",
      highlights: ["Zero third-party cookie reliance", "UTM campaign taxonomy audit", "Exportable CSV & JSON logs"],
    },
    {
      icon: QrCode,
      title: "Dynamic Vector QR Codes",
      badge: "Print-Ready SVG",
      description:
        "Generate high-resolution vector QR codes for physical marketing, retail signs, and product packaging. Update destination URLs anytime without reprinting.",
      highlights: ["Lossless SVG and high-res PNG export", "Custom foreground & background palette", "Lifetime scan tracking"],
    },
    {
      icon: Lock,
      title: "Link Protection & Expiry",
      badge: "Granular Control",
      description:
        "Secure confidential internal links behind passwords and schedule time-based or click-capped link expirations for limited-time promotions.",
      highlights: ["SHA-256 hashed password verification", "Scheduled expiration timestamps", "Maximum click cap limits"],
    },
    {
      icon: Code2,
      title: "Developer REST API",
      badge: "cURL & SDK",
      description:
        "Integrate link shortening and analytics directly into your CI/CD pipelines, CRM, or backend microservices using standardized REST endpoints.",
      highlights: ["Standard Bearer token auth", "Rate-limit transparency", "Webhooks for scan event triggers"],
    },
  ]

  const comparisonRows = [
    { feature: "Branded Custom Domains", ul0: "Yes (Multi-domain)", bitly: "$35/mo plan req.", tinyurl: "Pro plan req." },
    { feature: "Edge Redirect Latency", ul0: "< 15ms", bitly: "50-120ms", tinyurl: "80-150ms" },
    { feature: "Real-Time Geo Analytics", ul0: "Instant (Live)", bitly: "Delayed batch", tinyurl: "Basic counts" },
    { feature: "Dynamic Vector QR (SVG)", ul0: "Included free", bitly: "Add-on fee", tinyurl: "PNG only" },
    { feature: "Password Protection", ul0: "Included", bitly: "Enterprise only", tinyurl: "Paid tier" },
    { feature: "Full Developer API", ul0: "Included", bitly: "Restricted quotas", tinyurl: "Limited" },
    { feature: "Free Web Utilities (Redirect/OG)", ul0: "Yes, 100% Free", bitly: "No", tinyurl: "No" },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 py-12 sm:py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground">Features</span>
          </div>

          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
              <Zap className="h-3.5 w-3.5" />
              <span>Full-Stack Link Infrastructure</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              Everything You Need to Scale, Track, and Secure Your Links
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              From fast edge redirects to multi-client custom domains and real-time attribution analytics, UL0 provides the modern toolkit for high-performance marketing and engineering teams.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link href="/sign-up">
                <Button className="rounded-xl px-6 py-2.5 font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" className="rounded-xl px-6 py-2.5 font-semibold">
                  View Pricing &amp; Plans
                </Button>
              </Link>
            </div>
          </div>

          {/* Core Feature Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-20">
            {coreFeatures.map((item, idx) => {
              const Icon = item.icon
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-foreground mb-2">{item.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">{item.description}</p>
                  </div>
                  <ul className="space-y-1.5 border-t border-border pt-3">
                    {item.highlights.map((hl, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>

          {/* Comparison Matrix */}
          <div className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">How UL0 Compares to Legacy Shorteners</h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
                Stop overpaying for basic domain mapping and throttled analytics. UL0 delivers modern developer-first features without prohibitive monthly paywalls.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground">
                    <th className="p-4 text-foreground">Capability</th>
                    <th className="p-4 text-primary font-bold">UL0 Platform</th>
                    <th className="p-4">Bitly</th>
                    <th className="p-4">TinyURL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {comparisonRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4 font-semibold text-foreground">{row.feature}</td>
                      <td className="p-4 font-bold text-primary flex items-center gap-1.5">
                        <Check className="h-4 w-4 text-emerald-500" />
                        <span>{row.ul0}</span>
                      </td>
                      <td className="p-4 text-muted-foreground">{row.bitly}</td>
                      <td className="p-4 text-muted-foreground">{row.tinyurl}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Call to action */}
          <div className="rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-background to-primary/5 p-8 sm:p-12 text-center">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3">
              Ready to Upgrade Your Link Workflow?
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto mb-6">
              Create your first branded short link in seconds, or connect your company domain for seamless marketing attribution.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/">
                <Button className="rounded-xl px-6 py-2.5 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90">
                  Shorten a Link Now
                </Button>
              </Link>
              <Link href="/tools">
                <Button variant="outline" className="rounded-xl px-6 py-2.5 text-sm font-semibold">
                  Explore Free SEO Tools
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
