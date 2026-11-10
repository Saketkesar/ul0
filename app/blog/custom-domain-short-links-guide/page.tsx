import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowLeft, Globe, ShieldCheck, TrendingUp, Check, X, Sparkles, ExternalLink } from "lucide-react"

export const metadata: Metadata = {
  title: "URL Shortener with Custom Domain: Free Setup & Comparison 2026 | UL0",
  description: "Looking for a URL shortener with custom domain? Compare the best free and low-cost custom domain link shorteners in 2026. Free SSL, 307 redirects, and no monthly fees.",
  keywords: [
    "url shortener with custom domain",
    "custom domain url shortener",
    "free custom domain url shortener",
    "branded link shortener free",
    "url shortener custom domain free",
    "best custom domain url shortener",
    "bitly custom domain free alternative",
  ],
  alternates: {
    canonical: "https://ul0.site/blog/custom-domain-short-links-guide",
  },
  openGraph: {
    title: "URL Shortener with Custom Domain: Free Setup & Comparison 2026",
    description: "Compare the best URL shorteners with custom domain support. Discover how to connect your brand domain for $0 forever with SSL included.",
    url: "https://ul0.site/blog/custom-domain-short-links-guide",
    type: "article",
    publishedTime: "2026-03-10",
    images: [{
      url: "https://ul0.site/social-card.png",
      width: 1200,
      height: 630,
      alt: "URL Shortener with Custom Domain Guide",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "URL Shortener with Custom Domain: Free Setup & Comparison 2026",
    description: "Compare the best URL shorteners with custom domain support. Discover how to connect your brand domain for $0 forever with SSL included.",
    images: ["https://ul0.site/social-card.png"],
  },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "URL Shortener with Custom Domain: Free Setup & Comparison 2026",
  description: "A comprehensive guide to URL shorteners with custom domain support. Compare free plans, DNS CNAME configuration, and CTR growth data.",
  image: "https://ul0.site/social-card.png",
  datePublished: "2026-03-10",
  dateModified: "2026-11-10",
  author: {
    "@type": "Person",
    name: "Saket Kesar",
    url: "https://ul0.site/about",
  },
  publisher: {
    "@type": "Organization",
    name: "UL0",
    logo: {
      "@type": "ImageObject",
      url: "https://ul0.site/ul0.png",
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://ul0.site/blog/custom-domain-short-links-guide",
  },
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://ul0.site" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://ul0.site/blog" },
    { "@type": "ListItem", position: 3, name: "URL Shortener with Custom Domain", item: "https://ul0.site/blog/custom-domain-short-links-guide" },
  ],
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can I get a URL shortener with a custom domain for free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. UL0 (ul0.site) gives you 1 branded custom domain completely free forever ($0/month), including automated Let's Encrypt SSL certificates, unlimited link creation, and fast 307 edge redirects with zero credit card required.",
      },
    },
    {
      "@type": "Question",
      name: "Why does Bitly charge $35/month for custom domains?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Bitly targets enterprise enterprise marketing departments and locks custom domain functionality behind its $35/month Growth plan. Free alternatives like UL0 make custom domain link shortening accessible to creators, startups, and small businesses for $0.",
      },
    },
    {
      "@type": "Question",
      name: "How do I connect my domain to a custom domain URL shortener?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Log into your domain registrar (such as Cloudflare, Namecheap, GoDaddy, or Porkbun), add a CNAME DNS record pointing your subdomain (e.g., link.yourbrand.com) to cname.ul0.site, and add the domain in your UL0 dashboard. Your SSL certificate issues automatically within minutes.",
      },
    },
    {
      "@type": "Question",
      name: "Do custom domain short links increase click-through rates (CTR)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Industry studies demonstrate that branded short links increase CTR by up to 39% compared to generic shortened URLs like bit.ly or tinyurl.com because visitors recognize and trust your brand name.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use an apex domain (yourbrand.com) or just a subdomain?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "You can use either a subdomain (such as go.yourbrand.com or link.yourbrand.com) via CNAME, or an apex root domain (yourbrand.link) via ALIAS / ANAME or Cloudflare CNAME Flattening.",
      },
    },
  ],
}

