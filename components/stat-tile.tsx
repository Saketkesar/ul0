import React from "react"

interface StatTileProps {
  label: string
  value: string | number
  subtext?: string
  icon?: React.ComponentType<{ className?: string }>
  trend?: {
    value: number
    label?: string
  }
  className?: string
}

export function StatTile({
  label,
  value,
  subtext,
  icon: Icon,
  trend,
  className = "",
}: StatTileProps) {
  return (
    <div className={`rounded-lg border border-border bg-card p-4 space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
        <span>{label}</span>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground/80" />}
      </div>
      <div className="text-xl sm:text-2xl font-semibold text-foreground tracking-tight">
        {value}
      </div>
      {(subtext || trend) && (
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground pt-0.5">
          {trend && (
            <span
              className={`font-medium ${
                trend.value >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400"
              }`}
            >
              {trend.value >= 0 ? `+${trend.value}%` : `${trend.value}%`}
            </span>
          )}
          {subtext && <span>{subtext}</span>}
        </div>
      )}
    </div>
  )
}

