import { NextRequest, NextResponse } from "next/server"
import { generateBlogPostWithGroq, generateRandomizedPublishTime } from "@/lib/ai/groq"
import { generateBlogImage } from "@/lib/ai/image-generator"
import { createSanityPost } from "@/lib/sanity/client"

export const maxDuration = 60
export const dynamic = "force-dynamic"

const HIGH_INTENT_TOPICS = [
  {
    topic: "How to Create a WhatsApp Link with Pre-filled Message (Free 2026 Guide)",
    keywords: ["whatsapp link generator", "create whatsapp link free", "whatsapp direct message link", "wa link generator with message"],
    category: "WHATSAPP",
  },
  {
    topic: "Free URL Shortener with Custom Domain: The Definitive 2026 Setup Guide",
    keywords: ["free url shortener with custom domain", "custom domain url shortener free", "branded url shortener free"],
    category: "CUSTOM DOMAINS",
  },
  {
    topic: "How to Split Group Bills and Expenses Online Free Without Downloading an App",
    keywords: ["split bills online free", "splitwise free alternative", "group expense splitter online", "split rent with roommates"],
    category: "UTILITIES",
  },
  {
    topic: "Dynamic Vector QR Codes vs Static QR Codes: The 2026 Marketer Guide",
    keywords: ["dynamic qr code generator", "free vector qr code svg", "qr code with logo free", "editable qr code destination"],
    category: "QR CODES",
  },
  {
    topic: "Why HTTP 307 Redirects Outperform 301 Redirects for Link Analytics",
    keywords: ["307 temporary redirect vs 301", "url shortener redirect status", "accurate link click tracking", "browser cache redirect"],
    category: "INFRASTRUCTURE",
  },
  {
    topic: "Top 7 Free Bitly Alternatives with Custom Domains in 2026",
    keywords: ["bitly alternative free", "free bitly alternative with custom domain", "url shortener no limits", "best bitly competitors"],
    category: "COMPARISONS",
  },
  {
    topic: "Why Branded Short Links Increase SMS & Bio CTR by 39%: Real Case Study",
    keywords: ["branded short links ctr", "custom domain short url benefit", "increase click through rate links"],
    category: "ANALYTICS",
  },
]

export async function GET(req: NextRequest) {
  try {
    // 1. Verify Vercel Cron Secret (or allow admin session / local dev)
    const authHeader = req.headers.get("authorization")
    const cronSecret = process.env.CRON_SECRET || process.env.ADMIN_API_KEY

    if (cronSecret && authHeader !== `Bearer ${cronSecret}` && authHeader !== cronSecret) {
      return NextResponse.json({ error: "Unauthorized cron invocation" }, { status: 401 })
    }

    // 2. Deterministic topic selection by day + human random jitter
    const now = new Date()
    const dayOfYear = Math.floor(
      (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
    )
    const topicItem = HIGH_INTENT_TOPICS[dayOfYear % HIGH_INTENT_TOPICS.length]

    // 3. Generate article with human tone & realistic jitter timestamp
    const randomizedTimestamp = generateRandomizedPublishTime(now)
    const blogPost = await generateBlogPostWithGroq(topicItem.topic, topicItem.keywords, now)

    // 4. Generate instant, beautiful branded 1200x630 banner
    const coverImageUrl = await generateBlogImage(blogPost.title, blogPost.keywords, topicItem.category)

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
        publishedAt: randomizedTimestamp,
        body: blogPost.bodyMarkdown,
        metaTitle: blogPost.metaTitle,
        metaDescription: blogPost.metaDescription,
        keywords: blogPost.keywords,
      })
    }

    // 6. Ping IndexNow for instant search engine indexing
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
      publishedAt: randomizedTimestamp,
      author: blogPost.author,
      readTime: blogPost.readTime,
      topic: topicItem.topic,
      slug: blogPost.slug,
      coverImageUrl,
      sanityConfigured: hasSanity,
      sanityResult,
    })
  } catch (error: any) {
    console.error("[Cron Blog Publish Error]:", error)
    return NextResponse.json({ error: error.message || "Failed in cron execution" }, { status: 500 })
  }
}
