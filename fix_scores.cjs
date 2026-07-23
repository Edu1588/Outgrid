const fs = require('fs');

let content = fs.readFileSync('src/lib/initialScrapedLeads.ts', 'utf8');

const prefix = 'import type { ScrapedLead } from "./storage";\n\nexport const INITIAL_SCRAPED_LEADS: any[] = ';
const arrayStart = content.indexOf('[');
const arrayStr = content.substring(arrayStart, content.lastIndexOf(']') + 1);

let leads = eval('(' + arrayStr + ')');

leads = leads.map(lead => {
    // Score based ONLY on followers and website quality (not contact info)
    let followerPoints = Math.min(80, Math.floor(Math.sqrt(lead.followers || 0) * 0.8));

    let websitePoints = 0;
    let l = (lead.link || '').toLowerCase();
    if (l &&
        l.trim() !== '' &&
        l.startsWith('http') &&
        !l.includes('instagram.com') &&
        !l.includes('facebook.com') &&
        !l.includes('carrosp.com.br') &&
        !l.includes('olx.com.br') &&
        !l.includes('webmotors.com.br')
    ) {
        websitePoints = 20; // Has a custom domain
    } else if (l) {
        websitePoints = 5; // Has an aggregator link or social profile
    }

    lead.score = followerPoints + websitePoints;
    // ensure score is at least 1, max 100
    lead.score = Math.max(1, Math.min(100, lead.score));

    return lead;
});

const newContent = prefix + JSON.stringify(leads, null, 2) + ';\n';
fs.writeFileSync('src/lib/initialScrapedLeads.ts', newContent);
