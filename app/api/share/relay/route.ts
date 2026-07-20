import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const RELAY_TTL = 60 * 20 // 20 minutes

function relayMetaKey(code: string) {
  return `share:relay:meta:${code.toUpperCase()}`
}
function relayChunksKey(code: string) {
  return `share:relay:chunks:${code.toUpperCase()}`
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { action, code, header, chunk, isLast, fromIndex } = body

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Missing room code" }, { status: 400 })
    }

    const cleanCode = code.trim().toUpperCase()
    const metaKey = relayMetaKey(cleanCode)
    const chunksKey = relayChunksKey(cleanCode)

    // ─── 1. INIT RELAY SESSION ─────────────────────────────────────────────
    if (action === "init_relay") {
      const meta = {
        code: cleanCode,
        createdAt: Date.now(),
        header,
        totalReceivedBytes: 0,
        isComplete: false,
      }
      await redis.set(metaKey, JSON.stringify(meta), { ex: RELAY_TTL })
      // Clear any old chunks
      await redis.del(chunksKey)
      return NextResponse.json({ success: true })
    }

    // ─── 2. UPLOAD CHUNK (Base64 JSON) ─────────────────────────────────────
    if (action === "upload_chunk") {
      // Auto-init if needed
      let rawMeta = await redis.get<string>(metaKey)
      if (!rawMeta) {
        const meta = {
          code: cleanCode,
          createdAt: Date.now(),
          header,
          totalReceivedBytes: 0,
          isComplete: false,
        }
        await redis.set(metaKey, JSON.stringify(meta), { ex: RELAY_TTL })
        rawMeta = JSON.stringify(meta)
      }

      const meta = typeof rawMeta === "string" ? JSON.parse(rawMeta) : rawMeta as any

      if (chunk) {
        // Push base64 chunk to Redis list
        await redis.rpush(chunksKey, chunk)
        await redis.expire(chunksKey, RELAY_TTL)

        // Compute byte size from base64 length
        const byteLen = Math.floor((chunk.length * 3) / 4)
        meta.totalReceivedBytes = (meta.totalReceivedBytes || 0) + byteLen
      }

      if (isLast || (meta.header && meta.totalReceivedBytes >= meta.header.size)) {
        meta.isComplete = true
      }

      await redis.set(metaKey, JSON.stringify(meta), { ex: RELAY_TTL })

      return NextResponse.json({
        success: true,
        totalReceivedBytes: meta.totalReceivedBytes,
      })
    }

    // ─── 3. GET STATUS ─────────────────────────────────────────────────────
    if (action === "get_status") {
      const rawMeta = await redis.get<string>(metaKey)
      if (!rawMeta) return NextResponse.json({ found: false })
      const meta = typeof rawMeta === "string" ? JSON.parse(rawMeta) : rawMeta as any
      const chunkCount = await redis.llen(chunksKey)
      return NextResponse.json({
        found: true,
        header: meta.header,
        totalReceivedBytes: meta.totalReceivedBytes,
        isComplete: meta.isComplete,
        chunkCount,
      })
    }

    // ─── 4. GET CHUNKS (Receiver polling) ──────────────────────────────────
    if (action === "get_chunks") {
      const rawMeta = await redis.get<string>(metaKey)
      if (!rawMeta) return NextResponse.json({ found: false })
      const meta = typeof rawMeta === "string" ? JSON.parse(rawMeta) : rawMeta as any

      const startIndex = typeof fromIndex === "number" ? fromIndex : 0
      const totalLen = await redis.llen(chunksKey)

      if (startIndex >= totalLen) {
        return NextResponse.json({
          found: true,
          header: meta.header,
          chunks: [],
          nextIndex: startIndex,
          isComplete: meta.isComplete,
        })
      }

      // Fetch up to 20 chunks at a time
      const endIndex = Math.min(startIndex + 19, totalLen - 1)
      const chunks = await redis.lrange(chunksKey, startIndex, endIndex)

      return NextResponse.json({
        found: true,
        header: meta.header,
        chunks,
        nextIndex: endIndex + 1,
        isComplete: meta.isComplete,
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("Relay API error:", error)
    return NextResponse.json({ error: "Server relay error" }, { status: 500 })
  }
}
