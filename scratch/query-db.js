const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env
try {
  const envContent = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      process.env[key] = value;
    }
  });
} catch (e) {
  console.log("No .env found or failed to read:", e.message);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('comparisons')
    .select('slug, data')
    .limit(5);

  if (error) {
    console.error("Error fetching comparisons:", error);
    return;
  }

  for (const row of data) {
    console.log(`Slug: ${row.slug}`);
    console.log(`Item 1 Name: ${row.data?.item1?.name}, Logo: ${row.data?.item1?.logo}`);
    console.log(`Item 2 Name: ${row.data?.item2?.name}, Logo: ${row.data?.item2?.logo}`);
    console.log('---');
  }
}

run();
