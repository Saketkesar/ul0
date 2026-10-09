import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SeoDashboardClient } from "@/components/seo-dashboard-client"
import { isMarketingAdmin } from "@/lib/marketing-auth"
import { Lock } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "SEO Health & Search Console — ul0",
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
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-8 rounded-2xl border border-border bg-card text-center space-y-4 shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted border border-border text-muted-foreground">
              <Lock className="h-7 w-7" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Access Restricted</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SEO &amp; Search Console management is reserved for platform administrators.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50/50 dark:bg-neutral-950/50">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <SeoDashboardClient />
        </div>
      </main>
      <Footer />
    </div>
  )
}
