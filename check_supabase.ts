import { supabase } from './src/lib/supabase';

async function check() {
  const { data, error } = await supabase.from('scraped_leads').select('*').limit(5);
  console.log("Supabase error:", error);
  console.log("Supabase data:", data);
}
check();
