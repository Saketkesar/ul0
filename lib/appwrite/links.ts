import "server-only"
import crypto from "crypto"
import { query, mapRow, isConflictError } from "../db"
import { DEFAULT_HOST } from "./config"

export { isConflictError }

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface LinkDoc {
  $id: string
  id?: string
  slug: string
  long_url: string
  host: string
  owner_id: string | null
  clicks_count: number
  created_at: string | null
  expire_at: string | null
  meta_title: string | null
  meta_domain: string | null
  meta_favicon_url: string | null
  link_type: string
  origin_id: string | null
  targeting_json?: string | null
}

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

export interface ClickDoc {
  $id: string
  id?: string
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

export interface LinkFilterOptions {
  limit?: number
  offset?: number
  search?: string
  domain?: string
  status?: "all" | "active" | "expired" | "has_password" | "has_expiry" | "ab_test"
  sort?: "newest" | "oldest" | "clicks"
}

// ---------------------------------------------------------------------------
// Link CRUD
// ---------------------------------------------------------------------------

export async function getLinkByHostSlug(
  host: string,
  slug: string
): Promise<LinkDoc | null> {
  const res = await query(
    "SELECT * FROM links WHERE host = $1 AND slug = $2 LIMIT 1",
    [host, slug]
  )
  if (res.rows.length === 0) return null
  return mapRow<LinkDoc>(res.rows[0])
}

export async function createLink(input: CreateLinkInput): Promise<LinkDoc> {
  const id = crypto.randomUUID()
  const host = input.host ?? DEFAULT_HOST
  const expireAt = input.expire_at ? new Date(input.expire_at) : null

  const res = await query(
    `INSERT INTO links (
      id, slug, long_url, host, owner_id, clicks_count, created_at, expire_at,
      meta_title, meta_domain, meta_favicon_url, link_type, origin_id, targeting_json
    ) VALUES ($1, $2, $3, $4, $5, 0, NOW(), $6, $7, $8, $9, $10, NULL, $11)
    RETURNING *`,
    [
      id,
      input.slug,
      input.long_url,
      host,
      input.owner_id ?? null,
      expireAt,
      input.meta_title ?? null,
      input.meta_domain ?? null,
      input.meta_favicon_url ?? null,
      input.link_type ?? "normal",
      input.targeting_json ?? null,
    ]
  )

  return mapRow<LinkDoc>(res.rows[0])
}

// ---------------------------------------------------------------------------
// Click tracking
// ---------------------------------------------------------------------------

export async function logClick(input: LogClickInput): Promise<ClickDoc> {
  const id = crypto.randomUUID()
  const res = await query(
    `INSERT INTO clicks (
      id, link_id, owner_id, clicked_at, device_type, country, referrer,
      user_agent, ip_hash, region, city, latitude, longitude, browser, os,
      device, utm_source, utm_medium, utm_campaign, language, timezone, bot,
      unique_visitor, qr_scan
    ) VALUES (
      $1, $2, $3, NOW(), $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
      $15, $16, $17, $18, $19, $20, $21, $22, $23
    ) RETURNING *`,
    [
      id,
      input.link_id,
      input.owner_id ?? null,
      input.device_type ?? null,
      input.country ?? null,
      input.referrer ?? null,
      input.user_agent ?? null,
      input.ip_hash ?? null,
      input.region ?? null,
      input.city ?? null,
      input.latitude ?? null,
      input.longitude ?? null,
      input.browser ?? null,
      input.os ?? null,
      input.device ?? null,
      input.utm_source ?? null,
      input.utm_medium ?? null,
      input.utm_campaign ?? null,
      input.language ?? null,
      input.timezone ?? null,
      Boolean(input.bot),
      Boolean(input.unique_visitor),
      Boolean(input.qr_scan),
    ]
  )

  return mapRow<ClickDoc>(res.rows[0])
}

export async function incrementClickCount(linkId: string): Promise<void> {
  await query(
    "UPDATE links SET clicks_count = clicks_count + 1 WHERE id = $1",
    [linkId]
  )
}

// ---------------------------------------------------------------------------
// Owner-scoped queries (dashboard)
// ---------------------------------------------------------------------------

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

