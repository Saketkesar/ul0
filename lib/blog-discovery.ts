import "server-only"

// ---------------------------------------------------------------------------
// Blog Discovery
// ---------------------------------------------------------------------------
// Discovers eligible blog posts from the statically-known list in the blog
// index page. This avoids filesystem scanning at runtime and works reliably
// on Vercel's serverless environment.

export interface BlogMeta {
  slug: string
  title: string
  category: string
  readTime: string
}

/**
 * All known published blog article slugs.
 * Sourced from app/blog/page.tsx blogPosts array.
 * Each of these has a dedicated page at /blog/{slug}.
 */
const ALL_BLOG_SLUGS: BlogMeta[] = [
  { slug: "link-shortening-best-practices-2026", title: "10 Link Shortening Best Practices Every Marketer Must Know in 2026", category: "Best Practices", readTime: "9 min" },
  { slug: "qr-code-generator-security-guide", title: "QR Code Security & Privacy Guide: Preventing Quishing Scams in 2026", category: "Security", readTime: "8 min" },
  { slug: "custom-domain-dns-cname-setup-guide", title: "How to Configure Custom Domain CNAME DNS & SSL for Branded Short Links", category: "Infrastructure", readTime: "7 min" },
  { slug: "free-link-management-for-companies", title: "Free Link Management for Companies: The Ultimate Guide", category: "Guides", readTime: "8 min" },
  { slug: "cheapest-custom-domain-link-shortener", title: "Cheapest Custom Domain Link Shortener 2026", category: "Comparison", readTime: "5 min" },
  { slug: "best-url-shorteners-2026", title: "Best URL Shorteners 2026 - Bitly vs TinyURL vs ul0", category: "Comparison", readTime: "8 min" },
  { slug: "bitly-alternative-free", title: "Bitly Alternative Free 2026 - Best Free Bitly Alternatives", category: "Comparison", readTime: "6 min" },
  { slug: "tinyurl-alternative", title: "TinyURL Alternative 2026 - Best Free TinyURL Alternatives", category: "Comparison", readTime: "5 min" },
  { slug: "free-url-shortener-no-signup", title: "Free URL Shortener No Signup Required 2026", category: "Guide", readTime: "4 min" },
  { slug: "how-to-shorten-url-free", title: "How to Shorten a URL for Free in 2026", category: "Guide", readTime: "5 min" },
  { slug: "qr-code-marketing-guide", title: "QR Code Marketing Guide - How to Use QR Codes for Business", category: "Marketing", readTime: "6 min" },
  { slug: "split-expenses-friends-app", title: "How to Split Expenses with Friends - Best Apps & Methods 2026", category: "Guide", readTime: "7 min" },
  { slug: "short-links-instagram-bio", title: "How to Add Multiple Links in Instagram Bio", category: "Social Media", readTime: "4 min" },
  { slug: "url-shortener-seo-impact", title: "Do Short URLs Affect SEO? The Truth About URL Shorteners", category: "SEO", readTime: "6 min" },
  { slug: "how-to-track-link-clicks-free", title: "How to Track Link Clicks for Free in 2026", category: "Analytics", readTime: "6 min" },
  { slug: "wifi-qr-code-business-guide", title: "WiFi QR Codes for Businesses: Complete Setup & Security Guide 2026", category: "Business", readTime: "5 min" },
  { slug: "custom-domain-short-links-guide", title: "Why Branded Custom Domain Short Links Outperform Generic URLs", category: "Branding", readTime: "5 min" },
  { slug: "pomodoro-technique-productivity-guide", title: "The Science of the Pomodoro Technique", category: "Productivity", readTime: "5 min" },
  { slug: "affiliate-link-shortener-usa", title: "Affiliate Link Shortener for US Creators: Amazon Associates & FTC Compliance", category: "Marketing", readTime: "7 min" },
  { slug: "how-to-split-expenses-group-bills-online", title: "How to Split Expenses & Group Bills Online Free (No App Required in 2026)", category: "Utilities", readTime: "7 min" },
  { slug: "acortar-link-gratis-guia-completa", title: "Cómo Acortar Links Gratis en 2026: Guía Completa Sin Registro (Bitly vs ul0)", category: "Español", readTime: "6 min" },
  { slug: "link-kuerzen-ohne-anmeldung-kostenlos", title: "Link kürzen ohne Anmeldung 2026: Die besten kostenlosen URL-Shortener", category: "Deutsch", readTime: "5 min" },
  { slug: "tiktok-bio-link-tools-guide-2026", title: "The Ultimate TikTok Bio Link Guide 2026: Boost Engagement & Sales", category: "Social Media", readTime: "6 min" },
  { slug: "utm-builder-tracking-guide-2026", title: "How to Build UTM Campaign Links that Track Every Conversion in 2026", category: "Analytics", readTime: "7 min" },
  { slug: "branded-short-links-roi-case-study", title: "Why Branded Short Links Increase CTR by 39%: Data & Case Studies", category: "Branding", readTime: "6 min" },
]

/**
 * Returns all eligible blog slugs for gate content.
 */
export function getEligibleBlogSlugs(): BlogMeta[] {
  return ALL_BLOG_SLUGS
}

/**
 * Selects `count` random blog slugs, excluding any in `exclude`.
 * If fewer eligible than requested, returns as many as available.
 */
export function selectRandomBlogs(
  count: number,
  exclude: string[] = []
): string[] {
  const available = ALL_BLOG_SLUGS
    .map((b) => b.slug)
    .filter((s) => !exclude.includes(s))

  // Fisher-Yates shuffle
  const shuffled = [...available]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  const actual = Math.min(count, shuffled.length)
  if (actual < count) {
    console.warn(
      `Blog discovery: requested ${count} articles but only ${actual} are available (after excluding ${exclude.length}).`
    )
  }

  return shuffled.slice(0, actual)
}

/**
 * Look up metadata for a given blog slug.
 */
export function getBlogMeta(slug: string): BlogMeta | undefined {
  return ALL_BLOG_SLUGS.find((b) => b.slug === slug)
}

/**
 * Returns the total number of available blog articles.
 */
export function getTotalBlogCount(): number {
  return ALL_BLOG_SLUGS.length
}
