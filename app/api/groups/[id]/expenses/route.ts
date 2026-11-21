import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getGroupById, addGroupExpense } from "@/lib/groups"

interface Context {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: Context) {
  try {
    const { id: groupId } = await params
    const { userId } = await auth()

    const data = await getGroupById(groupId)
    if (!data) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 })
    }

    const isOwner = Boolean(userId && userId === data.group.owner_user_id)

    // Check if member entries are permitted when not the owner
    if (!isOwner && !data.group.allow_member_entries) {
      return NextResponse.json(
        { error: "Only the group organizer can add expenses to this group." },
        { status: 403 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const { paidByMemberId, amount, note, splitAmong } = body

    if (!paidByMemberId || typeof paidByMemberId !== "string") {
      return NextResponse.json({ error: "Payer is required" }, { status: 400 })
    }

    const parsedAmount = typeof amount === "number" ? Math.round(amount * 100) / 100 : parseFloat(amount)
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ error: "Valid amount greater than 0 is required" }, { status: 400 })
    }

    if (!note || typeof note !== "string" || !note.trim()) {
      return NextResponse.json({ error: "Expense description is required" }, { status: 400 })
    }

    if (!Array.isArray(splitAmong) || splitAmong.length === 0) {
      return NextResponse.json({ error: "Expense must be split among at least one member" }, { status: 400 })
    }

    const expense = await addGroupExpense({
      groupId,
      paidByMemberId,
      amount: parsedAmount,
      note: note.trim(),
      splitAmong,
      createdVia: isOwner ? "owner" : "member",
    })

    return NextResponse.json({ success: true, expense })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to add expense" }, { status: 500 })
  }
}
