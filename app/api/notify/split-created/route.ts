import { type NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { renderEmail } from "@/lib/split/email-templates"
import { logEventToSheet } from "@/lib/split/sheet-logger"
import { sendEmailDirect } from "@/lib/split/email-sender"
import { sendTelegramMessage } from "@/lib/split/telegram-sender"
import { getSplitSessionBySlug } from "@/lib/appwrite/splits"
import { checkRateLimit } from "@/lib/utils/rate-limit"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const rateLimit = await checkRateLimit(`notify:split-created:user:${userId}`, {
      windowMs: 60 * 1000,
      maxRequests: 20,
    })
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: "Too many notification requests" }, { status: 429 })
    }

    const body = await request.json().catch(() => ({}))
    const {
      slug,
      title,
      totalAmount,
      collectorName,
      collectorEmail: bodyCollectorEmail,
      collectorUpi,
      manageUrl,
      settleUrl,
      members = [],
    } = body

    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 })
    }

    const sanitizedSlug = slug.replace(/[^a-zA-Z0-9-_]/g, "")
    const session = await getSplitSessionBySlug(sanitizedSlug)
    if (!session) {
      return NextResponse.json({ error: "Split session not found" }, { status: 404 })
    }

    if (session.owner_user_id && session.owner_user_id !== userId) {
      return NextResponse.json({ error: "Forbidden: you do not own this split" }, { status: 403 })
    }

    const user = await currentUser().catch(() => null)
    const collectorEmail =
      (typeof bodyCollectorEmail === "string" && bodyCollectorEmail.trim()) ||
      user?.primaryEmailAddress?.emailAddress ||
      user?.emailAddresses?.[0]?.emailAddress ||
      ""

    const publicUrl = settleUrl || `https://ul0.site/split/${sanitizedSlug}`
    const finalMembers = Array.isArray(members) && members.length > 0 ? members : (session.members as any[])
    const peopleCount = finalMembers.length || 2
    const numericTotal = Number(totalAmount ?? session.total_amount) || 0
    const perPerson = peopleCount > 0 ? (numericTotal / peopleCount).toFixed(0) : "0"

    let creatorEmailSent = false
    let memberEmailsSent = 0
    let telegramsSent = 0
    const emailErrors: string[] = []

    // 1. Confirmation email to organizer
    if (collectorEmail) {
      const { html: creatorHtml, subject: creatorSubject } = renderEmail("split-created", {
        split_name: title || session.title || "Split Bill",
        total: `₹${numericTotal.toFixed(0)}`,
        people_count: peopleCount,
        per_person: `₹${perPerson}`,
        split_link: publicUrl,
        split_url: publicUrl,
        cta_url: manageUrl || publicUrl,
      })

      const mailRes = await sendEmailDirect({
        to: collectorEmail,
        subject: creatorSubject || `Split Created: ${title || session.title} (₹${numericTotal})`,
        html: creatorHtml,
        text: `Split created for ${title || session.title} (₹${numericTotal}). Settle link: ${publicUrl}`,
      })
      if (mailRes.success) {
        creatorEmailSent = true
      } else if (mailRes.error) {
        emailErrors.push(`${collectorEmail}: ${mailRes.error}`)
      }
    }

    // Google Sheets real-time log
    logEventToSheet({
      event_type: "split_created",
      split_slug: sanitizedSlug,
      title: title || session.title || "Bill Split",
      total_amount: numericTotal,
      organizer_name: collectorName || "Organizer",
      organizer_upi: collectorUpi || "",
      organizer_email: collectorEmail,
      status: "Active",
      notes: `Split created with ${peopleCount} people`,
      split_url: publicUrl,
    }).catch((e) => console.warn("Split create sheet logging failed:", e))

    // 2. Notify friends who have email or telegram
    for (const member of finalMembers) {
      if (member.isCollector) continue

      const settlementRow = (session.settlements as any[])?.find(
        (s) => s.from === member.id || s.from === member.name
      )
      const memberAmount = Number(member.amount ?? settlementRow?.amount ?? 0).toFixed(0)

      if (member.telegram) {
        const tgText = `🧾 <b>New Bill Split: ${title || session.title}</b>\n\nHey <b>${member.name}</b>, ${collectorName || "Organizer"} added an expense.\n\nYour share: <b>₹${memberAmount}</b>\n\n⚡ Pay in 1 tap with GPay/PhonePe: ${publicUrl}\n\n<i>Direct bank-to-bank UPI · UL0 Split</i>`
        const tgRes = await sendTelegramMessage(String(member.telegram), tgText)
        if (tgRes.success) telegramsSent++
      }

      if (member.email) {
        const { html: memberHtml, subject: memberSubject } = renderEmail("invited", {
          friend_name: member.name,
          creator_name: collectorName || "Organizer",
          split_name: title || session.title || "Group Expense",
          share_amount: `₹${memberAmount}`,
          total: `₹${numericTotal.toFixed(0)}`,
          people_count: peopleCount,
          upi_id: collectorUpi || "",
          pay_url: publicUrl,
          split_url: publicUrl,
        })

        const memberMail = await sendEmailDirect({
          to: member.email,
          subject: memberSubject || `Split Bill: Your share is ₹${memberAmount} for ${title || session.title}`,
          html: memberHtml,
          text: `You owe ₹${memberAmount} for ${title || session.title}. Pay here: ${publicUrl}`,
        })
        if (memberMail.success) {
          memberEmailsSent++
        } else if (memberMail.error) {
          emailErrors.push(`${member.email}: ${memberMail.error}`)
        }
      }
    }

    return NextResponse.json({
      success: true,
      creatorEmailSent,
      memberEmailsSent,
      telegramsSent,
      emailErrors: emailErrors.length > 0 ? emailErrors : undefined,
      message: "Split notifications processed",
    })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to notify" }, { status: 500 })
  }
}
