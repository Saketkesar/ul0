import "server-only"
import { currentUser } from "@clerk/nextjs/server"

const MARKETING_ADMIN_ID = process.env.MARKETING_ADMIN_CLERK_USER_ID || ""
const ADMIN_EMAILS = [
  "kesarsaket607@gmail.com",
  "saketkesar.bcseiot2024@huroorkee.ac.in",
  "dev45144@gmail.com",
]

const ADMIN_USER_IDS = [
  "user_3G4mPjpnIRkBEiRcnpjbEBkDcxc", // Saket Kesar
  "user_3G4rnFLHEvo7Fj8wlkWmU4eQ1qq", // Saket Kesar
  "user_3KM0jUFBVAeH8wi7WNkyhPrBMom", // Dev Saini
]

/**
 * Check if the given Clerk user is authorized as the marketing admin.
 * Exclusively restricted to Saket Kesar and Dev Saini.
 */
export async function isMarketingAdmin(userId: string | null): Promise<boolean> {
  if (!userId) return false

  // 1. Direct match on Clerk User ID env var or verified admin user IDs
  if (
    (MARKETING_ADMIN_ID && userId === MARKETING_ADMIN_ID) ||
    ADMIN_USER_IDS.includes(userId)
  ) {
    return true
  }

  // 2. Strict email match for Saket Kesar and Dev Saini
  try {
    const user = await currentUser()
    if (!user) return false

    const email = user.emailAddresses?.[0]?.emailAddress?.toLowerCase()
    if (email && ADMIN_EMAILS.includes(email)) {
      console.log(`[Marketing Auth] Authorized admin ${email} (${userId})`)
      return true
    }
  } catch (err) {
    console.error("Error verifying marketing admin identity:", err)
  }

  return false
}
