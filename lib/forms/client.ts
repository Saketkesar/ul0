if (typeof window !== "undefined") {
  throw new Error("lib/forms/client.ts is server-only and cannot be imported by client components.")
}

/**
 * Strict SSRF allowlist regex for Google Apps Script Web App endpoints.
 * Matches:
 * - Standard consumer: https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec
 * - Google Workspace: https://script.google.com/a/macros/<DOMAIN>/s/<DEPLOYMENT_ID>/exec
 */
export const APPS_SCRIPT_URL_REGEX =
  /^https:\/\/script\.google\.com\/(?:a\/macros\/[a-zA-Z0-9.-]+\/|macros\/)s\/[a-zA-Z0-9_-]+\/exec$/

export function isValidAppsScriptUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false
  return APPS_SCRIPT_URL_REGEX.test(url.trim())
}

export interface AppsScriptResponse {
  ok: boolean
  error?: string
  missing?: string[]
  id?: string
  deduplicated?: boolean
  total?: number
  entries?: any[]
  offset?: number
  limit?: number
}

/**
 * Executes a call to the owner's Google Apps Script Web App.
 * Follows HTTP 302 redirects properly to Google User Content and parses JSON response.
 */
export async function callAppsScript(
  scriptUrl: string,
  payload: Record<string, any>,
  timeoutMs = 15000
): Promise<AppsScriptResponse> {
  const cleanUrl = scriptUrl.trim()

  if (!isValidAppsScriptUrl(cleanUrl)) {
    throw new Error("Invalid script URL: must be an official https://script.google.com/.../exec endpoint.")
  }

  try {
    const res = await fetch(cleanUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      redirect: "follow",
      signal: AbortSignal.timeout(timeoutMs),
    })

    if (!res.ok && res.status !== 302) {
      if (res.status === 429 || res.status === 503) {
        return { ok: false, error: "busy" }
      }
      return { ok: false, error: `http_${res.status}` }
    }

    const text = await res.text()
    try {
      return JSON.parse(text)
    } catch {
      // Check if Google returned an unverified / quota HTML page
      if (text.includes("Service invoked too many times") || text.includes("Exception: Service invoked")) {
        return { ok: false, error: "google_quota_exceeded" }
      }
      return { ok: false, error: "bad_json" }
    }
  } catch (err: any) {
    if (err.name === "TimeoutError" || err.message?.includes("timeout")) {
      return { ok: false, error: "timeout" }
    }
    return { ok: false, error: "unreachable" }
  }
}
