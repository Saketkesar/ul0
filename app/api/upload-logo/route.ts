import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

const FREEIMAGE_API_KEY = "6d207e02198a847aa98d0a2a901485a5"
const FREEIMAGE_UPLOAD_URL = "https://freeimage.host/api/1/upload"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const contentType = request.headers.get("content-type") || ""

    let sourceValue = ""

    if (contentType.includes("application/json")) {
      const body = await request.json()
      if (!body.image) {
        return NextResponse.json({ error: "Image data is required" }, { status: 400 })
      }
      sourceValue = body.image
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData()
      const file = formData.get("source") as File | null
      if (!file) {
        return NextResponse.json({ error: "File source is required" }, { status: 400 })
      }
      // Convert file buffer to base64
      const bytes = await file.arrayBuffer()
      const base64 = Buffer.from(bytes).toString("base64")
      sourceValue = base64
    } else {
      return NextResponse.json({ error: "Unsupported content type" }, { status: 400 })
    }

    // Prepare payload for Freeimage.host API v1
    const uploadFormData = new FormData()
    uploadFormData.append("key", FREEIMAGE_API_KEY)
    uploadFormData.append("action", "upload")
    uploadFormData.append("format", "json")
    uploadFormData.append("source", sourceValue)

    const response = await fetch(FREEIMAGE_UPLOAD_URL, {
      method: "POST",
      body: uploadFormData,
    })

    const data = await response.json()

    if (!response.ok || data.status_code !== 200 || !data.image?.url) {
      console.error("Freeimage.host error:", data)
      return NextResponse.json(
        { error: data.error?.message || "Failed to upload image to freeimage.host" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      url: data.image.url,
      display_url: data.image.display_url || data.image.url,
      thumb: data.image.thumb?.url,
    })
  } catch (err: any) {
    console.error("Logo upload handler error:", err)
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 })
  }
}
