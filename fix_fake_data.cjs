const fs = require('fs');

const file = 'scraped_leads.json';
const leads = JSON.parse(fs.readFileSync(file, 'utf-8'));

leads.forEach(lead => {
  const storeSeed = (lead.storeName || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
  
  // Fake Gmail
  if (lead.email === `vendas.${storeSeed}@gmail.com`) {
    lead.email = "";
  }
  // Fake Contato
  if (lead.email && lead.email.startsWith("contato@")) {
    lead.email = "";
  }
  // Fake phone
  if (lead.phone && lead.phone.startsWith("(19) 998") || lead.phone.startsWith("(19) 999")) {
    // Let's only remove if it's the exact format generated
    const seed = (lead.storeName || "").split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const ddd = "19";
    const part1 = 9800 + (seed % 199);
    const part2 = 1000 + ((seed * 13) % 9000);
    const fakePhone = `(${ddd}) 9${part1}-${part2}`;
    if (lead.phone === fakePhone) {
      lead.phone = "";
    }
  }

  // Ampelio specific fix
  if (lead.storeName.includes("Ampelio")) {
     lead.link = "";
     lead.email = "";
  }
  if (lead.storeName.includes("Nova Odessa Ve")) {
     lead.link = "";
  }
});

fs.writeFileSync(file, JSON.stringify(leads, null, 2), 'utf-8');
const fileContent = `export const INITIAL_SCRAPED_LEADS = ${JSON.stringify(leads, null, 2)};`;
fs.writeFileSync("src/lib/initialScrapedLeads.ts", fileContent, "utf-8");

console.log("Fixed fake data.");
