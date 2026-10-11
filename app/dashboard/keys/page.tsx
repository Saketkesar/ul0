import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { getAccountByClerkId, upsertAccount } from "@/lib/appwrite/accounts"
import { getActivePlan } from "@/lib/plan.server"
import { PlanGate } from "@/components/dashboard/plan-gate"
import { ApiKeysClient } from "./keys-client"

export const metadata: Metadata = {
  title: "API Keys",
  description: "Generate and manage REST API keys for programmatic link shortening.",
}

export default async function ApiKeysPage() {
  const authSession = await auth()
  const { userId } = authSession
  if (!userId) redirect("/sign-in")

  const [user, accountDoc] = await Promise.all([
    currentUser().catch(() => null),
    getAccountByClerkId(userId).catch(() => null),
  ])

  const plan = getActivePlan(authSession, user, accountDoc)
  const email = user?.emailAddresses?.[0]?.emailAddress ?? null
  const account = accountDoc
    ? accountDoc
    : await upsertAccount(userId, email, plan.slug)

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          API Key Management
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Integrate UL0 shortening services programmatically into your CI/CD, internal tooling, or apps.
        </p>
      </div>

      <PlanGate
        plan={plan.slug}
        feature="apiAccess"
        title="REST API Access is a Pro Feature"
        description="Generate secure API keys to create links, fetch analytics, and manage domains programmatically."
      >
        <ApiKeysClient initialApiKey={account.api_key} plan={plan.slug} />
      </PlanGate>
    </div>
  )
}
