import { NextRequest, NextResponse } from "next/server"
import { checkRateLimit } from "@/lib/redis"

export const dynamic = "force-dynamic"

export interface RedirectHop {
  hop: number
  url: string
  status: number
  statusText: string
  location?: string
  latencyMs: number
  server?: string
  contentType?: string
}

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
  // Check 172.16.0.0 - 172.31.255.255
  if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(lower)) {
    return true
  }
  return false
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1"
    const rl = await checkRateLimit(`rl:redirect_checker:${ip}`, 20, 60)
    if (!rl.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded. Please wait a minute." }, { status: 429 })
    }

    const body = await req.json().catch(() => ({}))
    let inputUrl = (body.url || "").trim()

    if (!inputUrl) {
      return NextResponse.json({ error: "Please enter a valid URL." }, { status: 400 })
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
      return NextResponse.json({ error: "Private or internal URLs cannot be traced." }, { status: 400 })
    }

    const hops: RedirectHop[] = []
    let currentUrl = parsedUrl.toString()
    let hopCount = 0
    const maxHops = 10
    const overallStart = Date.now()

    while (hopCount < maxHops) {
      hopCount++
      const hopStart = Date.now()

      let res: Response
      try {
        res = await fetch(currentUrl, {
          method: "GET",
          redirect: "manual",
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 (compatible; ul0Bot/2.0; +https://ul0.site/bot)",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          },
          signal: AbortSignal.timeout(8000),
        })
      } catch (err: any) {
        hops.push({
          hop: hopCount,
          url: currentUrl,
          status: 0,
          statusText: err.name === "TimeoutError" ? "Connection Timed Out (8s)" : (err.message || "Connection Failed"),
          latencyMs: Date.now() - hopStart,
        })
        break
      }

      const hopLatency = Date.now() - hopStart
      const status = res.status
      const location = res.headers.get("location") || undefined
      const server = res.headers.get("server") || undefined
      const contentType = res.headers.get("content-type")?.split(";")[0] || undefined

      hops.push({
        hop: hopCount,
        url: currentUrl,
        status,
        statusText: res.statusText || `${status}`,
        location,
        latencyMs: hopLatency,
        server,
        contentType,
      })

      // If redirect status code and location header present, follow next hop
      if ([301, 302, 303, 307, 308].includes(status) && location) {
        try {
          const nextUrl = new URL(location, currentUrl)
          if (isPrivateIpOrHost(nextUrl.hostname)) {
            break
          }
          currentUrl = nextUrl.toString()
        } catch {
          break
        }
      } else {
        // Destination reached
        break
      }
    }

    const lastHop = hops[hops.length - 1]
    const finalUrl = lastHop?.location || lastHop?.url || currentUrl
    const finalStatus = lastHop?.status || 0
    const totalTimeMs = Date.now() - overallStart

    return NextResponse.json({
      success: true,
      originalUrl: inputUrl,
      finalUrl,
      finalStatus,
      totalHops: hops.length,
      totalTimeMs,
      hops,
    })
  } catch (error: any) {
    console.error("Redirect checker error:", error)
    return NextResponse.json({ error: "Failed to trace redirects." }, { status: 500 })
  }
}
