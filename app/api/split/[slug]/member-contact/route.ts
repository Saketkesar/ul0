import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import {
  getSplitSessionBySlug,
  updateSplitMemberContact,
  verifyCollectorToken,
} from "@/lib/appwrite/splits"
import { renderEmail } from "@/lib/split/email-templates"
import { sendEmailDirect } from "@/lib/split/email-sender"
import { sendTelegramMessage } from "@/lib/split/telegram-sender"

interface Context {
  params: Promise<{ slug: string }>
}

/**
 * Owner-only endpoint to update a member's Email/Telegram contact on an existing split,
 * and optionally send them a Settled Receipt or Payment Reminder immediately.
 */
export async function POST(request: NextRequest, { params }: Context) {
  try {
    const { slug } = await params
    const sanitizedSlug = slug.replace(/[^a-zA-Z0-9-_]/g, "")
    const session = await getSplitSessionBySlug(sanitizedSlug)

    if (!session || session.status === "deleted") {
      return NextResponse.json({ error: "Split session not found" }, { status: 404 })
    }

    const body = await request.json().catch(() => ({}))
    const { memberId, email, telegram, token: bodyToken, sendType } = body

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

    if (!memberId || typeof memberId !== "string") {
      return NextResponse.json({ error: "memberId is required" }, { status: 400 })
    }

    const cleanEmail = typeof email === "string" ? email.trim().toLowerCase() : undefined
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }
    const cleanTelegram = typeof telegram === "string" ? telegram.trim().slice(0, 64) : undefined

    const updatedSession = await updateSplitMemberContact(sanitizedSlug, memberId, {
      email: cleanEmail ?? null,
      telegram: cleanTelegram ?? null,
    })

    if (!updatedSession) {
      return NextResponse.json({ error: "Member not found in split" }, { status: 404 })
    }

    let emailSent = false
    let emailError: string | undefined
    let telegramSent = false

    const targetMember = (updatedSession.members as any[]).find(
      (m) => m.id === memberId || m.name === memberId
    )
    const organizer =
      (updatedSession.members as any[]).find(
        (m) => m.isCollector || String(m.id || "").startsWith("collector-")
      ) || (updatedSession.members as any[])[0]
    const settlement = (updatedSession.settlements || []).find(
      (s: any) => s.from === memberId || s.from === targetMember?.id
    )
    const amount = Number(settlement?.amount ?? session.total_amount ?? 0)
    const splitUrl = `https://ul0.site/split/${sanitizedSlug}`

    if (sendType === "settled") {
      if (cleanEmail) {
        const { html } = renderEmail("settled", {
          split_name: updatedSession.title,
          total: `₹${amount.toFixed(2)}`,
          people_count: `${(updatedSession.settlements || []).length || 2}`,
          duration: "Settled",
          cta_url: "https://ul0.site/split/dashboard",
          split_url: splitUrl,
        })
        const res = await sendEmailDirect({
          to: cleanEmail,
          subject: `Payment Confirmed ✅ ₹${amount} for ${updatedSession.title}`,
          html,
          text: `Hi ${targetMember?.name || "Friend"}, ${organizer?.name || "Organizer"} confirmed receiving your ₹${amount} payment for "${updatedSession.title}". Receipt: ${splitUrl}`,
        })
        emailSent = res.success
        emailError = res.error
      }
      if (cleanTelegram) {
        const tgRes = await sendTelegramMessage(
          cleanTelegram,
          `✅ <b>Payment Confirmed!</b>\n\nHi <b>${targetMember?.name || "Friend"}</b>, ${organizer?.name || "Organizer"} confirmed receiving <b>₹${amount}</b> for <b>${updatedSession.title}</b>.\n\nReceipt: ${splitUrl}`
        )
        telegramSent = tgRes.success
      }
    }

    const { collector_token_hash, ...safeSession } = updatedSession
    return NextResponse.json({
      success: true,
      session: safeSession,
      emailSent,
      emailError,
      telegramSent,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to update contact" }, { status: 500 })
  }
}
