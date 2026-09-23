import "server-only"
import { currentUser } from "@clerk/nextjs/server"

const MARKETING_ADMIN_ID = process.env.MARKETING_ADMIN_CLERK_USER_ID || ""
const ADMIN_EMAIL = "kesarsaket607@gmail.com"

/**
 * Check if the given Clerk user is authorized as the marketing admin.
 * Matches against MARKETING_ADMIN_CLERK_USER_ID or the owner's primary email.
 */
export async function isMarketingAdmin(userId: string | null): Promise<boolean> {
  if (!userId) return false

  // 1. Direct match on Clerk User ID env var if configured
  if (MARKETING_ADMIN_ID && userId === MARKETING_ADMIN_ID) {
    return true
  }

  // 2. Primary email match for owner account
  try {
    const user = await currentUser()
    const email = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase()
    if (email === ADMIN_EMAIL) {
      console.log(`[Marketing Auth] Authorized admin ${email} (Clerk User ID: ${userId})`)
      return true
    }
  } catch (err) {
    console.error("Error verifying marketing admin identity:", err)
  }

  return false
}
