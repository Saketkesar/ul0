// Bootstraps the Appwrite database, collections, attributes, and indexes for ul0.
// Idempotent: safe to re-run. Existing resources are skipped.
//
// Run:  node scripts/appwrite-setup.mjs
// Requires APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY, APPWRITE_DATABASE_ID.

import { readFileSync } from "node:fs"
import { Client, Databases, IndexType } from "node-appwrite"

// --- Minimal .env loader (so the script works without dotenv or --env-file) ---
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
  } catch {
    /* .env optional if vars already set */
  }
}
loadEnv()

const ENDPOINT = process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1"
const PROJECT = process.env.APPWRITE_PROJECT_ID
const API_KEY = process.env.APPWRITE_API_KEY
const DB_ID = process.env.APPWRITE_DATABASE_ID || "ul0"

if (!PROJECT || !API_KEY) {
  console.error("Missing APPWRITE_PROJECT_ID or APPWRITE_API_KEY. Set them in .env first.")
  process.exit(1)
}

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT).setKey(API_KEY)
const db = new Databases(client)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// 409 = already exists. Treat as success for idempotency.
async function ok(promise, label) {
  try {
    await promise
    console.log(`  ✓ ${label}`)
  } catch (err) {
    if (err?.code === 409) console.log(`  • ${label} (exists)`)
    else throw err
  }
}

async function ensureDatabase() {
  console.log("Database:")
  await ok(db.create(DB_ID, "ul0"), `database ${DB_ID}`)
}

async function ensureCollection(id, name) {
  await ok(db.createCollection(DB_ID, id, name), `collection ${id}`)
}

// Wait until all attributes on a collection report "available" before indexing.
async function waitForAttributes(collectionId) {
  for (let i = 0; i < 30; i++) {
    const { attributes } = await db.listAttributes(DB_ID, collectionId)
    if (attributes.length > 0 && attributes.every((a) => a.status === "available")) return
    await sleep(1000)
  }
  console.warn(`  ! attributes for ${collectionId} not all available yet; indexes may fail`)
}

