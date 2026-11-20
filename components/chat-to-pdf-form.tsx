"use client"

import React, { useState } from "react"
import { UL0Icon } from "@/components/ul0-icon"

interface ChatToPdfFormProps {
  initialPlaceholder?: string
  defaultPlatform?: "claude" | "chatgpt" | "any"
  heading?: string
  subheading?: string
}

export function ChatToPdfForm({
  initialPlaceholder,
  defaultPlatform = "any",
  heading,
  subheading,
}: ChatToPdfFormProps) {
  const [url, setUrl] = useState("")
  const [fallbackText, setFallbackText] = useState("")
  const [showFallback, setShowFallback] = useState(false)
  const [status, setStatus] = useState<"idle" | "converting" | "done" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [resultDocType, setResultDocType] = useState<"notes" | "code" | "chat" | null>(null)

  const placeholder =
    initialPlaceholder ||
    (defaultPlatform === "claude"
      ? "https://claude.ai/share/..."
      : defaultPlatform === "chatgpt"
      ? "https://chatgpt.com/share/..."
      : "https://claude.ai/share/... or https://chatgpt.com/share/...")

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setResultDocType(null)

    const hasUrl = url.trim().length > 0
    const hasText = fallbackText.trim().length > 0

    if (!hasUrl && !hasText) {
      setErrorMessage(
        showFallback
          ? "Please paste your chat text or enter a public share link."
          : "Please enter a Claude or ChatGPT share link."
      )
      return
    }

    setStatus("converting")

    try {
      const payload = showFallback && hasText ? { text: fallbackText.trim() } : { url: url.trim() }

      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        let errData: any = {}
        try {
          errData = await res.json()
        } catch {}
        if (errData.cloudflare || errData.showPaste) {
          setShowFallback(true)
        }
        throw new Error(
          errData.error ||
            "Couldn't read that chat. Make sure the link is public or paste the text instead."
        )
      }

      // Read DocType header
      const docTypeHeader = (res.headers.get("X-Doc-Type") as "notes" | "code" | "chat") || "chat"
      setResultDocType(docTypeHeader)

      // Download PDF
      const blob = await res.blob()
      const downloadUrl = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = downloadUrl

      const filename =
        res.headers.get("Content-Disposition")?.match(/filename="?([^"]+)"?/)?.[1] ||
        `chat-${docTypeHeader}.pdf`
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(downloadUrl)

      setStatus("done")
    } catch (err: any) {
      setStatus("error")
      setErrorMessage(
        err.message ||
          "Couldn't read that chat. Make sure the link is public or paste text instead."
      )
    }
  }

  const formatDocTypeLabel = (dt: "notes" | "code" | "chat") => {
    switch (dt) {
      case "notes":
        return "Formatted as notes"
      case "code":
        return "Formatted as code"
      case "chat":
      default:
        return "Formatted as conversation"
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm transition-all">
        {heading && (
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground text-center mb-2">
            {heading}
          </h2>
        )}
        {subheading && (
          <p className="text-xs sm:text-sm text-muted-foreground text-center mb-6">
            {subheading}
          </p>
        )}

        <form onSubmit={handleConvert} className="space-y-4">
          {!showFallback ? (
            <div>
              <label htmlFor="share-url-input" className="block text-xs font-medium text-foreground mb-1.5">
                Public Share Link
              </label>
              <div className="relative flex items-center">
                <input
                  id="share-url-input"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={placeholder}
                  disabled={status === "converting"}
                  required={!showFallback}
                  className="w-full h-12 px-4 rounded-xl border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 transition-colors"
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="fallback-text-input" className="block text-xs font-medium text-foreground">
                  Paste Conversation Text / Markdown
                </label>
                <button
                  type="button"
                  onClick={() => setShowFallback(false)}
                  className="text-xs text-primary hover:underline"
                >
                  Use URL link instead
                </button>
              </div>
              <textarea
                id="fallback-text-input"
                rows={6}
                value={fallbackText}
                onChange={(e) => setFallbackText(e.target.value)}
                placeholder="Paste the conversation text or markdown here..."
                disabled={status === "converting"}
                className="w-full p-3.5 rounded-xl border border-input bg-background text-xs font-mono text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 transition-colors"
              />
            </div>
          )}

          {/* Action Row: Convert Button & Animated Page Icon */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={status === "converting"}
              className="w-full sm:flex-1 h-12 inline-flex items-center justify-center gap-2.5 px-6 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-primary/20 active:scale-[0.99] disabled:opacity-60 transition-all cursor-pointer shadow-xs"
            >
              {/* Page Icon Animation */}
              <PageFillIcon state={status} />
              <span>{status === "converting" ? "Converting to PDF..." : "Convert to PDF"}</span>
            </button>

            {!showFallback && (
              <button
                type="button"
                onClick={() => {
                  setShowFallback(true)
                  setErrorMessage(null)
                }}
                className="text-xs text-muted-foreground hover:text-foreground py-2 px-1 transition-colors underline-offset-4 hover:underline"
              >
                Paste text instead
              </button>
            )}
          </div>
        </form>

        {/* Status / Feedback Area */}
        {status === "converting" && (
          <div className="mt-4 p-3 rounded-xl bg-muted/40 border border-border/80 flex items-center justify-center gap-2 text-xs text-muted-foreground motion-safe:animate-pulse">
            <span>Extracting messages & generating high-res A4 PDF...</span>
          </div>
        )}

        {status === "done" && resultDocType && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
            <div className="flex items-center gap-2 font-medium">
              <UL0Icon name="check" size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{formatDocTypeLabel(resultDocType)}</span>
            </div>
            <span className="text-[11px] opacity-80">Downloaded to your device</span>
          </div>
        )}

        {status === "error" && errorMessage && (
          <div className="mt-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-800 dark:text-rose-300 space-y-1.5">
            <div className="flex items-start gap-2">
              <UL0Icon name="alert" size={16} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMessage}</div>
            </div>
            {!showFallback && (
              <div className="pl-6">
                <button
                  type="button"
                  onClick={() => setShowFallback(true)}
                  className="font-medium underline hover:opacity-80"
                >
                  Try pasting the chat text directly instead &rarr;
                </button>
              </div>
            )}
          </div>
        )}

        {/* Privacy Note */}
        <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
          <UL0Icon name="shield" size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>We don&apos;t store your chats. Processed in-memory and immediately discarded.</span>
        </div>
      </div>
    </div>
  )
}

