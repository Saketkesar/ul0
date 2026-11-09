import "server-only"
import crypto from "crypto"
import { query, mapRow } from "../db"

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

export async function getAccountByClerkId(
  clerkUserId: string
): Promise<AccountDoc | null> {
  const res = await query(
    "SELECT * FROM accounts WHERE clerk_user_id = $1 LIMIT 1",
    [clerkUserId]
  )
  if (res.rows.length === 0) return null
  return mapRow<AccountDoc>(res.rows[0])
}

export async function upsertAccount(
  clerkUserId: string,
  email: string | null,
  plan: string = "free_user"
): Promise<AccountDoc> {
  const existing = await getAccountByClerkId(clerkUserId)
  if (existing) {
    return existing
  }

  const id = crypto.randomUUID()
  const res = await query(
    `INSERT INTO accounts (id, clerk_user_id, email, plan, billing_status, stripe_customer_id, stripe_subscription_id, created_at, api_key)
     VALUES ($1, $2, $3, $4, 'active', NULL, NULL, NOW(), NULL)
     ON CONFLICT (clerk_user_id) DO UPDATE SET email = EXCLUDED.email
     RETURNING *`,
    [id, clerkUserId, email ?? null, plan]
  )

  return mapRow<AccountDoc>(res.rows[0])
}

export async function updateAccountPlan(
  clerkUserId: string,
  plan: string,
  billingStatus: string
): Promise<AccountDoc | null> {
  const res = await query(
    `UPDATE accounts 
     SET plan = $1, billing_status = $2 
     WHERE clerk_user_id = $3 
     RETURNING *`,
    [plan, billingStatus, clerkUserId]
  )

  if (res.rows.length === 0) return null
  return mapRow<AccountDoc>(res.rows[0])
}

export async function getAccountByApiKey(apiKey: string): Promise<AccountDoc | null> {
  const res = await query(
    "SELECT * FROM accounts WHERE api_key = $1 LIMIT 1",
    [apiKey]
  )
  if (res.rows.length === 0) return null
  return mapRow<AccountDoc>(res.rows[0])
}

export async function updateAccountApiKey(
  clerkUserId: string,
  apiKey: string | null
): Promise<AccountDoc | null> {
  const res = await query(
    "UPDATE accounts SET api_key = $1 WHERE clerk_user_id = $2 RETURNING *",
    [apiKey, clerkUserId]
  )
  if (res.rows.length === 0) return null
  return mapRow<AccountDoc>(res.rows[0])
}
