#!/usr/bin/env node
/**
 * Setup the `backlinks` collection in Appwrite for the Free Backlink Exchange feature.
 * Run: node scripts/setup-backlinks-collection.mjs
 */
import { Client, Databases, ID } from "node-appwrite"
import { readFileSync } from "fs"

// Load .env manually
try {
  const envContent = readFileSync(new URL("../.env", import.meta.url), "utf-8")
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eqIdx = trimmed.indexOf("=")
    if (eqIdx === -1) continue
    const key = trimmed.slice(0, eqIdx).trim()
    let val = trimmed.slice(eqIdx + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = val
  }
} catch {}

const ENDPOINT = process.env.APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1"
const PROJECT  = process.env.APPWRITE_PROJECT_ID
const API_KEY  = process.env.APPWRITE_API_KEY
const DB_ID    = process.env.APPWRITE_DATABASE_ID || "ul0"
const COLL_ID  = "backlinks"

if (!PROJECT || !API_KEY) {
  console.error("❌ Set APPWRITE_PROJECT_ID and APPWRITE_API_KEY in .env")
  process.exit(1)
}

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT).setKey(API_KEY)
const db = new Databases(client)

async function main() {
  // 1. Create collection
  console.log("Creating collection:", COLL_ID)
  try {
    await db.createCollection(DB_ID, COLL_ID, COLL_ID, undefined, false, true)
    console.log("✅ Collection created")
  } catch (e) {
    if (e.code === 409) console.log("⚠️  Collection already exists, continuing…")
    else throw e
  }

  // 2. Create string attributes
  const strings = [
    { key: "website_url",          size: 512,  required: true  },
    { key: "website_name",         size: 256,  required: true  },
    { key: "website_description",  size: 1024, required: true  },
    { key: "logo_url",             size: 512,  required: false },
    { key: "owner_email",          size: 256,  required: false },
    { key: "badge_code",           size: 2048, required: true  },
    { key: "verification_token",   size: 64,   required: true  },
    { key: "verified_at",          size: 64,   required: false },
    { key: "created_at",           size: 64,   required: true  },
  ]

  for (const attr of strings) {
    try {
      await db.createStringAttribute(DB_ID, COLL_ID, attr.key, attr.size, attr.required)
      console.log(`  ✅ string  ${attr.key}`)
    } catch (e) {
      if (e.code === 409) console.log(`  ⚠️  ${attr.key} already exists`)
      else console.error(`  ❌ ${attr.key}:`, e.message)
    }
  }

  // 3. Create boolean attribute
  try {
    await db.createBooleanAttribute(DB_ID, COLL_ID, "verified", true, false)
    console.log("  ✅ boolean verified")
  } catch (e) {
    if (e.code === 409) console.log("  ⚠️  verified already exists")
    else console.error("  ❌ verified:", e.message)
  }

  // Wait for attributes to be available before creating indexes
  console.log("\n⏳ Waiting 5s for attributes to be provisioned…")
  await new Promise(r => setTimeout(r, 5000))

  // 4. Create indexes
  const indexes = [
    {
      key: "idx_verification_token",
      type: "unique",
      attributes: ["verification_token"],
      orders: ["ASC"],
    },
    {
      key: "idx_verified_created",
      type: "key",
      attributes: ["verified", "created_at"],
      orders: ["ASC", "DESC"],
    },
    {
      key: "idx_website_url",
      type: "key",
      attributes: ["website_url"],
      orders: ["ASC"],
    },
  ]

  for (const idx of indexes) {
    try {
      await db.createIndex(DB_ID, COLL_ID, idx.key, idx.type, idx.attributes, idx.orders)
      console.log(`  ✅ index ${idx.key}`)
    } catch (e) {
      if (e.code === 409) console.log(`  ⚠️  ${idx.key} already exists`)
      else console.error(`  ❌ ${idx.key}:`, e.message)
    }
  }

  console.log("\n🎉 Backlinks collection setup complete!")
}

main().catch((e) => {
  console.error("Fatal:", e)
  process.exit(1)
})
