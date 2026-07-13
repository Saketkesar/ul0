import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { getDatabases } from "@/lib/appwrite/server"
import { APPWRITE_DATABASE_ID, COLLECTIONS } from "@/lib/appwrite/config"
import { getDomainById } from "@/lib/appwrite/domains"
import { checkRateLimit, getClientIP } from "@/lib/utils/rate-limit"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Rate limit: 5 requests per minute per user/IP
    const clientIP = getClientIP(req)
    const rateLimitResult = await checkRateLimit(`domains:brand-logo:${userId || clientIP}`, {
      windowMs: 60000,
      maxRequests: 5,
    })

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      )
    }

    const { domainId, brandLogoUrl } = await req.json()

    if (!domainId) {
      return NextResponse.json({ error: "domainId is required" }, { status: 400 })
    }

    // Validate URL if provided
    if (brandLogoUrl) {
      try {
        const url = new URL(brandLogoUrl)
        if (!["http:", "https:"].includes(url.protocol)) {
          return NextResponse.json({ error: "Invalid logo URL" }, { status: 400 })
        }
      } catch {
        return NextResponse.json({ error: "Invalid logo URL" }, { status: 400 })
      }
    }

    // Verify ownership
    const domain = await getDomainById(domainId)
    if (!domain) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 })
    }
    if (domain.owner_id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Update the domain document
    const db = getDatabases()
    await db.updateDocument(APPWRITE_DATABASE_ID, COLLECTIONS.domains, domainId, {
      brand_logo_url: brandLogoUrl || null,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Brand logo update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
