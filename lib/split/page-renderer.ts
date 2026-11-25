import fs from "fs"
import path from "path"

const TEMPLATE_CACHE = new Map<string, string>()

function loadFile(filename: string): string {
  if (TEMPLATE_CACHE.has(filename)) {
    return TEMPLATE_CACHE.get(filename)!
  }

  const possiblePaths = [
    path.join(process.cwd(), "lib", "split", "pages", filename),
    path.join(process.cwd(), "public", "split-pages", filename),
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

export function renderSplitActionPage(
  pageType: "confirm-payment" | "not-received" | "already-paid" | "unsubscribe",
  data: {
    slug?: string
    token?: string
    memberIndex?: number
    friendName?: string
    creatorName?: string
    splitName?: string
    amount?: string | number
    upiId?: string
    paidCount?: number
    peopleCount?: number
    paidPercent?: number
    paidTime?: string
    email?: string
  }
): string {
  const filename = `${pageType}.html`
  let html = loadFile(filename)

  if (!html) {
    return `<!DOCTYPE html><html><head><title>UL0 Split</title></head><body style="font-family:sans-serif;padding:40px;text-align:center;"><h2>Page not found</h2><p><a href="/split">Back to UL0 Split</a></p></body></html>`
  }

  const slug = data.slug || ""
  const token = data.token || ""
  const memberIndex = data.memberIndex ?? 0
  const friendName = data.friendName || "Friend"
  const creatorName = data.creatorName || "Organizer"
  const splitName = data.splitName || "Split Bill"
  const amountStr = typeof data.amount === "number" ? `₹${data.amount.toFixed(0)}` : String(data.amount || "₹0")
  const upiId = data.upiId || ""
  const splitUrl = slug ? `/split/${slug}` : "/split"
  const dashboardUrl = "/split/dashboard"
  const paidCount = data.paidCount ?? 1
  const peopleCount = data.peopleCount ?? 2
  const paidPercent = data.paidPercent ?? 50
  const paidTime = data.paidTime || new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
  const email = data.email || ""

  // 1. Replace base64 top logo with clean branding
  html = html.replace(
    /<img src="data:image\/png;base64,[^"]*" alt="">/g,
    `<img src="/ul0split-logo-dark.png" alt="ul0.split" style="width:36px;height:36px;object-fit:contain;border-radius:50%;">`
  )

  // 2. Replace footer with user requested "by [logo]" branding (no trailing text)
  html = html.replace(
    /<div class="foot">Made with 🫶 by <a href="https:\/\/ul0\.site">UL0<\/a> · ul0\.split &amp; Hisab<\/div>/g,
    `<div class="foot">Made with 🫶 by <a href="https://ul0.site" style="color:#2F6159;font-weight:600;">UL0</a> · ul0.split &amp; Hisab · by <a href="https://ul0.site" target="_blank" rel="noopener noreferrer" style="display:inline-block;vertical-align:middle;margin:0 4px;"><img src="/ul0.png" style="height:14px;width:auto;display:inline-block;vertical-align:middle;" alt="UL0" /></a></div>`
  )

  // 3. Replace navigation links between pages
  const confirmHref = slug ? `/split/${slug}/confirm-payment?token=${encodeURIComponent(token)}&member=${memberIndex}` : "/split"
  const notReceivedHref = slug ? `/split/${slug}/not-received?token=${encodeURIComponent(token)}&member=${memberIndex}` : "/split"

  html = html.replace(/href="not-received\.html"/g, `href="${notReceivedHref}"`)
  html = html.replace(/href="confirm-payment\.html"/g, `href="${confirmHref}"`)

  // 4. Interpolate variables
  const replacements: Record<string, string> = {
    "{{friend_name}}": friendName,
    "{{creator_name}}": creatorName,
    "{{split_name}}": splitName,
    "{{amount}}": amountStr,
    "{{upi_id}}": upiId,
    "{{split_url}}": splitUrl,
    "{{dashboard_url}}": dashboardUrl,
    "{{pay_url}}": splitUrl,
    "{{paid_count}}": String(paidCount),
    "{{people_count}}": String(peopleCount),
    "{{paid_percent}}": String(paidPercent),
    "{{paid_time}}": paidTime,
    "{{email}}": email,
  }

  for (const [key, val] of Object.entries(replacements)) {
    html = html.split(key).join(val)
  }

  // 5. Inject client fetch handler for action buttons safely via JSON.stringify
  const jsSlug = JSON.stringify(slug)
  const jsToken = JSON.stringify(token)
  const jsMemberIdx = JSON.stringify(memberIndex)
  const jsEmail = JSON.stringify(email)

  let actionScript = ""
  if (pageType === "confirm-payment") {
    actionScript = `
    <script>
      (function() {
        const btn = document.querySelector('button[data-to="done"]');
        if (btn) {
          btn.addEventListener('click', function() {
            fetch('/api/split/' + encodeURIComponent(${jsSlug}) + '/confirm', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-collector-token': ${jsToken}
              },
              body: JSON.stringify({
                settlementIndex: ${jsMemberIdx},
                confirmed: true,
                token: ${jsToken}
              })
            }).catch(function(e) { console.error('Confirm error:', e); });
          });
        }
      })();
    </script>
    `
  } else if (pageType === "not-received") {
    actionScript = `
    <script>
      (function() {
        const btn = document.querySelector('button[data-to="done"]');
        if (btn) {
          btn.addEventListener('click', function() {
            const picked = document.getElementById('picked') ? document.getElementById('picked').textContent : '';
            const noteEl = document.querySelector('textarea.t');
            const note = noteEl ? noteEl.value : '';
            const reason = [picked, note].filter(Boolean).join(' - ') || 'Payment not in bank';

            fetch('/api/split/' + encodeURIComponent(${jsSlug}) + '/confirm', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-collector-token': ${jsToken}
              },
              body: JSON.stringify({
                settlementIndex: ${jsMemberIdx},
                confirmed: false,
                token: ${jsToken},
                reason: reason
              })
            }).catch(function(e) { console.error('Dispute error:', e); });
          });
        }
      })();
    </script>
    `
  } else if (pageType === "already-paid") {
    actionScript = `
    <script>
      (function() {
        const btn = document.querySelector('button[data-to="done"]');
        if (btn) {
          btn.addEventListener('click', function() {
            const utrEl = document.querySelector('input.t');
            const utrLast4 = utrEl ? utrEl.value.trim().slice(-4) : '';

            fetch('/api/split/' + encodeURIComponent(${jsSlug}) + '/claim', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                settlementIndex: ${jsMemberIdx},
                utrLast4: utrLast4
              })
            }).catch(function(e) { console.error('Claim error:', e); });
          });
        }
      })();
    </script>
    `
  } else if (pageType === "unsubscribe") {
    actionScript = `
    <script>
      (function() {
        const btn = document.querySelector('button[data-to="done"]');
        if (btn) {
          btn.addEventListener('click', function() {
            const picked = document.getElementById('picked') ? document.getElementById('picked').textContent : 'All emails';
            fetch('/api/split/unsubscribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: ${jsEmail}, mode: picked })
            }).catch(function(e) { console.error('Unsubscribe error:', e); });
          });
        }
      })();
    </script>
    `
  }

  if (actionScript) {
    html = html.replace("</body>", `${actionScript}</body>`)
  }

  return html
}
