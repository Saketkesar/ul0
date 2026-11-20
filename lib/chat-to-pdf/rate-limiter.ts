/**
 * In-memory sliding window rate limiter: 10 requests per minute per IP.
 */
interface RateLimitRecord {
  timestamps: number[]
}

const ipRecords = new Map<string, RateLimitRecord>()

const WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS = 10 // 10 requests per minute

// Periodically clean up stale records every 5 minutes
if (typeof setInterval !== "undefined") {
  const timer = setInterval(() => {
    const now = Date.now()
    for (const [ip, record] of ipRecords.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < WINDOW_MS)
      if (record.timestamps.length === 0) {
        ipRecords.delete(ip)
      }
    }
  }, 5 * 60 * 1000)
  if (timer.unref) {
    timer.unref()
  }
}

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now()
  let record = ipRecords.get(ip)
  if (!record) {
    record = { timestamps: [] }
    ipRecords.set(ip, record)
  }

  // Filter out timestamps outside current window
  record.timestamps = record.timestamps.filter((ts) => now - ts < WINDOW_MS)

  if (record.timestamps.length >= MAX_REQUESTS) {
    const oldestTimestamp = record.timestamps[0]
    const resetMs = Math.max(0, WINDOW_MS - (now - oldestTimestamp))
    return {
      allowed: false,
      remaining: 0,
      resetMs,
    }
  }

  record.timestamps.push(now)
  return {
    allowed: true,
    remaining: MAX_REQUESTS - record.timestamps.length,
    resetMs: WINDOW_MS,
  }
}
