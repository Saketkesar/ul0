import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Blog - URL Shortener Tips, Guides & Comparisons | ul0 [2026]",
  description: "Best URL shortener guides 2026. Compare Bitly vs TinyURL vs ul0. Learn link shortening tips, QR code marketing, expense splitting guides. Free tips & tutorials.",
  keywords: [
    // Primary Keywords
    "url shortener blog",
    "link shortening tips",
    "url shortener guide",
    "link management tips",
    "url shortener comparison",
    
    // Year-based
    "best url shortener 2026",
    "url shortener guide 2026",
    "link shortener tips 2026",
    
    // Comparison keywords
    "bitly vs tinyurl",
    "bitly vs ul0",
    "tinyurl vs ul0",
    "url shortener comparison",
    "best link shortener",
    "compare url shorteners",
    
    // Guide keywords
    "how to shorten url",
    "how to create short link",
    "url shortening guide",
    "link shortening tutorial",
    "qr code guide",
    "qr code marketing",
    "qr code tutorial",
    
    // Marketing keywords
    "digital marketing tips",
    "link tracking guide",
    "utm parameters guide",
    "campaign tracking",
    "social media marketing",
    
    // Alternative keywords
    "bitly alternative guide",
    "tinyurl alternative guide",
    "free url shortener guide",
    "no signup url shortener",
    
    // Tool guides
    "expense splitting guide",
    "bill splitter tips",
    "wifi qr code guide",
    "json formatter guide",
    "pomodoro technique",
    
    // Long-tail keywords
    "best practices url shortening",
    "when to use short links",
    "url shortener for business",
    "link shortener for marketing",
  ],
  alternates: {
    canonical: "https://ul0.site/blog",
  },
  openGraph: {
    title: "Blog - URL Shortener Tips & Guides | ul0",
    description: "Best URL shortener guides 2026. Compare Bitly vs TinyURL, learn link shortening tips, QR code marketing & more.",
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
    title: "URL Shortener Tips & Guides | ul0 Blog",
    description: "Best URL shortener guides 2026. Compare Bitly vs TinyURL & more!",
    images: ["https://ul0.site/ul0.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

const blogPosts = [
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
