import { jsPDF } from "jspdf"
import type { ChatMessage, DocType } from "./types.ts"
import { getPlatformSelectors } from "./extractor.ts"

let sharedBrowser: any = null

export async function closeBrowser(): Promise<void> {
  if (sharedBrowser && sharedBrowser.isConnected()) {
    try {
      await sharedBrowser.close()
    } catch {}
    sharedBrowser = null
  }
}

async function getBrowser(): Promise<any> {
  if (sharedBrowser && sharedBrowser.isConnected()) {
    return sharedBrowser
  }

  const isServerless = !!(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_VERSION ||
    process.env.AWS_EXECUTION_ENV
  )

  if (isServerless) {
    try {
      const sparticuzChromium = (await import("@sparticuz/chromium")).default
      const { chromium: playwrightCore } = await import("playwright-core")

      // Disable graphics mode on headless AWS Lambda / Vercel
      sparticuzChromium.setGraphicsMode = false
      const executablePath = await sparticuzChromium.executablePath()

      sharedBrowser = await playwrightCore.launch({
        args: [
          ...sparticuzChromium.args,
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--single-process",
        ],
        executablePath,
        headless: true,
      })
      return sharedBrowser
    } catch (serverlessError) {
      console.warn("[Chat-to-PDF] Failed serverless chromium launch, attempting playwright fallback:", serverlessError)
    }
  }

  // Standard Playwright launch (Local development / standard server)
  const { chromium } = await import("playwright")
  sharedBrowser = await chromium.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
  })

  return sharedBrowser
}

/**
 * Scrapes a public Claude or ChatGPT share link using headless Chromium.
 * Extracts messages (role + sanitized HTML + text).
 * Timeouts after 25s.
 */
export async function scrapeShareLink(url: string, timeoutMs = 14000): Promise<ChatMessage[]> {
  const browser = await getBrowser()
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    viewport: { width: 1280, height: 900 },
  })

  const page = await context.newPage()
  page.setDefaultTimeout(timeoutMs)

  try {
    // Navigate with timeout
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 9000 })
    } catch (navErr) {
      console.warn("[Chat-to-PDF] Navigation timeout or warning:", navErr)
    }

    // Wait a brief moment or for core elements to populate
    const selectors = getPlatformSelectors(url)

    try {
      await page.waitForSelector(selectors.messageContainerSelector, { timeout: 4000 })
    } catch {
      // If specific selectors didn't appear immediately, continue to inspect DOM
    }

    // Give dynamic client hydration 500ms to finish rendering
    await page.waitForTimeout(500)

    // Check if Cloudflare challenge or bot gate is present
    const isCloudflare = await page.evaluate(() => {
      const title = document.title || ""
      const body = document.body ? document.body.innerText : ""
      return (
        title.includes("Just a moment") ||
        body.includes("Performing security verification") ||
        body.includes("cf-mitigated") ||
        document.querySelector("#challenge-running") !== null ||
        document.querySelector(".cf-turnstile") !== null
      )
    })

    if (isCloudflare) {
      throw new Error("CLOUDFLARE_BLOCKED")
    }

    // Extract messages inside page context
    const extracted = await page.evaluate(
      ({ selectors, platform }) => {
        const results: { role: "user" | "assistant"; html: string; text: string }[] = []

        if (platform === "chatgpt") {
          const elements = document.querySelectorAll(selectors.messageContainerSelector)
          elements.forEach((el) => {
            const roleAttr = el.getAttribute("data-message-role") || el.getAttribute("data-message-author-role")
            const role: "user" | "assistant" = roleAttr === "user" ? "user" : "assistant"

            let contentEl = el
            if (role === "assistant") {
              const assistantMd = el.querySelector("[data-assistant-markdown]") || el.querySelector(".markdown")
              if (assistantMd) contentEl = assistantMd as HTMLElement
            } else {
              const userBubble = el.querySelector("[data-user-message-bubble]")
              if (userBubble) contentEl = userBubble as HTMLElement
            }

            const clone = contentEl.cloneNode(true) as HTMLElement
            clone.querySelectorAll('button, svg, [data-testid*="actions"]').forEach((n) => n.remove())

            const text = (clone.textContent || "").trim()
            const html = clone.innerHTML || ""

            if (text.length > 0) {
              results.push({ role, html, text })
            }
          })
        } else {
          // Claude
          const containers = document.querySelectorAll(selectors.messageContainerSelector)
          containers.forEach((el) => {
            const isUser = el.getAttribute("data-testid") === "user-message"
            const role: "user" | "assistant" = isUser ? "user" : "assistant"

            const clone = el.cloneNode(true) as HTMLElement
            // Clean up screen-reader labels, action bars, copy buttons, report links
            clone.querySelectorAll('.sr-only, [data-testid*="actions"], [data-testid*="copy"], button, a[href*="report"]').forEach((node) => {
              node.remove()
            })

            const text = (clone.textContent || "").trim()
            const html = clone.innerHTML || ""

            if (text.length > 0) {
              results.push({ role, html, text })
            }
          })
        }

        // Generic fallback if platform selectors didn't match anything
        if (results.length === 0) {
          const articles = document.querySelectorAll("article, main, [role='main']")
          articles.forEach((art) => {
            const text = art.textContent || ""
            if (text.trim().length > 20) {
              results.push({
                role: "assistant",
                html: art.innerHTML,
                text,
              })
            }
          })
        }

        return results
      },
      { selectors, platform: selectors.platform }
    )

    return extracted
  } finally {
    await context.close()
  }
}

