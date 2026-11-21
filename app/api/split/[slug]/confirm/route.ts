import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import {
  getSplitSessionBySlug,
  confirmSettlement,
  verifyCollectorToken,
  toPublicSession,
} from "@/lib/appwrite/splits"

interface Context {
  params: Promise<{ slug: string }>
}

async function checkIsOwner(request: NextRequest, session: any): Promise<boolean> {
  try {
    const { userId } = await auth()
    if (userId && session.owner_user_id && userId === session.owner_user_id) {
      return true
    }
  } catch {}

  const tokenHeader = request.headers.get("x-collector-token")
  if (tokenHeader && session.collector_token_hash) {
    if (verifyCollectorToken(tokenHeader, session.collector_token_hash)) {
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

    const isOwner = await checkIsOwner(request, session)
    if (!isOwner) {
      return NextResponse.json(
        { error: "Unauthorized. Only the bill creator can confirm payments." },
        { status: 403 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const { settlementIndex, confirmed } = body

    if (typeof settlementIndex !== "number" || settlementIndex < 0 || !Number.isInteger(settlementIndex)) {
      return NextResponse.json({ error: "Invalid settlement index" }, { status: 400 })
    }

    const isConfirmed = typeof confirmed === "boolean" ? confirmed : true

    const updatedSession = await confirmSettlement(sanitizedSlug, settlementIndex, isConfirmed)

    if (!updatedSession) {
      return NextResponse.json({ error: "Settlement could not be updated" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      session: toPublicSession(updatedSession),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to confirm payment" }, { status: 500 })
  }
}
