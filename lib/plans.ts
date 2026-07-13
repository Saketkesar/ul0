/**
 * Plan definitions and limits for the SaaS.
 *
 * Plan slugs MUST match whatever is configured in Clerk Billing
 * (Dashboard → Billing → Plans). Keep this file as the single source
 * of truth for limit numbers used in both server and client code.
 */

// ---------------------------------------------------------------------------
// Plan slugs (must match Clerk Billing plan identifiers)
// ---------------------------------------------------------------------------

export const PLAN_SLUGS = {
  free: "free_user",
  pro: "pro_user",
  business: "business_user",
} as const

export type PlanSlug = (typeof PLAN_SLUGS)[keyof typeof PLAN_SLUGS]

// ---------------------------------------------------------------------------
// Per-plan limits
// ---------------------------------------------------------------------------

export interface PlanLimits {
  /** Max short links allowed on custom domains (total across all domains). */
  maxDomainLinks: number
  /** Max custom domains the account can connect. */
  maxDomains: number
  /** Whether the user can delete their domain links. */
  canDeleteDomainLinks: boolean
  /** Whether analytics / click tracking is available for domain links. */
  hasDomainAnalytics: boolean
  /** Whether analytics is available for regular (non-domain) links. */
  hasRegularAnalytics: boolean
  /** Label shown on pricing page. */
  label: string
  /** Monthly price in USD (for display). */
  priceMonthly: number
  /** Annual price in USD (for display — total per year). */
  priceAnnual: number
}

export const PLANS: Record<PlanSlug, PlanLimits> = {
  free_user: {
    maxDomainLinks: 1,
    maxDomains: 1,
    canDeleteDomainLinks: false,
    hasDomainAnalytics: true,
    hasRegularAnalytics: false,
    label: "Free",
    priceMonthly: 0,
    priceAnnual: 0,
  },
  pro_user: {
    maxDomainLinks: 100,
    maxDomains: 3,
    canDeleteDomainLinks: true,
    hasDomainAnalytics: true,
    hasRegularAnalytics: true,
    label: "Pro",
    priceMonthly: 3,
    priceAnnual: 24, // $2/mo effective
  },
  business_user: {
    maxDomainLinks: Infinity,
    maxDomains: 10,
    canDeleteDomainLinks: true,
    hasDomainAnalytics: true,
    hasRegularAnalytics: true,
    label: "Business",
    priceMonthly: 9,
    priceAnnual: 72, // $6/mo effective
  },
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Resolve a plan slug string to its limits; defaults to free. */
export function getPlanLimits(planSlug: string | null | undefined): PlanLimits {
  const slug = (planSlug ?? "free_user") as PlanSlug
  return PLANS[slug] ?? PLANS.free_user
}

/** Feature list for the pricing page. */
export const PLAN_FEATURES: Record<PlanSlug, string[]> = {
  free_user: [
    "Unlimited free short links (ul0.site)",
    "1 custom domain",
    "1 short link on custom domain",
    "Basic analytics for domain links",
    "QR codes, Split, PDF & all tools",
  ],
  pro_user: [
    "Everything in Free",
    "Up to 3 custom domains",
    "100 short links per domain",
    "Full analytics for all links",
    "Link deletion",
    "Priority support",
  ],
  business_user: [
    "Everything in Pro",
    "Up to 10 custom domains",
    "Unlimited short links per domain",
    "Full analytics for all links",
    "Link deletion",
    "Dedicated support",
  ],
}
