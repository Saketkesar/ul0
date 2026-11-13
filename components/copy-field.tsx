"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { UL0Icon } from "@/components/ul0-icon"

interface CopyFieldProps {
  value: string
  label?: string
  className?: string
  size?: "sm" | "md"
}

export function CopyField({ value, label, className = "", size = "md" }: CopyFieldProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const isSmall = size === "sm"

  return (
    <div className={`flex items-center rounded-md border border-border bg-background overflow-hidden ${className}`}>
      {label && (
        <span className="px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground border-r border-border bg-muted/30 select-none shrink-0">
          {label}
        </span>
      )}
      <div className={`flex-1 font-mono select-all truncate px-3 ${isSmall ? "text-xs py-1" : "text-xs sm:text-sm py-2"} text-foreground`}>
        {value}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className={`h-full rounded-none border-l border-border hover:bg-muted/60 text-muted-foreground hover:text-foreground shrink-0 ${isSmall ? "px-2 py-1 h-7" : "px-3 py-2 h-9"} text-xs gap-1`}
        title="Copy to clipboard"
      >
        {copied ? (
          <>
            <UL0Icon name="check" size={13} />
            <span className="text-[11px] font-semibold text-primary">Copied</span>
          </>
        ) : (
          <>
            <UL0Icon name="copy" size={13} />
            <span className="text-[11px] font-medium">Copy</span>
          </>
        )}
      </Button>
    </div>
  )
}

