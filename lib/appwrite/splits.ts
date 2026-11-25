import "server-only"
import crypto from "crypto"
import { query, mapRow, isConflictError } from "../db"

export { isConflictError }

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SettlementStatus = "unpaid" | "claimed" | "partial" | "confirmed"

export interface SplitSettlement {
  from: string
  to: string
  amount: number
  status: SettlementStatus
  paid_amount?: number
  claimed_at?: string | null
  confirmed_at?: string | null
  paid_for_by?: string | null
  utr_last4?: string | null
  note?: string | null
  // Legacy compat
  paid?: boolean
  paid_at?: string | null
  verified?: boolean
  verified_at?: string | null
}

export interface SplitSessionDoc {
  $id: string
  id?: string
  slug: string
  title: string
  members_json: string
  expenses_json: string
  settlements_json: string | null
  total_amount: number
  expires_at: string | null
  created_at: string | null
  owner_user_id: string | null
  kind: string
  locale: string
  currency: string
  pay_by: string | null
  collector_token_hash: string | null
  last_activity_at: string | null
  charges: string | null
  items_json: string | null
  items?: string | null
  status: string
  group_id: string | null
  banner_url?: string | null
  icon_url?: string | null
}

export interface SplitSession {
  $id: string
  id?: string
  slug: string
  title: string
  members: unknown[]
  expenses: unknown[]
  settlements: SplitSettlement[]
  total_amount: number
  expires_at: string | null
  created_at: string | null
  owner_user_id: string | null
  kind: string
  locale: string
  currency: string
  pay_by: string | null
  collector_token_hash: string | null
  last_activity_at: string | null
  charges: Record<string, unknown>
  items: unknown[]
  status: string
  group_id: string | null
  banner_url?: string | null
  icon_url?: string | null
}

export interface CreateSplitSessionInput {
  slug: string
  title: string
  members: unknown[]
  expenses: unknown[]
  settlements: unknown[]
  total_amount: number
  expires_at: string
  owner_user_id?: string
  kind?: string
  locale?: string
  currency?: string
  pay_by?: string | null
  collector_token_hash?: string | null
  charges?: Record<string, unknown>
  items?: unknown[]
  banner_url?: string | null
  icon_url?: string | null
  group_id?: string | null
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function safeJsonParse(val: unknown, fallback: unknown = []): unknown {
  if (val === null || val === undefined) return fallback
  if (typeof val === "object") return val // already parsed (JSONB)
  if (typeof val === "string") {
    try {
      return JSON.parse(val)
    } catch {
      return fallback
    }
  }
  return fallback
}

/** Migrate legacy settlement format (paid/verified booleans) to v2 status */
function migrateSettlement(s: any): SplitSettlement {
  if (s.status && ["unpaid", "claimed", "partial", "confirmed"].includes(s.status)) {
    return s as SplitSettlement
  }
  // Legacy format
  let status: SettlementStatus = "unpaid"
  if (s.verified) {
    status = "confirmed"
  } else if (s.paid) {
    status = "claimed"
  }
  return {
    from: s.from,
    to: s.to,
    amount: s.amount,
    status,
    paid_amount: s.amount,
    claimed_at: s.paid_at || null,
    confirmed_at: s.verified_at || null,
    // Keep legacy fields for backward compat on old clients
    paid: s.paid,
    paid_at: s.paid_at,
    verified: s.verified,
    verified_at: s.verified_at,
  }
}

function inflate(doc: SplitSessionDoc): SplitSession {
  const rawSettlements = safeJsonParse(doc.settlements_json, []) as any[]
  return {
    $id: doc.$id,
    id: doc.id || doc.$id,
    slug: doc.slug,
    title: doc.title,
    members: safeJsonParse(doc.members_json, []) as unknown[],
    expenses: safeJsonParse(doc.expenses_json, []) as unknown[],
    settlements: rawSettlements.map(migrateSettlement),
    total_amount: Number(doc.total_amount || 0),
    expires_at: doc.expires_at,
    created_at: doc.created_at,
    owner_user_id: doc.owner_user_id || null,
    kind: doc.kind || "bill",
    locale: doc.locale || "en",
    currency: doc.currency || "INR",
    pay_by: doc.pay_by || null,
    collector_token_hash: doc.collector_token_hash || null,
    last_activity_at: doc.last_activity_at || null,
    charges: safeJsonParse((doc as any).charges, {}) as Record<string, unknown>,
    items: safeJsonParse((doc as any).items || doc.items_json, []) as unknown[],
    status: doc.status || "active",
    group_id: doc.group_id || null,
    banner_url: doc.banner_url || null,
    icon_url: doc.icon_url || null,
  }
}

// ---------------------------------------------------------------------------
// Security helpers
// ---------------------------------------------------------------------------

/** Generate a random collector token (returned once to the creator) */
export function generateCollectorToken(): string {
  return crypto.randomBytes(32).toString("base64url")
}

/** Hash a collector token for safe storage */
export function hashCollectorToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex")
}

