import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight, Sparkles } from "lucide-react"
import { getPublishedSanityPosts } from "@/lib/sanity/client"

export const revalidate = 60 // Revalidate blog directory every 60 seconds for scheduled posts

export const metadata: Metadata = {
  title: "Link Management, QR Code & UTM Guides | UL0 Blog",
  description: "Guides, technical tutorials, and competitor breakdowns on branded short links, custom domain DNS CNAME configuration, dynamic QR codes, and link analytics.",
  alternates: {
    canonical: "https://ul0.site/blog",
  },
  openGraph: {
    title: "Link Management, QR Code & UTM Guides | UL0",
    description: "Guides, technical tutorials, and competitor breakdowns on branded short links, custom domain DNS CNAME configuration, dynamic QR codes, and link analytics.",
    url: "https://ul0.site/blog",
    type: "website",
    siteName: "UL0 Blog",
    images: [{
      url: "https://ul0.site/social-card.png",
      width: 1376,
      height: 768,
      alt: "UL0 Blog — URL Shortener Tips & Guides",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Link Management, QR Code & UTM Guides | UL0",
    description: "Guides, technical tutorials, and competitor breakdowns on branded short links, custom domain DNS CNAME configuration, dynamic QR codes, and link analytics.",
    images: ["https://ul0.site/social-card.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

interface BlogPostItem {
  slug: string
  title: string
  description: string
  category: string
  readTime: string
  date: string
  featured?: boolean
  coverImageUrl?: string
}

const staticBlogPosts: BlogPostItem[] = [
  {
    slug: "travel-agency-marketing-qr-codes-branded-links-guide-2026",
    title: "How Travel Agencies & Tour Operators Double Bookings with Branded Links & Dynamic QR Codes (2026 Guide)",
    description: "Discover how leading holiday planners and travel agencies like Vinigrow Holidays use branded short links and dynamic vector QR codes across travel itineraries, WhatsApp inquiries, and print holiday brochures to boost guest trust and double vacation bookings.",
    category: "Case Study",
    readTime: "6 min read",
    date: "2026-11-12",
    featured: true,
    coverImageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "bitly-vs-ul0-feature-pricing-comparison-2026",
    title: "Bitly vs UL0 (2026 Comparison): Why Paying $35/Month for Branded Links is Outdated",
    description: "An honest, side-by-side comparison between Bitly and UL0. Learn why creators and businesses are switching to UL0's free custom domain and cookieless analytics tier.",
    category: "Comparison",
    readTime: "5 min read",
    date: "2026-11-12",
    featured: true,
    coverImageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "how-to-create-dynamic-qr-codes-free-2026",
    title: "How to Create Free Dynamic QR Codes with Editable Destinations (2026 Guide)",
    description: "Learn how to generate free vector dynamic QR codes in SVG and PNG formats that let you change destination URLs anytime without reprinting physical packaging or flyers.",
    category: "Tutorials",
    readTime: "5 min read",
    date: "2026-11-12",
    featured: true,
    coverImageUrl: "https://images.unsplash.com/photo-1595079672139-545c0ec6f63e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "google-analytics-4-utm-campaign-tracking-guide",
    title: "The Complete GA4 UTM Campaign Tracking Guide for Marketers (2026)",
    description: "Master UTM parameters in Google Analytics 4. Learn how to tag campaigns accurately, avoid untracked direct traffic, and generate clean, branded tracking links.",
    category: "Analytics",
    readTime: "7 min read",
    date: "2026-11-12",
    featured: true,
    coverImageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "how-to-connect-custom-domain-url-shortener-dns",
    title: "How to Connect a Custom Domain to a URL Shortener (Cloudflare, GoDaddy & Namecheap CNAME Guide)",
    description: "Step-by-step DNS tutorial for connecting branded short link domains. Learn how to configure CNAME records, verify automated SSL certificates, and troubleshoot propagation.",
    category: "Branding",
    readTime: "6 min read",
    date: "2026-11-12",
    featured: true,
    coverImageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "linktree-alternatives-free-custom-domain-2026",
    title: "Top 7 Free Linktree Alternatives in 2026 (With Branded Domains & Zero Ads)",
    description: "Compare the top free Linktree alternatives in 2026. Discover bio link solutions that support your own custom domain, vector QR codes, and real-time privacy analytics.",
    category: "Social Media",
    readTime: "6 min read",
    date: "2026-11-12",
    featured: true,
    coverImageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "restaurant-qr-code-digital-menus-tracking-guide",
    title: "How Restaurants Use Dynamic QR Codes for Menus & Customer Insights in 2026",
    description: "A practical guide for restaurants and cafes. Learn how to deploy scannable dynamic QR codes for digital menus, table ordering, and seasonal specials without reprinting holders.",
    category: "Case Study",
    readTime: "5 min read",
    date: "2026-11-12",
    featured: true,
    coverImageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "track-qr-code-scans-privacy-first-without-cookies",
    title: "How to Track QR Code Scans and Link Clicks Privately Without Cookies (GDPR Compliant)",
    description: "Learn how cookieless edge analytics work. Discover how modern platforms track visitor country, device, and referrer data while staying 100% GDPR, CCPA, and ePrivacy compliant.",
    category: "Privacy",
    readTime: "6 min read",
    date: "2026-11-12",
    featured: true,
    coverImageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "whatsapp-link-generator-guide",
    title: "How to Create a WhatsApp Link with Message (Free 2026 Generator)",
    description: "Learn how to generate free WhatsApp direct chat links with custom pre-filled messages. No app required. Convert website visitors into WhatsApp conversations.",
    category: "Tutorials",
    readTime: "5 min read",
    date: "2026-11-10",
    featured: true,
  },
  {
    slug: "custom-domain-short-links-guide",
    title: "URL Shortener with Custom Domain: Free Setup & Comparison 2026",
    description: "Compare the best URL shorteners with custom domain support. Discover how to connect your brand domain for $0 forever with SSL included.",
    category: "Branding",
    readTime: "7 min read",
    date: "2026-11-10",
    featured: true,
  },
  {
    slug: "cheapest-custom-domain-link-shortener",
    title: "Cheapest Custom Domain Link Shortener 2026 - Save on Branded Links",
    description: "Compare the cheapest custom domain URL shorteners in 2026. Find the best budget-friendly and free custom domain link shorteners like ul0, Dub.co, and Bitly.",
    category: "Comparison",
    readTime: "5 min read",
    date: "2026-11-10",
    featured: true,
  },
  {
    slug: "bitly-alternative-free",
    title: "Bitly Alternative Free 2026 - Best Free Bitly Alternatives",
    description: "Looking for a free Bitly alternative? Compare the best Bitly alternatives in 2026 with no signup, no limits. ul0, TinyURL, Rebrandly & more.",
    category: "Comparison",
    readTime: "6 min read",
    date: "2026-11-10",
    featured: true,
  },
  {
    slug: "tiktok-bio-link-tools-guide-2026",
    title: "The Ultimate TikTok Bio Link Guide 2026: Boost Engagement & Sales",
    description: "Master TikTok bio links in 2026. How to add links without 10k followers, compare Linktree vs custom domains, avoid shadowbans, and boost conversions.",
    category: "Social Media",
    readTime: "6 min read",
    date: "2026-10-07",
    featured: true,
  },
  {
    slug: "utm-builder-tracking-guide-2026",
    title: "How to Build UTM Campaign Links that Track Every Conversion in 2026",
    description: "Master UTM parameter tagging and campaign tracking in 2026. Learn best practices for Google Analytics 4, avoid fractured reporting, and shorten tagged links cleanly.",
    category: "Analytics",
    readTime: "7 min read",
    date: "2026-10-07",
    featured: true,
  },
  {
    slug: "branded-short-links-roi-case-study",
    title: "Why Branded Short Links Increase CTR by 39%: Data & Case Studies 2026",
    description: "Discover real-world conversion benchmarks and case study data showing why branded custom domain short links outperform generic shortened URLs.",
    category: "Branding",
    readTime: "6 min read",
    date: "2026-10-07",
    featured: true,
  },
  {
    slug: "acortar-link-gratis-guia-completa",
    title: "Cómo Acortar Links Gratis en 2026: Guía Completa Sin Registro (Bitly vs ul0)",
    description: "Aprende cómo acortar un link gratis en 2026 paso a paso sin registro. Compara ul0, Bitly y TinyURL. Mejora tu CTR en WhatsApp, Instagram y TikTok.",
    category: "Español",
    readTime: "6 min read",
    date: "2026-10-03",
    featured: true,
  },
  {
    slug: "how-to-split-expenses-group-bills-online",
    title: "How to Split Expenses & Group Bills Online Free (No App Required in 2026)",
    description: "Learn how to split group expenses and roommate bills online without downloading an app. Compare ul0 Split vs Splitwise with UPI QR support.",
    category: "Utilities",
    readTime: "7 min read",
    date: "2026-10-03",
    featured: true,
  },
  {
    slug: "link-kuerzen-ohne-anmeldung-kostenlos",
    title: "Link kürzen ohne Anmeldung 2026: Die besten kostenlosen URL-Shortener",
    description: "Erfahren Sie, wie Sie lange Links ohne Registrierung kostenlos kürzen. DSGVO-konform, permanent und blitzschnell mit ul0.site.",
    category: "Deutsch",
    readTime: "5 min read",
    date: "2026-10-03",
    featured: true,
  },
  {
    slug: "link-shortening-best-practices-2026",
    title: "10 Link Shortening Best Practices Every Marketer Must Know in 2026",
    description: "Master link shortening in 2026 with 10 expert best practices to boost CTR, protect link equity, brand your URLs, and prevent spam blocks.",
    category: "Best Practices",
    readTime: "9 min read",
    date: "2026-08-10",
  },
  {
    slug: "qr-code-generator-security-guide",
    title: "QR Code Security & Privacy Guide: Preventing Quishing Scams in 2026",
    description: "Learn how to secure QR codes against quishing scams, malicious redirects, and data tracking in 2026. Complete enterprise security guide.",
    category: "Security",
    readTime: "8 min read",
    date: "2026-08-10",
  },
  {
    slug: "custom-domain-dns-cname-setup-guide",
    title: "How to Configure Custom Domain CNAME DNS & SSL for Branded Short Links",
    description: "Step-by-step technical guide to configuring CNAME DNS records, SSL/TLS certificates, and Cloudflare settings for custom branded short links.",
    category: "Infrastructure",
    readTime: "7 min read",
    date: "2026-08-10",
  },
  {
    slug: "free-link-management-for-companies",
    title: "Free Link Management for Companies: The Ultimate Guide",
    description: "Discover how businesses manage branded short links on custom domains completely free in 2026.",
    category: "Guides",
    readTime: "8 min read",
    date: "2026-07-15",
  },
  {
    slug: "best-url-shorteners-2026",
    title: "Best URL Shorteners 2026 - Bitly vs TinyURL vs ul0 Comparison",
    description: "Complete comparison of the best URL shorteners in 2026. Compare Bitly, TinyURL, Rebrandly, is.gd and ul0 with features, pricing and reviews.",
    category: "Comparison",
    readTime: "8 min read",
    date: "2026-03-01",
  },
  {
    slug: "tinyurl-alternative",
    title: "TinyURL Alternative 2026 - Best Free TinyURL Alternatives",
    description: "Looking for TinyURL alternatives? Compare the best TinyURL alternatives in 2026 including free options with no signup required.",
    category: "Comparison",
    readTime: "5 min read",
    date: "2026-03-01",
  },
  {
    slug: "free-url-shortener-no-signup",
    title: "Free URL Shortener No Signup Required 2026",
    description: "Shorten URLs for free without creating an account. No signup, no limits, no registration. Instant link shortening with QR codes.",
    category: "Guide",
    readTime: "4 min read",
    date: "2026-03-01",
  },
  {
    slug: "how-to-shorten-url-free",
    title: "How to Shorten a URL for Free in 2026 - Complete Guide",
    description: "Learn the easiest ways to shorten long URLs for free. Step-by-step guide with best practices for social media, marketing, and more.",
    category: "Guide",
    readTime: "5 min read",
    date: "2026-03-01",
  },
  {
    slug: "qr-code-marketing-guide",
    title: "QR Code Marketing Guide - How to Use QR Codes for Business",
    description: "Discover how to use QR codes for marketing. Learn best practices for restaurants, retail, events, and more.",
    category: "Marketing",
    readTime: "6 min read",
    date: "2026-03-01",
  },
  {
    slug: "split-expenses-friends-app",
    title: "How to Split Expenses with Friends - Best Apps & Methods 2026",
    description: "The ultimate guide to splitting bills and expenses with friends. Compare Splitwise alternatives and learn the best methods.",
    category: "Guide",
    readTime: "7 min read",
    date: "2026-03-01",
  },
  {
    slug: "short-links-instagram-bio",
    title: "How to Add Multiple Links in Instagram Bio - Link in Bio Guide",
    description: "Learn how to add multiple links to your Instagram bio using short links. Tips for influencers and businesses.",
    category: "Social Media",
    readTime: "4 min read",
    date: "2026-03-01",
  },
  {
    slug: "url-shortener-seo-impact",
    title: "Do Short URLs Affect SEO? The Truth About URL Shorteners",
    description: "Understand how URL shorteners impact SEO. Learn when to use short links and when to avoid them for better search rankings.",
    category: "SEO",
    readTime: "6 min read",
    date: "2026-03-01",
  },
  {
    slug: "how-to-track-link-clicks-free",
    title: "How to Track Link Clicks for Free in 2026 - Analytics Guide",
    description: "Learn how to track URL clicks for free without paying for expensive tools. Track CTR, referrer sources, geographic locations, and devices.",
    category: "Analytics",
    readTime: "6 min read",
    date: "2026-03-05",
  },
  {
    slug: "wifi-qr-code-business-guide",
    title: "WiFi QR Codes for Businesses: Complete Setup & Security Guide 2026",
    description: "Learn how cafes, restaurants, hotels, and offices use WiFi QR codes to streamline guest access, protect private networks, and improve customer experience.",
    category: "Business",
    readTime: "5 min read",
    date: "2026-03-08",
  },
  {
    slug: "pomodoro-technique-productivity-guide",
    title: "The Science of the Pomodoro Technique: Boost Deep Work & Focus in 2026",
    description: "Learn how the 25-minute Pomodoro time management technique fights cognitive fatigue, prevents burnout, and increases daily productivity.",
    category: "Productivity",
    readTime: "5 min read",
    date: "2026-03-12",
  },
  {
    slug: "affiliate-link-shortener-usa",
    title: "Affiliate Link Shortener for US Creators: Amazon Associates & FTC Compliance Guide 2026",
    description: "Master affiliate link shortening for US creators. Learn FTC disclosure rules, Amazon Associates compliance, and how branded short links avoid spam filters.",
    category: "Marketing",
    readTime: "7 min read",
    date: "2026-08-25",
  },
]

export default async function BlogPage() {
  let sanityPosts: BlogPostItem[] = []
  try {
    const rawSanity = await getPublishedSanityPosts()
    if (rawSanity && rawSanity.length > 0) {
      sanityPosts = rawSanity.map((post) => ({
        slug: post.slug.current,
        title: post.title,
        description: post.excerpt,
        category: post.keywords?.[0] || "Guides",
        readTime: "6 min read",
        date: post.publishedAt ? post.publishedAt.split("T")[0] : new Date().toISOString().split("T")[0],
        featured: true,
        coverImageUrl: post.coverImageUrl,
      }))
    }
  } catch (err) {
    console.warn("[Sanity Posts Fetch Ignored]:", err)
  }

  // Deduplicate and combine (Sanity scheduled/published posts take precedence)
  const combinedPosts: BlogPostItem[] = [
    ...sanityPosts,
    ...staticBlogPosts.filter((sp) => !sanityPosts.some((p) => p.slug === sp.slug)),
  ]

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "UL0 Blog",
    description: "Tips, tutorials, and competitive analysis on URL shortening, custom domains, dynamic QR codes, and link analytics.",
    url: "https://ul0.site/blog",
    publisher: {
      "@type": "Organization",
      name: "UL0",
      logo: {
        "@type": "ImageObject",
        url: "https://ul0.site/ul0.png",
      },
    },
    blogPost: combinedPosts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      url: `https://ul0.site/blog/${post.slug}`,
      datePublished: post.date,
      image: post.coverImageUrl || "https://ul0.site/social-card.png",
      author: {
        "@type": "Person",
        name: "Saket Kesar",
      },
    })),
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="flex-1 py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10 space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
              <Sparkles className="h-3.5 w-3.5" /> Technical Guides & Strategies
            </span>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              UL0 Resource & Knowledge Hub
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Everything you need to master branded custom domains, 307 temporary redirects, dynamic QR codes, UTM campaign tracking, and group expense splitting.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {combinedPosts.map((post) => (
              <Card key={post.slug} className="flex flex-col hover:shadow-lg transition-shadow overflow-hidden border-border bg-card">
                {post.coverImageUrl && (
                  <div className="relative h-44 w-full overflow-hidden bg-muted/30 border-b border-border">
                    <img
                      src={post.coverImageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-[11px] font-medium">
                      {post.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-base sm:text-lg line-clamp-2 leading-snug">
                    <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors text-foreground">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                    {post.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pt-0">
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(post.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-primary hover:underline mt-3 text-xs font-semibold"
                  >
                    Read Guide <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Box */}
          <div className="mt-14 text-center p-8 bg-muted/40 rounded-2xl border border-border max-w-2xl mx-auto space-y-4">
            <h2 className="text-xl font-bold text-foreground">Ready to connect your free custom domain?</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Experience fast 307 redirects, free SSL certificates, and dynamic QR codes with UL0. No credit card required.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 text-xs font-semibold shadow-sm transition-colors"
              >
                Shorten a URL Free
              </Link>
              <Link
                href="/custom-domain-landing"
                className="inline-flex items-center justify-center rounded-xl border border-border bg-card text-foreground hover:bg-muted h-10 px-5 text-xs font-medium transition-colors"
              >
                View Custom Domains
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
