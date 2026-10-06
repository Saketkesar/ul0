import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowLeft, Check, Sparkles, User, Calendar, Clock, ArrowRight, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Cheapest Custom Domain Link Shortener (2026 Comparison) | UL0",
  description:
    "Compare the cheapest custom domain link shorteners in 2026. Discover free and budget-friendly branded short link tools including UL0, Dub.co, Bitly, and Rebrandly.",
  alternates: {
    canonical: "https://ul0.site/blog/cheapest-custom-domain-link-shortener",
  },
  openGraph: {
    title: "Cheapest Custom Domain Link Shortener (2026 Comparison) | UL0",
    description:
      "Looking for a budget-friendly custom domain shortener? Compare the best free and low-cost branded link platforms.",
    url: "https://ul0.site/blog/cheapest-custom-domain-link-shortener",
    type: "article",
    publishedTime: "2026-07-06",
    modifiedTime: "2026-10-06",
  },
}

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Cheapest Custom Domain Link Shortener (2026 Comparison)",
  description:
    "Compare the cheapest custom domain URL shorteners in 2026. Discover free and budget-friendly branded link tools.",
  image: "https://ul0.site/social-card.png",
  author: {
    "@type": "Person",
    name: "Saket Kesar",
    jobTitle: "Founder & Developer",
    url: "https://ul0.site/about",
    sameAs: "https://github.com/Saketkesar",
  },
  publisher: {
    "@type": "Organization",
    name: "UL0",
    logo: { "@type": "ImageObject", url: "https://ul0.site/ul0.png" },
  },
  datePublished: "2026-07-06",
  dateModified: "2026-10-06",
  mainEntityOfPage: "https://ul0.site/blog/cheapest-custom-domain-link-shortener",
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://ul0.site" },
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://ul0.site/blog" },
    {
      "@type": "ListItem",
      position: 3,
      name: "Cheapest Custom Domain Link Shortener",
      item: "https://ul0.site/blog/cheapest-custom-domain-link-shortener",
    },
  ],
}

const alternatives = [
  {
    name: "UL0",
    tagline: "Free Custom Domain Tier & Lowest Pro Upgrades",
    description:
      "UL0 provides full custom domain link shortening on its free tier with automated Let's Encrypt SSL, edge 301 redirects, and zero signup required for standard link creation. For power users managing multiple client brands, Pro starts at just $2/mo.",
    features: [
      "1 Custom domain included free",
      "Automatic Let's Encrypt SSL certificates",
      "HTTP 301 Permanent Redirects",
      "Free dynamic vector QR code generator",
      "Pro plan starts at just $2/mo for 3 domains",
    ],
    limitations: [
      "Free tier custom domain limited to 1 domain",
      "No enterprise SSO SAML (designed for indie creators & small teams)",
    ],
    price: "Free / $2/mo Pro",
    verdict: "Best for: Creators, startups, and marketing teams looking for branded short links without a $35/mo subscription.",
    url: "https://ul0.site/custom-domain-landing",
  },
  {
    name: "Dub.co",
    tagline: "Developer-First Modern Platform",
    description:
      "Dub.co is a modern open-source link management engine with excellent developer APIs, analytics, and team workspaces. Their free tier includes 3 custom domains with 50k clicks/month, though high-volume pro features cost $24/month.",
    features: [
      "Generous free tier (3 custom domains)",
      "High quality REST API and TypeScript SDK",
      "Advanced geo and device targeting",
      "Clean dashboard UX",
    ],
    limitations: [
      "Pro plan starts at $24/mo",
      "Click limits on free tier trigger upgrade prompts",
      "Account registration strictly required",
    ],
    price: "Free / $24/mo Pro",
    verdict: "Best for: High-growth SaaS engineering teams needing complex API integrations and webhook routing.",
    url: "https://dub.co",
  },
  {
    name: "Bitly",
    tagline: "Legacy Brand with Premium Enterprise Pricing",
    description:
      "Bitly is the most recognized brand in link shortening. However, custom domain support is locked behind their Core plan at $35/month ($29/mo annual). Their free plan does not support custom domains and limits users to only 5 short links per month.",
    features: [
      "Deep enterprise ecosystem & Salesforce integrations",
      "Long domain history and brand recognition",
      "SOC 2 compliance on Enterprise",
    ],
    limitations: [
      "Custom domains require $35/mo Core plan",
      "Free plan strictly capped at 5 links/month",
      "Aggressive upgrade paywalls for basic features",
    ],
    price: "$35/mo (Core plan billed monthly) or $29/mo annual",
    verdict: "Best for: Large corporate enterprises with existing legacy MarTech stacks that require SOC 2 vendor compliance.",
    url: "https://bitly.com",
  },
  {
    name: "TinyURL",
    tagline: "Traditional URL Shortener with Pro Domain Addon",
    description:
      "TinyURL has offered simple shortening since 2002. Basic shortening is free without an account, but connecting your own custom branded domain requires their TinyURL Pro plan starting at $12.99/month ($9.99/mo annual).",
    features: [
      "Free basic link shortening without signup",
      "Historical name recognition",
      "Campaign tagging on paid plans",
    ],
    limitations: [
      "Zero custom domains on free plan",
      "Pro plan starts at $12.99/mo",
      "Dated dashboard interface compared to modern tools",
    ],
    price: "Free basic / $12.99/mo Pro",
    verdict: "Best for: Casual users shortening individual links on the tinyurl.com domain.",
    url: "https://tinyurl.com",
  },
  {
    name: "Rebrandly",
    tagline: "Domain-Centric Marketing Platform",
    description:
      "Rebrandly focuses heavily on branded short links. While historically generous, their current pricing structures require their Essentials tier at $13/month for custom domain usage beyond introductory limits.",
    features: [
      "Multi-domain routing",
      "Retargeting pixels and tracking tags",
      "Extensive marketing team workflows",
    ],
    limitations: [
      "Free plan has strict monthly click limits",
      "Rapid price escalation for additional domains and users",
      "Account signup mandatory",
    ],
    price: "Free / $13/mo Essentials",
    verdict: "Best for: Marketing agencies requiring retargeting pixels embedded into short link flows.",
    url: "https://rebrandly.com",
  },
]

