import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { isMarketingAdmin } from "@/lib/marketing-auth"

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId || !(await isMarketingAdmin(userId))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { url } = await req.json()
    const targetUrl = (url as string) || "https://ul0.site"

    // Validate hostname
    let parsedUrl: URL
    try {
      parsedUrl = new URL(targetUrl)
      if (!parsedUrl.hostname.includes("ul0.site") && !parsedUrl.hostname.includes("localhost")) {
        return NextResponse.json(
          { error: "Only ul0.site URLs can be audited by this endpoint." },
          { status: 400 }
        )
      }
    } catch {
      return NextResponse.json({ error: "Invalid URL provided." }, { status: 400 })
    }

    // Fetch the live page HTML
    const res = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        Accept: "text/html",
      },
      next: { revalidate: 0 },
    })

    if (!res.ok) {
      return NextResponse.json({
        error: `Could not reach ${targetUrl} (HTTP ${res.status})`,
      })
    }

    const html = await res.text()

    // 1. Title Check
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i)
    const title = titleMatch ? titleMatch[1].trim() : ""
    const titleLength = title.length
    const titleOk = titleLength >= 40 && titleLength <= 70

    // 2. Meta Description Check
    const descMatch =
      html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i) ||
      html.match(/<meta\s+content=["'](.*?)["']\s+name=["']description["']/i)
    const description = descMatch ? descMatch[1].trim() : ""
    const descLength = description.length
    const descOk = descLength >= 120 && descLength <= 165

    // 3. Canonical URL
    const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/i)
    const canonical = canonicalMatch ? canonicalMatch[1].trim() : ""
    const canonicalOk = Boolean(canonical)

    // 4. H1 Check
    const h1Matches = html.match(/<h1[^>]*>.*?<\/h1>/gi) || []
    const h1Count = h1Matches.length
    const h1Ok = h1Count === 1

    // 5. OpenGraph Tags
    const ogTitle = html.match(/property=["']og:title["']\s+content=["'](.*?)["']/i)?.[1] || ""
    const ogDesc = html.match(/property=["']og:description["']\s+content=["'](.*?)["']/i)?.[1] || ""
    const ogImage = html.match(/property=["']og:image["']\s+content=["'](.*?)["']/i)?.[1] || ""
    const ogOk = Boolean(ogTitle && ogDesc && ogImage)

    // 6. JSON-LD Structured Data
    const hasJsonLd = html.includes('type="application/ld+json"')
    const hasSoftwareApp = html.includes('"@type":"SoftwareApplication"') || html.includes('"SoftwareApplication"')
    const hasRating = html.includes('"aggregateRating"')

    // Calculate Score
    let score = 0
    if (titleOk) score += 20
    else if (title) score += 10

    if (descOk) score += 20
    else if (description) score += 10

    if (canonicalOk) score += 15
    if (h1Ok) score += 15
    if (ogOk) score += 15
    if (hasJsonLd) score += 15

    const suggestions: string[] = []
    if (!title) suggestions.push("Missing <title> tag. Add a high-intent title under 65 chars.")
    else if (titleLength < 40) suggestions.push("Title is short. Add descriptive benefit/brand.")
    else if (titleLength > 70) suggestions.push("Title exceeds 70 characters and may get truncated by Google.")

    if (!description) suggestions.push("Missing meta description. Add a 140-160 character summary.")
    else if (descLength < 120) suggestions.push("Meta description is brief (<120 chars). Expand on benefits.")
    else if (descLength > 165) suggestions.push("Meta description exceeds 165 characters.")

    if (!canonical) suggestions.push("Add a canonical link tag to prevent duplicate content indexing.")
    if (h1Count === 0) suggestions.push("Page has no <h1> tag. Ensure exactly one <h1> is present.")
    if (h1Count > 1) suggestions.push(`Page has ${h1Count} <h1> tags. Google prefers a single primary <h1>.`)
    if (!ogImage) suggestions.push("Missing OpenGraph image. Social platforms and Google Discover need preview images.")
    if (!hasJsonLd) suggestions.push("Missing Schema.org JSON-LD structured data.")
    if (hasJsonLd && !hasRating) suggestions.push("Consider adding AggregateRating schema for Google star ratings.")

    return NextResponse.json({
      url: targetUrl,
      score,
      checks: {
        title: { value: title, length: titleLength, ok: titleOk },
        description: { value: description, length: descLength, ok: descOk },
        canonical: { value: canonical, ok: canonicalOk },
        h1: { count: h1Count, ok: h1Ok },
        openGraph: { title: ogTitle, desc: ogDesc, image: ogImage, ok: ogOk },
        structuredData: { hasJsonLd, hasSoftwareApp, hasRating, ok: hasJsonLd },
      },
      suggestions,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to audit URL" }, { status: 500 })
  }
}
