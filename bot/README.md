# UL0 Split & Hisab — Notification & Admin Sync Bot

This Python bot handles:
1. **Real-time Google Sheet Logging**: Automatically appends rows for every split created, payment claimed ("Paid"), payment confirmed, payment disputed ("Not Paid"), reminder sent, and user unsubscribed.
2. **Telegram Reminders & Alerts**: Sends instant Telegram notifications to organizers and friends.
3. **Email Notifications**: Dispatches transactional emails via SMTP (Gmail, Zoho, Amazon SES, etc.).

---

## Environment Variables (Set in Pella.app or `.env`)

| Variable | Description | Example |
|---|---|---|
| `BOT_API_KEY` | Secret API key to authenticate Next.js requests | `ul0_pella_live_sec_key_2026` |
| `GOOGLE_SHEET_WEBHOOK_URL` | Web App URL from Google Apps Script deployment | `https://script.google.com/macros/s/.../exec` |
| `TELEGRAM_BOT_TOKEN` | Your Telegram Bot Token from @BotFather | `123456789:ABCdefGhI...` |
| `SENDER_EMAIL` | SMTP sender email | `notifications@ul0.site` |
| `SENDER_PASSWORD` | SMTP app password | `your-app-password` |
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `PORT` | HTTP server port | `8080` |

---

## Endpoints

- `GET /health` — Check bot status and configured integrations.
- `POST /log/sheet` — Forward any event directly to Google Sheet Webhook.
  ```json
  {
    "event_type": "payment_claimed",
    "split_slug": "trip-88",
    "title": "Goa Trip",
    "total_amount": 12000,
    "organizer_name": "Organizer",
    "member_name": "Friend",
    "member_share": 3000,
    "status": "Paid",
    "notes": "Paid via PhonePe (UTR 8812)"
  }
  ```
- `POST /notify/telegram` — Send Telegram message to `chat_id` / username.
- `POST /notify/email` — Send transactional HTML email.
- `POST /notify/split-reminder` — 1-click reminder dispatching Telegram & Email, and auto-logging to Google Sheets.

---

## How to Run Standalone
```bash
python3 bot/ul0_bot.py
```
