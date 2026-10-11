import "server-only"
import { getDatabases, Query, ID } from "./server"
import { APPWRITE_DATABASE_ID, COLLECTIONS, DEFAULT_HOST } from "./config"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Shape of a document in the `links` collection. */
export interface LinkDoc {
  /** Appwrite document id (preserves original Supabase UUID after migration). */
  $id: string
  slug: string
  long_url: string
  /** Host the link belongs to. Defaults to "ul0.site" for the public shortener. */
  host: string
  /** Clerk user ID of the link owner (null for anonymous links). */
  owner_id: string | null
  clicks_count: number
  created_at: string | null
  expire_at: string | null
  meta_title: string | null
  meta_domain: string | null
  meta_favicon_url: string | null
  /** "normal" | "custom" etc. */
  link_type: string
  /** Original Supabase UUID, kept for audit trail. */
  origin_id: string | null
  targeting_json?: string | null
}

/** Payload for creating a new link (optional fields omitted if unset). */
export interface CreateLinkInput {
  slug: string
  long_url: string
  host?: string
  owner_id?: string | null
  meta_title?: string | null
  meta_domain?: string | null
  meta_favicon_url?: string | null
  link_type?: string
  expire_at?: string | null
  targeting_json?: string | null
}

/** Shape of a document in the `clicks` collection. */
export interface ClickDoc {
  $id: string
  link_id: string
  owner_id: string | null
  clicked_at: string | null
  device_type: string | null
  country: string | null
  referrer: string | null
  user_agent: string | null
  ip_hash: string | null
  region?: string | null
  city?: string | null
  latitude?: number | null
  longitude?: number | null
  browser?: string | null
  os?: string | null
  device?: string | null
  utm_source?: string | null
  utm_medium?: string | null
  utm_campaign?: string | null
  language?: string | null
  timezone?: string | null
  bot?: boolean | null
  unique_visitor?: boolean | null
  qr_scan?: boolean | null
}

/** Payload for logging a click event. */
export interface LogClickInput {
  link_id: string
  owner_id?: string | null
  device_type?: string | null
  country?: string | null
  referrer?: string | null
  user_agent?: string | null
  ip_hash?: string | null
  region?: string | null
  city?: string | null
  latitude?: number | null
  longitude?: number | null
  browser?: string | null
  os?: string | null
  device?: string | null
  utm_source?: string | null
  utm_medium?: string | null
  utm_campaign?: string | null
  language?: string | null
  timezone?: string | null
  bot?: boolean | null
  unique_visitor?: boolean | null
  qr_scan?: boolean | null
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const db = () => getDatabases()
const DB = APPWRITE_DATABASE_ID
const LINKS = COLLECTIONS.links
const CLICKS = COLLECTIONS.clicks

/**
 * Check whether an Appwrite error is a unique-index conflict (HTTP 409).
 * The SDK throws an `AppwriteException` with `code === 409` when a document
 * violates a unique index (e.g. duplicate host+slug).
 */
export function isConflictError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false
  const e = err as Record<string, unknown>
  return e.code === 409 || e.type === "document_already_exists"
}

// ---------------------------------------------------------------------------
// Link CRUD
// ---------------------------------------------------------------------------

/**
 * Resolve a link by its (host, slug) pair.
 * Used by the redirect page (/r/[slug]) and multi-tenant routing.
 * Returns `null` if no matching document exists.
 */
export async function getLinkByHostSlug(
  host: string,
  slug: string,
): Promise<LinkDoc | null> {
  const { documents } = await db().listDocuments(DB, LINKS, [
    Query.equal("host", host),
    Query.equal("slug", slug),
    Query.limit(1),
  ])

  if (documents.length === 0) return null
  return documents[0] as unknown as LinkDoc
}

/**
 * Create a new link document.
 * Lets Appwrite generate the document ID (random UUID).
 * Throws on unique-index conflict (host+slug) — callers should catch via
 * `isConflictError()` and retry with a new slug or return 409 to the user.
 */
export async function createLink(input: CreateLinkInput): Promise<LinkDoc> {
  const doc = await db().createDocument(DB, LINKS, ID.unique(), {
    slug: input.slug,
    long_url: input.long_url,
    host: input.host ?? DEFAULT_HOST,
    owner_id: input.owner_id ?? null,
    clicks_count: 0,
    created_at: new Date().toISOString(),
    expire_at: input.expire_at ?? null,
    meta_title: input.meta_title ?? null,
    meta_domain: input.meta_domain ?? null,
    meta_favicon_url: input.meta_favicon_url ?? null,
    link_type: input.link_type ?? "normal",
    origin_id: null,
    targeting_json: input.targeting_json ?? null,
  })

  return doc as unknown as LinkDoc
}

// ---------------------------------------------------------------------------
// Click tracking
// ---------------------------------------------------------------------------

