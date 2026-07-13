import { auth } from "@clerk/nextjs/server"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { upsertAccount } from "@/lib/appwrite/accounts"
import { getPlanLimits } from "@/lib/plans"
import { DeleteLinkButton } from "../../delete-link-button"
import { QrCustomizer } from "./qr-customizer"
import { getDatabases, Query } from "@/lib/appwrite/server"
import { APPWRITE_DATABASE_ID, COLLECTIONS, DEFAULT_HOST } from "@/lib/appwrite/config"
import {
  ArrowLeft,
  MousePointerClick,
  Smartphone,
  Monitor,
  Globe,
  ExternalLink,
  Lock,
  BarChart3,
} from "lucide-react"

interface Props {
  params: Promise<{ id: string }>
}

export default async function LinkAnalyticsPage({ params }: Props) {
  const { id } = await params
  const { userId, has } = await auth()
  if (!userId) redirect("/sign-in")

  // Fetch the link
  const db = getDatabases()
  let link
  try {
    link = await db.getDocument(APPWRITE_DATABASE_ID, COLLECTIONS.links, id)
  } catch {
    notFound()
  }

  // Ownership check
  if (link.owner_id !== userId) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-16 text-center">
            <Lock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="mt-2 text-muted-foreground">
              You don&apos;t have permission to view analytics for this link.
            </p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // Determine active plan from Clerk
  let activePlan = "free_user"
  if (has({ plan: "business_user" })) {
    activePlan = "business_user"
  } else if (has({ plan: "pro_user" })) {
    activePlan = "pro_user"
  }

  // Sync and fetch account details
  const account = await upsertAccount(userId, null, activePlan)
  const limits = getPlanLimits(account.plan)
  const isCustomDomainLink = link.host !== DEFAULT_HOST
  const hasAnalyticsAccess = isCustomDomainLink
    ? limits.hasDomainAnalytics
    : limits.hasRegularAnalytics

  if (!hasAnalyticsAccess) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-16 text-center">
            <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold">Analytics Locked</h1>
            <p className="mt-2 text-muted-foreground max-w-md mx-auto">
              {isCustomDomainLink
                ? "Analytics for custom domain links require a paid plan."
                : "Analytics for regular links are available on the Pro plan and above."}
            </p>
            <Link
              href="/pricing"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Upgrade Plan
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // Fetch click records for this link
  const { documents: clicks, total: totalClicks } = await db.listDocuments(
    APPWRITE_DATABASE_ID,
    COLLECTIONS.clicks,
    [
      Query.equal("link_id", id),
      Query.orderDesc("clicked_at"),
      Query.limit(100),
    ],
  )

  // Compute analytics
  const deviceBreakdown = { mobile: 0, desktop: 0 }
  const referrerCounts: Record<string, number> = {}
  const dailyCounts: Record<string, number> = {}
  const countryCounts: Record<string, number> = {}

  for (const click of clicks) {
    // Device
    const device = (click as any).device_type || "desktop"
    if (device === "mobile") deviceBreakdown.mobile++
    else deviceBreakdown.desktop++

    // Referrer
    const referrer = (click as any).referrer || "Direct"
    const refHost = referrer === "Direct" ? "Direct" : (() => {
      try { return new URL(referrer).hostname } catch { return "Unknown" }
    })()
    referrerCounts[refHost] = (referrerCounts[refHost] || 0) + 1

    // Country
    const country = (click as any).country || "Unknown"
    countryCounts[country] = (countryCounts[country] || 0) + 1

    // Daily counts
    const date = (click as any).clicked_at
      ? new Date((click as any).clicked_at).toLocaleDateString()
      : "Unknown"
    dailyCounts[date] = (dailyCounts[date] || 0) + 1
  }

  const topReferrers = Object.entries(referrerCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)

  const topCountries = Object.entries(countryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)

  const recentDays = Object.entries(dailyCounts)
    .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
    .slice(0, 14)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Back */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          {/* Link Info */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <MousePointerClick className="h-6 w-6 text-primary" />
                Link Analytics
              </h1>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-sm font-medium text-primary">
                  {link.host}/r/{link.slug}
                </span>
                <span className="text-sm text-muted-foreground">→</span>
                <a
                  href={link.long_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground truncate max-w-md inline-flex items-center gap-1"
                >
                  {link.long_url}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">Dangerous Area:</span>
              <DeleteLinkButton linkId={link.$id} canDelete={limits.canDeleteDomainLinks} redirectOnDelete={true} />
            </div>
          </div>

          {/* Stats Row */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <p className="text-sm text-muted-foreground">Total Clicks</p>
              <p className="text-3xl font-bold">{link.clicks_count || 0}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Desktop</p>
              </div>
              <p className="text-3xl font-bold">{deviceBreakdown.desktop}</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Mobile</p>
              </div>
              <p className="text-3xl font-bold">{deviceBreakdown.mobile}</p>
            </div>
          </div>

          {/* QR Code Branding Studio */}
          <div className="mb-8">
            <QrCustomizer shortUrl={`${link.host === "ul0.site" ? "https" : "http"}://${link.host}/r/${link.slug}`} slug={link.slug} />
          </div>

          {/* Click Analytics Demographics */}
          <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Daily Clicks */}
            <div className="rounded-xl border border-border bg-card shadow-sm flex flex-col">
              <div className="border-b border-border px-6 py-4">
                <h2 className="font-semibold">Recent Daily Clicks</h2>
              </div>
              <div className="flex-1">
                {recentDays.length === 0 ? (
                  <div className="px-6 py-8 text-center text-sm text-muted-foreground">
                    No click data yet
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {recentDays.map(([date, count]) => (
                      <div
                        key={date}
                        className="flex items-center justify-between px-6 py-3"
                      >
                        <span className="text-sm">{date}</span>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{
                              width: `${Math.max(10, Math.min(100, (count / Math.max(...recentDays.map(([, c]) => c))) * 100))}px`,
                            }}
                          />
                          <span className="text-sm font-medium w-8 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Top Referrers */}
            <div className="rounded-xl border border-border bg-card shadow-sm flex flex-col">
              <div className="border-b border-border px-6 py-4">
                <h2 className="font-semibold">Top Referrers</h2>
              </div>
              <div className="flex-1">
                {topReferrers.length === 0 ? (
                  <div className="px-6 py-8 text-center text-sm text-muted-foreground">
                    No referrer data yet
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {topReferrers.map(([referrer, count]) => (
                      <div
                        key={referrer}
                        className="flex items-center justify-between px-6 py-3"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-sm truncate">{referrer}</span>
                        </div>
                        <span className="text-sm font-medium shrink-0">{count}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Top Countries / Locations */}
            <div className="rounded-xl border border-border bg-card shadow-sm flex flex-col">
              <div className="border-b border-border px-6 py-4">
                <h2 className="font-semibold">Top Locations</h2>
              </div>
              <div className="flex-1">
                {topCountries.length === 0 ? (
                  <div className="px-6 py-8 text-center text-sm text-muted-foreground">
                    No location data yet
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {topCountries.map(([country, count]) => (
                      <div
                        key={country}
                        className="flex items-center justify-between px-6 py-3"
                      >
                        <span className="text-sm font-semibold uppercase">{country}</span>
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2 rounded-full bg-green-500"
                            style={{
                              width: `${Math.max(10, Math.min(100, (count / Math.max(...topCountries.map(([, c]) => c))) * 100))}px`,
                            }}
                          />
                          <span className="text-sm font-medium w-8 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
