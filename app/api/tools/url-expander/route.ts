import { NextRequest, NextResponse } from "next/server"
import { checkRateLimit } from "@/lib/redis"
import { isPhishingAttempt, BLOCKED_DOMAINS, isBlockedHostname } from "@/lib/utils/slug"

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
    const rl = await checkRateLimit(`rl:url_expander:${ip}`, 20, 60)
    if (!rl.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded. Please wait a minute." }, { status: 429 })
    }

    const body = await req.json().catch(() => ({}))
    let inputUrl = (body.url || "").trim()

    if (!inputUrl) {
      return NextResponse.json({ error: "Please enter a valid shortened URL." }, { status: 400 })
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
      return NextResponse.json({ error: "Private or internal URLs cannot be unshortened." }, { status: 400 })
    }

    // Follow redirects
    let currentUrl = parsedUrl.toString()
    let hopsCount = 0
    const maxHops = 10
    let lastResponse: Response | null = null

    while (hopsCount < maxHops) {
      hopsCount++
      try {
        lastResponse = await fetch(currentUrl, {
          method: "GET",
          redirect: "manual",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 (compatible; ul0Expander/2.0; +https://ul0.site)",
          },
          signal: AbortSignal.timeout(6000),
        })

        const status = lastResponse.status
        const location = lastResponse.headers.get("location")

        if ([301, 302, 303, 307, 308].includes(status) && location) {
          const nextUrl = new URL(location, currentUrl)
          if (isPrivateIpOrHost(nextUrl.hostname)) {
            break
          }
          currentUrl = nextUrl.toString()
        } else {
          break
        }
      } catch (err: any) {
        break
      }
    }

    const finalUrl = currentUrl
    let finalParsed: URL
    try {
      finalParsed = new URL(finalUrl)
    } catch {
      finalParsed = parsedUrl
    }

    // Safety checks
    const isSuspicious = isPhishingAttempt(finalParsed.hostname, finalUrl)
    const isBlocked = isBlockedHostname(finalParsed.hostname) || BLOCKED_DOMAINS.includes(finalParsed.hostname.toLowerCase())
    const isHttps = finalParsed.protocol === "https:"
    const isSafe = !isSuspicious && !isBlocked && isHttps

    // Extract meta title and description if HTML
    let title: string | undefined
    let description: string | undefined
    let favicon = `https://www.google.com/s2/favicons?domain=${finalParsed.hostname}&sz=64`

    if (lastResponse && lastResponse.ok) {
      const contentType = lastResponse.headers.get("content-type") || ""
      if (contentType.includes("text/html")) {
        try {
          const html = await lastResponse.text()
          // Extract title
          const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
          if (titleMatch) {
            title = titleMatch[1].trim()
          }

          // Extract meta description
          const descMatch =
            html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
            html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']description["']/i) ||
            html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i)

          if (descMatch) {
            description = descMatch[1].trim()
          }
        } catch {
          // ignore parsing error
        }
      }
    }

    return NextResponse.json({
      success: true,
      originalUrl: inputUrl,
      finalUrl,
      domain: finalParsed.hostname,
      title: title || `${finalParsed.hostname} destination`,
      description: description || "No meta description provided by the destination server.",
      favicon,
      hopsCount,
      isHttps,
      isSafe,
      threatFlag: isBlocked ? "Known malicious domain" : isSuspicious ? "Suspicious domain pattern" : null,
    })
  } catch (error: any) {
    console.error("URL expander error:", error)
    return NextResponse.json({ error: "Failed to expand URL." }, { status: 500 })
  }
}
