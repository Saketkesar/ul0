import { type NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { renderEmail } from "@/lib/split/email-templates"
import { logEventToSheet } from "@/lib/split/sheet-logger"
import { sendEmailDirect } from "@/lib/split/email-sender"
import { sendTelegramMessage } from "@/lib/split/telegram-sender"
import { checkRateLimit } from "@/lib/utils/rate-limit"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Sign in to complete onboarding" }, { status: 401 })
    }

    const rateLimit = await checkRateLimit(`notify:onboarding:user:${userId}`, {
      windowMs: 60 * 60 * 1000,
      maxRequests: 5,
    })
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "Too many onboarding requests. Please wait." }, { status: 429 })
    }

    const body = await request.json().catch(() => ({}))
    const { name, upiId, telegram, bankName, defaultGst } = body
    const user = await currentUser().catch(() => null)
    const clerkEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || ""
    const rawEmail = typeof body.email === "string" ? body.email.trim() : ""
    const targetEmail = clerkEmail || rawEmail

    // Log real-time onboarding to Google Sheets
    logEventToSheet({
      event_type: "onboarding_completed",
      organizer_name: name || user?.fullName || "Organizer",
      organizer_upi: upiId || "",
      organizer_email: targetEmail,
      organizer_telegram: telegram || "",
      status: "Active (Onboarded)",
      notes: `Bank: ${bankName || "UPI"} | Default GST: ${defaultGst || 0}%`,
      split_url: "https://ul0.site/split/dashboard",
    }).catch((e) => console.warn("Onboarding sheet log error:", e))

    if (!targetEmail) {
      return NextResponse.json({
        success: true,
        emailSent: false,
        message: "Onboarded without email address",
      })
    }

    const { html: welcomeHtml, subject: welcomeSubject } = renderEmail("welcome", {
      name: name || user?.firstName || "Friend",
      cta_url: "https://ul0.site/split/dashboard",
      help_url: "https://ul0.site/split",
    })

    const mailRes = await sendEmailDirect({
      to: targetEmail,
      subject: welcomeSubject || "Welcome to UL0 Split & Hisab! Your account is active",
      html: welcomeHtml,
      text: `Welcome to UL0 Split & Hisab! Your verified UPI ID is ${upiId || "ready"}. Start splitting at https://ul0.site/split/dashboard`,
    })

    let telegramSent = false
    if (telegram && typeof telegram === "string" && telegram.trim()) {
      const tgRes = await sendTelegramMessage(
        telegram.trim(),
        `👋 <b>Welcome to UL0 Split, ${name || "Friend"}!</b>\n\nYour UPI ID <code>${upiId}</code> is active.\nStart creating splits at https://ul0.site/split/dashboard`
      )
      telegramSent = tgRes.success
    }

    if (!mailRes.success) {
      console.error("[Onboarding] Email delivery failed:", mailRes.error)
      return NextResponse.json(
        {
          success: false,
          emailSent: false,
          telegramSent,
          error: mailRes.error || "Failed to send onboarding email",
        },
        { status: 502 }
      )
    }

    return NextResponse.json({
      success: true,
      emailSent: true,
      telegramSent,
      messageId: mailRes.messageId,
      message: "Onboarding email sent successfully",
    })
  } catch (err: any) {
    console.error("[Onboarding] Unexpected error:", err)
    return NextResponse.json({ error: err?.message || "Internal error" }, { status: 500 })
  }
}
