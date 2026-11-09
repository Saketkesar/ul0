import "server-only"
import crypto from "crypto"
import { query, mapRow } from "../db"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BacklinkDoc {
  $id: string
  id?: string
  website_url: string
  website_name: string
  website_description: string
  logo_url: string | null
  owner_email: string | null
  badge_code: string
  verification_token: string
  verified: boolean
  verified_at: string | null
  created_at: string
}

export interface CreateBacklinkInput {
  website_url: string
  website_name: string
  website_description: string
  logo_url?: string | null
  owner_email?: string | null
  badge_code: string
  verification_token: string
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

export async function createBacklink(input: CreateBacklinkInput): Promise<BacklinkDoc> {
  const id = crypto.randomUUID()
  const res = await query(
    `INSERT INTO backlinks (
      id, website_url, website_name, website_description, logo_url,
      owner_email, badge_code, verification_token, verified, verified_at, created_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, FALSE, NULL, NOW())
    RETURNING *`,
    [
      id,
      input.website_url,
      input.website_name,
      input.website_description,
      input.logo_url ?? null,
      input.owner_email ?? null,
      input.badge_code,
      input.verification_token,
    ]
  )
  return mapRow<BacklinkDoc>(res.rows[0])
}

export async function getBacklinkByToken(token: string): Promise<BacklinkDoc | null> {
  const res = await query(
    "SELECT * FROM backlinks WHERE verification_token = $1 LIMIT 1",
    [token]
  )
  if (res.rows.length === 0) return null
  return mapRow<BacklinkDoc>(res.rows[0])
}

export async function getBacklinkByUrl(url: string): Promise<BacklinkDoc | null> {
  const res = await query(
    "SELECT * FROM backlinks WHERE website_url = $1 LIMIT 1",
    [url]
  )
  if (res.rows.length === 0) return null
  return mapRow<BacklinkDoc>(res.rows[0])
}

export async function verifyBacklink(docId: string): Promise<BacklinkDoc> {
  const res = await query(
    "UPDATE backlinks SET verified = TRUE, verified_at = NOW() WHERE id = $1 RETURNING *",
    [docId]
  )
  return mapRow<BacklinkDoc>(res.rows[0])
}

export async function listVerifiedBacklinks(limit: number = 100): Promise<BacklinkDoc[]> {
  try {
    const res = await query(
      "SELECT * FROM backlinks WHERE verified = TRUE ORDER BY created_at DESC LIMIT $1",
      [limit]
    )
    return res.rows.map(mapRow<BacklinkDoc>)
  } catch (err) {
    console.error("Error fetching verified backlinks:", err)
    return []
  }
}

export async function countVerifiedBacklinks(): Promise<number> {
  try {
    const res = await query(
      "SELECT count(*) as total FROM backlinks WHERE verified = TRUE"
    )
    return parseInt(res.rows[0]?.total || "0", 10)
  } catch {
    return 0
  }
}
