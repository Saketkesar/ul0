import { type NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import {
  getSplitSessionBySlug,
  confirmSettlement,
  verifyCollectorToken,
  toPublicSession,
} from "@/lib/appwrite/splits"
import { getAccountByClerkId } from "@/lib/appwrite/accounts"
import { logEventToSheet } from "@/lib/split/sheet-logger"
import { renderEmail } from "@/lib/split/email-templates"
import { sendEmailDirect } from "@/lib/split/email-sender"
import { sendTelegramMessage } from "@/lib/split/telegram-sender"

interface Context {
  params: Promise<{ slug: string }>
}

async function checkIsOwner(request: NextRequest, session: any, bodyToken?: string): Promise<boolean> {
  try {
    const { userId } = await auth()
    if (userId && session.owner_user_id && userId === session.owner_user_id) {
      return true
    }
  } catch {}

  const tokenHeader = request.headers.get("x-collector-token")
  const tokenQuery = request.nextUrl.searchParams.get("token")
  const candidateToken = tokenHeader || bodyToken || tokenQuery

  if (candidateToken && session.collector_token_hash) {
    if (verifyCollectorToken(candidateToken, session.collector_token_hash)) {
      return true
    }
  }

  // Legacy splits without owner or token allow creator actions
  if (!session.owner_user_id && !session.collector_token_hash) {
    return true
  }

  return false
}

export async function POST(request: NextRequest, { params }: Context) {
  try {
    const { slug } = await params
    const sanitizedSlug = slug.replace(/[^a-zA-Z0-9-_]/g, "")
    const session = await getSplitSessionBySlug(sanitizedSlug)

    if (!session || session.status === "deleted") {
      return NextResponse.json({ error: "Split session not found" }, { status: 404 })
    }

    const body = await request.json().catch(() => ({}))
    const {
      settlementIndex,
      confirmed,
      token: bodyToken,
      reason,
      notes,
      notifyFriend = true,
      overrideEmail,
      overrideTelegram,
    } = body

    const isOwner = await checkIsOwner(request, session, bodyToken)
    if (!isOwner) {
      return NextResponse.json(
        { error: "Unauthorized. Only the bill creator can confirm payments." },
        { status: 403 }
      )
    }

    if (typeof settlementIndex !== "number" || settlementIndex < 0 || !Number.isInteger(settlementIndex)) {
      return NextResponse.json({ error: "Invalid settlement index" }, { status: 400 })
    }

    const isConfirmed = typeof confirmed === "boolean" ? confirmed : true
    const updatedSession = await confirmSettlement(sanitizedSlug, settlementIndex, isConfirmed)

    if (!updatedSession) {
      return NextResponse.json({ error: "Settlement could not be updated" }, { status: 400 })
    }

    const members = (updatedSession.members || []) as any[]
    const targetSettlement = updatedSession.settlements?.[settlementIndex]
    const friendMember = members.find(
      (m) => m.id === targetSettlement?.from || m.name === targetSettlement?.from
    )
    const organizerMember =
      members.find((m) => m.isCollector || String(m.id || "").startsWith("collector-")) || members[0]

    const memberName = friendMember?.name || targetSettlement?.from || "Member"
    const memberAmount = targetSettlement?.amount || 0
    const organizerName = organizerMember?.name || targetSettlement?.to || "Organizer"
    const splitUrl = `https://ul0.site/split/${sanitizedSlug}`

    const allSettlements = updatedSession.settlements || []
    const allSettled =
      allSettlements.length > 0 &&
      allSettlements.every((s: any) => s.status === "confirmed" || s.verified)

    let friendEmailSent = false
    let organizerEmailSent = false
    let telegramSent = false

    const friendEmail =
      (typeof overrideEmail === "string" && overrideEmail.trim()) || friendMember?.email || ""
    const friendTelegram =
      (typeof overrideTelegram === "string" && overrideTelegram.trim()) || friendMember?.telegram || ""

    let organizerEmail = organizerMember?.email || ""
    if (!organizerEmail) {
      const clerkUser = await currentUser().catch(() => null)
      organizerEmail =
        clerkUser?.primaryEmailAddress?.emailAddress || clerkUser?.emailAddresses?.[0]?.emailAddress || ""
      if (!organizerEmail && updatedSession.owner_user_id) {
        const acc = await getAccountByClerkId(updatedSession.owner_user_id).catch(() => null)
        if (acc?.email) organizerEmail = acc.email
      }
    }

    // Send emails & Telegram when payment is confirmed/settled
    if (isConfirmed && notifyFriend) {
      const createdAt = updatedSession.created_at ? new Date(updatedSession.created_at).getTime() : Date.now()
      const diffHours = Math.max(1, Math.round((Date.now() - createdAt) / (1000 * 60 * 60)))
      const durationStr = diffHours < 24 ? `${diffHours} hr${diffHours > 1 ? "s" : ""}` : `${Math.round(diffHours / 24)} days`

      if (friendEmail) {
        const { html, subject } = renderEmail("settled", {
          split_name: updatedSession.title,
          total: `₹${memberAmount.toFixed(2)}`,
          people_count: `${allSettlements.length}`,
          duration: durationStr,
          cta_url: "https://ul0.site/split/dashboard",
          split_url: splitUrl,
        })
        const res = await sendEmailDirect({
          to: friendEmail,
          subject: `Payment Confirmed ✅ ₹${memberAmount} for ${updatedSession.title}`,
          html,
          text: `Hi ${memberName}, ${organizerName} confirmed receiving your ₹${memberAmount} payment for "${updatedSession.title}". Receipt: ${splitUrl}`,
        })
        friendEmailSent = res.success
      }

      if (friendTelegram) {
        const tgRes = await sendTelegramMessage(
          String(friendTelegram),
          `✅ <b>Payment Confirmed!</b>\n\nHi <b>${memberName}</b>, ${organizerName} confirmed receiving <b>₹${memberAmount}</b> for <b>${updatedSession.title}</b>.\n\nView receipt: ${splitUrl}`
        )
        telegramSent = tgRes.success
      }

      if (allSettled && organizerEmail && organizerEmail !== friendEmail) {
        const { html, subject } = renderEmail("settled", {
          split_name: updatedSession.title,
          total: `₹${Number(updatedSession.total_amount || 0).toFixed(2)}`,
          people_count: `${allSettlements.length}`,
          duration: durationStr,
          cta_url: "https://ul0.site/split/dashboard",
          split_url: splitUrl,
        })
        const orgRes = await sendEmailDirect({
          to: organizerEmail,
          subject: subject || `All settled! ${updatedSession.title} collected`,
          html,
          text: `Your split "${updatedSession.title}" (₹${updatedSession.total_amount}) is completely settled! Receipt: ${splitUrl}`,
        })
        organizerEmailSent = orgRes.success
      }
    }

    // Real-time logging to Google Sheets
    logEventToSheet({
      event_type: isConfirmed ? (allSettled ? "split_settled" : "payment_confirmed") : "payment_disputed",
      split_slug: sanitizedSlug,
      title: session.title,
      total_amount: session.total_amount,
      organizer_name: organizerName,
      organizer_email: organizerEmail,
      member_name: memberName,
      member_share: memberAmount,
      member_contact: friendEmail || friendTelegram || "",
      status: isConfirmed ? "Confirmed / Settled" : "Disputed / Unpaid",
      notes:
        notes ||
        reason ||
        (isConfirmed
          ? `Confirmed by organizer (friendEmail=${friendEmailSent}, orgEmail=${organizerEmailSent})`
          : "Disputed - money not received in bank"),
      split_url: splitUrl,
    }).catch((e) => console.warn("Confirm route sheet logging failed:", e))

    return NextResponse.json({
      success: true,
      confirmed: isConfirmed,
      allSettled,
      notifications: {
        friendEmailSent,
        organizerEmailSent,
        telegramSent,
      },
      session: toPublicSession(updatedSession),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to confirm payment" }, { status: 500 })
  }
}
