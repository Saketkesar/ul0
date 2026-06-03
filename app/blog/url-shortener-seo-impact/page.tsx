import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowLeft, Check, Sparkles, ShieldCheck, HelpCircle, FileText } from "lucide-react"

export const metadata: Metadata = {
  title: "Do Short URLs Affect SEO? The Truth About URL Shorteners | ul0",
  description: "Does using a URL shortener hurt your Google rankings? Learn the SEO impact of 301 redirects, link equity, and search ranking factors in 2026.",
  keywords: [
    "url shortener seo",
    "do short urls affect seo",
    "301 redirects seo",
    "link shortener search ranking",
    "link equity url shortener",
    "google rankings shortened links",
    "redirect link seo impact",
  ],
  alternates: {
    canonical: "https://ul0.site/blog/url-shortener-seo-impact",
  },
  openGraph: {
    title: "Do Short URLs Affect SEO? The Truth About URL Shorteners",
    description: "Understand the SEO mechanics behind URL shorteners. Learn how 301 redirects pass page rank and link equity.",
    url: "https://ul0.site/blog/url-shortener-seo-impact",
    type: "article",
    publishedTime: "2026-03-01",
  },
}

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Do Short URLs Affect SEO? The Truth About URL Shorteners",
  description: "An in-depth analysis of how shortened URLs and 301 redirects affect SEO, search visibility, crawling, and Google indexation.",
  image: "https://ul0.site/ul0.png",
  datePublished: "2026-03-01",
  dateModified: "2026-03-01",
  author: {
    "@type": "Organization",
    name: "ul0",
  },
  publisher: {
    "@type": "Organization",
    name: "ul0",
    logo: {
      "@type": "ImageObject",
      url: "https://ul0.site/ul0.png",
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://ul0.site/blog/url-shortener-seo-impact",
  },
}

export default function UrlShortenerSeoImpactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <Header />
      
      <main className="flex-1 py-8 sm:py-12">
        <article className="container mx-auto px-4 max-w-3xl">
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <header className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">SEO</span>
            </div>
            <h1 className="text-3xl font-bold mb-4 sm:text-4xl">
              Do Short URLs Affect SEO? The Truth About URL Shorteners
            </h1>
            <p className="text-muted-foreground">
              Published March 1, 2026 • 6 min read
            </p>
          </header>

          <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
            <p className="text-lg">
              A common question among digital marketers, website owners, and bloggers is whether using a URL shortener 
              negatively impacts Search Engine Optimization (SEO). Will Google penalize your links? Does redirecting traffic 
              leak link equity? In 2026, the answer is clear: <strong>when done correctly, shortened URLs have zero negative impact on SEO</strong>. 
              This article explains the mechanics of how search engines handle shortened links.
            </p>

            <h2 className="text-2xl font-bold mt-8">Google's Official Stance on Shortened URLs</h2>
            <p>
              Google Search advocates have repeatedly confirmed that Google treats shortened links from reputable services as standard 
              <strong> 301 Permanent Redirects</strong>. 
              Under Google's indexing guidelines, a 301 redirect passes 100% of its link equity (PageRank) to the destination URL. 
              This means if someone links to your shortened address, your final page still receives the full SEO value of that backlink.
            </p>

            <h2 className="text-2xl font-bold mt-8">Key SEO Concepts for URL Shortening</h2>
            <div className="space-y-4 my-6">
              <div className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                <ShieldCheck className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">1. 301 Redirect vs 302 Redirect</h3>
                  <p className="text-muted-foreground text-sm">
                    A 301 redirect tells search crawlers that the page has moved permanently, ensuring search index signals transfer to the new location. Reputable shorteners like <Link href="/" className="text-primary hover:underline font-semibold">ul0</Link> utilize 301 redirects, whereas cheap or temporary redirect tools might use 302 (temporary) redirects which do not pass authority.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                <Sparkles className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">2. Anchor Text and Context</h3>
                  <p className="text-muted-foreground text-sm">
                    Crawlers look at the anchor text (the clickable text in a hyperlink) and surrounding copy to understand what the target page is about. Shortening the URL doesn't interfere with this context, as search engines evaluate the content on the referring page itself.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 bg-muted/30 rounded-lg">
                <HelpCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">3. Crawl Budget and Redirect Chains</h3>
                  <p className="text-muted-foreground text-sm">
                    While a single 301 redirect is perfectly safe, you should avoid redirect chains (e.g. `Link A` redirects to `Link B`, which redirects to `Link C`). Googlebot may stop following redirects if the chain gets too long, wasting crawl budget and dropping link signals.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold mt-8">When to Use Shortened Links for Best SEO</h2>
            <p>
              Shortened URLs are best suited for off-site placement where clean URLs and link click tracking are valuable:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li><strong>Social Media:</strong> Twitter, Instagram bios, Facebook posts, and YouTube descriptions.</li>
              <li><strong>SMS Campaigns:</strong> Character-limited text messages where long links break.</li>
              <li><strong>Print & Graphics:</strong> Business cards, flyers, or images where users must type the URL manually.</li>
              <li><strong>Email Newsletters:</strong> Keeping track of click-through rates across campaigns.</li>
            </ul>
            <p className="text-sm italic text-muted-foreground">
              Note: For internal links (linking from one page on your website to another page on the same website), you should always use direct, absolute or relative canonical paths (e.g. `/split` or `https://ul0.site/split`) rather than shortening them, to optimize crawl efficiency.
            </p>

            <div className="bg-primary/10 p-6 rounded-lg my-8 text-center">
              <h3 className="font-bold mb-2 text-xl">Compress Your Links with ul0</h3>
              <p className="mb-4 text-muted-foreground">
                Get high-performance, secure 301 redirects instantly. 100% free with no signups.
              </p>
              <Link 
                href="/"
                className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 font-medium"
              >
                Shorten Link Free →
              </Link>
            </div>

            <h2 className="text-2xl font-bold mt-8">Conclusion</h2>
            <p>
              URL shorteners do not hurt SEO as long as they employ standard 301 redirects and run on high-uptime servers. By utilizing 
              <strong> ul0</strong>, you ensure that your short links redirect lightning-fast and transfer 100% of their search authority 
              to your target pages.
            </p>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  )
}