export default function CheapestCustomDomainPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Header />

      <main className="flex-1 py-8 sm:py-12">
        <article className="container mx-auto px-4 max-w-4xl">
          <Link
            href="/blog"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Blog Guides
          </Link>

          <header className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary">Pricing &amp; Tools</Badge>
              <Badge variant="outline">Verified Oct 2026</Badge>
            </div>
            <h1 className="text-3xl font-extrabold mb-4 sm:text-4xl text-foreground">
              Cheapest Custom Domain Link Shortener (2026 Comparison)
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-y py-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <Link href="/about" className="hover:underline text-foreground font-medium">
                  Saket Kesar
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>Updated Oct 6, 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>7 min read</span>
              </div>
            </div>
          </header>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 leading-relaxed">
            <p className="text-lg text-muted-foreground">
              Using a <strong>custom branded domain</strong> (such as <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-sm text-foreground">go.yourbrand.com/deal</code>) rather than a generic shortener increases audience click confidence, prevents email spam triggers, and complies with mobile carrier 10DLC SMS guidelines. However, legacy players like Bitly paywall custom domain delegation behind steep $35/month tiers.
            </p>

            <p className="text-muted-foreground">
              If you want the <strong>cheapest custom domain link shortener</strong> that includes automated Let&apos;s Encrypt SSL, fast HTTP 301 edge redirection, and click tracking without locking you into expensive multi-year contracts, this fact-checked 2026 guide breaks down the best options.
            </p>

            {/* Winner Callout */}
            <div className="not-prose rounded-2xl border border-primary/20 bg-primary/5 p-6 my-6 flex items-start gap-4">
              <Sparkles className="h-5 w-5 text-primary mt-1 shrink-0" />
              <div className="space-y-1">
                <h3 className="font-bold text-foreground text-base">The Free &amp; Budget Leader: UL0</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong>UL0</strong> is the lowest-cost solution for creators and businesses. It offers <strong>1 custom domain completely free</strong> with automated SSL and edge 301 redirects. For growing agencies and teams managing multiple domains, Pro starts at just <strong>$2/month</strong> ($24/year). Check out the <Link href="/custom-domain-landing" className="text-primary font-semibold hover:underline">UL0 Custom Domain Overview</Link> or follow the <Link href="/blog/custom-domain-dns-cname-setup-guide" className="text-primary font-semibold hover:underline">CNAME Setup Guide</Link>.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Pricing &amp; Limits Comparison Table</h2>
            <div className="not-prose overflow-x-auto my-6 rounded-xl border shadow-xs">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-muted/70 border-b">
                    <th className="p-3.5 font-semibold text-foreground">Provider</th>
                    <th className="p-3.5 font-semibold text-foreground">Free Custom Domain?</th>
                    <th className="p-3.5 font-semibold text-foreground">Lowest Plan for Domains</th>
                    <th className="p-3.5 font-semibold text-foreground">Best Value Use Case</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr className="bg-primary/5">
                    <td className="p-3.5 font-bold text-primary">UL0</td>
                    <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-bold">Yes (1 Free Domain)</td>
                    <td className="p-3.5 font-bold text-foreground">$0 / mo (Pro $2/mo)</td>
                    <td className="p-3.5 text-muted-foreground">Indie creators, small businesses, marketing agencies</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-foreground">Dub.co</td>
                    <td className="p-3.5 text-emerald-600 dark:text-emerald-400 font-semibold">Yes (3 Domains, limits apply)</td>
                    <td className="p-3.5 text-foreground">$0 / mo (Pro $24/mo)</td>
                    <td className="p-3.5 text-muted-foreground">Developer teams needing advanced API routing</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-foreground">Rebrandly</td>
                    <td className="p-3.5 text-muted-foreground">Limited trial</td>
                    <td className="p-3.5 text-foreground">$13 / mo (Essentials)</td>
                    <td className="p-3.5 text-muted-foreground">Marketing teams needing ad retargeting pixels</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-foreground">TinyURL</td>
                    <td className="p-3.5 text-rose-500 font-medium">No (Paid Only)</td>
                    <td className="p-3.5 text-foreground">$12.99 / mo ($9.99 annual)</td>
                    <td className="p-3.5 text-muted-foreground">Users wanting the traditional TinyURL brand name</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-semibold text-foreground">Bitly</td>
                    <td className="p-3.5 text-rose-500 font-medium">No (Paid Only)</td>
                    <td className="p-3.5 text-foreground">$35 / mo ($29 annual Core)</td>
                    <td className="p-3.5 text-muted-foreground">Enterprises requiring legacy SOC 2 compliance</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">In-Depth Platform Reviews</h2>

            <div className="not-prose space-y-6">
              {alternatives.map((alt, index) => (
                <div key={alt.name} className="rounded-2xl border p-6 bg-card text-card-foreground shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {index + 1}
                      </span>
                      <h3 className="text-xl font-bold text-foreground">{alt.name}</h3>
                    </div>
                    <span className="text-xs font-semibold bg-muted px-3 py-1 rounded-full text-foreground w-fit">
                      {alt.price}
                    </span>
                  </div>
                  <p className="text-xs text-primary font-medium mb-3">{alt.tagline}</p>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{alt.description}</p>

                  <div className="grid sm:grid-cols-2 gap-4 mb-4 text-xs">
                    <div>
                      <h4 className="font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
                        Strengths &amp; Features
                      </h4>
                      <ul className="space-y-1.5 text-muted-foreground">
                        {alt.features.map((f) => (
                          <li key={f} className="flex items-start gap-1.5">
                            <Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Constraints &amp; Limits
                      </h4>
                      <ul className="space-y-1.5 text-muted-foreground">
                        {alt.limitations.map((l) => (
                          <li key={l} className="flex items-start gap-1.5">
                            <span className="text-muted-foreground/60">•</span>
                            <span>{l}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <span className="text-muted-foreground italic">{alt.verdict}</span>
                    {alt.name === "UL0" ? (
                      <Link href="/custom-domain-landing" className="font-semibold text-primary hover:underline inline-flex items-center gap-1">
                        <span>Try UL0 Custom Domains Free →</span>
                      </Link>
                    ) : (
                      <a
                        href={alt.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                      >
                        <span>Visit {alt.name}</span>
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">How to Get Started with a Free Custom Domain</h2>
            <p className="text-muted-foreground">
              Setting up a custom domain takes less than 3 minutes. You keep your domain registered at your current registrar (Cloudflare, Namecheap, GoDaddy, etc.) and simply add a CNAME record:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-muted-foreground text-sm">
              <li>Log in to your registrar and select your domain.</li>
              <li>Add a <strong>CNAME record</strong> for your subdomain (e.g., host <code className="bg-muted px-1 rounded font-mono">go</code>) pointing to <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-primary font-bold">cname.ul0.site</code>.</li>
              <li>Visit your <Link href="/dashboard/domains" className="text-primary hover:underline font-semibold">UL0 Domains Dashboard</Link> and click &quot;Connect Domain&quot;.</li>
              <li>Our edge infrastructure verifies your DNS within minutes and automatically generates a free Let&apos;s Encrypt SSL certificate.</li>
            </ol>
          </div>

          {/* Author Card */}
          <div className="mt-12 p-6 rounded-2xl border bg-muted/30 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xl shrink-0">
              SK
            </div>
            <div>
              <h3 className="font-bold text-foreground">
                Written by <Link href="/about" className="hover:underline text-primary">Saket Kesar</Link>
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                Founder &amp; Developer at UL0. Analyzing URL infrastructure economics, deliverability benchmarks, and developer tooling. Connect on <a href="https://github.com/Saketkesar" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub</a>.
              </p>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
