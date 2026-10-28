"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AlertCircle, RotateCcw } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground px-4 py-16">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center space-y-6">
        <div className="flex justify-center">
          <Image
            src="/ul0.png"
            alt="UL0"
            width={72}
            height={26}
            className="h-6 w-auto object-contain"
            priority
          />
        </div>

        <div className="space-y-1.5">
          <span className="font-mono text-xs font-semibold text-destructive">500 — Application Error</span>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Something went wrong
          </h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            An unexpected error occurred while processing your request. Our automated monitors have been alerted.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border">
          <Button onClick={() => reset()} size="sm" className="flex-1 text-xs font-semibold gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Try again</span>
          </Button>
          <Button asChild variant="outline" size="sm" className="flex-1 text-xs">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

