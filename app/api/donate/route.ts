import { NextResponse } from "next/server"

const POLAR_API_KEY = "polar_oat_eu4RpbXDy0vVLq8aJyne7Y4A1H422FgwsoBDK2p4zzD"
const DONATION_PRICE_ID = "a0889db8-0fdd-4b62-93c5-4409b1db97c0"

export async function GET(req: Request) {
  try {
    const { origin } = new URL(req.url)
    const successUrl = `${origin}/donate?success=true`

    const res = await fetch("https://api.polar.sh/v1/checkouts/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${POLAR_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_price_id: DONATION_PRICE_ID,
        success_url: successUrl,
        metadata: { source: "ul0-donate" },
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      console.error("Polar donation checkout error:", err)
      return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 })
    }

    const data = await res.json()
    if (data.url) return NextResponse.redirect(data.url)

    return NextResponse.json({ error: "No checkout URL returned" }, { status: 500 })
  } catch (error) {
    console.error("Donation checkout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
