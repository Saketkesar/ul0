import { type NextRequest, NextResponse } from "next/server"
import { getDatabases, Query } from "@/lib/appwrite/server"
import { APPWRITE_DATABASE_ID, COLLECTIONS } from "@/lib/appwrite/config"
import { redis } from "@/lib/redis"

const BASIN_FORM_UUID = process.env.USEBASIN_FORM_UUID || "16f38d46e9f3"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { shortUrl, reason, description, email } = body

    if (!shortUrl || typeof shortUrl !== "string" || !shortUrl.trim()) {
      return NextResponse.json({ error: "Short link URL is required" }, { status: 400 })
    }

    const trimmedUrl = shortUrl.trim()

    // Extract slug from short link
    let slug = ""
    try {
      const parsed = new URL(trimmedUrl.startsWith("http") ? trimmedUrl : `https://${trimmedUrl}`)
      const parts = parsed.pathname.split("/").filter(Boolean)
      slug = parts[parts.length - 1] || ""
    } catch {
      slug = trimmedUrl
    }

    // Flag link in Appwrite if found
    if (slug) {
      try {
        const db = getDatabases()
        const { documents } = await db.listDocuments(APPWRITE_DATABASE_ID, COLLECTIONS.links, [
          Query.equal("slug", slug),
          Query.limit(1),
        ])

        if (documents.length > 0) {
          const doc = documents[0]
          let targeting: Record<string, any> = {}
          try {
            targeting = doc.targeting_json ? JSON.parse(doc.targeting_json) : {}
          } catch {}

          targeting.is_suspicious = true
          targeting.flagged_reason = reason || "abuse_report"
          targeting.flagged_at = new Date().toISOString()

          await db.updateDocument(APPWRITE_DATABASE_ID, COLLECTIONS.links, doc.$id, {
            targeting_json: JSON.stringify(targeting),
          })

          // Mark in Redis blocklist cache
          await redis.set(`blocked_link:${slug}`, "flagged", { ex: 86400 * 30 }).catch(() => null)
        }
      } catch (err) {
        console.error("Error updating flagged status in database:", err)
      }
    }

    // Forward notification to review inbox via Basin
    try {
      const formData = new FormData()
      formData.append("short_url", trimmedUrl)
      formData.append("reason", reason || "general_abuse")
      formData.append("description", description || "")
      formData.append("reporter_email", email || "")
      formData.append("timestamp", new Date().toISOString())

      await fetch(`https://usebasin.com/f/${BASIN_FORM_UUID}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      })
    } catch (e) {
      console.error("Basin dispatch error:", e)
    }

    return NextResponse.json({
      success: true,
      message: "Abuse report received. Our automated trust filters and reviewers have queued the link for action.",
    })
  } catch (error: any) {
    console.error("Abuse submission error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to process abuse report" },
      { status: 500 }
    )
  }
}

