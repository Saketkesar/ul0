import "server-only"
import crypto from "crypto"
import { query, mapRow } from "../db"
import { redis } from "@/lib/redis"
import type { FormDoc } from "@/lib/forms/schema"

export interface FormRecord {
  $id: string
  id?: string
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

  const id = raw.id || raw.$id

  return {
    id,
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
  const id = crypto.randomUUID()
  const res = await query(
    `INSERT INTO forms (
      id, owner_id, slug, title, description, status, step, schema,
      theme, permissions, script_url, script_secret_enc, created_at, updated_at, published_at
    ) VALUES ($1, $2, $3, $4, $5, 'draft', 1, $6, $7, $8, '', $9, NOW(), NOW(), NULL)
    RETURNING *`,
    [
      id,
      params.owner_id,
      params.slug.toLowerCase().trim(),
      params.title,
      params.description || "",
      JSON.stringify(params.schema || []),
      JSON.stringify(params.theme || {}),
      JSON.stringify(params.permissions || { read: true, edit: false, delete: false }),
      params.script_secret_enc || "",
    ]
  )

  return parseFormDoc(mapRow(res.rows[0]))
}

export async function getFormDocById(id: string): Promise<FormDoc | null> {
  try {
    const res = await query("SELECT * FROM forms WHERE id = $1 LIMIT 1", [id])
    if (res.rows.length === 0) return null
    return parseFormDoc(mapRow(res.rows[0]))
  } catch {
    return null
  }
}

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
    const res = await query("SELECT * FROM forms WHERE slug = $1 LIMIT 1", [cleanSlug])
    if (res.rows.length === 0) return null
    const form = parseFormDoc(mapRow(res.rows[0]))

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

export async function listFormDocsByOwner(ownerId: string, limit = 50): Promise<FormDoc[]> {
  try {
    const res = await query(
      "SELECT * FROM forms WHERE owner_id = $1 ORDER BY updated_at DESC LIMIT $2",
      [ownerId, limit]
    )
    return res.rows.map((r) => parseFormDoc(mapRow(r)))
  } catch (err) {
    console.error("listFormDocsByOwner error:", err)
    return []
  }
}

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
  const sets: string[] = ["updated_at = NOW()"]
  const params: any[] = []

  if (updates.title !== undefined) {
    params.push(updates.title)
    sets.push(`title = $${params.length}`)
  }
  if (updates.description !== undefined) {
    params.push(updates.description)
    sets.push(`description = $${params.length}`)
  }
  if (updates.slug !== undefined) {
    params.push(updates.slug.toLowerCase().trim())
    sets.push(`slug = $${params.length}`)
  }
  if (updates.status !== undefined) {
    params.push(updates.status)
    sets.push(`status = $${params.length}`)
  }
  if (updates.step !== undefined) {
    params.push(updates.step)
    sets.push(`step = $${params.length}`)
  }
  if (updates.schema !== undefined) {
    params.push(JSON.stringify(updates.schema))
    sets.push(`schema = $${params.length}`)
  }
  if (updates.theme !== undefined) {
    params.push(JSON.stringify(updates.theme))
    sets.push(`theme = $${params.length}`)
  }
  if (updates.permissions !== undefined) {
    params.push(JSON.stringify(updates.permissions))
    sets.push(`permissions = $${params.length}`)
  }
  if (updates.script_url !== undefined) {
    params.push(updates.script_url)
    sets.push(`script_url = $${params.length}`)
  }
  if (updates.script_secret_enc !== undefined) {
    params.push(updates.script_secret_enc)
    sets.push(`script_secret_enc = $${params.length}`)
  }
  if (updates.published_at !== undefined) {
    params.push(updates.published_at ? new Date(updates.published_at) : null)
    sets.push(`published_at = $${params.length}`)
  }

  params.push(id)
  const res = await query(
    `UPDATE forms SET ${sets.join(", ")} WHERE id = $${params.length} RETURNING *`,
    params
  )

  const form = parseFormDoc(mapRow(res.rows[0]))

  try {
    await redis.del(`form:${form.slug}`)
  } catch {}

  return form
}

export async function deleteFormDoc(id: string, ownerId: string): Promise<void> {
  const existing = await getFormDocById(id)
  if (!existing || existing.owner_id !== ownerId) {
    throw new Error("Forbidden or not found")
  }

  await query("DELETE FROM forms WHERE id = $1", [id])

  try {
    await redis.del(`form:${existing.slug}`)
  } catch {}
}
