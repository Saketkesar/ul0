-- Migration 004: Split v2 — security, owner auth, claim/confirm flow
-- Backward compatible: all new columns are nullable/defaulted so old rows keep working.

-- Add owner identity, collector token, and richer metadata
ALTER TABLE public.split_sessions
  ADD COLUMN IF NOT EXISTS owner_user_id TEXT,
  ADD COLUMN IF NOT EXISTS kind TEXT NOT NULL DEFAULT 'bill',
  ADD COLUMN IF NOT EXISTS locale TEXT NOT NULL DEFAULT 'en',
  ADD COLUMN IF NOT EXISTS currency TEXT NOT NULL DEFAULT 'INR',
  ADD COLUMN IF NOT EXISTS pay_by TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS collector_token_hash TEXT,
  ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS charges JSONB NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS items JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS group_id UUID;

-- Indexes for owner and group lookups
CREATE INDEX IF NOT EXISTS idx_split_owner ON public.split_sessions(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_split_group ON public.split_sessions(group_id);
CREATE INDEX IF NOT EXISTS idx_split_status ON public.split_sessions(status);

-- Update the expiry cleanup to also respect 'deleted' status
CREATE OR REPLACE FUNCTION delete_expired_split_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM public.split_sessions
  WHERE (expires_at < NOW() AND expires_at IS NOT NULL)
     OR status = 'deleted';
END;
$$ LANGUAGE plpgsql;
