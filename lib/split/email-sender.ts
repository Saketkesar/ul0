import nodemailer from "nodemailer"

function getSmtpConfig() {
  const senderEmail = (process.env.SENDER_EMAIL || "").trim()
  const senderPassword = (process.env.SENDER_PASSWORD || "").trim()
  const smtpHost = (process.env.SMTP_HOST || "smtp.gmail.com").trim()
  const smtpPort = Number((process.env.SMTP_PORT || "587").trim()) || 587
  return { senderEmail, senderPassword, smtpHost, smtpPort }
}

function createSmtpTransport() {
  const { senderEmail, senderPassword, smtpHost, smtpPort } = getSmtpConfig()
  if (!senderEmail || !senderPassword) {
    return null
  }
  return {
    senderEmail,
    transporter: nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      pool: false,
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      auth: {
        user: senderEmail,
        pass: senderPassword,
      },
      tls: {
        rejectUnauthorized: false,
      },
    }),
  }
}

function isTransientNetworkError(err: any): boolean {
  const code = String(err?.code || "").toUpperCase()
  const msg = String(err?.message || "").toLowerCase()
  return (
    code === "ECONNRESET" ||
    code === "ETIMEDOUT" ||
    code === "ECONNECTION" ||
    code === "ESOCKET" ||
    msg.includes("socket close") ||
    msg.includes("timeout")
  )
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
  const recipient = (to || "").trim()
  if (!recipient || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
    return { success: false, error: "Invalid recipient email" }
  }

  const setup = createSmtpTransport()
  if (!setup) {
    console.error("[EmailSender] Missing SENDER_EMAIL or SENDER_PASSWORD environment variables")
    return { success: false, error: "Email sender credentials are not configured on server" }
  }

  const mailOptions = {
    from: `"UL0 Split & Hisab" <${setup.senderEmail}>`,
    replyTo: setup.senderEmail,
    to: recipient,
    subject,
    html,
    text: text || html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
  }

  for (let attempt = 1; attempt <= 2; attempt++) {
    const clientSetup = attempt === 1 ? setup : createSmtpTransport()!
    try {
      const info = await clientSetup.transporter.sendMail(mailOptions)
      try {
        clientSetup.transporter.close()
      } catch {}

      if (Array.isArray(info.rejected) && info.rejected.length > 0 && (!info.accepted || info.accepted.length === 0)) {
        const rejMsg = `Recipient rejected by SMTP server: ${info.rejected.join(", ")}`
        console.error(`[EmailSender] ${rejMsg}`)
        return { success: false, error: rejMsg }
      }

      console.log(`[EmailSender] Email delivered to ${recipient} (${info.messageId})`)
      return { success: true, messageId: info.messageId }
    } catch (err: any) {
      try {
        clientSetup.transporter.close()
      } catch {}
      console.error(`[EmailSender] Attempt ${attempt} failed for ${recipient}:`, err?.message || err)
      if (attempt === 1 && isTransientNetworkError(err)) {
        continue
      }
      return { success: false, error: err?.message || String(err) }
    }
  }

  return { success: false, error: "Email sending failed after retry" }
}