  const conditions: string[] = ["owner_id = $1"]
  const params: any[] = [ownerId]

  if (domain && domain !== "all") {
    params.push(domain)
    conditions.push(`host = $${params.length}`)
  }

  if (search) {
    params.push(`%${search.toLowerCase().trim()}%`)
    const p = params.length
    conditions.push(
      `(LOWER(slug) LIKE $${p} OR LOWER(long_url) LIKE $${p} OR LOWER(host) LIKE $${p} OR LOWER(COALESCE(meta_title, '')) LIKE $${p})`
    )
  }

  if (status === "active") {
    conditions.push("(expire_at IS NULL OR expire_at > NOW())")
  } else if (status === "expired") {
    conditions.push("(expire_at IS NOT NULL AND expire_at <= NOW())")
  } else if (status === "has_password") {
    conditions.push("(targeting_json IS NOT NULL AND targeting_json LIKE '%\"password\":%')")
  } else if (status === "has_expiry") {
    conditions.push("(expire_at IS NOT NULL)")
  } else if (status === "ab_test") {
    conditions.push("(targeting_json IS NOT NULL AND targeting_json LIKE '%\"ab_rules\":%')")
  }

  let orderBy = "ORDER BY created_at DESC"
  if (sort === "clicks") {
    orderBy = "ORDER BY clicks_count DESC, created_at DESC"
  } else if (sort === "oldest") {
    orderBy = "ORDER BY created_at ASC"
  }

  const whereClause = `WHERE ${conditions.join(" AND ")}`
  const countRes = await query(
    `SELECT count(*) as total FROM links ${whereClause}`,
    params
  )
  const total = parseInt(countRes.rows[0]?.total || "0", 10)

