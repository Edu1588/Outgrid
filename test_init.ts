import { INITIAL_SCRAPED_LEADS } from './src/lib/initialScrapedLeads.ts';
console.log(INITIAL_SCRAPED_LEADS.slice(0, 5).map(l => ({ name: l.storeName, insta: l.instagram })));
