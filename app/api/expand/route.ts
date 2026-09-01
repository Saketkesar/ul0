import { type NextRequest, NextResponse } from "next/server"
import { validateUrl, isPhishingAttempt } from "@/lib/utils/slug"
import { checkRateLimit, getClientIP } from "@/lib/utils/rate-limit"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    const rateLimit = checkRateLimit(`expand:${ip}`, { windowMs: 60000, maxRequests: 20 })
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please wait a moment before inspecting more links." },
        { status: 429 }
      )
    }

    const body = await request.json().catch(() => ({}))
    let { url } = body

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "A valid URL is required" }, { status: 400 })
    }

    url = url.trim()
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`
    }

    // SSRF & protocol validation
    const initialValidation = validateUrl(url)
    if (!initialValidation.valid) {
      return NextResponse.json(
        { error: initialValidation.reason || "Invalid URL. Private IPs and disallowed schemes are blocked." },
        { status: 400 }
      )
    }

    const redirectChain: { url: string; status: number; host: string }[] = []
    let currentUrl = url
    let maxHops = 6
    let finalUrl = url
    let isHttps = false

    try {
      while (maxHops > 0) {
        maxHops--
        const parsed = new URL(currentUrl)
        
        // Ensure every hop is safe from SSRF
        const hopValidation = validateUrl(currentUrl)
        if (!hopValidation.valid) {
          redirectChain.push({
            url: currentUrl,
            status: 403,
            host: parsed.hostname,
          })
          break
        }

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 4000)

        const response = await fetch(currentUrl, {
          method: "GET",
          redirect: "manual",
          signal: controller.signal,
          headers: {
            "User-Agent": "ul0-LinkSafetyChecker/2.0 (+https://ul0.site/security)",
            "Accept": "text/html,application/xhtml+xml,*/*",
          },
        })
        clearTimeout(timeoutId)

        redirectChain.push({
          url: currentUrl,
          status: response.status,
          host: parsed.hostname,
        })

        const location = response.headers.get("location")
        if (location && [301, 302, 303, 307, 308].includes(response.status)) {
          // Resolve relative or absolute redirect URL
          const nextUrl = new URL(location, currentUrl).toString()
          currentUrl = nextUrl
          finalUrl = nextUrl
        } else {
          finalUrl = currentUrl
          break
        }
      }
    } catch (err: any) {
      // If network fetch fails (e.g. timeout or connection reset), we still report what we resolved
      finalUrl = currentUrl
    }

    const finalParsed = new URL(finalUrl)
    isHttps = finalParsed.protocol === "https:"

    // Security heuristic check on final target
    const isSuspicious = isPhishingAttempt(finalParsed.hostname, finalUrl)
    const securityWarnings: string[] = []
    if (isSuspicious) {
      securityWarnings.push("Domain exhibits brand mimicry or high-risk TLD phishing patterns.")
    }
    if (!isHttps) {
      securityWarnings.push("Destination does not enforce secure TLS/HTTPS encryption.")
    }

    return NextResponse.json({
      originalUrl: url,
      finalUrl,
      isHttps,
      hopsCount: redirectChain.length,
      redirectChain,
      domain: finalParsed.hostname,
      isSuspicious,
      securityWarnings,
      trustScore: isSuspicious ? 35 : (isHttps ? 98 : 75),
    })
  } catch (error: any) {
    console.error("[URL Expander Error]:", error)
    return NextResponse.json(
      { error: "Failed to inspect URL. The destination server may be unreachable." },
      { status: 500 }
    )
  }
}
