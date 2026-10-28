import { redis } from "@/lib/redis"
import { getAccountByClerkId, updateAccountApiKey, getAccountByApiKey, type AccountDoc } from "@/lib/appwrite/accounts"
import crypto from "crypto"

export interface ApiKeyItem {
  id: string
  name: string
  prefix: string
  created_at: string
  last_used_at: string | null
}

export interface CreatedApiKey extends ApiKeyItem {
  secretKey: string
}

function generateSecretKey(): string {
  const random = crypto.randomBytes(24).toString("hex")
  return `ul0_live_${random}`
}

function makePrefix(secret: string): string {
  return `${secret.slice(0, 13)}••••••••${secret.slice(-4)}`
}

/**
 * List API keys for a user.
 * Combines keys stored in Redis list with the fallback single key on the account document.
 */
export async function listUserApiKeys(userId: string): Promise<ApiKeyItem[]> {
  try {
    const redisKeys = await redis.get<ApiKeyItem[]>(`user_api_keys:${userId}`)
    if (redisKeys && Array.isArray(redisKeys) && redisKeys.length > 0) {
      return redisKeys
    }
  } catch (err) {
    console.error("Error reading API keys from Redis:", err)
  }

  // Fallback: check account doc in Appwrite
  try {
    const account = await getAccountByClerkId(userId)
    if (account?.api_key) {
      const fallbackKey: ApiKeyItem = {
        id: "key_default",
        name: "Default API Key",
        prefix: makePrefix(account.api_key),
        created_at: account.created_at || new Date().toISOString(),
        last_used_at: null,
      }
      return [fallbackKey]
    }
  } catch (err) {
    console.error("Error checking account doc for API keys:", err)
  }

  return []
}

/**
 * Create a new API key for a user.
 * Returns the secret key once.
 */
export async function createUserApiKey(
  userId: string,
  name: string = "Default API Key"
): Promise<CreatedApiKey> {
  const secret = generateSecretKey()
  const keyId = `key_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`
  const now = new Date().toISOString()
  const prefix = makePrefix(secret)

  const newKey: ApiKeyItem = {
    id: keyId,
    name: name.trim() || "API Key",
    prefix,
    created_at: now,
    last_used_at: null,
  }

  // Get existing keys
  let currentKeys: ApiKeyItem[] = []
  try {
    const existing = await redis.get<ApiKeyItem[]>(`user_api_keys:${userId}`)
    if (Array.isArray(existing)) {
      currentKeys = existing
    }
  } catch {}

  const updatedKeys = [newKey, ...currentKeys]

  // Save to Redis
  try {
    await Promise.all([
      redis.set(`user_api_keys:${userId}`, JSON.stringify(updatedKeys)),
      redis.set(`api_key_lookup:${secret}`, JSON.stringify({ userId, keyId })),
      updateAccountApiKey(userId, secret).catch(() => null),
    ])
  } catch (err) {
    console.error("Error storing API key in Redis:", err)
    // Always persist to Appwrite account doc as primary backup
    await updateAccountApiKey(userId, secret)
  }

  return {
    ...newKey,
    secretKey: secret,
  }
}

/**
 * Revoke an API key by key ID.
 */
export async function revokeUserApiKey(userId: string, keyId: string): Promise<boolean> {
  try {
    const existing = await redis.get<ApiKeyItem[]>(`user_api_keys:${userId}`)
    if (Array.isArray(existing)) {
      const filtered = existing.filter((k) => k.id !== keyId)
      await redis.set(`user_api_keys:${userId}`, JSON.stringify(filtered))
    }
    // Also remove from Appwrite if it was the primary key
    await updateAccountApiKey(userId, null).catch(() => null)
    return true
  } catch (err) {
    console.error("Error revoking API key:", err)
    await updateAccountApiKey(userId, null).catch(() => null)
    return true
  }
}

/**
 * Verify an incoming API key and return user/account info.
 */
export async function verifyApiKey(secret: string): Promise<{ userId: string; account: AccountDoc | null } | null> {
  if (!secret) return null

  // Fast path: Redis lookup
  try {
    const cached = await redis.get<{ userId: string; keyId: string }>(`api_key_lookup:${secret}`)
    if (cached?.userId) {
      // Touch last used asynchronously
      touchKeyLastUsed(cached.userId, cached.keyId).catch(() => null)
      const account = await getAccountByClerkId(cached.userId).catch(() => null)
      return { userId: cached.userId, account }
    }
  } catch {}

  // Fallback: Appwrite lookup
  try {
    const account = await getAccountByApiKey(secret)
    if (account) {
      return { userId: account.clerk_user_id, account }
    }
  } catch {}

  return null
}

async function touchKeyLastUsed(userId: string, keyId: string): Promise<void> {
  try {
    const keys = await redis.get<ApiKeyItem[]>(`user_api_keys:${userId}`)
    if (Array.isArray(keys)) {
      const updated = keys.map((k) =>
        k.id === keyId ? { ...k, last_used_at: new Date().toISOString() } : k
      )
      await redis.set(`user_api_keys:${userId}`, JSON.stringify(updated))
    }
  } catch {}
}

