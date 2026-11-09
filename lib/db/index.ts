import "server-only"
import pg from "pg"
const { Pool } = pg

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  "postgresql://neondb_owner:npg_nc85rtNeFCTp@ep-frosty-violet-beqq5h9u-pooler.c-9.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: pg.Pool | undefined
}

export function getPool(): pg.Pool {
  if (!globalThis.__pgPool) {
    globalThis.__pgPool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    })
  }
  return globalThis.__pgPool
}

export async function query<T extends pg.QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<pg.QueryResult<T>> {
  const pool = getPool()
  return pool.query<T>(text, params)
}

/**
 * Format a Date or date string to ISO string safely.
 */
export function toIso(val: any): string | null {
  if (!val) return null
  if (val instanceof Date) return val.toISOString()
  if (typeof val === "string") return new Date(val).toISOString()
  return String(val)
}

/**
 * Map PostgreSQL database row to Appwrite-compatible document shape
 * ($id, $createdAt, $updatedAt, id, created_at, updated_at).
 */
export function mapRow<T = any>(row: any): T {
  if (!row) return row
  const mapped: Record<string, any> = { ...row }
  mapped.$id = row.id
  mapped.$createdAt = toIso(row.created_at)
  mapped.$updatedAt = toIso(row.updated_at || row.created_at)
  if (row.created_at) mapped.created_at = toIso(row.created_at)
  if (row.updated_at) mapped.updated_at = toIso(row.updated_at)
  if (row.clicked_at) mapped.clicked_at = toIso(row.clicked_at)
  if (row.expire_at) mapped.expire_at = toIso(row.expire_at)
  if (row.expires_at) mapped.expires_at = toIso(row.expires_at)
  if (row.verified_at) mapped.verified_at = toIso(row.verified_at)
  if (row.published_at) mapped.published_at = toIso(row.published_at)
  return mapped as T
}

export function isConflictError(err: unknown): boolean {
  if (!err || typeof err !== "object") return false
  const e = err as Record<string, unknown>
  const msg = typeof e.message === "string" ? e.message.toLowerCase() : ""
  return (
    e.code === "23505" ||
    e.code === 409 ||
    e.type === "document_already_exists" ||
    msg.includes("unique constraint") ||
    msg.includes("duplicate key") ||
    msg.includes("already exists")
  )
}

