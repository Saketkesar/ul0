import { PLAN_SLUGS, PLANS, getPlanLimits, type PlanSlug, type PlanLimits } from "./plans"

export interface ActivePlanResult {
  slug: PlanSlug
  limits: PlanLimits
  label: string
}

export interface AuthLike {
  has: (opts: { plan: string }) => boolean
}

export interface UserLike {
  publicMetadata?: Record<string, unknown> | null
}

export interface AccountDocLike {
  plan?: string | null
  is_pro?: boolean | null
}

/**
 * Pure function resolving active plan with exact precedence rules:
 * 1. DEV_PLAN_OVERRIDE (development only, ignored in production)
 * 2. Clerk Billing session has({ plan: ... })
 * 3. Clerk user publicMetadata.plan
 * 4. Appwrite account document plan or is_pro flag
 * 5. Default: free_user
 */
export function resolveActivePlan(
  auth: AuthLike,
  user?: UserLike | null,
  accountDoc?: AccountDocLike | null,
  devOverride?: string | null,
  nodeEnv?: string
): ActivePlanResult {
  // 1. Dev-only plan override for testing all tier states locally
  if (nodeEnv !== "production" && devOverride) {
    const override = devOverride as PlanSlug
    if (Object.values(PLAN_SLUGS).includes(override)) {
      return {
        slug: override,
        limits: getPlanLimits(override),
        label: PLANS[override].label,
      }
    }
  }

  const meta = (user?.publicMetadata || {}) as Record<string, unknown>
  const metaPlan = typeof meta.plan === "string" ? meta.plan : null
  const dbPlan = accountDoc?.plan ?? (accountDoc?.is_pro ? "pro_user" : null)

  // 2. Business Tier resolution
  if (
    auth.has({ plan: PLAN_SLUGS.business }) ||
    metaPlan === PLAN_SLUGS.business ||
    dbPlan === PLAN_SLUGS.business
  ) {
    return {
      slug: PLAN_SLUGS.business,
      limits: getPlanLimits(PLAN_SLUGS.business),
      label: PLANS[PLAN_SLUGS.business].label,
    }
  }

  // 3. Pro Tier resolution
  if (
    auth.has({ plan: PLAN_SLUGS.pro }) ||
    metaPlan === PLAN_SLUGS.pro ||
    dbPlan === PLAN_SLUGS.pro
  ) {
    return {
      slug: PLAN_SLUGS.pro,
      limits: getPlanLimits(PLAN_SLUGS.pro),
      label: PLANS[PLAN_SLUGS.pro].label,
    }
  }

  // 4. Default: Free Tier
  return {
    slug: PLAN_SLUGS.free,
    limits: getPlanLimits(PLAN_SLUGS.free),
    label: PLANS[PLAN_SLUGS.free].label,
  }
}
