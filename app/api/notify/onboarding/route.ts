import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { renderEmail } from "@/lib/split/email-templates"
import { logEventToSheet } from "@/lib/split/sheet-logger"

const PELLA_BOT_URL = process.env.PELLA_BOT_URL || process.env.REMINDER_BOT_URL || ""
const BOT_API_KEY = process.env.BOT_API_KEY || "ul0_pella_live_sec_key_2026"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, upiId, email, telegram, bankName, defaultGst } = body

    // 1. Log real-time onboarding to Google Sheets
    logEventToSheet({
      event_type: "onboarding_completed",
      organizer_name: name || "Organizer",
      organizer_upi: upiId || "",
      organizer_email: email || "",
      organizer_telegram: telegram || "",
      status: "Active (Onboarded)",
      notes: `Bank: ${bankName || "UPI"} | Default GST: ${defaultGst || 0}%`,
      split_url: "https://ul0.site/split/dashboard",
    }).catch((e) => console.warn("Onboarding sheet log error:", e))

    if (!email) {
      return NextResponse.json({ success: true, message: "Onboarded without email" })
    }

    // 2. Render welcome email using template 01-welcome.html
    const { html: welcomeHtml, subject: welcomeSubject } = renderEmail("welcome", {
      name: name || "Friend",
      cta_url: "https://ul0.site/split/dashboard",
      help_url: "https://ul0.site/split",
    })

    if (PELLA_BOT_URL) {
      try {
        await fetch(`${PELLA_BOT_URL.replace(/\/$/, "")}/notify/email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${BOT_API_KEY}`,
            "X-Bot-Key": BOT_API_KEY,
          },
          body: JSON.stringify({
            to: email,
            subject: welcomeSubject || "Welcome to UL0 Split & Hisab! Your account is active",
            html: welcomeHtml,
            text: `Welcome to UL0 Split & Hisab! Your verified UPI ID is ${upiId}. Start splitting at https://ul0.site/split/dashboard`,
          }),
        })
      } catch (e) {
        console.warn("Pella Bot email dispatch warning:", e)
      }
    }

    return NextResponse.json({ success: true, message: "Onboarding email triggered" })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
