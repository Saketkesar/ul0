import { readFileSync } from "node:fs"

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

const endpoint = process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1"
const project = process.env.APPWRITE_PROJECT_ID
const key = process.env.APPWRITE_API_KEY
const DB_ID = process.env.APPWRITE_DATABASE_ID || "ul0"
const COL_ID = "monetized_links"

const headers = {
  "X-Appwrite-Project": project,
  "X-Appwrite-Key": key,
  "Content-Type": "application/json",
}

async function api(path, method = "GET", body = null) {
  const opts = { method, headers }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(`${endpoint}${path}`, opts)
  const text = await res.text()
  try {
    return { status: res.status, ok: res.ok, data: JSON.parse(text) }
  } catch {
    return { status: res.status, ok: res.ok, data: text }
  }
}

async function run() {
  console.log("Checking collection:", COL_ID)
  const checkCol = await api(`/databases/${DB_ID}/collections/${COL_ID}`)
  if (!checkCol.ok) {
    console.log("Creating collection...")
    const createRes = await api(`/databases/${DB_ID}/collections`, "POST", {
      collectionId: COL_ID,
      name: "Monetized Links",
      permissions: [
        'read("any")',
        'create("any")',
        'update("any")',
        'delete("any")',
      ],
      documentSecurity: false,
    })
    console.log("Collection create status:", createRes.status)
  } else {
    console.log("Collection already exists.")
  }

  // Create attributes
  const attrs = [
    { type: "string", key: "slug", size: 64, required: true },
    { type: "string", key: "title", size: 255, required: true },
    { type: "string", key: "target_url", size: 2000, required: true },
    { type: "integer", key: "total_steps", required: true, min: 2, max: 10, default: 3 },
    { type: "string", key: "blog_slugs", size: 10000, required: true },
    { type: "string", key: "owner_email", size: 255, required: true },
    { type: "string", key: "owner_id", size: 255, required: false },
    { type: "integer", key: "views", required: false, default: 0 },
    { type: "integer", key: "completed_unlocks", required: false, default: 0 },
    { type: "string", key: "created_at", size: 64, required: true },
  ]

  for (const attr of attrs) {
    let url = `/databases/${DB_ID}/collections/${COL_ID}/attributes/${attr.type}`
    let body = { ...attr }
    const r = await api(url, "POST", body)
    console.log(`Attribute ${attr.key}:`, r.status, r.ok ? "created" : r.data?.message || "exists")
  }

  console.log("Waiting 3s for attributes to settle...")
  await new Promise((r) => setTimeout(r, 3000))

  // Create indexes
  const idx1 = await api(`/databases/${DB_ID}/collections/${COL_ID}/indexes`, "POST", {
    key: "uniq_monetized_slug",
    type: "unique",
    attributes: ["slug"],
  })
  console.log("Index uniq_monetized_slug:", idx1.status, idx1.ok ? "created" : idx1.data?.message || "exists")

  const idx2 = await api(`/databases/${DB_ID}/collections/${COL_ID}/indexes`, "POST", {
    key: "idx_owner_email",
    type: "key",
    attributes: ["owner_email"],
  })
  console.log("Index idx_owner_email:", idx2.status, idx2.ok ? "created" : idx2.data?.message || "exists")

  console.log("Done!")
}

run().catch(console.error)
