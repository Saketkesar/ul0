// Script to create split_sessions table in Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://YOUR_PROJECT.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SUPABASE_SERVICE_ROLE_KEY';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTable() {
  const { data, error } = await supabase.rpc('exec_sql', {
    sql: `
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

      DROP POLICY IF EXISTS "Anyone can view split sessions" ON public.split_sessions;
      CREATE POLICY "Anyone can view split sessions" ON public.split_sessions FOR SELECT USING (true);
      
      DROP POLICY IF EXISTS "Anyone can create split sessions" ON public.split_sessions;
      CREATE POLICY "Anyone can create split sessions" ON public.split_sessions FOR INSERT WITH CHECK (true);
      
      DROP POLICY IF EXISTS "Anyone can update split sessions" ON public.split_sessions;
      CREATE POLICY "Anyone can update split sessions" ON public.split_sessions FOR UPDATE USING (true);

      CREATE INDEX IF NOT EXISTS idx_split_sessions_slug ON public.split_sessions(slug);
      CREATE INDEX IF NOT EXISTS idx_split_sessions_expires ON public.split_sessions(expires_at);
    `
  });

  if (error) {
    console.log('RPC error (expected if exec_sql not available):', error.message);
    console.log('Please run the SQL manually in Supabase SQL Editor');
    
    // Try to test if table exists by querying it
    const { error: tableError } = await supabase
      .from('split_sessions')
      .select('id')
      .limit(1);
    
    if (tableError && tableError.code === '42P01') {
      console.log('\n❌ Table does not exist. Please create it manually:');
      console.log('\n1. Go to https://supabase.com/dashboard/project/' + (process.env.SUPABASE_PROJECT_REF || 'YOUR_PROJECT_REF') + '/sql/new');
      console.log('2. Copy and paste the SQL from scripts/003_split_sessions.sql');
      console.log('3. Click "Run"\n');
    } else if (!tableError) {
      console.log('\n✅ Table split_sessions already exists!');
    } else {
      console.log('Table check error:', tableError);
    }
  } else {
    console.log('✅ Table created successfully!');
  }
}

createTable();
