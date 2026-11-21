import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import {
  getSplitSessionBySlug,
  updateSplitSettlements,
  deleteSplitSession,
  verifyCollectorToken,
  toPublicSession,
} from "@/lib/appwrite/splits"

interface Context {
  params: Promise<{ slug: string }>
}

/** Check if current request is authenticated as the split session owner */
async function checkIsOwner(request: NextRequest, session: any): Promise<boolean> {
  // 1. Check Clerk auth
  try {
    const { userId } = await auth()
    if (userId && session.owner_user_id && userId === session.owner_user_id) {
      return true
    }
  } catch {}

  // 2. Check collector token header
  const tokenHeader = request.headers.get("x-collector-token")
  if (tokenHeader && session.collector_token_hash) {
    if (verifyCollectorToken(tokenHeader, session.collector_token_hash)) {
      return true
    }
  }

  // 3. Backward compatibility for legacy splits created without owner or token
  if (!session.owner_user_id && !session.collector_token_hash) {
    return true
  }

  return false
}

export async function GET(request: NextRequest, { params }: Context) {
  try {
    const { slug } = await params
    const sanitizedSlug = slug.replace(/[^a-zA-Z0-9-_]/g, "")
    const session = await getSplitSessionBySlug(sanitizedSlug)

    if (!session || session.status === "deleted") {
      return NextResponse.json({ error: "Split session not found" }, { status: 404 })
    }

    const isExpired = session.expires_at ? new Date(session.expires_at) < new Date() : false
    const isOwner = await checkIsOwner(request, session)

    if (isExpired && !isOwner) {
      return NextResponse.json(
        {
          error: "This bill split has expired. Ask the organizer for an updated link.",
          expired: true,
        },
        { status: 410 }
      )
    }

    if (isOwner) {
      // Owner gets full session (unmasked) without token hash
      const { collector_token_hash, ...safeSession } = session
      return NextResponse.json({
        session: safeSession,
        isOwner: true,
      })
    }

    // Public / Friend gets masked session
    return NextResponse.json({
      session: toPublicSession(session),
      isOwner: false,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch session" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: Context) {
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
        { error: "Unauthorized. Only the bill creator can modify settlement rules." },
        { status: 403 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const currentSettlements = (session.settlements as any[]) || []

    let updatedSettlements: any[] = []

    if (Array.isArray(body.settlements)) {
      updatedSettlements = body.settlements
    } else if (typeof body.settlementIndex === "number") {
      const idx = body.settlementIndex
      if (idx < 0 || idx >= currentSettlements.length) {
        return NextResponse.json({ error: "Invalid settlement index" }, { status: 400 })
      }
      updatedSettlements = currentSettlements.map((s, i) => {
        if (i === idx) {
          const nextPaid = typeof body.paid === "boolean" ? body.paid : s.status !== "unpaid"
          const isVerified = typeof body.verified === "boolean" ? body.verified : (nextPaid ? s.status === "confirmed" : false)
          return {
            ...s,
            status: isVerified ? "confirmed" : (nextPaid ? "claimed" : "unpaid"),
            paid: nextPaid,
            paid_at: nextPaid ? (s.paid_at || new Date().toISOString()) : null,
            verified: isVerified,
            verified_at: isVerified ? new Date().toISOString() : null,
          }
        }
        return s
      })
    } else {
      return NextResponse.json({ error: "Invalid request payload" }, { status: 400 })
    }

    const updatedSession = await updateSplitSettlements(sanitizedSlug, updatedSettlements)

    return NextResponse.json({
      success: true,
      session: updatedSession ? toPublicSession(updatedSession) : null,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update settlement" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Context) {
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
        { error: "Unauthorized. Only the bill creator can delete this split." },
        { status: 403 }
      )
    }

    await deleteSplitSession(sanitizedSlug)

    return NextResponse.json({ success: true, message: "Split session deleted" })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete session" }, { status: 500 })
  }
}
