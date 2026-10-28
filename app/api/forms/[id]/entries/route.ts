import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getFormDocById } from "@/lib/appwrite/forms"
import { decryptSecret } from "@/lib/forms/crypto"
import { callAppsScript } from "@/lib/forms/client"

interface Context {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: Context) {
  try {
    const { id } = await params
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const form = await getFormDocById(id)
    if (!form || form.owner_id !== userId) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    if (!form.permissions?.read) {
      return NextResponse.json(
        { error: "Read permission is not enabled for this form script." },
        { status: 403 }
      )
    }

    if (!form.script_url || !form.script_secret_enc) {
      return NextResponse.json({ error: "Google Apps Script connection is not configured." }, { status: 400 })
    }

    const url = new URL(request.url)
    const offset = parseInt(url.searchParams.get("offset") || "0", 10)
    const limit = parseInt(url.searchParams.get("limit") || "25", 10)
    const isCsvExport = url.searchParams.get("export") === "csv"

    const secret = decryptSecret(form.script_secret_enc)
    const scriptRes = await callAppsScript(form.script_url, {
      secret,
      action: "list",
      offset: isCsvExport ? 0 : offset,
      limit: isCsvExport ? 1000 : limit,
    })

    if (!scriptRes.ok) {
      return NextResponse.json({ error: scriptRes.error || "Failed to retrieve entries from Google Sheet." }, { status: 502 })
    }

    // If CSV export requested
    if (isCsvExport) {
      const entries = scriptRes.entries || []
      const fields = form.schema.filter((f) => f.type !== "heading" && f.type !== "paragraph" && f.type !== "divider")
      const cols = ["_id", "_submitted_at", ...fields.map((f) => f.key)]

      const csvLines = [cols.join(",")]
      for (const entry of entries) {
        const row = cols.map((c) => {
          const val = entry[c] ?? ""
          const escaped = String(val).replace(/"/g, '""')
          return `"${escaped}"`
        })
        csvLines.push(row.join(","))
      }

      return new Response(csvLines.join("\n"), {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${form.slug}-entries.csv"`,
        },
      })
    }

    return NextResponse.json(scriptRes)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch entries." }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: Context) {
  try {
    const { id } = await params
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const form = await getFormDocById(id)
    if (!form || form.owner_id !== userId) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    if (!form.permissions?.edit) {
      return NextResponse.json(
        { error: "Edit permission is not enabled for this form script." },
        { status: 403 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const entryId = body.id
    const updates = body.updates

    if (!entryId || !updates) {
      return NextResponse.json({ error: "Missing entry id or updates." }, { status: 400 })
    }

    const secret = decryptSecret(form.script_secret_enc)
    const scriptRes = await callAppsScript(form.script_url, {
      secret,
      action: "update",
      id: entryId,
      updates,
    })

    if (!scriptRes.ok) {
      return NextResponse.json({ error: scriptRes.error || "Failed to update entry." }, { status: 502 })
    }

    return NextResponse.json(scriptRes)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update entry." }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: Context) {
  try {
    const { id } = await params
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const form = await getFormDocById(id)
    if (!form || form.owner_id !== userId) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    if (!form.permissions?.delete) {
      return NextResponse.json(
        { error: "Delete permission is not enabled for this form script." },
        { status: 403 }
      )
    }

    const url = new URL(request.url)
    const entryId = url.searchParams.get("entryId")
    if (!entryId) {
      return NextResponse.json({ error: "Missing entryId parameter." }, { status: 400 })
    }

    const secret = decryptSecret(form.script_secret_enc)
    const scriptRes = await callAppsScript(form.script_url, {
      secret,
      action: "delete",
      id: entryId,
    })

    if (!scriptRes.ok) {
      return NextResponse.json({ error: scriptRes.error || "Failed to delete entry." }, { status: 502 })
    }

    return NextResponse.json(scriptRes)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete entry." }, { status: 500 })
  }
}
