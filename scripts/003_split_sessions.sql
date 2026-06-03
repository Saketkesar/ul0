-- Split Sessions table for anonymous split expense sharing
-- These are temporary sessions that expire after 24 hours

CREATE TABLE IF NOT EXISTS public.split_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
  members JSONB NOT NULL DEFAULT '[]',
  expenses JSONB NOT NULL DEFAULT '[]',
  settlements JSONB NOT NULL DEFAULT '[]',
  total_amount NUMERIC DEFAULT 0
);

ALTER TABLE public.split_sessions ENABLE ROW LEVEL SECURITY;

-- Anyone can view split sessions (for shared links)
CREATE POLICY "Anyone can view split sessions" ON public.split_sessions FOR SELECT USING (true);
-- Anyone can create split sessions
CREATE POLICY "Anyone can create split sessions" ON public.split_sessions FOR INSERT WITH CHECK (true);
-- Anyone can update split sessions (for marking payments)
CREATE POLICY "Anyone can update split sessions" ON public.split_sessions FOR UPDATE USING (true);

-- Create index for slug lookup
CREATE INDEX IF NOT EXISTS idx_split_sessions_slug ON public.split_sessions(slug);
CREATE INDEX IF NOT EXISTS idx_split_sessions_expires ON public.split_sessions(expires_at);

-- Function to auto-delete expired sessions
CREATE OR REPLACE FUNCTION delete_expired_split_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM public.split_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
