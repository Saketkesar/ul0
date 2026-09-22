import { NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { deleteMonetizedLink } from "@/lib/appwrite/monetized-links"

const ALLOWED_EMAIL = "kesarsaket607@gmail.com"

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    const user = await currentUser()
    const email = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase()

    if (!userId || email !== ALLOWED_EMAIL) {
      return NextResponse.json(
        { error: "Unauthorized." },
        { status: 403 }
      )
    }

    const { id } = await params
    const success = await deleteMonetizedLink(id)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete link" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
