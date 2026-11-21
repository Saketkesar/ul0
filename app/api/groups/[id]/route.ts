import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getGroupById, deleteGroup } from "@/lib/groups"

interface Context {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: Context) {
  try {
    const { id } = await params
    const { userId } = await auth()

    const data = await getGroupById(id, userId || undefined)
    if (!data) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 })
    }

    const isOwner = Boolean(userId && userId === data.group.owner_user_id)

    return NextResponse.json({
      ...data,
      isOwner,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to load group" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Context) {
  try {
    const { id } = await params
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const success = await deleteGroup(id, userId)
    if (!success) {
      return NextResponse.json({ error: "Group not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Group deleted" })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete group" }, { status: 500 })
  }
}
