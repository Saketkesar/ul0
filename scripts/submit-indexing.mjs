// scripts/submit-indexing.mjs
// Automates instant submission of all site URLs to search engines via IndexNow & Sitemaps

const HOST = "ul0.site"
const KEY = "1b98f244195a4bb896890d3bb639f7ee"
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`
const SITEMAP_URL = `https://${HOST}/sitemap.xml`

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
]

const TOOL_PATHS = [
  "",
  "/split",
  "/share",
  "/qr",
  "/wifi",
  "/utm",
  "/json",
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
  "/hi",
  "/id",
  "/vi",
  "/th",
  "/de",
  "/fr",
  "/nl",
  "/ja",
  "/ko",
  "/ar",
]

const allUrls = [
  ...TOOL_PATHS.map((p) => `https://${HOST}${p}`),
  ...BLOG_SLUGS.map((slug) => `https://${HOST}/blog/${slug}`),
]

console.log(`[Indexing] Total URLs compiled: ${allUrls.length}`)

async function submitIndexNow(endpoint) {
  try {
    const payload = {
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList: allUrls,
    }

    console.log(`[IndexNow] Submitting ${allUrls.length} URLs to ${endpoint}...`)
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    })

    console.log(`[IndexNow] ${endpoint} -> Status ${res.status} ${res.statusText}`)
    const text = await res.text()
    if (text) console.log(`[IndexNow Response]:`, text)
  } catch (err) {
    console.error(`[IndexNow Error on ${endpoint}]:`, err.message)
  }
}

async function pingSitemap(engine, pingUrl) {
  try {
    console.log(`[Sitemap Ping] Pinging ${engine}...`)
    const res = await fetch(pingUrl)
    console.log(`[Sitemap Ping] ${engine} -> Status ${res.status}`)
  } catch (err) {
    console.error(`[Sitemap Ping Error on ${engine}]:`, err.message)
  }
}

async function main() {
  console.log("=== Starting Search Engine Submissions ===")

  // 1. IndexNow API Endpoints (Bing, Yandex, IndexNow standard)
  await submitIndexNow("https://api.indexnow.org/indexnow")
  await submitIndexNow("https://www.bing.com/indexnow")
  await submitIndexNow("https://yandex.com/indexnow")

  // 2. Sitemap Pings
  await pingSitemap("Google", `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`)
  await pingSitemap("Bing", `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`)

  console.log("=== Finished Search Engine Submissions ===")
}

main()
