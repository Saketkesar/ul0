import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { generateSlug, validateUrl, validateCustomSlug, extractDomain } from "@/lib/utils/slug"
import { createLink, isConflictError } from "@/lib/appwrite/links"
import { getDomainById, countDomainLinksByOwner } from "@/lib/appwrite/domains"
import { getAccountByClerkId } from "@/lib/appwrite/accounts"
import { getPlanLimits } from "@/lib/plans"
import { checkRateLimit, getClientIP } from "@/lib/utils/rate-limit"

/**
 * Create a short link on a custom domain.
 * Requires authentication and plan-based limits.
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Rate limit: 10 requests per minute per user/IP
    const clientIP = getClientIP(request)
    const rateLimitResult = await checkRateLimit(`domains:links:${userId || clientIP}`, {
      windowMs: 60000,
      maxRequests: 10,
    })

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { domainId, longUrl, customSlug } = body

    // Validate inputs
    if (!domainId || typeof domainId !== "string") {
      return NextResponse.json({ error: "domainId is required" }, { status: 400 })
    }

    if (!longUrl || typeof longUrl !== "string") {
      return NextResponse.json({ error: "longUrl is required" }, { status: 400 })
    }

    const urlValidation = validateUrl(longUrl)
    if (!urlValidation.valid) {
      return NextResponse.json(
        { error: urlValidation.error || "Invalid URL" },
        { status: 400 },
      )
    }

    // Verify domain ownership
    const domain = await getDomainById(domainId)
    if (!domain) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 })
    }
    if (domain.owner_id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    if (domain.status !== "verified") {
      return NextResponse.json(
        { error: "Domain must be verified before creating links" },
        { status: 400 },
      )
    }

    // Check plan limits
    const account = await getAccountByClerkId(userId)
    const limits = getPlanLimits(account?.plan)
    const currentDomainLinkCount = await countDomainLinksByOwner(userId)

    if (currentDomainLinkCount >= limits.maxDomainLinks) {
      return NextResponse.json(
        {
          error: `Your ${limits.label} plan allows up to ${limits.maxDomainLinks === Infinity ? "unlimited" : limits.maxDomainLinks} custom domain link(s). ${limits.maxDomainLinks < Infinity ? "Upgrade to create more." : ""}`,
          code: "PLAN_LIMIT_REACHED",
        },
        { status: 403 },
      )
    }

    // Validate custom slug if provided
    let slug: string
    if (customSlug && typeof customSlug === "string") {
      const slugValidation = validateCustomSlug(customSlug)
      if (!slugValidation.valid) {
        return NextResponse.json(
          { error: slugValidation.error || "Invalid custom slug" },
          { status: 400 },
        )
      }
      slug = slugValidation.sanitized!
    } else {
      slug = generateSlug()
    }

    // Create the link
    const isCustom = !!customSlug
    let attempts = 0
    const maxAttempts = isCustom ? 1 : 5

    while (attempts < maxAttempts) {
      try {
        const sanitizedUrl = longUrl.trim()
        const link = await createLink({
          slug,
          long_url: sanitizedUrl,
          host: domain.domain,
          owner_id: userId,
          meta_domain: extractDomain(sanitizedUrl),
        })

        return NextResponse.json({
          slug: link.slug,
          shortUrl: `https://${domain.domain}/r/${link.slug}`,
          host: domain.domain,
        })
      } catch (err) {
        if (isConflictError(err)) {
          if (isCustom) {
            return NextResponse.json(
              { error: "This slug is already taken on this domain" },
              { status: 409 },
            )
          }
          slug = generateSlug()
          attempts++
          continue
        }
        throw err
      }
    }

    return NextResponse.json(
      { error: "Failed to create link. Please try again." },
      { status: 500 },
    )
  } catch (error) {
    console.error("Domain link creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
