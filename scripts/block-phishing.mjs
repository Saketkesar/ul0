import { Client, Databases, Query } from "node-appwrite"
import { readFileSync } from "node:fs"

function loadEnv() {
  try {
    const raw = readFileSync(".env", "utf8")
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/)
      if (!m) continue
      let [, k, v] = m
      v = v.replace(/^["']|["']$/g, "")
      if (!(k in process.env)) process.env[k] = v
    }
  } catch (e) {
    console.error("Could not load env:", e.message)
  }
}
loadEnv()

const ENDPOINT = process.env.APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1"
const PROJECT = process.env.APPWRITE_PROJECT_ID
const API_KEY = process.env.APPWRITE_API_KEY
const DB_ID = process.env.APPWRITE_DATABASE_ID || "ul0"

if (!PROJECT || !API_KEY) {
  console.error("Missing Appwrite credentials in .env")
  process.exit(1)
}

const slug = process.argv[2] || "GhFL6s"
const genuineUrl = process.argv[3] || "https://telegram.org"
const targetName = process.argv[4] || "Telegram"

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT).setKey(API_KEY)
const db = new Databases(client)

async function blockLink() {
  console.log(`Searching for link with slug: "${slug}"...`)

  try {
    const { documents } = await db.listDocuments(DB_ID, "links", [
      Query.equal("slug", slug),
      Query.limit(5),
    ])

    if (documents.length === 0) {
      console.log(`No link found with slug "${slug}". Searching recent links...`)
      const all = await db.listDocuments(DB_ID, "links", [
        Query.orderDesc("$createdAt"),
        Query.limit(25),
      ])
      const match = all.documents.find(d => d.slug.toLowerCase() === slug.toLowerCase())
      if (match) {
        documents.push(match)
      } else {
        console.error("Link not found.")
        return
      }
    }

    for (const doc of documents) {
      console.log(`Found link ${doc.$id} -> ${doc.long_url}`)

      let currentTargeting = {}
      try {
        if (doc.targeting_json) {
          currentTargeting = JSON.parse(doc.targeting_json)
        }
      } catch (e) {}

      const updatedTargeting = {
        ...currentTargeting,
        is_suspicious: true,
        phishing_type: `${targetName.toLowerCase()}_phishing`,
        suspicious_original_url: genuineUrl,
        phishing_target: new URL(genuineUrl).hostname,
        blocked_at: new Date().toISOString(),
        block_reason: `Reported ${targetName} phishing page`,
      }

      await db.updateDocument(DB_ID, "links", doc.$id, {
        targeting_json: JSON.stringify(updatedTargeting),
      })

      // Also clear Redis cache if any
      try {
        const { Redis } = await import("@upstash/redis")
        if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
          const redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
          })
          await redis.del(`url:${doc.host || "ul0.site"}:${doc.slug}`)
          await redis.del(`url:${doc.slug}`)
        }
      } catch (e) {}

      console.log(`✅ Link ${doc.slug} is now blocked with a high-priority phishing security warning!`)
    }
  } catch (err) {
    console.error("Error:", err)
  }
}

blockLink()
