import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { upsertAccount } from "@/lib/appwrite/accounts"
import { getPlanLimits } from "@/lib/plans"
import { ArrowLeft, Key, Lock, ShieldAlert } from "lucide-react"
import Link from "next/link"
import { ApiKeysClient } from "./keys-client"

export default async function ApiKeysPage() {
  const { userId, has } = await auth()
  if (!userId) redirect("/sign-in")

  // Determine active plan
  let activePlan = "free_user"
  if (has({ plan: "business_user" })) {
    activePlan = "business_user"
  } else if (has({ plan: "pro_user" })) {
    activePlan = "pro_user"
  }

  // Get Clerk user
  const user = await currentUser()
  const email = user?.emailAddresses?.[0]?.emailAddress ?? null

  // Fetch account (keeps plans in sync)
  const account = await upsertAccount(userId, email, activePlan)
  const limits = getPlanLimits(account.plan)

  const isPremium = account.plan === "pro_user" || account.plan === "business_user"

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2.5">
              <Key className="h-7 w-7 text-primary" />
              API Key Management
            </h1>
            <p className="mt-1 text-muted-foreground">
              Integrate ul0 shortening services programmatically into your company tools.
            </p>
          </div>

          {!isPremium ? (
            <div className="rounded-xl border border-border bg-card p-12 text-center shadow-xs">
              <Lock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold tracking-tight">API Access Locked</h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                Developer API keys and programmatic short link generation are exclusive to our paid plans. Upgrade to Pro or Business to generate API credentials.
              </p>
              <div className="mt-6 flex justify-center gap-4">
                <Link
                  href="/pricing"
                  className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs"
                >
                  View Premium Plans
                </Link>
              </div>
            </div>
          ) : (
            <ApiKeysClient initialApiKey={account.api_key} plan={account.plan} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
