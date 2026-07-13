import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { deleteLink } from "@/lib/appwrite/links"
import { getAccountByClerkId } from "@/lib/appwrite/accounts"
import { getPlanLimits } from "@/lib/plans"
import { checkRateLimit, getClientIP } from "@/lib/utils/rate-limit"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const clientIP = getClientIP(request)
    const rateLimitResult = await checkRateLimit(`links:delete:${userId || clientIP}`, {
      windowMs: 60000,
      maxRequests: 10,
    })

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      )
    }

    const { linkId } = await request.json()
    if (!linkId || typeof linkId !== "string") {
      return NextResponse.json({ error: "linkId is required" }, { status: 400 })
    }

    // Verify plan limits allow deletion
    const account = await getAccountByClerkId(userId)
    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    const limits = getPlanLimits(account.plan)
    if (!limits.canDeleteDomainLinks) {
      return NextResponse.json(
        { error: "Link deletion is not allowed on your plan. Please upgrade to Pro or Business." },
        { status: 403 }
      )
    }

    await deleteLink(linkId, userId)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Link deletion error:", error)
    if (error?.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    return NextResponse.json({ error: error?.message ?? "Internal server error" }, { status: 500 })
  }
}