async function setup() {
  await ensureDatabase()

  // ---------------- links ----------------
  console.log("Collection: links")
  await ensureCollection("links", "Links")
  await ok(db.createStringAttribute(DB_ID, "links", "slug", 64, true), "slug")
  await ok(db.createStringAttribute(DB_ID, "links", "long_url", 4000, true), "long_url")
  await ok(db.createStringAttribute(DB_ID, "links", "host", 255, false, "ul0.site"), "host")
  await ok(db.createStringAttribute(DB_ID, "links", "owner_id", 64, false), "owner_id")
  await ok(db.createIntegerAttribute(DB_ID, "links", "clicks_count", false, 0), "clicks_count")
  await ok(db.createDatetimeAttribute(DB_ID, "links", "created_at", false), "created_at")
  await ok(db.createDatetimeAttribute(DB_ID, "links", "expire_at", false), "expire_at")
  await ok(db.createStringAttribute(DB_ID, "links", "meta_title", 512, false), "meta_title")
  await ok(db.createStringAttribute(DB_ID, "links", "meta_domain", 255, false), "meta_domain")
  await ok(db.createStringAttribute(DB_ID, "links", "meta_favicon_url", 1000, false), "meta_favicon_url")
  await ok(db.createStringAttribute(DB_ID, "links", "link_type", 16, false, "normal"), "link_type")
  await ok(db.createStringAttribute(DB_ID, "links", "origin_id", 64, false), "origin_id")
  await waitForAttributes("links")
  // One slug per host. Lookups resolve by host + slug.
  await ok(
    db.createIndex(DB_ID, "links", "uniq_host_slug", IndexType.Unique, ["host", "slug"]),
    "index uniq_host_slug",
  )
  await ok(db.createIndex(DB_ID, "links", "idx_owner", IndexType.Key, ["owner_id"]), "index idx_owner")
  await ok(db.createIndex(DB_ID, "links", "idx_slug", IndexType.Key, ["slug"]), "index idx_slug")

  // ---------------- clicks ----------------
  console.log("Collection: clicks")
  await ensureCollection("clicks", "Clicks")
  await ok(db.createStringAttribute(DB_ID, "clicks", "link_id", 64, true), "link_id")
  await ok(db.createStringAttribute(DB_ID, "clicks", "owner_id", 64, false), "owner_id")
  await ok(db.createDatetimeAttribute(DB_ID, "clicks", "clicked_at", false), "clicked_at")
  await ok(db.createStringAttribute(DB_ID, "clicks", "device_type", 16, false), "device_type")
  await ok(db.createStringAttribute(DB_ID, "clicks", "country", 8, false), "country")
  await ok(db.createStringAttribute(DB_ID, "clicks", "referrer", 500, false), "referrer")
  await ok(db.createStringAttribute(DB_ID, "clicks", "user_agent", 500, false), "user_agent")
  await ok(db.createStringAttribute(DB_ID, "clicks", "ip_hash", 128, false), "ip_hash")
  await waitForAttributes("clicks")
  await ok(db.createIndex(DB_ID, "clicks", "idx_link", IndexType.Key, ["link_id"]), "index idx_link")
  await ok(db.createIndex(DB_ID, "clicks", "idx_owner", IndexType.Key, ["owner_id"]), "index idx_owner")

  // ---------------- accounts ----------------
  console.log("Collection: accounts")
  await ensureCollection("accounts", "Accounts")
  await ok(db.createStringAttribute(DB_ID, "accounts", "clerk_user_id", 64, true), "clerk_user_id")
  await ok(db.createStringAttribute(DB_ID, "accounts", "email", 320, false), "email")
  await ok(db.createStringAttribute(DB_ID, "accounts", "plan", 32, false, "free"), "plan")
  await ok(db.createStringAttribute(DB_ID, "accounts", "billing_status", 32, false, "active"), "billing_status")
  await ok(db.createStringAttribute(DB_ID, "accounts", "stripe_customer_id", 64, false), "stripe_customer_id")
  await ok(db.createStringAttribute(DB_ID, "accounts", "stripe_subscription_id", 64, false), "stripe_subscription_id")
  await ok(db.createDatetimeAttribute(DB_ID, "accounts", "created_at", false), "created_at")
  await waitForAttributes("accounts")
  await ok(
    db.createIndex(DB_ID, "accounts", "uniq_clerk", IndexType.Unique, ["clerk_user_id"]),
    "index uniq_clerk",
  )

  // ---------------- domains ----------------
  console.log("Collection: domains")
  await ensureCollection("domains", "Domains")
  await ok(db.createStringAttribute(DB_ID, "domains", "domain", 255, true), "domain")
  await ok(db.createStringAttribute(DB_ID, "domains", "owner_id", 64, true), "owner_id")
  await ok(db.createStringAttribute(DB_ID, "domains", "status", 16, false, "unverified"), "status")
  await ok(db.createStringAttribute(DB_ID, "domains", "verification_token", 128, false), "verification_token")
  await ok(db.createStringAttribute(DB_ID, "domains", "ssl_status", 16, false, "pending"), "ssl_status")
  await ok(db.createDatetimeAttribute(DB_ID, "domains", "created_at", false), "created_at")
  await waitForAttributes("domains")
  await ok(db.createIndex(DB_ID, "domains", "uniq_domain", IndexType.Unique, ["domain"]), "index uniq_domain")
  await ok(db.createIndex(DB_ID, "domains", "idx_owner", IndexType.Key, ["owner_id"]), "index idx_owner")

  // ---------------- subscriptions ----------------
  console.log("Collection: subscriptions")
  await ensureCollection("subscriptions", "Subscriptions")
  await ok(db.createStringAttribute(DB_ID, "subscriptions", "owner_id", 64, true), "owner_id")
  await ok(db.createStringAttribute(DB_ID, "subscriptions", "stripe_subscription_id", 64, true), "stripe_subscription_id")
  await ok(db.createStringAttribute(DB_ID, "subscriptions", "plan", 32, true), "plan")
  await ok(db.createStringAttribute(DB_ID, "subscriptions", "interval", 16, false), "interval")
  await ok(db.createStringAttribute(DB_ID, "subscriptions", "status", 24, false), "status")
  await ok(db.createDatetimeAttribute(DB_ID, "subscriptions", "current_period_end", false), "current_period_end")
  await waitForAttributes("subscriptions")
  await ok(
    db.createIndex(DB_ID, "subscriptions", "uniq_sub", IndexType.Unique, ["stripe_subscription_id"]),
    "index uniq_sub",
  )
  await ok(db.createIndex(DB_ID, "subscriptions", "idx_owner", IndexType.Key, ["owner_id"]), "index idx_owner")

  // ---------------- split_sessions ----------------
  console.log("Collection: split_sessions")
  await ensureCollection("split_sessions", "Split Sessions")
  await ok(db.createStringAttribute(DB_ID, "split_sessions", "slug", 64, true), "slug")
  await ok(db.createStringAttribute(DB_ID, "split_sessions", "title", 200, true), "title")
  // members, expenses, settlements stored as JSON strings (Appwrite has no native JSON type).
  await ok(db.createStringAttribute(DB_ID, "split_sessions", "members_json", 50000, true), "members_json")
  await ok(db.createStringAttribute(DB_ID, "split_sessions", "expenses_json", 100000, true), "expenses_json")
  await ok(db.createStringAttribute(DB_ID, "split_sessions", "settlements_json", 50000, false), "settlements_json")
  await ok(db.createFloatAttribute(DB_ID, "split_sessions", "total_amount", false, 0), "total_amount")
  await ok(db.createDatetimeAttribute(DB_ID, "split_sessions", "expires_at", false), "expires_at")
  await ok(db.createDatetimeAttribute(DB_ID, "split_sessions", "created_at", false), "created_at")
  await waitForAttributes("split_sessions")
  await ok(db.createIndex(DB_ID, "split_sessions", "uniq_slug", IndexType.Unique, ["slug"]), "index uniq_slug")

  console.log("\n✅ Appwrite setup complete.")
}

setup().catch((err) => {
  console.error("\n❌ Setup failed:", err?.message || err)
  process.exit(1)
})
