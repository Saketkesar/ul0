import fs from "fs"
import path from "path"

export type EmailTemplateName =
  | "welcome"
  | "split-created"
  | "marked-paid"
  | "invited"
  | "nudge"
  | "settled"
  | "weekly-recap"
  | "group-created"
  | "group-settled"

const TEMPLATE_FILE_MAP: Record<string, string> = {
  welcome: "01-welcome.html",
  "split-created": "02-split-created.html",
  "marked-paid": "03-marked-paid.html",
  invited: "04-invited.html",
  nudge: "05-nudge.html",
  settled: "06-settled.html",
  "weekly-recap": "07-weekly-recap.html",
  "group-created": "02-split-created.html",
  "group-settled": "06-settled.html",
}

const TEMPLATE_CACHE = new Map<string, string>()

function loadTemplateFile(filename: string): string {
  if (TEMPLATE_CACHE.has(filename)) {
    return TEMPLATE_CACHE.get(filename)!
  }

  // Look in lib/split/templates, then public/email/templates
  const possiblePaths = [
    path.join(process.cwd(), "lib", "split", "templates", filename),
    path.join(process.cwd(), "public", "email", "templates", filename),
  ]

  for (const p of possiblePaths) {
    try {
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, "utf-8")
        TEMPLATE_CACHE.set(filename, content)
        return content
      }
    } catch {}
  }

  return ""
}

/**
 * Replace {{variable}} tags in an HTML template string
 */
export function interpolateTemplate(html: string, variables: Record<string, any>): string {
  return html.replace(/\{\{([a-zA-Z0-9_-]+)\}\}/g, (match, key) => {
    if (key in variables && variables[key] !== undefined && variables[key] !== null) {
      return String(variables[key])
    }
    return ""
  })
}

export function renderEmail(
  templateName: EmailTemplateName,
  data: Record<string, any>
): { html: string; subject: string } {
  const filename = TEMPLATE_FILE_MAP[templateName] || "01-welcome.html"
  let templateHtml = loadTemplateFile(filename)

  if (!templateHtml) {
    // Basic fallback if file cannot be read
    templateHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2>{{split_name}}</h2>
        <p>Hi {{name}}{{friend_name}},</p>
        <p>Total: {{total}} | Share: {{amount}}{{share_amount}}</p>
        <p><a href="{{split_url}}">View Split</a></p>
      </div>
    `
  }

  // Extract <title> for subject
  const titleMatch = templateHtml.match(/<title>([^<]+)<\/title>/i)
  let rawSubject = titleMatch ? titleMatch[1].trim() : "UL0 Split Notification"

  // Defaults
  const mergedData: Record<string, any> = {
    unsubscribe_url: "https://ul0.site/split/unsubscribe",
    dashboard_url: "https://ul0.site/split/dashboard",
    help_url: "https://ul0.site/split",
    created_date: new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    paid_time: new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    ...data,
  }

  const html = interpolateTemplate(templateHtml, mergedData)
  const subject = interpolateTemplate(rawSubject, mergedData)

  return { html, subject }
}
