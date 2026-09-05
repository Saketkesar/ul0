// scripts/submit-indexing.mjs
// Automates instant submission of all site URLs to search engines via IndexNow & Sitemaps

const HOST = "ul0.site"
const KEY = "1b98f244195a4bb896890d3bb639f7ee"
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`

const BLOG_SLUGS = [
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
  "bitly-alternative-usa",
  "affiliate-link-shortener-usa",
  "best-free-url-shortener-canada",
  "qr-code-generator-canada",
  "url-kuerzen-kostenlos-deutschland",
  "qr-code-erstellen-kostenlos-deutsch",
  "best-free-url-shortener-uk",
  "qr-code-generator-uk",
  "best-free-url-shortener-australia",
  "qr-code-generator-australia",
]

const TOOL_PATHS = [
  "",
  "/qr",
  "/split",
  "/share",
  "/wifi",
  "/utm",
  "/json",
  "/pdf",
  "/pomodoro",
  "/clock",
  "/worldclock",
  "/ambient",
  "/countdown",
  "/quotes",
  "/pricing",
  "/docs",
  "/custom-domain-landing",
  "/blog",
  "/faq",
  "/about",
  "/buy",
  "/contact",
  "/donate",
  "/supporters",
  "/refund",
  "/privacy",
  "/terms",
  "/es",
  "/pt",
  "/de",
  "/fr",
  "/nl",
  "/vi",
  "/id",
  "/th",
  "/hi",
  "/ja",
  "/ko",
  "/ar",
]

const allUrls = [
  ...TOOL_PATHS.map((p) => `https://${HOST}${p}`),
  ...BLOG_SLUGS.map((slug) => `https://${HOST}/blog/${slug}`),
]

console.log(`[Indexing] Total URLs to submit: ${allUrls.length}`)

async function submitBulk(endpoint) {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: KEY_LOCATION,
        urlList: allUrls,
      }),
    })

    const text = await res.text()
    console.log(`[IndexNow] ${endpoint} -> Status: ${res.status} (${res.statusText}) ${text ? text.slice(0, 100) : ""}`)
    return res.status === 200 || res.status === 202
  } catch (err) {
    console.error(`[IndexNow Error] ${endpoint}:`, err.message)
    return false
  }
}

async function pingSitemap(engineUrl) {
  try {
    const sitemapUrl = `https://${HOST}/sitemap.xml`
    const target = `${engineUrl}${encodeURIComponent(sitemapUrl)}`
    const res = await fetch(target)
    console.log(`[Sitemap Ping] ${engineUrl} -> ${res.status}`)
  } catch (err) {
    console.error(`[Sitemap Ping Error] ${engineUrl}:`, err.message)
  }
}

async function main() {
  console.log("=== Submitting All Site URLs via IndexNow Bulk API ===")
  await submitBulk("https://api.indexnow.org/indexnow")
  await submitBulk("https://www.bing.com/indexnow")

  console.log("\n=== Pinging Sitemaps to Search Engines ===")
  await pingSitemap("https://www.google.com/ping?sitemap=")
  await pingSitemap("https://www.bing.com/ping?sitemap=")

  console.log("\n[Done] All URLs processed.")
}

main()
