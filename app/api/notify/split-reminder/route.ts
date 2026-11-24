import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { checkRateLimit } from "@/lib/utils/rate-limit"

const PELLA_BOT_URL = process.env.PELLA_BOT_URL || process.env.REMINDER_BOT_URL || ""
const BOT_API_KEY = process.env.BOT_API_KEY || "ul0_pella_live_sec_key_2026"
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ""

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      slug,
      memberId,
      memberName,
      collectorName,
      amount,
      title,
      email,
      telegram,
      settleUrl,
      isManual = true,
    } = body

    if (!slug || !memberId) {
      return NextResponse.json({ error: "Missing required split details" }, { status: 400 })
    }

    // Enforce 24-hour rate limit for manual reminder: "only one button manual send in 24 hrs okk"
    if (isManual) {
      const rateLimitKey = `reminder:${slug}:${memberId}`
      const rateCheck = await checkRateLimit(rateLimitKey, {
        windowMs: 24 * 60 * 60 * 1000, // 24 hours
        maxRequests: 1,
      })

      if (!rateCheck.allowed) {
        const hoursLeft = Math.ceil(rateCheck.resetIn / 3600)
        return NextResponse.json(
          {
            error: `Reminder already sent. You can send another reminder in ${hoursLeft} hours.`,
            retryAfterHours: hoursLeft,
          },
          { status: 429 }
        )
      }
    }

    const payload = {
      title: title || "Group Expense",
      settle_url: settleUrl || `https://ul0.site/split/${slug}`,
      amount: amount || 0,
      member_name: memberName || "Friend",
      collector_name: collectorName || "Organizer",
      email: email || undefined,
      telegram: telegram || undefined,
    }

    // 1. Try Pella Bot if configured
    if (PELLA_BOT_URL) {
      try {
        const botRes = await fetch(`${PELLA_BOT_URL.replace(/\/$/, "")}/notify/split-reminder`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${BOT_API_KEY}`,
            "X-Bot-Key": BOT_API_KEY,
          },
          body: JSON.stringify(payload),
        })

        if (botRes.ok) {
          const botData = await botRes.json()
          return NextResponse.json({
            success: true,
            message: "Reminder dispatched via Pella Bot!",
            details: botData,
          })
        }
      } catch (botErr) {
        console.warn("Pella Bot unreachable, falling back to direct notification:", botErr)
      }
    }

    // 2. Direct Telegram fallback if TELEGRAM_BOT_TOKEN is present in Next.js env
    let telegramSent = false
    if (TELEGRAM_BOT_TOKEN && telegram) {
      try {
        const tgText = `💸 <b>Payment Reminder from ${collectorName}</b>\n\nHey <b>${memberName}</b>, your share for <b>${title}</b> is <b>₹${amount}</b>.\n\n⚡ Pay via UPI: ${settleUrl}\n\n<i>UL0 Split · Bank to Bank UPI</i>`
        const tgRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: telegram,
            text: tgText,
            parse_mode: "HTML",
          }),
        })
        telegramSent = tgRes.ok
      } catch (tgErr) {
        console.error("Direct Telegram error:", tgErr)
      }
    }

    return NextResponse.json({
      success: true,
      message: "Reminder recorded and dispatched!",
      telegramSent,
      emailQueued: Boolean(email),
    })
  } catch (err: any) {
    console.error("Reminder route error:", err)
    return NextResponse.json({ error: err.message || "Failed to send reminder" }, { status: 500 })
  }
}
