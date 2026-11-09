import "server-only"
import crypto from "crypto"
import { query, mapRow } from "../db"
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
  id?: string
  domain: string
  owner_id: string
  status: "unverified" | "verified" | "failed"
  verification_token: string | null
  ssl_status: "pending" | "active" | "failed"
  created_at: string | null
  brand_logo_url?: string | null
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

export function isValidDomain(domain: string): boolean {
  const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
  return domainRegex.test(domain) && domain.length <= 253
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

export async function getDomainsByOwner(ownerId: string): Promise<DomainDoc[]> {
  const res = await query(
    "SELECT * FROM domains WHERE owner_id = $1 ORDER BY created_at DESC LIMIT 25",
    [ownerId]
  )
  return res.rows.map(mapRow<DomainDoc>)
}

export async function getDomainByName(domain: string): Promise<DomainDoc | null> {
  const res = await query(
    "SELECT * FROM domains WHERE LOWER(domain) = LOWER($1) LIMIT 1",
    [domain]
  )
  if (res.rows.length === 0) return null
  return mapRow<DomainDoc>(res.rows[0])
}

export async function getDomainById(domainId: string): Promise<DomainDoc | null> {
  try {
    const res = await query(
      "SELECT * FROM domains WHERE id = $1 LIMIT 1",
      [domainId]
    )
    if (res.rows.length === 0) return null
    return mapRow<DomainDoc>(res.rows[0])
  } catch {
    return null
  }
}

export async function connectDomain(
  ownerId: string,
  domain: string
): Promise<DomainDoc> {
  const normalizedDomain = domain.toLowerCase().trim()

  if (!isValidDomain(normalizedDomain)) {
    throw new Error("Invalid domain format")
  }

  if (
    normalizedDomain === "ul0.site" ||
    normalizedDomain.endsWith(".ul0.site")
  ) {
    throw new Error("Cannot connect the platform domain")
  }

  const existing = await getDomainByName(normalizedDomain)
  if (existing) {
    throw new Error("Domain is already connected to an account")
  }

  const vercelResult = await addDomainToVercel(normalizedDomain)
  const verificationToken = vercelResult.verification?.[0]?.value ?? null

  const id = crypto.randomUUID()
  const res = await query(
    `INSERT INTO domains (
      id, domain, owner_id, status, verification_token, ssl_status, created_at, brand_logo_url
    ) VALUES ($1, $2, $3, 'unverified', $4, 'pending', NOW(), NULL)
    RETURNING *`,
    [id, normalizedDomain, ownerId, verificationToken]
  )

  return mapRow<DomainDoc>(res.rows[0])
}

export async function verifyDomain(
  domainId: string,
  ownerId: string
): Promise<{ domain: DomainDoc; status: DomainStatus }> {
  const domain = await getDomainById(domainId)
  if (!domain) throw new Error("Domain not found")
  if (domain.owner_id !== ownerId) throw new Error("Forbidden")

  const status = await checkDomainStatus(domain.domain)
  const newStatus = status.verified ? "verified" : "unverified"
  const newSslStatus = status.sslReady ? "active" : "pending"

  const res = await query(
    `UPDATE domains 
     SET status = $1, ssl_status = $2 
     WHERE id = $3 
     RETURNING *`,
    [newStatus, newSslStatus, domainId]
  )

  return {
    domain: mapRow<DomainDoc>(res.rows[0]),
    status,
  }
}

export async function removeDomain(
  domainId: string,
  ownerId: string
): Promise<void> {
  const domain = await getDomainById(domainId)
  if (!domain) throw new Error("Domain not found")
  if (domain.owner_id !== ownerId) throw new Error("Forbidden")

  await removeDomainFromVercel(domain.domain)
  await query("DELETE FROM domains WHERE id = $1", [domainId])
}

export async function countDomainLinksByOwner(ownerId: string): Promise<number> {
  const res = await query(
    "SELECT count(*) as total FROM links WHERE owner_id = $1 AND host <> 'ul0.site'",
    [ownerId]
  )
  return parseInt(res.rows[0]?.total || "0", 10)
}

export async function updateDomainBrandLogo(
  domainId: string,
  brandLogoUrl: string | null
): Promise<DomainDoc | null> {
  const res = await query(
    "UPDATE domains SET brand_logo_url = $1 WHERE id = $2 RETURNING *",
    [brandLogoUrl, domainId]
  )
  if (res.rows.length === 0) return null
  return mapRow<DomainDoc>(res.rows[0])
}
