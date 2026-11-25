import { type NextRequest, NextResponse } from "next/server"
import { checkRateLimit, getClientIP } from "@/lib/utils/rate-limit"
import { claimSettlement, toPublicSession } from "@/lib/appwrite/splits"
import { getAccountByClerkId } from "@/lib/appwrite/accounts"
import { logEventToSheet } from "@/lib/split/sheet-logger"
import { renderEmail } from "@/lib/split/email-templates"
import { sendEmailDirect } from "@/lib/split/email-sender"
import { sendTelegramMessage } from "@/lib/split/telegram-sender"

interface Context {
  params: Promise<{ slug: string }>
}

const CLAIM_RATE_LIMIT = {
  windowMs: 60000, // 1 minute
  maxRequests: 5,  // 5 claims per min per IP
}

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
    if (typeof paidAmount === "number" && Number.isFinite(paidAmount) && paidAmount > 0) {
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

    const members = (updatedSession.members || []) as any[]
    const settlements = updatedSession.settlements || []
    const targetSettlement = settlements[settlementIndex]
    const friendMember = members.find(
      (m) => m.id === targetSettlement?.from || m.name === targetSettlement?.from
    )
    const organizer =
      members.find((m) => m.isCollector || m.is_organizer || m.role === "organizer" || String(m.id || "").startsWith("collector-")) ||
      members[0]

    const friendName = friendMember?.name || targetSettlement?.from || "A friend"
    const organizerName = organizer?.name || targetSettlement?.to || "Organizer"
    const amountStr = `₹${targetSettlement?.amount || 0}`
    const paidCount = settlements.filter((s: any) => s.status === "confirmed" || s.status === "claimed").length
    const totalCount = settlements.length
    const paidPercent = totalCount > 0 ? Math.round((paidCount / totalCount) * 100) : 0

    // Resolve organizer email: member record -> accounts DB -> Clerk fallback if needed
    let organizerEmail: string = organizer?.email || ""
    if (!organizerEmail && updatedSession.owner_user_id) {
      const acc = await getAccountByClerkId(updatedSession.owner_user_id).catch(() => null)
      if (acc?.email) organizerEmail = acc.email
    }

    // Google Sheets real-time log
    logEventToSheet({
      event_type: "payment_claimed",
      split_slug: sanitizedSlug,
      title: updatedSession.title,
      total_amount: updatedSession.total_amount,
      organizer_name: organizerName,
      organizer_email: organizerEmail,
      member_name: friendName,
      member_share: targetSettlement?.amount,
      status: "Claimed",
      notes: sanitizedUtr ? `Paid via UPI (UTR ref: ${sanitizedUtr})` : "Marked as paid",
      split_url: `https://ul0.site/split/${sanitizedSlug}`,
    }).catch((e) => console.warn("Claim sheet logging error:", e))

    // Notify organizer directly via SMTP Email + Telegram
    let emailSent = false
    if (organizerEmail) {
      try {
        const confirmUrl = `https://ul0.site/split/${sanitizedSlug}/manage`
        const notReceivedUrl = `https://ul0.site/split/${sanitizedSlug}/manage`
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

        const mailRes = await sendEmailDirect({
          to: organizerEmail,
          subject: subject || `${friendName} marked ${amountStr} as paid for ${updatedSession.title}`,
          html,
          text: `${friendName} marked their share of ${updatedSession.title} (${amountStr}) as paid. Review and confirm at ${confirmUrl}`,
        })
        emailSent = mailRes.success
      } catch (e) {
        console.warn("Claim direct email error:", e)
      }
    }

    if (organizer?.telegram) {
      await sendTelegramMessage(
        String(organizer.telegram),
        `💸 <b>${friendName} marked ${amountStr} as paid!</b>\n\nSplit: <b>${updatedSession.title}</b>${sanitizedUtr ? `\nUTR Ref: <code>${sanitizedUtr}</code>` : ""}\n\n✅ Confirm in Manage Split: https://ul0.site/split/${sanitizedSlug}/manage`
      ).catch(() => {})
    }

    return NextResponse.json({
      success: true,
      emailSent,
      session: toPublicSession(updatedSession),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to record payment" }, { status: 500 })
  }
}
