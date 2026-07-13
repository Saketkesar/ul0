import { notFound } from "next/navigation"
import { RedirectLanding } from "@/components/redirect-landing"
import { headers } from "next/headers"
import { getCachedUrl, setCachedUrl } from "@/lib/redis"
import { validateUrl } from "@/lib/utils/slug"
import {
  getLinkByHostSlug,
  logClick,
  incrementClickCount,
} from "@/lib/appwrite/links"
import { DEFAULT_HOST } from "@/lib/appwrite/config"
import { getDomainByName } from "@/lib/appwrite/domains"

interface Props {
  params: Promise<{ slug: string }>
}

// Validate and sanitize slug to prevent path traversal
function sanitizeSlug(slug: string): string | null {
  // Only allow alphanumeric, dash, and underscore
  const sanitized = slug.replace(/[^a-zA-Z0-9-_]/g, '')
  
  // Must be between 1-50 characters
  if (sanitized.length < 1 || sanitized.length > 50) {
    return null
  }
  
  // No path traversal
  if (sanitized.includes('..') || sanitized !== slug) {
    return null
  }
  
  return sanitized
}

// Validate that a URL is safe to redirect to
function isSafeRedirectUrl(url: string): boolean {
  const validation = validateUrl(url)
  return validation.valid
}

/**
 * Resolve the host from the request headers.
 * Returns the domain portion (no port). Falls back to DEFAULT_HOST.
 */
async function resolveHost(): Promise<string> {
  const headersList = await headers()
  const rawHost = headersList.get("host") || headersList.get("x-forwarded-host") || DEFAULT_HOST
  // Strip port if present
  return rawHost.split(":")[0].toLowerCase()
}

export default async function RedirectPage({ params }: Props) {
  const { slug } = await params
  
  // Sanitize slug input
  const sanitizedSlug = sanitizeSlug(slug)
  if (!sanitizedSlug) {
    notFound()
  }

  // Resolve the host for multi-tenant routing
  const host = await resolveHost()
  const isCustomDomain = host !== DEFAULT_HOST && !host.endsWith(".ul0.site")

  // For custom domains, verify the domain is registered and verified
  let brandLogoUrl: string | null = null
  if (isCustomDomain) {
    const domainDoc = await getDomainByName(host)
    if (!domainDoc || domainDoc.status !== "verified") {
      // Unverified or unknown domain — don't resolve links
      notFound()
    }
    brandLogoUrl = domainDoc.brand_logo_url ?? null
  }

  // Try to get URL from Redis cache first (keyed by host:slug)
  const cachedUrl = await getCachedUrl(sanitizedSlug, host)
  
  if (cachedUrl) {
    // Validate cached URL before redirecting (security check)
    if (!isSafeRedirectUrl(cachedUrl)) {
      notFound()
    }
    // Cache hit - return immediately without hitting database
    return (
      <RedirectLanding
        longUrl={cachedUrl}
        domain={new URL(cachedUrl).hostname}
        customHost={isCustomDomain ? host : null}
        brandLogoUrl={brandLogoUrl}
      />
    )
  }
  
  // Cache miss - fetch from Appwrite (scoped by host)
  const link = await getLinkByHostSlug(host, sanitizedSlug)

  if (!link) {
    notFound()
  }

  // Check if link is expired
  if (link.expire_at && new Date(link.expire_at) < new Date()) {
    notFound()
  }
  
  // SECURITY: Validate the stored URL before redirecting
  // This protects against malicious URLs that may have been stored before validation was added
  if (!isSafeRedirectUrl(link.long_url)) {
    console.warn(`Blocked unsafe redirect URL for slug: ${sanitizedSlug}`)
    notFound()
  }

  // Cache the URL for future requests (async, don't block)
  setCachedUrl(sanitizedSlug, link.long_url, host)

  // Log the click asynchronously
  const headersList = await headers()
  const userAgent = headersList.get("user-agent") || ""
  const referer = headersList.get("referer") || ""
  const isMobile = /mobile|android|iphone|ipad|tablet/i.test(userAgent)
  const deviceType = isMobile ? "mobile" : "desktop"

  // Fire and forget - don't block render
  logClick({
    link_id: link.$id,
    owner_id: link.owner_id,
    user_agent: userAgent.substring(0, 500),
    referrer: referer.substring(0, 500),
    device_type: deviceType,
  }).catch(console.error)

  incrementClickCount(link.$id).catch(console.error)

  return (
    <RedirectLanding
      longUrl={link.long_url}
      domain={link.meta_domain}
      customHost={isCustomDomain ? host : null}
      brandLogoUrl={brandLogoUrl}
    />
  )
}

