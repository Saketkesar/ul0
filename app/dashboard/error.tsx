"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { UL0Icon } from "@/components/ul0-icon"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Dashboard error caught by boundary:", error)
  }, [error])

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full rounded-3xl border border-border bg-card p-6 space-y-4">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
          <UL0Icon name="warning" className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-foreground">Failed to load dashboard data</h2>
          <p className="text-xs text-muted-foreground">
            A temporary connection issue occurred while fetching your data.
          </p>
        </div>
        <Button onClick={() => reset()} size="sm" className="gap-2 rounded-full">
          <UL0Icon name="refresh" className="h-3.5 w-3.5" />
          <span>Try again</span>
        </Button>
      </div>
    </div>
  )
}

