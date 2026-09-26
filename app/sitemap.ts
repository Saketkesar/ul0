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

  // Core product & platform pages
  const corePages: { path: string; priority: number; freq: "daily" | "weekly" | "monthly" }[] = [
    { path: "", priority: 1.0, freq: "daily" }, // homepage
    { path: "/features", priority: 0.95, freq: "weekly" },
    { path: "/pricing", priority: 0.95, freq: "weekly" },
    { path: "/changelog", priority: 0.85, freq: "weekly" },
    { path: "/qr", priority: 0.95, freq: "weekly" },
    { path: "/utm", priority: 0.9, freq: "weekly" },
    { path: "/docs", priority: 0.85, freq: "weekly" },
    { path: "/custom-domain-landing", priority: 0.85, freq: "weekly" },
  ]

  // Use Case Landing Pages
  const useCasePages: { path: string; priority: number }[] = [
    { path: "/use-cases", priority: 0.95 },
    { path: "/use-cases/small-business", priority: 0.9 },
    { path: "/use-cases/marketing-agencies", priority: 0.9 },
    { path: "/use-cases/real-estate", priority: 0.9 },
    { path: "/use-cases/restaurants", priority: 0.9 },
    { path: "/use-cases/creators", priority: 0.9 },
    { path: "/use-cases/ecommerce", priority: 0.9 },
    { path: "/use-cases/startups", priority: 0.9 },
    { path: "/use-cases/events", priority: 0.9 },
  ]

  // Free SEO & Web Developer Tools
  const toolPages: { path: string; priority: number }[] = [
    { path: "/tools", priority: 0.95 },
    { path: "/tools/redirect-checker", priority: 0.95 },
    { path: "/tools/url-expander", priority: 0.95 },
    { path: "/tools/og-preview", priority: 0.95 },
    { path: "/tools/meta-tag-generator", priority: 0.95 },
    { path: "/split", priority: 0.85 },
    { path: "/share", priority: 0.85 },
    { path: "/pdf", priority: 0.85 },
    { path: "/wifi", priority: 0.85 },
    { path: "/json", priority: 0.85 },
    { path: "/pomodoro", priority: 0.8 },
    { path: "/clock", priority: 0.8 },
    { path: "/worldclock", priority: 0.8 },
    { path: "/ambient", priority: 0.8 },
    { path: "/countdown", priority: 0.8 },
    { path: "/quotes", priority: 0.8 },
  ]

  // Blog posts with actual publish dates
  const blogPosts: { slug: string; published: string }[] = [
    { slug: "link-shortening-best-practices-2026", published: "2026-07-15" },
    { slug: "qr-code-generator-security-guide", published: "2026-07-15" },
    { slug: "custom-domain-dns-cname-setup-guide", published: "2026-08-10" },
    { slug: "free-link-management-for-companies", published: "2026-07-20" },
    { slug: "cheapest-custom-domain-link-shortener", published: "2026-07-20" },
    { slug: "best-url-shorteners-2026", published: "2026-07-20" },
    { slug: "bitly-alternative-free", published: "2026-07-20" },
    { slug: "tinyurl-alternative", published: "2026-07-20" },
    { slug: "free-url-shortener-no-signup", published: "2026-07-20" },
    { slug: "how-to-shorten-url-free", published: "2026-07-20" },
    { slug: "qr-code-marketing-guide", published: "2026-07-20" },
    { slug: "split-expenses-friends-app", published: "2026-07-20" },
    { slug: "short-links-instagram-bio", published: "2026-07-20" },
    { slug: "url-shortener-seo-impact", published: "2026-07-20" },
    { slug: "how-to-track-link-clicks-free", published: "2026-07-20" },
    { slug: "wifi-qr-code-business-guide", published: "2026-07-20" },
    { slug: "custom-domain-short-links-guide", published: "2026-07-20" },
    { slug: "pomodoro-technique-productivity-guide", published: "2026-07-20" },
    { slug: "bitly-alternative-usa", published: "2026-08-25" },
    { slug: "affiliate-link-shortener-usa", published: "2026-08-25" },
    { slug: "best-free-url-shortener-canada", published: "2026-08-25" },
    { slug: "qr-code-generator-canada", published: "2026-08-25" },
    { slug: "url-kuerzen-kostenlos-deutschland", published: "2026-08-25" },
    { slug: "qr-code-erstellen-kostenlos-deutsch", published: "2026-08-25" },
    { slug: "best-free-url-shortener-uk", published: "2026-08-25" },
    { slug: "qr-code-generator-uk", published: "2026-08-25" },
    { slug: "best-free-url-shortener-australia", published: "2026-08-25" },
    { slug: "qr-code-generator-australia", published: "2026-08-25" },
    { slug: "pdf-tools-free-online", published: "2026-09-12" },
  ]

  // Informational / trust / legal pages
  const infoPages: { path: string; priority: number; freq: "daily" | "weekly" | "monthly" | "yearly" }[] = [
    { path: "/blog", priority: 0.85, freq: "weekly" },
    { path: "/faq", priority: 0.8, freq: "weekly" },
    { path: "/about", priority: 0.8, freq: "monthly" },
    { path: "/contact", priority: 0.7, freq: "monthly" },
    { path: "/security", priority: 0.85, freq: "weekly" },
    { path: "/threats", priority: 0.85, freq: "daily" },
    { path: "/report-abuse", priority: 0.7, freq: "monthly" },
    { path: "/refund", priority: 0.4, freq: "yearly" },
    { path: "/privacy", priority: 0.4, freq: "yearly" },
    { path: "/terms", priority: 0.4, freq: "yearly" },
  ]

  const entries: MetadataRoute.Sitemap = []

  // Core pages
  for (const { path, priority, freq } of corePages) {
    entries.push({
      url: `${BASE_URL}${path}`,
      lastModified: now,
      changeFrequency: freq,
      priority,
      ...(path === "" ? { alternates: { languages: homeLanguageAlternates } } : {}),
    })
  }

  // Use case pages
  for (const { path, priority } of useCasePages) {
    entries.push({
      url: `${BASE_URL}${path}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority,
    })
  }

  // Tool pages
  for (const { path, priority } of toolPages) {
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

  // Blog posts — use actual publish dates
  for (const { slug, published } of blogPosts) {
    entries.push({
      url: `${BASE_URL}/blog/${slug}`,
      lastModified: new Date(published),
      changeFrequency: "monthly",
      priority: 0.8,
    })
  }

  // Info / legal pages
  for (const { path, priority, freq } of infoPages) {
    entries.push({
      url: `${BASE_URL}${path}`,
      lastModified: now,
      changeFrequency: freq,
      priority,
    })
  }

  return entries
}
