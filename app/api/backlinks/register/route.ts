import { NextRequest, NextResponse } from "next/server"
import { createBacklink, getBacklinkByUrl } from "@/lib/appwrite/backlinks"
import { randomBytes } from "crypto"

function generateToken(): string {
  return randomBytes(16).toString("hex")
}

function buildBadgeCode(token: string): string {
  return `<a href="https://ul0.site/backlinks?ref=badge&v=${token}" target="_blank" rel="noopener">\n  <img src="https://ul0.site/badge/ul0-verified.svg" alt="Verified by ul0" width="140" height="32" style="border:0" />\n</a>`
}

function normalizeUrl(url: string): string {
  let u = url.trim()
  if (!u.startsWith("http://") && !u.startsWith("https://")) {
    u = "https://" + u
  }
  // Remove trailing slash for consistency
  return u.replace(/\/+$/, "")
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const rawUrl = formData.get("website_url") as string | null
    const name = formData.get("website_name") as string | null
    const description = formData.get("website_description") as string | null
    const logoUrl = formData.get("logo_url") as string | null
    const email = formData.get("owner_email") as string | null

    if (!rawUrl?.trim() || !name?.trim() || !description?.trim()) {
      return NextResponse.json(
        { error: "Website URL, name, and description are required." },
        { status: 400 }
      )
    }

    const websiteUrl = normalizeUrl(rawUrl)

    // Check if already registered
    const existing = await getBacklinkByUrl(websiteUrl)
    if (existing) {
      return NextResponse.json({
        success: true,
        already_registered: true,
        badge_code: existing.badge_code,
        verification_token: existing.verification_token,
        verified: existing.verified,
        message: existing.verified
          ? "This website is already verified and listed in our directory!"
          : "This website is already registered. Copy the badge below and add it to your site, then verify.",
      })
    }

    const token = generateToken()
    const badgeCode = buildBadgeCode(token)

    const doc = await createBacklink({
      website_url: websiteUrl,
      website_name: name.trim(),
      website_description: description.trim(),
      logo_url: logoUrl?.trim() || null,
      owner_email: email?.trim() || null,
      badge_code: badgeCode,
      verification_token: token,
    })

    return NextResponse.json({
      success: true,
      already_registered: false,
      badge_code: badgeCode,
      verification_token: token,
      verified: false,
      message: "Registered! Copy the badge HTML below and paste it into your website. Then click Verify.",
    })
  } catch (error: any) {
    console.error("Backlink register error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to register. Please try again." },
      { status: 500 }
    )
  }
}
