import "server-only"
import crypto from "crypto"
import { query, mapRow } from "../db"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MarketingLinkDoc {
  $id: string
  id?: string
  alias: string
  destination_url: string
  owner_clerk_user_id: string
  blog_count: number
  link_type?: "button" | "auto_skip"
  timer_seconds?: number
  target_slug?: string
  is_active: boolean
  total_gate_opens: number
  total_completions: number
  created_at: string
  updated_at: string
}

export interface CreateMarketingLinkInput {
  alias: string
  destination_url: string
  owner_clerk_user_id: string
  blog_count: number
  link_type?: "button" | "auto_skip"
  timer_seconds?: number
  target_slug?: string
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

export async function createMarketingLink(
  input: CreateMarketingLinkInput
): Promise<MarketingLinkDoc> {
  const id = crypto.randomUUID()
  const res = await query(
    `INSERT INTO marketing_links (
      id, alias, destination_url, owner_clerk_user_id, blog_count,
      link_type, timer_seconds, target_slug, is_active, total_gate_opens,
      total_completions, created_at, updated_at
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE, 0, 0, NOW(), NOW())
    RETURNING *`,
    [
      id,
      input.alias,
      input.destination_url,
      input.owner_clerk_user_id,
      input.blog_count || 3,
      input.link_type || "button",
      input.timer_seconds || 5,
      input.target_slug || "",
    ]
  )
  return mapRow<MarketingLinkDoc>(res.rows[0])
}

export async function getMarketingLinkByAlias(
  alias: string
): Promise<MarketingLinkDoc | null> {
  try {
    const res = await query(
      "SELECT * FROM marketing_links WHERE alias = $1 LIMIT 1",
      [alias]
    )
    if (res.rows.length === 0) return null
    return mapRow<MarketingLinkDoc>(res.rows[0])
  } catch {
    return null
  }
}

export async function listMarketingLinksByOwner(
  ownerClerkUserId: string,
  limit = 50
): Promise<MarketingLinkDoc[]> {
  try {
    const res = await query(
      "SELECT * FROM marketing_links WHERE owner_clerk_user_id = $1 ORDER BY created_at DESC LIMIT $2",
      [ownerClerkUserId, limit]
    )
    return res.rows.map(mapRow<MarketingLinkDoc>)
  } catch (err) {
    console.error("Error listing marketing links:", err)
    return []
  }
}

export async function toggleMarketingLinkActive(
  docId: string,
  isActive: boolean
): Promise<void> {
  await query(
    "UPDATE marketing_links SET is_active = $1, updated_at = NOW() WHERE id = $2",
    [isActive, docId]
  )
}

export async function incrementGateOpens(docId: string): Promise<void> {
  try {
    await query(
      "UPDATE marketing_links SET total_gate_opens = total_gate_opens + 1 WHERE id = $1",
      [docId]
    )
  } catch (err) {
    console.error("Failed to increment gate opens:", err)
  }
}

export async function incrementCompletions(docId: string): Promise<void> {
  try {
    await query(
      "UPDATE marketing_links SET total_completions = total_completions + 1 WHERE id = $1",
      [docId]
    )
  } catch (err) {
    console.error("Failed to increment completions:", err)
  }
}

export async function deleteMarketingLink(docId: string): Promise<boolean> {
  try {
    await query("DELETE FROM marketing_links WHERE id = $1", [docId])
    return true
  } catch (err) {
    console.error("Failed to delete marketing link:", err)
    return false
  }
}