  const queryParams = [...params, limit, offset]
  const selectSql = `SELECT * FROM links ${whereClause} ${orderBy} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
  const rowsRes = await query(selectSql, queryParams)

  return {
    links: rowsRes.rows.map(mapRow<LinkDoc>),
    total,
  }
}

export async function getUserLinksStats(ownerId: string): Promise<{
  totalLinks: number
  totalClicks: number
  domainLinksCount: number
}> {
  try {
    const res = await query(
      `SELECT 
        count(*)::int as total_links,
        COALESCE(SUM(clicks_count), 0)::int as total_clicks,
        count(*) FILTER (WHERE host <> $2)::int as domain_links_count
       FROM links 
       WHERE owner_id = $1`,
      [ownerId, DEFAULT_HOST]
    )

    const row = res.rows[0]
    return {
      totalLinks: row?.total_links ?? 0,
      totalClicks: row?.total_clicks ?? 0,
      domainLinksCount: row?.domain_links_count ?? 0,
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

export async function listLinksByOwner(
  ownerId: string,
  { limit = 25, offset = 0 }: { limit?: number; offset?: number } = {}
): Promise<{ links: LinkDoc[]; total: number }> {
  const countRes = await query(
    "SELECT count(*) as total FROM links WHERE owner_id = $1",
    [ownerId]
  )
  const total = parseInt(countRes.rows[0]?.total || "0", 10)

  const res = await query(
    "SELECT * FROM links WHERE owner_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3",
    [ownerId, limit, offset]
  )

  return {
    links: res.rows.map(mapRow<LinkDoc>),
    total,
  }
}

export async function countLinksByDomain(host: string): Promise<number> {
  const res = await query(
    "SELECT count(*) as total FROM links WHERE host = $1",
    [host]
  )
  return parseInt(res.rows[0]?.total || "0", 10)
}

export async function listClicksByOwner(
  ownerId: string,
  limit = 5000
): Promise<ClickDoc[]> {
  const res = await query(
    "SELECT * FROM clicks WHERE owner_id = $1 ORDER BY clicked_at DESC LIMIT $2",
    [ownerId, limit]
  )
  return res.rows.map(mapRow<ClickDoc>)
}

export async function listClicksByLink(
  linkId: string,
  limit = 5000
): Promise<ClickDoc[]> {
  const res = await query(
    "SELECT * FROM clicks WHERE link_id = $1 ORDER BY clicked_at DESC LIMIT $2",
    [linkId, limit]
  )
  return res.rows.map(mapRow<ClickDoc>)
}

export async function getLinkById(linkId: string): Promise<LinkDoc | null> {
  try {
    const res = await query(
      "SELECT * FROM links WHERE id = $1 LIMIT 1",
      [linkId]
    )
    if (res.rows.length === 0) return null
    return mapRow<LinkDoc>(res.rows[0])
  } catch {
    return null
  }
}

export async function updateLinkTargeting(
  linkId: string,
  targetingJson: string | null
): Promise<LinkDoc> {
  const res = await query(
    "UPDATE links SET targeting_json = $1 WHERE id = $2 RETURNING *",
    [targetingJson, linkId]
  )
  return mapRow<LinkDoc>(res.rows[0])
}

export async function updateLinkDestination(
  linkId: string,
  updates: {
    long_url: string
    meta_title?: string | null
    meta_domain?: string | null
    targeting_json?: string | null
  }
): Promise<LinkDoc> {
  const sets: string[] = ["long_url = $1"]
  const params: any[] = [updates.long_url]

  if (updates.meta_title !== undefined) {
    params.push(updates.meta_title)
    sets.push(`meta_title = $${params.length}`)
  }
  if (updates.meta_domain !== undefined) {
    params.push(updates.meta_domain)
    sets.push(`meta_domain = $${params.length}`)
  }
  if (updates.targeting_json !== undefined) {
    params.push(updates.targeting_json)
    sets.push(`targeting_json = $${params.length}`)
  }

  params.push(linkId)
  const res = await query(
    `UPDATE links SET ${sets.join(", ")} WHERE id = $${params.length} RETURNING *`,
    params
  )

  return mapRow<LinkDoc>(res.rows[0])
}

export async function getDynamicQrLinksByOwner(
  ownerId: string,
  isAdmin: boolean = false
): Promise<LinkDoc[]> {
  try {
    let res
    if (isAdmin) {
      res = await query(
        `SELECT * FROM links 
         WHERE link_type = 'dynamic_qr' OR targeting_json LIKE '%"is_dynamic_qr":true%' OR targeting_json LIKE '%"is_dynamic_qr": true%'
         ORDER BY created_at DESC LIMIT 100`
      )
    } else {
      res = await query(
        `SELECT * FROM links 
         WHERE owner_id = $1 AND (link_type = 'dynamic_qr' OR targeting_json LIKE '%"is_dynamic_qr":true%' OR targeting_json LIKE '%"is_dynamic_qr": true%')
         ORDER BY created_at DESC LIMIT 100`,
        [ownerId]
      )
    }

    return res.rows.map(mapRow<LinkDoc>)
  } catch (err) {
    console.error("Error fetching dynamic QR links:", err)
    return []
  }
}

export async function expireLink(linkId: string): Promise<void> {
  await query("UPDATE links SET expire_at = NOW() WHERE id = $1", [linkId])
}

export async function deleteLink(linkId: string, ownerId: string): Promise<void> {
  const check = await query("SELECT owner_id FROM links WHERE id = $1", [linkId])
  if (check.rows.length === 0 || check.rows[0].owner_id !== ownerId) {
    throw new Error("Forbidden")
  }
  await query("DELETE FROM clicks WHERE link_id = $1", [linkId])
  await query("DELETE FROM links WHERE id = $1", [linkId])
}

export async function getFlaggedPhishingLinks(limit: number = 100): Promise<LinkDoc[]> {
  try {
    const res = await query(
      `SELECT * FROM links 
       WHERE targeting_json LIKE '%"is_suspicious":true%' OR targeting_json LIKE '%"is_suspicious": true%'
       ORDER BY created_at DESC LIMIT $1`,
      [limit]
    )
    return res.rows.map(mapRow<LinkDoc>)
  } catch (err) {
    console.error("Error fetching flagged links:", err)
    return []
  }
}
