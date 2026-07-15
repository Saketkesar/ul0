import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getLinkById, updateLinkTargeting } from "@/lib/appwrite/links"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const link = await getLinkById(id)
    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    if (link.owner_id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const { targeting_json } = body

    // Update targeting settings
    const updated = await updateLinkTargeting(id, targeting_json)

    return NextResponse.json({
      success: true,
      link: updated,
    })
  } catch (error) {
    console.error("Link targeting update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
