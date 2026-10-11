import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getAccountByClerkId, upsertAccount } from "@/lib/appwrite/accounts"
import { listLinksByOwner, getUserLinksStats } from "@/lib/appwrite/links"
import { getDomainsByOwner } from "@/lib/appwrite/domains"
import { getActivePlan } from "@/lib/plan.server"
import { OverviewClient } from "@/components/dashboard/overview-client"

export default async function DashboardPage() {
  const authObj = await auth()
  const { userId } = authObj
  if (!userId) redirect("/sign-in")

  // Parallel data fetching for instant response times
  const [
    user,
    accountDoc,
    linksResult,
    domains,
    linkStats,
  ] = await Promise.all([
    currentUser().catch(() => null),
    getAccountByClerkId(userId).catch(() => null),
    listLinksByOwner(userId, { limit: 25 }).catch(() => ({ links: [], total: 0 })),
    getDomainsByOwner(userId).catch(() => []),
    getUserLinksStats(userId).catch(() => ({ totalLinks: 0, totalClicks: 0, domainLinksCount: 0 })),
  ])

  const plan = getActivePlan(authObj, user, accountDoc)
  const email = user?.emailAddresses?.[0]?.emailAddress ?? null

  // Ensure account document is kept up to date
  const account = accountDoc
    ? accountDoc
    : await upsertAccount(userId, email, plan.slug)

  const verifiedDomains = domains
    .filter((d) => d.status === "verified")
    .map((d) => ({ domain: d.domain }))

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <OverviewClient
        user={{
          firstName: user?.firstName ?? null,
        }}
        plan={plan}
        initialLinks={linksResult.links.map((l) => ({
          $id: l.$id,
          slug: l.slug,
          long_url: l.long_url,
          host: l.host,
          clicks_count: l.clicks_count || 0,
          created_at: l.created_at,
          expire_at: l.expire_at,
          meta_title: l.meta_title,
        }))}
        totalLinksCount={linkStats.totalLinks || linksResult.total}
        totalClicksSum={linkStats.totalClicks}
        verifiedDomains={verifiedDomains}
        apiKeyCreated={Boolean(account?.api_key)}
      />
    </div>
  )
}
