import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { claimGroupMember } from "@/lib/groups"

interface Context {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: Context) {
  try {
    const { id: groupId } = await params
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Please sign in to claim your member profile" }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const { memberId } = body
    if (!memberId || typeof memberId !== "string") {
      return NextResponse.json({ error: "Member ID is required" }, { status: 400 })
    }

    const success = await claimGroupMember(groupId, memberId, userId)
    if (!success) {
      return NextResponse.json({ error: "Failed to claim member profile" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to claim member" }, { status: 500 })
  }
}
