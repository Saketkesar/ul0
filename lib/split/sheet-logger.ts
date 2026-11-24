/**
 * UL0 Split - Google Sheets Webhook Dispatcher
 * Sends real-time event logging to Google Sheets for admin visibility.
 */

export interface SheetLogEvent {
  event_type:
    | "split_created"
    | "payment_claimed"
    | "payment_confirmed"
    | "payment_disputed"
    | "reminder_sent"
    | "split_settled"
    | "onboarding_completed"
    | "group_created"
    | "group_settled"
    | "unsubscribed"
  split_slug?: string
  title?: string
  total_amount?: number
  organizer_name?: string
  organizer_upi?: string
  organizer_email?: string
  organizer_telegram?: string
  member_name?: string
  member_share?: number
  member_contact?: string
  status?: string
  notes?: string
  split_url?: string
}

export async function logEventToSheet(event: SheetLogEvent): Promise<boolean> {
  const sheetWebhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL || ""
  const pellaBotUrl = process.env.PELLA_BOT_URL || process.env.REMINDER_BOT_URL || ""
  const botApiKey = process.env.BOT_API_KEY || "ul0_pella_live_sec_key_2026"

  let dispatched = false

  // 1. Direct post to Google Apps Script Webhook
  if (sheetWebhookUrl) {
    try {
      // Google Apps Script redirect follows 302, redirect: "follow" handles it
      fetch(sheetWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8", // text/plain prevents CORS preflight issues with Google Apps Script
        },
        body: JSON.stringify(event),
        redirect: "follow",
      }).catch((e) => console.warn("Google Sheet direct post error:", e))
      dispatched = true
    } catch (e) {
      console.warn("Direct Google Sheet error:", e)
    }
  }

  // 2. Dispatch via Pella Bot /log/sheet
  if (pellaBotUrl) {
    try {
      fetch(`${pellaBotUrl.replace(/\/$/, "")}/log/sheet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${botApiKey}`,
          "X-Bot-Key": botApiKey,
        },
        body: JSON.stringify(event),
      }).catch((e) => console.warn("Pella Bot sheet log error:", e))
      dispatched = true
    } catch (e) {
      console.warn("Pella Bot log error:", e)
    }
  }

  return dispatched
}
