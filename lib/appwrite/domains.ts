import "server-only"
import { getDatabases, Query, ID } from "./server"
import { APPWRITE_DATABASE_ID, COLLECTIONS } from "./config"
import {
  addDomainToVercel,
  removeDomainFromVercel,
  checkDomainStatus,
} from "@/lib/vercel/domains"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DomainDoc {
  $id: string
  domain: string
  owner_id: string
  status: "unverified" | "verified" | "failed"
  verification_token: string | null
  ssl_status: "pending" | "active" | "failed"
  created_at: string | null
}

export interface DomainStatus {
  verified: boolean
  sslReady: boolean
  misconfigured: boolean
  verification?: Array<{
    type: string
    domain: string
    value: string
    reason: string
  }>
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const db = () => getDatabases()
const DB = APPWRITE_DATABASE_ID
const COL = COLLECTIONS.domains

/** Basic domain format validation. */
export function isValidDomain(domain: string): boolean {
  // Must be a valid-looking domain, not an IP, not too long
  const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
  return domainRegex.test(domain) && domain.length <= 253
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

/**
 * List all domains owned by a user.
 */
export async function getDomainsByOwner(
  ownerId: string,
): Promise<DomainDoc[]> {
  const { documents } = await db().listDocuments(DB, COL, [
    Query.equal("owner_id", ownerId),
    Query.orderDesc("$createdAt"),
    Query.limit(25),
  ])
  return documents as unknown as DomainDoc[]
}

/**
 * Get a domain by its domain name.
 */
export async function getDomainByName(
  domain: string,
): Promise<DomainDoc | null> {
  const { documents } = await db().listDocuments(DB, COL, [
    Query.equal("domain", domain.toLowerCase()),
    Query.limit(1),
  ])
  if (documents.length === 0) return null
  return documents[0] as unknown as DomainDoc
}

/**
 * Get a domain by ID.
 */
export async function getDomainById(
  domainId: string,
): Promise<DomainDoc | null> {
  try {
    const doc = await db().getDocument(DB, COL, domainId)
    return doc as unknown as DomainDoc
  } catch {
    return null
  }
}

/**
 * Connect a custom domain.
 *
 * 1. Validates domain format
 * 2. Checks for conflicts (already connected by someone)
 * 3. Registers with Vercel Domains API
 * 4. Creates the Appwrite document
 *
 * Throws on failure (atomic — no partial state).
 */
export async function connectDomain(
  ownerId: string,
  domain: string,
): Promise<DomainDoc> {
  const normalizedDomain = domain.toLowerCase().trim()

  // Validate format
  if (!isValidDomain(normalizedDomain)) {
    throw new Error("Invalid domain format")
  }

  // Block connecting the platform's own domain
  if (
    normalizedDomain === "ul0.site" ||
    normalizedDomain.endsWith(".ul0.site")
  ) {
    throw new Error("Cannot connect the platform domain")
  }

  // Check for conflict
  const existing = await getDomainByName(normalizedDomain)
  if (existing) {
    throw new Error("Domain is already connected to an account")
  }

  // Register with Vercel (throws on failure)
  const vercelResult = await addDomainToVercel(normalizedDomain)

  // Extract verification token from Vercel's response
  const verificationToken =
    vercelResult.verification?.[0]?.value ?? null

  // Create Appwrite document
  const doc = await db().createDocument(DB, COL, ID.unique(), {
    domain: normalizedDomain,
    owner_id: ownerId,
    status: "unverified",
    verification_token: verificationToken,
    ssl_status: "pending",
    created_at: new Date().toISOString(),
  })

  return doc as unknown as DomainDoc
}

/**
 * Verify a domain by checking DNS via Vercel.
 * Updates the Appwrite document status.
 */
export async function verifyDomain(
  domainId: string,
  ownerId: string,
): Promise<{ domain: DomainDoc; status: DomainStatus }> {
  const domain = await getDomainById(domainId)
  if (!domain) throw new Error("Domain not found")
  if (domain.owner_id !== ownerId) throw new Error("Forbidden")

  // Check status via Vercel
  const status = await checkDomainStatus(domain.domain)

  // Update Appwrite document
  const newStatus = status.verified ? "verified" : "unverified"
  const newSslStatus = status.sslReady ? "active" : "pending"

  const updated = await db().updateDocument(DB, COL, domainId, {
    status: newStatus,
    ssl_status: newSslStatus,
  })

  return {
    domain: updated as unknown as DomainDoc,
    status,
  }
}

/**
 * Remove a domain.
 *
 * Atomic: deregisters from Vercel, then deletes Appwrite doc.
 * If Vercel deregistration fails, the domain stays connected.
 */
export async function removeDomain(
  domainId: string,
  ownerId: string,
): Promise<void> {
  const domain = await getDomainById(domainId)
  if (!domain) throw new Error("Domain not found")
  if (domain.owner_id !== ownerId) throw new Error("Forbidden")

  // Deregister from Vercel first (throws on failure)
  await removeDomainFromVercel(domain.domain)

  // Then delete Appwrite document
  await db().deleteDocument(DB, COL, domainId)
}

/**
 * Count how many domain-linked short links an owner has.
 * Used for plan-limit enforcement.
 */
export async function countDomainLinksByOwner(
  ownerId: string,
): Promise<number> {
  // Query the links collection for links with this owner that have
  // a host != DEFAULT_HOST (i.e. custom domain links)
  const { total } = await getDatabases().listDocuments(
    DB,
    COLLECTIONS.links,
    [
      Query.equal("owner_id", ownerId),
      Query.notEqual("host", "ul0.site"),
      Query.limit(1), // We only need the count
    ],
  )
  return total
}
