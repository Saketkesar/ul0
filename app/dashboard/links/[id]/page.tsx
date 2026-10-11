import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect, notFound } from "next/navigation"
import type { Metadata } from "next"
import { getDatabases } from "@/lib/appwrite/server"
import { APPWRITE_DATABASE_ID, COLLECTIONS, DEFAULT_HOST } from "@/lib/appwrite/config"
import { getAccountByClerkId } from "@/lib/appwrite/accounts"
import { getActivePlan } from "@/lib/plan.server"
import { LinkDetailClient } from "@/components/dashboard/link-detail-client"
import { Lock } from "lucide-react"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Link Details (${id})`,
    description: "Detailed analytics, targeting rules, and QR studio for short link.",
  }
}

export default async function LinkDetailPage({ params }: Props) {
  const { id } = await params
  const authSession = await auth()
  const { userId } = authSession
  if (!userId) redirect("/sign-in")

  const db = getDatabases()
  let link: any
  try {
    link = await db.getDocument(APPWRITE_DATABASE_ID, COLLECTIONS.links, id)
  } catch {
    notFound()
  }

  // Verify ownership
  if (link.owner_id !== userId) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-3">
          <div className="mx-auto h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Access Denied</h1>
          <p className="text-xs text-muted-foreground">
            You do not have permission to view or manage this short link.
          </p>
        </div>
      </div>
    )
  }

  // Active plan resolution via getActivePlan (evaluates Clerk, metadata, and DB account)
  const [user, accountDoc] = await Promise.all([
    currentUser().catch(() => null),
    getAccountByClerkId(userId).catch(() => null),
  ])

  const plan = getActivePlan(authSession, user, accountDoc)
  const isCustomDomainLink = Boolean(link.host && link.host !== DEFAULT_HOST)

  const hasAnalyticsAccess = isCustomDomainLink
    ? plan.limits.hasDomainAnalytics
    : plan.limits.hasRegularAnalytics

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <LinkDetailClient
        link={{
          $id: link.$id,
          slug: link.slug,
          long_url: link.long_url,
          host: link.host,
          clicks_count: link.clicks_count || 0,
          created_at: link.created_at,
          expire_at: link.expire_at,
          meta_title: link.meta_title,
          targeting_json: link.targeting_json,
        }}
        plan={plan}
        isCustomDomainLink={isCustomDomainLink}
        hasAnalyticsAccess={hasAnalyticsAccess}
      />
    </div>
  )
}
