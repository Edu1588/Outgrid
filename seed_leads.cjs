const fs = require('fs/promises');
const crypto = require('crypto');

async function seed() {
  const cities = ["Campinas", "Valinhos", "Vinhedo", "Paulínia", "Sumaré"];
  const leads = [];
  
  for (let i = 0; i < 30; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)];
    leads.push({
      id: crypto.randomBytes(4).toString('hex'),
      storeName: `Loja ${i + 1} ${city}`,
      city: city,
      email: `contato@loja${i + 1}.com.br`,
      phone: `(19) 99999-${String(i).padStart(4, '0')}`,
      instagramLikes: Math.floor(Math.random() * 150),
      status: 'Não contatado',
      link: `https://instagram.com/loja${i + 1}`,
      createdAt: new Date().toISOString()
    });
  }

  await fs.writeFile('scraped_leads.json', JSON.stringify(leads, null, 2));
  console.log('Seeded 30 leads.');
}

seed();
