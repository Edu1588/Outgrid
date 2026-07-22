import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://vjxuyxszcmlojvincvgp.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (supabaseKey) {
  const supabase = createClient(supabaseUrl, supabaseKey);
  supabase.from('scraped_leads').select('*').then(({data, error}) => {
    console.log("Supabase Data count:", data?.length, error);
  });
} else {
  console.log("No anon key");
}
