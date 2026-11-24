import { type NextRequest, NextResponse } from "next/server"
import { checkRateLimit, getClientIP } from "@/lib/utils/rate-limit"
import { claimSettlement, toPublicSession } from "@/lib/appwrite/splits"
import { logEventToSheet } from "@/lib/split/sheet-logger"
import { renderEmail } from "@/lib/split/email-templates"
import { sendEmailDirect } from "@/lib/split/email-sender"

interface Context {
  params: Promise<{ slug: string }>
}

const CLAIM_RATE_LIMIT = {
  windowMs: 60000, // 1 minute
  maxRequests: 5,  // 5 claims per min per IP
}

const PELLA_BOT_URL = process.env.PELLA_BOT_URL || process.env.REMINDER_BOT_URL || "http://fi17.bot-hosting.cloud:25733"
const BOT_API_KEY = process.env.BOT_API_KEY || "ul0_pella_live_sec_key_2026"

export async function POST(request: NextRequest, { params }: Context) {
  try {
    const clientIP = getClientIP(request)
    const rateLimit = await checkRateLimit(`split:claim:${clientIP}`, CLAIM_RATE_LIMIT)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many claim attempts. Please wait a moment." },
        { status: 429, headers: { "Retry-After": rateLimit.resetIn.toString() } }
      )
    }

    const { slug } = await params
    const sanitizedSlug = slug.replace(/[^a-zA-Z0-9-_]/g, "")

    const body = await request.json().catch(() => ({}))
    const { settlementIndex, paidAmount, utrLast4 } = body

    if (typeof settlementIndex !== "number" || settlementIndex < 0 || !Number.isInteger(settlementIndex)) {
      return NextResponse.json({ error: "Invalid settlement index" }, { status: 400 })
    }

    let parsedAmount: number | undefined = undefined
    if (typeof paidAmount === "number" && Number.isFinite(paidAmount) && parsedAmount !== undefined) {
      parsedAmount = Math.round(paidAmount * 100) / 100
    }

    let sanitizedUtr: string | undefined = undefined
    if (typeof utrLast4 === "string") {
      sanitizedUtr = utrLast4.trim().replace(/[^a-zA-Z0-9]/g, "").slice(0, 4)
    }

    const updatedSession = await claimSettlement(sanitizedSlug, settlementIndex, {
      paidAmount: parsedAmount,
      utrLast4: sanitizedUtr,
    })

    if (!updatedSession) {
      return NextResponse.json({ error: "Split session or settlement not found" }, { status: 404 })
    }

    const settlements = updatedSession.settlements || []
    const targetSettlement = settlements[settlementIndex]
    const friendName = targetSettlement?.from || "A friend"
    const amountStr = `₹${targetSettlement?.amount || 0}`
    const paidCount = settlements.filter((s: any) => s.status === "confirmed" || s.status === "claimed").length
    const totalCount = settlements.length
    const paidPercent = totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0

    // Google Sheets real-time log
    logEventToSheet({
      event_type: "payment_claimed",
      split_slug: sanitizedSlug,
      title: updatedSession.title,
      total_amount: updatedSession.total_amount,
      organizer_name: targetSettlement?.to || "Organizer",
      member_name: friendName,
      member_share: targetSettlement?.amount,
      status: "Claimed",
      notes: sanitizedUtr ? `Paid via UPI (UTR ref: ${sanitizedUtr})` : "Marked as paid",
      split_url: `https://ul0.site/split/${sanitizedSlug}`,
    }).catch((e) => console.warn("Claim sheet logging error:", e))

    // Send email to organizer if organizer email is known
    const members = (updatedSession.members || []) as any[]
    const organizer = members.find((m: any) => m.isCollector || m.is_organizer || m.role === "organizer")
    const organizerEmail = organizer?.email

    if (organizerEmail && PELLA_BOT_URL) {
      try {
        const confirmUrl = `https://ul0.site/split/${sanitizedSlug}/confirm-payment?member=${settlementIndex}`
        const notReceivedUrl = `https://ul0.site/split/${sanitizedSlug}/not-received?member=${settlementIndex}`
        const splitUrl = `https://ul0.site/split/${sanitizedSlug}`

        const { html, subject } = renderEmail("marked-paid", {
          friend_name: friendName,
          amount: amountStr,
          split_name: updatedSession.title,
          paid_count: paidCount,
          people_count: totalCount,
          paid_percent: paidPercent,
          confirm_url: confirmUrl,
          not_received_url: notReceivedUrl,
          split_url: splitUrl,
        })

        fetch(`${PELLA_BOT_URL.replace(/\/$/, "")}/notify/email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${BOT_API_KEY}`,
            "X-Bot-Key": BOT_API_KEY,
          },
          body: JSON.stringify({
            to: organizerEmail,
            subject,
            html,
            text: `${friendName} marked their share of ${updatedSession.title} as paid (${amountStr}). Confirm: ${confirmUrl} or Not received: ${notReceivedUrl}`,
          }),
        }).catch((e) => console.warn("Payment claim email error:", e))
      } catch (e) {
        console.warn("Claim email rendering error:", e)
      }
    }

    return NextResponse.json({
      success: true,
      session: toPublicSession(updatedSession),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to record payment" }, { status: 500 })
  }
}
