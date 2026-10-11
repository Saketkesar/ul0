import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import { getAccountByClerkId } from "@/lib/appwrite/accounts"
import { getDomainsByOwner } from "@/lib/appwrite/domains"
import { getUserLinksStats } from "@/lib/appwrite/links"
import { getActivePlan } from "@/lib/plan.server"
import { PLANS, PLAN_FEATURES, type PlanSlug } from "@/lib/plans"
import {
  CreditCard,
  Check,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Globe,
  Link2,
  ArrowRight,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Billing & Plans",
  description: "Manage your subscription, view plan limits, and upgrade your tier.",
}

export default async function BillingPage() {
  const authSession = await auth()
  const { userId } = authSession
  if (!userId) redirect("/sign-in")

  const [user, accountDoc, domains, linkStats] = await Promise.all([
    currentUser().catch(() => null),
    getAccountByClerkId(userId).catch(() => null),
    getDomainsByOwner(userId).catch(() => []),
    getUserLinksStats(userId).catch(() => ({ totalLinks: 0, totalClicks: 0, domainLinksCount: 0 })),
  ])

  const plan = getActivePlan(authSession, user, accountDoc)
  const currentLimits = plan.limits
  const portalUrl = process.env.POLAR_PORTAL_URL || "https://polar.sh/ul0-link/portal"

  const domainsCount = domains.length
  const domainLinksCount = linkStats.domainLinksCount

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Billing &amp; Subscription
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          View your active plan, current usage, and manage your billing settings.
        </p>
      </div>

      {/* Current Plan Overview Card */}
      <div className="rounded-xl border border-border bg-surface-2 p-6 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h2 className="text-lg font-bold text-foreground">Current Plan</h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                  plan.slug === "business_user"
                    ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 border-slate-700"
                    : plan.slug === "pro_user"
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "bg-muted text-muted-foreground border-border"
                }`}
              >
                {plan.label} Tier
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {plan.slug === "free_user"
                ? "You are currently on the Free plan."
                : `$${currentLimits.priceMonthly}/month billed via Polar.sh`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {plan.slug !== "free_user" ? (
              <a
                href={portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-surface-1 text-xs font-semibold text-foreground hover:bg-surface-3 transition-colors shadow-2xs"
              >
                <span>Manage Subscription &amp; Invoices</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : (
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-xs font-semibold text-white hover:bg-primary/90 transition-all shadow-xs"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Upgrade to Pro ($3)</span>
              </Link>
            )}
          </div>
        </div>

        {/* Real Usage Meters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Custom Domains Meter */}
          <div className="space-y-2 p-4 rounded-xl border border-border bg-surface-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-primary" />
                Custom Domains
              </span>
              <span className="font-mono text-muted-foreground">
                {domainsCount} / {currentLimits.maxDomains === Infinity ? "∞" : currentLimits.maxDomains}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-surface-3 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{
                  width: `${
                    currentLimits.maxDomains === Infinity
                      ? 10
                      : Math.min(100, Math.round((domainsCount / currentLimits.maxDomains) * 100))
                  }%`,
                }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              {currentLimits.maxDomains === Infinity
                ? "Unlimited custom domains included"
                : `${Math.max(0, currentLimits.maxDomains - domainsCount)} domain slot(s) remaining`}
            </p>
          </div>

          {/* Domain Short Links Meter */}
          <div className="space-y-2 p-4 rounded-xl border border-border bg-surface-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Link2 className="h-3.5 w-3.5 text-primary" />
                Domain Short Links
              </span>
              <span className="font-mono text-muted-foreground">
                {domainLinksCount} / {currentLimits.maxDomainLinks === Infinity ? "∞" : currentLimits.maxDomainLinks}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-surface-3 overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{
                  width: `${
                    currentLimits.maxDomainLinks === Infinity
                      ? 10
                      : Math.min(100, Math.round((domainLinksCount / currentLimits.maxDomainLinks) * 100))
                  }%`,
                }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              {currentLimits.maxDomainLinks === Infinity
                ? "Unlimited links per domain"
                : `${Math.max(0, currentLimits.maxDomainLinks - domainLinksCount)} custom domain link slot(s) remaining`}
            </p>
          </div>
        </div>
      </div>

      {/* Plan Comparison Cards */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-foreground">Available Plans</h2>
          <p className="text-xs text-muted-foreground">
            Clear, predictable pricing with zero hidden fees. Single source of truth from lib/plans.ts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(["free_user", "pro_user", "business_user"] as PlanSlug[]).map((slug) => {
            const p = PLANS[slug]
            const isCurrent = plan.slug === slug
            const features = PLAN_FEATURES[slug] || []

            return (
              <div
                key={slug}
                className={`rounded-xl border p-6 flex flex-col justify-between space-y-6 transition-all ${
                  isCurrent
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-border bg-surface-2 hover:border-border/80 shadow-2xs"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-foreground">{p.label}</h3>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-white">
                        Active
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-foreground font-mono">
                      ${p.priceMonthly}
                    </span>
                    <span className="text-xs text-muted-foreground">/ month</span>
                  </div>

                  <ul className="space-y-2.5 pt-2 text-xs">
                    {features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.2" />
                        <span className="leading-tight">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  {isCurrent ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-2 rounded-lg border border-border bg-surface-3 text-xs font-semibold text-muted-foreground cursor-default"
                    >
                      Current Plan
                    </button>
                  ) : (
                    <Link
                      href="/pricing"
                      className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-lg bg-primary text-xs font-semibold text-white hover:bg-primary/90 transition-all shadow-xs"
                    >
                      <span>Upgrade to {p.label}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
