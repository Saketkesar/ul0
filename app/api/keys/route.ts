import { type NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { listUserApiKeys, createUserApiKey, revokeUserApiKey } from "@/lib/api-keys"
import { getAccountByClerkId } from "@/lib/appwrite/accounts"
import { getActivePlan } from "@/lib/plan.server"
import { checkRateLimit, getClientIP } from "@/lib/utils/rate-limit"

export async function GET(request: NextRequest) {
  try {
    const authSession = await auth()
    const { userId } = authSession
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [user, accountDoc, keys] = await Promise.all([
      currentUser().catch(() => null),
      getAccountByClerkId(userId).catch(() => null),
      listUserApiKeys(userId).catch(() => []),
    ])

    const plan = getActivePlan(authSession, user, accountDoc)
    const isAllowed = plan.slug === "pro_user" || plan.slug === "business_user"

    if (!isAllowed) {
      return NextResponse.json({
        keys: [],
        plan: plan.slug,
        locked: true,
        error: "API access is reserved for Pro and Business subscriptions.",
      })
    }

    return NextResponse.json({ keys, plan: plan.slug, locked: false })
  } catch (error: any) {
    console.error("API Keys GET error:", error)
    return NextResponse.json({ error: error?.message ?? "Failed to fetch keys" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authSession = await auth()
    const { userId } = authSession
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [user, accountDoc] = await Promise.all([
      currentUser().catch(() => null),
      getAccountByClerkId(userId).catch(() => null),
    ])

    const plan = getActivePlan(authSession, user, accountDoc)
    if (plan.slug !== "pro_user" && plan.slug !== "business_user") {
      return NextResponse.json(
        {
          error: "API access is reserved for Pro and Business plans. Please upgrade your plan to generate API keys.",
          code: "UPGRADE_REQUIRED",
        },
        { status: 403 }
      )
    }

    const clientIP = getClientIP(request)
    const rateLimitResult = await checkRateLimit(`keys:generate:${userId || clientIP}`, {
      windowMs: 60000,
      maxRequests: 5,
    })

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute before creating another key." },
        { status: 429 }
      )
    }

    let body: { name?: string } = {}
    try {
      body = await request.json()
    } catch {}

    const name = (body.name || "Default API Key").slice(0, 50)
    const created = await createUserApiKey(userId, name)

    return NextResponse.json({
      key: {
        id: created.id,
        name: created.name,
        prefix: created.prefix,
        created_at: created.created_at,
        last_used_at: created.last_used_at,
      },
      secretKey: created.secretKey,
      plan: plan.slug,
    })
  } catch (error: any) {
    console.error("API Key generation error:", error)
    return NextResponse.json({ error: error?.message ?? "Failed to create API key" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let keyId = request.nextUrl.searchParams.get("id")
    if (!keyId) {
      try {
        const body = await request.json()
        keyId = body.id
      } catch {}
    }

    if (!keyId) {
      keyId = "key_default"
    }

    await revokeUserApiKey(userId, keyId)
    return NextResponse.json({ success: true, revokedId: keyId })
  } catch (error: any) {
    console.error("API Key deletion error:", error)
    return NextResponse.json({ error: error?.message ?? "Failed to delete API key" }, { status: 500 })
  }
}
