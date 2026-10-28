import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { verifyClaimToken, claimLinkForUser } from "@/lib/claim-token"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token =
      request.cookies.get("ul0_claim_token")?.value ||
      (await request.json().catch(() => ({})))?.claimToken

    if (!token) {
      return NextResponse.json({ message: "No pending claim" }, { status: 200 })
    }

    const payload = verifyClaimToken(token)
    if (!payload) {
      const response = NextResponse.json({ error: "Invalid or expired claim token" }, { status: 400 })
      response.cookies.delete("ul0_claim_token")
      return response
    }

    const success = await claimLinkForUser(payload.linkId, userId)
    const response = NextResponse.json({
      success,
      claimedLinkId: payload.linkId,
      slug: payload.slug,
    })

    // Clear the claim token cookie once claimed
    response.cookies.delete("ul0_claim_token")
    return response
  } catch (error: any) {
    console.error("Error in claim API:", error)
    return NextResponse.json({ error: error?.message || "Failed to claim link" }, { status: 500 })
  }
}

