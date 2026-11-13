"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { UL0Icon } from "@/components/ul0-icon"

export default function ApiKeysError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("API Keys error:", error)
  }, [error])

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div className="rounded-3xl border border-border bg-card p-8 text-center space-y-4">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
          <UL0Icon name="warning" className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-foreground">API Keys Could Not Be Loaded</h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            We couldn't connect to the credentials system. Please try again or visit documentation.
          </p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={() => reset()} size="sm" variant="outline" className="gap-2 text-xs rounded-full">
            <UL0Icon name="refresh" className="h-3.5 w-3.5" />
            Retry
          </Button>
          <Button asChild size="sm" className="text-xs rounded-full">
            <a href="/docs" target="_blank">View API Docs</a>
          </Button>
        </div>
      </div>
    </div>
  )
}

