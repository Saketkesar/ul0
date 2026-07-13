import { Redis } from "@upstash/redis"

// Initialize Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Cache TTL in seconds (24 hours)
const CACHE_TTL = 60 * 60 * 24

// URL Cache functions — keyed by host:slug for multi-tenant support.
export async function getCachedUrl(
  slug: string,
  host: string = "ul0.site",
): Promise<string | null> {
  try {
    const cached = await redis.get<string>(`url:${host}:${slug}`)
    return cached
  } catch (error) {
    console.error("Redis get error:", error)
    return null
  }
}

export async function setCachedUrl(
  slug: string,
  originalUrl: string,
  host: string = "ul0.site",
): Promise<void> {
  try {
    await redis.set(`url:${host}:${slug}`, originalUrl, { ex: CACHE_TTL })
  } catch (error) {
    console.error("Redis set error:", error)
  }
}

// Rate limiting functions
export async function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowSeconds: number = 60
): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  try {
    const key = `ratelimit:${identifier}`
    const current = await redis.incr(key)
    
    if (current === 1) {
      await redis.expire(key, windowSeconds)
    }
    
    const ttl = await redis.ttl(key)
    
    return {
      allowed: current <= limit,
      remaining: Math.max(0, limit - current),
      resetIn: ttl > 0 ? ttl : windowSeconds,
    }
  } catch (error) {
    console.error("Redis rate limit error:", error)
    // Fail open - allow request if Redis is down
    return { allowed: true, remaining: limit, resetIn: windowSeconds }
  }
}

// Generic cache functions
export async function getCache<T>(key: string): Promise<T | null> {
  try {
    return await redis.get<T>(key)
  } catch (error) {
    console.error("Redis cache get error:", error)
    return null
  }
}

export async function setCache<T>(
  key: string,
  value: T,
  ttlSeconds: number = CACHE_TTL
): Promise<void> {
  try {
    await redis.set(key, value, { ex: ttlSeconds })
  } catch (error) {
    console.error("Redis cache set error:", error)
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    await redis.del(key)
  } catch (error) {
    console.error("Redis cache delete error:", error)
  }
}
