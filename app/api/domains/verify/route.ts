import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { verifyDomain } from "@/lib/appwrite/domains"
import { checkRateLimit, getClientIP } from "@/lib/utils/rate-limit"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Rate limit: 5 requests per minute per user/IP
    const clientIP = getClientIP(request)
    const rateLimitResult = await checkRateLimit(`domains:verify:${userId || clientIP}`, {
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
    const { domainId } = body

    if (!domainId || typeof domainId !== "string") {
      return NextResponse.json(
        { error: "domainId is required" },
        { status: 400 },
      )
    }

    const { domain, status } = await verifyDomain(domainId, userId)

    return NextResponse.json({
      id: domain.$id,
      domain: domain.domain,
      status: domain.status,
      ssl_status: domain.ssl_status,
      verified: status.verified,
      sslReady: status.sslReady,
      misconfigured: status.misconfigured,
      verification: status.verification,
    })
  } catch (err: any) {
    const message = err?.message ?? "Failed to verify domain"

    if (message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }
    if (message === "Domain not found") {
      return NextResponse.json({ error: message }, { status: 404 })
    }

    console.error("Domain verify error:", err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