/**
 * Insert a click event into the `clicks` collection.
 * Fire-and-forget friendly — callers can `.catch(console.error)`.
 */
export async function logClick(input: LogClickInput): Promise<ClickDoc> {
  const doc = await db().createDocument(DB, CLICKS, ID.unique(), {
    link_id: input.link_id,
    owner_id: input.owner_id ?? null,
    clicked_at: new Date().toISOString(),
    device_type: input.device_type ?? null,
    country: input.country ?? null,
    referrer: input.referrer ?? null,
    user_agent: input.user_agent ?? null,
    ip_hash: input.ip_hash ?? null,
    region: input.region ?? null,
    city: input.city ?? null,
    latitude: input.latitude ?? null,
    longitude: input.longitude ?? null,
    browser: input.browser ?? null,
    os: input.os ?? null,
    device: input.device ?? null,
    utm_source: input.utm_source ?? null,
    utm_medium: input.utm_medium ?? null,
    utm_campaign: input.utm_campaign ?? null,
    language: input.language ?? null,
    timezone: input.timezone ?? null,
    bot: input.bot ?? false,
    unique_visitor: input.unique_visitor ?? false,
    qr_scan: input.qr_scan ?? false,
  })

  return doc as unknown as ClickDoc
}

/**
 * Atomically(ish) increment the `clicks_count` on a link document.
 *
 * Appwrite doesn't support atomic increments, so we read-then-write.
 * For a URL shortener the minor race-window is acceptable — click totals
 * are eventually consistent and the authoritative count can be derived
 * from the `clicks` collection if needed.
 */
export async function incrementClickCount(linkId: string): Promise<void> {
  const doc = await db().getDocument(DB, LINKS, linkId)
  const current = (doc as unknown as LinkDoc).clicks_count ?? 0

  await db().updateDocument(DB, LINKS, linkId, {
    clicks_count: current + 1,
  })
}

// ---------------------------------------------------------------------------
// Owner-scoped queries (dashboard)
// ---------------------------------------------------------------------------

export interface LinkFilterOptions {
  limit?: number
  offset?: number
  search?: string
  domain?: string
  status?: "all" | "active" | "expired" | "has_password" | "has_expiry" | "ab_test"
  sort?: "newest" | "oldest" | "clicks"
}

/**
 * Filtered, sorted, and paginated links query for the dashboard.
 */
export async function getPaginatedLinksByOwner(
  ownerId: string,
  options: LinkFilterOptions = {}
): Promise<{ links: LinkDoc[]; total: number }> {
  const {
    limit = 25,
    offset = 0,
    search = "",
    domain,
    status = "all",
    sort = "newest",
  } = options

  // Build base Appwrite query
  const queries = [Query.equal("owner_id", ownerId)]

  if (domain && domain !== "all") {
    queries.push(Query.equal("host", domain))
  }

  if (sort === "clicks") {
    queries.push(Query.orderDesc("clicks_count"))
  } else if (sort === "oldest") {
    queries.push(Query.orderAsc("created_at"))
  } else {
    queries.push(Query.orderDesc("created_at"))
  }

  // If search or complex JSON status filters are applied,
  // fetch up to 200 documents and filter in-memory for precision
  if (search || (status && status !== "all")) {
    queries.push(Query.limit(200))
    const { documents } = await db().listDocuments(DB, LINKS, queries)
    let filtered = documents as unknown as LinkDoc[]

    if (search) {
      const q = search.toLowerCase().trim()
      filtered = filtered.filter(
        (l) =>
          l.slug?.toLowerCase().includes(q) ||
          l.long_url?.toLowerCase().includes(q) ||
          l.host?.toLowerCase().includes(q) ||
          l.meta_title?.toLowerCase().includes(q)
      )
    }

    const now = new Date().toISOString()
    if (status === "active") {
      filtered = filtered.filter((l) => !l.expire_at || l.expire_at > now)
    } else if (status === "expired") {
      filtered = filtered.filter((l) => Boolean(l.expire_at && l.expire_at <= now))
    } else if (status === "has_password") {
      filtered = filtered.filter((l) => {
        try {
          const t = l.targeting_json ? JSON.parse(l.targeting_json) : null
          return Boolean(t?.password)
        } catch {
          return false
        }
      })
    } else if (status === "has_expiry") {
      filtered = filtered.filter((l) => Boolean(l.expire_at))
    } else if (status === "ab_test") {
      filtered = filtered.filter((l) => {
        try {
          const t = l.targeting_json ? JSON.parse(l.targeting_json) : null
          return Boolean(t?.ab_rules?.length)
        } catch {
          return false
        }
      })
    }

    const total = filtered.length
    const paginated = filtered.slice(offset, offset + limit)
    return { links: paginated, total }
  }

  // Standard direct database pagination
  queries.push(Query.limit(limit))
  queries.push(Query.offset(offset))

  const { documents, total } = await db().listDocuments(DB, LINKS, queries)
  return {
    links: documents as unknown as LinkDoc[],
    total,
  }
}

