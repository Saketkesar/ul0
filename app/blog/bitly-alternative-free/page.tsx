import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowLeft, Check, AlertTriangle, User, Calendar, Clock, Sparkles, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Best Free Bitly Alternatives in 2026 (No Limits, No Signup) | UL0",
  description:
    "Tired of Bitly's 5 link/month limit? Compare the best free Bitly alternatives in 2026 with unlimited links, custom domains, and dynamic QR codes.",
  alternates: {
    canonical: "https://ul0.site/blog/bitly-alternative-free",
  },
  openGraph: {
    title: "Best Free Bitly Alternatives in 2026 (No Limits, No Signup) | UL0",
    description:
      "Looking for a free Bitly alternative? Compare the best platforms offering unlimited short links, custom domains, and zero signup friction.",
    url: "https://ul0.site/blog/bitly-alternative-free",
    type: "article",
    publishedTime: "2026-03-01",
    modifiedTime: "2026-10-06",
  },
}

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Best Free Bitly Alternatives in 2026 (No Limits, No Signup)",
  description:
    "Looking for a free Bitly alternative? Compare the best free Bitly alternatives in 2026 with no monthly limits.",
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
  datePublished: "2026-03-01",
  dateModified: "2026-10-06",
  mainEntityOfPage: "https://ul0.site/blog/bitly-alternative-free",
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
      name: "Best Free Bitly Alternatives",
      item: "https://ul0.site/blog/bitly-alternative-free",
    },
  ],
}

const alternatives = [
  {
    name: "UL0",
    tagline: "Free Unlimited Links, Custom Domains & Zero Signup",
    description:
      "UL0 is the top modern Bitly alternative. It allows users to shorten links instantly with zero account registration, generates high-res vector QR codes, and includes 1 free custom domain with automated SSL. Pro plans start at just $2/mo.",
    features: [
      "Unlimited free links without signup",
      "1 free custom domain included with SSL",
      "Dynamic vector QR codes included",
      "HTTP 301 Permanent Redirects",
      "Clean privacy-first click analytics",
    ],
    limitations: [
      "No enterprise SAML SSO",
      "Free custom domain limited to 1 domain",
    ],
    price: "100% Free / $2/mo Pro",
    verdict: "Best for: Anyone frustrated by Bitly's 5-link cap who wants immediate, unrestricted link shortening.",
    url: "https://ul0.site",
  },
  {
    name: "Dub.co",
    tagline: "Developer-Focused Open Source Link Engine",
    description:
      "Dub.co offers a generous free tier including 3 custom domains and 50k clicks/month. It is built with an exceptional developer API, SDKs, and team collaboration workflows.",
    features: [
      "3 custom domains on free plan",
      "Powerful REST API and TypeScript SDK",
      "Geo and device routing",
      "Open source codebase",
    ],
    limitations: [
      "Account registration mandatory",
      "Pro plan starts at $24/mo",
      "Click caps on free tier",
    ],
    price: "Free tier / $24/mo Pro",
    verdict: "Best for: Engineering and SaaS teams needing advanced developer API integrations.",
    url: "https://dub.co",
  },
  {
    name: "TinyURL",
    tagline: "The Veteran Link Shortener (Since 2002)",
    description:
      "TinyURL has offered anonymous, signup-free shortening for over two decades. However, its free tier does not include analytics or custom domains, which require their $12.99/mo Pro plan.",
    features: [
      "Free basic link shortening without signup",
      "Custom back-half aliases",
      "Long historical stability",
    ],
    limitations: [
      "Zero click analytics on free tier",
      "No custom domain support on free plan",
      "Pro plan costs $12.99/mo",
    ],
    price: "Free basic / $12.99/mo Pro",
    verdict: "Best for: Casual one-off links when you do not need analytics or custom domains.",
    url: "https://tinyurl.com",
  },
  {
    name: "Rebrandly",
    tagline: "Custom Domain First Link Management",
    description:
      "Rebrandly specializes in branded links with custom domains. It provides deep retargeting pixel integrations for advertising agencies, but entry paid tiers start at $13/mo.",
    features: [
      "Custom domain mapping",
      "Ad retargeting pixels",
      "Multi-user workspaces",
    ],
    limitations: [
      "Account creation required",
      "Strict click caps on low tiers",
      "High costs for growing domain portfolios",
    ],
    price: "Free trial / $13/mo Essentials",
    verdict: "Best for: Marketing agencies requiring retargeting pixels embedded in links.",
    url: "https://rebrandly.com",
  },
]

