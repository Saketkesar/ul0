import { notFound } from "next/navigation"
import { after } from "next/server"
import { headers } from "next/headers"
import { CuteRedirectLanding } from "@/components/cute-redirect-landing"
import { redis } from "@/lib/redis"
import { validateUrl, isBlockedHostname, isPhishingAttempt } from "@/lib/utils/slug"
import {
  getLinkByHostSlug,
  logClick,
  incrementClickCount,
  type LinkDoc,
} from "@/lib/appwrite/links"
import { DEFAULT_HOST } from "@/lib/appwrite/config"
import { getDomainByName } from "@/lib/appwrite/domains"
import { parseUserAgent, parseLanguage, isUniqueVisitor } from "@/lib/utils/analytics"
import type { Metadata } from "next"

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

function sanitizeSlug(slug: string): string | null {
  const sanitized = slug.replace(/[^a-zA-Z0-9-_]/g, "")
  if (sanitized.length < 1 || sanitized.length > 50) return null
  if (sanitized.includes("..") || sanitized !== slug) return null
  return sanitized
}

function isSafeRedirectUrl(url: string): boolean {
  const validation = validateUrl(url)
  return validation.valid
}

async function resolveHost(): Promise<string> {
  const headersList = await headers()
  const rawHost = headersList.get("host") || headersList.get("x-forwarded-host") || DEFAULT_HOST
  return rawHost.split(":")[0].toLowerCase()
}

export default async function DynamicQrRedirectPage({ params, searchParams }: Props) {
  const { slug } = await params
  const search = await searchParams

  const sanitizedSlug = sanitizeSlug(slug)
  if (!sanitizedSlug) notFound()

  const host = await resolveHost()
  const isCustomDomain = host !== DEFAULT_HOST && !host.endsWith(".ul0.site")

  let brandLogoUrl: string | null = null
  if (isCustomDomain) {
    const domainDoc = await getDomainByName(host)
    if (!domainDoc || domainDoc.status !== "verified") notFound()
    brandLogoUrl = domainDoc.brand_logo_url ?? null
  }

  // Fetch link from Appwrite
  const link = await getLinkByHostSlug(host, sanitizedSlug)
  if (!link) notFound()

  // 1. Check expiration date
  if (link.expire_at && new Date(link.expire_at) < new Date()) {
    notFound()
  }

  // Parse custom message or targeting controls
  let customMessage = "You are being redirected, please wait 6 sec..."
  let clicksLimit = 0
  let customLogoUrl: string | null = null

  if (link.targeting_json) {
    try {
      const targeting = JSON.parse(link.targeting_json)
      if (targeting.cute_message) {
        customMessage = targeting.cute_message
      }
      if (targeting.qr_design?.customLogoUrl) {
        customLogoUrl = targeting.qr_design.customLogoUrl
      }
      clicksLimit = Number(targeting.clicks_limit) || 0
    } catch {}
  }

  // Phishing check
  try {
    const parsedUrl = new URL(link.long_url)
    const hostname = parsedUrl.hostname.toLowerCase()
    if (isBlockedHostname(hostname) || isPhishingAttempt(hostname, link.long_url)) {
      notFound()
    }
  } catch {}

  // Check clicks limit
  if (clicksLimit > 0 && link.clicks_count >= clicksLimit) {
    notFound()
  }

  const targetUrl = link.long_url
  if (!isSafeRedirectUrl(targetUrl)) {
    notFound()
  }

  // Extract client geo and request headers
  const headersList = await headers()
  const userAgent = headersList.get("user-agent") || ""
  const referrer = headersList.get("referer") || "Direct QR Scan"
  const acceptLanguage = headersList.get("accept-language")

  const country = headersList.get("x-vercel-ip-country") || headersList.get("cf-ipcountry") || "US"
  const region = headersList.get("x-vercel-ip-country-region") || headersList.get("cf-region") || null
  const city = headersList.get("x-vercel-ip-city") || headersList.get("cf-ipcity") || null
  const latitudeStr = headersList.get("x-vercel-ip-latitude")
  const longitudeStr = headersList.get("x-vercel-ip-longitude")
  const latitude = latitudeStr ? parseFloat(latitudeStr) : null
  const longitude = longitudeStr ? parseFloat(longitudeStr) : null
  const timezone = headersList.get("x-vercel-ip-timezone") || null
  const ip = headersList.get("x-real-ip") || headersList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1"

  const uaData = parseUserAgent(userAgent)
  const language = parseLanguage(acceptLanguage)

  const utm_source = typeof search.utm_source === "string" ? search.utm_source : "qr"
  const utm_medium = typeof search.utm_medium === "string" ? search.utm_medium : "dynamic_qr"
  const utm_campaign = typeof search.utm_campaign === "string" ? search.utm_campaign : null

  const ipHash = ip
  const unique = await isUniqueVisitor(link.$id, ipHash)

  // Log analytics with qr_scan: true
  after(async () => {
    try {
      await Promise.allSettled([
        logClick({
          link_id: link.$id,
          owner_id: link.owner_id,
          user_agent: userAgent.substring(0, 500),
          referrer: referrer.substring(0, 500),
          device_type: uaData.device,
          country,
          region,
          city,
          latitude,
          longitude,
          browser: uaData.browser,
          os: uaData.os,
          device: uaData.device === "mobile" ? "Mobile Phone" : uaData.device === "tablet" ? "Tablet" : "Desktop Computer",
          utm_source,
          utm_medium,
          utm_campaign,
          language,
          timezone,
          bot: uaData.bot,
          unique_visitor: unique,
          qr_scan: true, // Tagged explicitly as dynamic QR scan
          ip_hash: ipHash,
        }),
        incrementClickCount(link.$id),
        link.owner_id
          ? redis
              .lpush(
                `live_clicks:${link.owner_id}`,
                JSON.stringify({
                  linkId: link.$id,
                  slug: link.slug,
                  timestamp: new Date().toISOString(),
                  country,
                  city,
                  device: uaData.device,
                  browser: uaData.browser,
                  isQr: true,
                })
              )
              .then(() => redis.ltrim(`live_clicks:${link.owner_id}`, 0, 49))
          : Promise.resolve(),
      ])
    } catch (e) {
      console.error("Dynamic QR after() analytics error:", e)
    }
  })

  return (
    <CuteRedirectLanding
      longUrl={targetUrl}
      domain={link.meta_domain}
      customHost={isCustomDomain ? host : null}
      brandLogoUrl={customLogoUrl || brandLogoUrl}
      customMessage={customMessage}
    />
  )
}
