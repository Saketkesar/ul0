import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { connectDomain, getDomainsByOwner } from "@/lib/appwrite/domains"
import { getAccountByClerkId } from "@/lib/appwrite/accounts"
import { getPlanLimits } from "@/lib/plans"
import { checkRateLimit, getClientIP } from "@/lib/utils/rate-limit"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Rate limit: 5 requests per minute per user/IP
    const clientIP = getClientIP(request)
    const rateLimitResult = await checkRateLimit(`domains:connect:${userId || clientIP}`, {
      windowMs: 60000,
      maxRequests: 5,
    })

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { domain } = body

    if (!domain || typeof domain !== "string") {
      return NextResponse.json(
        { error: "Domain is required" },
        { status: 400 },
      )
    }

    // Check plan limits
    const account = await getAccountByClerkId(userId)
    const limits = getPlanLimits(account?.plan)
    const existingDomains = await getDomainsByOwner(userId)

    if (existingDomains.length >= limits.maxDomains) {
      return NextResponse.json(
        {
          error: `Your ${limits.label} plan allows up to ${limits.maxDomains} custom domain(s). Upgrade to connect more.`,
          code: "PLAN_LIMIT_REACHED",
        },
        { status: 403 },
      )
    }

    // Connect the domain
    const domainDoc = await connectDomain(userId, domain.trim())

    return NextResponse.json({
      id: domainDoc.$id,
      domain: domainDoc.domain,
      status: domainDoc.status,
      verification_token: domainDoc.verification_token,
    })
  } catch (err: any) {
    const message = err?.message ?? "Failed to connect domain"

    if (message.includes("already connected")) {
      return NextResponse.json({ error: message }, { status: 409 })
    }
    if (message.includes("Invalid domain")) {
      return NextResponse.json({ error: message }, { status: 400 })
    }
    if (message.includes("platform domain")) {
      return NextResponse.json({ error: message }, { status: 400 })
    }

    console.error("Domain connect error:", err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
