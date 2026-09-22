import "server-only"
import { getDatabases, Query, ID } from "./server"
import { APPWRITE_DATABASE_ID, COLLECTIONS } from "./config"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MonetizedLinkDoc {
  $id: string
  slug: string
  title: string
  target_url: string
  total_steps: number
  blog_slugs: string // JSON string array
  owner_email: string
  owner_id?: string | null
  views: number
  completed_unlocks: number
  created_at: string
}

export interface MonetizedLink {
  $id: string
  slug: string
  title: string
  target_url: string
  total_steps: number
  blog_slugs: string[]
  owner_email: string
  owner_id?: string | null
  views: number
  completed_unlocks: number
  created_at: string
}

export interface CreateMonetizedLinkInput {
  slug: string
  title: string
  target_url: string
  total_steps: number
  blog_slugs: string[]
  owner_email: string
  owner_id?: string | null
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const db = () => getDatabases()
const DB = APPWRITE_DATABASE_ID
const COL = COLLECTIONS.monetized_links

function inflate(doc: MonetizedLinkDoc): MonetizedLink {
  let blogs: string[] = []
  try {
    blogs = JSON.parse(doc.blog_slugs || "[]")
  } catch {
    blogs = []
  }
  return {
    $id: doc.$id,
    slug: doc.slug,
    title: doc.title,
    target_url: doc.target_url,
    total_steps: doc.total_steps,
    blog_slugs: blogs,
    owner_email: doc.owner_email,
    owner_id: doc.owner_id,
    views: doc.views || 0,
    completed_unlocks: doc.completed_unlocks || 0,
    created_at: doc.created_at,
  }
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

export async function createMonetizedLink(
  input: CreateMonetizedLinkInput
): Promise<MonetizedLink> {
  const doc = await db().createDocument(DB, COL, ID.unique(), {
    slug: input.slug,
    title: input.title,
    target_url: input.target_url,
    total_steps: input.total_steps,
    blog_slugs: JSON.stringify(input.blog_slugs),
    owner_email: input.owner_email,
    owner_id: input.owner_id || null,
    views: 0,
    completed_unlocks: 0,
    created_at: new Date().toISOString(),
  })
  return inflate(doc as unknown as MonetizedLinkDoc)
}

export async function getMonetizedLinkBySlug(
  slug: string
): Promise<MonetizedLink | null> {
  const { documents } = await db().listDocuments(DB, COL, [
    Query.equal("slug", slug),
    Query.limit(1),
  ])
  if (documents.length === 0) return null
  return inflate(documents[0] as unknown as MonetizedLinkDoc)
}

export async function listMonetizedLinksByOwner(
  ownerEmail: string,
  limit = 50
): Promise<MonetizedLink[]> {
  const { documents } = await db().listDocuments(DB, COL, [
    Query.equal("owner_email", ownerEmail),
    Query.orderDesc("created_at"),
    Query.limit(limit),
  ])
  return (documents as unknown as MonetizedLinkDoc[]).map(inflate)
}

export async function incrementMonetizedLinkViews(
  docId: string,
  currentViews: number
): Promise<void> {
  try {
    await db().updateDocument(DB, COL, docId, {
      views: currentViews + 1,
    })
  } catch (err) {
    console.error("Failed to increment views:", err)
  }
}

export async function incrementMonetizedLinkUnlocks(
  docId: string,
  currentUnlocks: number
): Promise<void> {
  try {
    await db().updateDocument(DB, COL, docId, {
      completed_unlocks: currentUnlocks + 1,
    })
  } catch (err) {
    console.error("Failed to increment unlocks:", err)
  }
}

export async function deleteMonetizedLink(docId: string): Promise<boolean> {
  try {
    await db().deleteDocument(DB, COL, docId)
    return true
  } catch (err) {
    console.error("Failed to delete monetized link:", err)
    return false
  }
}
