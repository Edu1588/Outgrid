const fs = require('fs');
let content = fs.readFileSync('src/lib/initialScrapedLeads.ts', 'utf8');
content = content.replace('export const INITIAL_SCRAPED_LEADS: ScrapedLead[] = [', 'export const INITIAL_SCRAPED_LEADS: any[] = [');
fs.writeFileSync('src/lib/initialScrapedLeads.ts', content);
