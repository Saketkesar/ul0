import { NextRequest, NextResponse } from "next/server"
import { generateBlogPostWithGroq } from "@/lib/ai/groq"
import { generateBlogImage } from "@/lib/ai/image-generator"
import { createSanityPost } from "@/lib/sanity/client"

export const maxDuration = 60 // Allow up to 60s on Vercel Pro/Hobby
export const dynamic = "force-dynamic"

const TOPIC_QUEUE = [
  {
    topic: "How to Create a WhatsApp Link with Pre-filled Message (Free 2026 Guide)",
    keywords: ["whatsapp link generator", "create whatsapp link free", "whatsapp direct message link", "wa link generator with message"],
  },
  {
    topic: "Free URL Shortener with Custom Domain: Complete Setup & Comparison 2026",
    keywords: ["free url shortener with custom domain", "custom domain url shortener free", "branded url shortener free"],
  },
  {
    topic: "How to Split Group Bills and Expenses Online Free (No App Required 2026)",
    keywords: ["split bills online free", "splitwise free alternative", "group expense splitter online", "split rent with roommates"],
  },
  {
    topic: "Dynamic Vector QR Codes vs Static QR Codes: The 2026 Marketer Guide",
    keywords: ["dynamic qr code generator", "free vector qr code svg", "qr code with logo free", "editable qr code destination"],
  },
  {
    topic: "Why HTTP 307 Redirects Outperform 301 Redirects for Link Tracking",
    keywords: ["307 temporary redirect vs 301", "url shortener redirect status", "accurate link click tracking", "browser cache redirect"],
  },
  {
    topic: "Top 7 Free Bitly Alternatives with Custom Domains in 2026",
    keywords: ["bitly alternative free", "free bitly alternative with custom domain", "url shortener no limits", "best bitly competitors"],
  },
]

export async function GET(req: NextRequest) {
  try {
    // 1. Verify Vercel Cron Secret (or allow admin session / local dev)
    const authHeader = req.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET || process.env.ADMIN_API_KEY

    // If CRON_SECRET is set, enforce authorization
    if (cronSecret && authHeader !== `Bearer ${cronSecret}` && authHeader !== cronSecret) {
      return NextResponse.json({ error: "Unauthorized cron invocation" }, { status: 401 })
    }

    // 2. Select topic based on current day of the year for deterministic progression
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
    )
    const topicItem = TOPIC_QUEUE[dayOfYear % TOPIC_QUEUE.length]

    // 3. Generate article with Groq (LLaMA 3.3 70B)
    const blogPost = await generateBlogPostWithGroq(topicItem.topic, topicItem.keywords)

    // 4. Generate 16:9 featured cover image
    const coverImageUrl = await generateBlogImage(blogPost.title, blogPost.keywords)

    // 5. Schedule / Publish in Sanity if configured
    let sanityResult: any = null
    const hasSanity = Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID && process.env.SANITY_API_TOKEN)
    if (hasSanity) {
      sanityResult = await createSanityPost({
        _type: "post",
        title: blogPost.title,
        slug: { current: blogPost.slug },
        excerpt: blogPost.excerpt,
        coverImageUrl,
        publishedAt: new Date().toISOString(),
        body: blogPost.bodyMarkdown,
        metaTitle: blogPost.metaTitle,
        metaDescription: blogPost.metaDescription,
        keywords: blogPost.keywords,
      })
    }

    // 6. Ping IndexNow so search engines crawl the new post immediately
    try {
      await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({
          host: "ul0.site",
          key: "1b98f244195a4bb896890d3bb639f7ee",
          urlList: [`https://ul0.site/blog/${blogPost.slug}`],
        }),
      })
    } catch (indexNowErr) {
      console.warn("[Cron IndexNow Ping Failed]:", indexNowErr)
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      topic: topicItem.topic,
      slug: blogPost.slug,
      sanityConfigured: hasSanity,
      sanityResult,
    })
  } catch (error: any) {
    console.error("[Cron Blog Publish Error]:", error)
    return NextResponse.json({ error: error.message || "Failed in cron execution" }, { status: 500 })
  }
}
