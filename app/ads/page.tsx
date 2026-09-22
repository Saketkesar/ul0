import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AdsPageClient } from "@/components/ads-page-client"
import { listMonetizedLinksByOwner } from "@/lib/appwrite/monetized-links"
import { Lock, ShieldAlert } from "lucide-react"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Adsterra Monetization Engine & Multi-Step Links — ul0",
  robots: { index: false, follow: false },
}

const ALLOWED_EMAIL = "kesarsaket607@gmail.com"

export default async function AdsPage() {
  const { userId } = await auth()
  if (!userId) {
    redirect("/sign-in?redirect_url=/ads")
  }

  const user = await currentUser()
  const email = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase()

  if (email !== ALLOWED_EMAIL) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-8 rounded-2xl border border-border bg-card text-center space-y-4 shadow-lg">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500">
              <Lock className="h-7 w-7" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Access Restricted</h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The Adsterra Monetization Engine and Multi-Step Link Generator is private and only available to authorized publisher accounts.
            </p>
            <div className="p-3 rounded-lg bg-muted/30 border border-border text-[11px] font-mono text-muted-foreground">
              Logged in as: {email || "Unknown user"}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const links = await listMonetizedLinksByOwner(ALLOWED_EMAIL, 100)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <AdsPageClient initialLinks={links} userEmail={ALLOWED_EMAIL} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
