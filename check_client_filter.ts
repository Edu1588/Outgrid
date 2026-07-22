import data from './scraped_leads.json' with { type: 'json' };

const parsed = data;
const validWithWebsite = parsed.filter(l => l.link && l.link.trim() !== '' && l.link.startsWith('http') && !l.link.includes('instagram.com') && !l.link.includes('facebook.com'));
console.log("After frontend filter:", validWithWebsite.length);
