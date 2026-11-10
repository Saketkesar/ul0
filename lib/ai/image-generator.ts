import "server-only"

const CF_TOKEN = process.env.CLOUDFLARE_WORKERS_AI_TOKEN || ""
const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || ""

/**
 * Generates an SEO blog cover image based on the article title and keywords.
 */
export async function generateBlogImage(title: string, keywords: string[] = []): Promise<string> {
  // 1. If Cloudflare Workers AI is configured with account ID, use Flux Schnell
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
      })

      if (res.ok) {
        const data = await res.json()
        if (data.result?.image) {
          return `data:image/jpeg;base64,${data.result.image}`
        }
      }
    } catch (e) {
      console.warn("[Cloudflare AI Image Error, falling back]:", e)
    }
  }

  // 2. High-speed, photorealistic generative image endpoint via Pollinations.ai (Flux model)
  const encodedPrompt = encodeURIComponent(
    `Modern aesthetic tech product illustration for blog: ${title}, vector art style, dark sleek background, emerald green accents, professional banner, high resolution, 16:9`
  )
  return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=630&model=flux&nologo=true`
}

