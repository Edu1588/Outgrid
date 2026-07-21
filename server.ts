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
  if (websiteUrl && isOfficialWebsite(websiteUrl)) {
    try {
      const parsed = new URL(websiteUrl.startsWith('http') ? websiteUrl : `https://${websiteUrl}`);
      let hostname = parsed.hostname.replace(/^www\./, '');
      if (hostname) {
        return `contato@${hostname}`;
      }
    } catch (e) {}
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
  return "";
}

function isCarDealership(storeName: string, text: string = ""): boolean {
  if (!storeName) return false;
  const combined = `${storeName} ${text}`.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  const invalidKeywords = [
    "reboque", "guincho", "socorro", "transporte", "fretamento",
    "mecanica", "oficina", "funilaria", "pintura", "auto peca", "autopecas", "pneus", "borracharia",
    "despachante", "vistoria", "emplacamento", "insulfilm", "som e acessorio",
    "locadora", "rent a car", "aluguel", "locacao", "lava rapido", "lava jato", "estetica automotiva",
    "taxi", "escolar", "mudanca"
  ];

  return !invalidKeywords.some(kw => combined.includes(kw));
}

function formatWebsiteUrl(url: string): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function isOfficialWebsite(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase().trim();
  const normalized = lower.startsWith("http://") || lower.startsWith("https://") ? lower : `https://${lower}`;
  
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
    "youtube.com",
    "tiktok.com"
  ];
  
  return !portalsAndSocials.some(portal => normalized.includes(portal));
}

