import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

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

    // 1. Send confirmation email to creator
    if (collectorEmail) {
      const creatorHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #E4E2DA; border-radius: 16px;">
          <h2 style="color: #1B685C; margin-top: 0;">New Split Created: ${title || "Split Bill"} 🧾</h2>
          <p style="font-size: 15px; color: #0B1A17; line-height: 1.5;">
            Hey <strong>${collectorName || "Organizer"}</strong>, your bill split is live! Friends can open the link and pay directly to your UPI ID <code>${collectorUpi}</code>.
          </p>
          <div style="margin: 20px 0; padding: 18px; background: #F4FAF8; border-radius: 12px; border: 1px solid #D3E2DD;">
            <div style="font-size: 12px; color: #5E726C; text-transform: uppercase; font-weight: bold;">Total Bill Amount</div>
            <div style="font-size: 26px; color: #0B1A17; font-weight: 800; margin-top: 4px; font-family: monospace;">₹${Number(totalAmount).toFixed(2)}</div>
            <div style="font-size: 13px; color: #1B685C; margin-top: 6px;">Receiving on UPI: <strong>${collectorUpi}</strong></div>
          </div>
          
          <div style="margin: 16px 0;">
            <p style="font-size: 13px; font-weight: bold; color: #0B1A17; margin-bottom: 8px;">Breakdown:</p>
            <ul style="font-size: 13px; color: #5E726C; padding-left: 20px; line-height: 1.8;">
              ${members
                .map(
                  (m: any) =>
                    `<li><strong>${m.name}</strong>: ₹${Number(m.amount || 0).toFixed(2)} ${m.isCollector ? "(Organizer)" : ""}</li>`
                )
                .join("")}
            </ul>
          </div>

          <div style="text-align: center; margin: 26px 0;">
            <a href="${publicUrl}" style="background: #1B685C; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 99px; font-weight: bold; font-size: 14px; display: inline-block; margin-right: 8px;">
              View Settle Page →
            </a>
            ${
              manageUrl
                ? `<a href="${manageUrl}" style="background: #0B1A17; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 99px; font-weight: bold; font-size: 14px; display: inline-block;">
                    Manage Split
                  </a>`
                : ""
            }
          </div>

          <p style="font-size: 12px; color: #5E726C; text-align: center; border-top: 1px solid #E4E2DA; padding-top: 14px; margin-bottom: 0;">
            UL0 Split · Bank to Bank UPI · Simple & Private
          </p>
        </div>
      `

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
              subject: `Split Created: ${title || "Bill Split"} (₹${totalAmount})`,
              html: creatorHtml,
              text: `Split created for ${title} (₹${totalAmount}). Settle link: ${publicUrl}`,
            }),
          })
        } catch (e) {
          console.warn("Creator email notification error:", e)
        }
      }
    }

    // 2. Auto-notify friends if they provided email or telegram
    for (const member of members) {
      if (member.isCollector) continue

      // Telegram notification
      if (member.telegram) {
        const tgText = `🧾 <b>New Bill Split: ${title}</b>\n\nHey <b>${member.name}</b>, ${collectorName || "Organizer"} added an expense.\n\nYour share: <b>₹${Number(member.amount || 0).toFixed(2)}</b>\n\n⚡ Pay in 1 tap with GPay/PhonePe: ${publicUrl}\n\n<i>Direct bank-to-bank UPI · UL0 Split</i>`
        
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

      // Email notification
      if (member.email) {
        const memberHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #E4E2DA; border-radius: 16px;">
            <h2 style="color: #1B685C; margin-top: 0;">New Split from ${collectorName || "Organizer"} 🧾</h2>
            <p style="font-size: 15px; color: #0B1A17; line-height: 1.5;">
              Hey <strong>${member.name}</strong>, you have been added to a bill split for <strong>${title || "Group Expense"}</strong>.
            </p>
            <div style="margin: 20px 0; padding: 18px; background: #F4FAF8; border-radius: 12px; border: 1px solid #D3E2DD;">
              <div style="font-size: 12px; color: #5E726C; text-transform: uppercase; font-weight: bold;">Your Share</div>
              <div style="font-size: 28px; color: #1B685C; font-weight: 800; margin-top: 4px; font-family: monospace;">₹${Number(member.amount || 0).toFixed(2)}</div>
              <div style="font-size: 13px; color: #5E726C; margin-top: 6px;">Pay to <strong>${collectorName}</strong> via UPI (${collectorUpi})</div>
            </div>
            <div style="text-align: center; margin: 26px 0;">
              <a href="${publicUrl}" style="background: #1B685C; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 99px; font-weight: bold; font-size: 15px; display: inline-block;">
                Pay Now with UPI →
              </a>
            </div>
            <p style="font-size: 12px; color: #5E726C; text-align: center; border-top: 1px solid #E4E2DA; padding-top: 14px; margin-bottom: 0;">
              No apps or signups needed. Money goes directly bank-to-bank.
            </p>
          </div>
        `

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
                subject: `Split Bill: Your share is ₹${Number(member.amount || 0).toFixed(2)} for ${title}`,
                html: memberHtml,
                text: `You owe ₹${Number(member.amount || 0).toFixed(2)} for ${title}. Pay here: ${publicUrl}`,
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
