import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getDomainsByOwner } from "@/lib/appwrite/domains"
import { upsertAccount } from "@/lib/appwrite/accounts"
import { getPlanLimits } from "@/lib/plans"
import { DomainsClient } from "./domains-client"

export const metadata: Metadata = {
  title: "Domains — Dashboard",
  description: "Manage your custom domains.",
}

export default async function DomainsPage() {
  const { userId, has } = await auth()
  if (!userId) redirect("/sign-in")

  // Determine active plan from Clerk
  let activePlan = "free_user"
  if (has({ plan: "business_user" })) {
    activePlan = "business_user"
  } else if (has({ plan: "pro_user" })) {
    activePlan = "pro_user"
  }

  // Load domains and sync account plan in Appwrite
  const [domains, account] = await Promise.all([
    getDomainsByOwner(userId),
    upsertAccount(userId, null, activePlan),
  ])

  const limits = getPlanLimits(account.plan)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">
              Custom Domains
            </h1>
            <p className="mt-1 text-muted-foreground">
              Connect your own domain to create branded short links.
            </p>
          </div>

          <DomainsClient
            initialDomains={JSON.parse(JSON.stringify(domains))}
            maxDomains={limits.maxDomains}
            currentPlan={limits.label}
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
