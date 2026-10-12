import { type NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { validateUrl, extractDomain } from "@/lib/utils/slug"
import { getLinkById, updateLinkDestination, deleteLink } from "@/lib/appwrite/links"
import { redis } from "@/lib/redis"
import { isQrStudioAuthorized } from "@/lib/marketing-auth"
import { getDynamicQrUrl } from "@/lib/utils/link-url"

interface Context {
  params: Promise<{ id: string }>
}

export async function PATCH(request: NextRequest, { params }: Context) {
  try {
    const { id } = await params
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    }

    const clerkUser = await currentUser().catch(() => null)
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? null

    if (!isQrStudioAuthorized(userId, email)) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 })
    }

    const link = await getLinkById(id)
    if (!link) {
      return NextResponse.json({ error: "Dynamic QR link not found." }, { status: 404 })
    }

    // Must be owner or admin
    if (link.owner_id !== userId && !email?.toLowerCase().includes("kesarsaket607")) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 })
    }

    const body = await request.json().catch(() => ({}))
    const { long_url, title, cute_message, qr_design } = body

    if (!long_url || typeof long_url !== "string") {
      return NextResponse.json({ error: "New destination URL is required." }, { status: 400 })
    }

    const urlValidation = validateUrl(long_url.trim())
    if (!urlValidation.valid) {
      return NextResponse.json({ error: urlValidation.error || "Invalid destination URL." }, { status: 400 })
    }

    const sanitizedLongUrl = long_url.trim()

    // Parse existing targeting_json
    let existingTargeting: Record<string, any> = {}
    try {
      if (link.targeting_json) {
        existingTargeting = JSON.parse(link.targeting_json)
      }
    } catch {}

    const updatedTargeting = {
      ...existingTargeting,
      is_dynamic_qr: true,
      title: title !== undefined ? String(title).trim() : existingTargeting.title || link.meta_title,
      cute_message: cute_message !== undefined ? String(cute_message).trim() : existingTargeting.cute_message,
      qr_design: qr_design !== undefined ? qr_design : existingTargeting.qr_design,
      updated_at: new Date().toISOString(),
    }

    // Update link destination in Appwrite without altering slug
    const updated = await updateLinkDestination(link.$id, {
      long_url: sanitizedLongUrl,
      meta_title: updatedTargeting.title,
      meta_domain: extractDomain(sanitizedLongUrl),
      targeting_json: JSON.stringify(updatedTargeting),
    })

    // Purge Redis cache immediately so scans reflect the new destination in real-time
    try {
      await redis.del(`url:${link.host}:${link.slug}`)
    } catch (redisErr) {
      console.warn("Failed to purge Redis cache on dynamic QR update:", redisErr)
    }

    const dynamicUrl = getDynamicQrUrl(link.host, link.slug)

    return NextResponse.json({
      success: true,
      link: {
        id: updated.$id,
        slug: updated.slug,
        long_url: updated.long_url,
        title: updatedTargeting.title,
        dynamicUrl,
        clicks_count: updated.clicks_count,
        targeting: updatedTargeting,
      },
    })
  } catch (err) {
    console.error("Update dynamic QR error:", err)
    return NextResponse.json({ error: "Failed to update dynamic QR link." }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Context) {
  try {
    const { id } = await params
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 })
    }

    const clerkUser = await currentUser().catch(() => null)
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? null

    if (!isQrStudioAuthorized(userId, email)) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 })
    }

    const link = await getLinkById(id)
    if (!link) {
      return NextResponse.json({ error: "Dynamic QR link not found." }, { status: 404 })
    }

    await deleteLink(link.$id, link.owner_id || userId)

    try {
      await redis.del(`url:${link.host}:${link.slug}`)
    } catch {}

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Delete dynamic QR error:", err)
    return NextResponse.json({ error: "Failed to delete dynamic QR." }, { status: 500 })
  }
}
