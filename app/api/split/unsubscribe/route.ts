import { type NextRequest, NextResponse } from "next/server"
import { logEventToSheet } from "@/lib/split/sheet-logger"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { email, mode = "all", reason } = body

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const cleanEmail = email.trim().toLowerCase()

    // Log real-time unsubscribe event to Google Sheet
    await logEventToSheet({
      event_type: "unsubscribed",
      organizer_email: cleanEmail,
      status: "Unsubscribed",
      notes: reason ? `Opted out (${mode}): ${reason}` : `Opted out (${mode})`,
    })

    return NextResponse.json({
      success: true,
      message: `Unsubscribed ${cleanEmail} successfully.`,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to unsubscribe" }, { status: 500 })
  }
}
