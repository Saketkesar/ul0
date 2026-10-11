export default function DashboardLoading() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-pulse">
      {/* Greeting row skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div className="space-y-2">
          <div className="h-8 w-56 rounded-xl bg-surface-2" />
          <div className="h-4 w-80 rounded-lg bg-surface-2/60" />
        </div>
        <div className="h-8 w-48 rounded-lg bg-surface-2" />
      </div>

      {/* KPI 4 Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-surface-2 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-3 w-20 rounded bg-muted/60" />
              <div className="h-8 w-8 rounded-lg bg-muted/40" />
            </div>
            <div className="h-7 w-28 rounded bg-muted" />
            <div className="h-3 w-36 rounded bg-muted/40" />
          </div>
        ))}
      </div>

      {/* Main Chart Skeleton */}
      <div className="rounded-xl border border-border bg-surface-2 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-36 rounded bg-muted" />
          <div className="h-8 w-28 rounded-lg bg-muted/50" />
        </div>
        <div className="h-64 w-full rounded-lg bg-surface-3/30" />
      </div>

      {/* Two columns skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-surface-2 p-5 space-y-3">
          <div className="h-5 w-40 rounded bg-muted" />
          <div className="space-y-2 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 w-full rounded-lg bg-surface-1" />
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-surface-2 p-5 space-y-3">
          <div className="h-5 w-40 rounded bg-muted" />
          <div className="space-y-3 pt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 w-full rounded-lg bg-surface-1" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
