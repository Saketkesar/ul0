import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getAccountByClerkId, upsertAccount } from "@/lib/appwrite/accounts"
import { listLinksByOwner, getUserLinksStats } from "@/lib/appwrite/links"
import { getDomainsByOwner } from "@/lib/appwrite/domains"
import { getActivePlan } from "@/lib/plan.server"
import { OverviewClient } from "@/components/dashboard/overview-client"
import { renderEmail } from "@/lib/split/email-templates"
import { sendEmailDirect } from "@/lib/split/email-sender"
import { logEventToSheet } from "@/lib/split/sheet-logger"

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

  // Send welcome email automatically on brand new user's first account creation
  const isRecentlyCreatedUser =
    !accountDoc &&
    Boolean(email) &&
    Boolean(user?.createdAt) &&
    Date.now() - Number(user?.createdAt) < 24 * 60 * 60 * 1000

  if (isRecentlyCreatedUser && email) {
    const { html, subject } = renderEmail("welcome", {
      name: user?.firstName || user?.fullName || "Friend",
      cta_url: "https://ul0.site/split/dashboard",
      help_url: "https://ul0.site/split",
    })
    sendEmailDirect({
      to: email,
      subject: subject || "Welcome to UL0! Your account is ready",
      html,
      text: `Welcome to UL0! Start shortening links and splitting bills at https://ul0.site/dashboard`,
    }).catch((err) => console.warn("[Dashboard] First-login welcome email error:", err))
    logEventToSheet({
      event_type: "onboarding_completed",
      organizer_name: user?.fullName || user?.firstName || "New User",
      organizer_email: email,
      status: "Active (Dashboard Signup)",
      split_url: "https://ul0.site/dashboard",
    }).catch(() => {})
  }

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
