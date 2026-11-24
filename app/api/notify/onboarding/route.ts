import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

const PELLA_BOT_URL = process.env.PELLA_BOT_URL || process.env.REMINDER_BOT_URL || ""
const BOT_API_KEY = process.env.BOT_API_KEY || "ul0_pella_live_sec_key_2026"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, upiId, email, telegram, bankName } = body

    if (!email) {
      return NextResponse.json({ success: true, message: "No email provided" })
    }

    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #E4E2DA; border-radius: 16px;">
        <h2 style="color: #1B685C; margin-top: 0;">Welcome to UL0 Split & Hisab! 🎉</h2>
        <p style="font-size: 15px; color: #0B1A17; line-height: 1.5;">
          Hey <strong>${name}</strong>, your Split profile is now set up and ready to collect payments directly to your bank account.
        </p>
        <div style="margin: 20px 0; padding: 16px; background: #F4FAF8; border-radius: 12px; border: 1px solid #D3E2DD;">
          <div style="font-size: 12px; color: #5E726C; text-transform: uppercase; font-weight: bold;">Verified UPI Account</div>
          <div style="font-size: 18px; color: #0B1A17; font-weight: 700; margin-top: 4px; font-family: monospace;">${upiId}</div>
          ${bankName ? `<div style="font-size: 12px; color: #1B685C; margin-top: 4px; font-weight: 600;">Bank: ${bankName}</div>` : ""}
        </div>
        <p style="font-size: 14px; color: #5E726C; line-height: 1.5;">
          When you create a split, your friends can pay you in 1-tap via Google Pay, PhonePe, Paytm, or BHIM. Zero app downloads. Zero fees. Money goes bank-to-bank.
        </p>
        <div style="text-align: center; margin: 24px 0;">
          <a href="https://ul0.site/split/dashboard" style="background: #1B685C; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 99px; font-weight: bold; font-size: 14px; display: inline-block;">
            Open Splits Dashboard →
          </a>
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
            to: email,
            subject: "Welcome to UL0 Split & Hisab! Your account is active",
            html: htmlBody,
            text: `Welcome to UL0 Split & Hisab! Your verified UPI ID is ${upiId}. Start splitting at https://ul0.site/split/dashboard`,
          }),
        })
      } catch (e) {
        console.warn("Pella Bot email dispatch warning:", e)
      }
    }

    return NextResponse.json({ success: true, message: "Onboarding email triggered" })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
