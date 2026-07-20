import { NextResponse } from "next/server"
import { Redis } from "@upstash/redis"

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const ROOM_TTL = 60 * 30 // 30 minutes

interface DeviceInfo {
  os: string
  browser: string
  ip: string
  countryCode?: string
  countryFlag?: string
}

interface RoomData {
  code: string
  createdAt: number
  senderDeviceInfo?: DeviceInfo
  receiverDeviceInfo?: DeviceInfo
  offer?: any
  answer?: any
  senderCandidates: any[]
  receiverCandidates: any[]
  // For Nearby Share discovery
  lat?: number
  lng?: number
}

function getCountryFlag(countryCode?: string | null): string {
  if (!countryCode || countryCode.length !== 2) return "🌐"
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

function roomKey(code: string) {
  return `share:room:${code.toUpperCase()}`
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { action, code, offer, answer, candidate, role, deviceInfo, lat, lng } = body

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Missing room code" }, { status: 400 })
    }

    const cleanCode = code.trim().toUpperCase()
    const key = roomKey(cleanCode)

    // Extract IP + country from Vercel headers
    const clientIp =
      req.headers.get("x-real-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "0.0.0.0"

    const countryCode = req.headers.get("x-vercel-ip-country") || undefined
    const countryFlag = getCountryFlag(countryCode)

    const fullDeviceInfo: DeviceInfo = {
      os: deviceInfo?.os || "Unknown",
      browser: deviceInfo?.browser || "Browser",
      ip: clientIp,
      countryCode,
      countryFlag,
    }

    // ─── 1. CREATE ROOM (Sender publishes offer) ────────────────────────────
    if (action === "create_room") {
      const room: RoomData = {
        code: cleanCode,
        createdAt: Date.now(),
        senderDeviceInfo: fullDeviceInfo,
        offer,
        senderCandidates: [],
        receiverCandidates: [],
        lat,
        lng,
      }
      await redis.set(key, JSON.stringify(room), { ex: ROOM_TTL })

      // Index in nearby rooms list if lat/lng provided
      if (lat != null && lng != null) {
        const nearbyEntry = { code: cleanCode, lat, lng, createdAt: Date.now() }
        await redis.lpush("share:nearby", JSON.stringify(nearbyEntry))
        await redis.ltrim("share:nearby", 0, 499) // keep last 500
        await redis.expire("share:nearby", ROOM_TTL)
      }

      return NextResponse.json({ success: true, roomCode: cleanCode })
    }

    // Load room from Redis for all other actions
    const raw = await redis.get<string>(key)
    const room: RoomData | null = raw ? (typeof raw === "string" ? JSON.parse(raw) : raw as any) : null

    // ─── 2. POLL (Continuous SDP + ICE sync) ───────────────────────────────
    if (action === "poll") {
      if (!room) {
        return NextResponse.json({ found: false, error: "Room not found or expired." })
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

    // ─── 3. JOIN ROOM (Receiver publishes answer) ───────────────────────────
    if (action === "join_room") {
      if (!room) {
        return NextResponse.json(
          { error: "Room not found. Make sure the sender has ul0.site/share open and hasn't refreshed." },
          { status: 404 }
        )
      }
      room.answer = answer
      room.receiverDeviceInfo = fullDeviceInfo
      await redis.set(key, JSON.stringify(room), { ex: ROOM_TTL })

      return NextResponse.json({
        success: true,
        senderDeviceInfo: room.senderDeviceInfo,
        offer: room.offer,
      })
    }

    // ─── 4. ADD ICE CANDIDATE ───────────────────────────────────────────────
    if (action === "add_ice") {
      if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 })

      if (role === "sender" && candidate) {
        const exists = room.senderCandidates.some((c: any) => c.candidate === candidate.candidate)
        if (!exists) room.senderCandidates.push(candidate)
      } else if (role === "receiver" && candidate) {
        const exists = room.receiverCandidates.some((c: any) => c.candidate === candidate.candidate)
        if (!exists) room.receiverCandidates.push(candidate)
      }

      await redis.set(key, JSON.stringify(room), { ex: ROOM_TTL })
      return NextResponse.json({ success: true })
    }

    // ─── 5. NEARBY DISCOVERY ────────────────────────────────────────────────
    if (action === "nearby") {
      if (lat == null || lng == null) {
        return NextResponse.json({ error: "Missing lat/lng" }, { status: 400 })
      }

      const entries = await redis.lrange("share:nearby", 0, 499)
      const nearby: { code: string; lat: number; lng: number; distance: number }[] = []

      for (const entry of entries) {
        try {
          const e = typeof entry === "string" ? JSON.parse(entry) : entry as any
          if (!e.lat || !e.lng) continue
          // Haversine distance (km)
          const R = 6371
          const dLat = ((e.lat - lat) * Math.PI) / 180
          const dLng = ((e.lng - lng) * Math.PI) / 180
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat * Math.PI) / 180) *
              Math.cos((e.lat * Math.PI) / 180) *
              Math.sin(dLng / 2) *
              Math.sin(dLng / 2)
          const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
          // Only show rooms within 50km that still exist
          if (dist <= 50) {
            const exists = await redis.get(roomKey(e.code))
            if (exists) nearby.push({ code: e.code, lat: e.lat, lng: e.lng, distance: Math.round(dist * 10) / 10 })
          }
        } catch {}
      }

      return NextResponse.json({ nearby: nearby.slice(0, 10) })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error: any) {
    console.error("Signal API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
