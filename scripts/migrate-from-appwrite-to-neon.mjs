import { readFileSync } from "node:fs"
import pg from "pg"
const { Pool } = pg

// Load environment variables
for (const file of [".env.local", ".env"]) {
  try {
    const raw = readFileSync(new URL(`../${file}`, import.meta.url), "utf8")
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/)
      if (!m) continue
      let [, k, v] = m
      v = v.replace(/^["']|["']$/g, "")
      if (!(k in process.env)) process.env[k] = v
    }
  } catch {}
}

const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT || "https://fra.cloud.appwrite.io/v1"
const APPWRITE_PROJECT_ID = process.env.APPWRITE_PROJECT_ID || "68833c43001b6aa15f16"
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY || "standard_f4d1497db9f558defa96d80c32e30d7246a6c3be5ccee399134aa5657a8d04d031ef0f1d1ddbd851534dfe3d415a70dae95de2ccf812bbffd4c75c71e854caec0462351579127ce5d3021b42a0462bd2419a4dd13493664f9114def29bdea84ff8e000449330f0a4da65a42412ba5e7cad2192b3a758007dda04ff520ddfbd8a"
const APPWRITE_DATABASE_ID = process.env.APPWRITE_DATABASE_ID || "ul0"

const NEON_CONNECTION_STRING =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  "postgresql://neondb_owner:npg_nc85rtNeFCTp@ep-frosty-violet-beqq5h9u-pooler.c-9.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

const pool = new Pool({
  connectionString: NEON_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
})

