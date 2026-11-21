import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { generateSplitFromGroup } from "@/lib/groups"

interface Context {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: Context) {
  try {
    const { id: groupId } = await params
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug, collectorToken } = await generateSplitFromGroup(groupId, userId)
    return NextResponse.json({ success: true, slug, collectorToken })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to generate split" }, { status: 500 })
  }
}
