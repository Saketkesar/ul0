import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { getDomainsByOwner } from "@/lib/appwrite/domains"
import { getAccountByClerkId, upsertAccount } from "@/lib/appwrite/accounts"
import { getActivePlan } from "@/lib/plan.server"
import { DomainsClient } from "./domains-client"

export const metadata: Metadata = {
  title: "Domains",
  description: "Connect and manage your custom branded domains.",
}

export default async function DomainsPage() {
  const authSession = await auth()
  const { userId } = authSession
  if (!userId) redirect("/sign-in")

  const [user, accountDoc, domains] = await Promise.all([
    currentUser().catch(() => null),
    getAccountByClerkId(userId).catch(() => null),
    getDomainsByOwner(userId).catch(() => []),
  ])

  const plan = getActivePlan(authSession, user, accountDoc)

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Custom Domains
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Connect your own branded domain to create trusted short links.
        </p>
      </div>

      <DomainsClient
        initialDomains={JSON.parse(JSON.stringify(domains))}
        maxDomains={plan.limits.maxDomains}
        currentPlan={plan.label}
      />
    </div>
  )
}
