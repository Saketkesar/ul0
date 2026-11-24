#!/usr/bin/env python3
"""
UL0 Split & Hisab - Notification Bot for Pella.app
Handles:
- Telegram reminders & payment alerts
- Email notifications via SMTP
- Webhook trigger endpoint with API key authentication
"""

import os
import sys
import json
import smtplib
import urllib.request
import urllib.parse
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from http.server import HTTPServer, BaseHTTPRequestHandler

# Configuration from Environment Variables (set in Pella.app dashboard)
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
SENDER_EMAIL = os.getenv("SENDER_EMAIL", "").strip()
SENDER_PASSWORD = os.getenv("SENDER_PASSWORD", "").strip()
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com").strip()
SMTP_PORT = int(os.getenv("SMTP_PORT", "587").strip())
PORT = int(os.getenv("PORT", "8080").strip())

# Shared API Key for authenticating Next.js webhook calls
BOT_API_KEY = os.getenv("BOT_API_KEY", "ul0_pella_live_sec_key_2026").strip()

print("=" * 60)
print("  UL0 Notification Bot starting on Pella.app...")
print(f"  Port: {PORT}")
print(f"  Telegram Token configured: {'YES' if TELEGRAM_BOT_TOKEN else 'NO (Set TELEGRAM_BOT_TOKEN)'}")
print(f"  Sender Email configured: {'YES' if SENDER_EMAIL else 'NO (Set SENDER_EMAIL & SENDER_PASSWORD)'}")
print(f"  API Key: {BOT_API_KEY[:6]}...{BOT_API_KEY[-4:] if len(BOT_API_KEY) > 10 else ''}")
print("=" * 60)

def send_telegram_message(target_chat_id: str, message: str) -> dict:
    if not TELEGRAM_BOT_TOKEN:
        return {"success": False, "error": "TELEGRAM_BOT_TOKEN not configured"}
    
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": target_chat_id,
        "text": message,
        "parse_mode": "HTML",
        "disable_web_page_preview": False
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"}
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            result = json.loads(resp.read().decode("utf-8"))
            return {"success": result.get("ok", False), "result": result}
    except Exception as e:
        return {"success": False, "error": str(e)}

def send_email_message(to_email: str, subject: str, html_body: str, text_body: str = "") -> dict:
    if not SENDER_EMAIL or not SENDER_PASSWORD:
        return {"success": False, "error": "SENDER_EMAIL and SENDER_PASSWORD not configured"}

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"UL0 Split & Hisab <{SENDER_EMAIL}>"
    msg["To"] = to_email

    if text_body:
        msg.attach(MIMEText(text_body, "plain"))
    if html_body:
        msg.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=12) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(SENDER_EMAIL, SENDER_PASSWORD)
            server.sendmail(SENDER_EMAIL, [to_email], msg.as_string())
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}