function mergeAndDeduplicateLeads(leads: any[]): any[] {
  const map = new Map<string, any>();

  for (const item of leads) {
    if (!item.storeName || isExcludedClient(item.storeName) || !isCarDealership(item.storeName, `${item.link || ''} ${item.email || ''}`)) continue;

    const key = item.storeName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "");
    if (!key) continue;

    const existing = map.get(key);

    let rawLink = item.link || item.website || "";
    let officialWebsite = isOfficialWebsite(rawLink) ? formatWebsiteUrl(rawLink) : "";
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
    const hasWebsite = isOfficialWebsite(lead.link);

    // Only set domain email if lead has an official website and no email was set
    if (!lead.email && hasWebsite) {
      lead.email = extractDomainEmail(lead.link, lead.storeName);
    }
    // If no website and email was previously generic, clean it up
    if (!hasWebsite && lead.email && lead.email.startsWith("contato@")) {
      lead.email = "";
    }

    // Calculate dynamic opportunity score based on audit parameters
    const seed = (lead.storeName || "").split("").reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0);
    if (lead.score === undefined || lead.score === 85 || lead.score === 20) {
      if (!hasWebsite) {
        // High opportunity score (74 - 98) for stores relying only on Instagram / Portals
        lead.score = 74 + (seed % 24);
      } else {
        // Moderate/low score (18 - 52) for stores that have an official website
        lead.score = 18 + (seed % 35);
      }
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

      const query = `concessionárias e lojas de carros seminovos em ${randomCity}`;
      
      let placesResults: any[] = [];
      let organicResults: any[] = [];

      // 1. Fetch Google Places (Google Maps Listings)
      try {
        const placesRes = await fetch("https://google.serper.dev/places", {
          method: "POST",
          headers: {
            "X-API-KEY": serperApiKey,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            q: query,
            gl: "br",
            hl: "pt-br",
            num: 20
          })
        });
        if (placesRes.ok) {
          const pData = await placesRes.json();
          placesResults = pData.places || [];
        }
      } catch (e) {
        console.warn("Places API search warning:", e);
      }

      // 2. Fetch Google Organic Search
      try {
        const organicRes = await fetch("https://google.serper.dev/search", {
          method: "POST",
          headers: {
            "X-API-KEY": serperApiKey,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            q: query,
            gl: "br",
            hl: "pt-br",
            num: 20
          })
        });
        if (organicRes.ok) {
          const oData = await organicRes.json();
          organicResults = oData.organic || [];
        }
      } catch (e) {
        console.warn("Organic API search warning:", e);
      }

      // Combine candidates and filter out non-dealerships (e.g. reboque, guincho, oficinas)
      const rawCandidates: any[] = [];

      for (const p of placesResults) {
        if (isCarDealership(p.title || "", `${p.category || ""} ${p.address || ""}`) && !isExcludedClient(p.title || "")) {
          rawCandidates.push({
            title: p.title,
            address: p.address,
            phone: p.phoneNumber || "",
            website: isOfficialWebsite(p.website || "") ? p.website : "",
            snippet: `${p.category || "Loja de carros"} em ${randomCity}`,
            source: "places"
          });
        }
      }

      for (const o of organicResults) {
        if (isCarDealership(o.title || "", o.snippet || "") && !isExcludedClient(o.title || "")) {
          rawCandidates.push({
            title: o.title,
            snippet: o.snippet,
            website: isOfficialWebsite(o.link || "") ? o.link : "",
            source: "organic"
          });
        }
      }

      const groqApiKey = process.env.GROQ_API_KEY || process.env.GROQ;
      let allLeads: any[] = [];

      if (groqApiKey && rawCandidates.length > 0) {
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
                content: `Você é um analista de inteligência de mercado automotivo.
Analise a lista de empresas e extraia APENAS LOJAS E CONCESSIONÁRIAS DE CARROS (novos/seminovos).

REGRAS RÍGIDAS DE FILTRAGEM:
1. DESCARTE QUALQUER empresa de reboque, guincho, oficina mecânica, funilaria, auto peças, despachante, aluguel de carros ou lava-rápido.
2. DESCARTE as marcas exclusivas: "Unimais", "Meta Veículos", "Azul Veículos".
3. NÃO INVENTE NENHUM ENDEREÇO DE E-MAIL! Se o e-mail não estiver explicitamente presente ou se a loja não possuir um domínio de site próprio oficial, retorne "".
4. "link": Retorne APENAS o site oficial próprio da loja (ex: https://www.nomedaloja.com.br). Se for apenas redes sociais ou portais (OLX, Webmotors), retorne "".
5. "score": 
   - Lojas SEM site próprio -> Score de Oportunidade ALTO (74 a 98).
   - Lojas COM site próprio -> Score BAIXO (18 a 52).

Retorne um JSON com formato: { "leads": [ { "storeName": "", "phone": "", "email": "", "link": "", "instagram": "", "score": 85 } ] }`
              },
              {
                role: "user",
                content: JSON.stringify(rawCandidates.slice(0, 25))
              }
            ],
            response_format: { type: "json_object" }
          })
        });

        if (groqResponse.ok) {
          const groqData = await groqResponse.json();
          let content = groqData.choices[0]?.message?.content || "{}";
          content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          try {
            const parsed = JSON.parse(content);
            const extracted = parsed.leads || [];
            allLeads = extracted.filter((l: any) => l.storeName && isCarDealership(l.storeName) && !isExcludedClient(l.storeName));
          } catch (e) {
            console.error("JSON parse error from Groq:", e);
          }
        }
      }

      // Fallback or direct map from rawCandidates if Groq didn't return enough items
      if (allLeads.length === 0) {
        allLeads = rawCandidates.slice(0, 15).map(c => {
          const officialSite = isOfficialWebsite(c.website) ? formatWebsiteUrl(c.website) : "";
          const phone = c.phone || extractPhoneFromText(c.snippet || "");
          const email = extractEmailFromText(c.snippet || "");
          const seed = (c.title || "").split("").reduce((acc: number, ch: string) => acc + ch.charCodeAt(0), 0);
          
          return {
            storeName: c.title,
            phone: phone,
            email: email,
            link: officialSite,
            instagram: extractInstagramLink(c.snippet || "", c.title, c.website),
            score: officialSite ? (18 + (seed % 35)) : (74 + (seed % 24))
          };
        });
      }

      // Map to full lead objects
      const processedLeads = allLeads.map((lead: any) => {
        const officialSite = isOfficialWebsite(lead.link) ? formatWebsiteUrl(lead.link) : "";
        let email = lead.email || "";
        if (!email && officialSite) {
          email = extractDomainEmail(officialSite, lead.storeName);
        }
        if (!officialSite && email.startsWith("contato@")) {
          email = "";
        }

        return {
          id: crypto.randomBytes(4).toString("hex"),
          storeName: lead.storeName,
          city: randomCity,
          email: email,
          phone: lead.phone || "",
          score: lead.score || (officialSite ? 28 : 88),
          status: "Não contatado",
          link: officialSite,
          instagram: lead.instagram || "",
          createdAt: new Date().toISOString()
        };
      });

      // Save to DB and filter out existing leads that match excluded names
      const existingLeads = await getLeadsFromDB();
      const updatedLeads = mergeAndDeduplicateLeads([...processedLeads, ...existingLeads]);
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
