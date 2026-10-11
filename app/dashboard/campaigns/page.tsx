import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { getAccountByClerkId, upsertAccount } from "@/lib/appwrite/accounts"
import { listLinksByOwner } from "@/lib/appwrite/links"
import { getDomainsByOwner } from "@/lib/appwrite/domains"
import { getActivePlan } from "@/lib/plan.server"
import { PlanGate } from "@/components/dashboard/plan-gate"
import { CampaignsClient } from "./campaigns-client"

export const metadata: Metadata = {
  title: "Campaigns",
  description: "Group, track, and analyze your marketing links by UTM campaign parameters.",
}

export default async function CampaignsPage() {
  const authSession = await auth()
  const { userId } = authSession
  if (!userId) redirect("/sign-in")

  const [user, accountDoc] = await Promise.all([
    currentUser().catch(() => null),
    getAccountByClerkId(userId).catch(() => null),
  ])

  const plan = getActivePlan(authSession, user, accountDoc)

  // Fetch links and domains
  const [{ links }, domains] = await Promise.all([
    listLinksByOwner(userId, { limit: 100 }),
    getDomainsByOwner(userId),
  ])

  const verifiedDomains = domains.filter((d) => d.status === "verified")

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Marketing Campaigns
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Generate campaign links and monitor performance grouped by campaign source, medium, and tag.
        </p>
      </div>

      <PlanGate
        plan={plan.slug}
        feature="regularAnalytics"
        title="Marketing Campaigns is a Pro Feature"
        description="Build UTM tagged links, group traffic by marketing channels, and track ROI across ad sets."
      >
        <CampaignsClient
          initialLinks={JSON.parse(JSON.stringify(links))}
          verifiedDomains={JSON.parse(JSON.stringify(verifiedDomains))}
          userId={userId}
        />
      </PlanGate>
    </div>
  )
}
