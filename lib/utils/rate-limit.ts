// Robust rate limiter with Redis support for distributed environments
// Falls back to in-memory for local development

import { redis } from '@/lib/redis'

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory store (fallback when Redis is unavailable)
const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up old entries periodically (for in-memory fallback)
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}, 60000) // Clean every minute

export interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetIn: number // seconds until reset
}

// ============================================
// BOT DETECTION
// ============================================

const SUSPICIOUS_USER_AGENTS = [
  /curl/i,
  /wget/i,
  /python-requests/i,
  /python-urllib/i,
  /axios/i,
  /postman/i,
  /insomnia/i,
  /httpie/i,
  /bot/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
]

// Known good bots we might want to allow (search engines)
const ALLOWED_BOTS = [
  /googlebot/i,
  /bingbot/i,
  /duckduckbot/i,
]

/**
 * Check if request appears to be from a bot
 */
export function isSuspiciousRequest(request: Request): { suspicious: boolean; reason?: string } {
  const userAgent = request.headers.get('user-agent') || ''
  
  // No user agent is suspicious
  if (!userAgent || userAgent.length < 10) {
    return { suspicious: true, reason: 'missing_ua' }
  }
  
  // Check for allowed bots first
  for (const pattern of ALLOWED_BOTS) {
    if (pattern.test(userAgent)) {
      return { suspicious: false }
    }
  }
  
  // Check for suspicious user agents
  for (const pattern of SUSPICIOUS_USER_AGENTS) {
    if (pattern.test(userAgent)) {
      return { suspicious: true, reason: 'bot_ua' }
    }
  }
  
  // Check for missing common headers that browsers typically send
  const acceptHeader = request.headers.get('accept')
  const acceptLanguage = request.headers.get('accept-language')
  
  if (!acceptHeader || !acceptLanguage) {
    return { suspicious: true, reason: 'missing_headers' }
  }
  
  return { suspicious: false }
}

// ============================================
// REDIS-BASED RATE LIMITING (Distributed)
// ============================================

/**
 * Redis-based rate limiting for distributed environments
 */
async function checkRateLimitRedis(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  try {
    const key = `ratelimit:${identifier}`
    const windowSeconds = Math.ceil(config.windowMs / 1000)
    
    const current = await redis.incr(key)
    
    if (current === 1) {
      await redis.expire(key, windowSeconds)
    }
    
    const ttl = await redis.ttl(key)
    const resetIn = ttl > 0 ? ttl : windowSeconds
    
    if (current > config.maxRequests) {
      return {
        success: false,
        remaining: 0,
        resetIn,
      }
    }
    
    return {
      success: true,
      remaining: Math.max(0, config.maxRequests - current),
      resetIn,
    }
  } catch (error) {
    console.error('Redis rate limit error, falling back to memory:', error)
    // Fall back to in-memory rate limiting
    return checkRateLimitMemory(identifier, config)
  }
}

/**
 * In-memory rate limiting (fallback)
 */
function checkRateLimitMemory(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const key = identifier
  
  const entry = rateLimitStore.get(key)
  
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    })
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetIn: Math.ceil(config.windowMs / 1000),
    }
  }
  
  if (entry.count >= config.maxRequests) {
    const resetIn = Math.ceil((entry.resetTime - now) / 1000)
    return {
      success: false,
      remaining: 0,
      resetIn,
    }
  }
  
  entry.count++
  rateLimitStore.set(key, entry)
  
  return {
    success: true,
    remaining: config.maxRequests - entry.count,
    resetIn: Math.ceil((entry.resetTime - now) / 1000),
  }
}

/**
 * Check if a request should be rate limited
 * Uses Redis for distributed environments, falls back to memory
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns RateLimitResult
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { windowMs: 60000, maxRequests: 1 }
): Promise<RateLimitResult> {
  // Try Redis first for distributed rate limiting
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return checkRateLimitRedis(identifier, config)
  }
  
  // Fall back to in-memory
  return checkRateLimitMemory(identifier, config)
}

/**
 * Get client IP from request headers
 * Works with Vercel, Cloudflare, and standard proxies
 */
export function getClientIP(request: Request): string {
  // Vercel
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim()
  }
  
  // Cloudflare
  const cfConnectingIP = request.headers.get("cf-connecting-ip")
  if (cfConnectingIP) {
    return cfConnectingIP
  }
  
  // Real IP header
  const realIP = request.headers.get("x-real-ip")
  if (realIP) {
    return realIP
  }
  
  // Fallback
  return "unknown"
}

/**
 * Generate a fingerprint from request headers for additional bot detection
 */
export function getRequestFingerprint(request: Request): string {
  const ip = getClientIP(request)
  const userAgent = request.headers.get("user-agent") || "unknown"
  const acceptLanguage = request.headers.get("accept-language") || "unknown"
  
  // Create a simple hash from these values
  const data = `${ip}:${userAgent}:${acceptLanguage}`
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  
  return `fp_${Math.abs(hash).toString(36)}`
}
