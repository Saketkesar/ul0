import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { renderEmail } from "@/lib/split/email-templates"
import { logEventToSheet } from "@/lib/split/sheet-logger"

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
      title,
      totalAmount,
      collectorName,
      collectorEmail,
      collectorUpi,
      manageUrl,
      settleUrl,
      members = [],
    } = body

    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 })
    }

    const publicUrl = settleUrl || `https://ul0.site/split/${slug}`
    const peopleCount = members.length || 2
    const perPerson = totalAmount && peopleCount > 0 ? (Number(totalAmount) / peopleCount).toFixed(0) : "0"

    // 1. Send confirmation email to creator using template 02-split-created.html
    if (collectorEmail) {
      const { html: creatorHtml, subject: creatorSubject } = renderEmail("split-created", {
        split_name: title || "Split Bill",
        total: `₹${Number(totalAmount).toFixed(0)}`,
        people_count: peopleCount,
        per_person: `₹${perPerson}`,
        split_link: `ul0.site/split/${slug}`,
        split_url: publicUrl,
        cta_url: manageUrl || publicUrl,
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
              to: collectorEmail,
              subject: creatorSubject || `Split Created: ${title || "Bill Split"} (₹${totalAmount})`,
              html: creatorHtml,
              text: `Split created for ${title} (₹${totalAmount}). Settle link: ${publicUrl}`,
            }),
          })
        } catch (e) {
          console.warn("Creator email notification error:", e)
        }
      }
    }

    // Google Sheets real-time log for split creation
    logEventToSheet({
      event_type: "split_created",
      split_slug: slug,
      title: title || "Bill Split",
      total_amount: Number(totalAmount) || 0,
      organizer_name: collectorName || "Organizer",
      organizer_upi: collectorUpi || "",
      organizer_email: collectorEmail || "",
      status: "Active",
      notes: `Split created with ${peopleCount} people`,
      split_url: publicUrl,
    }).catch((e) => console.warn("Split create sheet logging failed:", e))

    // 2. Auto-notify friends if they provided email or telegram
    for (const member of members) {
      if (member.isCollector) continue

      const memberAmount = Number(member.amount || 0).toFixed(0)

      // Telegram notification
      if (member.telegram) {
        const tgText = `🧾 <b>New Bill Split: ${title}</b>\n\nHey <b>${member.name}</b>, ${collectorName || "Organizer"} added an expense.\n\nYour share: <b>₹${memberAmount}</b>\n\n⚡ Pay in 1 tap with GPay/PhonePe: ${publicUrl}\n\n<i>Direct bank-to-bank UPI · UL0 Split</i>`
        
        // Pella Bot first
        if (PELLA_BOT_URL) {
          try {
            await fetch(`${PELLA_BOT_URL.replace(/\/$/, "")}/notify/telegram`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${BOT_API_KEY}`,
                "X-Bot-Key": BOT_API_KEY,
              },
              body: JSON.stringify({
                chat_id: member.telegram,
                text: tgText,
              }),
            })
          } catch (e) {
            console.warn("Pella telegram error:", e)
          }
        } else if (TELEGRAM_BOT_TOKEN) {
          try {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: member.telegram,
                text: tgText,
                parse_mode: "HTML",
              }),
            })
          } catch (e) {
            console.warn("Direct telegram error:", e)
          }
        }
      }

      // Email notification using template 04-invited.html
      if (member.email) {
        const { html: memberHtml, subject: memberSubject } = renderEmail("invited", {
          friend_name: member.name,
          creator_name: collectorName || "Organizer",
          split_name: title || "Group Expense",
          share_amount: `₹${memberAmount}`,
          total: `₹${Number(totalAmount).toFixed(0)}`,
          people_count: peopleCount,
          upi_id: collectorUpi || "",
          pay_url: publicUrl,
          split_url: publicUrl,
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
                to: member.email,
                subject: memberSubject || `Split Bill: Your share is ₹${memberAmount} for ${title}`,
                html: memberHtml,
                text: `You owe ₹${memberAmount} for ${title}. Pay here: ${publicUrl}`,
              }),
            })
          } catch (e) {
            console.warn("Member email error:", e)
          }
        }
      }
    }

    return NextResponse.json({ success: true, message: "Split notifications processed" })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
