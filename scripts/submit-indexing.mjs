// scripts/submit-indexing.mjs
// Automates instant submission of all site URLs to search engines via IndexNow & Sitemaps

const HOST = "ul0.site"
const KEY = "1b98f244195a4bb896890d3bb639f7ee"

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
  "/free-url-shortener",
  "/qr-code-generator",
  "/utm-builder",
  "/link-tracker",
  "/link-in-bio",
  "/url-expander",
  "/wifi-qr-code-generator",
  "/qr-code-for-business",
  "/security",
  "/report-abuse",
  "/split",
  "/share",
  "/qr",
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

console.log(`[Indexing] Total URLs to submit: ${allUrls.length}`)

async function submitUrl(url, endpointBase, retries = 3) {
  const targetUrl = `${endpointBase}?url=${encodeURIComponent(url)}&key=${KEY}`
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(targetUrl)
      if (res.status === 200 || res.status === 202) {
        return { ok: true, status: res.status }
      }
      if (res.status === 403 || res.status === 429) {
        // Rate limit backoff
        await new Promise((r) => setTimeout(r, 2000 * attempt))
      }
    } catch (err) {
      await new Promise((r) => setTimeout(r, 1000 * attempt))
    }
  }
  return { ok: false }
}

async function main() {
  console.log("=== Submitting All Site URLs with Rate-Limit Backoff ===")

  let success = 0

  for (let i = 0; i < allUrls.length; i++) {
    const url = allUrls[i]
    const res = await submitUrl(url, "https://api.indexnow.org/indexnow")
    if (res.ok) {
      console.log(`  [OK ${res.status}] (${i + 1}/${allUrls.length}) ${url}`)
      success++
    } else {
      console.warn(`  [WARN] Failed to submit (${i + 1}/${allUrls.length}) ${url}`)
    }
    // Respect rate limits with a 800ms gap
    await new Promise((r) => setTimeout(r, 800))
  }

  console.log(`\n=== Finished: ${success}/${allUrls.length} URLs Accepted by Search Engines ===`)
}

main()
