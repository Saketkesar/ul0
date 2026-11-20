import type { ChatMessage } from "./types.ts"

/**
 * Strict URL Validation & SSRF Prevention:
 * Strictly allow only:
 * - https://claude.ai/share/<id>
 * - https://chatgpt.com/share/<id>
 */
export function validateShareUrl(rawUrl: string): { valid: boolean; normalizedUrl?: string; error?: string } {
  if (!rawUrl || typeof rawUrl !== "string") {
    return { valid: false, error: "Missing share link URL" }
  }

  let parsed: URL
  try {
    parsed = new URL(rawUrl.trim())
  } catch {
    return { valid: false, error: "Invalid URL format" }
  }

  // Only allow http: or https: (force https for security)
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return { valid: false, error: "Only HTTPS share URLs are supported" }
  }

  const hostname = parsed.hostname.toLowerCase()

  // Prevent SSRF / internal IP targeting
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0" ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.") ||
    hostname.endsWith(".internal") ||
    hostname.endsWith(".local")
  ) {
    return { valid: false, error: "Invalid share link domain" }
  }

  // Strict domain and path whitelist
  const isClaude = hostname === "claude.ai" && parsed.pathname.startsWith("/share/")
  const isChatGPT = (hostname === "chatgpt.com" || hostname === "chat.openai.com") && parsed.pathname.startsWith("/share/")

  if (!isClaude && !isChatGPT) {
    return {
      valid: false,
      error: "Only public share links from claude.ai/share/... or chatgpt.com/share/... are supported",
    }
  }

  // Force HTTPS and clean search params
  parsed.protocol = "https:"
  return { valid: true, normalizedUrl: parsed.toString() }
}

/**
 * Centralized selector configuration for ChatGPT and Claude
 * Keep selectors in one function so they are easy to update.
 */
export function getPlatformSelectors(url: string) {
  const hostname = new URL(url).hostname.toLowerCase()
  if (hostname === "claude.ai") {
    return {
      platform: "claude" as const,
      userSelector: '[data-testid="user-message"]',
      assistantSelector: '[data-testid="assistant-message"], .font-claude-response',
      messageContainerSelector: '[data-testid="user-message"], [data-testid="assistant-message"]',
    }
  }

  // ChatGPT
  return {
    platform: "chatgpt" as const,
    userSelector: '[data-message-role="user"], [data-message-author-role="user"], [data-user-message-bubble]',
    assistantSelector: '[data-message-role="assistant"], [data-message-author-role="assistant"], [data-assistant-markdown]',
    markdownSelector: '[data-assistant-markdown], .markdown, [data-message-role="assistant"] .markdown',
    messageContainerSelector: '[data-message-role], [data-message-author-role]',
  }
}

/**
 * Parse raw text / markdown into ChatMessage list (Fallback mode)
 */
export function parseFallbackText(text: string): ChatMessage[] {
  if (!text || !text.trim()) return []

  const raw = text.trim()
  const messages: ChatMessage[] = []

  // Check for common conversational delimiters like "User:", "Human:", "Assistant:", "ChatGPT:", "Claude:"
  const turnRegex = /(?:^|\n)(User|Human|You|Me|Prompt|Assistant|ChatGPT|Claude|AI):\s*/gi
  const matches = [...raw.matchAll(turnRegex)]

  if (matches.length >= 2) {
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i]
      const label = match[1].toLowerCase()
      const role: "user" | "assistant" = ["user", "human", "you", "me", "prompt"].includes(label)
        ? "user"
        : "assistant"
      const startIndex = match.index! + match[0].length
      const endIndex = i + 1 < matches.length ? matches[i + 1].index! : raw.length
      const body = raw.slice(startIndex, endIndex).trim()

      if (body) {
        messages.push({
          role,
          text: body,
          html: formatMarkdownLikeText(body),
        })
      }
    }
  } else {
    // If no distinct turns detected, treat first non-empty paragraph or question as user topic, rest as assistant content
    const paragraphs = raw.split(/\n\s*\n/)
    if (paragraphs.length === 1) {
      messages.push({
        role: "assistant",
        text: raw,
        html: formatMarkdownLikeText(raw),
      })
    } else {
      messages.push({
        role: "user",
        text: paragraphs[0].trim(),
        html: `<p>${escapeHtml(paragraphs[0].trim())}</p>`,
      })
      const rest = paragraphs.slice(1).join("\n\n").trim()
      messages.push({
        role: "assistant",
        text: rest,
        html: formatMarkdownLikeText(rest),
      })
    }
  }

  return messages
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function formatMarkdownLikeText(text: string): string {
  let html = escapeHtml(text)

  // Code blocks: ```lang ... ```
  html = html.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_m, lang, code) => {
    return `<pre><code class="language-${lang || "text"}">${code}</code></pre>`
  })

  // Inline code: `...`
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>")

  // Bold & Italics
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>")

  // Headers
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>")
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>")
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>")

  // Convert remaining newlines into paragraphs or linebreaks
  const parts = html.split("\n\n")
  return parts
    .map((p) => {
      const trimmed = p.trim()
      if (trimmed.startsWith("<pre>") || trimmed.startsWith("<h")) return trimmed
      return `<p>${trimmed.replace(/\n/g, "<br/>")}</p>`
    })
    .join("\n")
}
