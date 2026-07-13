import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getAccountByClerkId, updateAccountApiKey } from "@/lib/appwrite/accounts"
import { getPlanLimits } from "@/lib/plans"
import { checkRateLimit, getClientIP } from "@/lib/utils/rate-limit"

function generateApiKey(): string {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = "ul0_"
  for (let i = 0; i < 32; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const clientIP = getClientIP(request)
    const rateLimitResult = await checkRateLimit(`keys:generate:${userId || clientIP}`, {
      windowMs: 60000,
      maxRequests: 5,
    })

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      )
    }

    const account = await getAccountByClerkId(userId)
    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 })
    }

    const limits = getPlanLimits(account.plan)
    if (account.plan === "free_user") {
      return NextResponse.json(
        { error: "API access is a premium feature. Please upgrade to Pro or Business plan." },
        { status: 403 }
      )
    }

    const newKey = generateApiKey()
    await updateAccountApiKey(userId, newKey)

    return NextResponse.json({ apiKey: newKey })
  } catch (error: any) {
    console.error("API Key generation error:", error)
    return NextResponse.json({ error: error?.message ?? "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const clientIP = getClientIP(request)
    const rateLimitResult = await checkRateLimit(`keys:delete:${userId || clientIP}`, {
      windowMs: 60000,
      maxRequests: 5,
    })

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      )
    }

    await updateAccountApiKey(userId, null)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("API Key deletion error:", error)
    return NextResponse.json({ error: error?.message ?? "Internal server error" }, { status: 500 })
  }
}