class NotificationHandler(BaseHTTPRequestHandler):
    def _send_json(self, status: int, data: dict):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Bot-Key")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode("utf-8"))

    def do_OPTIONS(self):
        self._send_json(200, {"status": "ok"})

    def _verify_auth(self) -> bool:
        auth_header = self.headers.get("Authorization", "")
        custom_key = self.headers.get("X-Bot-Key", "")
        token = ""
        if auth_header.startswith("Bearer "):
            token = auth_header[7:].strip()
        elif custom_key:
            token = custom_key.strip()

        return token == BOT_API_KEY

    def do_GET(self):
        if self.path in ["/", "/health"]:
            self._send_json(200, {
                "status": "healthy",
                "service": "ul0-notification-bot",
                "telegram_configured": bool(TELEGRAM_BOT_TOKEN),
                "email_configured": bool(SENDER_EMAIL and SENDER_PASSWORD),
                "api_key_hint": f"{BOT_API_KEY[:4]}...{BOT_API_KEY[-4:] if len(BOT_API_KEY) > 8 else ''}"
            })
            return
        self._send_json(404, {"error": "Not Found"})

    def do_POST(self):
        if not self._verify_auth():
            self._send_json(401, {"error": "Unauthorized: Invalid or missing BOT_API_KEY"})
            return

        length = int(self.headers.get("Content-Length", 0))
        raw_body = self.rfile.read(length).decode("utf-8") if length > 0 else "{}"
        try:
            body = json.loads(raw_body)
        except Exception:
            self._send_json(400, {"error": "Invalid JSON body"})
            return

        path = self.path.split("?")[0]

        # 1. Send Telegram Notification
        if path == "/notify/telegram":
            target = body.get("target") or body.get("chat_id")
            message = body.get("message", "")
            if not target or not message:
                self._send_json(400, {"error": "Missing target or message"})
                return
            res = send_telegram_message(str(target), message)
            self._send_json(200 if res.get("success") else 500, res)
            return

        # 2. Send Email Notification
        if path == "/notify/email":
            to_email = body.get("to")
            subject = body.get("subject", "UL0 Split Notification")
            html = body.get("html", "")
            text = body.get("text", "")
            if not to_email or (not html and not text):
                self._send_json(400, {"error": "Missing to or message content"})
                return
            res = send_email_message(to_email, subject, html, text)
            self._send_json(200 if res.get("success") else 500, res)
            return

        # 3. Combined Split Reminder Trigger
        if path == "/notify/split-reminder":
            split_title = body.get("title", "Group Bill")
            settle_url = body.get("settle_url", "https://ul0.site/split")
            amount = body.get("amount", 0)
            member_name = body.get("member_name", "Friend")
            collector_name = body.get("collector_name", "Organizer")
            to_email = body.get("email")
            telegram_target = body.get("telegram")

            results = {}

            # Prepare message
            tg_text = (
                f"💸 <b>Bill Reminder from {collector_name}</b>\n\n"
                f"Hey <b>{member_name}</b>, your share for <b>{split_title}</b> is <b>₹{amount}</b>.\n\n"
                f"⚡ Pay in 1-tap via UPI (no app needed):\n"
                f"{settle_url}\n\n"
                f"<i>Powered by UL0 Split & Hisab</i>"
            )

            html_email = f"""
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #E4E2DA; border-radius: 16px;">
                <h2 style="color: #1B685C; margin-top: 0;">Split Bill Reminder</h2>
                <p style="font-size: 15px; color: #0B1A17; line-height: 1.5;">
                    Hey <strong>{member_name}</strong>, <strong>{collector_name}</strong> has requested your share for <strong>{split_title}</strong>.
                </p>
                <div style="margin: 20px 0; padding: 18px; background: #F4FAF8; border-radius: 12px; border: 1px solid #D3E2DD; text-align: center;">
                    <div style="font-size: 13px; color: #5E726C; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Amount Due</div>
                    <div style="font-size: 32px; color: #1B685C; font-weight: 800; margin-top: 4px;">₹{amount}</div>
                </div>
                <div style="text-align: center; margin: 28px 0;">
                    <a href="{settle_url}" style="background: #1B685C; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 99px; font-weight: bold; font-size: 15px; display: inline-block;">
                        Pay with UPI (Zero Apps) →
                    </a>
                </div>
                <p style="font-size: 12px; color: #5E726C; text-align: center; border-top: 1px solid #E4E2DA; padding-top: 16px; margin-bottom: 0;">
                    UL0 Split · Bank to Bank UPI · No signup needed for friends
                </p>
            </div>
            """

            if telegram_target:
                results["telegram"] = send_telegram_message(telegram_target, tg_text)
            if to_email:
                results["email"] = send_email_message(to_email, f"Reminder: ₹{amount} for {split_title}", html_email, tg_text)

            self._send_json(200, {"success": True, "details": results})
            return

        self._send_json(404, {"error": "Endpoint not found"})

def run_server():
    server = HTTPServer(("0.0.0.0", PORT), NotificationHandler)
    print(f"🚀 Notification Bot HTTP server running on port {PORT}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping bot...")
        server.server_close()

if __name__ == "__main__":
    run_server()
