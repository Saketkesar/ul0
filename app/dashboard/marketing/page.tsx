import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MarketingDashboardClient } from "@/components/marketing-dashboard-client"
import { listMarketingLinksByOwner } from "@/lib/appwrite/marketing-links"
import { getTotalBlogCount } from "@/lib/blog-discovery"
import { isMarketingAdmin } from "@/lib/marketing-auth"
import { Lock } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Marketing Links — ul0",
  robots: { index: false, follow: false },
}

const MAX_GATE_BLOGS = parseInt(process.env.MAX_GATE_BLOGS || "10", 10)

export default async function MarketingDashboardPage() {
  const { userId } = await auth()
  if (!userId) {
    redirect("/sign-in?redirect_url=/dashboard/marketing")
  }

  // Server-side authorization check
  const authorized = await isMarketingAdmin(userId)
  if (!authorized) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-8 rounded-2xl border border-border bg-card text-center space-y-4 shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted border border-border text-muted-foreground">
              <Lock className="h-7 w-7" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Page Not Found</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The page you're looking for doesn't exist or you don't have access.
            </p>
          </div>
        </main>
        <Footer />
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

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-5xl">
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
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}
