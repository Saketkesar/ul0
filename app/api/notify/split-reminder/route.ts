import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { checkRateLimit } from "@/lib/utils/rate-limit"
import { renderEmail } from "@/lib/split/email-templates"
import { sendEmailDirect } from "@/lib/split/email-sender"
import { sendTelegramMessage } from "@/lib/split/telegram-sender"
import { logEventToSheet } from "@/lib/split/sheet-logger"
import { getSplitSessionBySlug, verifyCollectorToken } from "@/lib/appwrite/splits"

const PELLA_BOT_URL =
  process.env.PELLA_BOT_URL ||
  process.env.REMINDER_BOT_URL ||
  "http://fi17.bot-hosting.cloud:25733"
const BOT_API_KEY = process.env.BOT_API_KEY || "ul0_pella_live_sec_key_2026"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const {
      slug,
      memberId,
      memberName: bodyMemberName,
      collectorName: bodyCollectorName,
      amount: bodyAmount,
      title: bodyTitle,
      email: bodyEmail,
      telegram: bodyTelegram,
      settleUrl,
      isManual = true,
      token: bodyToken,
    } = body

    if (!slug || !memberId) {
      return NextResponse.json({ error: "Missing required split details" }, { status: 400 })
    }

    const sanitizedSlug = String(slug).replace(/[^a-zA-Z0-9-_]/g, "")
    const session = await getSplitSessionBySlug(sanitizedSlug)
    if (!session || session.status === "deleted") {
      return NextResponse.json({ error: "Split session not found" }, { status: 404 })
    }

    // Verify ownership (Clerk user OR collector token)
    const { userId } = await auth().catch(() => ({ userId: null }))
    const tokenHeader = request.headers.get("x-collector-token")
    const candidateToken = tokenHeader || bodyToken
    const hasValidToken = Boolean(
      candidateToken &&
        session.collector_token_hash &&
        verifyCollectorToken(String(candidateToken), session.collector_token_hash)
    )
    const isOwner = Boolean(
      (userId && session.owner_user_id && userId === session.owner_user_id) ||
        hasValidToken ||
        (!session.owner_user_id && !session.collector_token_hash && userId)
    )

    if (!isOwner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Resolve member and organizer details from DB first, fallback to body
    const members = (session.members || []) as any[]
    const dbMember = members.find((m) => m.id === memberId || m.name === memberId)
    const dbOrganizer =
      members.find((m) => m.isCollector || String(m.id || "").startsWith("collector-")) || members[0]
    const dbSettlement = (session.settlements || []).find(
      (s: any) => s.from === memberId || s.from === dbMember?.id
    )

    const targetEmail = (typeof bodyEmail === "string" && bodyEmail.trim()) || dbMember?.email || ""
    const targetTelegram = (typeof bodyTelegram === "string" && bodyTelegram.trim()) || dbMember?.telegram || ""
    const resolvedMemberName = dbMember?.name || bodyMemberName || "Friend"
    const resolvedCollectorName = dbOrganizer?.name || bodyCollectorName || "Organizer"
    const resolvedTitle = session.title || bodyTitle || "Group Expense"
    const resolvedAmount = Number(dbSettlement?.amount ?? bodyAmount ?? session.total_amount ?? 0)
    const resolvedUrl = settleUrl || `https://ul0.site/split/${sanitizedSlug}`

    if (!targetEmail && !targetTelegram) {
      return NextResponse.json(
        {
          error: `No email address or Telegram handle saved for ${resolvedMemberName}. Add their email or Telegram first to send a reminder.`,
          missingContact: true,
        },
        { status: 400 }
      )
    }

    // Enforce 24-hour rate limit AFTER verifying contact exists
    if (isManual) {
      const rateLimitKey = `reminder:${sanitizedSlug}:${memberId}`
      const rateCheck = await checkRateLimit(rateLimitKey, {
        windowMs: 24 * 60 * 60 * 1000,
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

    let emailSent = false
    let emailError: string | undefined
    let telegramSent = false
    let telegramError: string | undefined

    // 1. Direct Email dispatch via Gmail SMTP using template 05-nudge.html
    if (targetEmail) {
      const createdAtMs = session.created_at ? new Date(session.created_at).getTime() : Date.now()
      const daysPending = Math.max(0, Math.floor((Date.now() - createdAtMs) / (1000 * 60 * 60 * 24)))
      const { html: nudgeHtml, subject: nudgeSubject } = renderEmail("nudge", {
        friend_name: resolvedMemberName,
        creator_name: resolvedCollectorName,
        split_name: resolvedTitle,
        amount: `₹${resolvedAmount}`,
        days_pending: daysPending,
        pay_url: resolvedUrl,
        paid_url: `${resolvedUrl}/already-paid?member=${encodeURIComponent(memberId)}`,
        split_url: resolvedUrl,
      })

      const mailRes = await sendEmailDirect({
        to: targetEmail,
        subject: nudgeSubject || `Payment Reminder: ₹${resolvedAmount} for ${resolvedTitle}`,
        html: nudgeHtml,
        text: `Hey ${resolvedMemberName}, reminder to settle ₹${resolvedAmount} for ${resolvedTitle}: ${resolvedUrl}`,
      })
      emailSent = mailRes.success
      emailError = mailRes.error
    }

    // 2. Direct Telegram dispatch (+ Pella fallback inside helper)
    if (targetTelegram) {
      const tgText = `💸 <b>Payment Reminder from ${resolvedCollectorName}</b>\n\nHey <b>${resolvedMemberName}</b>, your share for <b>${resolvedTitle}</b> is <b>₹${resolvedAmount}</b>.\n\n⚡ Pay via UPI: ${resolvedUrl}\n\n<i>UL0 Split · Bank to Bank UPI</i>`
      const tgRes = await sendTelegramMessage(targetTelegram, tgText)
      telegramSent = tgRes.success
      telegramError = tgRes.error
    } else if (PELLA_BOT_URL) {
      // Optional non-blocking mirror to Pella bot logs with tight timeout
      fetch(`${PELLA_BOT_URL.replace(/\/$/, "")}/notify/split-reminder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${BOT_API_KEY}`,
          "X-Bot-Key": BOT_API_KEY,
        },
        body: JSON.stringify({
          title: resolvedTitle,
          settle_url: resolvedUrl,
          amount: resolvedAmount,
          member_name: resolvedMemberName,
          collector_name: resolvedCollectorName,
          email: targetEmail || undefined,
        }),
        signal: AbortSignal.timeout(3000),
      }).catch(() => {})
    }

    // 3. Log reminder to Google Sheets
    logEventToSheet({
      event_type: "reminder_sent",
      split_slug: sanitizedSlug,
      title: resolvedTitle,
      total_amount: resolvedAmount,
      organizer_name: resolvedCollectorName,
      member_name: resolvedMemberName,
      member_share: resolvedAmount,
      member_contact: targetEmail || targetTelegram,
      status: emailSent || telegramSent ? "Delivered" : "Failed",
      notes: `Reminder: email=${emailSent}, telegram=${telegramSent}${emailError ? ` (${emailError})` : ""}`,
      split_url: resolvedUrl,
    }).catch((e) => console.warn("Reminder sheet logging failed:", e))

    if (!emailSent && !telegramSent) {
      return NextResponse.json(
        {
          success: false,
          emailSent: false,
          telegramSent: false,
          error: emailError || telegramError || "Failed to deliver reminder",
        },
        { status: 502 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Reminder sent via ${[emailSent ? "Email" : "", telegramSent ? "Telegram" : ""].filter(Boolean).join(" & ")}!`,
      telegramSent,
      emailSent,
      emailError,
      telegramError,
    })
  } catch (err: any) {
    console.error("Reminder route error:", err)
    return NextResponse.json({ error: err?.message || "Failed to send reminder" }, { status: 500 })
  }
}
