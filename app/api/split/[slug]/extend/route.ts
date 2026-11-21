import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import {
  getSplitSessionBySlug,
  extendSplitExpiry,
  verifyCollectorToken,
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
        { error: "Unauthorized. Only the bill creator can extend expiry." },
        { status: 403 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const days = typeof body.days === "number" && [7, 30, 90].includes(body.days) ? body.days : 30

    const updatedSession = await extendSplitExpiry(sanitizedSlug, days)

    if (!updatedSession) {
      return NextResponse.json({ error: "Could not extend expiry" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      expiresAt: updatedSession.expires_at,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to extend expiry" }, { status: 500 })
  }
}
