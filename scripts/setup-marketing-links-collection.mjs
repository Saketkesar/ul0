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
const COL_ID = "marketing_links"

if (!project || !key) {
  console.error("Missing APPWRITE_PROJECT_ID or APPWRITE_API_KEY in environment.")
  process.exit(1)
}

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
      name: "Marketing Links",
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

  // Attributes
  const stringAttrs = [
    { key: "alias", size: 64, required: true },
    { key: "destination_url", size: 2000, required: true },
    { key: "owner_clerk_user_id", size: 255, required: true },
    { key: "created_at", size: 64, required: true },
    { key: "updated_at", size: 64, required: true },
  ]

  for (const attr of stringAttrs) {
    const r = await api(`/databases/${DB_ID}/collections/${COL_ID}/attributes/string`, "POST", attr)
    console.log(`Attribute (string) ${attr.key}:`, r.status, r.ok ? "created" : r.data?.message || "exists")
  }

  const intAttrs = [
    { key: "blog_count", min: 1, max: 10, default: 3, required: false },
    { key: "total_gate_opens", required: false, default: 0 },
    { key: "total_completions", required: false, default: 0 },
  ]

  for (const attr of intAttrs) {
    const r = await api(`/databases/${DB_ID}/collections/${COL_ID}/attributes/integer`, "POST", attr)
    console.log(`Attribute (int) ${attr.key}:`, r.status, r.ok ? "created" : r.data?.message || "exists")
  }

  const boolAttrs = [
    { key: "is_active", required: false, default: true },
  ]

  for (const attr of boolAttrs) {
    const r = await api(`/databases/${DB_ID}/collections/${COL_ID}/attributes/boolean`, "POST", attr)
    console.log(`Attribute (bool) ${attr.key}:`, r.status, r.ok ? "created" : r.data?.message || "exists")
  }

  console.log("Waiting 3s for attributes to settle...")
  await new Promise((r) => setTimeout(r, 3000))

  // Indexes
  const idx1 = await api(`/databases/${DB_ID}/collections/${COL_ID}/indexes`, "POST", {
    key: "uniq_marketing_alias",
    type: "unique",
    attributes: ["alias"],
  })
  console.log("Index uniq_marketing_alias:", idx1.status, idx1.ok ? "created" : idx1.data?.message || "exists")

  const idx2 = await api(`/databases/${DB_ID}/collections/${COL_ID}/indexes`, "POST", {
    key: "idx_marketing_owner",
    type: "key",
    attributes: ["owner_clerk_user_id"],
  })
  console.log("Index idx_marketing_owner:", idx2.status, idx2.ok ? "created" : idx2.data?.message || "exists")

  console.log("Done configuring Appwrite marketing_links collection!")
}

run().catch(console.error)
