import "server-only"
import { getDatabases, Query, ID } from "./server"
import { APPWRITE_DATABASE_ID, COLLECTIONS } from "./config"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AccountDoc {
  $id: string
  clerk_user_id: string
  email: string | null
  plan: string
  billing_status: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  created_at: string | null
  api_key: string | null
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const db = () => getDatabases()
const DB = APPWRITE_DATABASE_ID
const COL = COLLECTIONS.accounts

// ---------------------------------------------------------------------------
// Account CRUD
// ---------------------------------------------------------------------------

/**
 * Get an account by Clerk user ID.
 * Returns `null` if not found.
 */
export async function getAccountByClerkId(
  clerkUserId: string,
): Promise<AccountDoc | null> {
  const { documents } = await db().listDocuments(DB, COL, [
    Query.equal("clerk_user_id", clerkUserId),
    Query.limit(1),
  ])

  if (documents.length === 0) return null
  return documents[0] as unknown as AccountDoc
}

/**
 * Upsert an account document keyed by clerk_user_id.
 * If the account already exists, returns it unchanged.
 * If it doesn't exist, creates a new one with the free plan.
 */
export async function upsertAccount(
  clerkUserId: string,
  email: string | null,
  plan: string = "free_user",
): Promise<AccountDoc> {
  // Try to find existing
  const existing = await getAccountByClerkId(clerkUserId)
  if (existing) {
    // Keep the existing plan stored in Appwrite
    return existing
  }

  // Create new account with the initial plan
  const doc = await db().createDocument(DB, COL, ID.unique(), {
    clerk_user_id: clerkUserId,
    email: email ?? null,
    plan,
    billing_status: "active",
    stripe_customer_id: null,
    stripe_subscription_id: null,
    created_at: new Date().toISOString(),
  })

  return doc as unknown as AccountDoc
}

/**
 * Update an account's plan and billing status.
 * Used by billing webhooks / Clerk Billing integration.
 */
export async function updateAccountPlan(
  clerkUserId: string,
  plan: string,
  billingStatus: string,
): Promise<AccountDoc | null> {
  const account = await getAccountByClerkId(clerkUserId)
  if (!account) return null

  const doc = await db().updateDocument(DB, COL, account.$id, {
    plan,
    billing_status: billingStatus,
  })

  return doc as unknown as AccountDoc
}

/**
 * Find an account by its API key.
 * Returns `null` if not found.
 */
export async function getAccountByApiKey(apiKey: string): Promise<AccountDoc | null> {
  const { documents } = await db().listDocuments(DB, COL, [
    Query.equal("api_key", apiKey),
    Query.limit(1),
  ])

  if (documents.length === 0) return null
  return documents[0] as unknown as AccountDoc
}

/**
 * Update the API key for a Clerk user.
 */
export async function updateAccountApiKey(
  clerkUserId: string,
  apiKey: string | null,
): Promise<AccountDoc | null> {
  const account = await getAccountByClerkId(clerkUserId)
  if (!account) return null

  const doc = await db().updateDocument(DB, COL, account.$id, {
    api_key: apiKey,
  })

  return doc as unknown as AccountDoc
}