/**
 * Animated Page Icon:
 * - Idle: clean page outline with lines
 * - Converting: lines fill sequentially with subtle animation (respects prefers-reduced-motion)
 * - Done: solid filled state
 */
function PageFillIcon({ state }: { state: "idle" | "converting" | "done" | "error" }) {
  if (state === "done") {
    // Solid filled state when done
    return (
      <svg
        className="w-5 h-5 text-current"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="none"
        aria-hidden="true"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
        <path d="m9 13.5 2 2 4-4" stroke="var(--background, #fff)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    )
  }

  return (
    <svg
      className="w-5 h-5 text-current"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Page outline */}
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />

      {/* Internal lines that fill while converting */}
      <line
        x1="8"
        y1="13"
        x2="16"
        y2="13"
        className={
          state === "converting"
            ? "motion-safe:animate-[pulse_1s_ease-in-out_infinite]"
            : "opacity-40"
        }
      />
      <line
        x1="8"
        y1="17"
        x2="14"
        y2="17"
        className={
          state === "converting"
            ? "motion-safe:animate-[pulse_1s_ease-in-out_infinite_200ms]"
            : "opacity-40"
        }
      />
      <line
        x1="8"
        y1="9"
        x2="10"
        y2="9"
        className={
          state === "converting"
            ? "motion-safe:animate-[pulse_1s_ease-in-out_infinite_400ms]"
            : "opacity-40"
        }
      />
    </svg>
  )
}
