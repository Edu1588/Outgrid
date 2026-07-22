import { INITIAL_SCRAPED_LEADS } from './src/lib/initialScrapedLeads';

const EXCLUDED_CLIENTS = ["unimais", "meta veiculos", "meta veículos", "azul veiculos", "azul veículos", "unimais veiculos", "unimais veículos"];
function isExcludedClient(storeName: string): boolean {
  if (!storeName) return false;
  const lower = storeName.toLowerCase();
  return EXCLUDED_CLIENTS.some(ex => lower.includes(ex));
}

function mergeAndDeduplicateLeads(leads: any[]) {
  const unique = new Map();
  for (const lead of leads) {
    unique.set(lead.storeName, lead);
  }
  return Array.from(unique.values());
}

const valid = INITIAL_SCRAPED_LEADS.filter(l => l.link && l.link.trim() !== '' && l.link.startsWith('http') && !l.link.includes('instagram.com') && !l.link.includes('facebook.com'));

const dedup = mergeAndDeduplicateLeads(valid);
const final = dedup.filter(l => !isExcludedClient(l.storeName));

console.log(final.length);
