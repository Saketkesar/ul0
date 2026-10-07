export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header spacer skeleton */}
      <div className="h-16 border-b border-border bg-background/80" />

      <main className="container mx-auto px-4 py-8 max-w-7xl animate-pulse">
        {/* Welcome Section Skeleton */}
        <div className="mb-8 space-y-2">
          <div className="h-8 w-48 rounded-xl bg-muted" />
          <div className="h-4 w-72 rounded-lg bg-muted/60" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-muted" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3 w-16 rounded bg-muted/60" />
                  <div className="h-6 w-24 rounded bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Action Badges Skeleton */}
        <div className="mb-8 flex flex-wrap gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-9 w-32 rounded-xl bg-muted/70" />
          ))}
        </div>

        {/* Links Table Skeleton */}
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div className="h-5 w-28 rounded bg-muted" />
            <div className="h-9 w-28 rounded-xl bg-muted" />
          </div>

          <div className="divide-y divide-border">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between gap-4 px-6 py-4">
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-44 rounded bg-muted" />
                  <div className="h-3 w-72 rounded bg-muted/50" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-muted/60" />
                  <div className="h-8 w-8 rounded-lg bg-muted/60" />
                  <div className="h-8 w-8 rounded-lg bg-muted/60" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