/** Verify a collector token against its stored hash */
export function verifyCollectorToken(token: string, hash: string): boolean {
  const computed = hashCollectorToken(token)
  return crypto.timingSafeEqual(Buffer.from(computed, "hex"), Buffer.from(hash, "hex"))
}

/** Mask a UPI ID for public display: 'rahul@oksbi' → 'ra****@oksbi' */
export function maskUpiId(upiId: string): string {
  if (!upiId || !upiId.includes("@")) return ""
  const [local, provider] = upiId.split("@")
  if (local.length <= 2) return `${local[0]}****@${provider}`
  return `${local.slice(0, 2)}****@${provider}`
}

/** Mask member data for public responses (hide full UPI IDs, emails, Telegram handles) */
export function maskMembersForPublic(members: any[]): any[] {
  return members.map((m) => ({
    ...m,
    upiId: m.upiId ? maskUpiId(m.upiId) : "",
    paymentId: m.paymentId ? maskUpiId(m.paymentId) : "",
    email: m.email ? maskUpiId(m.email) : undefined,
    telegram: undefined,
    _hasPaymentId: Boolean(m.paymentId || m.upiId),
    _hasEmail: Boolean(m.email),
    _hasTelegram: Boolean(m.telegram),
  }))
}

/** Create a public-safe version of a session (no secrets, masked UPI) */
export function toPublicSession(session: SplitSession): Omit<SplitSession, "collector_token_hash"> & { collector_token_hash?: undefined } {
  return {
    ...session,
    collector_token_hash: undefined,
    members: maskMembersForPublic(session.members as any[]),
  }
}

// ---------------------------------------------------------------------------
// CRUD
// ---------------------------------------------------------------------------

export async function getSplitSessionBySlug(
  slug: string
): Promise<SplitSession | null> {
  const res = await query(
    "SELECT * FROM split_sessions WHERE slug = $1 LIMIT 1",
    [slug]
  )
  if (res.rows.length === 0) return null
  return inflate(mapRow<SplitSessionDoc>(res.rows[0]))
}

export async function createSplitSession(
  input: CreateSplitSessionInput
): Promise<SplitSession> {
  const id = crypto.randomUUID()
  const expiresAt = input.expires_at ? new Date(input.expires_at) : null

  const res = await query(
    `INSERT INTO split_sessions (
      id, slug, title, members_json, expenses_json, settlements_json,
      total_amount, expires_at, created_at,
      owner_user_id, kind, locale, currency, pay_by,
      collector_token_hash, charges, items, status,
      group_id, banner_url, icon_url
    ) VALUES (
      $1, $2, $3, $4, $5, $6,
      $7, $8, NOW(),
      $9, $10, $11, $12, $13,
      $14, $15, $16, 'active',
      $17, $18, $19
    )
    RETURNING *`,
    [
      id,
      input.slug,
      input.title,
      JSON.stringify(input.members || []),
      JSON.stringify(input.expenses || []),
      JSON.stringify(input.settlements || []),
      input.total_amount || 0,
      expiresAt,
      input.owner_user_id || null,
      input.kind || "bill",
      input.locale || "en",
      input.currency || "INR",
      input.pay_by ? new Date(input.pay_by) : null,
      input.collector_token_hash || null,
      JSON.stringify(input.charges || {}),
      JSON.stringify(input.items || []),
      input.group_id || null,
      input.banner_url || null,
      input.icon_url || null,
    ]
  )

  return inflate(mapRow<SplitSessionDoc>(res.rows[0]))
}

export async function updateSplitSettlements(
  slug: string,
  settlements: unknown[]
): Promise<SplitSession | null> {
  const res = await query(
    `UPDATE split_sessions
     SET settlements_json = $1, last_activity_at = NOW()
     WHERE slug = $2
     RETURNING *`,
    [JSON.stringify(settlements || []), slug]
  )

  if (res.rows.length === 0) return null
  return inflate(mapRow<SplitSessionDoc>(res.rows[0]))
}

