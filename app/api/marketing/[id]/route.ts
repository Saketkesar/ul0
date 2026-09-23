import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import {
  deleteMarketingLink,
  toggleMarketingLinkActive,
} from "@/lib/appwrite/marketing-links"
import { checkRateLimit } from "@/lib/redis"

const MARKETING_ADMIN_ID = process.env.MARKETING_ADMIN_CLERK_USER_ID || ""

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId || !MARKETING_ADMIN_ID || userId !== MARKETING_ADMIN_ID) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const { is_active } = body

    if (typeof is_active !== "boolean") {
      return NextResponse.json(
        { error: "is_active must be a boolean." },
        { status: 400 }
      )
    }

    await toggleMarketingLinkActive(id, is_active)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Marketing link toggle error:", error)
    return NextResponse.json({ error: "Failed to update link." }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    if (!userId || !MARKETING_ADMIN_ID || userId !== MARKETING_ADMIN_ID) {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 })
    }

    // Rate limit: 20 deletes per minute
    const rl = await checkRateLimit(`mktg_delete:${userId}`, 20, 60)
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Rate limited." },
        { status: 429 }
      )
    }

    const { id } = await params
    const success = await deleteMarketingLink(id)
    if (!success) {
      return NextResponse.json({ error: "Failed to delete link." }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Marketing link delete error:", error)
    return NextResponse.json({ error: "Failed to delete link." }, { status: 500 })
  }
}
