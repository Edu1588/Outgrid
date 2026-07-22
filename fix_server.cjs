const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  /function mapLeadToDB\(lead: any\) \{[\s\S]*?created_at/m,
  `function mapLeadToDB(lead: any) {
  return {
    id: lead.id,
    store_name: lead.storeName,
    city: lead.city || null,
    email: lead.email || null,
    phone: lead.phone || null,
    score: lead.score !== undefined ? lead.score : null,
    status: lead.status || null,
    link: lead.link || null,
    instagram: lead.instagram || null,
    followers: lead.followers || null,
    created_at`
);

code = code.replace(
  /instagram: dbLead\.instagram \|\| "", \/\/ Handles missing instagram column in DB gracefully/,
  `instagram: dbLead.instagram || "",\n    followers: dbLead.followers !== null ? dbLead.followers : undefined,`
);

fs.writeFileSync('server.ts', code);
