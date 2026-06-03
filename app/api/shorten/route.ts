import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateSlug, validateUrl, validateCustomSlug, extractDomain } from "@/lib/utils/slug"
import { checkRateLimit, getClientIP, getRequestFingerprint, isSuspiciousRequest } from "@/lib/utils/rate-limit"

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

// Check if error is a unique constraint violation
function isUniqueConstraintError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const err = error as Record<string, unknown>
  // Postgres unique violation error code is 23505
  return err.code === '23505' || 
         (typeof err.message === 'string' && err.message.includes('duplicate key')) ||
         (typeof err.message === 'string' && err.message.includes('unique constraint'))
}

export async function POST(request: NextRequest) {
  try {
    // Get client identifier for rate limiting
    const clientIP = getClientIP(request)
    const fingerprint = getRequestFingerprint(request)
    
    // Check for suspicious requests (bots, missing headers)
    const suspiciousCheck = isSuspiciousRequest(request)
    
    // Use stricter rate limits for suspicious requests
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

    // Parse request body with error handling
    let body: { longUrl?: string; customSlug?: string }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }
    
    const { longUrl, customSlug } = body

    // Comprehensive URL validation (SSRF prevention)
    if (!longUrl || typeof longUrl !== 'string') {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }
    
    const urlValidation = validateUrl(longUrl)
    if (!urlValidation.valid) {
      return NextResponse.json({ error: urlValidation.error || "Invalid URL provided" }, { status: 400 })
    }
    
    // Custom slug validation (SQL injection & path traversal prevention)
    // Note: Supabase client uses parameterized queries internally, preventing SQL injection
    // but we still sanitize to prevent path traversal and ensure valid slug format
    const slugValidation = validateCustomSlug(customSlug)
    if (!slugValidation.valid) {
      return NextResponse.json({ error: slugValidation.error || "Invalid custom slug" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get current user (optional - anonymous shortening allowed)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Sanitize the long URL before storing (trim whitespace)
    const sanitizedLongUrl = longUrl.trim()
    
    // Use custom slug if provided, otherwise generate one
    const isCustomSlug = !!slugValidation.sanitized
    let slug = slugValidation.sanitized || generateSlug()

    // RACE CONDITION FIX: Instead of check-then-insert, we attempt insert directly
    // and handle unique constraint violation from the database
    // This is atomic and prevents race conditions where two users claim the same slug
    
    let attempts = 0
    const maxAttempts = isCustomSlug ? 1 : 5 // Only retry for auto-generated slugs
    
    while (attempts < maxAttempts) {
      const { data: link, error } = await supabase
        .from("links")
        .insert({
          slug,
          long_url: sanitizedLongUrl,
          owner_id: user?.id || null,
          meta_domain: extractDomain(sanitizedLongUrl),
        })
        .select()
        .single()

      if (!error && link) {
        // Success!
        return NextResponse.json({
          slug: link.slug,
          shortUrl: `/r/${link.slug}`,
        })
      }
      
      // Check if it's a unique constraint violation (slug already exists)
      if (isUniqueConstraintError(error)) {
        if (isCustomSlug) {
          // Custom slug is taken - inform the user
          return NextResponse.json(
            { error: "This custom slug is already taken. Please try a different one." }, 
            { status: 409 }
          )
        }
        // Auto-generated slug collision - try a new one
        slug = generateSlug()
        attempts++
        continue
      }
      
      // Other database error
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create short link" }, { status: 500 })
    }
    
    // Exhausted all attempts for auto-generated slugs (very unlikely)
    console.error("Failed to generate unique slug after max attempts")
    return NextResponse.json({ error: "Failed to create short link. Please try again." }, { status: 500 })
    
  } catch (error) {
    console.error("Shorten error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
