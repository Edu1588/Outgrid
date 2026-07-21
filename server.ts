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

function extractPhoneFromText(text: string): string {
  if (!text) return "";
  const match = text.match(/(?:\(?\d{2}\)?\s?)?(?:9\d{4}|\d{4})[-.\s]?\d{4}/g);
  if (match) {
    for (const m of match) {
      const clean = m.replace(/[^\d]/g, "");
      if (clean.length >= 10 && clean.length <= 11) {
        const ddd = clean.substring(0, 2);
        const rest = clean.substring(2);
        if (rest.length === 9) {
          return `(${ddd}) ${rest.substring(0, 5)}-${rest.substring(5)}`;
        } else if (rest.length === 8) {
          return `(${ddd}) ${rest.substring(0, 4)}-${rest.substring(4)}`;
        }
      }
    }
  }
  return "";
}

function extractEmailFromText(text: string): string {
  if (!text) return "";
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);
  if (match && match.length > 0) {
    return match[0];
  }
  return "";
}

function extractDomainEmail(websiteUrl: string, storeName: string): string {
  if (websiteUrl) {
    try {
      const parsed = new URL(websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`);
      let hostname = parsed.hostname.replace(/^www\./, '');
      if (hostname && !hostname.includes('instagram.com') && !hostname.includes('facebook.com') && !hostname.includes('carrosp.com.br') && !hostname.includes('napista.com.br') && !hostname.includes('olx.com.br') && !hostname.includes('webmotors.com.br')) {
        return `contato@${hostname}`;
      }
    } catch (e) {}
  }
  
  if (storeName && storeName !== "Loja Desconhecida") {
    const slug = storeName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
    if (slug) {
      return `contato@${slug}.com.br`;
    }
  }
  return "";
}

function extractInstagramLink(text: string, storeName: string, originalLink?: string): string {
  if (originalLink && originalLink.includes("instagram.com")) {
    let clean = originalLink.split('?')[0];
    if (clean.includes('/reel/') || clean.includes('/p/')) {
      clean = clean.split('/reel/')[0].split('/p/')[0];
    }
    return clean;
  }
  if (text) {
    const match = text.match(/instagram\.com\/([a-zA-Z0-9_.-]+)/i);
    if (match) {
      const handle = match[1];
      if (handle && !['p', 'reel', 'reels', 'stories', 'explore', 'direct'].includes(handle.toLowerCase())) {
        return `https://www.instagram.com/${handle}`;
      }
    }
  }
  if (storeName && storeName !== "Loja Desconhecida") {
    const slug = storeName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
    if (slug) {
      return `https://www.instagram.com/${slug}`;
    }
  }
  return "";
}

function isOfficialWebsite(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase().trim();
  if (!lower.startsWith("http")) return false;
  
  const portalsAndSocials = [
    "instagram.com",
    "facebook.com",
    "carrosp.com.br",
    "olx.com.br",
    "webmotors.com.br",
    "icarros.com.br",
    "autoline.com.br",
    "chavesnamao.com.br",
    "napista.com.br",
    "socarros.com.br",
    "alodigital.com.br",
    "guiamais.com.br",
    "apontador.com.br",
    "google.com",
    "youtube.com"
  ];
  
  return !portalsAndSocials.some(portal => lower.includes(portal));
}

function mergeAndDeduplicateLeads(leads: any[]): any[] {
  const map = new Map<string, any>();

  for (const item of leads) {
    if (!item.storeName || isExcludedClient(item.storeName)) continue;

    const key = item.storeName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
    if (!key) continue;

    const existing = map.get(key);

    let rawLink = item.link || item.website || "";
    let officialWebsite = isOfficialWebsite(rawLink) ? rawLink : "";
    let instagramUrl = "";

    if (rawLink.toLowerCase().includes("instagram.com")) {
      instagramUrl = rawLink;
    } else if (item.instagram) {
      instagramUrl = item.instagram;
    }

    if (!existing) {
      map.set(key, {
        id: item.id || crypto.randomBytes(4).toString("hex"),
        storeName: item.storeName,
        city: item.city || "Nova Odessa",
        phone: item.phone || "",
        email: item.email || "",
        link: officialWebsite,
        instagram: instagramUrl,
        status: item.status || "Não contatado",
        score: item.score,
        createdAt: item.createdAt || new Date().toISOString()
      });
    } else {
      if (!existing.phone && item.phone) existing.phone = item.phone;
      if (existing.phone && item.phone && item.phone.replace(/\D/g, '').length > existing.phone.replace(/\D/g, '').length) {
        existing.phone = item.phone;
      }
      if (!existing.email && item.email) existing.email = item.email;
      if (!existing.link && officialWebsite) existing.link = officialWebsite;
      if (!existing.instagram && instagramUrl) existing.instagram = instagramUrl;
      if (existing.city === "Nova Odessa" && item.city && item.city !== "Nova Odessa") existing.city = item.city;
      if (item.status && item.status !== "Não contatado") existing.status = item.status;
    }
  }

  const result: any[] = [];
  for (const [key, lead] of map.entries()) {
    if (!lead.email) {
      lead.email = extractDomainEmail(lead.link, lead.storeName);
    }
    if (!lead.instagram) {
      lead.instagram = extractInstagramLink("", lead.storeName, lead.link);
    }

    const hasWebsite = isOfficialWebsite(lead.link);
    if (hasWebsite) {
      lead.score = 20;
    } else {
      lead.score = 85;
    }

    result.push(lead);
  }

  return result;
}

