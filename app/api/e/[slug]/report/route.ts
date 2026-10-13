import { type NextRequest, NextResponse } from "next/server"
import { getFormDocBySlug } from "@/lib/appwrite/forms"
import { redis } from "@/lib/redis"

interface Context {
  params: Promise<{ slug: string }>
}

export async function POST(request: NextRequest, { params }: Context) {
  try {
    const { slug } = await params
    const form = await getFormDocBySlug(slug)
    if (!form) {
      return NextResponse.json({ error: "Form not found." }, { status: 404 })
    }

    const body = await request.json().catch(() => ({}))
    const reason = String(body.reason || "").trim() || "Unspecified abuse"

    const reportItem = {
      formId: form.id,
      slug: form.slug,
      reason,
      reportedAt: new Date().toISOString(),
      ip: request.headers.get("x-real-ip") || "unknown",
    }

    try {
      await redis.lpush("forms:abuse_reports", JSON.stringify(reportItem))
    } catch {}

    return NextResponse.json({ success: true, message: "Report received. Thank you for keeping ul0 safe." })
  } catch {
    return NextResponse.json({ error: "Failed to submit report." }, { status: 500 })
  }
}
