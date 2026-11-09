import "server-only"
import crypto from "crypto"
import { query, mapRow, isConflictError } from "../db"

export { isConflictError }

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SplitSessionDoc {
  $id: string
  id?: string
  slug: string
  title: string
  members_json: string
  expenses_json: string
  settlements_json: string | null
  total_amount: number
  expires_at: string | null
  created_at: string | null
}

export interface SplitSession {
  $id: string
  id?: string
  slug: string
  title: string
  members: unknown[]
  expenses: unknown[]
  settlements: unknown[]
  total_amount: number
  expires_at: string | null
  created_at: string | null
}

export interface CreateSplitSessionInput {
  slug: string
  title: string
  members: unknown[]
  expenses: unknown[]
  settlements: unknown[]
  total_amount: number
  expires_at: string
}

function inflate(doc: SplitSessionDoc): SplitSession {
  return {
    $id: doc.$id,
    id: doc.id || doc.$id,
    slug: doc.slug,
    title: doc.title,
    members: typeof doc.members_json === "string" ? JSON.parse(doc.members_json || "[]") : doc.members_json || [],
    expenses: typeof doc.expenses_json === "string" ? JSON.parse(doc.expenses_json || "[]") : doc.expenses_json || [],
    settlements: typeof doc.settlements_json === "string" ? JSON.parse(doc.settlements_json || "[]") : doc.settlements_json || [],
    total_amount: Number(doc.total_amount || 0),
    expires_at: doc.expires_at,
    created_at: doc.created_at,
  }
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

export async function getSplitSessionBySlug(
  slug: string
): Promise<SplitSession | null> {
  const res = await query(
    "SELECT * FROM split_sessions WHERE slug = $1 LIMIT 1",
    [slug]
  )
  if (res.rows.length === 0) return null
  return inflate(mapRow<SplitSessionDoc>(res.rows[0]))
}

export async function createSplitSession(
  input: CreateSplitSessionInput
): Promise<SplitSession> {
  const id = crypto.randomUUID()
  const expiresAt = input.expires_at ? new Date(input.expires_at) : null

  const res = await query(
    `INSERT INTO split_sessions (
      id, slug, title, members_json, expenses_json, settlements_json, total_amount, expires_at, created_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
    RETURNING *`,
    [
      id,
      input.slug,
      input.title,
      JSON.stringify(input.members || []),
      JSON.stringify(input.expenses || []),
      JSON.stringify(input.settlements || []),
      input.total_amount || 0,
      expiresAt,
    ]
  )

  return inflate(mapRow<SplitSessionDoc>(res.rows[0]))
}

export async function updateSplitSettlements(
  slug: string,
  settlements: unknown[]
): Promise<SplitSession | null> {
  const res = await query(
    `UPDATE split_sessions 
     SET settlements_json = $1 
     WHERE slug = $2 
     RETURNING *`,
    [JSON.stringify(settlements || []), slug]
  )

  if (res.rows.length === 0) return null
  return inflate(mapRow<SplitSessionDoc>(res.rows[0]))
}
