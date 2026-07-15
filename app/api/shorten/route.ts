import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { generateSlug, validateUrl, validateCustomSlug, extractDomain } from "@/lib/utils/slug"
import { checkRateLimit, getClientIP, getRequestFingerprint, isSuspiciousRequest } from "@/lib/utils/rate-limit"
import { createLink, isConflictError } from "@/lib/appwrite/links"
import { DEFAULT_HOST } from "@/lib/appwrite/config"
import { getAccountByApiKey } from "@/lib/appwrite/accounts"
import { getDomainsByOwner } from "@/lib/appwrite/domains"
import { getPlanLimits } from "@/lib/plans"

// Rate limit configurations
const RATE_LIMIT_CONFIG = {
  windowMs: 60000, // 1 minute
  maxRequests: 3, // Normal users: 3 requests per minute
}

const STRICT_RATE_LIMIT_CONFIG = {
  windowMs: 60000, // 1 minute
  maxRequests: 1, // Suspicious requests: 1 per minute
}

const DAILY_RATE_LIMIT_CONFIG = {
  windowMs: 86400000, // 24 hours
  maxRequests: 50, // Max 50 links per day per IP
}

export async function POST(request: NextRequest) {
  try {
    // 1. Check for API key authentication headers
    let apiKey: string | null = null
    const authHeader = request.headers.get("authorization")
    if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
      apiKey = authHeader.substring(7).trim()
    } else {
      apiKey = request.headers.get("x-api-key") || null
    }

    let apiKeyAccount = null
    if (apiKey) {
      apiKeyAccount = await getAccountByApiKey(apiKey)
      if (!apiKeyAccount) {
        return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
      }
    }

    // Get client identifier for rate limiting
    const clientIP = getClientIP(request)
    const fingerprint = getRequestFingerprint(request)

    // 2. Enforce API key-specific rate limits
    if (apiKeyAccount) {
      const maxRequests = apiKeyAccount.plan === "business_user" ? 300 : 60
      const keyRateLimitResult = await checkRateLimit(`api:key:${apiKeyAccount.$id}`, {
        windowMs: 60000,
        maxRequests,
      })

      if (!keyRateLimitResult.success) {
        return NextResponse.json(
          { error: "Too many requests. API rate limit exceeded." },
          { status: 429 }
        )
      }
    } else {
      // Standard Rate Limiting for Web/Anonymous Users
      const suspiciousCheck = isSuspiciousRequest(request)
      const rateLimitConfig = suspiciousCheck.suspicious 
        ? STRICT_RATE_LIMIT_CONFIG 
        : RATE_LIMIT_CONFIG
      
      const identifier = `shorten:${clientIP}:${fingerprint}`
      const dailyIdentifier = `shorten:daily:${clientIP}`
      
      // Check per-minute rate limit
      const rateLimitResult = await checkRateLimit(identifier, rateLimitConfig)
      if (!rateLimitResult.success) {
        return NextResponse.json(
          { 
            error: `Rate limit exceeded. Please wait ${rateLimitResult.resetIn} seconds before creating another short link.`,
            retryAfter: rateLimitResult.resetIn 
          }, 
          { 
            status: 429,
            headers: {
              "Retry-After": rateLimitResult.resetIn.toString(),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": rateLimitResult.resetIn.toString(),
            }
          }
        )
      }

      // Check daily rate limit
      const dailyRateLimitResult = await checkRateLimit(dailyIdentifier, DAILY_RATE_LIMIT_CONFIG)
      if (!dailyRateLimitResult.success) {
        return NextResponse.json(
          { 
            error: "Daily limit reached. Please try again tomorrow or create an account for higher limits.",
            retryAfter: dailyRateLimitResult.resetIn 
          }, 
          { 
            status: 429,
            headers: {
              "Retry-After": dailyRateLimitResult.resetIn.toString(),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": dailyRateLimitResult.resetIn.toString(),
            }
          }
        )
      }
    }

    // 3. Parse request body
    let body: { longUrl?: string; customSlug?: string; host?: string; targeting_json?: string }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }
    
    const { longUrl, customSlug, host, targeting_json } = body

    // 4. Validate URL
    if (!longUrl || typeof longUrl !== 'string') {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }
    
    const urlValidation = validateUrl(longUrl)
    if (!urlValidation.valid) {
      return NextResponse.json({ error: urlValidation.error || "Invalid URL provided" }, { status: 400 })
    }
    
    // Custom slug validation
    const slugValidation = validateCustomSlug(customSlug)
    if (!slugValidation.valid) {
      return NextResponse.json({ error: slugValidation.error || "Invalid custom slug" }, { status: 400 })
    }

    const sanitizedLongUrl = longUrl.trim()
    const isCustomSlug = !!slugValidation.sanitized
    let slug = slugValidation.sanitized || generateSlug()

    // 5. Determine host and owner ID
    let finalHost = DEFAULT_HOST
    let finalOwnerId = null

    if (apiKeyAccount) {
      finalOwnerId = apiKeyAccount.clerk_user_id
      if (host && typeof host === "string" && host !== DEFAULT_HOST) {
        // Verify user owns the connected domain
        const userDomains = await getDomainsByOwner(finalOwnerId)
        const matchedDomain = userDomains.find((d) => d.domain === host.trim() && d.status === "verified")
        if (!matchedDomain) {
          return NextResponse.json(
            { error: "Target domain is not connected or verified on your account" },
            { status: 403 }
          )
        }
        finalHost = matchedDomain.domain
      }
    } else {
      const { userId } = await auth()
      finalOwnerId = userId ?? null
    }

    // 6. Create the link
    let attempts = 0
    const maxAttempts = isCustomSlug ? 1 : 5
    
    while (attempts < maxAttempts) {
      try {
        const link = await createLink({
          slug,
          long_url: sanitizedLongUrl,
          host: finalHost,
          owner_id: finalOwnerId,
          meta_domain: extractDomain(sanitizedLongUrl),
          targeting_json: targeting_json || null,
        })

        const protocol = finalHost === DEFAULT_HOST ? "https" : "http"
        return NextResponse.json({
          slug: link.slug,
          shortUrl: `${protocol}://${finalHost}/r/${link.slug}`,
          host: finalHost,
        })
      } catch (err) {
        if (isConflictError(err)) {
          if (isCustomSlug) {
            return NextResponse.json(
              { error: "This custom slug is already taken. Please try a different one." }, 
              { status: 409 }
            )
          }
          slug = generateSlug()
          attempts++
          continue
        }
        
        console.error("Database error:", err)
        return NextResponse.json({ error: "Failed to create short link" }, { status: 500 })
      }
    }
    
    return NextResponse.json({ error: "Failed to create short link. Please try again." }, { status: 500 })
    
  } catch (error) {
    console.error("Shorten error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

