import type { Metadata } from "next"
import { auth, currentUser } from "@clerk/nextjs/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getActivePlan } from "@/lib/plan.server"
import { isUserAdmin } from "@/lib/marketing-auth"
import { getAccountByClerkId } from "@/lib/appwrite/accounts"
import { getDomainsByOwner } from "@/lib/appwrite/domains"
import { getUserLinksStats } from "@/lib/appwrite/links"
import { verifyClaimToken, claimLinkForUser } from "@/lib/claim-token"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"

export const metadata: Metadata = {
  title: {
    template: "%s — Dashboard | UL0",
    default: "Dashboard | UL0",
  },
  description: "Manage your links, domains, campaigns, and analytics.",
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const authObj = await auth()
  const { userId } = authObj

  if (!userId) {
    redirect("/sign-in")
  }

  // Claim any pending anonymous link created before sign-in
  try {
    const cookieStore = await cookies()
    const claimToken = cookieStore.get("ul0_claim_token")?.value
    if (claimToken) {
      const payload = verifyClaimToken(claimToken)
      if (payload?.linkId) {
        await claimLinkForUser(payload.linkId, userId)
      }
    }
  } catch (err) {
    console.error("Error claiming anonymous link:", err)
  }

  const [user, accountDoc, domains, linkStats] = await Promise.all([
    currentUser().catch(() => null),
    getAccountByClerkId(userId).catch(() => null),
    getDomainsByOwner(userId).catch(() => []),
    getUserLinksStats(userId).catch(() => ({ totalLinks: 0, totalClicks: 0, domainLinksCount: 0 })),
  ])

  const plan = getActivePlan(authObj, user, accountDoc)
  const email = user?.emailAddresses?.[0]?.emailAddress ?? null
  const isAdmin = isUserAdmin(userId, email)

  const verifiedDomains = domains
    .filter((d) => d.status === "verified")
    .map((d) => ({
      $id: d.$id,
      domain: d.domain,
      status: d.status as "verified" | "unverified" | "failed",
    }))

  return (
    <DashboardShell
      user={{
        firstName: user?.firstName ?? null,
        email: email,
        imageUrl: user?.imageUrl ?? null,
      }}
      plan={plan}
      domainsUsage={{
        count: domains.length,
        max: plan.limits.maxDomains,
      }}
      domainLinksUsage={{
        count: linkStats.domainLinksCount,
        max: plan.limits.maxDomainLinks,
      }}
      isAdmin={isAdmin}
      verifiedDomains={verifiedDomains}
    >
      {children}
    </DashboardShell>
  )
}
