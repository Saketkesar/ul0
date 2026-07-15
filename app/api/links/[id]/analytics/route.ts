import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { listClicksByLink, getLinkById } from "@/lib/appwrite/links"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify link exists and user owns it
    const link = await getLinkById(id)
    if (!link) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    if (link.owner_id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Fetch clicks for this link (up to 5000 records to build thorough analytics)
    const clicks = await listClicksByLink(id, 5000)

    return NextResponse.json({
      link,
      clicks,
    })
  } catch (error) {
    console.error("Link analytics API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
