import data from './scraped_leads.json' with { type: 'json' };

const EXCLUDED_CLIENTS = ["unimais", "meta veiculos", "meta veículos", "azul veiculos", "azul veículos", "unimais veiculos", "unimais veículos"];
function isExcludedClient(storeName) {
  if (!storeName) return false;
  const lower = storeName.toLowerCase();
  return EXCLUDED_CLIENTS.some(ex => lower.includes(ex));
}

function mergeAndDeduplicateLeads(leads) {
  const unique = new Map();
  for (const lead of leads) {
    unique.set(lead.storeName, lead);
  }
  return Array.from(unique.values());
}

const deduped = mergeAndDeduplicateLeads(data);
const final = deduped.filter(l => !isExcludedClient(l.storeName));

console.log("Total in json:", data.length);
console.log("Total after deduplication:", deduped.length);
console.log("Total after exclusions:", final.length);
