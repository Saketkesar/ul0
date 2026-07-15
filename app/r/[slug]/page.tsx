import { notFound } from "next/navigation"
import { RedirectLanding } from "@/components/redirect-landing"
import { headers } from "next/headers"
import { getCachedUrl, setCachedUrl, redis } from "@/lib/redis"
import { validateUrl } from "@/lib/utils/slug"
import {
  getLinkByHostSlug,
  logClick,
  incrementClickCount,
  type LinkDoc,
} from "@/lib/appwrite/links"
import { DEFAULT_HOST } from "@/lib/appwrite/config"
import { getDomainByName } from "@/lib/appwrite/domains"
import { parseUserAgent, parseLanguage, isUniqueVisitor } from "@/lib/utils/analytics"
import { Lock, AlertCircle } from "lucide-react"
import Link from "next/link"

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

function sanitizeSlug(slug: string): string | null {
  const sanitized = slug.replace(/[^a-zA-Z0-9-_]/g, '')
  if (sanitized.length < 1 || sanitized.length > 50) return null
  if (sanitized.includes('..') || sanitized !== slug) return null
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

/**
 * Helper to determine final destination based on targeting parameters
 */
function resolveTargetUrl(
  link: LinkDoc,
  countryCode: string | null,
  deviceType: string | null
): string {
  if (!link.targeting_json) return link.long_url
  try {
    const targeting = JSON.parse(link.targeting_json)
    
    // 1. Geo targeting
    if (targeting.geo_targeting && countryCode) {
      const code = countryCode.toUpperCase()
      if (targeting.geo_targeting[code]) {
        return targeting.geo_targeting[code]
      }
    }
    
    // 2. Device targeting
    if (targeting.device_targeting && deviceType) {
      if (targeting.device_targeting[deviceType]) {
        return targeting.device_targeting[deviceType]
      }
    }
    
    // 3. A/B testing
    if (targeting.ab_testing && Array.isArray(targeting.ab_testing) && targeting.ab_testing.length > 0) {
      const random = Math.random() * 100
      let cumulative = 0
      for (const option of targeting.ab_testing) {
        cumulative += option.weight
        if (random <= cumulative) {
          return option.url
        }
      }
      return targeting.ab_testing[0].url
    }
  } catch (e) {
    console.error("Resolve target URL error:", e)
  }
  return link.long_url
}

export default async function RedirectPage({ params, searchParams }: Props) {
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

  // Fetch link (from Appwrite)
  const link = await getLinkByHostSlug(host, sanitizedSlug)
  if (!link) notFound()

  // 1. Check expiration date
  if (link.expire_at && new Date(link.expire_at) < new Date()) {
    return renderExpiredPage("This link has expired based on its set expiration date.")
  }

  // Parse targeting controls
  let password = ""
  let clicksLimit = 0
  let oneTime = false
  
  if (link.targeting_json) {
    try {
      const targeting = JSON.parse(link.targeting_json)
      password = targeting.password ?? ""
      clicksLimit = Number(targeting.clicks_limit) || 0
      oneTime = !!targeting.one_time
    } catch (e) {
      console.error("Targeting JSON parse error:", e)
    }
  }

  // 2. Check clicks limit
  if (clicksLimit > 0 && link.clicks_count >= clicksLimit) {
    return renderExpiredPage("This link has reached its maximum click limit.")
  }

  // 3. Password protection validation
  const enteredPassword = typeof search.password === "string" ? search.password : ""
  if (password && enteredPassword !== password) {
    const isWrong = enteredPassword !== ""
    return renderPasswordPage(isWrong)
  }

  // Extract client geo and request headers
  const headersList = await headers()
  const userAgent = headersList.get("user-agent") || ""
  const referrer = headersList.get("referer") || ""
  const acceptLanguage = headersList.get("accept-language")
  
  // Vercel / Cloudflare geo headers
  const country = headersList.get("x-vercel-ip-country") || headersList.get("cf-ipcountry") || "US"
  const region = headersList.get("x-vercel-ip-country-region") || headersList.get("cf-region") || null
  const city = headersList.get("x-vercel-ip-city") || headersList.get("cf-ipcity") || null
  const latitudeStr = headersList.get("x-vercel-ip-latitude")
  const longitudeStr = headersList.get("x-vercel-ip-longitude")
  const latitude = latitudeStr ? parseFloat(latitudeStr) : null
  const longitude = longitudeStr ? parseFloat(longitudeStr) : null
  const timezone = headersList.get("x-vercel-ip-timezone") || null
  const ip = headersList.get("x-real-ip") || headersList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1"

  // Analytics extraction
  const uaData = parseUserAgent(userAgent)
  const language = parseLanguage(acceptLanguage)
  
  // UTM parameters
  const utm_source = typeof search.utm_source === "string" ? search.utm_source : null
  const utm_medium = typeof search.utm_medium === "string" ? search.utm_medium : null
  const utm_campaign = typeof search.utm_campaign === "string" ? search.utm_campaign : null
  
  // QR tracking (triggered if url contains ?qr=1 or similar parameters)
  const isQr = search.qr === "1" || search.source === "qr" || search.ref === "qr"

  // IP Hashing (approximate hashing for privacy)
  const ipHash = ip // in Appwrite we store ip_hash

  // Resolve targeted destination URL
  const targetUrl = resolveTargetUrl(link, country, uaData.device)

  if (!isSafeRedirectUrl(targetUrl)) {
    console.warn(`Blocked unsafe redirect URL: ${targetUrl}`)
    notFound()
  }

  // Unique visitor check (cached in Redis to avoid DB querying overhead)
  const unique = await isUniqueVisitor(link.$id, ipHash)

  // Asynchronously log the click with full variables
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
    qr_scan: isQr,
    ip_hash: ipHash,
  }).catch(console.error)

  incrementClickCount(link.$id).catch(console.error)

  // Push to Live Feed (Redis list for modern Realtime updates on Dashboard)
  if (link.owner_id) {
    const liveEvent = {
      linkId: link.$id,
      slug: link.slug,
      timestamp: new Date().toISOString(),
      country,
      city,
      device: uaData.device,
      browser: uaData.browser,
    }
    redis.lpush(`live_clicks:${link.owner_id}`, JSON.stringify(liveEvent))
      .then(() => redis.ltrim(`live_clicks:${link.owner_id}`, 0, 49)) // Cap at 50 events
      .catch(console.error)
  }

  // 4. One-time link behavior: expire after first click
  if (oneTime) {
    // Instantly expire the link in Appwrite
    const Databases = require("node-appwrite").Databases
    const Client = require("node-appwrite").Client
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1")
      .setProject(process.env.APPWRITE_PROJECT_ID!)
      .setKey(process.env.APPWRITE_API_KEY!)
    const db = new Databases(client)
    db.updateDocument(
      process.env.APPWRITE_DATABASE_ID || "ul0",
      "links",
      link.$id,
      { expire_at: new Date().toISOString() }
    ).catch(console.error)
  }

  return (
    <RedirectLanding
      longUrl={targetUrl}
      domain={link.meta_domain}
      customHost={isCustomDomain ? host : null}
      brandLogoUrl={brandLogoUrl}
    />
  )
}