// Helper to read/write from local JSON file
async function getLeadsFromDB() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) {
      const merged = mergeAndDeduplicateLeads(parsed);
      return merged;
    }
    return [];
  } catch (error) {
    return [];
  }
}

async function saveLeadsToDB(leads: any[]) {
  await fs.writeFile(DATA_FILE, JSON.stringify(leads, null, 2), "utf-8");
}

export const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

async function startServer() {

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
      const serperApiKey = process.env.SERPER_API_KEY || process.env.SERPER;
      
      if (!serperApiKey) {
        return res.status(500).json({ error: "SERPER API key not configured (SERPER or SERPER_API_KEY)" });
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

      const groqApiKey = process.env.GROQ_API_KEY || process.env.GROQ;
      if (!groqApiKey) {
        return res.status(500).json({ error: "GROQ API key not configured (GROQ or GROQ_API_KEY)" });
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
- "score": Um número de 0 a 100 representando OPORTUNIDADE DE VENDA de criação de site e marketing:
   * Lojas COM site oficial próprio (.com.br, etc) -> Score BAIXO (15 a 35).
   * Lojas SEM site próprio (apenas redes sociais ou portais) -> Score ALTO (70 a 95).
- "link": A URL do site oficial próprio da loja (ex: https://www.nomedaloja.com.br). Se não tiver site próprio, retorne "".
- "instagram": A URL do perfil oficial do Instagram da loja (ex: https://www.instagram.com/nomedaloja). Se não encontrar no texto, retorne "".
- "phone": Tente extrair o número de telefone ou WhatsApp (ex: (19) 99999-9999) do snippet ou título.
- "email": Tente extrair o e-mail do snippet se houver.

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

      const allLeads = filteredLeads.map((lead: any, idx: number) => {
        const matchingResult = allResults.find(r => r.title?.toLowerCase().includes((lead.storeName || "").toLowerCase())) || allResults[idx] || {};
        const combinedText = `${matchingResult.title || ""} ${matchingResult.snippet || ""}`;

        let website = lead.link || lead.website || "";
        if (!website && matchingResult.link && !matchingResult.link.includes("instagram.com") && !matchingResult.link.includes("facebook.com")) {
          website = matchingResult.link;
        }

        let instagram = lead.instagram || extractInstagramLink(combinedText, lead.storeName, matchingResult.link);

        let email = lead.email || extractEmailFromText(combinedText);
        if (!email) {
          email = extractDomainEmail(website, lead.storeName);
        }

        let phone = lead.phone || extractPhoneFromText(combinedText);

        const isOfficialSite = website && 
          !website.includes("instagram.com") && 
          !website.includes("facebook.com") && 
          !website.includes("carrosp.com.br") && 
          !website.includes("olx.com.br") && 
          !website.includes("webmotors.com.br") &&
          !website.includes("icarros.com.br");

        let score = lead.score;
        if (!score || score === 100) {
          if (isOfficialSite) {
            score = Math.floor(Math.random() * 20) + 15;
          } else {
            score = Math.floor(Math.random() * 25) + 70;
          }
        }

        return {
          id: crypto.randomBytes(4).toString("hex"),
          storeName: lead.storeName || "Loja Desconhecida",
          city: randomCity,
          email: email, 
          phone: phone,
          score: score,
          status: 'Não contatado',
          link: website,
          instagram: instagram,
          createdAt: new Date().toISOString()
        };
      });

      // Save to DB and filter out existing leads that match excluded names
      const existingLeads = await getLeadsFromDB();
      const updatedLeads = mergeAndDeduplicateLeads([...allLeads, ...existingLeads]);
      await saveLeadsToDB(updatedLeads);

      res.json({ success: true, count: updatedLeads.length, leads: updatedLeads });
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

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
