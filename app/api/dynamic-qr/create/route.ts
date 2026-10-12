import { type NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { validateUrl, extractDomain, validateCustomSlug, generateSlug } from "@/lib/utils/slug"
import { createLink, isConflictError } from "@/lib/appwrite/links"
import { DEFAULT_HOST } from "@/lib/appwrite/config"
import { isQrStudioAuthorized } from "@/lib/marketing-auth"
import { getDynamicQrUrl } from "@/lib/utils/link-url"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 })
    }

    const clerkUser = await currentUser().catch(() => null)
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress ?? null

    // Enforce access control for kesarsaket607 / admins
    if (!isQrStudioAuthorized(userId, email)) {
      return NextResponse.json(
        { error: "Access to Dynamic QR Studio is exclusive to kesarsaket607." },
        { status: 403 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const { long_url, title, custom_slug, cute_message, qr_design } = body

    if (!long_url || typeof long_url !== "string") {
      return NextResponse.json({ error: "Destination URL is required." }, { status: 400 })
    }

    const urlValidation = validateUrl(long_url.trim())
    if (!urlValidation.valid) {
      return NextResponse.json({ error: urlValidation.error || "Invalid destination URL." }, { status: 400 })
    }

    const sanitizedLongUrl = long_url.trim()

    // Determine slug
    let slug = ""
    let isCustomSlug = false

    if (custom_slug && typeof custom_slug === "string" && custom_slug.trim()) {
      const slugValidation = validateCustomSlug(custom_slug.trim())
      if (!slugValidation.valid || !slugValidation.sanitized) {
        return NextResponse.json(
          { error: slugValidation.error || "Custom slug may only contain letters, numbers, hyphens, and underscores." },
          { status: 400 }
        )
      }
      slug = slugValidation.sanitized
      isCustomSlug = true
    } else {
      slug = `q-${Math.random().toString(36).substring(2, 8)}`
    }

    // Ensure customLogoUrl does not contain raw base64 data URI to prevent Appwrite row attribute size overflow
    const cleanQrDesign = {
      darkColor: "#0B1412",
      lightColor: "#ffffff",
      dotStyle: "rounded",
      logoType: "ul0",
      ...(qr_design || {}),
    }

    if (cleanQrDesign.customLogoUrl && typeof cleanQrDesign.customLogoUrl === "string" && cleanQrDesign.customLogoUrl.startsWith("data:")) {
      try {
        let cleanBase64 = cleanQrDesign.customLogoUrl.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, "")
        const uploadFormData = new FormData()
        uploadFormData.append("key", "6d207e02198a847aa98d0a2a901485a5")
        uploadFormData.append("action", "upload")
        uploadFormData.append("format", "json")
        uploadFormData.append("source", cleanBase64)
        const uploadRes = await fetch("https://freeimage.host/api/1/upload", {
          method: "POST",
          body: uploadFormData,
        })
        const uploadJson = await uploadRes.json()
        if (uploadRes.ok && uploadJson.image?.url) {
          cleanQrDesign.customLogoUrl = uploadJson.image.url
        } else {
          delete cleanQrDesign.customLogoUrl
        }
      } catch {
        delete cleanQrDesign.customLogoUrl
      }
    }

    const targetingData = {
      is_dynamic_qr: true,
      title: (title || "").trim() || "Dynamic QR Link",
      cute_message: (cute_message || "").trim() || "You are being redirected, please wait 6 sec...",
      qr_design: cleanQrDesign,
    }

    let attempts = 0
    const maxAttempts = isCustomSlug ? 1 : 5

    while (attempts < maxAttempts) {
      try {
        const link = await createLink({
          slug,
          long_url: sanitizedLongUrl,
          host: DEFAULT_HOST,
          owner_id: userId,
          meta_title: targetingData.title,
          meta_domain: extractDomain(sanitizedLongUrl),
          link_type: "dynamic_qr",
          targeting_json: JSON.stringify(targetingData),
        })

        const dynamicUrl = getDynamicQrUrl(DEFAULT_HOST, link.slug)

        return NextResponse.json({
          success: true,
          link: {
            id: link.$id,
            slug: link.slug,
            long_url: link.long_url,
            title: targetingData.title,
            dynamicUrl,
            clicks_count: 0,
            created_at: link.created_at || new Date().toISOString(),
            targeting: targetingData,
          },
        })
      } catch (err: any) {
        if (isConflictError(err)) {
          if (isCustomSlug) {
            return NextResponse.json(
              { error: `The custom slug "${slug}" is already in use. Please choose another.` },
              { status: 409 }
            )
          }
          // Retry with fresh random slug
          slug = `q-${Math.random().toString(36).substring(2, 8)}`
          attempts++
        } else {
          console.error("Create dynamic QR error:", err)
          return NextResponse.json(
            { error: err?.message || "Failed to generate dynamic QR." },
            { status: 500 }
          )
        }
      }
    }

    return NextResponse.json({ error: "Failed to generate a unique slug. Please try again." }, { status: 500 })
  } catch (err: any) {
    console.error("Dynamic QR API error:", err)
    return NextResponse.json({ error: err?.message || "Internal server error." }, { status: 500 })
  }
}
