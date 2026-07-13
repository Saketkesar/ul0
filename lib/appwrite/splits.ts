import "server-only"
import { getDatabases, Query, ID } from "./server"
import { APPWRITE_DATABASE_ID, COLLECTIONS } from "./config"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SplitSessionDoc {
  $id: string
  slug: string
  title: string
  /** JSON-stringified array of member objects. */
  members_json: string
  /** JSON-stringified array of expense objects. */
  expenses_json: string
  /** JSON-stringified array of settlement objects (may be empty string). */
  settlements_json: string | null
  total_amount: number
  expires_at: string | null
  created_at: string | null
}

/** Parsed version returned to callers — JSON fields are inflated to objects. */
export interface SplitSession {
  $id: string
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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const db = () => getDatabases()
const DB = APPWRITE_DATABASE_ID
const COL = COLLECTIONS.split_sessions

/** Inflate a raw Appwrite doc into the friendlier SplitSession shape. */
function inflate(doc: SplitSessionDoc): SplitSession {
  return {
    $id: doc.$id,
    slug: doc.slug,
    title: doc.title,
    members: JSON.parse(doc.members_json || "[]"),
    expenses: JSON.parse(doc.expenses_json || "[]"),
    settlements: JSON.parse(doc.settlements_json || "[]"),
    total_amount: doc.total_amount,
    expires_at: doc.expires_at,
    created_at: doc.created_at,
  }
}

/**
 * Check whether an Appwrite error is a unique-index conflict (HTTP 409).
 */
export function isConflictError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false
  const e = err as Record<string, unknown>
  return e.code === 409 || e.type === "document_already_exists"
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

/**
 * Get a split session by its slug.
 * Returns `null` if not found.
 */
export async function getSplitSessionBySlug(
  slug: string,
): Promise<SplitSession | null> {
  const { documents } = await db().listDocuments(DB, COL, [
    Query.equal("slug", slug),
    Query.limit(1),
  ])

  if (documents.length === 0) return null
  return inflate(documents[0] as unknown as SplitSessionDoc)
}

/**
 * Create a new split session.
 * Arrays are serialised to JSON strings for storage.
 * Throws on unique-index conflict (duplicate slug).
 */
export async function createSplitSession(
  input: CreateSplitSessionInput,
): Promise<SplitSession> {
  const doc = await db().createDocument(DB, COL, ID.unique(), {
    slug: input.slug,
    title: input.title,
    members_json: JSON.stringify(input.members),
    expenses_json: JSON.stringify(input.expenses),
    settlements_json: JSON.stringify(input.settlements),
    total_amount: input.total_amount,
    expires_at: input.expires_at,
    created_at: new Date().toISOString(),
  })

  return inflate(doc as unknown as SplitSessionDoc)
}
