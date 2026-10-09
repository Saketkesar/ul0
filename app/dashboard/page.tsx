import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getAccountByClerkId, upsertAccount } from "@/lib/appwrite/accounts"
import { listLinksByOwner } from "@/lib/appwrite/links"
import { getDomainsByOwner } from "@/lib/appwrite/domains"
import { getPlanLimits } from "@/lib/plans"
import { isMarketingAdmin } from "@/lib/marketing-auth"
import { Link2, ExternalLink, MousePointerClick, Plus, BarChart3, Globe, ArrowRight, Key, QrCode, Megaphone, DollarSign, Sparkles } from "lucide-react"
import { CreateLinkButton } from "./create-link-button"
import { DeleteLinkButton } from "./delete-link-button"

export default async function DashboardPage() {
  const { userId, has } = await auth()
  if (!userId) redirect("/sign-in")

  // Parallelize all data fetches to eliminate sequential waterfalls and optimize loading speed
  const [
    user,
    accountDoc,
    linksResult,
    domains,
  ] = await Promise.all([
    currentUser().catch(() => null),
    getAccountByClerkId(userId).catch(() => null),
    listLinksByOwner(userId).catch(() => ({ links: [], total: 0 })),
    getDomainsByOwner(userId).catch(() => []),
  ])

  const email = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase() ?? null
  const meta = (user?.publicMetadata || {}) as Record<string, unknown>

  const isDevSaini =
    userId === "user_3KM0jUFBVAeH8wi7WNkyhPrBMom" ||
    email === "dev45144@gmail.com"

  const isSaket =
    (process.env.MARKETING_ADMIN_CLERK_USER_ID && userId === process.env.MARKETING_ADMIN_CLERK_USER_ID) ||
    userId === "user_3G4mPjpnIRkBEiRcnpjbEBkDcxc" ||
    email === "kesarsaket607@gmail.com"

  const hasMarketingAccess =
    meta.marketing_access === true ||
    meta.role === "marketing_admin"

  const canAccessMarketing = isDevSaini || isSaket || hasMarketingAccess

  // Determine active plan from Clerk Billing, publicMetadata, or manual admin grant
  let activePlan = "free_user"
  if (has({ plan: "business_user" }) || meta.plan === "business_user") {
    activePlan = "business_user"
  } else if (
    has({ plan: "pro_user" }) ||
    meta.plan === "pro_user" ||
    accountDoc?.plan === "pro_user" ||
    isDevSaini ||
    isSaket
  ) {
    activePlan = "pro_user"
  }

  // Ensure account exists and reflects active plan
  const account = accountDoc
    ? { ...accountDoc, plan: activePlan === "pro_user" ? "pro_user" : accountDoc.plan }
    : await upsertAccount(userId, email, activePlan)
  const { links, total } = linksResult

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

          {/* Marketing Engine Banner */}
          {canAccessMarketing && (
            <div className="mb-8 p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3.5">
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-emerald-500 shrink-0">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    Marketing Link Engine Active
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                      Admin
                    </span>
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Create ad-supported content gate links, configure auto-skips (5s), and select from 25+ blog articles.
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/marketing"
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all shadow-md shadow-emerald-500/20 shrink-0 flex items-center gap-1.5"
              >
                <span>Open Marketing Engine</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

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
            {canAccessMarketing && (
              <Link
                href="/dashboard/seo"
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                SEO &amp; Search Console
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
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
            {canAccessMarketing && (
              <Link
                href="/dashboard/marketing"
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 px-4 py-2 text-sm font-medium hover:bg-emerald-500/20 transition-colors"
              >
                <DollarSign className="h-4 w-4" />
                Marketing Links
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            )}
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
