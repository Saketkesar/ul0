import { getDatabases } from "@/lib/appwrite/server"
import { COLLECTIONS, APPWRITE_DATABASE_ID } from "@/lib/appwrite/config"
import { Query, ID } from "node-appwrite"
import { redis } from "@/lib/redis"
import type { FormDoc } from "@/lib/forms/schema"

const db = () => getDatabases()
const DB = APPWRITE_DATABASE_ID
const FORMS_COLLECTION = COLLECTIONS.forms

export interface FormRecord {
  $id: string
  $createdAt: string
  $updatedAt: string
  owner_id: string
  slug: string
  title: string
  description: string
  status: "draft" | "live" | "paused"
  step: number
  schema: string
  theme: string
  permissions: string
  script_url: string
  script_secret_enc: string
  created_at: string
  updated_at: string
  published_at?: string | null
}

export function parseFormDoc(raw: any): FormDoc {
  let schema = []
  try {
    schema = typeof raw.schema === "string" ? JSON.parse(raw.schema) : raw.schema || []
  } catch {}

  let theme = {}
  try {
    theme = typeof raw.theme === "string" ? JSON.parse(raw.theme) : raw.theme || {}
  } catch {}

  let permissions = { read: true, edit: false, delete: false }
  try {
    permissions = typeof raw.permissions === "string" ? JSON.parse(raw.permissions) : raw.permissions || permissions
  } catch {}

  return {
    id: raw.$id,
    owner_id: raw.owner_id,
    slug: raw.slug,
    title: raw.title,
    description: raw.description || "",
    status: raw.status || "draft",
    step: raw.step || 1,
    schema,
    theme: theme as any,
    permissions,
    script_url: raw.script_url || "",
    script_secret_enc: raw.script_secret_enc || "",
    created_at: raw.created_at || raw.$createdAt,
    updated_at: raw.updated_at || raw.$updatedAt,
    published_at: raw.published_at ?? null,
  }
}

/**
 * Creates a new form document in Appwrite.
 */
export async function createFormDoc(params: {
  owner_id: string
  slug: string
  title: string
  description?: string
  schema?: any[]
  theme?: any
  permissions?: any
  script_secret_enc?: string
}): Promise<FormDoc> {
  const now = new Date().toISOString()
  const payload = {
    owner_id: params.owner_id,
    slug: params.slug,
    title: params.title,
    description: params.description || "",
    status: "draft",
    step: 1,
    schema: JSON.stringify(params.schema || []),
    theme: JSON.stringify(params.theme || {}),
    permissions: JSON.stringify(params.permissions || { read: true, edit: false, delete: false }),
    script_url: "",
    script_secret_enc: params.script_secret_enc || "",
    created_at: now,
    updated_at: now,
    published_at: null,
  }

  const doc = await db().createDocument(DB, FORMS_COLLECTION, ID.unique(), payload)
  return parseFormDoc(doc)
}

/**
 * Gets a form document by ID.
 */
export async function getFormDocById(id: string): Promise<FormDoc | null> {
  try {
    const doc = await db().getDocument(DB, FORMS_COLLECTION, id)
    return parseFormDoc(doc)
  } catch {
    return null
  }
}

/**
 * Gets a form document by slug with Redis caching for published live forms.
 */
export async function getFormDocBySlug(slug: string, bypassCache = false): Promise<FormDoc | null> {
  const cleanSlug = slug.toLowerCase().trim()
  const cacheKey = `form:${cleanSlug}`

  if (!bypassCache) {
    try {
      const cached = await redis.get<string>(cacheKey)
      if (cached) {
        return typeof cached === "string" ? JSON.parse(cached) : cached
      }
    } catch {}
  }

  try {
    const { documents } = await db().listDocuments(DB, FORMS_COLLECTION, [
      Query.equal("slug", cleanSlug),
      Query.limit(1),
    ])

    if (!documents || documents.length === 0) return null
    const form = parseFormDoc(documents[0])

    if (form.status === "live") {
      try {
        await redis.set(cacheKey, JSON.stringify(form), { ex: 300 }) // 5 min TTL
      } catch {}
    }

    return form
  } catch {
    return null
  }
}

/**
 * Lists all forms owned by a user.
 */
export async function listFormDocsByOwner(ownerId: string, limit = 50): Promise<FormDoc[]> {
  try {
    const { documents } = await db().listDocuments(DB, FORMS_COLLECTION, [
      Query.equal("owner_id", ownerId),
      Query.orderDesc("updated_at"),
      Query.limit(limit),
    ])

    return (documents || []).map(parseFormDoc)
  } catch (err) {
    console.error("listFormDocsByOwner error:", err)
    return []
  }
}

/**
 * Updates a form document and invalidates Redis cache.
 */
export async function updateFormDoc(
  id: string,
  updates: Partial<{
    title: string
    description: string
    slug: string
    status: "draft" | "live" | "paused"
    step: number
    schema: any[]
    theme: any
    permissions: any
    script_url: string
    script_secret_enc: string
    published_at: string | null
  }>
): Promise<FormDoc> {
  const payload: Record<string, any> = {
    updated_at: new Date().toISOString(),
  }

  if (updates.title !== undefined) payload.title = updates.title
  if (updates.description !== undefined) payload.description = updates.description
  if (updates.slug !== undefined) payload.slug = updates.slug.toLowerCase().trim()
  if (updates.status !== undefined) payload.status = updates.status
  if (updates.step !== undefined) payload.step = updates.step
  if (updates.schema !== undefined) payload.schema = JSON.stringify(updates.schema)
  if (updates.theme !== undefined) payload.theme = JSON.stringify(updates.theme)
  if (updates.permissions !== undefined) payload.permissions = JSON.stringify(updates.permissions)
  if (updates.script_url !== undefined) payload.script_url = updates.script_url
  if (updates.script_secret_enc !== undefined) payload.script_secret_enc = updates.script_secret_enc
  if (updates.published_at !== undefined) payload.published_at = updates.published_at

  const updatedDoc = await db().updateDocument(DB, FORMS_COLLECTION, id, payload)
  const form = parseFormDoc(updatedDoc)

  // Invalidate cache
  try {
    await redis.del(`form:${form.slug}`)
  } catch {}

  return form
}

/**
 * Deletes a form document and purges its cache.
 */
export async function deleteFormDoc(id: string, ownerId: string): Promise<void> {
  const existing = await getFormDocById(id)
  if (!existing || existing.owner_id !== ownerId) {
    throw new Error("Forbidden or not found")
  }

  await db().deleteDocument(DB, FORMS_COLLECTION, id)

  try {
    await redis.del(`form:${existing.slug}`)
  } catch {}
}
