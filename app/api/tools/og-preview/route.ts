import { NextRequest, NextResponse } from "next/server"
import { checkRateLimit } from "@/lib/redis"

export const dynamic = "force-dynamic"

function isPrivateIpOrHost(hostname: string): boolean {
  const lower = hostname.toLowerCase()
  if (
    lower === "localhost" ||
    lower.endsWith(".local") ||
    lower.endsWith(".internal") ||
    lower.startsWith("127.") ||
    lower.startsWith("10.") ||
    lower.startsWith("192.168.") ||
    lower.startsWith("169.254.")
  ) {
    return true
  }
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(lower)) {
    return true
  }
  return false
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1"
    const rl = await checkRateLimit(`rl:og_preview:${ip}`, 20, 60)
    if (!rl.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded. Please wait a minute." }, { status: 429 })
    }

    const body = await req.json().catch(() => ({}))
    let inputUrl = (body.url || "").trim()

    if (!inputUrl) {
      return NextResponse.json({ error: "Please enter a valid webpage URL." }, { status: 400 })
    }

    if (!inputUrl.startsWith("http://") && !inputUrl.startsWith("https://")) {
      inputUrl = "https://" + inputUrl
    }

    let parsedUrl: URL
    try {
      parsedUrl = new URL(inputUrl)
    } catch {
      return NextResponse.json({ error: "Invalid URL format." }, { status: 400 })
    }

    if (isPrivateIpOrHost(parsedUrl.hostname)) {
      return NextResponse.json({ error: "Private or internal URLs cannot be previewed." }, { status: 400 })
    }

    const response = await fetch(parsedUrl.toString(), {
      method: "GET",
      headers: {
        "User-Agent":
          "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php; ul0Bot/1.0; +https://ul0.site)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `The target server returned HTTP status ${response.status}.` },
        { status: 400 }
      )
    }

    const html = await response.text()

    // Helper regex extractors
    const getTagContent = (propOrName: string) => {
      const patterns = [
        new RegExp(`<meta[^>]+property=["']${propOrName}["'][^>]+content=["']([^"']+)["']`, "i"),
        new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${propOrName}["']`, "i"),
        new RegExp(`<meta[^>]+name=["']${propOrName}["'][^>]+content=["']([^"']+)["']`, "i"),
        new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${propOrName}["']`, "i"),
      ]
      for (const pattern of patterns) {
        const match = html.match(pattern)
        if (match && match[1]) return match[1].trim()
      }
      return null
    }

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const rawTitle = titleMatch ? titleMatch[1].trim() : ""

    const ogTitle = getTagContent("og:title")
    const ogDescription = getTagContent("og:description")
    const ogImage = getTagContent("og:image") || getTagContent("og:image:url")
    const ogUrl = getTagContent("og:url") || parsedUrl.toString()
    const ogSiteName = getTagContent("og:site_name")

    const twitterCard = getTagContent("twitter:card") || "summary_large_image"
    const twitterTitle = getTagContent("twitter:title")
    const twitterDescription = getTagContent("twitter:description")
    const twitterImage = getTagContent("twitter:image")

    const metaDescription = getTagContent("description")

    // Resolve relative image URLs
    const resolveImageUrl = (img: string | null) => {
      if (!img) return null
      try {
        return new URL(img, parsedUrl.toString()).toString()
      } catch {
        return img
      }
    }

    const resolvedOgImage = resolveImageUrl(ogImage)
    const resolvedTwitterImage = resolveImageUrl(twitterImage) || resolvedOgImage

    const finalTitle = ogTitle || twitterTitle || rawTitle || parsedUrl.hostname
    const finalDescription = ogDescription || twitterDescription || metaDescription || ""
    const finalImage = resolvedOgImage || resolvedTwitterImage || null

    return NextResponse.json({
      success: true,
      url: parsedUrl.toString(),
      domain: parsedUrl.hostname,
      title: finalTitle,
      description: finalDescription,
      image: finalImage,
      siteName: ogSiteName || parsedUrl.hostname,
      twitterCard,
      raw: {
        htmlTitle: rawTitle,
        ogTitle,
        ogDescription,
        ogImage: resolvedOgImage,
        ogSiteName,
        twitterTitle,
        twitterDescription,
        twitterImage: resolvedTwitterImage,
        metaDescription,
      },
    })
  } catch (error: any) {
    console.error("OG preview error:", error)
    return NextResponse.json({ error: error.message || "Failed to inspect OpenGraph tags." }, { status: 500 })
  }
}