const competitors = [
  {
    name: "UL0",
    freeDomain: "1 Domain Free Forever",
    monthlyPrice: "$0 (Free Forever)",
    freeLinksPerMonth: "Unlimited",
    sslIncluded: true,
    highlight: true,
  },
  {
    name: "Bitly",
    freeDomain: "0 (Requires $35/mo)",
    monthlyPrice: "$35.00 / mo",
    freeLinksPerMonth: "5 links / mo",
    sslIncluded: true,
    highlight: false,
  },
  {
    name: "Rebrandly",
    freeDomain: "0 (Requires $13/mo)",
    monthlyPrice: "$13.00 / mo",
    freeLinksPerMonth: "10 links / mo",
    sslIncluded: true,
    highlight: false,
  },
  {
    name: "Dub.co",
    freeDomain: "3 Domains Free",
    monthlyPrice: "Free (1k clicks cap)",
    freeLinksPerMonth: "25 links / mo",
    sslIncluded: true,
    highlight: false,
  },
  {
    name: "TinyURL",
    freeDomain: "0 (Requires $12.99/mo)",
    monthlyPrice: "$12.99 / mo",
    freeLinksPerMonth: "No custom domain",
    sslIncluded: false,
    highlight: false,
  },
]

export default function CustomDomainShortLinksGuidePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header />

      <main className="flex-1 py-8 sm:py-12">
        <article className="container mx-auto px-4 max-w-4xl space-y-8">
          <Link
            href="/blog"
            className="inline-flex items-center text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            <span>Back to All Guides</span>
          </Link>

          {/* Header */}
          <header className="space-y-4 border-b border-border pb-8">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary px-3 py-1 rounded-full">
                Custom Domain Shortener Guide 2026
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground leading-tight">
              URL Shortener with Custom Domain: Free Setup & Comparison 2026
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Why pay \$35/month to Bitly just to use your own domain? Discover how modern URL shorteners allow you to connect a branded custom domain for \$0 forever with automated SSL certificates, unlimited link creation, and fast 307 edge redirects.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2">
              <span>Author: <strong className="text-foreground">Saket Kesar</strong></span>
              <span>•</span>
              <span>Updated: November 10, 2026</span>
              <span>•</span>
              <span>7 min read</span>
            </div>
          </header>

          <div className="prose prose-neutral dark:prose-invert max-w-none text-foreground text-sm sm:text-base leading-relaxed space-y-6">
            <p className="text-lg leading-relaxed text-foreground font-medium">
              Every marketing email, social bio link, and SMS campaign you publish reflects your brand equity. When customers see a generic short link like <code className="text-xs bg-muted px-1.5 py-0.5 rounded">bit.ly/3x8Qp9</code>, they hesitate. When they see <code className="text-xs bg-muted px-1.5 py-0.5 rounded">go.yourbrand.com/summer-sale</code>, trust surges, click-through rates rise by up to 39%, and spam filters remain clear.
            </p>

            <h2 className="text-2xl font-bold text-foreground mt-8">
              Why You Need a URL Shortener with a Custom Domain
            </h2>

            <div className="grid gap-4 sm:grid-cols-3 my-6 not-prose">
              <div className="rounded-xl border border-border bg-card p-5 space-y-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-foreground">39% Higher CTR</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Audiences recognize your brand name instantly, drastically reducing link hesitation and boosting click rates across social, SMS, and bio links.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 space-y-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-foreground">Spam Filter Protection</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Generic shared shorteners get flagged when scammers abuse them. Your dedicated custom domain isolates your sender reputation permanently.
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 space-y-2">
                <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Globe className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-foreground">100% Asset Ownership</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  If you ever change hosting or CMS providers, you own the domain. Your short links never break, expire, or get held hostage.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground mt-10">
              Custom Domain URL Shortener Comparison: 2026 Pricing
            </h2>
            <p>
              Many legacy shorteners treat custom domains as an expensive luxury feature. Here is an honest breakdown of the top custom domain shorteners available today:
            </p>

            {/* Comparison Table */}
            <div className="overflow-x-auto not-prose my-6 rounded-xl border border-border bg-card">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead className="bg-muted/50 border-b border-border text-foreground font-semibold">
                  <tr>
                    <th className="p-3 sm:p-4">Platform</th>
                    <th className="p-3 sm:p-4">Custom Domains Included</th>
                    <th className="p-3 sm:p-4">Monthly Cost</th>
                    <th className="p-3 sm:p-4">Free Link Cap</th>
                    <th className="p-3 sm:p-4">Automated SSL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {competitors.map((c) => (
                    <tr key={c.name} className={c.highlight ? "bg-primary/5 font-medium" : ""}>
                      <td className="p-3 sm:p-4 font-bold text-foreground flex items-center gap-1.5">
                        {c.name}
                        {c.highlight && (
                          <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full font-mono">
                            Best Value
                          </span>
                        )}
                      </td>
                      <td className="p-3 sm:p-4 text-muted-foreground">{c.freeDomain}</td>
                      <td className="p-3 sm:p-4 font-mono font-semibold text-foreground">{c.monthlyPrice}</td>
                      <td className="p-3 sm:p-4 text-muted-foreground">{c.freeLinksPerMonth}</td>
                      <td className="p-3 sm:p-4">
                        {c.sslIncluded ? (
                          <span className="text-emerald-500 font-semibold inline-flex items-center gap-1">
                            <Check className="h-3.5 w-3.5" /> Included
                          </span>
                        ) : (
                          <span className="text-rose-500 font-semibold inline-flex items-center gap-1">
                            <X className="h-3.5 w-3.5" /> None
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-foreground mt-10">
              How to Connect Your Custom Domain to UL0 (Step-by-Step)
            </h2>
            <p>
              Setting up your branded short domain takes less than 3 minutes. Follow these simple steps:
            </p>

            <ol className="space-y-4 list-decimal pl-6 text-foreground">
              <li>
                <strong>Choose your branded short domain:</strong> You can register a short branded domain (e.g., <code className="text-xs bg-muted px-1.5 py-0.5 rounded">acme.link</code>) or use a subdomain of your existing site (e.g., <code className="text-xs bg-muted px-1.5 py-0.5 rounded">go.acme.com</code>).
              </li>
              <li>
                <strong>Log into your DNS Provider:</strong> Open Cloudflare, Namecheap, GoDaddy, Porkbun, or AWS Route53.
              </li>
              <li>
                <strong>Add a CNAME DNS Record:</strong>
                <div className="bg-muted/70 p-3 rounded-lg font-mono text-xs my-2 text-foreground space-y-1">
                  <div>Type: <strong>CNAME</strong></div>
                  <div>Name / Host: <strong>go</strong> (or <strong>link</strong> or <strong>@</strong>)</div>
                  <div>Target / Value: <strong>cname.ul0.site</strong></div>
                  <div>TTL: <strong>Auto</strong> or <strong>300s</strong> (Proxy status: DNS only if using Cloudflare)</div>
                </div>
              </li>
              <li>
                <strong>Add Domain to UL0:</strong> Head to your <Link href="/dashboard/domains" className="text-primary hover:underline font-semibold">UL0 Custom Domains Dashboard</Link> and enter your domain name.
              </li>
              <li>
                <strong>Automatic SSL Verification:</strong> Our edge infrastructure validates your DNS propagation within minutes and issues a free Let&apos;s Encrypt TLS certificate automatically.
              </li>
            </ol>

            <h2 className="text-2xl font-bold text-foreground mt-10">
              Why 307 Edge Redirects Matter for Custom Domains
            </h2>
            <p>
              Legacy shorteners like Bitly use HTTP 301 Permanent Redirects. 301 redirects are cached permanently in visitor browsers. If you ever need to change the destination of a promotional campaign or fix a broken URL, users who already clicked won&apos;t see the update.
            </p>
            <p>
              UL0 utilizes <strong>HTTP 307 Temporary Redirects</strong> executed at the global edge. This guarantees:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-foreground">
              <li><strong>Zero Click Caching:</strong> Every single click is accurately counted in your real-time analytics.</li>
              <li><strong>Live Destination Editing:</strong> Update your destination link anytime without broken links.</li>
              <li><strong>Sub-50ms Latency:</strong> Global edge resolution ensures lightning-fast redirection worldwide.</li>
            </ul>

            {/* Embedded Conversion Card */}
            <div className="my-10 p-6 sm:p-8 rounded-2xl border border-primary/30 bg-primary/5 text-center space-y-4 not-prose">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                <Sparkles className="h-3.5 w-3.5" /> 100% Free Custom Domain Setup
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                Connect Your Branded Custom Domain with UL0 Today
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto">
                No credit card required. Connect 1 branded custom domain for \$0 forever with automated SSL certificates, unlimited links, and dynamic vector QR codes.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
                >
                  <span>Shorten a URL Free</span>
                </Link>
                <Link
                  href="/custom-domain-landing"
                  className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <span>Explore Custom Domains</span>
                </Link>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">
              Frequently Asked Questions (FAQ)
            </h2>
            <div className="space-y-3 not-prose">
              <details className="group rounded-xl border border-border bg-card p-4">
                <summary className="text-sm font-semibold text-foreground cursor-pointer flex items-center justify-between select-none">
                  <span>Can I get a URL shortener with a custom domain for free?</span>
                  <span className="text-xs font-mono text-muted-foreground group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Yes. UL0 (ul0.site) gives you 1 branded custom domain completely free forever ($0/month), including automated Let&apos;s Encrypt SSL certificates, unlimited link creation, and fast 307 edge redirects with zero credit card required.
                </p>
              </details>

              <details className="group rounded-xl border border-border bg-card p-4">
                <summary className="text-sm font-semibold text-foreground cursor-pointer flex items-center justify-between select-none">
                  <span>Why does Bitly charge $35/month for custom domains?</span>
                  <span className="text-xs font-mono text-muted-foreground group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Bitly targets enterprise corporate marketing departments and locks custom domain functionality behind its $35/month Growth plan. Free alternatives like UL0 make custom domain link shortening accessible to creators, startups, and small businesses for $0.
                </p>
              </details>

              <details className="group rounded-xl border border-border bg-card p-4">
                <summary className="text-sm font-semibold text-foreground cursor-pointer flex items-center justify-between select-none">
                  <span>How do I connect my domain to a custom domain URL shortener?</span>
                  <span className="text-xs font-mono text-muted-foreground group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Log into your domain registrar (such as Cloudflare, Namecheap, GoDaddy, or Porkbun), add a CNAME DNS record pointing your subdomain (e.g., link.yourbrand.com) to cname.ul0.site, and add the domain in your UL0 dashboard. Your SSL certificate issues automatically within minutes.
                </p>
              </details>

              <details className="group rounded-xl border border-border bg-card p-4">
                <summary className="text-sm font-semibold text-foreground cursor-pointer flex items-center justify-between select-none">
                  <span>Do custom domain short links increase click-through rates (CTR)?</span>
                  <span className="text-xs font-mono text-muted-foreground group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  Yes. Industry studies demonstrate that branded short links increase CTR by up to 39% compared to generic shortened URLs like bit.ly or tinyurl.com because visitors recognize and trust your brand name.
                </p>
              </details>

              <details className="group rounded-xl border border-border bg-card p-4">
                <summary className="text-sm font-semibold text-foreground cursor-pointer flex items-center justify-between select-none">
                  <span>Can I use an apex domain (yourbrand.com) or just a subdomain?</span>
                  <span className="text-xs font-mono text-muted-foreground group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  You can use either a subdomain (such as go.yourbrand.com or link.yourbrand.com) via CNAME, or an apex root domain (yourbrand.link) via ALIAS / ANAME or Cloudflare CNAME Flattening.
                </p>
              </details>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
