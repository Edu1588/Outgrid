import { loadEnv } from 'vite';
import { createClient } from '@supabase/supabase-js';
import { INITIAL_SCRAPED_LEADS } from './src/lib/initialScrapedLeads.ts';

const env = loadEnv('development', process.cwd(), '');
let supabaseUrl = env.VITE_SUPABASE_URL || 'https://vjxuyxszcmlojvincvgp.supabase.co';
if (supabaseUrl && !supabaseUrl.startsWith('http')) {
  supabaseUrl = 'https://' + supabaseUrl;
}
if (!supabaseUrl.includes('.supabase.co')) {
  supabaseUrl = supabaseUrl + '.supabase.co';
}
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error("VITE_SUPABASE_ANON_KEY não encontrada nas variáveis de ambiente!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("Inserindo leads...");
  
  const records = INITIAL_SCRAPED_LEADS.map(l => ({
    id: l.id,
    store_name: l.storeName,
    city: l.city,
    email: l.email || null,
    phone: l.phone || null,
    score: l.score,
    status: l.status,
    link: l.link || null,
    instagram: l.instagram || null,
    followers: l.followers || null,
  }));

  const { data, error } = await supabase.from('scraped_leads').upsert(records, { onConflict: 'id' });
  
  if (error) {
    console.error("Erro ao inserir:", error);
  } else {
    console.log(`Sucesso! ${records.length} leads foram inseridos/atualizados.`);
  }
}

run();
