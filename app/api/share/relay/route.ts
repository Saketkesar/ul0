import { NextResponse } from "next/server"

// In-memory ephemeral file chunk relay buffer for fallback transfers
interface RelayBuffer {
  code: string
  createdAt: number
  header?: { name: string; size: number; mime: string }
  chunks: ArrayBuffer[]
  totalReceivedBytes: number
  isComplete: boolean
}

const relayMap = new Map<string, RelayBuffer>()

// Clean up old relay sessions older than 30 minutes
function cleanupOldRelays() {
  const now = Date.now()
  for (const [code, relay] of relayMap.entries()) {
    if (now - relay.createdAt > 30 * 60 * 1000) {
      relayMap.delete(code)
    }
  }
}

export async function POST(req: Request) {
  try {
    cleanupOldRelays()

    const body = await req.json()
    const { action, code, header, chunk, isLast, fromIndex } = body

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Missing room code" }, { status: 400 })
    }

    const cleanCode = code.trim().toUpperCase()

    // 1. Initialize Relay Session
    if (action === "init_relay") {
      relayMap.set(cleanCode, {
        code: cleanCode,
        createdAt: Date.now(),
        header,
        chunks: [],
        totalReceivedBytes: 0,
        isComplete: false,
      })
      return NextResponse.json({ success: true })
    }

    const relay = relayMap.get(cleanCode)

    // 2. Upload Chunk (Base64 JSON format - 100% Vercel & mobile compatible)
    if (action === "upload_chunk") {
      if (!relay) {
        // Auto-create relay if missing
        relayMap.set(cleanCode, {
          code: cleanCode,
          createdAt: Date.now(),
          header,
          chunks: [],
          totalReceivedBytes: 0,
          isComplete: false,
        })
      }
      const activeRelay = relayMap.get(cleanCode)!

      if (chunk) {
        const buffer = Buffer.from(chunk, "base64")
        const arrayBuf = buffer.buffer.slice(
          buffer.byteOffset,
          buffer.byteOffset + buffer.byteLength
        ) as ArrayBuffer
        activeRelay.chunks.push(arrayBuf)
        activeRelay.totalReceivedBytes += arrayBuf.byteLength
      }

      if (isLast || (activeRelay.header && activeRelay.totalReceivedBytes >= activeRelay.header.size)) {
        activeRelay.isComplete = true
      }

      return NextResponse.json({
        success: true,
        totalReceivedBytes: activeRelay.totalReceivedBytes,
      })
    }

    // 3. Get Status
    if (action === "get_status") {
      if (!relay) return NextResponse.json({ found: false })
      return NextResponse.json({
        found: true,
        header: relay.header,
        totalReceivedBytes: relay.totalReceivedBytes,
        isComplete: relay.isComplete,
        chunkCount: relay.chunks.length,
      })
    }

    // 4. Get Chunks for Receiver
    if (action === "get_chunks") {
      if (!relay) return NextResponse.json({ found: false })

      const startIndex = typeof fromIndex === "number" ? fromIndex : 0
      const slice = relay.chunks.slice(startIndex)

      return NextResponse.json({
        found: true,
        header: relay.header,
        chunks: slice.map((c) => Buffer.from(c).toString("base64")),
        nextIndex: startIndex + slice.length,
        isComplete: relay.isComplete,
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("Relay route error:", error)
    return NextResponse.json({ error: "Server relay error" }, { status: 500 })
  }
}