export default function BitlyAlternativePage() {
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
              <Badge variant="secondary">Alternative Guide</Badge>
              <Badge variant="outline">Verified Oct 2026</Badge>
            </div>
            <h1 className="text-3xl font-extrabold mb-4 sm:text-4xl text-foreground">
              Best Free Bitly Alternatives in 2026: No 5-Link Limits, No Signup
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
              For years, <strong>Bitly</strong> was the default link shortening tool on the web. But in recent years, Bitly has severely reduced its free tier — restricting free accounts to just <strong>5 short links per month</strong>, paywalling custom domains at $35/month, and locking basic analytics behind aggressive paywalls.
            </p>

            <div className="not-prose rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5 my-6 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-amber-900 dark:text-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                <span>The State of Bitly&apos;s Free Plan in 2026</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Bitly&apos;s free tier now limits users to only 5 links and 3 custom back-halves per month. Custom domain support is completely removed from the free plan, requiring an upgrade to their Core plan ($35/month billed monthly, or $29/mo annual).
              </p>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-foreground">Why Users Are Leaving Bitly</h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">Severe 5 Link/Month Cap:</strong> If you share more than one link per week, you run out of free links within days.
              </li>
              <li>
                <strong className="text-foreground">Mandatory Account Signup:</strong> You cannot quickly shorten a single link anonymously without creating an account and verifying your email.
              </li>
              <li>
                <strong className="text-foreground">Custom Domains Behind Expensive Tiers:</strong> Connecting your own brand requires $35/month ($420/year).
              </li>
              <li>
                <strong className="text-foreground">Carrier Spam Issues:</strong> Shared <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">bit.ly</code> links frequently trigger automated SMS carrier spam blocks (10DLC rules) due to bad actors abusing the shared domain.
              </li>
            </ul>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">The Best Free Bitly Alternatives (Ranked)</h2>

            <div className="not-prose space-y-6 my-6">
              {alternatives.map((alt, index) => (
                <div key={alt.name} className="rounded-2xl border p-6 bg-card text-card-foreground shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {index + 1}
                      </span>
                      <h3 className="text-xl font-bold text-foreground">{alt.name}</h3>
                      {alt.name === "UL0" && (
                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold">
                          Best Overall
                        </span>
                      )}
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
                        Key Advantages
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
                        Considerations
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
                      <Link href="/" className="font-semibold text-primary hover:underline inline-flex items-center gap-1">
                        <span>Shorten Free on UL0 (No Signup) →</span>
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

            <h2 className="text-2xl font-bold mt-10 mb-4 text-foreground">Why UL0 is the Recommended Bitly Replacement</h2>
            <p className="text-muted-foreground">
              UL0 was engineered specifically to solve the friction points of Bitly. On UL0:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>
                You can shorten any URL right on the <Link href="/" className="text-primary hover:underline font-semibold">homepage</Link> without entering an email address or password.
              </li>
              <li>
                Every shortened link generates a downloadable <strong>SVG vector QR code</strong> instantly.
              </li>
              <li>
                You can connect your own <Link href="/custom-domain-landing" className="text-primary hover:underline font-semibold">branded custom domain</Link> for free with automated Let&apos;s Encrypt SSL certificates.
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
                Founder &amp; Developer at UL0. Benchmarking shortener APIs, deliverability protocols, and modern web infrastructure. Connect on <a href="https://github.com/Saketkesar" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GitHub</a>.
              </p>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