/**
 * Builds clean typography HTML styled according to classification:
 * - "notes": document style, no speaker labels, first question as topic line
 * - "code": monospace blocks that wrap and don't split across pages
 * - "chat": user messages as soft tinted blocks, answers below
 */
export function buildDocumentHtml(
  messages: ChatMessage[],
  docType: DocType,
  title: string
): string {
  const isNotes = docType === "notes"
  const isCode = docType === "code"
  const isChat = docType === "chat"

  let firstUserQuestion = ""
  for (const m of messages) {
    if (m.role === "user" && m.text.trim()) {
      firstUserQuestion = m.text.trim().slice(0, 160)
      break
    }
  }

  const docTitle = title || firstUserQuestion || "Conversation Export"

  let bodyContent = ""

  if (isNotes) {
    // Document style: Topic line, no speaker labels
    bodyContent += `
      <header class="notes-header">
        <h1 class="notes-title">${escapeHtml(docTitle)}</h1>
        <div class="notes-meta">Document Summary • Exported with UL0</div>
      </header>
    `

    for (const msg of messages) {
      // In notes mode, skip the user's first question if it's already the topic header
      if (msg.role === "user" && msg.text.trim().slice(0, 160) === firstUserQuestion) {
        continue
      }

      bodyContent += `
        <section class="notes-section">
          ${msg.html}
        </section>
      `
    }
  } else if (isCode) {
    // Code style: Clean header, monospace wrapped containers that don't split across pages
    bodyContent += `
      <header class="code-header">
        <h1 class="doc-title">${escapeHtml(docTitle)}</h1>
        <div class="doc-badge">Code & Technical Reference</div>
      </header>
    `

    for (const msg of messages) {
      const isUser = msg.role === "user"
      bodyContent += `
        <div class="message-row ${isUser ? "user-row" : "assistant-row"}">
          <div class="role-label">${isUser ? "Question / Request" : "Solution / Implementation"}</div>
          <div class="content-body code-content">
            ${msg.html}
          </div>
        </div>
      `
    }
  } else {
    // Chat style: User messages as soft tinted blocks, answers below
    bodyContent += `
      <header class="chat-header">
        <h1 class="doc-title">${escapeHtml(docTitle)}</h1>
        <div class="doc-badge">Conversation Transcript</div>
      </header>
    `

    for (const msg of messages) {
      const isUser = msg.role === "user"
      bodyContent += `
        <div class="chat-message ${isUser ? "user-tint-bubble" : "assistant-message"}">
          <div class="chat-author">${isUser ? "Prompt" : "AI Response"}</div>
          <div class="content-body">
            ${msg.html}
          </div>
        </div>
      `
    }
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(docTitle)}</title>
  <style>
    /* Print & Typography Reset */
    @page {
      size: A4;
      margin: 20mm 16mm 20mm 16mm;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 13.5px;
      line-height: 1.65;
      color: #1e293b;
      background: #ffffff;
    }

    /* Clean Typography */
    h1, h2, h3, h4, h5, h6 {
      color: #0f172a;
      font-weight: 700;
      line-height: 1.3;
      margin-top: 1.4em;
      margin-bottom: 0.5em;
      page-break-after: avoid;
      break-after: avoid;
    }

    h1 { font-size: 22px; }
    h2 { font-size: 17px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
    h3 { font-size: 15px; }

    p {
      margin-top: 0;
      margin-bottom: 0.9em;
      word-break: break-word;
    }

    /* Lists */
    ul, ol {
      margin-top: 0.4em;
      margin-bottom: 0.9em;
      padding-left: 1.5em;
    }

    li {
      margin-bottom: 0.35em;
    }

    /* Code & Monospace: Wrap and avoid splitting across pages */
    pre, code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
      font-size: 12px;
    }

    code:not(pre code) {
      background: #f1f5f9;
      color: #0f172a;
      padding: 2px 5px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
      font-size: 12px;
    }

    pre {
      background: #0f172a !important;
      color: #f8fafc !important;
      padding: 14px 16px;
      border-radius: 8px;
      overflow-x: auto;
      white-space: pre-wrap !important;
      word-break: break-word !important;
      word-wrap: break-word !important;
      margin: 1em 0;
      border: 1px solid #1e293b;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
    }

    pre code {
      color: inherit;
      background: none;
      padding: 0;
      border: none;
      font-size: 11.5px;
      line-height: 1.55;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.2em 0;
      font-size: 12px;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    th, td {
      border: 1px solid #cbd5e1;
      padding: 8px 12px;
      text-align: left;
    }

    th {
      background: #f8fafc;
      font-weight: 600;
      color: #0f172a;
    }

    blockquote {
      margin: 1em 0;
      padding: 8px 16px;
      border-left: 3px solid #1B685C;
      background: #f8fafc;
      color: #475569;
      font-style: italic;
    }

    /* Notes Style */
    .notes-header {
      border-bottom: 2px solid #1B685C;
      padding-bottom: 12px;
      margin-bottom: 24px;
    }

    .notes-title {
      margin: 0 0 6px 0;
      font-size: 24px;
      color: #0f172a;
    }

    .notes-meta {
      font-size: 11px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
    }

    .notes-section {
      margin-bottom: 20px;
    }

    /* Code Style */
    .code-header {
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 14px;
      margin-bottom: 24px;
    }

    .doc-title {
      margin: 0 0 6px 0;
      font-size: 21px;
      color: #0f172a;
    }

    .doc-badge {
      display: inline-block;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 3px 8px;
      border-radius: 4px;
      background: #ecfdf5;
      color: #1B685C;
      border: 1px solid #a7f3d0;
    }

    .message-row {
      margin-bottom: 24px;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .role-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748b;
      margin-bottom: 6px;
    }

    /* Chat Style */
    .chat-header {
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 14px;
      margin-bottom: 24px;
    }

    .chat-message {
      margin-bottom: 22px;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    /* User messages as soft tinted blocks */
    .user-tint-bubble {
      background: #f0fdf4 !important;
      border: 1px solid #bbf7d0;
      border-radius: 12px;
      padding: 14px 18px;
      margin-left: 20px;
      margin-bottom: 22px;
    }

    .user-tint-bubble .chat-author {
      color: #166534;
      font-weight: 700;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 6px;
    }

    .assistant-message {
      padding: 4px 0 16px 0;
      border-bottom: 1px solid #f1f5f9;
    }

    .assistant-message .chat-author {
      color: #0284c7;
      font-weight: 700;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }

    /* Watermark / Footer Mark */
    .doc-watermark-footer {
      margin-top: 36px;
      padding-top: 14px;
      border-top: 1px dashed #cbd5e1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 10px;
      color: #64748b;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .doc-watermark-footer .brand-mark {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      color: #1B685C;
      font-weight: 600;
      text-decoration: none;
    }
  </style>
</head>
<body>
  ${bodyContent}
  <footer class="doc-watermark-footer">
    <div class="brand-mark">
      <svg width="13" height="13" viewBox="0 0 128 128" style="vertical-align: middle;">
        <rect width="128" height="128" rx="34" fill="#0E2F27"/>
        <rect x="26" y="50" width="48" height="28" rx="14" fill="#EAFCF7" stroke="#3DDBB8" stroke-width="6"/>
        <rect x="54" y="50" width="48" height="28" rx="14" fill="#3DDBB8" stroke="#16483C" stroke-width="6"/>
      </svg>
      <span>Created by <strong>ul0.site</strong> • Fast &amp; Private AI to PDF</span>
    </div>
    <span>100% Private Client Export</span>
  </footer>
</body>
</html>`
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

/**
 * Pure Node / jsPDF fallback renderer that guarantees A4 PDF generation
 * even if headless Chromium fails to launch or runs out of memory on serverless.
 */
export function renderFallbackPdfWithJsPdf(
  messages: ChatMessage[],
  docType: DocType = "chat",
  title?: string
): Buffer {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  const pageWidth = 210
  const pageHeight = 297
  const marginX = 18
  const contentWidth = pageWidth - marginX * 2
  const marginBottom = 22

  let cursorY = 22

  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > pageHeight - marginBottom) {
      doc.addPage()
      cursorY = 20
      return true
    }
    return false
  }

  // 1. Document Title
  const docTitle =
    title ||
    (messages[0]?.role === "user" ? messages[0].text.slice(0, 100) : "Exported Chat Notes")
  doc.setFont("helvetica", "bold")
  doc.setFontSize(16)
  doc.setTextColor(15, 23, 42) // #0f172a
  const titleLines = doc.splitTextToSize(docTitle, contentWidth)
  doc.text(titleLines, marginX, cursorY)
  cursorY += titleLines.length * 7 + 2

  // Badge / Meta
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(27, 104, 92) // #1B685C
  const typeLabel =
    docType === "code"
      ? "Code & Technical Reference"
      : docType === "notes"
      ? "Document Summary Notes"
      : "Conversation Transcript"
  doc.text(typeLabel.toUpperCase() + " • EXPORTED WITH UL0.SITE", marginX, cursorY)
  cursorY += 6

  // Divider
  doc.setDrawColor(226, 232, 240) // #e2e8f0
  doc.line(marginX, cursorY, marginX + contentWidth, cursorY)
  cursorY += 8

  // 2. Iterate messages
  for (const msg of messages) {
    const isUser = msg.role === "user"

    checkPageBreak(15)

    if (isUser) {
      doc.setFont("helvetica", "bold")
      doc.setFontSize(10)
      doc.setTextColor(22, 101, 52) // emerald
      doc.text("PROMPT / USER", marginX, cursorY)
      cursorY += 5

      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)
      doc.setTextColor(15, 23, 42)
      const userLines = doc.splitTextToSize(msg.text, contentWidth - 6)

      // Light tinted background for user prompts
      const boxHeight = userLines.length * 5 + 6
      checkPageBreak(boxHeight + 4)
      doc.setFillColor(240, 253, 244) // #f0fdf4
      doc.setDrawColor(187, 247, 208) // #bbf7d0
      doc.roundedRect(marginX, cursorY, contentWidth, boxHeight, 2, 2, "FD")
      doc.text(userLines, marginX + 3, cursorY + 5)
      cursorY += boxHeight + 6
    } else {
      doc.setFont("helvetica", "bold")
      doc.setFontSize(10)
      doc.setTextColor(2, 132, 199) // blue
      doc.text("AI RESPONSE", marginX, cursorY)
      cursorY += 5

      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)
      doc.setTextColor(30, 41, 59)
      const assistantLines = doc.splitTextToSize(msg.text, contentWidth)

      for (const line of assistantLines) {
        checkPageBreak(5.2)
        doc.text(line, marginX, cursorY)
        cursorY += 5
      }
      cursorY += 6
    }
  }

  // 3. Add footer watermark on all pages
  const totalPages = doc.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setDrawColor(226, 232, 240)
    doc.line(marginX, pageHeight - 14, marginX + contentWidth, pageHeight - 14)

    doc.setFont("helvetica", "bold")
    doc.setFontSize(8.5)
    doc.setTextColor(27, 104, 92)
    doc.text("Created by ul0.site • Fast & Private AI to PDF", marginX, pageHeight - 9)

    doc.setFont("helvetica", "normal")
    doc.setTextColor(148, 163, 184)
    doc.text(`Page ${i} of ${totalPages}`, marginX + contentWidth - 18, pageHeight - 9)
  }

  return Buffer.from(doc.output("arraybuffer"))
}

/**
 * Renders rendered HTML into an A4 PDF using Playwright Chromium
 * with JavaScript DISABLED for maximum security.
 * Automatically falls back to jsPDF if Chromium is unavailable.
 */
export async function renderHtmlToPdf(
  html: string,
  fallbackData?: { messages: ChatMessage[]; docType: DocType; title?: string }
): Promise<Buffer> {
  try {
    const browser = await getBrowser()
    // Disable JavaScript for security when rendering user/external HTML
    const context = await browser.newContext({
      javaScriptEnabled: false,
    })

    const page = await context.newPage()

    try {
      await page.setContent(html, { waitUntil: "load", timeout: 15000 })

      const pdfUint8 = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "20mm",
          bottom: "20mm",
          left: "16mm",
          right: "16mm",
        },
        displayHeaderFooter: true,
        headerTemplate: "<div></div>",
        footerTemplate: `
          <div style="font-size: 8.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #94a3b8; width: 100%; display: flex; justify-content: space-between; align-items: center; box-sizing: border-box; padding-left: 16mm; padding-right: 16mm; -webkit-print-color-adjust: exact;">
            <div style="display: flex; align-items: center; gap: 4px; color: #1B685C; font-weight: 600;">
              <svg width="11" height="11" viewBox="0 0 128 128" style="vertical-align: middle;">
                <rect width="128" height="128" rx="34" fill="#0E2F27"/>
                <rect x="26" y="50" width="48" height="28" rx="14" fill="#EAFCF7" stroke="#3DDBB8" stroke-width="6"/>
                <rect x="54" y="50" width="48" height="28" rx="14" fill="#3DDBB8" stroke="#16483C" stroke-width="6"/>
              </svg>
              <span>Created by ul0.site</span>
            </div>
            <div>
              Page <span class="pageNumber"></span> of <span class="totalPages"></span>
            </div>
          </div>
        `,
      })

      return Buffer.from(pdfUint8)
    } finally {
      await context.close()
    }
  } catch (chromiumErr) {
    console.warn(
      "[Chat-to-PDF] Headless Chromium rendering failed, activating pure Node fallback:",
      chromiumErr
    )
    if (fallbackData && fallbackData.messages.length > 0) {
      return renderFallbackPdfWithJsPdf(
        fallbackData.messages,
        fallbackData.docType,
        fallbackData.title
      )
    }
    throw chromiumErr
  }
}
