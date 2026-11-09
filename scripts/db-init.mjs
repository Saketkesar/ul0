import { readFileSync } from "node:fs"
import pg from "pg"
const { Pool } = pg

function loadEnv() {
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
}
loadEnv()

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  "postgresql://neondb_owner:npg_nc85rtNeFCTp@ep-frosty-violet-beqq5h9u-pooler.c-9.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
})

const schemaSql = `
-- Links
CREATE TABLE IF NOT EXISTS links (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(64) NOT NULL,
  long_url TEXT NOT NULL,
  host VARCHAR(255) NOT NULL DEFAULT 'ul0.site',
  owner_id VARCHAR(64),
  clicks_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expire_at TIMESTAMPTZ,
  meta_title VARCHAR(512),
  meta_domain VARCHAR(255),
  meta_favicon_url VARCHAR(1000),
  link_type VARCHAR(32) NOT NULL DEFAULT 'normal',
  origin_id VARCHAR(64),
  targeting_json TEXT,
  CONSTRAINT uniq_host_slug UNIQUE (host, slug)
);

CREATE INDEX IF NOT EXISTS idx_links_owner ON links (owner_id);
CREATE INDEX IF NOT EXISTS idx_links_slug ON links (slug);
CREATE INDEX IF NOT EXISTS idx_links_created ON links (created_at DESC);

-- Clicks
CREATE TABLE IF NOT EXISTS clicks (
  id VARCHAR(64) PRIMARY KEY,
  link_id VARCHAR(64) NOT NULL,
  owner_id VARCHAR(64),
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  device_type VARCHAR(32),
  country VARCHAR(8),
  referrer TEXT,
  user_agent TEXT,
  ip_hash VARCHAR(128),
  region VARCHAR(255),
  city VARCHAR(255),
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  browser VARCHAR(64),
  os VARCHAR(64),
  device VARCHAR(64),
  utm_source VARCHAR(255),
  utm_medium VARCHAR(255),
  utm_campaign VARCHAR(255),
  language VARCHAR(64),
  timezone VARCHAR(64),
  bot BOOLEAN NOT NULL DEFAULT FALSE,
  unique_visitor BOOLEAN NOT NULL DEFAULT FALSE,
  qr_scan BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_clicks_link ON clicks (link_id, clicked_at DESC);
CREATE INDEX IF NOT EXISTS idx_clicks_owner ON clicks (owner_id, clicked_at DESC);

-- Accounts
CREATE TABLE IF NOT EXISTS accounts (
  id VARCHAR(64) PRIMARY KEY,
  clerk_user_id VARCHAR(64) NOT NULL UNIQUE,
  email VARCHAR(320),
  plan VARCHAR(32) NOT NULL DEFAULT 'free',
  billing_status VARCHAR(32) NOT NULL DEFAULT 'active',
  stripe_customer_id VARCHAR(64),
  stripe_subscription_id VARCHAR(64),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  api_key VARCHAR(128)
);

CREATE INDEX IF NOT EXISTS idx_accounts_api_key ON accounts (api_key);

-- Domains
CREATE TABLE IF NOT EXISTS domains (
  id VARCHAR(64) PRIMARY KEY,
  domain VARCHAR(255) NOT NULL UNIQUE,
  owner_id VARCHAR(64) NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'unverified',
  verification_token VARCHAR(128),
  ssl_status VARCHAR(32) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  brand_logo_url TEXT
);

CREATE INDEX IF NOT EXISTS idx_domains_owner ON domains (owner_id);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id VARCHAR(64) PRIMARY KEY,
  owner_id VARCHAR(64) NOT NULL,
  stripe_subscription_id VARCHAR(64) NOT NULL UNIQUE,
  plan VARCHAR(32) NOT NULL,
  interval VARCHAR(16),
  status VARCHAR(32),
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_owner ON subscriptions (owner_id);

-- Split Sessions
CREATE TABLE IF NOT EXISTS split_sessions (
  id VARCHAR(64) PRIMARY KEY,
  slug VARCHAR(64) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  members_json TEXT NOT NULL DEFAULT '[]',
  expenses_json TEXT NOT NULL DEFAULT '[]',
  settlements_json TEXT DEFAULT '[]',
  total_amount DOUBLE PRECISION NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_split_slug ON split_sessions (slug);

-- Backlinks
CREATE TABLE IF NOT EXISTS backlinks (
  id VARCHAR(64) PRIMARY KEY,
  website_url VARCHAR(512) NOT NULL,
  website_name VARCHAR(256) NOT NULL,
  website_description TEXT NOT NULL,
  logo_url VARCHAR(512),
  owner_email VARCHAR(256),
  badge_code TEXT NOT NULL,
  verification_token VARCHAR(64) NOT NULL UNIQUE,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_backlinks_verified_created ON backlinks (verified, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_backlinks_url ON backlinks (website_url);

-- Marketing Links
CREATE TABLE IF NOT EXISTS marketing_links (
  id VARCHAR(64) PRIMARY KEY,
  alias VARCHAR(64) NOT NULL UNIQUE,
  destination_url TEXT NOT NULL,
  owner_clerk_user_id VARCHAR(255) NOT NULL,
  blog_count INT NOT NULL DEFAULT 3,
  link_type VARCHAR(32) NOT NULL DEFAULT 'button',
  timer_seconds INT NOT NULL DEFAULT 5,
  target_slug VARCHAR(255) DEFAULT '',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  total_gate_opens INT NOT NULL DEFAULT 0,
  total_completions INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_marketing_owner ON marketing_links (owner_clerk_user_id);

-- Forms
CREATE TABLE IF NOT EXISTS forms (
  id VARCHAR(64) PRIMARY KEY,
  owner_id VARCHAR(64) NOT NULL,
  slug VARCHAR(64) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  status VARCHAR(32) NOT NULL DEFAULT 'draft',
  step INT NOT NULL DEFAULT 1,
  schema TEXT NOT NULL DEFAULT '[]',
  theme TEXT NOT NULL DEFAULT '{}',
  permissions TEXT NOT NULL DEFAULT '{"read":true,"edit":false,"delete":false}',
  script_url TEXT DEFAULT '',
  script_secret_enc TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_forms_owner ON forms (owner_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_forms_slug ON forms (slug);
`

async function main() {
  console.log("Connecting to PostgreSQL at:", connectionString.replace(/:[^:@]+@/, ":***@"))
  const client = await pool.connect()
  try {
    console.log("Creating tables and indexes...")
    await client.query(schemaSql)
    console.log("✅ Schema initialized successfully!")
    const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `)
    console.log("Created tables:", res.rows.map(r => r.table_name).join(", "))
  } finally {
    client.release()
    await pool.end()
  }
}

main().catch(err => {
  console.error("Init failed:", err)
  process.exit(1)
})

