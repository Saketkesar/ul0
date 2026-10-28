import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createFormDoc, listFormDocsByOwner, getFormDocBySlug } from "@/lib/appwrite/forms"
import { validateFormSlug } from "@/lib/forms/slug"
import { generateScriptSecret, encryptSecret } from "@/lib/forms/crypto"

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const forms = await listFormDocsByOwner(userId)
  return NextResponse.json({ forms })
}

export async function POST(request: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const title = String(body.title || "").trim() || "Untitled Form"
  const rawSlug = String(body.slug || "").trim().toLowerCase()

  const slugValidation = validateFormSlug(rawSlug)
  if (!slugValidation.valid) {
    return NextResponse.json({ error: slugValidation.error || "Invalid slug." }, { status: 400 })
  }
  const slug = slugValidation.sanitized!

  // Check unique slug
  const existing = await getFormDocBySlug(slug, true)
  if (existing) {
    return NextResponse.json({ error: "This slug is already taken. Please pick another." }, { status: 409 })
  }

  // Generate initial secret
  const rawSecret = generateScriptSecret()
  const script_secret_enc = encryptSecret(rawSecret)

  const initialSchema = [
    {
      id: "field_name",
      key: "name",
      type: "short_text",
      label: "Full Name",
      required: true,
      placeholder: "Jane Doe",
    },
    {
      id: "field_email",
      key: "email",
      type: "email",
      label: "Email Address",
      required: true,
      placeholder: "jane@example.com",
    },
  ]

  const form = await createFormDoc({
    owner_id: userId,
    slug,
    title,
    description: String(body.description || "").trim(),
    schema: initialSchema,
    theme: {
      accent: "teal",
      font: "sans",
      mode: "auto",
      submit_label: "Submit",
      success_message: "Thank you! Your response has been recorded.",
    },
    permissions: { read: true, edit: false, delete: false },
    script_secret_enc,
  })

  return NextResponse.json({
    form,
    rawSecret, // Returned ONLY on initial creation so UI can show in script block
  })
}
