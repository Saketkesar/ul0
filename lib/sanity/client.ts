import "server-only"

export interface SanityPost {
  _id?: string
  _type: "post"
  title: string
  slug: { current: string }
  excerpt: string
  coverImageUrl?: string
  publishedAt: string
  body: string
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
}

const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || ""
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || "production"
const SANITY_API_VERSION = "v2023-05-03"
const SANITY_TOKEN = process.env.SANITY_API_TOKEN || ""

/**
 * Executes a GROQ query against Sanity's REST API.
 */
export async function sanityFetch<T = any>(query: string, params: Record<string, any> = {}): Promise<T | null> {
  if (!SANITY_PROJECT_ID) {
    console.warn("[Sanity] NEXT_PUBLIC_SANITY_PROJECT_ID is not configured.")
    return null
  }

  try {
    const searchParams = new URLSearchParams({
      query,
      ...Object.fromEntries(
        Object.entries(params).map(([k, v]) => [`$${k}`, JSON.stringify(v)])
      ),
    })

    const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?${searchParams.toString()}`

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }
    if (SANITY_TOKEN) {
      headers["Authorization"] = `Bearer ${SANITY_TOKEN}`
    }

    const res = await fetch(url, {
      headers,
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      const err = await res.text()
      console.error("[Sanity Fetch Error]:", err)
      return null
    }

    const data = await res.json()
    return data.result as T
  } catch (error) {
    console.error("[Sanity Query Error]:", error)
    return null
  }
}

/**
 * Creates or schedules a new blog post in Sanity via Mutate API.
 */
export async function createSanityPost(post: SanityPost): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!SANITY_PROJECT_ID || !SANITY_TOKEN) {
    return {
      success: false,
      error: "SANITY_PROJECT_ID and SANITY_API_TOKEN must be configured in environment variables to publish/schedule posts.",
    }
  }

  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/${SANITY_API_VERSION}/data/mutate/${SANITY_DATASET}`

  const mutations = [
    {
      createOrReplace: {
        _id: post._id || `post-${post.slug.current}`,
        _type: "post",
        title: post.title,
        slug: { _type: "slug", current: post.slug.current },
        excerpt: post.excerpt,
        coverImageUrl: post.coverImageUrl || "",
        publishedAt: post.publishedAt,
        body: post.body,
        metaTitle: post.metaTitle || post.title,
        metaDescription: post.metaDescription || post.excerpt,
        keywords: post.keywords || [],
      },
    },
  ]

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SANITY_TOKEN}`,
      },
      body: JSON.stringify({ mutations }),
    })

    if (!res.ok) {
      const errText = await res.text()
      return { success: false, error: errText }
    }

    const json = await res.json()
    return { success: true, id: json.results?.[0]?.id }
  } catch (e: any) {
    return { success: false, error: e.message }
  }
}

/**
 * Fetches all published posts whose publishedAt date is now or in the past (supports scheduling).
 */
export async function getPublishedSanityPosts(): Promise<SanityPost[]> {
  const now = new Date().toISOString()
  const query = `*[_type == "post" && publishedAt <= $now] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    "coverImageUrl": coalesce(coverImageUrl, coverImage.asset->url, ""),
    publishedAt,
    metaTitle,
    metaDescription,
    keywords
  }`
  const posts = await sanityFetch<SanityPost[]>(query, { now })
  return posts || []
}

