import { NextRequest, NextResponse } from "next/server"
import { getBacklinkByToken, verifyBacklink } from "@/lib/appwrite/backlinks"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const token = body.token as string | undefined

    if (!token?.trim()) {
      return NextResponse.json(
        { error: "Verification token is required." },
        { status: 400 }
      )
    }

    // 1. Find the backlink doc
    const doc = await getBacklinkByToken(token.trim())
    if (!doc) {
      return NextResponse.json(
        { error: "Invalid verification token. Please register first." },
        { status: 404 }
      )
    }

    // Already verified?
    if (doc.verified) {
      return NextResponse.json({
        success: true,
        already_verified: true,
        message: "This website is already verified and listed!",
      })
    }

    // 2. Fetch the website HTML and check for the badge
    let pageHtml = ""
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000)

      const res = await fetch(doc.website_url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "ul0-badge-verifier/1.0 (+https://ul0.site/backlinks)",
          Accept: "text/html",
        },
        redirect: "follow",
      })
      clearTimeout(timeout)

      if (!res.ok) {
        return NextResponse.json(
          {
            error: `Could not reach your website (HTTP ${res.status}). Make sure it's accessible and try again.`,
            verified: false,
          },
          { status: 422 }
        )
      }

      pageHtml = await res.text()
    } catch (fetchErr: any) {
      return NextResponse.json(
        {
          error: `Could not connect to ${doc.website_url}. Error: ${fetchErr.message || "timeout"}. Make sure the site is live and try again.`,
          verified: false,
        },
        { status: 422 }
      )
    }

    // 3. Check if the badge token or badge image exists in the page HTML
    const lowerHtml = pageHtml.toLowerCase()
    const tokenFound =
      pageHtml.includes(token) ||
      pageHtml.includes("ul0-verified.svg") ||
      (lowerHtml.includes("ul0.site") &&
        (lowerHtml.includes("backlink") || lowerHtml.includes("badge") || lowerHtml.includes("verified")))

    if (!tokenFound) {
      return NextResponse.json({
        success: false,
        verified: false,
        message:
          "Badge not found on your website. Please paste the badge HTML into your site's HTML source code and try again. Make sure the page is publicly accessible.",
      })
    }

    // 4. Mark as verified
    const updated = await verifyBacklink(doc.$id)

    return NextResponse.json({
      success: true,
      verified: true,
      site: {
        id: updated.$id,
        website_url: updated.website_url,
        website_name: updated.website_name,
        website_description: updated.website_description,
        logo_url: updated.logo_url || null,
        verified_at: updated.verified_at || new Date().toISOString(),
      },
      message:
        "Verified! Your website is now listed in the ul0 Free Backlink Directory with a dofollow link. Thank you for partnering with us!",
    })
  } catch (error: any) {
    console.error("Backlink verify error:", error)
    return NextResponse.json(
      { error: error.message || "Verification failed. Please try again." },
      { status: 500 }
    )
  }
}
