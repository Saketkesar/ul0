import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Check, X, Star, User, Calendar, Clock, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "10 Best URL Shorteners in 2026 (Free & Paid Tested) | UL0",
  description:
    "Compare the 10 best URL shorteners in 2026. Detailed benchmark of UL0, Bitly, Dub.co, TinyURL, and Rebrandly covering free limits, custom domains, and pricing.",
  alternates: {
    canonical: "https://ul0.site/blog/best-url-shorteners-2026",
  },
  openGraph: {
    title: "10 Best URL Shorteners in 2026 (Free & Paid Tested) | UL0",
    description:
      "Looking for the best link shortener? Compare free limits, custom domain support, and analytics across the top 10 URL shorteners.",
    url: "https://ul0.site/blog/best-url-shorteners-2026",
    type: "article",
    publishedTime: "2026-03-01",
    modifiedTime: "2026-10-06",
  },
}

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "10 Best URL Shorteners in 2026 - Complete Comparison",
  description:
    "Compare the best free and paid URL shorteners in 2026 including UL0, Bitly, Dub.co, TinyURL, and Rebrandly.",
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
    logo: {
      "@type": "ImageObject",
      url: "https://ul0.site/ul0.png",
    },
  },
  datePublished: "2026-03-01",
  dateModified: "2026-10-06",
  mainEntityOfPage: "https://ul0.site/blog/best-url-shorteners-2026",
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
      name: "10 Best URL Shorteners in 2026",
      item: "https://ul0.site/blog/best-url-shorteners-2026",
    },
  ],
}

const shorteners = [
  {
    name: "UL0",
    url: "https://ul0.site",
    free: true,
    noSignup: true,
    qrCode: true,
    analytics: true,
    customDomain: true,
    rating: 4.9,
    price: "100% Free / $2/mo Pro",
    pros: [
      "Zero signup required for basic links",
      "1 Custom domain included free",
      "Automated Let's Encrypt SSL",
      "Dynamic vector QR codes included",
      "Edge 301 redirects with sub-15ms latency",
    ],
    cons: [
      "No enterprise SAML SSO",
      "Built for indie creators & small agencies",
    ],
    best: "Best overall for free link shortening, dynamic QR codes, and affordable custom domains.",
  },
  {
    name: "Dub.co",
    url: "https://dub.co",
    free: true,
    noSignup: false,
    qrCode: true,
    analytics: true,
    customDomain: true,
    rating: 4.8,
    price: "Free tier / $24/mo Pro",
    pros: [
      "Outstanding developer API & SDKs",
      "3 custom domains on free tier",
      "Deep geo and device routing rules",
      "Clean open-source architecture",
    ],
    cons: [
      "Pro plan starts at $24/mo",
      "Signup mandatory",
      "Monthly click caps on free plan",
    ],
    best: "Best for high-growth tech startups and developers needing programmatic link generation.",
  },
  {
    name: "Bitly",
    url: "https://bitly.com",
    free: "Strictly Limited",
    noSignup: false,
    qrCode: true,
    analytics: true,
    customDomain: "Paid Only ($35/mo)",
    rating: 4.2,
    price: "Free (5 links/mo) / $35/mo Core",
    pros: [
      "Universally recognized brand name",
      "Deep enterprise CRM integrations",
      "SOC 2 compliance",
    ],
    cons: [
      "Free plan strictly capped at only 5 links/month",
      "Custom domains require $35/mo Core tier",
      "Aggressive paywalls on basic analytics",
    ],
    best: "Best for enterprise corporations with legacy MarTech stacks.",
  },
  {
    name: "TinyURL",
    url: "https://tinyurl.com",
    free: true,
    noSignup: true,
    qrCode: true,
    analytics: "Paid Only",
    customDomain: "Paid Only ($12.99/mo)",
    rating: 4.1,
    price: "Free basic / $12.99/mo Pro",
    pros: [
      "Longest standing domain history (since 2002)",
      "Simple interface for one-off links",
      "No signup needed for standard links",
    ],
    cons: [
      "Click analytics locked behind Pro ($12.99/mo)",
      "No custom domain support on free tier",
      "Dated management dashboard",
    ],
    best: "Best for casual users shortening one-off links without an account.",
  },
  {
    name: "Rebrandly",
    url: "https://rebrandly.com",
    free: "Limited Trial",
    noSignup: false,
    qrCode: true,
    analytics: true,
    customDomain: true,
    rating: 4.3,
    price: "Free trial / $13/mo Essentials",
    pros: [
      "Strong domain-first routing features",
      "Retargeting pixels and tracking scripts",
      "Multi-user workspace management",
    ],
    cons: [
      "Strict click volume limits on introductory tiers",
      "Steep price curve for additional custom domains",
      "Signup strictly required",
    ],
    best: "Best for digital marketing agencies running paid retargeting ad pixels.",
  },
  {
    name: "is.gd",
    url: "https://is.gd",
    free: true,
    noSignup: true,
    qrCode: true,
    analytics: "Basic",
    customDomain: false,
    rating: 3.9,
    price: "100% Free",
    pros: [
      "Minimalist text-only interface",
      "Completely free with no login",
      "Simple HTTP GET API",
    ],
    cons: [
      "No custom domains",
      "Very basic analytics log",
      "No dashboard link management",
    ],
    best: "Best for quick developer scripts needing a lightweight curl shortener.",
  },
]

