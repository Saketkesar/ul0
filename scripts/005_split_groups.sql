-- Migration 005: Split Groups (trips, flats, events, offices)

CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  share_slug TEXT UNIQUE NOT NULL,
  allow_member_entries BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  upi_id TEXT,
  claimed_by_user_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.group_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  paid_by_member_id UUID NOT NULL REFERENCES public.group_members(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  note TEXT NOT NULL,
  split_among JSONB NOT NULL DEFAULT '[]', -- [{ member_id, amount }]
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_via TEXT NOT NULL DEFAULT 'owner' -- 'owner' | 'member'
);

CREATE INDEX IF NOT EXISTS idx_groups_owner ON public.groups(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_groups_slug ON public.groups(share_slug);
CREATE INDEX IF NOT EXISTS idx_group_members_group ON public.group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_expenses_group ON public.group_expenses(group_id);
