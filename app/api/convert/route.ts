import { NextRequest, NextResponse } from "next/server"
import { checkRateLimit } from "@/lib/chat-to-pdf/rate-limiter"
import { validateShareUrl, parseFallbackText } from "@/lib/chat-to-pdf/extractor"
import { classifyContent } from "@/lib/chat-to-pdf/classifier"
import { scrapeShareLink, buildDocumentHtml, renderHtmlToPdf } from "@/lib/chat-to-pdf/pdf-renderer"
import type { ChatMessage, DocType } from "@/lib/chat-to-pdf/types"

export const dynamic = "force-dynamic"
export const maxDuration = 60

export async function POST(req: NextRequest) {
  // 1. Client IP for Rate Limiting (10 requests/min per IP)
  const forwardedFor = req.headers.get("x-forwarded-for")
  const realIp = req.headers.get("x-real-ip")
  const clientIp = (forwardedFor ? forwardedFor.split(",")[0].trim() : realIp) || "127.0.0.1"

  const rateLimit = checkRateLimit(clientIp)
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many conversion requests. Please wait a minute and try again." },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(rateLimit.resetMs / 1000).toString(),
          "X-RateLimit-Limit": "10",
          "X-RateLimit-Remaining": "0",
        },
      }
    )
  }

  let body: { url?: string; text?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 })
  }

  const { url, text } = body

  // If text is provided directly (Fallback mode)
  if (text && typeof text === "string" && text.trim().length > 0) {
    try {
      const messages: ChatMessage[] = parseFallbackText(text)
      if (messages.length === 0) {
        return NextResponse.json({ error: "No readable content provided." }, { status: 400 })
      }

      const docType: DocType = classifyContent(messages)
      const html = buildDocumentHtml(messages, docType, "Exported Chat Notes")
      const pdfBuffer = await renderHtmlToPdf(html)

      return new NextResponse(new Uint8Array(pdfBuffer), {
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="chat-${docType}.pdf"`,
          "X-Doc-Type": docType,
          "X-RateLimit-Limit": "10",
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
        },
      })
    } catch (err: any) {
      return NextResponse.json(
        { error: "Failed to generate PDF from text. Please try again." },
        { status: 500 }
      )
    }
  }

  // URL mode
  if (!url || typeof url !== "string") {
    return NextResponse.json(
      { error: "Please enter a valid Claude or ChatGPT share link, or paste text instead." },
      { status: 400 }
    )
  }

  // 2. Validate URL against claude.ai and chatgpt.com only (Strict SSRF Prevention)
  const validation = validateShareUrl(url)
  if (!validation.valid || !validation.normalizedUrl) {
    return NextResponse.json(
      {
        error:
          validation.error ||
          "Only public share links from claude.ai/share/... or chatgpt.com/share/... are supported.",
      },
      { status: 400 }
    )
  }

  // 3. Load with headless Chromium (Playwright) with a 30s timeout
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("TIMEOUT")), 30000)
  )

  try {
    const scrapePromise = scrapeShareLink(validation.normalizedUrl, 25000)
    const messages: ChatMessage[] = await Promise.race([scrapePromise, timeoutPromise])

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        {
          error:
            "Couldn't read that chat. Make sure the link is public or use the 'Paste text instead' option below.",
        },
        { status: 422 }
      )
    }

    // 4. Classify Content ("notes", "code", or "chat")
    const docType: DocType = classifyContent(messages)

    // 5. Build clean HTML & Render A4 PDF with JavaScript disabled
    const docHtml = buildDocumentHtml(messages, docType, "")
    const pdfBuffer = await Promise.race([renderHtmlToPdf(docHtml), timeoutPromise])

    // 6. Return PDF with X-Doc-Type header
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="chat-${docType}.pdf"`,
        "X-Doc-Type": docType,
        "X-RateLimit-Limit": "10",
        "X-RateLimit-Remaining": rateLimit.remaining.toString(),
      },
    })
  } catch (err: any) {
    if (err.message === "CLOUDFLARE_BLOCKED") {
      return NextResponse.json(
        {
          error:
            "This share link is temporarily protected by Cloudflare bot verification. Please copy the conversation text and use the 'Paste text instead' option below.",
          cloudflare: true,
        },
        { status: 422 }
      )
    }

    if (err.message === "TIMEOUT") {
      return NextResponse.json(
        {
          error:
            "The request timed out after 30 seconds. Make sure the chat link is public and accessible, or paste the text directly.",
        },
        { status: 504 }
      )
    }

    return NextResponse.json(
      {
        error:
          "Couldn't read that chat. Make sure the link is public or use the 'Paste text instead' option below.",
      },
      { status: 422 }
    )
  }
}
