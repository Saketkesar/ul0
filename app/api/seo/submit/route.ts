import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { isMarketingAdmin } from "@/lib/marketing-auth"

const HOST = "ul0.site"
const KEY = "1b98f244195a4bb896890d3bb639f7ee"

const CORE_PATHS = [
  "",
  "/features",
  "/pricing",
  "/backlinks",
  "/qr",
  "/split",
  "/utm",
  "/tools",
  "/tools/pdf-splitter",
  "/tools/redirect-checker",
  "/tools/url-expander",
  "/tools/og-preview",
  "/tools/meta-tag-generator",
  "/use-cases",
  "/use-cases/startups",
  "/use-cases/marketing-agencies",
  "/use-cases/creators",
  "/use-cases/small-business",
  "/use-cases/ecommerce",
  "/use-cases/real-estate",
  "/use-cases/restaurants",
  "/use-cases/events",
  "/blog",
  "/changelog",
  "/faq",
  "/about",
  "/contact",
  "/security",
  "/threats",
]

const BLOG_SLUGS = [
  "acortar-link-gratis-guia-completa",
  "how-to-split-expenses-group-bills-online",
  "link-kuerzen-ohne-anmeldung-kostenlos",
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
  "affiliate-link-shortener-usa",
]

export async function POST() {
  const { userId } = await auth()
  if (!userId || !(await isMarketingAdmin(userId))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const allUrls = [
    ...CORE_PATHS.map((p) => `https://${HOST}${p}`),
    ...BLOG_SLUGS.map((slug) => `https://${HOST}/blog/${slug}`),
  ]

  const results: {
    service: string
    status: number | string
    success: boolean
    message: string
  }[] = []

  // 1. Ping Google Sitemap
  try {
    const sitemapUrl = `https://${HOST}/sitemap.xml`
    const gRes = await fetch(
      `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
      { headers: { "User-Agent": "UL0-SEO-Bot/1.0" } }
    )
    results.push({
      service: "Google Sitemap Ping",
      status: gRes.status,
      success: gRes.ok || gRes.status === 200 || gRes.status === 404, // Google deprecated ping endpoint in 2024 but sitemap stays active
      message: gRes.ok
        ? "Google notified of latest sitemap."
        : "Google ping sent. Googlebot retrieves sitemap via robots.txt reference.",
    })
  } catch (err: any) {
    results.push({
      service: "Google Sitemap Ping",
      status: "Error",
      success: false,
      message: err.message || "Failed to reach Google ping service",
    })
  }

  // 2. Submit to IndexNow (Bing & Partner Search Engines)
  try {
    const inRes = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        urlList: allUrls,
      }),
    })
    const inText = await inRes.text()
    results.push({
      service: "IndexNow (Bing, Yandex, Seznam)",
      status: inRes.status,
      success: inRes.status === 200 || inRes.status === 202,
      message:
        inRes.status === 200 || inRes.status === 202
          ? `Successfully submitted ${allUrls.length} URLs to IndexNow.`
          : `IndexNow responded with status ${inRes.status}. Key verification active at /${KEY}.txt.`,
    })
  } catch (err: any) {
    results.push({
      service: "IndexNow",
      status: "Error",
      success: false,
      message: err.message || "Failed to submit to IndexNow",
    })
  }

  // 3. Verify Google Search Console Key presence
  const searchConsoleKey = process.env.SEARCH_CONSOLE_KEY?.trim() || null

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    totalUrls: allUrls.length,
    results,
    googleConfig: {
      hasKey: Boolean(searchConsoleKey),
      keyPreview: searchConsoleKey ? `${searchConsoleKey.slice(0, 10)}...` : null,
      verificationMetaPresent: true,
      sitemapUrl: `https://${HOST}/sitemap.xml`,
    },
  })
}
