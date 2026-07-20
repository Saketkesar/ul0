import { NextResponse } from "next/server"

// In-memory ephemeral signaling store for WebRTC P2P pairing
interface RoomSignal {
  code: string
  createdAt: number
  senderDeviceInfo?: { os: string; browser: string; ip: string }
  receiverDeviceInfo?: { os: string; browser: string; ip: string }
  offer?: any
  answer?: any
  senderCandidates: any[]
  receiverCandidates: any[]
}

const rooms = new Map<string, RoomSignal>()

// Clean up stale rooms older than 30 minutes
function cleanupOldRooms() {
  const now = Date.now()
  for (const [code, room] of rooms.entries()) {
    if (now - room.createdAt > 30 * 60 * 1000) {
      rooms.delete(code)
    }
  }
}

export async function POST(req: Request) {
  try {
    cleanupOldRooms()
    const body = await req.json()
    const { action, code, offer, answer, candidate, role, deviceInfo } = body

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Missing room code" }, { status: 400 })
    }

    const cleanCode = code.trim().toUpperCase()

    // Get client IP from headers
    const clientIp =
      req.headers.get("x-real-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      "127.0.0.1"

    // 1. Create Room / Publish Offer (Sender)
    if (action === "create_room") {
      const room: RoomSignal = {
        code: cleanCode,
        createdAt: Date.now(),
        senderDeviceInfo: { ...(deviceInfo || {}), ip: clientIp },
        offer,
        senderCandidates: [],
        receiverCandidates: [],
      }
      rooms.set(cleanCode, room)
      return NextResponse.json({ success: true, roomCode: cleanCode })
    }

    const room = rooms.get(cleanCode)

    // 2. Poll Room Status (Both Sender & Receiver)
    if (action === "poll") {
      if (!room) {
        return NextResponse.json({ found: false, error: "Room not found or expired" })
      }

      if (role === "sender") {
        return NextResponse.json({
          found: true,
          hasAnswer: !!room.answer,
          answer: room.answer,
          receiverDeviceInfo: room.receiverDeviceInfo,
          receiverCandidates: room.receiverCandidates,
        })
      } else {
        return NextResponse.json({
          found: true,
          hasOffer: !!room.offer,
          offer: room.offer,
          senderDeviceInfo: room.senderDeviceInfo,
          senderCandidates: room.senderCandidates,
        })
      }
    }

    // 3. Join Room & Publish Answer (Receiver)
    if (action === "join_room") {
      if (!room) {
        return NextResponse.json({ error: "Room not found. Make sure sender is active." }, { status: 404 })
      }
      room.answer = answer
      room.receiverDeviceInfo = { ...(deviceInfo || {}), ip: clientIp }
      return NextResponse.json({ success: true, senderDeviceInfo: room.senderDeviceInfo, offer: room.offer })
    }

    // 4. Push ICE Candidate
    if (action === "add_ice") {
      if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 })
      if (role === "sender" && candidate) {
        room.senderCandidates.push(candidate)
      } else if (role === "receiver" && candidate) {
        room.receiverCandidates.push(candidate)
      }
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("Signaling API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
