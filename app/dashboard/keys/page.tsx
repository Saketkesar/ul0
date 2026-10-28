import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { getAccountByClerkId, upsertAccount } from "@/lib/appwrite/accounts"
import { listUserApiKeys } from "@/lib/api-keys"
import { getActivePlan } from "@/lib/plan.server"
import { ApiKeysClient } from "./keys-client"

export const metadata: Metadata = {
  title: "API Keys",
  description: "Generate and manage REST API keys for programmatic link shortening.",
}

export default async function ApiKeysPage() {
  const authSession = await auth()
  const { userId } = authSession
  if (!userId) redirect("/sign-in")

  let user = null
  let accountDoc = null
  let keys: any[] = []

  try {
    const results = await Promise.allSettled([
      currentUser(),
      getAccountByClerkId(userId),
      listUserApiKeys(userId),
    ])

    if (results[0].status === "fulfilled") user = results[0].value
    if (results[1].status === "fulfilled") accountDoc = results[1].value
    if (results[2].status === "fulfilled") keys = results[2].value
  } catch (err) {
    console.error("Error gathering user credentials info:", err)
  }

  const plan = getActivePlan(authSession, user, accountDoc)

  // Non-blocking upsert if account record is missing
  if (!accountDoc) {
    const email = user?.emailAddresses?.[0]?.emailAddress ?? null
    upsertAccount(userId, email, plan.slug).catch(() => null)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
            API Keys
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Create and manage secret API keys for programmatic link creation and management.
          </p>
        </div>
      </div>

      <ApiKeysClient initialKeys={keys} planSlug={plan.slug} />
    </div>
  )
}
