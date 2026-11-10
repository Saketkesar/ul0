import "server-only"

const GROQ_KEYS = (process.env.GROQ_API_KEYS || process.env.GROQ_API_KEY || "")
  .split(",")
  .map((k) => k.trim())
  .filter(Boolean)

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

/**
 * Generates an in-depth, high-ranking SEO blog post using Groq (LLaMA 3.3 70B).
 */
export async function generateBlogPostWithGroq(topic: string, targetKeywords: string[]): Promise<GeneratedBlogPost> {
  const apiKey = getNextGroqKey()
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEYS in environment variables.")
  }

  const prompt = `You are an elite programmatic SEO and technical content writer for UL0 (ul0.site), a high-speed URL shortener with free branded custom domains, dynamic vector QR codes, 307 redirects, and bill splitting.

Write a comprehensive, authoritative, 1,200+ word blog article designed to rank #1 on Google.
Target Topic: "${topic}"
Target Primary Keywords: ${targetKeywords.join(", ")}

Requirements:
1. Highly engaging, professional tone with actionable insights.
2. Structure with clear Markdown H2 (##) and H3 (###) headings.
3. Compare against competitors like Bitly, TinyURL, or Rebrandly where relevant. Mention UL0's advantages (1 free custom domain forever, 100% free with no sign up required, 307 edge redirects).
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

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a specialized SEO copywriter. Always output clean, valid JSON with no markdown backtick fences.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 4000,
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Groq API error (${res.status}): ${errText}`)
  }

  const json = await res.json()
  const content = json.choices?.[0]?.message?.content
  if (!content) {
    throw new Error("Empty response from Groq API")
  }

  return JSON.parse(content) as GeneratedBlogPost
}
