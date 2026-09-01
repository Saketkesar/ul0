import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LinkShortenerForm } from "@/components/link-shortener-form"
import { Metadata } from "next"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  Link2,
  Check,
  X,
  Zap,
  ShieldCheck,
  Globe2,
  Smartphone,
  ArrowRight,
  QrCode,
  BarChart3,
  Sparkles,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Free URL Shortener (2026) — Shorten & Track Links with No Signup | ul0",
  description:
    "The 100% free URL shortener with permanent links, custom aliases, QR codes, and real-time click tracking. No account or credit card required.",
  keywords: [
    "free url shortener",
    "url shortener no signup",
    "best free url shortener 2026",
    "bitly alternative free",
    "tinyurl alternative",
    "shorten url free",
    "link compressor",
    "custom url shortener free",
  ],
  alternates: {
    canonical: "https://ul0.site/free-url-shortener",
  },
}

export default function FreeUrlShortenerPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 py-10 sm:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Hero Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              100% Free • No Signup Required
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Free URL Shortener &amp; Link Management
            </h1>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base max-w-2xl mx-auto">
              Compress unwieldy URLs into clean, high-CTR short links with permanent redirects, automatic QR code generation, and click analytics.
            </p>
          </div>

          {/* Form Widget */}
          <div className="mb-14">
            <LinkShortenerForm />
          </div>

          {/* Comparison Table vs Competitors */}
          <div className="mt-16 space-y-6">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                How ul0 Compares to Bitly &amp; TinyURL
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Enjoy enterprise-grade shortener features without restrictive paywalls or forced signups.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/50 text-xs font-semibold uppercase text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4">Feature</th>
                    <th className="px-6 py-4 text-primary font-bold">ul0.site</th>
                    <th className="px-6 py-4">Bitly (Free Tier)</th>
                    <th className="px-6 py-4">TinyURL (Free Tier)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs sm:text-sm">
                  <tr>
                    <td className="px-6 py-3.5 font-medium">Signup Required</td>
                    <td className="px-6 py-3.5 font-semibold text-emerald-500">None (Instant)</td>
                    <td className="px-6 py-3.5 text-muted-foreground">Mandatory</td>
                    <td className="px-6 py-3.5 text-muted-foreground">Optional (with ads)</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3.5 font-medium">Link Expiration</td>
                    <td className="px-6 py-3.5 font-semibold text-emerald-500">Never Expire</td>
                    <td className="px-6 py-3.5 text-muted-foreground">May expire on inactive</td>
                    <td className="px-6 py-3.5 text-muted-foreground">Permanent</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3.5 font-medium">Automatic QR Code</td>
                    <td className="px-6 py-3.5 font-semibold text-emerald-500">Included Free (HD)</td>
                    <td className="px-6 py-3.5 text-muted-foreground">Limited (2/mo)</td>
                    <td className="px-6 py-3.5 text-muted-foreground">Paid Add-on</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3.5 font-medium">Custom Branded Domain</td>
                    <td className="px-6 py-3.5 font-semibold text-emerald-500">1 Free Domain</td>
                    <td className="px-6 py-3.5 text-muted-foreground">$35/mo+ Plan</td>
                    <td className="px-6 py-3.5 text-muted-foreground">$12.99/mo Plan</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3.5 font-medium">Click Analytics</td>
                    <td className="px-6 py-3.5 font-semibold text-emerald-500">Free Geo &amp; Device Stats</td>
                    <td className="px-6 py-3.5 text-muted-foreground">30-day window cap</td>
                    <td className="px-6 py-3.5 text-muted-foreground">Paid tier only</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Use Cases Grid */}
          <div className="mt-16 space-y-6">
            <h2 className="text-2xl font-bold text-foreground text-center">
              Built for Every Marketing Channel
            </h2>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="p-5 rounded-xl border border-border bg-card">
                <h3 className="font-semibold text-foreground mb-1.5">Social Media Bio Links</h3>
                <p className="text-xs text-muted-foreground">
                  Keep your Instagram, TikTok, and Twitter character counts lean while tracking influencer engagement.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-border bg-card">
                <h3 className="font-semibold text-foreground mb-1.5">Email &amp; Newsletter Links</h3>
                <p className="text-xs text-muted-foreground">
                  Prevent spam filter triggers from unwieldy tracking parameters with clean, canonical redirects.
                </p>
              </div>
              <div className="p-5 rounded-xl border border-border bg-card">
                <h3 className="font-semibold text-foreground mb-1.5">Print Flyers &amp; Packaging</h3>
                <p className="text-xs text-muted-foreground">
                  Combine short URLs with high-resolution vector QR codes for billboards, packaging, and menus.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-16 space-y-6 border-t border-border pt-12">
            <h2 className="text-2xl font-bold text-foreground text-center">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4 text-sm">
              <div className="p-5 rounded-xl border border-border bg-card space-y-1.5">
                <h3 className="font-semibold text-foreground">Is this URL shortener completely free?</h3>
                <p className="text-xs text-muted-foreground">
                  Yes, ul0 is 100% free to use. You can shorten unlimited links on the ul0.site domain, generate QR codes, and track clicks without paying a cent.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-border bg-card space-y-1.5">
                <h3 className="font-semibold text-foreground">Do my shortened links expire?</h3>
                <p className="text-xs text-muted-foreground">
                  No. All valid short links created on ul0 are permanent and will continue routing users to their destination indefinitely.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-border bg-card space-y-1.5">
                <h3 className="font-semibold text-foreground">Can I use my own custom domain?</h3>
                <p className="text-xs text-muted-foreground">
                  Yes! We offer 1 free custom domain connection for verified users so you can shorten links under your own brand (e.g. link.yourcompany.com).
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
