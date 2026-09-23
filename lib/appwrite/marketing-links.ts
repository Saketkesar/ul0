import "server-only"
import { getDatabases, Query, ID } from "./server"
import { APPWRITE_DATABASE_ID, COLLECTIONS } from "./config"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MarketingLinkDoc {
  $id: string
  alias: string
  destination_url: string
  owner_clerk_user_id: string
  blog_count: number
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
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const db = () => getDatabases()
const DB = APPWRITE_DATABASE_ID
const COL = COLLECTIONS.marketing_links

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

export async function createMarketingLink(
  input: CreateMarketingLinkInput
): Promise<MarketingLinkDoc> {
  const now = new Date().toISOString()
  const doc = await db().createDocument(DB, COL, ID.unique(), {
    alias: input.alias,
    destination_url: input.destination_url,
    owner_clerk_user_id: input.owner_clerk_user_id,
    blog_count: input.blog_count,
    is_active: true,
    total_gate_opens: 0,
    total_completions: 0,
    created_at: now,
    updated_at: now,
  })
  return doc as unknown as MarketingLinkDoc
}

export async function getMarketingLinkByAlias(
  alias: string
): Promise<MarketingLinkDoc | null> {
  try {
    const { documents } = await db().listDocuments(DB, COL, [
      Query.equal("alias", alias),
      Query.limit(1),
    ])
    if (documents.length === 0) return null
    return documents[0] as unknown as MarketingLinkDoc
  } catch {
    return null
  }
}

export async function listMarketingLinksByOwner(
  ownerClerkUserId: string,
  limit = 50
): Promise<MarketingLinkDoc[]> {
  const { documents } = await db().listDocuments(DB, COL, [
    Query.equal("owner_clerk_user_id", ownerClerkUserId),
    Query.orderDesc("created_at"),
    Query.limit(limit),
  ])
  return documents as unknown as MarketingLinkDoc[]
}

export async function toggleMarketingLinkActive(
  docId: string,
  isActive: boolean
): Promise<void> {
  await db().updateDocument(DB, COL, docId, {
    is_active: isActive,
    updated_at: new Date().toISOString(),
  })
}

export async function incrementGateOpens(docId: string): Promise<void> {
  try {
    const doc = await db().getDocument(DB, COL, docId)
    await db().updateDocument(DB, COL, docId, {
      total_gate_opens: (doc.total_gate_opens || 0) + 1,
    })
  } catch (err) {
    console.error("Failed to increment gate opens:", err)
  }
}

export async function incrementCompletions(docId: string): Promise<void> {
  try {
    const doc = await db().getDocument(DB, COL, docId)
    await db().updateDocument(DB, COL, docId, {
      total_completions: (doc.total_completions || 0) + 1,
    })
  } catch (err) {
    console.error("Failed to increment completions:", err)
  }
}

export async function deleteMarketingLink(docId: string): Promise<boolean> {
  try {
    await db().deleteDocument(DB, COL, docId)
    return true
  } catch (err) {
    console.error("Failed to delete marketing link:", err)
    return false
  }
}