function renderPasswordPage(isWrong: boolean) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] text-gray-900 font-sans px-4 selection:bg-gray-200">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 border border-rose-100 text-rose-500 shadow-2xs">
          <Lock className="h-6 w-6" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">Password Protected Link</h2>
          <p className="text-xs text-gray-500 leading-normal">
            The owner has secured this short link with a password. Please enter it below to proceed.
          </p>
        </div>

        <form method="GET" className="space-y-4 text-left">
          <div className="space-y-1">
            <input
              type="password"
              name="password"
              placeholder="Enter password..."
              className="w-full rounded-md border border-gray-300 bg-white px-3.5 py-2.5 text-sm placeholder:text-gray-400 outline-none focus:border-gray-900 transition-colors"
              required
              autoFocus
            />
            {isWrong && (
              <p className="text-xs text-destructive mt-1 font-medium flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> Incorrect password. Please try again.
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-gray-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
          >
            Access Destination
          </button>
        </form>
      </div>
    </div>
  )
}

function renderExpiredPage(message: string) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] text-gray-900 font-sans px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 border border-gray-100 text-gray-500 shadow-2xs">
          <AlertCircle className="h-6 w-6" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">Link Expired</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            {message}
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Go to ul0.site
          </Link>
        </div>
      </div>
    </div>
  )
}
