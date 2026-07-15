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
import { listClicksByLink } from "@/lib/appwrite/links"
import { AnalyticsDashboard } from "./analytics-dashboard"
import { TargetingEditor } from "./targeting-editor"
import {
  ArrowLeft,
  MousePointerClick,
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
      <>
        <Header />
        <main className="min-h-screen bg-background flex items-center justify-center">
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

  // Sync and fetch limits
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
          <div className="container mx-auto px-4 py-16 text-center max-w-md">
            <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold">Analytics Locked</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {isCustomDomainLink
                ? "Analytics for custom domain links require a paid plan."
                : "Analytics for regular links are available on the Pro plan and above."}
            </p>
            <div className="pt-4">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Upgrade Plan
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // Fetch initial click logs (up to 5000 rows for rendering charts)
  const clicks = await listClicksByLink(id, 5000)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#fafafa] text-gray-900 font-sans antialiased pb-12">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Back Navigation */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          {/* Link Title and Details */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6 border-gray-200">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                <MousePointerClick className="h-6 w-6 text-gray-800" />
                Link Performance Analytics
              </h1>
              <div className="mt-2 flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-900">
                  {link.host}/r/{link.slug}
                </span>
                <span className="text-sm text-gray-400">→</span>
                <a
                  href={link.long_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-gray-500 hover:text-gray-900 truncate max-w-lg inline-flex items-center gap-1 font-mono"
                >
                  {link.long_url}
                  <ExternalLink className="h-3 w-3 shrink-0" />
                </a>
              </div>
            </div>
            <div>
              <DeleteLinkButton
                linkId={link.$id}
                canDelete={limits.canDeleteDomainLinks}
                redirectOnDelete={true}
              />
            </div>
          </div>

          {/* Two-Column Interactive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Dashboard Visual Analytics (Left 2 Columns) */}
            <div className="lg:col-span-2 space-y-8">
              <AnalyticsDashboard
                linkId={link.$id}
                initialLink={link as any}
                initialClicks={clicks as any}
              />
            </div>

            {/* Controls sidebar (Right 1 Column) */}
            <div className="space-y-8">
              {/* QR Code Branding Studio */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  QR Studio
                </h3>
                <QrCustomizer
                  shortUrl={`${link.host === "ul0.site" ? "https" : "http"}://${link.host}/r/${link.slug}`}
                  slug={link.slug}
                />
              </div>

              {/* Targeting & Premium Controls */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Premium Targeting
                </h3>
                <TargetingEditor link={link as any} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
