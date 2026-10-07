import "server-only"
import { currentUser } from "@clerk/nextjs/server"

const MARKETING_ADMIN_ID = process.env.MARKETING_ADMIN_CLERK_USER_ID || ""
const ADMIN_EMAILS = [
  "kesarsaket607@gmail.com",
  "dev45144@gmail.com",
]

/**
 * Check if the given Clerk user is authorized as the marketing admin.
 * Matches against MARKETING_ADMIN_CLERK_USER_ID, authorized admin emails,
 * or Clerk publicMetadata marketing_access/role flags.
 */
export async function isMarketingAdmin(userId: string | null): Promise<boolean> {
  if (!userId) return false

  // 1. Direct match on Clerk User ID env var or known admin user IDs
  if (
    (MARKETING_ADMIN_ID && userId === MARKETING_ADMIN_ID) ||
    userId === "user_3KM0jUFBVAeH8wi7WNkyhPrBMom" ||
    userId === "user_3G4mPjpnIRkBEiRcnpjbEBkDcxc"
  ) {
    return true
  }

  // 2. Email and metadata match
  try {
    const user = await currentUser()
    if (!user) return false

    const email = user.emailAddresses?.[0]?.emailAddress?.toLowerCase()
    if (email && ADMIN_EMAILS.includes(email)) {
      console.log(`[Marketing Auth] Authorized admin ${email} (Clerk User ID: ${userId})`)
      return true
    }

    const meta = (user.publicMetadata || {}) as Record<string, unknown>
    if (meta.marketing_access === true || meta.role === "marketing_admin") {
      console.log(`[Marketing Auth] Authorized marketing user via metadata (Clerk User ID: ${userId})`)
      return true
    }
  } catch (err) {
    console.error("Error verifying marketing admin identity:", err)
  }

  return false
}
