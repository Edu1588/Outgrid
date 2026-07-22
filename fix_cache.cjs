const fs = require('fs');
let code = fs.readFileSync('src/lib/storage.ts', 'utf8');

// Update getScrapedLeads to invalidate cache if Forza Motors link is old
code = code.replace(
  /if \(!parsed\[0\]\.hasOwnProperty\('followers'\)\) \{ localStorage\.removeItem\('outgrid_scraped_leads'\); return INITIAL_SCRAPED_LEADS; \}/,
  `if (!parsed[0].hasOwnProperty('followers')) { localStorage.removeItem('outgrid_scraped_leads'); return INITIAL_SCRAPED_LEADS; }
        
        // Invalidate if Forza Motors still has the wrong instagram link (to apply fix for all users)
        const forza = parsed.find(l => l.storeName === 'Forza Motors');
        if (forza && forza.instagram === 'https://www.instagram.com/forzamotors') {
          localStorage.removeItem('outgrid_scraped_leads');
          return INITIAL_SCRAPED_LEADS;
        }`
);

fs.writeFileSync('src/lib/storage.ts', code);
