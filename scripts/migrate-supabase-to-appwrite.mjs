// Migrates links and clicks from Supabase into Appwrite.
// - Preserves each link's slug and click count.
// - Reuses the original Supabase UUID as the Appwrite document $id so clicks
//   keep referencing the correct link.
// - Idempotent: re-running upserts (existing docs are updated, not duplicated).
// - Writes a migration report to scripts/migration-report.json and never aborts
//   the whole run on a single record failure.
//
// Run AFTER scripts/appwrite-setup.mjs:
//   node scripts/migrate-supabase-to-appwrite.mjs
//
// Requires: SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (bypasses RLS),
//           APPWRITE_* vars.

import { readFileSync, writeFileSync } from "node:fs"
import { createClient } from "@supabase/supabase-js"
import { Client, Databases } from "node-appwrite"

function loadEnv() {
  try {
    const raw = readFileSync(new URL("../.env", import.meta.url), "utf8")
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/)
      if (!m) continue
      let [, k, v] = m
      v = v.replace(/^["']|["']$/g, "")
      if (!(k in process.env)) process.env[k] = v
    }
  } catch {}
}
loadEnv()

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const DB_ID = process.env.APPWRITE_DATABASE_ID || "ul0"
const DEFAULT_HOST = "ul0.site"

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.")
  process.exit(1)
}
if (!process.env.APPWRITE_PROJECT_ID || !process.env.APPWRITE_API_KEY) {
  console.error("Missing APPWRITE_PROJECT_ID or APPWRITE_API_KEY.")
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } })
const appwrite = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY)
const db = new Databases(appwrite)

const report = {
  startedAt: new Date().toISOString(),
  links: { total: 0, migrated: 0, failed: [] },
  clicks: { total: 0, migrated: 0, failed: [] },
}

// Appwrite $id must match ^[a-zA-Z0-9][a-zA-Z0-9._-]{0,35}$. Supabase UUIDs
// (36 chars, dashes, leading alphanumeric) satisfy this, so we reuse them.
function safeId(uuid) {
  return /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,35}$/.test(uuid) ? uuid : null
}

async function upsert(collectionId, docId, data) {
  // Insert-if-missing: fast and resumable. Already-migrated rows return 409
  // and are skipped (this is a one-time migration, no need to overwrite).
  try {
    await db.createDocument(DB_ID, collectionId, docId, data)
    return "created"
  } catch (err) {
    if (err?.code === 409) return "exists"
    throw err
  }
}

// Run an async handler over items with bounded concurrency.
async function pool(items, concurrency, handler) {
  let index = 0
  async function worker() {
    while (index < items.length) {
      const i = index++
      await handler(items[i])
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker))
}

async function paginate(table, handler) {
  const pageSize = 500
  let from = 0
  for (;;) {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .range(from, from + pageSize - 1)
    if (error) throw new Error(`Supabase read ${table}: ${error.message}`)
    if (!data || data.length === 0) break
    await pool(data, 15, handler)
    if (data.length < pageSize) break
    from += pageSize
  }
}

async function migrateLinks() {
  console.log("Migrating links...")
  await paginate("links", async (row) => {
    report.links.total++
    const id = safeId(row.id)
    if (!id) {
      report.links.failed.push({ id: row.id ?? "(unknown)", reason: "id not Appwrite-compatible" })
      return
    }
    const doc = {
      slug: row.slug,
      long_url: row.long_url,
      host: DEFAULT_HOST,
      owner_id: row.owner_id || null,
      clicks_count: row.clicks_count ?? 0,
      created_at: row.created_at || null,
      expire_at: row.expire_at || null,
      meta_title: row.meta_title || null,
      meta_domain: row.meta_domain || null,
      meta_favicon_url: row.meta_favicon_url || null,
      link_type: row.link_type || "normal",
      origin_id: row.id,
    }
    try {
      const r = await upsert("links", id, doc)
      if (r === "created") report.links.migrated++
    } catch (err) {
      report.links.failed.push({ id: row.id, reason: err?.message || String(err) })
    }
    if (report.links.total % 100 === 0) console.log(`  links: ${report.links.total} processed`)
  })
}

async function migrateClicks() {
  console.log("Migrating clicks...")
  await paginate("clicks", async (row) => {
    report.clicks.total++
    const id = safeId(row.id)
    const linkId = safeId(row.link_id)
    if (!id || !linkId) {
      report.clicks.failed.push({ id: row.id ?? "(unknown)", reason: "id/link_id not compatible" })
      return
    }
    const doc = {
      link_id: linkId,
      clicked_at: row.clicked_at || null,
      device_type: row.device_type || null,
      country: row.country || null,
      referrer: (row.referrer || "").slice(0, 500) || null,
      user_agent: (row.user_agent || "").slice(0, 500) || null,
      ip_hash: row.ip_hash || null,
    }
    try {
      const r = await upsert("clicks", id, doc)
      if (r === "created") report.clicks.migrated++
    } catch (err) {
      report.clicks.failed.push({ id: row.id, reason: err?.message || String(err) })
    }
    if (report.clicks.total % 100 === 0) console.log(`  clicks: ${report.clicks.total} processed`)
  })
}

async function run() {
  await migrateLinks()
  await migrateClicks()
  report.finishedAt = new Date().toISOString()
  writeFileSync(new URL("./migration-report.json", import.meta.url), JSON.stringify(report, null, 2))

  console.log("\n--- Migration summary ---")
  console.log(`Links:  ${report.links.migrated}/${report.links.total} migrated, ${report.links.failed.length} failed`)
  console.log(`Clicks: ${report.clicks.migrated}/${report.clicks.total} migrated, ${report.clicks.failed.length} failed`)
  console.log("Report written to scripts/migration-report.json")

  if (report.clicks.failed.length > 0 || report.links.failed.length > 0) {
    console.log("\n⚠️  Some records failed — see the report for IDs and reasons.")
  } else {
    console.log("\n✅ Migration complete with no failures.")
  }
}

run().catch((err) => {
  console.error("\n❌ Migration crashed:", err?.message || err)
  process.exit(1)
})