async function fetchAppwriteCollection(collectionId) {
  const docs = []
  let lastId = null
  const qLimit = JSON.stringify({ method: "limit", values: [100] })

  while (true) {
    const queries = [qLimit]
    if (lastId) {
      queries.push(JSON.stringify({ method: "cursorAfter", values: [lastId] }))
    }
    const qs = queries.map((q, idx) => `queries[${idx}]=${encodeURIComponent(q)}`).join("&")
    const url = `${APPWRITE_ENDPOINT}/databases/${APPWRITE_DATABASE_ID}/collections/${collectionId}/documents?${qs}`

    const res = await fetch(url, {
      headers: {
        "X-Appwrite-Project": APPWRITE_PROJECT_ID,
        "X-Appwrite-Key": APPWRITE_API_KEY,
      },
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Failed to fetch ${collectionId}: ${res.status} ${errText}`)
    }

    const data = await res.json()
    if (!data.documents || data.documents.length === 0) break

    docs.push(...data.documents)
    lastId = data.documents[data.documents.length - 1].$id
    process.stdout.write(`\r  Fetched ${docs.length}/${data.total} from ${collectionId}...`)

    if (docs.length >= data.total) break
  }
  console.log(`\n  Done fetching ${docs.length} documents from ${collectionId}.`)
  return docs
}

async function migrateLinks(client) {
  console.log("\n--- Migrating links ---")
  const docs = await fetchAppwriteCollection("links")
  let inserted = 0
  const BATCH_SIZE = 50

  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const chunk = docs.slice(i, i + BATCH_SIZE)
    const values = []
    const rowPlaceholders = []

    for (let r = 0; r < chunk.length; r++) {
      const doc = chunk[r]
      const offset = r * 14
      const p = Array.from({ length: 14 }, (_, idx) => `$${offset + idx + 1}`).join(", ")
      rowPlaceholders.push(`(${p})`)

      values.push(
        doc.$id,
        doc.slug,
        doc.long_url,
        doc.host || "ul0.site",
        doc.owner_id || null,
        doc.clicks_count || 0,
        doc.created_at ? new Date(doc.created_at) : new Date(doc.$createdAt),
        doc.expire_at ? new Date(doc.expire_at) : null,
        doc.meta_title || null,
        doc.meta_domain || null,
        doc.meta_favicon_url || null,
        doc.link_type || "normal",
        doc.origin_id || null,
        doc.targeting_json || null
      )
    }

    const sql = `INSERT INTO links (
      id, slug, long_url, host, owner_id, clicks_count, created_at, expire_at,
      meta_title, meta_domain, meta_favicon_url, link_type, origin_id, targeting_json
    ) VALUES ${rowPlaceholders.join(", ")}
    ON CONFLICT (id) DO UPDATE SET
      slug = EXCLUDED.slug,
      long_url = EXCLUDED.long_url,
      host = EXCLUDED.host,
      owner_id = EXCLUDED.owner_id,
      clicks_count = EXCLUDED.clicks_count,
      expire_at = EXCLUDED.expire_at,
      meta_title = EXCLUDED.meta_title,
      meta_domain = EXCLUDED.meta_domain,
      meta_favicon_url = EXCLUDED.meta_favicon_url,
      link_type = EXCLUDED.link_type,
      targeting_json = EXCLUDED.targeting_json`

    await client.query(sql, values)
    inserted += chunk.length
    process.stdout.write(`\r  Inserted ${inserted}/${docs.length} links...`)
  }
  console.log(`\n✅ Successfully migrated ${inserted} links into Neon PostgreSQL!`)
}

async function migrateClicks(client) {
  console.log("\n--- Migrating clicks ---")
  const docs = await fetchAppwriteCollection("clicks")
  let inserted = 0
  const BATCH_SIZE = 50

  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const chunk = docs.slice(i, i + BATCH_SIZE)
    const values = []
    const rowPlaceholders = []

    for (let r = 0; r < chunk.length; r++) {
      const doc = chunk[r]
      const offset = r * 24
      const p = Array.from({ length: 24 }, (_, idx) => `$${offset + idx + 1}`).join(", ")
      rowPlaceholders.push(`(${p})`)

      values.push(
        doc.$id,
        doc.link_id,
        doc.owner_id || null,
        doc.clicked_at ? new Date(doc.clicked_at) : new Date(doc.$createdAt),
        doc.device_type || null,
        doc.country || null,
        doc.referrer || null,
        doc.user_agent || null,
        doc.ip_hash || null,
        doc.region || null,
        doc.city || null,
        doc.latitude !== undefined && doc.latitude !== null ? Number(doc.latitude) : null,
        doc.longitude !== undefined && doc.longitude !== null ? Number(doc.longitude) : null,
        doc.browser || null,
        doc.os || null,
        doc.device || null,
        doc.utm_source || null,
        doc.utm_medium || null,
        doc.utm_campaign || null,
        doc.language || null,
        doc.timezone || null,
        Boolean(doc.bot),
        Boolean(doc.unique_visitor),
        Boolean(doc.qr_scan)
      )
    }

    const sql = `INSERT INTO clicks (
      id, link_id, owner_id, clicked_at, device_type, country, referrer,
      user_agent, ip_hash, region, city, latitude, longitude, browser, os,
      device, utm_source, utm_medium, utm_campaign, language, timezone, bot,
      unique_visitor, qr_scan
    ) VALUES ${rowPlaceholders.join(", ")}
    ON CONFLICT (id) DO NOTHING`

    await client.query(sql, values)
    inserted += chunk.length
    process.stdout.write(`\r  Inserted ${inserted}/${docs.length} clicks...`)
  }
  console.log(`\n✅ Successfully migrated ${inserted} clicks into Neon PostgreSQL!`)
}

async function migrateAccounts(client) {
  console.log("\n--- Migrating accounts ---")
  const docs = await fetchAppwriteCollection("accounts")
  let inserted = 0

  for (const doc of docs) {
    const id = doc.$id
    const clerkUserId = doc.clerk_user_id
    const email = doc.email || null
    const plan = doc.plan || "free"
    const billingStatus = doc.billing_status || "active"
    const stripeCustomerId = doc.stripe_customer_id || null
    const stripeSubscriptionId = doc.stripe_subscription_id || null
    const createdAt = doc.created_at ? new Date(doc.created_at) : new Date(doc.$createdAt)
    const apiKey = doc.api_key || null

    await client.query(
      `INSERT INTO accounts (
        id, clerk_user_id, email, plan, billing_status, stripe_customer_id,
        stripe_subscription_id, created_at, api_key
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (clerk_user_id) DO UPDATE SET
        email = EXCLUDED.email,
        plan = EXCLUDED.plan,
        billing_status = EXCLUDED.billing_status,
        api_key = EXCLUDED.api_key`,
      [
        id,
        clerkUserId,
        email,
        plan,
        billingStatus,
        stripeCustomerId,
        stripeSubscriptionId,
        createdAt,
        apiKey,
      ]
    )
    inserted++
  }
  console.log(`✅ Successfully migrated ${inserted} accounts into Neon PostgreSQL!`)
}

async function migrateDomains(client) {
  console.log("\n--- Migrating domains ---")
  const docs = await fetchAppwriteCollection("domains")
  let inserted = 0

  for (const doc of docs) {
    const id = doc.$id
    const domain = doc.domain
    const ownerId = doc.owner_id
    const status = doc.status || "unverified"
    const verificationToken = doc.verification_token || null
    const sslStatus = doc.ssl_status || "pending"
    const createdAt = doc.created_at ? new Date(doc.created_at) : new Date(doc.$createdAt)
    const brandLogoUrl = doc.brand_logo_url || null

    await client.query(
      `INSERT INTO domains (
        id, domain, owner_id, status, verification_token, ssl_status, created_at, brand_logo_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (domain) DO UPDATE SET
        owner_id = EXCLUDED.owner_id,
        status = EXCLUDED.status,
        ssl_status = EXCLUDED.ssl_status,
        brand_logo_url = EXCLUDED.brand_logo_url`,
      [
        id,
        domain,
        ownerId,
        status,
        verificationToken,
        sslStatus,
        createdAt,
        brandLogoUrl,
      ]
    )
    inserted++
  }
  console.log(`✅ Successfully migrated ${inserted} domains into Neon PostgreSQL!`)
}

async function migrateSplitSessions(client) {
  console.log("\n--- Migrating split_sessions ---")
  const docs = await fetchAppwriteCollection("split_sessions")
  let inserted = 0

  for (const doc of docs) {
    const id = doc.$id
    const slug = doc.slug
    const title = doc.title
    const membersJson = typeof doc.members_json === "string" ? doc.members_json : JSON.stringify(doc.members_json || [])
    const expensesJson = typeof doc.expenses_json === "string" ? doc.expenses_json : JSON.stringify(doc.expenses_json || [])
    const settlementsJson = typeof doc.settlements_json === "string" ? doc.settlements_json : JSON.stringify(doc.settlements_json || [])
    const totalAmount = doc.total_amount ? Number(doc.total_amount) : 0
    const expiresAt = doc.expires_at ? new Date(doc.expires_at) : null
    const createdAt = doc.created_at ? new Date(doc.created_at) : new Date(doc.$createdAt)

    await client.query(
      `INSERT INTO split_sessions (
        id, slug, title, members_json, expenses_json, settlements_json, total_amount, expires_at, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        members_json = EXCLUDED.members_json,
        expenses_json = EXCLUDED.expenses_json,
        settlements_json = EXCLUDED.settlements_json,
        total_amount = EXCLUDED.total_amount`,
      [
        id,
        slug,
        title,
        membersJson,
        expensesJson,
        settlementsJson,
        totalAmount,
        expiresAt,
        createdAt,
      ]
    )
    inserted++
  }
  console.log(`✅ Successfully migrated ${inserted} split sessions into Neon PostgreSQL!`)
}

async function migrateBacklinks(client) {
  console.log("\n--- Migrating backlinks ---")
  const docs = await fetchAppwriteCollection("backlinks")
  let inserted = 0

  for (const doc of docs) {
    const id = doc.$id
    const websiteUrl = doc.website_url
    const websiteName = doc.website_name
    const websiteDescription = doc.website_description
    const logoUrl = doc.logo_url || null
    const ownerEmail = doc.owner_email || null
    const badgeCode = doc.badge_code
    const verificationToken = doc.verification_token
    const verified = Boolean(doc.verified)
    const verifiedAt = doc.verified_at ? new Date(doc.verified_at) : null
    const createdAt = doc.created_at ? new Date(doc.created_at) : new Date(doc.$createdAt)

    await client.query(
      `INSERT INTO backlinks (
        id, website_url, website_name, website_description, logo_url, owner_email,
        badge_code, verification_token, verified, verified_at, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (verification_token) DO UPDATE SET
        website_url = EXCLUDED.website_url,
        website_name = EXCLUDED.website_name,
        website_description = EXCLUDED.website_description,
        verified = EXCLUDED.verified,
        verified_at = EXCLUDED.verified_at`,
      [
        id,
        websiteUrl,
        websiteName,
        websiteDescription,
        logoUrl,
        ownerEmail,
        badgeCode,
        verificationToken,
        verified,
        verifiedAt,
        createdAt,
      ]
    )
    inserted++
  }
  console.log(`✅ Successfully migrated ${inserted} backlinks into Neon PostgreSQL!`)
}

async function migrateMarketingLinks(client) {
  console.log("\n--- Migrating marketing_links ---")
  const docs = await fetchAppwriteCollection("marketing_links")
  let inserted = 0

  for (const doc of docs) {
    const id = doc.$id
    const alias = doc.alias
    const destinationUrl = doc.destination_url
    const ownerClerkUserId = doc.owner_clerk_user_id
    const blogCount = doc.blog_count || 3
    const linkType = doc.link_type || "button"
    const timerSeconds = doc.timer_seconds || 5
    const targetSlug = doc.target_slug || ""
    const isActive = doc.is_active !== undefined ? Boolean(doc.is_active) : true
    const totalGateOpens = doc.total_gate_opens || 0
    const totalCompletions = doc.total_completions || 0
    const createdAt = doc.created_at ? new Date(doc.created_at) : new Date(doc.$createdAt)
    const updatedAt = doc.updated_at ? new Date(doc.updated_at) : new Date(doc.$updatedAt || doc.$createdAt)

    await client.query(
      `INSERT INTO marketing_links (
        id, alias, destination_url, owner_clerk_user_id, blog_count,
        link_type, timer_seconds, target_slug, is_active, total_gate_opens,
        total_completions, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (alias) DO UPDATE SET
        destination_url = EXCLUDED.destination_url,
        total_gate_opens = EXCLUDED.total_gate_opens,
        total_completions = EXCLUDED.total_completions,
        is_active = EXCLUDED.is_active`,
      [
        id,
        alias,
        destinationUrl,
        ownerClerkUserId,
        blogCount,
        linkType,
        timerSeconds,
        targetSlug,
        isActive,
        totalGateOpens,
        totalCompletions,
        createdAt,
        updatedAt,
      ]
    )
    inserted++
  }
  console.log(`✅ Successfully migrated ${inserted} marketing links into Neon PostgreSQL!`)
}

async function migrateForms(client) {
  console.log("\n--- Migrating forms ---")
  const docs = await fetchAppwriteCollection("forms")
  let inserted = 0

  for (const doc of docs) {
    const id = doc.$id
    const ownerId = doc.owner_id
    const slug = doc.slug
    const title = doc.title
    const description = doc.description || ""
    const status = doc.status || "draft"
    const step = doc.step || 1
    const schema = typeof doc.schema === "string" ? doc.schema : JSON.stringify(doc.schema || [])
    const theme = typeof doc.theme === "string" ? doc.theme : JSON.stringify(doc.theme || {})
    const permissions = typeof doc.permissions === "string" ? doc.permissions : JSON.stringify(doc.permissions || {})
    const scriptUrl = doc.script_url || ""
    const scriptSecretEnc = doc.script_secret_enc || ""
    const createdAt = doc.created_at ? new Date(doc.created_at) : new Date(doc.$createdAt)
    const updatedAt = doc.updated_at ? new Date(doc.updated_at) : new Date(doc.$updatedAt || doc.$createdAt)
    const publishedAt = doc.published_at ? new Date(doc.published_at) : null

    await client.query(
      `INSERT INTO forms (
        id, owner_id, slug, title, description, status, step, schema,
        theme, permissions, script_url, script_secret_enc, created_at, updated_at, published_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      ON CONFLICT (slug) DO UPDATE SET
        owner_id = EXCLUDED.owner_id,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        status = EXCLUDED.status,
        step = EXCLUDED.step,
        schema = EXCLUDED.schema,
        theme = EXCLUDED.theme,
        permissions = EXCLUDED.permissions,
        script_url = EXCLUDED.script_url,
        script_secret_enc = EXCLUDED.script_secret_enc,
        published_at = EXCLUDED.published_at`,
      [
        id,
        ownerId,
        slug,
        title,
        description,
        status,
        step,
        schema,
        theme,
        permissions,
        scriptUrl,
        scriptSecretEnc,
        createdAt,
        updatedAt,
        publishedAt,
      ]
    )
    inserted++
  }
  console.log(`✅ Successfully migrated ${inserted} forms into Neon PostgreSQL!`)
}

async function verifyNeonCounts(client) {
  console.log("\n==========================================")
  console.log("  NEON POSTGRESQL FINAL RECORD COUNTS")
  console.log("==========================================")
  const tables = [
    "links",
    "clicks",
    "accounts",
    "domains",
    "split_sessions",
    "backlinks",
    "marketing_links",
    "forms",
  ]
  for (const t of tables) {
    const res = await client.query(`SELECT count(*)::int as count FROM ${t}`)
    console.log(`  • ${t.padEnd(16)}: ${res.rows[0].count} records`)
  }
  console.log("==========================================\n")
}

async function main() {
  console.log("Starting full data migration from Appwrite to Neon PostgreSQL...")
  const client = await pool.connect()
  try {
    await migrateLinks(client)
    await migrateClicks(client)
    await migrateAccounts(client)
    await migrateDomains(client)
    await migrateSplitSessions(client)
    await migrateBacklinks(client)
    await migrateMarketingLinks(client)
    await migrateForms(client)
    await verifyNeonCounts(client)
    console.log("🎉 ALL DATA MIGRATED SUCCESSFULLY TO NEON POSTGRESQL!")
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch((err) => {
  console.error("Migration fatal error:", err)
  process.exit(1)
})

