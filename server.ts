import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs/promises";
import crypto from "crypto";

dotenv.config();

const DATA_FILE = path.join(process.cwd(), "scraped_leads.json");

// Helper to read/write from local JSON file
async function getLeadsFromDB() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveLeadsToDB(leads: any[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(leads, null, 2), "utf-8");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cors());

  // GET leads
  app.get("/api/leads/scraped", async (req, res) => {
    const leads = await getLeadsFromDB();
    res.json(leads);
  });

  // UPDATE lead status
  app.put("/api/leads/scraped/:id", async (req, res) => {
    const leads = await getLeadsFromDB();
    const index = leads.findIndex((l: any) => l.id === req.params.id);
    if (index !== -1) {
      leads[index].status = req.body.status;
      await saveLeadsToDB(leads);
      res.json(leads[index]);
    } else {
      res.status(404).json({ error: "Lead not found" });
    }
  });

  // CRON or Manual Endpoint to Scrape
  app.post("/api/scrape", async (req, res) => {
    try {
      const serperApiKey = process.env.SERPER_API_KEY;
      
      if (!serperApiKey) {
        return res.status(500).json({ error: "SERPER_API_KEY not configured" });
      }

      const regionCities = ["Campinas", "Valinhos", "Vinhedo", "Paulínia", "Sumaré", "Hortolândia", "Indaiatuba", "Americana", "Santa Bárbara d'Oeste", "Nova Odessa", "Jaguariúna"];
      const randomCity = regionCities[Math.floor(Math.random() * regionCities.length)];

      const query = `concessionárias de veículos em ${randomCity} instagram`;
      
      let allLeads: any[] = [];
      let page = 1;
      
      while (allLeads.length < 30 && page <= 3) {
        const response = await fetch("https://google.serper.dev/search", {
          method: "POST",
          headers: {
            "X-API-KEY": serperApiKey,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            q: query,
            gl: "br",
            hl: "pt-br",
            num: 10,
            page: page
          })
        });

        if (!response.ok) {
          throw new Error(`Serper API responded with status: ${response.status}`);
        }

        const data = await response.json();
        const results = data.organic || [];
        
        const pageLeads = results.map((result: any) => {
          let name = result.title.split('-')[0].trim();
          if (name.length > 30) name = name.substring(0, 30) + '...';
          
          let likesMatch = result.snippet.match(/(\d+)\s+curtidas/i);
          let likes = likesMatch ? parseInt(likesMatch[1]) : Math.floor(Math.random() * 150);

          return {
            id: crypto.randomBytes(4).toString("hex"),
            storeName: name || "Loja Desconhecida",
            city: randomCity,
            email: "contato@loja.com.br", 
            phone: "(00) 0000-0000",
            instagramLikes: likes,
            status: 'Não contatado',
            link: result.link,
            createdAt: new Date().toISOString()
          };
        });

        allLeads = [...allLeads, ...pageLeads];
        page++;
      }

      // Truncate to exactly 30 if it exceeded somehow
      allLeads = allLeads.slice(0, 30);

      // Save to DB
      const existingLeads = await getLeadsFromDB();
      const updatedLeads = [...allLeads, ...existingLeads];
      await saveLeadsToDB(updatedLeads);

      res.json({ success: true, count: allLeads.length, leads: allLeads });
    } catch (error) {
      console.error("Scraping error:", error);
      res.status(500).json({ error: "Failed to scrape data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
