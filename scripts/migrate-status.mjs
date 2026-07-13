import { readFileSync } from "node:fs"
import { createClient } from "@supabase/supabase-js"
import { Client, Databases, Query } from "node-appwrite"

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

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
)
const db = new Databases(
  new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY),
)
const DB_ID = process.env.APPWRITE_DATABASE_ID || "ul0"

const sbLinks = await supabase.from("links").select("*", { count: "exact", head: true })
const sbClicks = await supabase.from("clicks").select("*", { count: "exact", head: true })
const awLinks = await db.listDocuments(DB_ID, "links", [Query.limit(1)])
const awClicks = await db.listDocuments(DB_ID, "clicks", [Query.limit(1)])

console.log("Supabase links:", sbLinks.count)
console.log("Supabase clicks:", sbClicks.count)
console.log("Appwrite links:", awLinks.total)
console.log("Appwrite clicks:", awClicks.total)
