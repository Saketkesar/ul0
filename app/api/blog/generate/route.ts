import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { isMarketingAdmin } from "@/lib/marketing-auth"
import { generateBlogPostWithGroq } from "@/lib/ai/groq"
import { generateBlogImage } from "@/lib/ai/image-generator"
import { createSanityPost } from "@/lib/sanity/client"

export const maxDuration = 60 // Allow up to 60s for AI generation

export async function POST(req: NextRequest) {
  try {
    // Check Authorization header for programmatic / cron access
    const authHeader = req.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET || process.env.ADMIN_API_KEY
    const hasValidToken = Boolean(
      cronSecret && authHeader && (authHeader === `Bearer ${cronSecret}` || authHeader === cronSecret)
    )

    if (!hasValidToken) {
      const { userId } = await auth()
      if (!userId || !(await isMarketingAdmin(userId))) {
        return NextResponse.json({ error: "Unauthorized. Admin session or valid Bearer token required." }, { status: 403 })
      }
    }

    const body = await req.json()
    const { topic, keywords = [], publishAt } = body

    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "Missing 'topic' in request body." }, { status: 400 })
    }

    // 1. Generate SEO Blog Content with Groq LLaMA 3.3
    const blogPost = await generateBlogPostWithGroq(topic, keywords)

    // 2. Generate Editorial Featured Image
    const coverImageUrl = await generateBlogImage(blogPost.title, blogPost.keywords)

    // 3. Determine Publication Date (Immediate or Scheduled)
    const scheduledDate = publishAt ? new Date(publishAt).toISOString() : new Date().toISOString()

    // 4. If Sanity is configured, publish or schedule to Sanity
    let sanityResult: any = null
    const hasSanity = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.SANITY_API_TOKEN)
    if (hasSanity) {
      sanityResult = await createSanityPost({
        _type: "post",
        title: blogPost.title,
        slug: { current: blogPost.slug },
        excerpt: blogPost.excerpt,
        coverImageUrl,
        publishedAt: scheduledDate,
        body: blogPost.bodyMarkdown,
        metaTitle: blogPost.metaTitle,
        metaDescription: blogPost.metaDescription,
        keywords: blogPost.keywords,
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        ...blogPost,
        coverImageUrl,
        publishedAt: scheduledDate,
        isScheduled: new Date(scheduledDate) > new Date(),
        sanityConfigured: hasSanity,
        sanityResult,
      },
    })
  } catch (error: any) {
    console.error("[Blog Generator Error]:", error)
    return NextResponse.json({ error: error.message || "Failed to generate blog post" }, { status: 500 })
  }
}
