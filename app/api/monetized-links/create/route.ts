import { NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { createMonetizedLink, getMonetizedLinkBySlug } from "@/lib/appwrite/monetized-links"
import { randomBytes } from "crypto"

const ALLOWED_EMAIL = "kesarsaket607@gmail.com"

const ALL_BLOG_SLUGS = [
  "best-url-shorteners-2026",
  "how-to-track-link-clicks-free",
  "link-shortening-best-practices-2026",
  "custom-domain-short-links-guide",
  "qr-code-marketing-guide",
  "split-expenses-friends-app",
  "pomodoro-technique-productivity-guide",
  "wifi-qr-code-business-guide",
  "short-links-instagram-bio",
  "affiliate-link-shortener-usa",
  "free-link-management-for-companies",
  "tinyurl-alternative",
  "url-shortener-seo-impact",
  "bitly-alternative-free",
]

function generateSlug(): string {
  return "m" + randomBytes(3).toString("hex")
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    const user = await currentUser()
    const email = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase()

    if (!userId || email !== ALLOWED_EMAIL) {
      return NextResponse.json(
        { error: "Unauthorized. This feature is restricted." },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { title, target_url, total_steps, custom_slug, selected_blogs } = body

    if (!title?.trim() || !target_url?.trim()) {
      return NextResponse.json(
        { error: "Title and target destination URL are required." },
        { status: 400 }
      )
    }

    // Validate URL
    let target = target_url.trim()
    if (!target.startsWith("http://") && !target.startsWith("https://")) {
      target = "https://" + target
    }

    // Steps (2 to 10)
    const steps = Math.min(10, Math.max(2, parseInt(total_steps, 10) || 3))

    // Handle Slug
    let slug = (custom_slug?.trim() || generateSlug()).replace(/[^a-zA-Z0-9-_]/g, "")
    if (!slug) slug = generateSlug()

    // Check slug collision
    const existing = await getMonetizedLinkBySlug(slug)
    if (existing) {
      return NextResponse.json(
        { error: `The custom alias '${slug}' is already taken. Please pick another one.` },
        { status: 409 }
      )
    }

    // Select blogs
    let blogs: string[] = Array.isArray(selected_blogs) && selected_blogs.length > 0
      ? selected_blogs.slice(0, steps)
      : []

    // If not enough blogs selected, fill from all available blogs
    if (blogs.length < steps) {
      const remaining = ALL_BLOG_SLUGS.filter((s) => !blogs.includes(s))
      while (blogs.length < steps && remaining.length > 0) {
        const randomIndex = Math.floor(Math.random() * remaining.length)
        blogs.push(remaining.splice(randomIndex, 1)[0])
      }
    }

    const doc = await createMonetizedLink({
      slug,
      title: title.trim(),
      target_url: target,
      total_steps: steps,
      blog_slugs: blogs,
      owner_email: email,
      owner_id: userId,
    })

    return NextResponse.json({
      success: true,
      link: doc,
      short_url: `https://ul0.site/m/${slug}`,
    })
  } catch (error: any) {
    console.error("Error creating monetized link:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create monetized link." },
      { status: 500 }
    )
  }
}
