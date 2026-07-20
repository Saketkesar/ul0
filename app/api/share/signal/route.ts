import { NextResponse } from "next/server"

interface RoomSignal {
  code: string
  createdAt: number
  senderDeviceInfo?: { os: string; browser: string; ip: string; countryCode?: string; countryFlag?: string }
  receiverDeviceInfo?: { os: string; browser: string; ip: string; countryCode?: string; countryFlag?: string }
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

// Convert 2-letter country code (e.g. "IN", "US") to flag emoji
function getCountryFlag(countryCode?: string | null): string {
  if (!countryCode || countryCode.length !== 2) return "🌐"
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
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

    // Get client IP and Vercel geo country code
    const clientIp =
      req.headers.get("x-real-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      "127.0.0.1"

    const countryCode = req.headers.get("x-vercel-ip-country") || "IN"
    const countryFlag = getCountryFlag(countryCode)

    const fullDeviceInfo = {
      ...(deviceInfo || { os: "Device", browser: "Browser" }),
      ip: clientIp,
      countryCode,
      countryFlag,
    }

    // 1. Create Room / Publish Offer (Sender)
    if (action === "create_room") {
      const room: RoomSignal = {
        code: cleanCode,
        createdAt: Date.now(),
        senderDeviceInfo: fullDeviceInfo,
        offer,
        senderCandidates: [],
        receiverCandidates: [],
      }
      rooms.set(cleanCode, room)
      return NextResponse.json({ success: true, roomCode: cleanCode })
    }

    const room = rooms.get(cleanCode)

    // 2. Poll Room Status (Continuous SDP & Candidate sync)
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
        return NextResponse.json({ error: "Room not found. Make sure sender has ul0.site/share open." }, { status: 404 })
      }
      room.answer = answer
      room.receiverDeviceInfo = fullDeviceInfo
      return NextResponse.json({
        success: true,
        senderDeviceInfo: room.senderDeviceInfo,
        offer: room.offer,
      })
    }

    // 4. Push ICE Candidate (Append new candidates dynamically)
    if (action === "add_ice") {
      if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 })
      if (role === "sender" && candidate) {
        // Prevent duplicates
        const exists = room.senderCandidates.some(c => c.candidate === candidate.candidate)
        if (!exists) room.senderCandidates.push(candidate)
      } else if (role === "receiver" && candidate) {
        const exists = room.receiverCandidates.some(c => c.candidate === candidate.candidate)
        if (!exists) room.receiverCandidates.push(candidate)
      }
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("Signaling API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
