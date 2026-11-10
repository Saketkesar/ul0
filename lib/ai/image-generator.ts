import "server-only"

const CF_TOKEN = process.env.CLOUDFLARE_WORKERS_AI_TOKEN || ""
const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || ""
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ul0.site"

/**
 * Generates an ultra-fast, branded, high-CTR editorial blog cover image.
 * Uses our internal Edge OG Generator for 20ms rendering, with fallback to Cloudflare Workers AI.
 */
export async function generateBlogImage(
  title: string,
  keywords: string[] = [],
  category?: string
): Promise<string> {
  const cat = category || (keywords[0] ? keywords[0].toUpperCase() : "TECHNICAL GUIDE")

  // 1. If Cloudflare Workers AI Account is configured, attempt Flux generation with a tight 6s timeout
  if (CF_TOKEN && CF_ACCOUNT_ID) {
    try {
      const prompt = `Modern minimalist editorial tech illustration for "${title}", theme: ${keywords.join(", ")}, dark theme, sleek glowing neon emerald accents, clean typography space, 4k high quality, digital art, no text`
      const url = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai/run/@cf/black-forest-labs/flux-1-schnell`

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${CF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, steps: 4 }),
        signal: AbortSignal.timeout(6000), // 6 second strict budget
      })

      if (res.ok) {
        const data = await res.json()
        if (data.result?.image) {
          return `data:image/jpeg;base64,${data.result.image}`
        }
      }
    } catch (e) {
      console.warn("[Cloudflare AI Image Skipped/Timed out, using Instant Branded Generator]:", e)
    }
  }

  // 2. High-speed, guaranteed 1200x630 branded editorial banner rendered at edge via /api/og/blog
  const searchParams = new URLSearchParams({
    title,
    category: cat,
    author: "Saket Kesar",
    readTime: "6 min read",
  })

  return `${BASE_URL}/api/og/blog?${searchParams.toString()}`
}
