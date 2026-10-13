import { type NextRequest, NextResponse } from "next/server"
import { auth, currentUser } from "@clerk/nextjs/server"
import { isUserAdmin } from "@/lib/marketing-auth"
import { getFormDocById } from "@/lib/appwrite/forms"
import { generateFormXlsxTemplate } from "@/lib/forms/xlsx"

interface Context {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: Context) {
  try {
    const { id } = await params
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await currentUser().catch(() => null)
    const email = user?.emailAddresses?.[0]?.emailAddress ?? null
    if (!isUserAdmin(userId, email)) {
      return NextResponse.json({ error: "Forbidden: Admin access only." }, { status: 403 })
    }

    const form = await getFormDocById(id)
    if (!form || form.owner_id !== userId) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    const buffer = await generateFormXlsxTemplate({
      title: form.title,
      slug: form.slug,
      fields: form.schema,
    })

    return new Response(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${form.slug}-template.xlsx"`,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to generate spreadsheet template." }, { status: 500 })
  }
}
