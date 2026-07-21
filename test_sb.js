import { createClient } from '@supabase/supabase-js';

let supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://vjxuyxszcmlojvincvgp.supabase.co';
if (supabaseUrl && !supabaseUrl.startsWith('http')) {
  supabaseUrl = 'https://' + supabaseUrl;
}
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'test';

const client = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await client.from('page_views').insert([{ path: '/' }]);
  console.log('page_views error:', error);
  
  const { data: leadsData, error: leadsError } = await client.from('leads').select('*').limit(1);
  console.log('leads error:', leadsError);
}

test();
