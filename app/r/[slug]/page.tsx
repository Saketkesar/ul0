import { notFound, redirect } from "next/navigation"
import { after } from "next/server"
import { headers } from "next/headers"
import Link from "next/link"
import dns from "dns"
import type { Metadata } from "next"

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
import { Lock, AlertCircle, AlertTriangle, ExternalLink, ShieldCheck, ArrowRight, Flag } from "lucide-react"

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

function sanitizeSlug(raw: string): { slug: string; isPreview: boolean } | null {
  let isPreview = false
  let slug = raw

  // Support /r/slug+ as instant preview mode
  if (slug.endsWith("+")) {
    isPreview = true
    slug = slug.slice(0, -1)
  }

  const sanitized = slug.replace(/[^a-zA-Z0-9-_]/g, "")
  if (sanitized.length < 1 || sanitized.length > 50) return null
  if (sanitized.includes("..") || sanitized !== slug) return null

  return { slug: sanitized, isPreview }
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

function resolveTargetUrl(
  link: LinkDoc,
  countryCode: string | null,
  deviceType: string | null
): string {
  if (!link.targeting_json) return link.long_url
  try {
    const targeting = JSON.parse(link.targeting_json)

    // Geo targeting
    if (targeting.geo_targeting && countryCode) {
      const code = countryCode.toUpperCase()
      if (targeting.geo_targeting[code]) {
        return targeting.geo_targeting[code]
      }
    }

    // Device targeting
    if (targeting.device_targeting && deviceType) {
      if (targeting.device_targeting[deviceType]) {
        return targeting.device_targeting[deviceType]
      }
    }

    // A/B testing
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
  const { slug: rawSlug } = await params
  const search = await searchParams

  const parsed = sanitizeSlug(rawSlug)
  if (!parsed) notFound()

  const { slug, isPreview: isPlusPreview } = parsed
  const isQueryPreview = search.preview === "1" || search.preview === "true"
  const showPreview = isPlusPreview || isQueryPreview

  const host = await resolveHost()
  const isCustomDomain = host !== DEFAULT_HOST && !host.endsWith(".ul0.site")

  if (isCustomDomain) {
    const domainDoc = await getDomainByName(host)
    if (!domainDoc || domainDoc.status !== "verified") notFound()
  }

  // Fetch link document
  const link = await getLinkByHostSlug(host, slug)
  if (!link) notFound()

  // 1. Expiration check
  if (link.expire_at && new Date(link.expire_at) < new Date()) {
    return renderExpiredPage("This short link has expired based on its set expiration date.")
  }

  // Parse targeting controls
  let password = ""
  let clicksLimit = 0
  let oneTime = false
  let isSuspicious = false
  let suspiciousOriginalUrl = ""

  if (link.targeting_json) {
    try {
      const targeting = JSON.parse(link.targeting_json)
      password = targeting.password ?? ""
      clicksLimit = Number(targeting.clicks_limit) || 0
      oneTime = !!targeting.one_time
      isSuspicious = !!targeting.is_suspicious
      suspiciousOriginalUrl = targeting.suspicious_original_url ?? ""
    } catch (e) {
      console.error("Targeting JSON parse error:", e)
    }
  }

  // Phishing / safety check
  let isDomainBlocked = false
  try {
    const parsedUrl = new URL(link.long_url)
    const hostname = parsedUrl.hostname.toLowerCase()
    isDomainBlocked = isBlockedHostname(hostname) || isPhishingAttempt(hostname, link.long_url)
  } catch {}

  if (isSuspicious || isDomainBlocked) {
    const report = await getPhishingDomainReport(link.long_url)
    const genuineSite = suspiciousOriginalUrl || "https://ul0.site"
    return renderPhishingPage(link.long_url, genuineSite, report)
  }

  // Clicks limit check
  if (clicksLimit > 0 && link.clicks_count >= clicksLimit) {
    return renderExpiredPage("This link has reached its maximum designated click limit.")
  }

  // Password check
  const enteredPassword = typeof search.password === "string" ? search.password : ""
  if (password && enteredPassword !== password) {
    const isWrong = enteredPassword !== ""
    return renderPasswordPage(isWrong)
  }

  // Extract edge headers for analytics
  const headersList = await headers()
  const userAgent = headersList.get("user-agent") || ""
  const referrer = headersList.get("referer") || ""
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

  const utm_source = typeof search.utm_source === "string" ? search.utm_source : null
  const utm_medium = typeof search.utm_medium === "string" ? search.utm_medium : null
  const utm_campaign = typeof search.utm_campaign === "string" ? search.utm_campaign : null
  const isQr = search.qr === "1" || search.source === "qr" || search.ref === "qr"

  const ipHash = ip
  const targetUrl = resolveTargetUrl(link, country, uaData.device)

  if (!isSafeRedirectUrl(targetUrl)) {
    notFound()
  }

  // 2. Link Preview Mode (if requested via + or ?preview=1)
  if (showPreview) {
    return renderLinkPreviewPage(link, targetUrl)
  }

  const unique = await isUniqueVisitor(link.$id, ipHash)

  // Asynchronous non-blocking click tracking
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
          qr_scan: isQr,
          ip_hash: ipHash,
        }),
        incrementClickCount(link.$id),
        // Atomic increment in Redis for real-time consistency
        redis.incr(`clicks:${link.$id}`).catch(() => null),
        // Invalidate Redis analytics summary caches so dashboard reflects click immediately (<5s)
        redis.del(
          `analytics:summary:${link.$id}:24h`,
          `analytics:summary:${link.$id}:7d`,
          `analytics:summary:${link.$id}:30d`,
          `analytics:summary:${link.$id}:90d`,
          `analytics:summary:${link.$id}:all`
        ).catch(() => null),
      ])
    } catch (e) {
      console.error("Click background logging error:", e)
    }
  })

  // 3. One-time link behavior
  if (oneTime) {
    try {
      const { Databases, Client } = require("node-appwrite")
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
      ).catch(() => null)
    } catch {}
  }

  // 4. Instant 307 Temporary Redirect (ensures repeat clicks hit server and are counted reliably)
  redirect(targetUrl)
}

