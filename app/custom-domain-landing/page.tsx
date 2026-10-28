import type { Metadata } from "next"
import { headers } from "next/headers"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CopyField } from "@/components/copy-field"
import {
  Globe,
  ShieldCheck,
  Check,
  ExternalLink,
  ArrowRight,
  AlertCircle,
  HelpCircle,
} from "lucide-react"
import { getDomainByName } from "@/lib/appwrite/domains"
import { DEFAULT_HOST } from "@/lib/appwrite/config"

export const metadata: Metadata = {
  title: "Custom Branded Domains",
  description:
    "Connect your own domain or subdomain via CNAME and shorten branded links with automated SSL certificates.",
  alternates: {
    canonical: "https://ul0.site/custom-domain-landing",
  },
}

export default async function CustomDomainLandingPage() {
  const headersList = await headers()
  const rawHost = headersList.get("host") || ""
  const host = rawHost.split(":")[0].toLowerCase()

  const isCustomDomainVisitor =
    host &&
    host !== "ul0.site" &&
    !host.endsWith(".ul0.site") &&
    !host.includes("localhost") &&
    !host.includes("127.0.0.1")

  let brandLogoUrl: string | null = null
  if (isCustomDomainVisitor) {
    try {
      const domainDoc = await getDomainByName(host)
      brandLogoUrl = domainDoc?.brand_logo_url || null
    } catch {}
  }

  // 1. Custom Domain Root Visitor View (when visited directly on client's branded domain)
  if (isCustomDomainVisitor) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-6 text-center">
        <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 space-y-6">
          {brandLogoUrl ? (
            <img
              src={brandLogoUrl}
              alt="Brand Logo"
              className="mx-auto h-12 w-auto object-contain"
            />
          ) : (
            <div className="mx-auto h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Globe className="h-6 w-6" />
            </div>
          )}

          <div className="space-y-1.5">
            <h1 className="text-lg font-semibold text-foreground font-mono">{host}</h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This domain is configured for short links and redirects. Powered by the UL0 infrastructure platform.
            </p>
          </div>

          <div className="pt-2 border-t border-border">
            <Link
              href="https://ul0.site"
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-medium"
            >
              <span>Learn more about UL0</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // 2. Marketing & DNS Setup Guide View (on ul0.site/custom-domain-landing)
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 py-14 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl space-y-16">
          {/* Header */}
          <div className="border-b border-border pb-6 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-medium border border-border bg-muted/40 text-muted-foreground">
              <Globe className="h-3 w-3 text-primary" />
              <span>Branded Infrastructure</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-foreground">
              Connect Your Custom Domain
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Shorten links using your own brand (such as <code className="font-mono text-foreground">link.yourcompany.com</code>).
              1 custom domain connection is included on all accounts for free.
            </p>
          </div>

          {/* Quick DNS Record Reference */}
          <div className="rounded-lg border border-border bg-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground">Required DNS CNAME Record</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Point your subdomain to our edge routing endpoint.
                </p>
              </div>
              <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded border border-border bg-muted/40 text-muted-foreground">
                Automated SSL
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-muted/40 border-b border-border text-muted-foreground">
                    <th className="px-3 py-2 font-semibold">Type</th>
                    <th className="px-3 py-2 font-semibold">Name / Host</th>
                    <th className="px-3 py-2 font-semibold">Target / Value</th>
                    <th className="px-3 py-2 font-semibold">Proxy Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border font-mono text-xs text-foreground">
                  <tr>
                    <td className="px-3 py-2.5 font-bold">CNAME</td>
                    <td className="px-3 py-2.5">link (or your subdomain)</td>
                    <td className="px-3 py-2.5 text-primary font-bold">cname.ul0.site</td>
                    <td className="px-3 py-2.5 font-sans text-muted-foreground">DNS Only (Grey Cloud)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <CopyField value="cname.ul0.site" label="CNAME Target" />
          </div>

          {/* Step by step guide */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Step-by-Step DNS Instructions</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-lg border border-border bg-card p-5 space-y-2.5">
                <span className="text-xs font-mono font-semibold text-primary">Step 1</span>
                <h3 className="text-sm font-semibold text-foreground">Log into your DNS host</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Open Cloudflare, Namecheap, GoDaddy, AWS Route 53, or wherever your domain nameservers are managed.
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-5 space-y-2.5">
                <span className="text-xs font-mono font-semibold text-primary">Step 2</span>
                <h3 className="text-sm font-semibold text-foreground">Add the CNAME record</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Create a CNAME record with name <code className="font-mono">link</code> and value <code className="font-mono">cname.ul0.site</code>. If using Cloudflare, turn proxy off (DNS only).
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-5 space-y-2.5">
                <span className="text-xs font-mono font-semibold text-primary">Step 3</span>
                <h3 className="text-sm font-semibold text-foreground">Verify in dashboard</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Navigate to Domains in your dashboard and click Verify. SSL certificates are issued within seconds.
                </p>
              </div>
            </div>
          </div>

          {/* Common failure states / troubleshooting */}
          <div className="rounded-lg border border-border bg-muted/20 p-6 space-y-4 text-xs">
            <h3 className="font-semibold text-foreground flex items-center gap-1.5 text-sm">
              <AlertCircle className="h-4 w-4 text-primary" />
              Troubleshooting DNS Verification
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-muted-foreground">
              <div className="space-y-1">
                <strong className="text-foreground">Cloudflare Orange Cloud (Proxied)</strong>
                <p className="leading-relaxed">
                  If your domain uses Cloudflare, ensure the proxy status is set to &ldquo;DNS Only&rdquo; (grey cloud). Proxied traffic prevents our edge from issuing SSL.
                </p>
              </div>

              <div className="space-y-1">
                <strong className="text-foreground">DNS Propagation Window</strong>
                <p className="leading-relaxed">
                  Most DNS updates propagate within 5 minutes, but some registrars can take up to 24 hours. You can retry verification at any time in the dashboard.
                </p>
              </div>

              <div className="space-y-1">
                <strong className="text-foreground">Apex Domain vs Subdomain</strong>
                <p className="leading-relaxed">
                  We recommend using a dedicated subdomain (e.g. <code className="font-mono">link.yourdomain.com</code>) so your main apex domain can remain on your primary website.
                </p>
              </div>

              <div className="space-y-1">
                <strong className="text-foreground">Conflicting A Records</strong>
                <p className="leading-relaxed">
                  Ensure no existing A or AAAA record matches the same subdomain name. A CNAME record cannot coexist with an A record for the same host.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-lg border border-border bg-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-sm font-semibold text-foreground">Ready to connect your domain?</h3>
              <p className="text-xs text-muted-foreground">
                Sign in to your dashboard to add your custom domain and generate branded short links.
              </p>
            </div>
            <Button asChild size="sm" className="text-xs font-semibold shrink-0">
              <Link href="/dashboard/domains">Go to Domains Dashboard →</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
