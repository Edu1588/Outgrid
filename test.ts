import { INITIAL_SCRAPED_LEADS } from './src/lib/initialScrapedLeads.ts';
const missingInsta = INITIAL_SCRAPED_LEADS.filter(l => !l.instagram).length;
console.log("Missing Insta:", missingInsta, "out of", INITIAL_SCRAPED_LEADS.length);
