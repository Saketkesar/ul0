import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { imageHost } from "@/lib/images/host"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const contentType = request.headers.get("content-type") || ""
    let buffer: Buffer
    let filename = "upload.jpg"
    let mimeType = "image/jpeg"

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData()
      const file = formData.get("file") as File | null
      if (!file) {
        return NextResponse.json({ error: "No image file provided" }, { status: 400 })
      }
      filename = file.name || "upload.jpg"
      mimeType = file.type || "image/jpeg"
      const bytes = await file.arrayBuffer()
      buffer = Buffer.from(bytes)
    } else if (contentType.includes("application/json")) {
      const body = await request.json()
      if (!body.image) {
        return NextResponse.json({ error: "Image data is required" }, { status: 400 })
      }
      let base64 = body.image
      if (base64.startsWith("data:")) {
        const matches = base64.match(/^data:([^;]+);base64,(.+)$/)
        if (matches) {
          mimeType = matches[1]
          base64 = matches[2]
        }
      }
      buffer = Buffer.from(base64, "base64")
    } else {
      return NextResponse.json({ error: "Unsupported content type" }, { status: 400 })
    }

    if (buffer.length > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Image size must be under 5MB" }, { status: 400 })
    }

    const result = await imageHost.upload(buffer, filename, mimeType)
    return NextResponse.json({ success: true, url: result.url })
  } catch (err: any) {
    console.error("Image upload error:", err)
    return NextResponse.json({ error: err.message || "Failed to upload image" }, { status: 500 })
  }
}
