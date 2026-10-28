import React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`rounded-lg border border-dashed border-border bg-card/50 p-8 sm:p-12 text-center space-y-3 ${className}`}>
      <div className="mx-auto h-10 w-10 rounded-md border border-border bg-muted/30 flex items-center justify-center text-muted-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <div className="space-y-1 max-w-sm mx-auto">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
      {actionLabel && (
        <div className="pt-2">
          {actionHref ? (
            <Button asChild size="sm" className="text-xs">
              <Link href={actionHref}>{actionLabel}</Link>
            </Button>
          ) : (
            <Button onClick={onAction} size="sm" className="text-xs">
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

