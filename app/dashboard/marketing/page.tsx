import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { MarketingDashboardClient } from "@/components/marketing-dashboard-client"
import { listMarketingLinksByOwner } from "@/lib/appwrite/marketing-links"
import { getTotalBlogCount, getEligibleBlogSlugs } from "@/lib/blog-discovery"
import { isMarketingAdmin } from "@/lib/marketing-auth"
import { ShieldCheck, Lock } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Marketing Engine",
  robots: { index: false, follow: false },
}

const MAX_GATE_BLOGS = parseInt(process.env.MAX_GATE_BLOGS || "15", 10)

export default async function MarketingDashboardPage() {
  const { userId } = await auth()
  if (!userId) {
    redirect("/sign-in?redirect_url=/dashboard/marketing")
  }

  // Server-side authorization check via env allowlist
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
            This module is reserved for authorized UL0 system administrators.
          </p>
        </div>
      </div>
    )
  }

  const links = await listMarketingLinksByOwner(userId, 100)
  const totalBlogsAvailable = getTotalBlogCount()

  // Compute stats
  const totalLinks = links.length
  const activeLinks = links.filter((l) => l.is_active).length
  const totalGateOpens = links.reduce((sum, l) => sum + (l.total_gate_opens || 0), 0)
  const totalCompletions = links.reduce((sum, l) => sum + (l.total_completions || 0), 0)
  const completionRate = totalGateOpens > 0 ? Math.round((totalCompletions / totalGateOpens) * 100) : 0

  const availableBlogs = getEligibleBlogSlugs()

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Marketing Link Engine
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-primary/20 text-primary border border-primary/30">
              Admin Only
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage high-monetization content gates and smart article routing.
          </p>
        </div>
      </div>

      <MarketingDashboardClient
        initialLinks={JSON.parse(JSON.stringify(links))}
        stats={{
          totalLinks,
          activeLinks,
          totalGateOpens,
          totalCompletions,
          completionRate,
        }}
        maxBlogCount={MAX_GATE_BLOGS}
        totalBlogsAvailable={totalBlogsAvailable}
        availableBlogs={availableBlogs}
      />
    </div>
  )
}