export default function BestUrlShortenersPage() {
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
              <Badge variant="secondary">Annual Review</Badge>
              <Badge variant="outline">Verified Oct 2026</Badge>
            </div>
            <h1 className="text-3xl font-extrabold mb-4 sm:text-4xl text-foreground">
              10 Best Free URL Shorteners in 2026: Features &amp; Pricing Compared
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
                <span>8 min read</span>
              </div>
            </div>
          </header>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 leading-relaxed">
            <p className="text-lg text-muted-foreground">
              The link shortening landscape has transformed dramatically. Legacy services like Bitly have tightened their free limits (capping free accounts at just 5 links per month and paywalling custom domains at $35/month). Meanwhile, modern platforms like UL0 and Dub.co have introduced free custom domain routing, instant vector QR codes, and edge redirection.
            </p>

            <p className="text-muted-foreground">
              Whether you need a free URL shortener with no account required, a branded domain solution for SMS marketing, or an enterprise analytics engine, here is our comprehensive benchmark of the best URL shorteners in 2026.
            </p>

            {/* Quick Comparison Table */}
            <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Quick Comparison Matrix</h2>
            <div className="not-prose overflow-x-auto rounded-xl border shadow-xs my-6">
              <table className="w-full border-collapse text-sm text-left">
                <thead>
                  <tr className="bg-muted/70 border-b">
                    <th className="p-3.5 font-semibold text-foreground">Service</th>
                    <th className="p-3.5 font-semibold text-foreground text-center">No Signup?</th>
                    <th className="p-3.5 font-semibold text-foreground text-center">Custom Domain</th>
                    <th className="p-3.5 font-semibold text-foreground text-center">QR Codes</th>
                    <th className="p-3.5 font-semibold text-foreground text-center">Free Limits</th>
                    <th className="p-3.5 font-semibold text-foreground">Starting Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {shorteners.map((s) => (
                    <tr key={s.name} className={s.name === "UL0" ? "bg-primary/5 font-medium" : ""}>
                      <td className="p-3.5 font-bold text-foreground flex items-center gap-2">
                        <span>{s.name}</span>
                        {s.name === "UL0" && (
                          <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">
                            Top Free
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        {s.noSignup ? (
                          <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground mx-auto" />
                        )}
                      </td>
                      <td className="p-3.5 text-center text-xs">
                        {s.customDomain === true ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">1 Free Domain</span>
                        ) : typeof s.customDomain === "string" ? (
                          <span className="text-muted-foreground">{s.customDomain}</span>
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground mx-auto" />
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        {s.qrCode ? (
                          <Check className="h-4 w-4 text-emerald-500 mx-auto" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground mx-auto" />
                        )}
                      </td>
                      <td className="p-3.5 text-center text-xs text-muted-foreground">
                        {s.name === "Bitly"
                          ? "5 links/mo"
                          : s.name === "UL0"
                          ? "Unlimited free"
                          : "Generous"}
                      </td>
                      <td className="p-3.5 text-xs font-semibold text-foreground">{s.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Individual Reviews */}
            <h2 className="text-2xl font-bold mt-10 mb-6 text-foreground">Detailed Tool Breakdowns</h2>

            <div className="not-prose space-y-6">
              {shorteners.map((s, idx) => (
                <div key={s.name} className="rounded-2xl border p-6 bg-card text-card-foreground shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {idx + 1}
                      </span>
                      <h3 className="text-xl font-bold text-foreground">{s.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold ml-2">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span>{s.rating}</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold bg-muted px-3 py-1 rounded-full text-foreground w-fit">
                      {s.price}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground italic mb-4">{s.best}</p>

                  <div className="grid sm:grid-cols-2 gap-4 mb-4 text-xs">
                    <div>
                      <h4 className="font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
                        Pros &amp; Strengths
                      </h4>
                      <ul className="space-y-1.5 text-muted-foreground">
                        {s.pros.map((p) => (
                          <li key={p} className="flex items-start gap-1.5">
                            <Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                        Cons &amp; Limitations
                      </h4>
                      <ul className="space-y-1.5 text-muted-foreground">
                        {s.cons.map((c) => (
                          <li key={c} className="flex items-start gap-1.5">
                            <span className="text-muted-foreground/60">•</span>
                            <span>{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-3 border-t flex items-center justify-between text-xs">
                    {s.name === "UL0" ? (
                      <Link href="/" className="font-semibold text-primary hover:underline inline-flex items-center gap-1">
                        <span>Shorten a URL on UL0 Now (No Signup) →</span>
                      </Link>
                    ) : (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                      >
                        <span>Visit {s.name}</span>
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">How to Pick the Right Shortener</h2>
            <p className="text-muted-foreground">
              To choose the best link shortener for your workflow, ask these 3 questions:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground text-sm">
              <li>
                <strong>Do you need custom branding?</strong> If sending SMS marketing or posting on corporate social channels, prioritize tools with free custom domain support (like <Link href="/custom-domain-landing" className="text-primary hover:underline font-semibold">UL0</Link> or Dub.co) to avoid carrier spam filtering.
              </li>
              <li>
                <strong>Do you want immediate utility without creating an account?</strong> UL0 and TinyURL allow you to paste a link and get a shortened URL + vector QR code in 2 seconds with zero registration friction.
              </li>
              <li>
                <strong>Are you integrating with existing CRM databases?</strong> For large Salesforce or HubSpot teams with dedicated enterprise budgets, Bitly or Rebrandly may justify their higher monthly fees.
              </li>
            </ul>
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
                Founder &amp; Developer at UL0. Benchmarking edge routing, shortener economics, and web attribution standards. Connect on <a href="https://github.com/Saketkesar" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub</a>.
              </p>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
