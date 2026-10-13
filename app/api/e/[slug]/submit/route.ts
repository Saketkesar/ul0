import { type NextRequest, NextResponse } from "next/server"
import { getFormDocBySlug } from "@/lib/appwrite/forms"
import { buildSubmissionSchema } from "@/lib/forms/schema"
import { decryptSecret } from "@/lib/forms/crypto"
import { callAppsScript } from "@/lib/forms/client"
import { redis } from "@/lib/redis"
import crypto from "node:crypto"

interface Context {
  params: Promise<{ slug: string }>
}

export async function POST(request: NextRequest, { params }: Context) {
  try {
    const { slug } = await params
    const cleanSlug = slug.toLowerCase().trim()

    // 1. IP and Rate Limiting via Redis
    const ip = request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1"
    const rateLimitKey = `rl:form_submit:${ip}:${cleanSlug}`

    try {
      const currentCount = await redis.incr(rateLimitKey)
      if (currentCount === 1) {
        await redis.expire(rateLimitKey, 60) // 1 minute window
      }
      if (currentCount > 15) {
        return NextResponse.json(
          { error: "Too many submissions. Please wait a minute before trying again." },
          { status: 429 }
        )
      }
    } catch {}

    // 2. Fetch Form
    const form = await getFormDocBySlug(cleanSlug)
    if (!form || form.status !== "live") {
      return NextResponse.json({ error: "This form is not accepting responses." }, { status: 404 })
    }

    if (!form.script_url || !form.script_secret_enc) {
      return NextResponse.json({ error: "Form connection is not configured." }, { status: 500 })
    }

    // 3. Check close date if set
    if (form.theme?.close_date) {
      const closeTime = new Date(form.theme.close_date).getTime()
      if (Date.now() > closeTime) {
        return NextResponse.json({ error: "This form is closed and no longer accepting submissions." }, { status: 400 })
      }
    }

    // 4. Parse request body with size cap (50 KB max)
    const rawBody = await request.text()
    if (rawBody.length > 50000) {
      return NextResponse.json({ error: "Submission payload too large." }, { status: 413 })
    }

    let parsedJson: Record<string, any> = {}
    try {
      parsedJson = JSON.parse(rawBody)
    } catch {
      return NextResponse.json({ error: "Invalid JSON submission." }, { status: 400 })
    }

    // 5. Honeypot check: silently accept and discard bot submissions
    if (parsedJson._hp && String(parsedJson._hp).trim().length > 0) {
      return NextResponse.json({ success: true, id: crypto.randomUUID() })
    }

    // 6. Validate with dynamic Zod schema
    const submissionSchema = buildSubmissionSchema(form.schema)
    const validationResult = submissionSchema.safeParse(parsedJson)

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of validationResult.error.issues) {
        const key = issue.path[0]?.toString() || "form"
        fieldErrors[key] = issue.message
      }
      return NextResponse.json(
        { error: "Validation failed.", fieldErrors },
        { status: 400 }
      )
    }

    const validData = validationResult.data
    delete validData._hp // Remove honeypot key

    // 7. Prepare Row payload with unique UUID & timestamp
    const _id = crypto.randomUUID()
    const _submitted_at = new Date().toISOString()
    const rowPayload = {
      _id,
      _submitted_at,
      ...validData,
    }

    // 8. Decrypt Secret & Send to Owner's Google Apps Script
    let secret = ""
    try {
      secret = decryptSecret(form.script_secret_enc)
    } catch {
      return NextResponse.json({ error: "Failed to authenticate with spreadsheet." }, { status: 500 })
    }

    const scriptRes = await callAppsScript(form.script_url, {
      secret,
      action: "append",
      row: rowPayload,
    })

    if (!scriptRes.ok) {
      if (scriptRes.error === "busy") {
        return NextResponse.json(
          { error: "The spreadsheet is currently busy. Please try submitting again in a moment." },
          { status: 503 }
        )
      }
      if (scriptRes.error === "schema_mismatch") {
        return NextResponse.json(
          { error: "The form sheet schema has changed. Please contact the form owner." },
          { status: 500 }
        )
      }
      return NextResponse.json(
        { error: "Could not save your response to the sheet. Please try again." },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true, id: _id })
  } catch (err: any) {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 })
  }
}
