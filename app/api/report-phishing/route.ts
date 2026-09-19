import { NextRequest, NextResponse } from "next/server"

const BASIN_FORM_UUID = process.env.USEBASIN_FORM_UUID || "16f38d46e9f3"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const phishingUrl = formData.get("phishing_url")

    if (!phishingUrl || typeof phishingUrl !== "string" || !phishingUrl.trim()) {
      return NextResponse.json(
        { error: "Please enter the phishing or scam link." },
        { status: 400 }
      )
    }

    // Forward multipart form data directly to UseBasin
    const basinRes = await fetch(`https://usebasin.com/f/${BASIN_FORM_UUID}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    })

    if (!basinRes.ok) {
      const errorData = await basinRes.json().catch(() => ({}))
      return NextResponse.json(
        { error: errorData.error || "Unable to submit report to review inbox. Please try again." },
        { status: basinRes.status || 500 }
      )
    }

    const data = await basinRes.json().catch(() => ({}))

    return NextResponse.json({
      success: true,
      message: "Report received! You have earned good karma for protecting others.",
      data,
    })
  } catch (error: any) {
    console.error("Report phishing error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to submit report. Please try again." },
      { status: 500 }
    )
  }
}
