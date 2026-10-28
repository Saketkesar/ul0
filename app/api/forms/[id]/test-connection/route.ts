import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getFormDocById, updateFormDoc } from "@/lib/appwrite/forms"
import { decryptSecret } from "@/lib/forms/crypto"
import { callAppsScript, isValidAppsScriptUrl } from "@/lib/forms/client"

interface Context {
  params: Promise<{ id: string }>
}

export async function POST(request: NextRequest, { params }: Context) {
  try {
    const { id } = await params
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const form = await getFormDocById(id)
    if (!form || form.owner_id !== userId) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 })
    }

    const body = await request.json().catch(() => ({}))
    const testUrl = String(body.script_url || form.script_url || "").trim()

    if (!testUrl) {
      return NextResponse.json({ error: "Please enter your Google Apps Script Web App URL." }, { status: 400 })
    }

    if (!isValidAppsScriptUrl(testUrl)) {
      return NextResponse.json(
        {
          error: "Invalid URL. It must be an official https://script.google.com/macros/s/<ID>/exec URL.",
          code: "invalid_url",
        },
        { status: 400 }
      )
    }

    let secret = ""
    try {
      secret = decryptSecret(form.script_secret_enc)
    } catch {
      return NextResponse.json({ error: "Secret encryption error.", code: "secret_error" }, { status: 500 })
    }

    // Call ping action
    const res = await callAppsScript(testUrl, {
      secret,
      action: "ping",
    })

    if (!res.ok) {
      let message = "Could not connect to the Google Apps Script."
      if (res.error === "unauthorized") {
        message = "Wrong secret: The script currently running in Google Sheets has a different secret. Please re-copy the generated script."
      } else if (res.error === "sheet_missing") {
        message = 'Sheet tab missing: Your spreadsheet must have a tab named exactly "Responses".'
      } else if (res.error === "schema_mismatch") {
        message = `Header mismatch: Missing columns in sheet: ${res.missing?.join(", ") || "required headers"}.`
      } else if (res.error === "google_quota_exceeded") {
        message = "Google Quota Exceeded: 'Service invoked too many times'. Please wait a moment."
      } else if (res.error === "timeout") {
        message = "Connection timed out (15s). Ensure your script is deployed with access set to 'Anyone'."
      } else if (res.error === "unreachable") {
        message = "Could not reach Google Apps Script. Check the deployment URL and make sure Who has access is 'Anyone'."
      }

      return NextResponse.json(
        {
          ok: false,
          error: message,
          message: message,
          code: res.error || "failed",
          missing: res.missing,
        },
        { status: 400 }
      )
    }

    // Save verified script_url to the form doc
    await updateFormDoc(id, { script_url: testUrl })

    return NextResponse.json({
      ok: true,
      message: "Connection verified! Your Google Sheet is ready to receive submissions.",
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to test connection." }, { status: 500 })
  }
}
