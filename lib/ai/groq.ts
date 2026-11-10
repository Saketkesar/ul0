import "server-only"

const GROQ_KEYS = (process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || "")
  .split(",")
  .map((k) => k.trim())
  .filter(Boolean)

const LLM7_KEY = process.env.LLM7_API_KEY || ""
const OLLAMA_KEY = process.env.OLLAMA_CLOUD_API_KEY || ""

let currentKeyIndex = 0

function getNextGroqKey(): string | null {
  if (GROQ_KEYS.length === 0) return null
  const key = GROQ_KEYS[currentKeyIndex % GROQ_KEYS.length]
  currentKeyIndex++
  return key
}

export interface GeneratedBlogPost {
  title: string
  slug: string
  excerpt: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
  author: string
  readTime: string
  bodyMarkdown: string
  faqs: { question: string; answer: string }[]
  publishedAt: string
}

/**
 * Generates an organic, non-robotic timestamp with randomized human jitter.
 * Avoids robotic round timestamps like "10:00:00.000Z".
 */
export function generateRandomizedPublishTime(baseDate: Date = new Date()): string {
  const d = new Date(baseDate)

  // Random daytime hour between 08:00 and 19:00 (peak human engagement)
  const randomHour = 8 + Math.floor(Math.random() * 11)
  // Random minute with natural non-round jitter (e.g., 14, 27, 43)
  const randomMinute = Math.floor(Math.random() * 60)
  // Random second
  const randomSecond = Math.floor(Math.random() * 60)
  const randomMs = Math.floor(Math.random() * 999)

  d.setUTCHours(randomHour, randomMinute, randomSecond, randomMs)
  return d.toISOString()
}

const HUMAN_WRITERS = [
  "Saket Kesar",
  "Dev Sarkar",
  "Subesh Sarkar",
  "Saket Kesar",
]

const SYSTEM_PROMPT = `You are a world-class technical writer, growth engineer, and infrastructure specialist for UL0 (ul0.site).
You write authentic, authoritative, opinionated articles that sound 100% human-crafted — exactly like senior engineering posts on the Cloudflare, Stripe, or Fly.io technical blogs.

STRICT EDITORIAL RULES:
1. ZERO AI FLUFF: Never use banned robotic clichés:
   - BANNED: "In today's fast-paced digital world", "In this comprehensive guide, we will delve into", "delve", "tapestry", "beacon", "testament", "plethora", "unlocking the power", "game-changer", "revolutionary", "Furthermore", "Moreover", "In conclusion".
2. HOOK DIRECTLY: Start immediately with the core problem, developer frustration, or industry shift. No throat-clearing.
3. CONCRETE & OPINIONATED: Quote real numbers (e.g. 307 temporary redirects vs 301 browser cache lock-in, 42ms edge latency vs 350ms multi-hop redirect latency, Bitly's 5-link cap and $35/mo custom domain paywall).
4. REAL ARTIFACTS: Include actual markdown tables with real numbers, actionable terminal commands (like curl or dig), and clear step-by-step CNAME instructions.
5. FORMATTING: Use punchy 2-3 sentence paragraphs, bold contrast words, callout boxes (e.g. "> 💡 Pro Tip:" or "> ⚠️ Warning:"), and a 4-5 question high-intent FAQ section.
6. Return the response STRICTLY as valid JSON matching the requested schema with no markdown backtick wrapper.`

function buildUserPrompt(topic: string, targetKeywords: string[]): string {
  return `Write an in-depth, authentic 1,200+ word human-written article to rank #1 on Google.
Target Topic: "${topic}"
Target Primary Keywords: ${targetKeywords.join(", ")}

Real UL0 Facts to cite naturally:
- Free Branded Custom Domain: Connect 1 custom domain $0 forever with automatic Let's Encrypt SSL.
- No Signup Barrier: Anyone can shorten URLs or generate dynamic QR codes anonymously with 0 email required.
- Fast 307 Temporary Redirects: Preserves real-time click metrics and lets you change destination links anytime without browser cache corruption.
- Vector QR Codes: Clean SVG and PNG export without pixelated blur.
- Integrated Tools: WhatsApp click-to-chat links with pre-filled text (/whatsapp), free bill splitting (/split), redirect checker (/tools/redirect-checker).

Return STRICTLY as JSON with these keys:
{
  "title": "Natural human title with primary keyword and current year 2026",
  "slug": "clean-keyword-rich-slug",
  "excerpt": "Engaging 2-sentence summary under 160 characters",
  "metaTitle": "Compelling SEO title under 60 chars",
  "metaDescription": "Action-oriented meta description under 155 chars",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "readTime": "6 min read",
  "bodyMarkdown": "Full article markdown content with ## and ### headings, tables, callout blocks, and examples...",
  "faqs": [
    {"question": "Question 1?", "answer": "Practical Answer 1."},
    {"question": "Question 2?", "answer": "Practical Answer 2."}
  ]
}`
}

function cleanJsonResponse(content: string): GeneratedBlogPost {
  let cleaned = content.trim()
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json/, "").replace(/```$/, "").trim()
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```/, "").replace(/```$/, "").trim()
  }
  const parsed = JSON.parse(cleaned)

  // Ensure human metadata
  const author = HUMAN_WRITERS[Math.floor(Math.random() * HUMAN_WRITERS.length)]
  const publishedAt = generateRandomizedPublishTime()

  return {
    ...parsed,
    author: parsed.author || author,
    readTime: parsed.readTime || "6 min read",
    publishedAt: parsed.publishedAt || publishedAt,
  }
}

/**
 * Generates an in-depth, human-like SEO blog post with automatic key rotation and provider fallback.
 */
export async function generateBlogPostWithGroq(
  topic: string,
  targetKeywords: string[],
  customDate?: Date
): Promise<GeneratedBlogPost> {
  const userPrompt = buildUserPrompt(topic, targetKeywords)
  const errors: string[] = []

  // 1. Try Groq keys with rotation
  const attempts = Math.max(1, GROQ_KEYS.length)
  for (let i = 0; i < attempts; i++) {
    const apiKey = getNextGroqKey()
    if (!apiKey) break

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
          temperature: 0.8, // Slightly higher temperature for natural human phrasing variety
          max_tokens: 4000,
        }),
      })

      if (res.ok) {
        const json = await res.json()
        const content = json.choices?.[0]?.message?.content
        if (content) {
          const post = cleanJsonResponse(content)
          if (customDate) {
            post.publishedAt = generateRandomizedPublishTime(customDate)
          }
          return post
        }
      } else {
        const err = await res.text()
        errors.push(`Groq key ${i + 1} (${res.status}): ${err.slice(0, 100)}`)
      }
    } catch (e: any) {
      errors.push(`Groq error: ${e.message}`)
    }
  }

  // 2. Fallback to LLM7.io if configured
  if (LLM7_KEY) {
    try {
      const res = await fetch("https://api.llm7.io/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LLM7_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.8,
          max_tokens: 4000,
        }),
      })

      if (res.ok) {
        const json = await res.json()
        const content = json.choices?.[0]?.message?.content
        if (content) {
          const post = cleanJsonResponse(content)
          if (customDate) {
            post.publishedAt = generateRandomizedPublishTime(customDate)
          }
          return post
        }
      }
    } catch (e: any) {
      errors.push(`LLM7 error: ${e.message}`)
    }
  }

  throw new Error(`Blog generation failed across all AI providers. Errors: ${errors.join(" | ")}`)
}
