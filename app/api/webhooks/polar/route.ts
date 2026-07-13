import { NextResponse } from "next/server"
import { updateAccountPlan } from "@/lib/appwrite/accounts"

// Product ID mappings to local plan identifiers
const PRODUCT_PLANS: Record<string, string> = {
  "61a6d4fc-3356-48de-a4e6-decffbbf8a5c": "pro_user",      // Pro Monthly
  "ace42f73-01db-409a-a85b-337ad0195d8b": "pro_user",      // Pro Annual
  "50ce5c9c-9567-4a26-8f01-276ff0fca318": "business_user", // Business Monthly
  "3be6398c-2f4c-4471-869b-1173526e8fd5": "business_user", // Business Annual
}

export async function POST(req: Request) {
  try {
    const payload = await req.json()
    console.log("Received Polar webhook event:", JSON.stringify(payload, null, 2))

    const eventType = payload.type
    const data = payload.data

    if (!eventType || !data) {
      return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 })
    }

    // Try to retrieve clerk_user_id from metadata (copied from checkout session)
    const clerkUserId =
      data.metadata?.clerk_user_id ||
      data.checkout?.metadata?.clerk_user_id ||
      data.customer_metadata?.clerk_user_id

    if (!clerkUserId) {
      console.warn("Polar webhook event has no associated clerk_user_id. Ignoring.")
      return NextResponse.json({ success: true, message: "Ignored (no user id)" })
    }

    if (eventType === "subscription.created" || eventType === "subscription.updated") {
      const productId = data.product_id
      const status = data.status // e.g. "active", "canceled", "incomplete"
      
      const newPlan = PRODUCT_PLANS[productId] || "free_user"
      const billingStatus = status === "active" ? "active" : "past_due"

      console.log(`Updating user ${clerkUserId} plan to ${newPlan} (status: ${billingStatus})`)
      await updateAccountPlan(clerkUserId, newPlan, billingStatus)
    } 
    else if (eventType === "subscription.revoked") {
      console.log(`Revoking plan for user ${clerkUserId} (reset to free_user)`)
      await updateAccountPlan(clerkUserId, "free_user", "active")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Polar webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
