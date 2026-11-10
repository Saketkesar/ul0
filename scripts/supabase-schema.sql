-- ========================================================
-- UL0 SUPABASE SCHEMA MIGRATION
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ========================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Links Table
CREATE TABLE IF NOT EXISTS public.links (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug TEXT NOT NULL,
  long_url TEXT NOT NULL,
  host TEXT DEFAULT 'ul0.site',
  owner_id TEXT,
  clicks_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expire_at TIMESTAMPTZ,
  meta_title TEXT,
  meta_domain TEXT,
  meta_favicon_url TEXT,
  link_type TEXT DEFAULT 'normal',
  origin_id TEXT,
  targeting_json TEXT,
  CONSTRAINT uniq_host_slug UNIQUE (host, slug)
);

CREATE INDEX IF NOT EXISTS idx_links_owner ON public.links(owner_id);
CREATE INDEX IF NOT EXISTS idx_links_slug ON public.links(slug);
CREATE INDEX IF NOT EXISTS idx_links_host_slug ON public.links(host, slug);

-- 2. Clicks Table (Detailed Geolocation & Analytics)
CREATE TABLE IF NOT EXISTS public.clicks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  link_id TEXT NOT NULL,
  owner_id TEXT,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  device_type TEXT,
  country TEXT,
  region TEXT,
  city TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  browser TEXT,
  os TEXT,
  device TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_hash TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  language TEXT,
  timezone TEXT,
  bot BOOLEAN DEFAULT FALSE,
  unique_visitor BOOLEAN DEFAULT FALSE,
  qr_scan BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_clicks_link ON public.clicks(link_id);
CREATE INDEX IF NOT EXISTS idx_clicks_owner ON public.clicks(owner_id);
CREATE INDEX IF NOT EXISTS idx_clicks_clicked_at ON public.clicks(clicked_at);

-- 3. Accounts Table (Clerk Auth & Subscriptions)
CREATE TABLE IF NOT EXISTS public.accounts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT,
  plan TEXT DEFAULT 'free',
  billing_status TEXT DEFAULT 'active',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_accounts_clerk ON public.accounts(clerk_user_id);

-- 4. Custom Domains Table
CREATE TABLE IF NOT EXISTS public.domains (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  domain TEXT UNIQUE NOT NULL,
  owner_id TEXT NOT NULL,
  status TEXT DEFAULT 'unverified',
  verification_token TEXT,
  ssl_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_domains_owner ON public.domains(owner_id);

-- 5. Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  owner_id TEXT NOT NULL,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  plan TEXT NOT NULL,
  interval TEXT,
  status TEXT,
  current_period_end TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_subs_owner ON public.subscriptions(owner_id);

-- 6. Split Sessions Table (Bill Splitting)
CREATE TABLE IF NOT EXISTS public.split_sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  members_json TEXT NOT NULL DEFAULT '[]',
  expenses_json TEXT NOT NULL DEFAULT '[]',
  settlements_json TEXT DEFAULT '[]',
  total_amount NUMERIC DEFAULT 0,
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_splits_slug ON public.split_sessions(slug);

-- 7. Backlinks Exchange Table
CREATE TABLE IF NOT EXISTS public.backlinks (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  url TEXT NOT NULL,
  title TEXT,
  owner_id TEXT,
  token TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_backlinks_owner ON public.backlinks(owner_id);

-- 8. Marketing Links Table
CREATE TABLE IF NOT EXISTS public.marketing_links (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug TEXT UNIQUE NOT NULL,
  title TEXT,
  destination_url TEXT NOT NULL,
  cta_label TEXT,
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_marketing_slug ON public.marketing_links(slug);

-- 9. Forms & Sheet Submissions Table
CREATE TABLE IF NOT EXISTS public.forms (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  owner_id TEXT,
  fields_json TEXT NOT NULL DEFAULT '[]',
  entries_json TEXT DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_forms_slug ON public.forms(slug);
CREATE INDEX IF NOT EXISTS idx_forms_owner ON public.forms(owner_id);

-- Disable Row Level Security (RLS) for server-side service role queries, or enable public read
ALTER TABLE public.links DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.clicks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.domains DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.split_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.backlinks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_links DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.forms DISABLE ROW LEVEL SECURITY;
