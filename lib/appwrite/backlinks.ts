import "server-only"
import { getDatabases, Query, ID } from "./server"
import { APPWRITE_DATABASE_ID, COLLECTIONS } from "./config"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BacklinkDoc {
  $id: string
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
// Helpers
// ---------------------------------------------------------------------------

const db = () => getDatabases()
const DB = APPWRITE_DATABASE_ID
const BACKLINKS = COLLECTIONS.backlinks

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

/**
 * Create a new backlink registration (unverified).
 */
export async function createBacklink(input: CreateBacklinkInput): Promise<BacklinkDoc> {
  const doc = await db().createDocument(DB, BACKLINKS, ID.unique(), {
    website_url: input.website_url,
    website_name: input.website_name,
    website_description: input.website_description,
    logo_url: input.logo_url ?? null,
    owner_email: input.owner_email ?? null,
    badge_code: input.badge_code,
    verification_token: input.verification_token,
    verified: false,
    verified_at: null,
    created_at: new Date().toISOString(),
  })
  return doc as unknown as BacklinkDoc
}

/**
 * Find a backlink doc by its verification token.
 */
export async function getBacklinkByToken(token: string): Promise<BacklinkDoc | null> {
  const { documents } = await db().listDocuments(DB, BACKLINKS, [
    Query.equal("verification_token", token),
    Query.limit(1),
  ])
  if (documents.length === 0) return null
  return documents[0] as unknown as BacklinkDoc
}

/**
 * Find a backlink doc by website URL.
 */
export async function getBacklinkByUrl(url: string): Promise<BacklinkDoc | null> {
  const { documents } = await db().listDocuments(DB, BACKLINKS, [
    Query.equal("website_url", url),
    Query.limit(1),
  ])
  if (documents.length === 0) return null
  return documents[0] as unknown as BacklinkDoc
}

/**
 * Mark a backlink as verified.
 */
export async function verifyBacklink(docId: string): Promise<BacklinkDoc> {
  const doc = await db().updateDocument(DB, BACKLINKS, docId, {
    verified: true,
    verified_at: new Date().toISOString(),
  })
  return doc as unknown as BacklinkDoc
}

/**
 * List all verified backlinks, newest first.
 */
export async function listVerifiedBacklinks(limit: number = 100): Promise<BacklinkDoc[]> {
  const { documents } = await db().listDocuments(DB, BACKLINKS, [
    Query.equal("verified", true),
    Query.orderDesc("created_at"),
    Query.limit(limit),
  ])
  return documents as unknown as BacklinkDoc[]
}

/**
 * Count total verified backlinks.
 */
export async function countVerifiedBacklinks(): Promise<number> {
  const { total } = await db().listDocuments(DB, BACKLINKS, [
    Query.equal("verified", true),
    Query.limit(1),
  ])
  return total
}
