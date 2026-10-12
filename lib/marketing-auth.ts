import "server-only"
import { currentUser } from "@clerk/nextjs/server"

function parseEnvList(val: string | undefined): string[] {
  if (!val) return []
  return val
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
}

/**
 * Verified Admin User IDs and Emails from environment variables.
 * Can be configured via:
 * - MARKETING_ADMIN_CLERK_USER_IDS="user_xxx,user_yyy"
 * - MARKETING_ADMIN_EMAILS="admin@example.com,dev@example.com"
 * - MARKETING_ADMIN_CLERK_USER_ID="user_xxx" (legacy singular)
 */
const ENV_ADMIN_IDS = parseEnvList(process.env.MARKETING_ADMIN_CLERK_USER_IDS)
const ENV_ADMIN_EMAILS = parseEnvList(process.env.MARKETING_ADMIN_EMAILS).map((e) => e.toLowerCase())
const SINGULAR_ADMIN_ID = process.env.MARKETING_ADMIN_CLERK_USER_ID?.trim() || ""

// Built-in fallback IDs for Saket & Dev
const DEFAULT_ADMIN_USER_IDS = [
  "user_3G4mPjpnIRkBEiRcnpjbEBkDcxc",
  "user_3G4rnFLHEvo7Fj8wlkWmU4eQ1qq",
  "user_3KM0jUFBVAeH8wi7WNkyhPrBMom",
]

const DEFAULT_ADMIN_EMAILS = [
  "kesarsaket607@gmail.com",
  "saketkesar.bcseiot2024@huroorkee.ac.in",
  "dev45144@gmail.com",
]

const ALL_ADMIN_IDS = Array.from(
  new Set([SINGULAR_ADMIN_ID, ...ENV_ADMIN_IDS, ...DEFAULT_ADMIN_USER_IDS].filter(Boolean))
)

const ALL_ADMIN_EMAILS = Array.from(
  new Set([...ENV_ADMIN_EMAILS, ...DEFAULT_ADMIN_EMAILS].filter(Boolean))
)

/**
 * Synchronous admin check when userId and email are already resolved.
 */
export function isUserAdmin(userId: string | null, email?: string | null): boolean {
  if (!userId) return false
  if (ALL_ADMIN_IDS.includes(userId)) return true
  if (email) {
    const cleanEmail = email.toLowerCase().trim()
    if (ALL_ADMIN_EMAILS.includes(cleanEmail) || cleanEmail.includes("kesarsaket607")) return true
  }
  return false
}

/**
 * Access check for Dynamic QR Studio (/dashboard/qr-studio)
 * Explicitly grants access to kesarsaket607 and system admins.
 */
export function isQrStudioAuthorized(userId: string | null, email?: string | null): boolean {
  if (!userId) return false
  if (email && email.toLowerCase().includes("kesarsaket607")) return true
  return isUserAdmin(userId, email)
}

/**
 * Async admin check that inspects the current user if email is not provided.
 */
export async function isMarketingAdmin(userId: string | null): Promise<boolean> {
  if (!userId) return false
  if (isUserAdmin(userId)) return true

  try {
    const user = await currentUser()
    const email = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase()
    return isUserAdmin(userId, email)
  } catch (err) {
    console.error("Error verifying marketing admin identity:", err)
    return false
  }
}