function renderLinkPreviewPage(link: LinkDoc, destinationUrl: string) {
  let hostname = ""
  try {
    hostname = new URL(destinationUrl).hostname
  } catch {
    hostname = destinationUrl
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground">Link Safety Inspection</h1>
              <p className="text-[11px] text-muted-foreground font-mono">ul0.site/r/{link.slug}</p>
            </div>
          </div>
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded border border-border bg-muted/40 text-muted-foreground">
            Preview Mode
          </span>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Destination Domain
            </span>
            <div className="p-3 rounded-md border border-border bg-muted/30 font-mono text-sm font-semibold text-foreground">
              {hostname}
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Full Target URL
            </span>
            <div className="p-3 rounded-md border border-border bg-muted/20 font-mono text-xs text-muted-foreground break-all select-all">
              {destinationUrl}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
            <div className="p-3 rounded-md border border-border bg-card space-y-0.5">
              <span className="text-muted-foreground text-[11px]">Safety Status</span>
              <p className="font-semibold text-emerald-600 dark:text-emerald-400">Screened Clean</p>
            </div>
            <div className="p-3 rounded-md border border-border bg-card space-y-0.5">
              <span className="text-muted-foreground text-[11px]">Redirect Type</span>
              <p className="font-semibold text-foreground">307 Temporary</p>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-border">
          <a
            href={destinationUrl}
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <span>Continue to destination</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
          <div className="flex items-center justify-between text-xs pt-1">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Go to ul0.site
            </Link>
            <Link
              href={`/report-abuse?url=${encodeURIComponent(`https://ul0.site/r/${link.slug}`)}`}
              className="text-destructive hover:underline inline-flex items-center gap-1"
            >
              <Flag className="h-3 w-3" />
              <span>Report abuse</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function renderPasswordPage(isWrong: boolean) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-md space-y-5 rounded-xl border border-border bg-card p-6 sm:p-8 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Lock className="h-5 w-5" />
        </div>

        <div className="space-y-1">
          <h2 className="text-base font-semibold text-foreground">Password Required</h2>
          <p className="text-xs text-muted-foreground">
            The creator has protected this short link with a password.
          </p>
        </div>

        <form method="GET" className="space-y-3 text-left">
          <div className="space-y-1">
            <input
              type="password"
              name="password"
              placeholder="Enter passcode"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring"
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
            className="w-full rounded-md bg-primary py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Access Link
          </button>
        </form>
      </div>
    </div>
  )
}

function renderExpiredPage(message: string) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-md space-y-5 rounded-xl border border-border bg-card p-6 sm:p-8 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <AlertCircle className="h-5 w-5" />
        </div>

        <div className="space-y-1">
          <h2 className="text-base font-semibold text-foreground">Link Expired (410)</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">{message}</p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center w-full rounded-md border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
          >
            Go to ul0.site
          </Link>
        </div>
      </div>
    </div>
  )
}

async function getPhishingDomainReport(longUrl: string) {
  let domain = ""
  try {
    domain = new URL(longUrl).hostname
  } catch {
    domain = longUrl
  }

  let ipAddress = "Unknown"
  try {
    const result = await dns.promises.lookup(domain)
    ipAddress = result.address
  } catch {}

  return {
    domain,
    ipAddress,
    threatScore: 88,
  }
}

function renderPhishingPage(
  suspiciousUrl: string,
  originalUrl: string,
  report: { domain: string; ipAddress: string; threatScore: number }
) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-xl space-y-5 rounded-xl border border-destructive/40 bg-card p-6 sm:p-8">
        <div className="flex items-center gap-3 border-b border-border pb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-destructive">
              Security Warning: Flagged Destination
            </h2>
            <p className="text-xs text-muted-foreground">
              This short link has been flagged as suspicious or potentially deceptive.
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-muted/40 border border-border p-3.5 space-y-2 text-xs text-muted-foreground">
          <p>
            The destination URL is flagged: <span className="font-mono text-destructive break-all">{suspiciousUrl}</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center rounded-md bg-foreground text-background px-4 py-2 text-xs font-semibold hover:bg-foreground/90 transition-colors"
          >
            Back to Safety (ul0.site)
          </Link>
          <a
            href={suspiciousUrl}
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center rounded-md border border-border bg-card px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            Proceed anyway (unrecommended)
          </a>
        </div>
      </div>
    </div>
  )
}
