import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog: Branded Short Links, QR Codes & DNS Guides | ul0",
  description: "Guides, technical tutorials, and competitor breakdowns on branded short links, custom domain DNS CNAME configuration, dynamic QR codes, and link analytics.",
  alternates: {
    canonical: "https://ul0.site/blog",
  },
  openGraph: {
    title: "Blog: Branded Short Links, QR Codes & DNS Guides | ul0",
    description: "Guides, technical tutorials, and competitor breakdowns on branded short links, custom domain DNS CNAME configuration, dynamic QR codes, and link analytics.",
    url: "https://ul0.site/blog",
    type: "website",
    siteName: "ul0 Blog",
    images: [{
      url: "https://ul0.site/ul0.png",
      width: 1200,
      height: 630,
      alt: "ul0 Blog - URL Shortener Tips & Guides",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog: Branded Short Links, QR Codes & DNS Guides | ul0",
    description: "Guides, technical tutorials, and competitor breakdowns on branded short links, custom domain DNS CNAME configuration, dynamic QR codes, and link analytics.",
    images: ["https://ul0.site/ul0.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const blogPosts = [
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
    featured: true,
  },
  {
    slug: "qr-code-generator-security-guide",
    title: "QR Code Security & Privacy Guide: Preventing Quishing Scams in 2026",
    description: "Learn how to secure QR codes against quishing scams, malicious redirects, and data tracking in 2026. Complete enterprise security guide.",
    category: "Security",
    readTime: "8 min read",
    date: "2026-08-10",
    featured: true,
  },
  {
    slug: "custom-domain-dns-cname-setup-guide",
    title: "How to Configure Custom Domain CNAME DNS & SSL for Branded Short Links",
    description: "Step-by-step technical guide to configuring CNAME DNS records, SSL/TLS certificates, and Cloudflare settings for custom branded short links.",
    category: "Infrastructure",
    readTime: "7 min read",
    date: "2026-08-10",
    featured: true,
  },
  {
    slug: "free-link-management-for-companies",
    title: "Free Link Management for Companies: The Ultimate Guide",
    description: "Discover how businesses manage branded short links on custom domains completely free in 2026.",
    category: "Guides",
    readTime: "8 min read",
    date: "2026-07-15",
    featured: true,
  },
  {
    slug: "cheapest-custom-domain-link-shortener",
    title: "Cheapest Custom Domain Link Shortener 2026 - Save on Branded Links",
    description: "Compare the cheapest custom domain URL shorteners in 2026. Find the best budget-friendly and free custom domain link shorteners like ul0, Dub.co, and Bitly.",
    category: "Comparison",
    readTime: "5 min read",
    date: "2026-07-06",
    featured: true,
  },
  {
    slug: "best-url-shorteners-2026",
    title: "Best URL Shorteners 2026 - Bitly vs TinyURL vs ul0 Comparison",
    description: "Complete comparison of the best URL shorteners in 2026. Compare Bitly, TinyURL, Rebrandly, is.gd and ul0 with features, pricing and reviews.",
    category: "Comparison",
    readTime: "8 min read",
    date: "2026-03-01",
    featured: true,
  },
  {
    slug: "bitly-alternative-free",
    title: "Bitly Alternative Free 2026 - Best Free Bitly Alternatives",
    description: "Looking for a free Bitly alternative? Compare the best Bitly alternatives in 2026 with no signup, no limits. ul0, TinyURL, Rebrandly & more.",
    category: "Comparison",
    readTime: "6 min read",
    date: "2026-03-01",
    featured: true,
  },
  {
    slug: "tinyurl-alternative",
    title: "TinyURL Alternative 2026 - Best Free TinyURL Alternatives",
    description: "Looking for TinyURL alternatives? Compare the best TinyURL alternatives in 2026 including free options with no signup required.",
    category: "Comparison",
    readTime: "5 min read",
    date: "2026-03-01",
    featured: true,
  },
  {
    slug: "free-url-shortener-no-signup",
    title: "Free URL Shortener No Signup Required 2026",
    description: "Shorten URLs for free without creating an account. No signup, no limits, no registration. Instant link shortening with QR codes.",
    category: "Guide",
    readTime: "4 min read",
    date: "2026-03-01",
    featured: true,
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
    slug: "custom-domain-short-links-guide",
    title: "Why Branded Custom Domain Short Links Outperform Generic URLs in 2026",
    description: "Learn how custom domain short links boost brand trust, increase email deliverability, and raise link Click-Through Rates (CTR) by up to 39%.",
    category: "Branding",
    readTime: "5 min read",
    date: "2026-03-10",
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

export default function BlogPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "ul0 Blog",
    description: "Tips and guides about URL shortening, QR codes, and expense splitting",
    url: "https://ul0.site/blog",
    publisher: {
      "@type": "Organization",
      name: "ul0",
      logo: {
        "@type": "ImageObject",
        url: "https://ul0.site/ul0.png",
      },
    },
    blogPost: blogPosts.map(post => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      url: `https://ul0.site/blog/${post.slug}`,
      datePublished: post.date,
      author: {
        "@type": "Organization",
        name: "ul0",
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
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-4 sm:text-4xl">
              ul0 Blog
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tips, guides, and best practices for URL shortening, QR codes, link management, and expense splitting.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {blogPosts.map((post) => (
              <Card key={post.slug} className="flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">
                    <Link href={`/blog/${post.slug}`} className="hover:text-primary">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {post.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(post.date).toLocaleDateString("en-US", { 
                          month: "short", 
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-primary hover:underline mt-3 text-sm font-medium"
                  >
                    Read more <ArrowRight className="h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 text-center p-8 bg-muted/30 rounded-lg max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-2">Ready to shorten your first link?</h2>
            <p className="text-muted-foreground mb-4">
              Try ul0's free URL shortener - no signup required.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 font-medium"
            >
              Shorten a URL Now
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
