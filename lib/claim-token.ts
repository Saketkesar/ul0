import crypto from "crypto"
import { getDatabases } from "@/lib/appwrite/server"
import { APPWRITE_DATABASE_ID, COLLECTIONS } from "@/lib/appwrite/config"

const CLAIM_SECRET = process.env.CLAIM_SECRET || process.env.CLERK_SECRET_KEY || "ul0_claim_signing_secret_key"

export interface ClaimPayload {
  linkId: string
  slug: string
  createdAt: number
}

/**
 * Creates a signed claim token for an anonymous link.
 */
export function createClaimToken(linkId: string, slug: string): string {
  const payload: ClaimPayload = {
    linkId,
    slug,
    createdAt: Date.now(),
  }
  const serialized = Buffer.from(JSON.stringify(payload)).toString("base64url")
  const signature = crypto
    .createHmac("sha256", CLAIM_SECRET)
    .update(serialized)
    .digest("base64url")

  return `${serialized}.${signature}`
}

/**
 * Verifies a claim token. Returns payload if valid and under 7 days old.
 */
export function verifyClaimToken(token: string): ClaimPayload | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 2) return null
    const [serialized, signature] = parts

    const expectedSignature = crypto
      .createHmac("sha256", CLAIM_SECRET)
      .update(serialized)
      .digest("base64url")

    const sigBuf = Buffer.from(signature)
    const expectedBuf = Buffer.from(expectedSignature)
    if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
      return null
    }

    const payload: ClaimPayload = JSON.parse(
      Buffer.from(serialized, "base64url").toString("utf-8")
    )

    // Expire claim tokens after 7 days
    const maxAgeMs = 7 * 24 * 60 * 60 * 1000
    if (Date.now() - payload.createdAt > maxAgeMs) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

/**
 * Claims an anonymous link for an authenticated user.
 */
export async function claimLinkForUser(linkId: string, userId: string): Promise<boolean> {
  try {
    const db = getDatabases()
    const doc = await db.getDocument(APPWRITE_DATABASE_ID, COLLECTIONS.links, linkId)
    // Only claim if it currently has no owner
    if (!doc.owner_id) {
      await db.updateDocument(APPWRITE_DATABASE_ID, COLLECTIONS.links, linkId, {
        owner_id: userId,
      })
      return true
    }
    return false
  } catch (err) {
    console.error("Error claiming link:", err)
    return false
  }
}
