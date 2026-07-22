import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vjxuyxszcmlojvincvgp.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'MISSING';

if (supabaseKey !== 'MISSING') {
  const supabase = createClient(supabaseUrl, supabaseKey);
  supabase.from('scraped_leads').select('id', { count: 'exact' }).then(({data, error, count}) => {
    console.log("Supabase Data count:", count, error);
  });
} else {
  console.log("No anon key");
}
