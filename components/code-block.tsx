"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

interface CodeBlockProps {
  code: string
  language?: string
  title?: string
  className?: string
}

export function CodeBlock({ code, language = "bash", title, className = "" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  return (
    <div className={`rounded-lg border border-border bg-card overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-border bg-muted/30">
        <span className="text-[11px] font-mono font-medium text-muted-foreground uppercase">
          {title || language}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground gap-1"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-primary" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>Copy</span>
            </>
          )}
        </Button>
      </div>
      <pre className="p-3.5 font-mono text-xs text-foreground overflow-x-auto leading-relaxed bg-background">
        <code>{code}</code>
      </pre>
    </div>
  )
}

