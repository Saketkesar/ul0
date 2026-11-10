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
  bodyMarkdown: string
  faqs: { question: string; answer: string }[]
}

const SYSTEM_PROMPT = "You are an elite programmatic SEO and technical content writer for UL0 (ul0.site). Always output clean, valid JSON with no markdown backtick fences or extra conversational text."

function buildUserPrompt(topic: string, targetKeywords: string[]): string {
  return `Write a comprehensive, authoritative, 1,200+ word blog article designed to rank #1 on Google for UL0 (ul0.site).
Target Topic: "${topic}"
Target Primary Keywords: ${targetKeywords.join(", ")}

UL0 Facts & Differentiators to weave naturally throughout the article:
- 1 Branded Custom Domain 100% free forever with automated Let's Encrypt SSL certificates (Bitly charges $35/mo).
- 100% free with no signup or credit card required.
- Fast HTTP 307 temporary edge redirects (avoids browser caching of 301s and preserves real-time analytics).
- Dynamic vector QR codes (SVG & PNG with zero raster pixelation).
- Built-in utilities: WhatsApp direct link generator, bill splitting (/split), and redirect checker.

Requirements:
1. Highly engaging, professional tone with actionable insights.
2. Structure with clear Markdown H2 (##) and H3 (###) headings.
3. Compare against competitors like Bitly, TinyURL, or Rebrandly where relevant.
4. Include a dedicated "Frequently Asked Questions" section with 4-5 high-intent questions.
5. Return the result STRICTLY as valid JSON matching this schema:
{
  "title": "Compelling Title with Primary Keyword and Year (e.g. 2026)",
  "slug": "url-friendly-slug-with-hyphens",
  "excerpt": "Engaging 2-sentence summary under 160 characters",
  "metaTitle": "SEO Title under 60 chars",
  "metaDescription": "SEO Meta Description under 155 chars with call to action",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "bodyMarkdown": "Full article markdown content...",
  "faqs": [
    {"question": "Question 1?", "answer": "Answer 1."},
    {"question": "Question 2?", "answer": "Answer 2."}
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
  return JSON.parse(cleaned) as GeneratedBlogPost
}

/**
 * Generates an in-depth, high-ranking SEO blog post with automatic key rotation and provider fallback.
 */
export async function generateBlogPostWithGroq(topic: string, targetKeywords: string[]): Promise<GeneratedBlogPost> {
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
          temperature: 0.7,
          max_tokens: 4000,
        }),
      })

      if (res.ok) {
        const json = await res.json()
        const content = json.choices?.[0]?.message?.content
        if (content) {
          return cleanJsonResponse(content)
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
          temperature: 0.7,
          max_tokens: 4000,
        }),
      })

      if (res.ok) {
        const json = await res.json()
        const content = json.choices?.[0]?.message?.content
        if (content) {
          return cleanJsonResponse(content)
        }
      }
    } catch (e: any) {
      errors.push(`LLM7 error: ${e.message}`)
    }
  }

  throw new Error(`Blog generation failed across all AI providers. Errors: ${errors.join(" | ")}`)
}
