import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { upsertAccount } from "@/lib/appwrite/accounts"
import { listLinksByOwner } from "@/lib/appwrite/links"
import { getDomainsByOwner } from "@/lib/appwrite/domains"
import { getPlanLimits } from "@/lib/plans"
import { Link2, ExternalLink, MousePointerClick, Plus, BarChart3, Globe, ArrowRight, Key, QrCode, Megaphone } from "lucide-react"
import { CreateLinkButton } from "./create-link-button"
import { DeleteLinkButton } from "./delete-link-button"

export default async function DashboardPage() {
  const { userId, has } = await auth()
  if (!userId) redirect("/sign-in")

  // Determine active plan from Clerk Billing
  let activePlan = "free_user"
  if (has({ plan: "business_user" })) {
    activePlan = "business_user"
  } else if (has({ plan: "pro_user" })) {
    activePlan = "pro_user"
  }

  // Get Clerk user for email
  const user = await currentUser()
  const email = user?.emailAddresses?.[0]?.emailAddress ?? null

  // Upsert account on first authenticated visit (keeps plan in sync)
  const account = await upsertAccount(userId, email, activePlan)

  // Fetch user's links and domains
  const [{ links, total }, domains] = await Promise.all([
    listLinksByOwner(userId),
    getDomainsByOwner(userId),
  ])

  const limits = getPlanLimits(account.plan)

  // Filter only verified custom domains for link creation
  const verifiedDomains = domains.filter((d) => d.status === "verified")

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
              Welcome back{user?.firstName ? `, ${user.firstName}` : ""}! Manage your links and analytics.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2.5">
                  <Link2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Links</p>
                  <p className="text-2xl font-bold">{total}</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-500/10 p-2.5">
                  <MousePointerClick className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Clicks</p>
                  <p className="text-2xl font-bold">
                    {links.reduce((sum, l) => sum + (l.clicks_count || 0), 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-500/10 p-2.5">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <p className="text-2xl font-bold capitalize">{account.plan.replace("_user", "")}</p>
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-purple-500/10 p-2.5">
                  <Globe className="h-5 w-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Domains</p>
                  <p className="text-2xl font-bold">{domains.length}/{limits.maxDomains}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard/domains"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
            >
              <Globe className="h-4 w-4" />
              Manage Domains
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/dashboard/campaigns"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
            >
              <Megaphone className="h-4 w-4" />
              Campaign Builder
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/qr"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
            >
              <QrCode className="h-4 w-4" />
              QR Generator
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/dashboard/keys"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
            >
              <Key className="h-4 w-4" />
              API Keys
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              {account.plan === "free_user" ? "Upgrade Plan" : "Manage Plan"}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Links Table */}
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold">Your Links</h2>
              <CreateLinkButton verifiedDomains={JSON.parse(JSON.stringify(verifiedDomains))} />
            </div>

            {links.length === 0 ? (
              <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <Link2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No links yet</h3>
                <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                  Create your first short link to start tracking clicks and analytics.
                </p>
                <div className="mt-4">
                  <CreateLinkButton verifiedDomains={JSON.parse(JSON.stringify(verifiedDomains))} />
                </div>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {links.map((link) => (
                  <div
                    key={link.$id}
                    className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-primary truncate">
                          {link.host || "ul0.site"}/r/{link.slug}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-600">
                          <MousePointerClick className="h-3 w-3" />
                          {link.clicks_count || 0}
                        </span>
                        {link.host && link.host !== "ul0.site" && (
                          <span className="inline-flex items-center rounded-full bg-purple-500/10 px-2 py-0.5 text-xs text-purple-600">
                            Custom
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground truncate">
                        {link.long_url}
                      </p>
                      {link.created_at && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Created {new Date(link.created_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/dashboard/links/${link.$id}`}
                        className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                        title="View analytics"
                      >
                        <BarChart3 className="h-4 w-4" />
                      </Link>
                      <a
                        href={link.long_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                        title="Open original URL"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <DeleteLinkButton linkId={link.$id} canDelete={limits.canDeleteDomainLinks} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
