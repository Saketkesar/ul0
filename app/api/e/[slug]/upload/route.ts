import { type NextRequest, NextResponse } from "next/server"
import { getFormDocBySlug } from "@/lib/appwrite/forms"
import { imageHost } from "@/lib/images/host"
import { DEFAULT_FORMS_IMAGE_SIZE_MB, ALLOWED_IMAGE_MIME_TYPES } from "@/lib/forms/plans"
import { redis } from "@/lib/redis"

interface Context {
  params: Promise<{ slug: string }>
}

function verifyImageMagicBytes(buffer: Buffer): string | null {
  if (buffer.length < 12) return null

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "image/png"
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg"
  }

  // GIF: 47 49 46 38
  if (
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38
  ) {
    return "image/gif"
  }

  // WebP: RIFF ... WEBP
  const riff = buffer.toString("ascii", 0, 4)
  const webp = buffer.toString("ascii", 8, 12)
  if (riff === "RIFF" && webp === "WEBP") {
    return "image/webp"
  }

  return null
}

export async function POST(request: NextRequest, { params }: Context) {
  try {
    const { slug } = await params
    const cleanSlug = slug.toLowerCase().trim()

    // Rate Limiting (5 uploads / minute per IP)
    const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1"
    const rateLimitKey = `rl:form_upload:${ip}:${cleanSlug}`

    try {
      const count = await redis.incr(rateLimitKey)
      if (count === 1) await redis.expire(rateLimitKey, 60)
      if (count > 6) {
        return NextResponse.json({ error: "Upload rate limit exceeded. Please wait a minute." }, { status: 429 })
      }
    } catch {}

    const form = await getFormDocBySlug(cleanSlug)
    if (!form || form.status !== "live") {
      return NextResponse.json({ error: "Form not found or not accepting responses." }, { status: 404 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 })
    }

    const maxSizeBytes = DEFAULT_FORMS_IMAGE_SIZE_MB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        { error: `File size exceeds maximum allowed (${DEFAULT_FORMS_IMAGE_SIZE_MB}MB).` },
        { status: 413 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Strict magic bytes verification
    const detectedMime = verifyImageMagicBytes(buffer)
    if (!detectedMime || !ALLOWED_IMAGE_MIME_TYPES.includes(detectedMime as any)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPG, PNG, WebP, and GIF images are allowed." },
        { status: 400 }
      )
    }

    const uploadRes = await imageHost.upload(buffer, file.name || "upload", detectedMime)
    return NextResponse.json({ url: uploadRes.url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to upload image." }, { status: 500 })
  }
}
