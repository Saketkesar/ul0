import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { checkRateLimit } from "@/lib/utils/rate-limit"
import { renderEmail } from "@/lib/split/email-templates"
import { sendEmailDirect } from "@/lib/split/email-sender"
import { logEventToSheet } from "@/lib/split/sheet-logger"

const PELLA_BOT_URL = process.env.PELLA_BOT_URL || process.env.REMINDER_BOT_URL || "http://fi17.bot-hosting.cloud:25733"
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

    let emailSent = false
    // 1. Direct Email dispatch via Gmail SMTP using template 05-nudge.html
    if (email) {
      try {
        const { html: nudgeHtml, subject: nudgeSubject } = renderEmail("nudge", {
          friend_name: memberName || "Friend",
          creator_name: collectorName || "Organizer",
          split_name: title || "Group Expense",
          amount: `₹${amount}`,
          pay_url: settleUrl || `https://ul0.site/split/${slug}`,
          split_url: settleUrl || `https://ul0.site/split/${slug}`,
        })
        const mailRes = await sendEmailDirect({
          to: email,
          subject: nudgeSubject || `Payment Reminder: ₹${amount} for ${title}`,
          html: nudgeHtml,
          text: `Hey ${memberName}, reminder to settle ₹${amount} for ${title}: ${settleUrl}`,
        })
        emailSent = mailRes.success
      } catch (mErr) {
        console.error("Direct reminder email failed:", mErr)
      }
    }

    // 2. Direct Telegram message if Telegram handle / Chat ID provided
    let telegramSent = false
    const targetTg = telegram ? String(telegram).trim() : ""
    if (TELEGRAM_BOT_TOKEN && targetTg) {
      try {
        const tgText = `💸 <b>Payment Reminder from ${collectorName}</b>\n\nHey <b>${memberName}</b>, your share for <b>${title}</b> is <b>₹${amount}</b>.\n\n⚡ Pay via UPI: ${settleUrl}\n\n<i>UL0 Split · Bank to Bank UPI</i>`
        const tgRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: targetTg,
            text: tgText,
            parse_mode: "HTML",
          }),
        })
        telegramSent = tgRes.ok
      } catch (tgErr) {
        console.error("Direct Telegram error:", tgErr)
      }
    }

    // 3. Also notify Pella Bot if reachable
    if (PELLA_BOT_URL) {
      try {
        await fetch(`${PELLA_BOT_URL.replace(/\/$/, "")}/notify/split-reminder`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${BOT_API_KEY}`,
            "X-Bot-Key": BOT_API_KEY,
          },
          body: JSON.stringify({
            ...payload,
            target: targetTg,
            message: `💸 Payment Reminder from ${collectorName}: ₹${amount} for ${title}`,
          }),
        })
      } catch {}
    }

    // 4. Log reminder to Google Sheets
    logEventToSheet({
      event_type: "reminder_sent",
      split_slug: slug,
      title: title || "Group Expense",
      total_amount: Number(amount) || 0,
      organizer_name: collectorName || "Organizer",
      member_name: memberName || "Friend",
      member_share: Number(amount) || 0,
      member_contact: email || telegram || "",
      status: "Active",
      notes: `Reminder sent via ${emailSent ? "Email " : ""}${telegramSent ? "Telegram" : ""}`.trim(),
      split_url: settleUrl || `https://ul0.site/split/${slug}`,
    }).catch((e) => console.warn("Reminder sheet logging failed:", e))

    return NextResponse.json({
      success: true,
      message: "Reminder dispatched successfully!",
      telegramSent,
      emailSent,
    })
  } catch (err: any) {
    console.error("Reminder route error:", err)
    return NextResponse.json({ error: err.message || "Failed to send reminder" }, { status: 500 })
  }
}
