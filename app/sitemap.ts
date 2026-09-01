import type { MetadataRoute } from "next"
import { SITE_URL, LOCALES, hreflangAlternates } from "@/lib/i18n"

export const dynamic = "force-dynamic"
export const revalidate = 0

const BASE_URL = SITE_URL

// Language variants that have a localized homepage
const LANGUAGES = LOCALES

// Complete reciprocal hreflang alternates for the homepage + language pages
const homeLanguageAlternates = hreflangAlternates

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // Core tool pages — highest value, crawled often
  const toolPages: { path: string; priority: number }[] = [
    { path: "", priority: 1.0 }, // homepage
    { path: "/free-url-shortener", priority: 1.0 },
    { path: "/qr-code-generator", priority: 0.98 },
    { path: "/utm-builder", priority: 0.95 },
    { path: "/link-tracker", priority: 0.95 },
    { path: "/link-in-bio", priority: 0.95 },
    { path: "/url-expander", priority: 0.9 },
    { path: "/wifi-qr-code-generator", priority: 0.9 },
    { path: "/qr-code-for-business", priority: 0.9 },
    { path: "/split", priority: 0.9 },
    { path: "/share", priority: 0.85 },
    { path: "/qr", priority: 0.9 },
    { path: "/wifi", priority: 0.85 },
    { path: "/utm", priority: 0.85 },
    { path: "/json", priority: 0.85 },
    { path: "/pdf", priority: 0.85 },
    { path: "/pomodoro", priority: 0.8 },
    { path: "/clock", priority: 0.8 },
    { path: "/worldclock", priority: 0.8 },
    { path: "/ambient", priority: 0.8 },
    { path: "/countdown", priority: 0.8 },
    { path: "/quotes", priority: 0.8 },
    { path: "/pricing", priority: 0.9 },
    { path: "/docs", priority: 0.85 },
    { path: "/custom-domain-landing", priority: 0.85 },
  ]

  // Blog posts (All 18 published articles)
  const blogPosts = [
    "link-shortening-best-practices-2026",
    "qr-code-generator-security-guide",
    "custom-domain-dns-cname-setup-guide",
    "free-link-management-for-companies",
    "cheapest-custom-domain-link-shortener",
    "best-url-shorteners-2026",
    "bitly-alternative-free",
    "tinyurl-alternative",
    "free-url-shortener-no-signup",
    "how-to-shorten-url-free",
    "qr-code-marketing-guide",
    "split-expenses-friends-app",
    "short-links-instagram-bio",
    "url-shortener-seo-impact",
    "how-to-track-link-clicks-free",
    "wifi-qr-code-business-guide",
    "custom-domain-short-links-guide",
    "pomodoro-technique-productivity-guide",
  ]

  // Informational / legal / trust pages
  const infoPages: { path: string; priority: number }[] = [
    { path: "/blog", priority: 0.85 },
    { path: "/security", priority: 0.8 },
    { path: "/report-abuse", priority: 0.75 },
    { path: "/faq", priority: 0.8 },
    { path: "/about", priority: 0.7 },
    { path: "/buy", priority: 0.6 },
    { path: "/contact", priority: 0.7 },
    { path: "/donate", priority: 0.7 },
    { path: "/supporters", priority: 0.7 },
    { path: "/refund", priority: 0.4 },
    { path: "/privacy", priority: 0.4 },
    { path: "/terms", priority: 0.4 },
  ]

  const entries: MetadataRoute.Sitemap = []

  // Homepage with hreflang alternates
  entries.push({
    url: BASE_URL,
    lastModified: now,
    changeFrequency: "daily",
    priority: 1.0,
    alternates: { languages: homeLanguageAlternates },
  })

  // Tool pages (skip homepage which was added above)
  for (const { path, priority } of toolPages) {
    if (path === "") continue
    entries.push({
      url: `${BASE_URL}${path}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority,
    })
  }

  // Language homepages with hreflang alternates
  for (const lang of LANGUAGES) {
    entries.push({
      url: `${BASE_URL}/${lang}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages: homeLanguageAlternates },
    })
  }

  // Blog posts
  for (const slug of blogPosts) {
    entries.push({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    })
  }

  // Info / legal pages
  for (const { path, priority } of infoPages) {
    entries.push({
      url: `${BASE_URL}${path}`,
      lastModified: now,
      changeFrequency: path === "/blog" || path === "/faq" ? "weekly" : "monthly",
      priority,
    })
  }

  return entries
}
