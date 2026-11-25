const PELLA_BOT_URL =
  process.env.PELLA_BOT_URL ||
  process.env.REMINDER_BOT_URL ||
  "http://fi17.bot-hosting.cloud:25733"

/**
 * Send a Telegram notification via Telegram Bot API directly (if configured)
 * and fallback / mirror via Pella Bot with strict short timeouts so Vercel
 * lambdas never stall.
 */
export async function sendTelegramMessage(
  targetChatOrHandle: string,
  htmlMessage: string
): Promise<{ success: boolean; via?: string; error?: string }> {
  const target = (targetChatOrHandle || "").trim()
  if (!target) {
    return { success: false, error: "Empty Telegram target" }
  }

  const botToken = (process.env.TELEGRAM_BOT_TOKEN || "").trim()
  const botApiKey = (process.env.BOT_API_KEY || "ul0_pella_live_sec_key_2026").trim()
  let lastError = "Telegram bot not configured or target unreachable"

  // 1. Direct Telegram Bot API
  if (botToken) {
    try {
      const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: target,
          text: htmlMessage,
          parse_mode: "HTML",
          disable_web_page_preview: false,
        }),
        signal: AbortSignal.timeout(5000),
      })
      const tgData = await tgRes.json().catch(() => ({}))
      if (tgRes.ok && tgData?.ok) {
        return { success: true, via: "telegram-direct" }
      }
      lastError = tgData?.description || `Telegram API HTTP ${tgRes.status}`
    } catch (err: any) {
      lastError = err?.message || "Direct Telegram API failed"
    }
  }

  // 2. Fallback to Pella Bot (if direct failed or token not in Vercel)
  if (PELLA_BOT_URL) {
    try {
      const pellaRes = await fetch(`${PELLA_BOT_URL.replace(/\/$/, "")}/notify/telegram`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${botApiKey}`,
          "X-Bot-Key": botApiKey,
        },
        body: JSON.stringify({
          chat_id: target,
          target,
          text: htmlMessage,
          message: htmlMessage,
        }),
        signal: AbortSignal.timeout(4000),
      })
      const pellaData = await pellaRes.json().catch(() => ({}))
      if (pellaRes.ok && pellaData?.success !== false) {
        return { success: true, via: "pella-bot" }
      }
      lastError = pellaData?.error || `Pella Bot HTTP ${pellaRes.status}`
    } catch (err: any) {
      lastError = err?.message || "Pella Bot request failed"
    }
  }

  return { success: false, error: lastError }
}