/**
 * Lightweight KPIs for owner (total links, total clicks, total custom domain links)
 * without fetching full click records.
 */
export async function getUserLinksStats(ownerId: string): Promise<{
  totalLinks: number
  totalClicks: number
  domainLinksCount: number
}> {
  try {
    const { documents, total } = await db().listDocuments(DB, LINKS, [
      Query.equal("owner_id", ownerId),
      Query.limit(100),
      Query.select(["clicks_count", "host"]),
    ])

    let totalClicks = 0
    let domainLinksCount = 0

    for (const doc of documents as unknown as LinkDoc[]) {
      totalClicks += doc.clicks_count || 0
      if (doc.host && doc.host !== DEFAULT_HOST) {
        domainLinksCount++
      }
    }

    return {
      totalLinks: total,
      totalClicks,
      domainLinksCount,
    }
  } catch (err) {
    console.error("Error fetching user links stats:", err)
    return {
      totalLinks: 0,
      totalClicks: 0,
      domainLinksCount: 0,
    }
  }
}

/**
 * List links owned by a specific user, paginated.
 * Results are ordered by creation date descending (newest first).
 */
export async function listLinksByOwner(
  ownerId: string,
  { limit = 25, offset = 0 }: { limit?: number; offset?: number } = {},
): Promise<{ links: LinkDoc[]; total: number }> {
  const { documents, total } = await db().listDocuments(DB, LINKS, [
    Query.equal("owner_id", ownerId),
    Query.orderDesc("created_at"),
    Query.limit(limit),
    Query.offset(offset),
  ])

  return {
    links: documents as unknown as LinkDoc[],
    total,
  }
}

/**
 * Count how many links exist on a given domain (host).
 * Used by plan-gating logic (e.g. "Free plan: max 1 link on custom domain").
 */
export async function countLinksByDomain(host: string): Promise<number> {
  const { total } = await db().listDocuments(DB, LINKS, [
    Query.equal("host", host),
    Query.limit(1), // We only need the total count, not the docs
  ])

  return total
}

/**
 * List clicks for all links owned by a user (used for global dashboard analytics).
 */
export async function listClicksByOwner(
  ownerId: string,
  limit = 5000
): Promise<ClickDoc[]> {
  const { documents } = await db().listDocuments(DB, CLICKS, [
    Query.equal("owner_id", ownerId),
    Query.orderDesc("clicked_at"),
    Query.limit(limit),
  ])
  return documents as unknown as ClickDoc[]
}

/**
 * List clicks for a specific link.
 */
export async function listClicksByLink(
  linkId: string,
  limit = 5000
): Promise<ClickDoc[]> {
  const { documents } = await db().listDocuments(DB, CLICKS, [
    Query.equal("link_id", linkId),
    Query.orderDesc("clicked_at"),
    Query.limit(limit),
  ])
  return documents as unknown as ClickDoc[]
}

/**
 * Fetch a single link document by its database ID.
 */
export async function getLinkById(
  linkId: string
): Promise<LinkDoc | null> {
  try {
    const doc = await db().getDocument(DB, LINKS, linkId)
    return doc as unknown as LinkDoc
  } catch {
    return null
  }
}

/**
 * Update a link's premium targeting JSON settings.
 */
export async function updateLinkTargeting(
  linkId: string,
  targetingJson: string | null
): Promise<LinkDoc> {
  const doc = await db().updateDocument(DB, LINKS, linkId, {
    targeting_json: targetingJson,
  })
  return doc as unknown as LinkDoc
}

/**
 * Delete a link document.
 * Verifies ownership beforehand.
 */
export async function deleteLink(linkId: string, ownerId: string): Promise<void> {
  const doc = await db().getDocument(DB, LINKS, linkId)
  if (doc.owner_id !== ownerId) {
    throw new Error("Forbidden")
  }
  await db().deleteDocument(DB, LINKS, linkId)
}

/**
 * Fetch links flagged as suspicious or matching phishing blacklists.
 * Used by the public Threat Intelligence Radar (/threats).
 */
export async function getFlaggedPhishingLinks(limit: number = 100): Promise<LinkDoc[]> {
  try {
    const { documents } = await db().listDocuments(DB, LINKS, [
      Query.orderDesc("$createdAt"),
      Query.limit(limit),
    ])

    return (documents as unknown as LinkDoc[]).filter((doc) => {
      if (doc.targeting_json) {
        try {
          const parsed = JSON.parse(doc.targeting_json)
          if (parsed.is_suspicious) return true
        } catch {}
      }
      return false
    })
  } catch (err) {
    console.error("Error fetching flagged links:", err)
    return []
  }
}
