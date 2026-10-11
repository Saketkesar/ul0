import { type NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { getLinkById, listClicksByLink } from "@/lib/appwrite/links"
import { getAccountByClerkId } from "@/lib/appwrite/accounts"
import { getActivePlan } from "@/lib/plan.server"
import { DEFAULT_HOST } from "@/lib/appwrite/config"
import { aggregateClicks, type AnalyticsRange } from "@/lib/analytics/aggregate"
import { redis } from "@/lib/redis"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const authSession = await auth()
    const { userId } = authSession
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const range = (searchParams.get("range") || "7d") as AnalyticsRange

    // Verify link ownership
    const link = await getLinkById(id)
    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    if (link.owner_id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Plan access verification
    const [user, accountDoc] = await Promise.all([
      currentUser().catch(() => null),
      getAccountByClerkId(userId).catch(() => null),
    ])

    const plan = getActivePlan(authSession, user, accountDoc)
    const isCustomDomainLink = link.host && link.host !== DEFAULT_HOST

    const hasAnalyticsAccess = isCustomDomainLink
      ? plan.limits.hasDomainAnalytics
      : plan.limits.hasRegularAnalytics

    if (!hasAnalyticsAccess) {
      return NextResponse.json({
        gated: true,
        plan: plan.slug,
        link: {
          id: link.$id,
          slug: link.slug,
          host: link.host,
          long_url: link.long_url,
          clicks_count: link.clicks_count || 0,
        },
      })
    }

    // Check Redis cache (60s TTL)
    const cacheKey = `analytics:summary:${id}:${range}`
    try {
      const cached = await redis.get<string>(cacheKey)
      if (cached) {
        const parsed = typeof cached === "string" ? JSON.parse(cached) : cached
        return NextResponse.json({
          gated: false,
          link,
          analytics: parsed,
          cached: true,
        })
      }
    } catch (e) {
      // Redis cache miss or network hiccup, fallback to DB
    }

    // Fetch and aggregate clicks
    const clicks = await listClicksByLink(id, 5000)
    const analytics = aggregateClicks(clicks, range)

    // Cache in Redis for 60 seconds
    try {
      await redis.set(cacheKey, JSON.stringify(analytics), { ex: 60 })
    } catch (e) {
      // Non-blocking cache write failure
    }

    return NextResponse.json({
      gated: false,
      link,
      analytics,
      cached: false,
    })
  } catch (error) {
    console.error("Dashboard link analytics API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
