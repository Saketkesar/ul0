# UL0 Split & Hisab - Notification Bot for Pella.app

Standalone Python notification microservice designed to run 24/7 on [Pella.app](https://pella.app).

## Features
- **Telegram Bot Reminders**: Sends direct Telegram messages to friends with the one-click UPI payment link.
- **Email Notifications**: Delivers clean, branded HTML email reminders via SMTP.
- **Secure Webhook API**: Authenticated via `BOT_API_KEY` (Bearer token or `X-Bot-Key`).
- **Zero External Dependencies**: Uses Python's standard library (`http.server`, `smtplib`, `urllib`).

## Environment Variables on Pella.app
Add these in your Pella.app bot dashboard:

| Variable | Description | Example |
|---|---|---|
| `TELEGRAM_BOT_TOKEN` | Your Telegram Bot token from @BotFather | `1234567890:ABCdefGHIjkl...` |
| `SENDER_EMAIL` | Sender email address for SMTP | `notifications@ul0.site` or `yourgmail@gmail.com` |
| `SENDER_PASSWORD` | App password (e.g. Gmail App Password) | `abcd efgh ijkl mnop` |
| `BOT_API_KEY` | Secret key used by your UL0 website | `ul0_pella_live_sec_key_2026` |
| `PORT` | Listening port (defaults to 8080) | `8080` |

## Connecting to UL0 App
In your UL0 Next.js environment (`.env`):
```env
PELLA_BOT_URL="https://your-bot-subdomain.pella.app"
BOT_API_KEY="ul0_pella_live_sec_key_2026"
```
When an expense is created or a user taps "Send Reminder", UL0 calls your bot's `/notify/split-reminder` endpoint.
