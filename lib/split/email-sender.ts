import nodemailer from "nodemailer"

const SENDER_EMAIL = process.env.SENDER_EMAIL || ""
const SENDER_PASSWORD = (process.env.SENDER_PASSWORD || "").trim()
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com"
const SMTP_PORT = Number(process.env.SMTP_PORT || 587)

let transporter: nodemailer.Transporter | null = null

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SENDER_EMAIL,
        pass: SENDER_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })
  }
  return transporter
}

export async function sendEmailDirect({
  to,
  subject,
  html,
  text,
}: {
  to: string
  subject: string
  html: string
  text?: string
}): Promise<{ success: boolean; error?: string; messageId?: string }> {
  if (!to || !to.includes("@")) {
    return { success: false, error: "Invalid recipient email" }
  }

  try {
    const client = getTransporter()
    const info = await client.sendMail({
      from: `"UL0 Split & Hisab" <${SENDER_EMAIL}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
    })

    console.log(`[EmailSender] Email delivered to ${to} (${info.messageId})`)
    return { success: true, messageId: info.messageId }
  } catch (err: any) {
    console.error(`[EmailSender] Direct send failed to ${to}:`, err)
    return { success: false, error: err?.message || String(err) }
  }
}
