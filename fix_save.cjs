const fs = require('fs');
let code = fs.readFileSync('src/lib/storage.ts', 'utf8');

code = code.replace(
  /export function saveScrapedLead\(leadData: Omit<ScrapedLead, 'id' \| 'createdAt'>\) \{[\s\S]*?return newLead;\n  \} catch \(e\) \{/,
  `export async function saveScrapedLeadAsync(leadData: Omit<ScrapedLead, 'id' | 'createdAt'>) {
  try {
    if (supabase) {
      const newLead = {
        ...leadData,
        id: Math.random().toString(36).substring(2, 9),
        created_at: new Date().toISOString(),
        store_name: leadData.storeName
      };
      await supabase.from('scraped_leads').insert([newLead]);
    }
  } catch (e) {
    console.error('Supabase insert failed', e);
  }
  return saveScrapedLead(leadData);
}

export function saveScrapedLead(leadData: Omit<ScrapedLead, 'id' | 'createdAt'>) {
  try {
    const currentLeads = getScrapedLeads();
    const newLead: ScrapedLead = {
      ...leadData,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString()
    };
    currentLeads.push(newLead);
    localStorage.setItem('outgrid_scraped_leads', JSON.stringify(currentLeads));
    return newLead;
  } catch (e) {`
);

code = code.replace(
  /export function saveLead\(leadData: Omit<Lead, 'id' \| 'createdAt'>\) \{[\s\S]*?return newLead;\n  \} catch \(e\) \{/,
  `export async function saveLeadAsync(leadData: Omit<Lead, 'id' | 'createdAt'>) {
  try {
    if (supabase) {
      const newLead = {
        ...leadData,
        id: Math.random().toString(36).substring(2, 9),
        created_at: new Date().toISOString()
      };
      await supabase.from('leads').insert([newLead]);
    }
  } catch (e) {
    console.error('Supabase insert failed', e);
  }
  return saveLead(leadData);
}

export function saveLead(leadData: Omit<Lead, 'id' | 'createdAt'>) {
  try {
    const currentLeadsStr = localStorage.getItem('outgrid_leads');
    const currentLeads: Lead[] = currentLeadsStr ? JSON.parse(currentLeadsStr) : [];
    
    const newLead: Lead = {
      ...leadData,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString()
    };
    
    currentLeads.push(newLead);
    localStorage.setItem('outgrid_leads', JSON.stringify(currentLeads));
    return newLead;
  } catch (e) {`
);

fs.writeFileSync('src/lib/storage.ts', code);
