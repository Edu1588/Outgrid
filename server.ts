import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs/promises";
import crypto from "crypto";

dotenv.config();

const DATA_FILE = path.join(process.cwd(), "scraped_leads.json");

const EXCLUDED_CLIENTS = ["unimais", "meta veiculos", "meta veículos", "azul veiculos", "azul veículos", "unimais veiculos", "unimais veículos"];

function isExcludedClient(storeName: string): boolean {
  if (!storeName) return false;
  const lower = storeName.toLowerCase();
  return EXCLUDED_CLIENTS.some(ex => lower.includes(ex));
}

// Helper to read/write from local JSON file
async function getLeadsFromDB() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      return parsed.filter((l: any) => !isExcludedClient(l.storeName));
    }
    return [];
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

      const query = `concessionárias de seminovos e veículos em ${randomCity}`;
      
      let allResults: any[] = [];
      let page = 1;
      
      while (allResults.length < 30 && page <= 3) {
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
        allResults = [...allResults, ...(data.organic || [])];
        page++;
      }

      // Truncate to exactly 30 if it exceeded
      allResults = allResults.slice(0, 30);

      const groqApiKey = process.env.GROQ_API_KEY;
      if (!groqApiKey) {
        return res.status(500).json({ error: "GROQ_API_KEY not configured" });
      }

      // Prepare data for Groq
      const promptData = allResults.map(r => ({
        title: r.title,
        snippet: r.snippet,
        link: r.link
      }));

      const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `Você é um analista de inteligência de mercado. A partir dos resultados de busca do Google sobre concessionárias de carros, extraia informações estruturadas.

REGRAS OBRIGATÓRIAS DE EXCLUSÃO:
- DESCARTE e NUNCA INCLUA as seguintes lojas (já são nossos clientes): "Unimais Veículos" (ou "Unimais"), "Meta Veículos" (ou "Meta") e "Azul Veículos" (ou "Azul").

Retorne um JSON contendo uma propriedade "leads", que é um array de objetos.
Cada objeto deve ter:
- "storeName": O nome real e limpo da loja (ex: "Zacar Veículos", "Sandro Veículos").
- "score": Um número de 0 a 100. Calcule o score baseado na oportunidade de vender serviços de marketing/site:
   * Lojas COM site próprio (links que não sejam redes sociais) recebem score BAIXO (ex: 10-30).
   * Lojas SEM site próprio (apenas Instagram/Facebook) recebem score ALTO (ex: 70-100).
- "link": Se o resultado contiver a URL do site da loja (ex: https://www.nomedaloja.com.br), retorne a URL do site. NUNCA retorne links de reels do Instagram (ex: /reel/...). Se não houver site próprio ou o resultado for de rede social, retorne a URL do site se citada no snippet, caso contrário retorne string vazia "".
- "phone": Tente extrair um número de telefone ou WhatsApp do snippet. Se não encontrar, retorne "".
- "email": Tente extrair um email do snippet. Se não encontrar, retorne "".

Retorne APENAS o JSON válido, sem comentários ou formatação Markdown.`
            },
            {
              role: "user",
              content: JSON.stringify(promptData)
            }
          ],
          response_format: { type: "json_object" }
        })
      });

      if (!groqResponse.ok) {
        const errText = await groqResponse.text();
        console.error("Groq Error Response:", errText);
        throw new Error(`Groq API responded with status: ${groqResponse.status}. Body: ${errText}`);
      }

      const groqData = await groqResponse.json();
      let content = groqData.choices[0].message.content;
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      
      let parsedContent;
      try {
        parsedContent = JSON.parse(content);
      } catch (e) {
        console.error("Failed to parse Groq response:", content);
        throw new Error("Invalid JSON from Groq");
      }

      const excludedNames = ["unimais", "meta veiculos", "meta veículos", "azul veiculos", "azul veículos", "unimais veiculos", "unimais veículos"];
      
      const isExcluded = (name: string) => {
        const lower = (name || "").toLowerCase();
        return excludedNames.some(ex => lower.includes(ex));
      };

      const rawLeads = parsedContent.leads || [];

      const filteredLeads = rawLeads.filter((l: any) => !isExcluded(l.storeName));

      const allLeads = filteredLeads.map((lead: any) => {
        // Ensure no instagram reel links
        let finalLink = lead.link || "";
        if (finalLink.includes("instagram.com/reel/") || finalLink.includes("instagram.com/p/")) {
          finalLink = "";
        }

        return {
          id: crypto.randomBytes(4).toString("hex"),
          storeName: lead.storeName || "Loja Desconhecida",
          city: randomCity,
          email: lead.email || "", 
          phone: lead.phone || "",
          score: lead.score || 50,
          status: 'Não contatado',
          link: finalLink,
          createdAt: new Date().toISOString()
        };
      });

      // Save to DB and filter out existing leads that match excluded names
      const existingLeads = await getLeadsFromDB();
      const cleanedExistingLeads = existingLeads.filter((l: any) => !isExcluded(l.storeName));
      const updatedLeads = [...allLeads, ...cleanedExistingLeads];
      await saveLeadsToDB(updatedLeads);

      res.json({ success: true, count: allLeads.length, leads: allLeads });
    } catch (error: any) {
      console.error("Scraping error:", error);
      res.status(500).json({ error: "Failed to scrape data", details: error.message });
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
