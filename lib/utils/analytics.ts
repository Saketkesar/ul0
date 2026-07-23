import { redis } from "@/lib/redis"

export interface UserAgentData {
  device: "desktop" | "mobile" | "tablet"
  browser: string
  os: string
  bot: boolean
}

/**
 * Lightweight, regex-based user-agent parser
 */
export function parseUserAgent(uaString: string): UserAgentData {
  const ua = uaString.toLowerCase()
  let device: "desktop" | "mobile" | "tablet" = "desktop"
  let browser = "Other"
  let os = "Other"
  let bot = false

  // Bot detection
  if (
    /bot|googlebot|crawler|spider|robot|crawling|lighthouse|headlesschrome|semrushbot|ahrefsbot|yandexbot|bingbot/i.test(
      uaString
    )
  ) {
    bot = true
  }

  // Device type detection
  if (/ipad|playbook|silk/i.test(ua)) {
    device = "tablet"
  } else if (/mobile|iphone|ipod|android|blackberry|iemobile|opera mini/i.test(ua)) {
    device = "mobile"
  }

  // OS detection
  if (/windows/i.test(ua)) {
    os = "Windows"
  } else if (/macintosh|mac os x/i.test(ua)) {
    os = "macOS"
  } else if (/android/i.test(ua)) {
    os = "Android"
  } else if (/iphone|ipad|ipod/i.test(ua)) {
    os = "iOS"
  } else if (/linux/i.test(ua)) {
    os = "Linux"
  }

  // Browser detection
  if (/edg/i.test(ua)) {
    browser = "Edge"
  } else if (/chrome|crios/i.test(ua) && !/opr/i.test(ua)) {
    browser = "Chrome"
  } else if (/safari/i.test(ua) && !/chrome|crios|opr|edg/i.test(ua)) {
    browser = "Safari"
  } else if (/firefox|fxios/i.test(ua)) {
    browser = "Firefox"
  } else if (/opr/i.test(ua)) {
    browser = "Opera"
  } else if (/trident|msie/i.test(ua)) {
    browser = "IE"
  }

  return { device, browser, os, bot }
}

/**
 * Parse Accept-Language header
 */
export function parseLanguage(acceptLanguage: string | null): string {
  if (!acceptLanguage) return "en"
  // e.g. "en-US,en;q=0.9" -> "en-US"
  return acceptLanguage.split(",")[0].trim()
}

/**
 * Determine unique visitor using Upstash Redis nx set with 24 hours TTL
 */
export async function isUniqueVisitor(linkId: string, ipHash: string): Promise<boolean> {
  if (!ipHash) return true
  try {
    const key = `unique:${linkId}:${ipHash}`
    // NX: set only if the key doesn't exist. EX: 24h expiration
    const result = await redis.set(key, "1", { nx: true, ex: 60 * 60 * 24 })
    return result === "OK" || result === 1 || result === true
  } catch (error) {
    console.error("Redis unique visitor error:", error)
    return true // Fallback to true if Redis fails
  }
}
