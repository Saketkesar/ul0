import type { MetadataRoute } from "next"
import { SITE_URL, INDEXED_LOCALES, hreflangAlternates } from "@/lib/i18n"
import { getPublishedSanityPosts } from "@/lib/sanity/client"

export const dynamic = "force-dynamic"
export const revalidate = 60

const BASE_URL = SITE_URL

// Language variants that have a fully translated, indexed homepage (Tier 1)
const LANGUAGES = INDEXED_LOCALES

// Complete reciprocal hreflang alternates for the homepage + language pages
const homeLanguageAlternates = hreflangAlternates

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Real update timestamps (avoid setting "now" on every build so crawlers respect lastmod)
  const coreUpdated = new Date("2026-11-10")
  const toolsUpdated = new Date("2026-10-01")
  const legalUpdated = new Date("2026-08-01")

  // Core product & platform pages
  const corePages = [
    "", // homepage
    "/features",
    "/pricing",
    "/changelog",
    "/status",
    "/compare",
    "/compare/bitly",
    "/compare/tinyurl",
    "/compare/rebrandly",
    "/compare/short-io",
    "/compare/dub",
    "/compare/t-ly",
    "/compare/cuttly",
    "/qr",
    "/utm",
    "/forms",
    "/docs",
    "/custom-domain-landing",
  ]

  // Use Case Landing Pages
  const useCasePages = [
    "/use-cases",
    "/use-cases/small-business",
    "/use-cases/marketing-agencies",
    "/use-cases/real-estate",
    "/use-cases/restaurants",
    "/use-cases/creators",
    "/use-cases/ecommerce",
    "/use-cases/startups",
    "/use-cases/events",
  ]

  // Free SEO & Web Developer Tools
  const toolPages = [
    "/tools",
    "/files",
    "/tools/pdf-splitter",
    "/tools/redirect-checker",
    "/tools/url-expander",
    "/tools/og-preview",
    "/tools/meta-tag-generator",
    "/split",
    "/pdf",
    "/wifi",
    "/whatsapp",
  ]

  // Blog posts with actual publish dates
  const staticBlogPosts: { slug: string; published: string }[] = [
    { slug: "custom-domain-short-links-guide", published: "2026-11-10" },
    { slug: "cheapest-custom-domain-link-shortener", published: "2026-11-10" },
    { slug: "bitly-alternative-free", published: "2026-11-10" },
    { slug: "tiktok-bio-link-tools-guide-2026", published: "2026-10-07" },
    { slug: "utm-builder-tracking-guide-2026", published: "2026-10-07" },
    { slug: "branded-short-links-roi-case-study", published: "2026-10-07" },
    { slug: "acortar-link-gratis-guia-completa", published: "2026-10-03" },
    { slug: "how-to-split-expenses-group-bills-online", published: "2026-10-03" },
    { slug: "link-kuerzen-ohne-anmeldung-kostenlos", published: "2026-10-03" },
    { slug: "link-shortening-best-practices-2026", published: "2026-07-15" },
    { slug: "qr-code-generator-security-guide", published: "2026-07-15" },
    { slug: "custom-domain-dns-cname-setup-guide", published: "2026-08-10" },
    { slug: "free-link-management-for-companies", published: "2026-07-20" },
    { slug: "best-url-shorteners-2026", published: "2026-07-20" },
    { slug: "tinyurl-alternative", published: "2026-07-20" },
    { slug: "free-url-shortener-no-signup", published: "2026-07-20" },
    { slug: "how-to-shorten-url-free", published: "2026-07-20" },
    { slug: "qr-code-marketing-guide", published: "2026-07-20" },
    { slug: "split-expenses-friends-app", published: "2026-07-20" },
    { slug: "short-links-instagram-bio", published: "2026-07-20" },
    { slug: "url-shortener-seo-impact", published: "2026-07-20" },
    { slug: "how-to-track-link-clicks-free", published: "2026-07-20" },
    { slug: "wifi-qr-code-business-guide", published: "2026-07-20" },
    { slug: "pomodoro-technique-productivity-guide", published: "2026-07-20" },
    { slug: "affiliate-link-shortener-usa", published: "2026-08-25" },
  ]

  // Informational / trust / legal pages
  const infoPages = [
    { path: "/blog", date: coreUpdated },
    { path: "/faq", date: coreUpdated },
    { path: "/about", date: legalUpdated },
    { path: "/contact", date: legalUpdated },
    { path: "/security", date: coreUpdated },
    { path: "/threats", date: coreUpdated },
    { path: "/backlinks", date: toolsUpdated },
    { path: "/report-abuse", date: legalUpdated },
    { path: "/refund", date: legalUpdated },
    { path: "/privacy", date: legalUpdated },
    { path: "/terms", date: legalUpdated },
  ]

  const entries: MetadataRoute.Sitemap = []

  // Core pages
  for (const path of corePages) {
    entries.push({
      url: `${BASE_URL}${path}`,
      lastModified: coreUpdated,
      ...(path === "" ? { alternates: { languages: homeLanguageAlternates } } : {}),
    })
  }

  // Use case pages
  for (const path of useCasePages) {
    entries.push({
      url: `${BASE_URL}${path}`,
      lastModified: coreUpdated,
    })
  }

  // Tool pages
  for (const path of toolPages) {
    entries.push({
      url: `${BASE_URL}${path}`,
      lastModified: toolsUpdated,
    })
  }

  // Language homepages with reciprocal hreflang alternates
  for (const lang of LANGUAGES) {
    entries.push({
      url: `${BASE_URL}/${lang}`,
      lastModified: coreUpdated,
      alternates: { languages: homeLanguageAlternates },
    })
  }

  // Static blog posts
  for (const { slug, published } of staticBlogPosts) {
    entries.push({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: new Date(published),
    })
  }

  // Dynamically include Sanity published posts
  try {
    const sanityPosts = await getPublishedSanityPosts()
    if (sanityPosts && sanityPosts.length > 0) {
      for (const sp of sanityPosts) {
        if (sp.slug?.current && !staticBlogPosts.some((bp) => bp.slug === sp.slug.current)) {
          entries.push({
            url: `${BASE_URL}/blog/${sp.slug.current}`,
            lastModified: sp.publishedAt ? new Date(sp.publishedAt) : coreUpdated,
          })
        }
      }
    }
  } catch (err) {
    console.warn("[Sitemap Sanity Fetch Ignored]:", err)
  }

  // Info / legal pages
  for (const { path, date } of infoPages) {
    entries.push({
      url: `${BASE_URL}${path}`,
      lastModified: date,
    })
  }

  return entries
}
