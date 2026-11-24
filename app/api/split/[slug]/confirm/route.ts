import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import {
  getSplitSessionBySlug,
  confirmSettlement,
  verifyCollectorToken,
  toPublicSession,
} from "@/lib/appwrite/splits"
import { logEventToSheet } from "@/lib/split/sheet-logger"

interface Context {
  params: Promise<{ slug: string }>
}

async function checkIsOwner(request: NextRequest, session: any, bodyToken?: string): Promise<boolean> {
  try {
    const { userId } = await auth()
    if (userId && session.owner_user_id && userId === session.owner_user_id) {
      return true
    }
  } catch {}

  const tokenHeader = request.headers.get("x-collector-token")
  const tokenQuery = request.nextUrl.searchParams.get("token")
  const candidateToken = tokenHeader || bodyToken || tokenQuery

  if (candidateToken && session.collector_token_hash) {
    if (verifyCollectorToken(candidateToken, session.collector_token_hash)) {
      return true
    }
  }

  // Legacy splits without owner or token allow creator actions
  if (!session.owner_user_id && !session.collector_token_hash) {
    return true
  }

  return false
}

export async function POST(request: NextRequest, { params }: Context) {
  try {
    const { slug } = await params
    const sanitizedSlug = slug.replace(/[^a-zA-Z0-9-_]/g, "")
    const session = await getSplitSessionBySlug(sanitizedSlug)

    if (!session || session.status === "deleted") {
      return NextResponse.json({ error: "Split session not found" }, { status: 404 })
    }

    const body = await request.json().catch(() => ({}))
    const { settlementIndex, confirmed, token: bodyToken, reason, notes } = body

    const isOwner = await checkIsOwner(request, session, bodyToken)
    if (!isOwner) {
      return NextResponse.json(
        { error: "Unauthorized. Only the bill creator can confirm payments." },
        { status: 403 }
      )
    }

    if (typeof settlementIndex !== "number" || settlementIndex < 0 || !Number.isInteger(settlementIndex)) {
      return NextResponse.json({ error: "Invalid settlement index" }, { status: 400 })
    }

    const isConfirmed = typeof confirmed === "boolean" ? confirmed : true

    const updatedSession = await confirmSettlement(sanitizedSlug, settlementIndex, isConfirmed)

    if (!updatedSession) {
      return NextResponse.json({ error: "Settlement could not be updated" }, { status: 400 })
    }

    // Identify member details for logging
    const targetSettlement = updatedSession.settlements?.[settlementIndex]
    const memberName = targetSettlement?.from || "Member"
    const memberAmount = targetSettlement?.amount || 0
    const organizerName = targetSettlement?.to || "Organizer"

    // Real-time logging to Google Sheets
    logEventToSheet({
      event_type: isConfirmed ? "payment_confirmed" : "payment_disputed",
      split_slug: sanitizedSlug,
      title: session.title,
      total_amount: session.total_amount,
      organizer_name: organizerName,
      member_name: memberName,
      member_share: memberAmount,
      status: isConfirmed ? "Confirmed" : "Disputed / Unpaid",
      notes: notes || reason || (isConfirmed ? "Confirmed by organizer via email/app" : "Disputed - money not received in bank"),
      split_url: `https://ul0.site/split/${sanitizedSlug}`,
    }).catch((e) => console.warn("Confirm route sheet logging failed:", e))

    return NextResponse.json({
      success: true,
      confirmed: isConfirmed,
      session: toPublicSession(updatedSession),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to confirm payment" }, { status: 500 })
  }
}
