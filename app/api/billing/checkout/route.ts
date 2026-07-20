import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const POLAR_API_KEY = "polar_oat_eu4RpbXDy0vVLq8aJyne7Y4A1H422FgwsoBDK2p4zzD"

const PRICE_IDS: Record<string, string> = {
  pro_monthly: "faa20c9c-292c-4ea8-b894-02ed3f0174de",
  pro_annually: "4c95da77-56cc-4cd9-9306-8c5a6502062b",
  business_monthly: "ad059c74-e332-4f51-9d4c-c7b50aab0066",
  business_annually: "432cfd6a-b3e2-43e1-9195-df45d62fe46d",
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url))
    }

    const { searchParams } = new URL(req.url)
    const plan = searchParams.get("plan") // e.g., 'pro_monthly'

    if (!plan || !PRICE_IDS[plan]) {
      return NextResponse.json({ error: "Invalid plan specified" }, { status: 400 })
    }

    const priceId = PRICE_IDS[plan]

    // Construct the success URL pointing back to our pricing page
    const successUrl = `${new URL(req.url).origin}/pricing?success=true`

    // Create checkout session on Polar
    const res = await fetch("https://api.polar.sh/v1/checkouts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${POLAR_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_price_id: priceId,
        success_url: successUrl,
        require_billing_address: true,
        customer_billing_address: {
          country: "IN",
        },
        metadata: {
          clerk_user_id: userId,
        },
      }),
    })

    if (!res.ok) {
      const errorData = await res.json()
      console.error("Polar Checkout Session API error:", errorData)
      return NextResponse.json({ error: "Failed to initialize checkout session with Polar" }, { status: 500 })
    }

    const data = await res.json()
    if (data.url) {
      return NextResponse.redirect(data.url)
    }

    return NextResponse.json({ error: "No checkout URL returned from Polar" }, { status: 500 })
  } catch (error) {
    console.error("Billing checkout route error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
