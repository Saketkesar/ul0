import { type NextRequest, NextResponse } from "next/server"
import { getSplitSessionBySlug, updateSplitSettlements } from "@/lib/appwrite/splits"

interface Context {
  params: Promise<{ slug: string }>
}

export async function GET(request: NextRequest, { params }: Context) {
  try {
    const { slug } = await params
    const sanitizedSlug = slug.replace(/[^a-zA-Z0-9-_]/g, "")
    const session = await getSplitSessionBySlug(sanitizedSlug)

    if (!session) {
      return NextResponse.json({ error: "Split session not found" }, { status: 404 })
    }

    return NextResponse.json({ session })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch session" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: Context) {
  try {
    const { slug } = await params
    const sanitizedSlug = slug.replace(/[^a-zA-Z0-9-_]/g, "")
    const session = await getSplitSessionBySlug(sanitizedSlug)

    if (!session) {
      return NextResponse.json({ error: "Split session not found" }, { status: 404 })
    }

    const body = await request.json().catch(() => ({}))
    const currentSettlements = (session.settlements as any[]) || []

    let updatedSettlements: any[] = []

    if (Array.isArray(body.settlements)) {
      updatedSettlements = body.settlements
    } else if (typeof body.settlementIndex === "number" && typeof body.paid === "boolean") {
      const idx = body.settlementIndex
      if (idx < 0 || idx >= currentSettlements.length) {
        return NextResponse.json({ error: "Invalid settlement index" }, { status: 400 })
      }
      updatedSettlements = currentSettlements.map((s, i) => {
        if (i === idx) {
          return {
            ...s,
            paid: body.paid,
            paid_at: body.paid ? new Date().toISOString() : null,
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
      session: updatedSession,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update settlement" }, { status: 500 })
  }
}
