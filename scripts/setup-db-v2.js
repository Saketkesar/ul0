// Script to create split_sessions table using Supabase Management API
const https = require('https');

const projectRef = process.env.SUPABASE_PROJECT_REF || 'YOUR_PROJECT_REF';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SUPABASE_SERVICE_ROLE_KEY';

const sql = `
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

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view split sessions' AND tablename = 'split_sessions') THEN
    CREATE POLICY "Anyone can view split sessions" ON public.split_sessions FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can create split sessions' AND tablename = 'split_sessions') THEN
    CREATE POLICY "Anyone can create split sessions" ON public.split_sessions FOR INSERT WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can update split sessions' AND tablename = 'split_sessions') THEN
    CREATE POLICY "Anyone can update split sessions" ON public.split_sessions FOR UPDATE USING (true);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_split_sessions_slug ON public.split_sessions(slug);
CREATE INDEX IF NOT EXISTS idx_split_sessions_expires ON public.split_sessions(expires_at);
`;

const postData = JSON.stringify({ query: sql });

const options = {
  hostname: `${projectRef}.supabase.co`,
  port: 443,
  path: '/rest/v1/rpc/exec_sql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': serviceRoleKey,
    'Authorization': `Bearer ${serviceRoleKey}`,
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('Attempting to create split_sessions table...\n');
console.log('If this fails, please manually run this SQL in Supabase SQL Editor:');
console.log('URL: https://supabase.com/dashboard/project/' + projectRef + '/sql/new\n');
console.log('SQL to run:');
console.log('─'.repeat(60));
console.log(sql);
console.log('─'.repeat(60));
