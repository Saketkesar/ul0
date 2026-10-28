"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RotateCcw } from "lucide-react"

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
      <div className="max-w-md w-full rounded-xl border border-border bg-card p-6 space-y-4">
        <div className="mx-auto h-10 w-10 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-foreground">Failed to load dashboard data</h2>
          <p className="text-xs text-muted-foreground">
            A temporary connection issue occurred while fetching your data.
          </p>
        </div>
        <Button onClick={() => reset()} size="sm" className="gap-2">
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Try again</span>
        </Button>
      </div>
    </div>
  )
}

