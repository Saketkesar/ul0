import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createMarketingLink, getMarketingLinkByAlias } from "@/lib/appwrite/marketing-links"
import { selectRandomBlogs, getTotalBlogCount } from "@/lib/blog-discovery"
import { validateUrl } from "@/lib/utils/slug"
import { checkRateLimit } from "@/lib/redis"
import { isMarketingAdmin } from "@/lib/marketing-auth"

const MAX_GATE_BLOGS = parseInt(process.env.MAX_GATE_BLOGS || "10", 10)

// Reserved route prefixes that cannot be used as aliases
const RESERVED_ALIASES = [
  "admin", "api", "login", "blog", "dashboard", "settings", "pricing",
  "sign-in", "sign-up", "split", "qr", "utm", "json", "pdf", "pomodoro",
  "quotes", "wifi", "worldclock", "clock", "countdown", "ambient", "buy",
  "privacy", "terms", "contact", "faq", "security", "threats", "backlinks",
  "go", "r", "m", "ads", "marketing", "share", "donate", "docs", "about",
  "refund", "report-abuse", "supporters", "robots", "sitemap",
]

function validateAlias(alias: string): { valid: boolean; error?: string } {
  if (!alias || alias.length < 2 || alias.length > 50) {
    return { valid: false, error: "Alias must be 2-50 characters." }
  }
  if (!/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(alias) && alias.length > 1) {
    if (!/^[a-z0-9]+$/.test(alias)) {
      return { valid: false, error: "Alias must be lowercase letters, numbers, and hyphens only. Cannot start or end with a hyphen." }
    }
  }
  if (/--/.test(alias)) {
    return { valid: false, error: "Alias cannot contain consecutive hyphens." }
  }
  if (RESERVED_ALIASES.includes(alias)) {
    return { valid: false, error: "This alias is reserved and cannot be used." }
  }
  return { valid: true }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()

    const authorized = await isMarketingAdmin(userId)
    if (!authorized) {
      return NextResponse.json(
        { error: "Forbidden." },
        { status: 403 }
      )
    }

    // Rate limit: 10 creates per minute
    const rl = await checkRateLimit(`mktg_create:${userId}`, 10, 60)
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Rate limited. Try again shortly." },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { destination_url, alias: rawAlias, blog_count: rawBlogCount } = body

    // Validate destination URL
    if (!destination_url?.trim()) {
      return NextResponse.json(
        { error: "Destination URL is required." },
        { status: 400 }
      )
    }

    let destUrl = destination_url.trim()
    if (!destUrl.startsWith("http://") && !destUrl.startsWith("https://")) {
      destUrl = "https://" + destUrl
    }

    const urlValidation = validateUrl(destUrl)
    if (!urlValidation.valid) {
      return NextResponse.json(
        { error: urlValidation.error || "Invalid destination URL." },
        { status: 400 }
      )
    }

    // Validate alias
    const alias = (rawAlias || "").trim().toLowerCase().replace(/\s+/g, "-")
    if (!alias) {
      return NextResponse.json(
        { error: "Alias is required." },
        { status: 400 }
      )
    }
    const aliasCheck = validateAlias(alias)
    if (!aliasCheck.valid) {
      return NextResponse.json(
        { error: aliasCheck.error },
        { status: 400 }
      )
    }

    // Check for duplicate alias
    const existing = await getMarketingLinkByAlias(alias)
    if (existing) {
      return NextResponse.json(
        { error: `The alias "${alias}" is already taken.` },
        { status: 409 }
      )
    }

    // Validate blog count
    const blogCount = Math.min(MAX_GATE_BLOGS, Math.max(1, parseInt(rawBlogCount, 10) || 3))
    const totalAvailable = getTotalBlogCount()
    if (blogCount > totalAvailable) {
      return NextResponse.json(
        { error: `Only ${totalAvailable} blog articles are available. Reduce the blog count.` },
        { status: 400 }
      )
    }

    // Create the link
    const doc = await createMarketingLink({
      alias,
      destination_url: destUrl,
      owner_clerk_user_id: userId!,
      blog_count: blogCount,
    })

    return NextResponse.json({
      success: true,
      link: doc,
      public_url: `https://ul0.site/go/${alias}`,
    })
  } catch (error: any) {
    console.error("Marketing link creation error:", error)
    return NextResponse.json(
      { error: "Failed to create marketing link." },
      { status: 500 }
    )
  }
}
