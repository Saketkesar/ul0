import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getFormDocById, updateFormDoc, deleteFormDoc, getFormDocBySlug } from "@/lib/appwrite/forms"
import { validateFormSlug } from "@/lib/forms/slug"

interface Context {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: Context) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const form = await getFormDocById(id)
  if (!form || form.owner_id !== userId) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 })
  }

  return NextResponse.json({ form })
}

export async function PATCH(request: NextRequest, { params }: Context) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const existing = await getFormDocById(id)
  if (!existing || existing.owner_id !== userId) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 })
  }

  const body = await request.json().catch(() => ({}))
  const updates: any = {}

  if (body.title !== undefined) updates.title = String(body.title).trim()
  if (body.description !== undefined) updates.description = String(body.description).trim()

  if (body.slug !== undefined) {
    const slugValidation = validateFormSlug(String(body.slug))
    if (!slugValidation.valid) {
      return NextResponse.json({ error: slugValidation.error || "Invalid slug" }, { status: 400 })
    }
    const cleanSlug = slugValidation.sanitized!
    if (cleanSlug !== existing.slug) {
      const slugTaken = await getFormDocBySlug(cleanSlug, true)
      if (slugTaken) {
        return NextResponse.json({ error: "Slug is already in use." }, { status: 409 })
      }
      updates.slug = cleanSlug
    }
  }

  if (body.status !== undefined && ["draft", "live", "paused"].includes(body.status)) {
    updates.status = body.status
    if (body.status === "live" && !existing.published_at) {
      updates.published_at = new Date().toISOString()
    }
  }

  if (body.step !== undefined) updates.step = Number(body.step) || 1
  if (body.schema !== undefined) updates.schema = body.schema
  if (body.theme !== undefined) updates.theme = body.theme
  if (body.permissions !== undefined) updates.permissions = body.permissions
  if (body.script_url !== undefined) updates.script_url = String(body.script_url).trim()

  const updated = await updateFormDoc(id, updates)
  return NextResponse.json({ form: updated })
}

export async function DELETE(request: NextRequest, { params }: Context) {
  const { id } = await params
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const existing = await getFormDocById(id)
  if (!existing || existing.owner_id !== userId) {
    return NextResponse.json({ error: "Form not found" }, { status: 404 })
  }

  await deleteFormDoc(id, userId)
  return NextResponse.json({ success: true })
}
