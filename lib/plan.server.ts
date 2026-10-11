import "server-only"
import {
  resolveActivePlan,
  type ActivePlanResult,
  type AuthLike,
  type UserLike,
  type AccountDocLike,
} from "./plan-rules"

export type { ActivePlanResult, AuthLike, UserLike, AccountDocLike }

/**
 * Server-only single source of truth for resolving active plan across all dashboard pages.
 */
export function getActivePlan(
  auth: AuthLike,
  user?: UserLike | null,
  accountDoc?: AccountDocLike | null
): ActivePlanResult {
  return resolveActivePlan(
    auth,
    user,
    accountDoc,
    process.env.DEV_PLAN_OVERRIDE,
    process.env.NODE_ENV
  )
}
