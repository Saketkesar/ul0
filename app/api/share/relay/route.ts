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

// Clean up old relay sessions older than 20 minutes
function cleanupOldRelays() {
  const now = Date.now()
  for (const [code, relay] of relayMap.entries()) {
    if (now - relay.createdAt > 20 * 60 * 1000) {
      relayMap.delete(code)
    }
  }
}

export async function POST(req: Request) {
  try {
    cleanupOldRelays()

    const contentType = req.headers.get("content-type") || ""

    // 1. JSON Actions (Header, Poll status, Fetch chunk array)
    if (contentType.includes("application/json")) {
      const body = await req.json()
      const { action, code, header } = body

      if (!code || typeof code !== "string") {
        return NextResponse.json({ error: "Missing room code" }, { status: 400 })
      }

      const cleanCode = code.trim().toUpperCase()

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

      if (action === "get_status") {
        const relay = relayMap.get(cleanCode)
        if (!relay) return NextResponse.json({ found: false })
        return NextResponse.json({
          found: true,
          header: relay.header,
          totalReceivedBytes: relay.totalReceivedBytes,
          isComplete: relay.isComplete,
          chunkCount: relay.chunks.length,
        })
      }

      if (action === "get_chunks") {
        const relay = relayMap.get(cleanCode)
        if (!relay) return NextResponse.json({ found: false })
        
        // Return chunks collected so far
        const { fromIndex } = body
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
    }

    // 2. Binary Chunk Upload (Raw ArrayBuffer)
    const url = new URL(req.url)
    const code = url.searchParams.get("code")
    const isLast = url.searchParams.get("isLast") === "true"

    if (code) {
      const cleanCode = code.trim().toUpperCase()
      const relay = relayMap.get(cleanCode)
      if (!relay) {
        return NextResponse.json({ error: "Relay session not found" }, { status: 404 })
      }

      const chunkBuffer = await req.arrayBuffer()
      relay.chunks.push(chunkBuffer)
      relay.totalReceivedBytes += chunkBuffer.byteLength
      if (isLast || (relay.header && relay.totalReceivedBytes >= relay.header.size)) {
        relay.isComplete = true
      }

      return NextResponse.json({ success: true, totalReceivedBytes: relay.totalReceivedBytes })
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  } catch (error: any) {
    console.error("Relay route error:", error)
    return NextResponse.json({ error: "Server relay error" }, { status: 500 })
  }
}
