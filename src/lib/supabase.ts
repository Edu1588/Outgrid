import { createClient } from '@supabase/supabase-js';

let supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://vjxuyxszcmlojvincvgp.supabase.co';
if (supabaseUrl && !supabaseUrl.startsWith('http')) {
  supabaseUrl = 'https://' + supabaseUrl;
}

const supabaseKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

let client = null;
try {
  if (supabaseUrl && supabaseKey) {
    client = createClient(supabaseUrl, supabaseKey);
  }
} catch (error) {
  console.error('Invalid Supabase Configuration:', error);
}

export const supabase = client;