/** Claim a settlement (friend marks "I paid") */
export async function claimSettlement(
  slug: string,
  settlementIndex: number,
  opts?: { paidAmount?: number; utrLast4?: string }
): Promise<SplitSession | null> {
  const session = await getSplitSessionBySlug(slug)
  if (!session) return null

  const settlements = [...session.settlements]
  if (settlementIndex < 0 || settlementIndex >= settlements.length) return null

  const s = settlements[settlementIndex]
  if (s.status === "confirmed") return null // Already confirmed, no changes

  const paidAmount = opts?.paidAmount ?? s.amount
  const isPartial = paidAmount < s.amount

  settlements[settlementIndex] = {
    ...s,
    status: isPartial ? "partial" : "claimed",
    paid_amount: paidAmount,
    claimed_at: new Date().toISOString(),
    utr_last4: opts?.utrLast4 || null,
    // Legacy compat
    paid: true,
    paid_at: new Date().toISOString(),
  }

  return updateSplitSettlements(slug, settlements)
}

/** Confirm a settlement (owner verifies payment received) */
export async function confirmSettlement(
  slug: string,
  settlementIndex: number,
  confirmed: boolean
): Promise<SplitSession | null> {
  const session = await getSplitSessionBySlug(slug)
  if (!session) return null

  const settlements = [...session.settlements]
  if (settlementIndex < 0 || settlementIndex >= settlements.length) return null

  const s = settlements[settlementIndex]

  if (confirmed) {
    settlements[settlementIndex] = {
      ...s,
      status: "confirmed",
      confirmed_at: new Date().toISOString(),
      // Legacy compat
      verified: true,
      verified_at: new Date().toISOString(),
    }
  } else {
    // Reject: back to unpaid
    settlements[settlementIndex] = {
      ...s,
      status: "unpaid",
      claimed_at: null,
      confirmed_at: null,
      paid_amount: undefined,
      utr_last4: null,
      // Legacy compat
      paid: false,
      paid_at: null,
      verified: false,
      verified_at: null,
    }
  }

  return updateSplitSettlements(slug, settlements)
}

/** Extend the expiry of a split session */
export async function extendSplitExpiry(
  slug: string,
  days: number
): Promise<SplitSession | null> {
  const res = await query(
    `UPDATE split_sessions
     SET expires_at = NOW() + ($1 || ' days')::interval, last_activity_at = NOW()
     WHERE slug = $2 AND status = 'active'
     RETURNING *`,
    [days.toString(), slug]
  )
  if (res.rows.length === 0) return null
  return inflate(mapRow<SplitSessionDoc>(res.rows[0]))
}

/** Soft-delete a split session */
export async function deleteSplitSession(slug: string): Promise<boolean> {
  const res = await query(
    `UPDATE split_sessions
     SET status = 'deleted', last_activity_at = NOW()
     WHERE slug = $1
     RETURNING id`,
    [slug]
  )
  return res.rows.length > 0
}

/** Get all split sessions owned by a user */
export async function getSplitSessionsByOwner(
  userId: string,
  limit = 50
): Promise<SplitSession[]> {
  const res = await query(
    `SELECT * FROM split_sessions
     WHERE owner_user_id = $1 AND status != 'deleted'
     ORDER BY created_at DESC
     LIMIT $2`,
    [userId, limit]
  )
  return res.rows.map((r: any) => inflate(mapRow<SplitSessionDoc>(r)))
}

/** Update email and/or telegram contact on a specific member inside a split session */
export async function updateSplitMemberContact(
  slug: string,
  memberId: string,
  contact: { email?: string | null; telegram?: string | null }
): Promise<SplitSession | null> {
  const session = await getSplitSessionBySlug(slug)
  if (!session) return null

  let found = false
  const updatedMembers = (session.members as any[]).map((m) => {
    if (m.id === memberId || (m.name && m.name.toLowerCase() === memberId.toLowerCase())) {
      found = true
      return {
        ...m,
        ...(contact.email !== undefined ? { email: contact.email || undefined } : {}),
        ...(contact.telegram !== undefined ? { telegram: contact.telegram || undefined } : {}),
      }
    }
    return m
  })

  if (!found) return null

  const res = await query(
    `UPDATE split_sessions
     SET members_json = $1, last_activity_at = NOW()
     WHERE slug = $2
     RETURNING *`,
    [JSON.stringify(updatedMembers), slug]
  )
  if (res.rows.length === 0) return null
  return inflate(mapRow<SplitSessionDoc>(res.rows[0]))
}
