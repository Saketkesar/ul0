import { type NextRequest, NextResponse } from "next/server"
import { getGroupByShareSlug } from "@/lib/groups"

interface Context {
  params: Promise<{ slug: string }>
}

export async function GET(request: NextRequest, { params }: Context) {
  try {
    const { slug } = await params
    const sanitizedSlug = slug.replace(/[^a-zA-Z0-9-_]/g, "")

    const data = await getGroupByShareSlug(sanitizedSlug)
    if (!data) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to load group" }, { status: 500 })
  }
}
