import { type NextRequest, NextResponse } from "next/server"
import { checkRateLimit, getClientIP } from "@/lib/utils/rate-limit"
import { claimSettlement, toPublicSession } from "@/lib/appwrite/splits"

interface Context {
  params: Promise<{ slug: string }>
}

const CLAIM_RATE_LIMIT = {
  windowMs: 60000, // 1 minute
  maxRequests: 5,  // 5 claims per min per IP
}

export async function POST(request: NextRequest, { params }: Context) {
  try {
    const clientIP = getClientIP(request)
    const rateLimit = await checkRateLimit(`split:claim:${clientIP}`, CLAIM_RATE_LIMIT)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many claim attempts. Please wait a moment." },
        { status: 429, headers: { "Retry-After": rateLimit.resetIn.toString() } }
      )
    }

    const { slug } = await params
    const sanitizedSlug = slug.replace(/[^a-zA-Z0-9-_]/g, "")

    const body = await request.json().catch(() => ({}))
    const { settlementIndex, paidAmount, utrLast4 } = body

    if (typeof settlementIndex !== "number" || settlementIndex < 0 || !Number.isInteger(settlementIndex)) {
      return NextResponse.json({ error: "Invalid settlement index" }, { status: 400 })
    }

    let parsedAmount: number | undefined = undefined
    if (typeof paidAmount === "number" && Number.isFinite(paidAmount) && paidAmount > 0) {
      parsedAmount = Math.round(paidAmount * 100) / 100
    }

    let sanitizedUtr: string | undefined = undefined
    if (typeof utrLast4 === "string") {
      sanitizedUtr = utrLast4.trim().replace(/[^a-zA-Z0-9]/g, "").slice(0, 4)
    }

    const updatedSession = await claimSettlement(sanitizedSlug, settlementIndex, {
      paidAmount: parsedAmount,
      utrLast4: sanitizedUtr,
    })

    if (!updatedSession) {
      return NextResponse.json({ error: "Split session or settlement not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      session: toPublicSession(updatedSession),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to record payment" }, { status: 500 })
  }
}
