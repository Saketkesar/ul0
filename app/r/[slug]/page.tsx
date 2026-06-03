import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { RedirectLanding } from "@/components/redirect-landing"
import { headers } from "next/headers"
import { getCachedUrl, setCachedUrl } from "@/lib/redis"
import { validateUrl } from "@/lib/utils/slug"

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

export default async function RedirectPage({ params }: Props) {
  const { slug } = await params
  
  // Sanitize slug input
  const sanitizedSlug = sanitizeSlug(slug)
  if (!sanitizedSlug) {
    notFound()
  }
  
  // Try to get URL from Redis cache first
  const cachedUrl = await getCachedUrl(sanitizedSlug)
  
  if (cachedUrl) {
    // Validate cached URL before redirecting (security check)
    if (!isSafeRedirectUrl(cachedUrl)) {
      notFound()
    }
    // Cache hit - return immediately without hitting database
    return <RedirectLanding longUrl={cachedUrl} domain={new URL(cachedUrl).hostname} />
  }
  
  // Cache miss - fetch from database
  const supabase = await createClient()

  // Fetch the link
  const { data: link, error } = await supabase.from("links").select("*").eq("slug", sanitizedSlug).single()

  if (error || !link) {
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
  setCachedUrl(sanitizedSlug, link.long_url)

  // Log the click asynchronously
  const headersList = await headers()
  const userAgent = headersList.get("user-agent") || ""
  const referer = headersList.get("referer") || ""
  const isMobile = /mobile|android|iphone|ipad|tablet/i.test(userAgent)
  const deviceType = isMobile ? "mobile" : "desktop"

  // Fire and forget - don't block render
  // Truncate user agent and referer to prevent database overflow
  supabase
    .from("clicks")
    .insert({
      link_id: link.id,
      user_agent: userAgent.substring(0, 500),
      referrer: referer.substring(0, 500),
      device_type: deviceType,
    })
    .then(() => {
      supabase
        .from("links")
        .update({ clicks_count: (link.clicks_count || 0) + 1 })
        .eq("id", link.id)
    })

  return <RedirectLanding longUrl={link.long_url} domain={link.meta_domain} />
}
