import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import { getAccountByClerkId } from "@/lib/appwrite/accounts"
import { getPaginatedLinksByOwner } from "@/lib/appwrite/links"
import { getDomainsByOwner } from "@/lib/appwrite/domains"
import { getActivePlan } from "@/lib/plan.server"
import { LinksClient } from "./links-client"

export const metadata: Metadata = {
  title: "Links",
  description: "View and manage all your shortened links, tags, and click traffic.",
}

interface PageProps {
  searchParams: Promise<{
    search?: string
    domain?: string
    status?: string
    sort?: string
    page?: string
  }>
}

export default async function LinksPage({ searchParams }: PageProps) {
  const params = await searchParams
  const authObj = await auth()
  const { userId } = authObj
  if (!userId) redirect("/sign-in")

  const [user, accountDoc, domains] = await Promise.all([
    currentUser().catch(() => null),
    getAccountByClerkId(userId).catch(() => null),
    getDomainsByOwner(userId).catch(() => []),
  ])

  const plan = getActivePlan(authObj, user, accountDoc)

  const linksResult = await getPaginatedLinksByOwner(userId, {
    limit: 100,
    offset: 0,
    search: params.search,
    domain: params.domain,
    status: params.status as any,
    sort: params.sort as any,
  }).catch(() => ({ links: [], total: 0 }))

  const verifiedDomains = domains
    .filter((d) => d.status === "verified")
    .map((d) => ({ domain: d.domain }))

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <LinksClient
        initialLinks={linksResult.links.map((l) => ({
          $id: l.$id,
          slug: l.slug,
          long_url: l.long_url,
          host: l.host,
          clicks_count: l.clicks_count || 0,
          created_at: l.created_at,
          expire_at: l.expire_at,
          meta_title: l.meta_title,
          targeting_json: l.targeting_json,
        }))}
        total={linksResult.total}
        plan={plan}
        verifiedDomains={verifiedDomains}
      />
    </div>
  )
}
