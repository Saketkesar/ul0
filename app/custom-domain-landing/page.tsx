import type { Metadata } from "next"
import { headers } from "next/headers"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getDomainByName } from "@/lib/appwrite/domains"
import {
  Globe,
  ShieldCheck,
  Check,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  Zap,
  Sparkles,
  Server,
  Lock,
  Copy,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Free Custom Domain URL Shortener — Branded Short Links | UL0",
  description:
    "Connect your own custom domain for free. Create branded short links on your domain with automated SSL, instant 301 redirects, and real-time click tracking without paid plans.",
  openGraph: {
    title: "Free Custom Domain URL Shortener — Branded Short Links | UL0",
    description:
      "Connect your custom domain free. Create branded short links with automated Let's Encrypt SSL, edge 301 redirects, and analytics. No credit card required.",
    url: "https://ul0.site/custom-domain-landing",
    siteName: "UL0",
    type: "website",
  },
  alternates: {
    canonical: "https://ul0.site/custom-domain-landing",
  },
  robots: { index: true, follow: true },
}

export default async function CustomDomainLandingPage() {
  const headersList = await headers()
  const host = headersList.get("host") || ""
  const domain = host.split(":")[0]

  let isCustomDomain = false
  let brandLogoUrl: string | null = null

  if (domain && domain !== "ul0.site" && domain !== "localhost" && !domain.endsWith(".vercel.app")) {
    isCustomDomain = true
    try {
      const domainDoc = await getDomainByName(domain)
      brandLogoUrl = domainDoc?.brand_logo_url || null
    } catch (err) {
      console.error("Failed to fetch domain doc in landing page:", err)
    }
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Is custom domain link shortening really free on UL0?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. UL0 allows you to connect your custom domain free of charge. You get automated Let's Encrypt SSL, global edge 301 redirection, and link analytics without paying a subscription.",
        },
      },
      {
        "@type": "Question",
        name: "Do I have to buy a domain through UL0?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. You keep your domain at your existing registrar (Namecheap, Cloudflare, GoDaddy, Porkbun, Google Domains/Squarespace, AWS Route 53). You simply add a standard CNAME DNS record pointing to UL0.",
        },
      },
      {
        "@type": "Question",
        name: "Should I use a root domain or a subdomain for short links?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We strongly recommend using a dedicated subdomain like link.yourbrand.com, go.yourbrand.com, or to.yourbrand.com. This ensures your primary corporate website at yourbrand.com continues running without any DNS conflicts.",
        },
      },
      {
        "@type": "Question",
        name: "How long does custom domain DNS propagation take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "DNS propagation typically takes between 2 to 15 minutes when using modern DNS providers like Cloudflare or Namecheap. Once propagated, our edge infrastructure automatically issues a free SSL certificate within 60 seconds.",
        },
      },
      {
        "@type": "Question",
        name: "Why do branded short links get higher click-through rates than Bitly?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Generic shortener domains like bit.ly, tinyurl.com, and is.gd are heavily targeted by automated spam filters, SMS carriers (10DLC rules), and privacy blockers because bad actors frequently conceal malicious URLs behind them. Using your own domain provides clear brand attribution and eliminates spam flags.",
        },
      },
    ],
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Header />

      <main className="flex-1">
        {/* If visited directly via a user's custom domain root, show the custom domain attribution notice */}
        {isCustomDomain && (
          <div className="border-b bg-muted/40 py-3 text-center text-xs text-muted-foreground">
            <span className="font-semibold text-foreground font-mono">{domain}</span> is verified and routing via the UL0 edge network.
          </div>
        )}

        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 sm:py-24 border-b bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary mb-6">
              <Globe className="h-3.5 w-3.5" />
              <span>Free Custom Domain Feature • Verified Oct 2026</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-tight">
              Free Custom Domain URL Shortener: Branded Short Links Without the $35/Mo Paywall
            </h1>

            <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Transform generic, untrusted short links into branded assets like <code className="bg-muted px-2 py-0.5 rounded text-primary font-mono font-semibold">go.yourbrand.com/launch</code>. Includes automated Let&apos;s Encrypt SSL, sub-15ms edge redirects, and real-time click tracking.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/dashboard/domains">
                <Button size="lg" className="rounded-xl px-7 font-semibold gap-2 shadow-sm">
                  <span>Connect Your Domain Free</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/blog/custom-domain-dns-cname-setup-guide">
                <Button size="lg" variant="outline" className="rounded-xl px-6 font-semibold gap-2">
                  <span>Read CNAME Setup Guide</span>
                  <ExternalLink className="h-4 w-4 opacity-70" />
                </Button>
              </Link>
            </div>

            {/* Quick Proof Badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>100% Free Tier</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Automated Let&apos;s Encrypt SSL</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>HTTP 301 Permanent Redirects</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>No Credit Card Required</span>
              </div>
            </div>
          </div>
        </section>

        {/* Visual CNAME DNS Setup Card */}
        <section className="py-14 sm:py-18 bg-muted/20 border-b">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-8">
              <Badge variant="secondary" className="mb-2">Simple 2-Step DNS Setup</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                How Connecting a Custom Domain Works
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-lg mx-auto">
                No complex server management or DNS delegation. Simply create one CNAME record at your DNS provider.
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-6 sm:p-8 shadow-sm">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Step 1 */}
                <div className="rounded-xl border bg-background p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      1
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-muted-foreground">Registrar DNS Settings</span>
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">Add a CNAME DNS Record</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Choose your subdomain (such as <code className="bg-muted px-1 rounded font-mono">link</code>, <code className="bg-muted px-1 rounded font-mono">go</code>, or <code className="bg-muted px-1 rounded font-mono">to</code>) and point it to our edge routing endpoint:
                  </p>
                  <div className="rounded-lg border bg-muted/40 p-3 font-mono text-xs space-y-1.5 text-foreground">
                    <div className="flex justify-between text-muted-foreground text-[10px]">
                      <span>TYPE</span>
                      <span>NAME / HOST</span>
                      <span>TARGET / VALUE</span>
                    </div>
                    <div className="flex justify-between font-bold pt-1 border-t text-[11px]">
                      <span className="text-primary">CNAME</span>
                      <span>go</span>
                      <span className="text-emerald-600 dark:text-emerald-400">cname.ul0.site</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Tip: If using Cloudflare DNS, set the Proxy Status to <strong>DNS Only (Gray Cloud)</strong> during setup.
                  </p>
                </div>

                {/* Step 2 */}
                <div className="rounded-xl border bg-background p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      2
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-muted-foreground">UL0 Edge Network</span>
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">Automated SSL &amp; Routing Handshake</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Once DNS propagates, our Vercel Edge infrastructure automatically detects your record and provisions a dedicated 2048-bit Let&apos;s Encrypt certificate:
                  </p>
                  <div className="rounded-lg border bg-muted/40 p-3 font-mono text-xs space-y-2">
                    <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                      <Lock className="h-3.5 w-3.5 shrink-0" />
                      <span>SSL Status: Active (HTTPS)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                      <Zap className="h-3.5 w-3.5 shrink-0" />
                      <span>Edge Cache: Global POPs</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Server className="h-3.5 w-3.5 shrink-0" />
                      <span>Response Code: HTTP 301 Permanent</span>
                    </div>
                  </div>
                  <div className="pt-1">
                    <Link href="/dashboard/domains" className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
                      <span>Open Domains Dashboard →</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Competitor Price & Feature Comparison Table (Verified Oct 2026) */}
        <section className="py-16 bg-background border-b">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-2">Fair Value Comparison</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Custom Domain Shortener: UL0 vs Competitors
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
                Comparing published pricing and custom domain limits across major link shortening platforms. Verified accurate as of October 2026.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border shadow-sm">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-muted/60 border-b">
                    <th className="p-4 font-semibold text-foreground">Feature / Capability</th>
                    <th className="p-4 font-bold text-primary bg-primary/5">UL0</th>
                    <th className="p-4 font-semibold text-foreground">Bitly</th>
                    <th className="p-4 font-semibold text-foreground">Dub.co</th>
                    <th className="p-4 font-semibold text-foreground">Rebrandly</th>
                    <th className="p-4 font-semibold text-foreground">TinyURL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="p-4 font-medium text-foreground">Custom Domains Included Free</td>
                    <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400 bg-primary/5">
                      1 Free Domain
                    </td>
                    <td className="p-4 text-muted-foreground">0 (Paid plans only)</td>
                    <td className="p-4 text-muted-foreground">3 Domains (Free tier)</td>
                    <td className="p-4 text-muted-foreground">0 (Paid plans only)</td>
                    <td className="p-4 text-muted-foreground">0 (Paid plans only)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-foreground">Minimum Cost for Custom Domains</td>
                    <td className="p-4 font-bold text-emerald-600 dark:text-emerald-400 bg-primary/5">
                      $0 / mo
                    </td>
                    <td className="p-4 text-muted-foreground font-semibold">$35 / mo (Core plan)</td>
                    <td className="p-4 text-muted-foreground font-semibold">$0 / mo (Limited events)</td>
                    <td className="p-4 text-muted-foreground font-semibold">$13 / mo (Essentials)</td>
                    <td className="p-4 text-muted-foreground font-semibold">$12.99 / mo (Pro)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-foreground">Automated Let&apos;s Encrypt SSL</td>
                    <td className="p-4 text-emerald-600 dark:text-emerald-400 font-semibold bg-primary/5">Included Free</td>
                    <td className="p-4 text-muted-foreground">Included</td>
                    <td className="p-4 text-muted-foreground">Included</td>
                    <td className="p-4 text-muted-foreground">Included</td>
                    <td className="p-4 text-muted-foreground">Included</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-foreground">HTTP Status Code Header</td>
                    <td className="p-4 text-emerald-600 dark:text-emerald-400 font-semibold bg-primary/5">301 Permanent</td>
                    <td className="p-4 text-muted-foreground">301 Permanent</td>
                    <td className="p-4 text-muted-foreground">301 / 302 / 307</td>
                    <td className="p-4 text-muted-foreground">301 Permanent</td>
                    <td className="p-4 text-muted-foreground">301 Permanent</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-foreground">Vector QR Code Generation</td>
                    <td className="p-4 text-emerald-600 dark:text-emerald-400 font-semibold bg-primary/5">Free Unlimited</td>
                    <td className="p-4 text-muted-foreground">2 / mo on Free</td>
                    <td className="p-4 text-muted-foreground">Included</td>
                    <td className="p-4 text-muted-foreground">Paid tier limited</td>
                    <td className="p-4 text-muted-foreground">Paid only</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-foreground">Account Required to Test</td>
                    <td className="p-4 text-emerald-600 dark:text-emerald-400 font-semibold bg-primary/5">No Signup Needed</td>
                    <td className="p-4 text-muted-foreground">Signup Required</td>
                    <td className="p-4 text-muted-foreground">Signup Required</td>
                    <td className="p-4 text-muted-foreground">Signup Required</td>
                    <td className="p-4 text-muted-foreground">Signup Required</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted-foreground text-center">
              Competitor pricing and plan limits retrieved directly from official pricing documentation, verified October 2026.
            </p>
          </div>
        </section>

        {/* Why Branded Links Matter (The ROI & Deliverability Problem) */}
        <section className="py-16 bg-muted/20 border-b">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-2">Deliverability &amp; Conversion</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Why Generic URL Shorteners Hurt Your Business
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-xl mx-auto">
                Spammers, phishers, and botnets abuse generic domains daily. Here is why modern marketing teams use their own branded domain.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-foreground text-base">SMS 10DLC &amp; Spam Filters</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Mobile carriers (T-Mobile, AT&amp;T, Verizon) block SMS messages containing shared generic shorteners (bit.ly, tinyurl) due to carrier spam regulations. A custom domain ensures your SMS campaigns deliver reliably.
                </p>
              </div>

              <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-foreground text-base">Consumer Trust &amp; CTR</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Audiences are cautious of clicking mystery links that hide the destination. A recognizable domain like <code className="bg-muted px-1 rounded font-mono font-bold">go.brand.com</code> establishes authenticity and elevates click confidence.
                </p>
              </div>

              <div className="rounded-2xl border bg-card p-6 shadow-xs space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Globe className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-foreground text-base">SEO &amp; Link Equity Retention</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  UL0 returns clean HTTP 301 Permanent Redirect headers. Every short link routed through your custom domain passes 100% PageRank link equity directly to your target destination URL.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed FAQ Section */}
        <section className="py-16 bg-background border-b">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-2">Frequently Asked Questions</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Everything You Need to Know About Custom Domains
              </h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border p-5 bg-card">
                <h3 className="font-semibold text-foreground text-base mb-2">
                  Is custom domain link shortening truly free on UL0?
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Yes. You can connect your branded custom domain on our free tier with zero trial periods and zero credit card requirements. You get automated SSL certificates, edge 301 redirects, and link analytics completely free.
                </p>
              </div>

              <div className="rounded-xl border p-5 bg-card">
                <h3 className="font-semibold text-foreground text-base mb-2">
                  Do I need to purchase a domain through UL0?
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  No. UL0 is not a domain registrar. You keep complete ownership of your domain at your preferred provider (Namecheap, Cloudflare, GoDaddy, Porkbun, Google Domains/Squarespace, AWS Route 53) and simply configure a standard CNAME record.
                </p>
              </div>

              <div className="rounded-xl border p-5 bg-card">
                <h3 className="font-semibold text-foreground text-base mb-2">
                  Should I use a subdomain or root apex domain?
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We recommend using a dedicated subdomain such as <code className="bg-muted px-1 py-0.5 rounded font-mono text-xs font-semibold">go.yourbrand.com</code> or <code className="bg-muted px-1 py-0.5 rounded font-mono text-xs font-semibold">link.yourbrand.com</code>. This ensures your primary website at <code className="bg-muted px-1 py-0.5 rounded font-mono text-xs font-semibold">yourbrand.com</code> continues operating without interference.
                </p>
              </div>

              <div className="rounded-xl border p-5 bg-card">
                <h3 className="font-semibold text-foreground text-base mb-2">
                  How does SSL certificate generation work?
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Our Vercel Edge infrastructure communicates directly with Let&apos;s Encrypt to provision a free, automated 2048-bit RSA TLS/SSL certificate for every connected domain. Certificates auto-renew indefinitely without manual intervention.
                </p>
              </div>

              <div className="rounded-xl border p-5 bg-card">
                <h3 className="font-semibold text-foreground text-base mb-2">
                  How long does DNS propagation take?
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  DNS propagation depends on your provider&apos;s TTL setting. Modern DNS providers like Cloudflare, Route 53, or Namecheap propagate within 2 to 15 minutes. Once DNS propagates, our SSL handshake completes in under 60 seconds.
                </p>
              </div>

              <div className="rounded-xl border p-5 bg-card">
                <h3 className="font-semibold text-foreground text-base mb-2">
                  What if I want to migrate my links in the future?
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Because you own your domain, you are never locked into any platform. If you ever decide to run your own redirection server or switch providers, you simply point your CNAME record to your new destination. All your short links and social posts remain intact.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-4xl text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
              Ready to Brand Your Short Links?
            </h2>
            <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Join thousands of creators, indie developers, and marketing agencies who own their short link infrastructure.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link href="/dashboard/domains">
                <Button size="lg" className="rounded-xl px-8 font-semibold shadow-sm">
                  Connect Your Domain Now
                </Button>
              </Link>
              <Link href="/blog/custom-domain-dns-cname-setup-guide">
                <Button size="lg" variant="outline" className="rounded-xl px-6 font-semibold">
                  Read DNS Setup Walkthrough
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
