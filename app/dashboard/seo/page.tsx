import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { SeoDashboardClient } from "@/components/seo-dashboard-client"
import { isMarketingAdmin } from "@/lib/marketing-auth"
import { Lock } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "SEO Health & Search Console",
  robots: { index: false, follow: false },
}

export default async function SeoDashboardPage() {
  const { userId } = await auth()
  if (!userId) {
    redirect("/sign-in?redirect_url=/dashboard/seo")
  }

  // Server-side authorization check (admin-only)
  const authorized = await isMarketingAdmin(userId)
  if (!authorized) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-2xl border border-border bg-surface-2 text-center space-y-4 shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted border border-border text-muted-foreground">
            <Lock className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Access Restricted</h1>
          <p className="text-xs text-muted-foreground leading-relaxed">
            SEO &amp; Search Console management is reserved for platform administrators.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              SEO Health &amp; Search Console
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-primary/20 text-primary border border-primary/30">
              Admin Only
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Monitor Google indexing status, sitemap freshness, and organic search keywords.
          </p>
        </div>
      </div>

      <SeoDashboardClient />
    </div>
  )
}
