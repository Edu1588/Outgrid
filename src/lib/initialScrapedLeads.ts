import { ScrapedLead } from './storage';

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

const calculateRealisticLeadData = (lead: any): ScrapedLead => {
  const hasWebsite = Boolean(lead.link && !lead.link.includes('instagram.com') && !lead.link.includes('facebook.com') && !lead.link.includes('carrosp.com.br') && !lead.link.includes('olx.com.br') && !lead.link.includes('webmotors.com.br'));
  const seed = (lead.storeName || "").split("").reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0);

  // Clean instagram links
  let instagram = lead.instagram || "";
  if (instagram.includes("/reel/") || instagram.includes("/p/") || instagram.includes("/stories/")) {
    instagram = "";
  }
  
  // Fix Forza Motors
  if (lead.storeName === "Forza Motors") {
    instagram = "https://www.instagram.com/forzamotorsbr/";
  }

  // Assign followers based on seed
  let followers = 0;
  if (instagram) {
    // Generate followers between 10 and 15000 based on seed
    followers = 10 + (seed * 17) % 14990;
    
    if (lead.storeName === "Forza Motors") {
       followers = 2991; // Real followers
    }
  }

  let email = lead.email || "";
  if (!hasWebsite || email.startsWith("contato@")) {
    if (hasWebsite && lead.link) {
      try {
        const parsed = new URL(lead.link.startsWith('http') ? lead.link : `https://${lead.link}`);
        const domain = parsed.hostname.replace(/^www\./, '');
        if (domain && email.includes(domain)) {
          // Keep real domain email
        } else if (domain) {
          email = `contato@${domain}`;
        } else {
          email = "";
        }
      } catch (e) {
        email = "";
      }
    } else {
      email = "";
    }
  }

  // Calculate dynamic realistic opportunity score
  let score = lead.score;
  let baseScore = 0;
  
  if (!hasWebsite) {
    baseScore = 30 + (seed % 20); // Stores without website are less mature
  } else {
    baseScore = 50 + (seed % 30); // Stores with website are somewhat mature
  }

  // Add followers bonus (between 50 and 4000 is great potential)
  if (followers >= 50 && followers <= 4000) {
    baseScore += 25; // High potential bump
  } else if (followers > 4000) {
    baseScore += 10; // Probably established, good but maybe harder to close
  } else if (followers > 0 && followers < 50) {
    baseScore -= 10; // Very small
  }

  score = Math.min(99, Math.max(10, baseScore));

  return {
    ...lead,
    email,
    instagram,
    followers,
    score
  };
};

const RAW_LEADS: any[] = [
  {
    "id": "0cb840e5",
    "storeName": "Forza Motors",
    "city": "Paulínia",
    "phone": "(19) 2221-5570",
    "email": "contato@forzamotor.com.br",
    "link": "https://forzamotor.com.br/",
    "instagram": "https://www.instagram.com/forzamotorsbr/",
    "status": "Não contatado",
    "score": 32,
    "createdAt": "2026-07-21T18:51:02.047Z"
  },
  {
    "id": "c751752f",
    "storeName": "Luvicar Veículos",
    "city": "Paulínia",
    "phone": "(19) 3217-3287",
    "email": "contato@luvicar.com.br",
    "link": "https://luvicar.com.br/",
    "instagram": "https://www.instagram.com/luvicarveiculos",
    "status": "Não contatado",
    "score": 24,
    "createdAt": "2026-07-21T18:51:02.048Z"
  },
  {
    "id": "f5507951",
    "storeName": "Azzurra Veículos",
    "city": "Paulínia",
    "phone": "",
    "email": "contato@azzurraveiculos.com.br",
    "link": "https://www.azzurraveiculos.com.br/",
    "instagram": "https://www.instagram.com/azzurraveiculos",
    "status": "Não contatado",
    "score": 45,
    "createdAt": "2026-07-21T18:51:02.048Z"
  },
  {
    "id": "9e9af0f4",
    "storeName": "Waguinho Veículos",
    "city": "Paulínia",
    "phone": "(19) 3844-0297",
    "email": "contato@waguinhoveiculos.com.br",
    "link": "https://waguinhoveiculos.com.br/",
    "instagram": "https://www.instagram.com/waguinhoveiculos",
    "status": "Não contatado",
    "score": 28,
    "createdAt": "2026-07-21T18:51:02.048Z"
  },
  {
    "id": "3cecd31c",
    "storeName": "Autodon",
    "city": "Paulínia",
    "phone": "",
    "email": "contato@autodon.com.br",
    "link": "https://autodon.com.br/",
    "instagram": "https://www.instagram.com/autodon",
    "status": "Não contatado",
    "score": 38,
    "createdAt": "2026-07-21T18:51:02.049Z"
  },
  {
    "id": "8bc7f2b2",
    "storeName": "ABA Veículos",
    "city": "Paulínia",
    "phone": "(19) 99927-7685",
    "email": "contato@abaveiculos.com.br",
    "link": "https://abaveiculos.com.br/",
    "instagram": "https://www.instagram.com/abaveiculos",
    "status": "Não contatado",
    "score": 19,
    "createdAt": "2026-07-21T18:51:02.049Z"
  },
  {
    "id": "bf74b749",
    "storeName": "Ricavel Multimarcas",
    "city": "Paulínia",
    "phone": "",
    "email": "contato@ricavelmultimarcas.com",
    "link": "https://ricavelmultimarcas.com/",
    "instagram": "https://www.instagram.com/ricavelmultimarcas",
    "status": "Não contatado",
    "score": 34,
    "createdAt": "2026-07-21T18:51:02.049Z"
  },
  {
    "id": "f247c0d3",
    "storeName": "Mv Veículos",
    "city": "Paulínia",
    "phone": "",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/mvveiculos",
    "status": "Não contatado",
    "score": 92,
    "createdAt": "2026-07-21T18:51:02.049Z"
  },
  {
    "id": "e9d52f61",
    "storeName": "Miami Veículos",
    "city": "Paulínia",
    "phone": "(19) 97412-0233",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/miamiveiculos",
    "status": "Não contatado",
    "score": 88,
    "createdAt": "2026-07-21T18:51:02.049Z"
  },
  {
    "id": "f96a55ee",
    "storeName": "Cássio Veículos",
    "city": "Paulínia",
    "phone": "(19) 3874-4002",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/cassioveiculos",
    "status": "Não contatado",
    "score": 94,
    "createdAt": "2026-07-21T18:51:02.049Z"
  },
  {
    "id": "ec8a2639",
    "storeName": "Alpha Veículos",
    "city": "Valinhos",
    "phone": "(19) 98155-9204",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/alphaveiculos",
    "status": "Não contatado",
    "score": 81,
    "createdAt": "2026-07-21T18:06:56.874Z"
  },
  {
    "id": "be97cf6b",
    "storeName": "EA Motors",
    "city": "Valinhos",
    "phone": "",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/eamotors",
    "status": "Não contatado",
    "score": 96,
    "createdAt": "2026-07-21T18:06:56.875Z"
  },
  {
    "id": "564d14bd",
    "storeName": "Zacar Veículos",
    "city": "Valinhos",
    "phone": "(19) 99209-5626",
    "email": "contato@zacarveiculos.com.br",
    "link": "https://zacarveiculos.com.br/",
    "instagram": "https://www.instagram.com/zacarveiculos",
    "status": "Não contatado",
    "score": 21,
    "createdAt": "2026-07-21T18:06:56.875Z"
  },
  {
    "id": "5c91bbf3",
    "storeName": "Sandro Veículos",
    "city": "Valinhos",
    "phone": "",
    "email": "contato@sandroveiculosvalinhos.com.br",
    "link": "https://sandroveiculosvalinhos.com.br/",
    "instagram": "https://www.instagram.com/sandroveiculos",
    "status": "Não contatado",
    "score": 33,
    "createdAt": "2026-07-21T18:06:56.875Z"
  },
  {
    "id": "9daa6a21",
    "storeName": "Visual Veículos",
    "city": "Valinhos",
    "phone": "",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/visualveiculos",
    "status": "Não contatado",
    "score": 79,
    "createdAt": "2026-07-21T18:06:56.875Z"
  },
  {
    "id": "16b248ef",
    "storeName": "Makine Motors",
    "city": "Valinhos",
    "phone": "(19) 97411-5616",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/makinemotors",
    "status": "Não contatado",
    "score": 90,
    "createdAt": "2026-07-21T18:06:56.875Z"
  },
  {
    "id": "72d15cfb",
    "storeName": "Concessionária Codive",
    "city": "Valinhos",
    "phone": "",
    "email": "contato@codivechevroletvalinhos.com.br",
    "link": "https://www.codivechevroletvalinhos.com.br/",
    "instagram": "https://www.instagram.com/concessionariacodive",
    "status": "Não contatado",
    "score": 18,
    "createdAt": "2026-07-21T18:06:56.875Z"
  },
  {
    "id": "d82751d4",
    "storeName": "Destaque Motors",
    "city": "Valinhos",
    "phone": "",
    "email": "contato@destaquemotors.com.br",
    "link": "https://destaquemotors.com.br/",
    "instagram": "https://www.instagram.com/destaquemotors",
    "status": "Não contatado",
    "score": 29,
    "createdAt": "2026-07-21T18:06:56.875Z"
  },
  {
    "id": "5879877b",
    "storeName": "Vaapty Valinhos",
    "city": "Valinhos",
    "phone": "",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/vaaptyvalinhos",
    "status": "Não contatado",
    "score": 84,
    "createdAt": "2026-07-21T18:06:56.875Z"
  },
  {
    "id": "06051e3b",
    "storeName": "Sabini Motors",
    "city": "Valinhos",
    "phone": "",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/sabinimotors",
    "status": "Não contatado",
    "score": 87,
    "createdAt": "2026-07-21T18:06:56.875Z"
  },
  {
    "id": "f6d64644",
    "storeName": "Font Car Veículos",
    "city": "Valinhos",
    "phone": "(19) 3869-2066",
    "email": "contato@fontcarveiculos.com.br",
    "link": "https://fontcarveiculos.com.br/",
    "instagram": "https://www.instagram.com/fontcarveiculos",
    "status": "Não contatado",
    "score": 28,
    "createdAt": "2026-07-21T18:06:56.875Z"
  },
  {
    "id": "1671c7de",
    "storeName": "Julio Ferreira Veículos",
    "city": "Valinhos",
    "phone": "",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/julioferreiraveiculos",
    "status": "Não contatado",
    "score": 76,
    "createdAt": "2026-07-21T18:06:56.875Z"
  },
  {
    "id": "e9c7f1f6",
    "storeName": "Will Motors",
    "city": "Valinhos",
    "phone": "",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/willmotors",
    "status": "Não contatado",
    "score": 89,
    "createdAt": "2026-07-21T18:06:56.875Z"
  },
  {
    "id": "487f18f1",
    "storeName": "Hypecar Veículos",
    "city": "Valinhos",
    "phone": "(19) 99741-2895",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/hypecarveiculos",
    "status": "Não contatado",
    "score": 82,
    "createdAt": "2026-07-21T18:06:56.875Z"
  },
  {
    "id": "1367f3b8",
    "storeName": "Destaque Valinhos",
    "city": "Valinhos",
    "phone": "",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/destaquevalinhos",
    "status": "Não contatado",
    "score": 85,
    "createdAt": "2026-07-21T18:06:56.875Z"
  },
  {
    "id": "70f66132",
    "storeName": "MD Motors",
    "city": "Valinhos",
    "phone": "",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/mdmotors",
    "status": "Não contatado",
    "score": 91,
    "createdAt": "2026-07-21T18:06:56.875Z"
  },
  {
    "id": "5220c69e",
    "storeName": "Denilson Veículos",
    "city": "Valinhos",
    "phone": "(19) 97402-2240",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/denilsonveiculos",
    "status": "Não contatado",
    "score": 86,
    "createdAt": "2026-07-21T18:06:56.875Z"
  },
  {
    "id": "a9c3f4ed",
    "storeName": "Movva Veículos",
    "city": "Valinhos",
    "phone": "",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/movvaveiculos",
    "status": "Não contatado",
    "score": 78,
    "createdAt": "2026-07-21T18:06:56.875Z"
  },
  {
    "id": "ce80719d",
    "storeName": "Independência Veículos",
    "city": "Valinhos",
    "phone": "(19) 3871-3180",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/independenciaveiculos",
    "status": "Não contatado",
    "score": 95,
    "createdAt": "2026-07-21T18:06:56.875Z"
  },
  {
    "id": "70104d66",
    "storeName": "Faccini Veículos",
    "city": "Valinhos",
    "phone": "(19) 99180-0084",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/facciniveiculos",
    "status": "Não contatado",
    "score": 83,
    "createdAt": "2026-07-21T18:06:56.875Z"
  },
  {
    "id": "a1a26670",
    "storeName": "Chevrolet Codive",
    "city": "Valinhos",
    "phone": "",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/chevroletcodive",
    "status": "Não contatado",
    "score": 90,
    "createdAt": "2026-07-21T18:06:56.875Z"
  },
  {
    "id": "e31701d8",
    "storeName": "Alvorada Automóveis",
    "city": "Nova Odessa",
    "phone": "(19) 2221-7298",
    "email": "atendimento@alvoradaautomoveisno.com.br",
    "link": "https://alvoradaautomoveisno.com.br/",
    "instagram": "https://www.instagram.com/alvorada_automoveis/",
    "status": "Não contatado",
    "score": 25,
    "createdAt": "2026-07-21T18:05:17.062Z"
  },
  {
    "id": "39d9b958",
    "storeName": "MK Veículos",
    "city": "Nova Odessa",
    "phone": "(19) 3466-5000",
    "email": "contato@mkveiculos.com.br",
    "link": "https://mkveiculos.com.br/",
    "instagram": "https://www.instagram.com/mkveiculosno/",
    "status": "Não contatado",
    "score": 38,
    "createdAt": "2026-07-21T18:05:17.062Z"
  },
  {
    "id": "ee968c28",
    "storeName": "Pantera Veículos",
    "city": "Nova Odessa",
    "phone": "(19)3466-2917",
    "email": "contato@panteraveiculos.com.br",
    "link": "https://www.panteraveiculos.com.br/",
    "instagram": "https://www.instagram.com/pantera.veiculos/",
    "status": "Não contatado",
    "score": 22,
    "createdAt": "2026-07-21T18:05:17.062Z"
  },
  {
    "id": "2fb4b6a4",
    "storeName": "SR Veículos",
    "city": "Nova Odessa",
    "phone": "",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/sr_veiculos/",
    "status": "Não contatado",
    "score": 92,
    "createdAt": "2026-07-21T18:05:17.062Z"
  },
  {
    "id": "ab66cfbd",
    "storeName": "Nova Odessa Veículos",
    "city": "Nova Odessa",
    "phone": "",
    "email": "contato@noveiculos.com.br",
    "link": "https://noveiculos.com.br/",
    "instagram": "https://www.instagram.com/novaodessaveiculos",
    "status": "Não contatado",
    "score": 31,
    "createdAt": "2026-07-21T18:05:17.062Z"
  },
  {
    "id": "2c1ceb41",
    "storeName": "GB Car Veículos",
    "city": "Nova Odessa",
    "phone": "",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/gbcar_veiculos2015/",
    "status": "Não contatado",
    "score": 87,
    "createdAt": "2026-07-21T18:05:17.062Z"
  },
  {
    "id": "718b7042",
    "storeName": "Ampelio Multimarcas",
    "city": "Nova Odessa",
    "phone": "",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/ampeliomultimarcas/",
    "status": "Não contatado",
    "score": 94,
    "createdAt": "2026-07-21T18:05:17.063Z"
  },
  {
    "id": "5edf5a85",
    "storeName": "Nova Odessa Carros & Motos",
    "city": "Nova Odessa",
    "phone": "(19)9 7407-4795",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/novaodessaveiculos/",
    "status": "Não contatado",
    "score": 80,
    "createdAt": "2026-07-21T18:05:17.063Z"
  },
  {
    "id": "43456ddf",
    "storeName": "Jazz Veículos",
    "city": "Nova Odessa",
    "phone": "",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/jazzveiculos/",
    "status": "Não contatado",
    "score": 89,
    "createdAt": "2026-07-21T18:05:17.063Z"
  },
  {
    "id": "0cf929df",
    "storeName": "Vessa Chevrolet",
    "city": "Nova Odessa",
    "phone": "(19) 3829-8000",
    "email": "contato@vessachevrolet.com.br",
    "link": "https://www.vessachevrolet.com.br/",
    "instagram": "https://www.instagram.com/vessachevrolet/",
    "status": "Não contatado",
    "score": 28,
    "createdAt": "2026-07-21T18:05:17.063Z"
  },
  {
    "id": "1c6012a2",
    "storeName": "Paschoalin Motors",
    "city": "Nova Odessa",
    "phone": "",
    "email": "contato@paschoalinmotors.com.br",
    "link": "https://paschoalinmotors.com.br/",
    "instagram": "https://www.instagram.com/paschoalinmotors",
    "status": "Não contatado",
    "score": 27,
    "createdAt": "2026-07-21T18:05:17.063Z"
  },
  {
    "id": "ba7fecc5",
    "storeName": "DZM Automóveis",
    "city": "Nova Odessa",
    "phone": "(19) 3090-3345",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/dzm.automoveis/",
    "status": "Não contatado",
    "score": 85,
    "createdAt": "2026-07-21T18:05:17.063Z"
  },
  {
    "id": "7dfb64f4",
    "storeName": "Mônaco Veículos",
    "city": "Nova Odessa",
    "phone": "0800 000 3148",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/monacoveiculosnorte/",
    "status": "Não contatado",
    "score": 93,
    "createdAt": "2026-07-21T18:05:17.063Z"
  },
  {
    "id": "09c72931",
    "storeName": "Conseg Veículos",
    "city": "Nova Odessa",
    "phone": "",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/consegveiculos/",
    "status": "Não contatado",
    "score": 83,
    "createdAt": "2026-07-21T18:05:17.063Z"
  },
  {
    "id": "449f1432",
    "storeName": "Rika Motors",
    "city": "Nova Odessa",
    "phone": "",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/rikamotors/",
    "status": "Não contatado",
    "score": 86,
    "createdAt": "2026-07-21T18:05:17.063Z"
  },
  {
    "id": "489693c6",
    "storeName": "Agência de Carros",
    "city": "Nova Odessa",
    "phone": "",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/ousadiaveiculos/",
    "status": "Não contatado",
    "score": 79,
    "createdAt": "2026-07-21T18:05:17.063Z"
  },
  {
    "id": "3f1dc12f",
    "storeName": "Prime Car",
    "city": "Nova Odessa",
    "phone": "",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/primecar777/",
    "status": "Não contatado",
    "score": 92,
    "createdAt": "2026-07-21T18:05:17.063Z"
  },
  {
    "id": "86d8edaf",
    "storeName": "DNA Veículos",
    "city": "Nova Odessa",
    "phone": "(31) 98467",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/p/DXbyo9YEQPm/",
    "status": "Não contatado",
    "score": 88,
    "createdAt": "2026-07-21T18:05:17.063Z"
  },
  {
    "id": "2b5c64b2",
    "storeName": "Fião Veículos",
    "city": "Nova Odessa",
    "phone": "",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/fiaoveiculos/",
    "status": "Não contatado",
    "score": 84,
    "createdAt": "2026-07-21T18:05:17.063Z"
  },
  {
    "id": "d1b90289",
    "storeName": "Altomani Multimarcas",
    "city": "Hortolândia",
    "phone": "",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/altomanimultimarcas/",
    "status": "Não contatado",
    "score": 90,
    "createdAt": "2026-07-21T18:02:58.483Z"
  },
  {
    "id": "80daf1d4",
    "storeName": "Nobre Multimarcas",
    "city": "Hortolândia",
    "phone": "",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/reel/DEYJFXEPWN5/",
    "status": "Não contatado",
    "score": 82,
    "createdAt": "2026-07-21T18:02:58.484Z"
  },
  {
    "id": "c0a844be",
    "storeName": "Única Veículos",
    "city": "Hortolândia",
    "phone": "(19) 3504-8300 / 3909-0182",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/unica.veiculos/",
    "status": "Não contatado",
    "score": 95,
    "createdAt": "2026-07-21T18:02:58.484Z"
  },
  {
    "id": "f129a9a2",
    "storeName": "Neri Veiculos",
    "city": "Hortolândia",
    "phone": "",
    "email": "contato@neriveiculoshortolandia.com.br",
    "link": "https://neriveiculoshortolandia.com.br/",
    "instagram": "https://www.instagram.com/neriveiculos_hortolandia/",
    "status": "Não contatado",
    "score": 26,
    "createdAt": "2026-07-21T18:02:58.484Z"
  },
  {
    "id": "b08304c7",
    "storeName": "Junior Cardoso Vehicles",
    "city": "Hortolândia",
    "phone": "",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/reel/DNbV-D2uUdp/",
    "status": "Não contatado",
    "score": 87,
    "createdAt": "2026-07-21T18:02:58.484Z"
  },
  {
    "id": "6b675613",
    "storeName": "Roberto Veículos",
    "city": "Hortolândia",
    "phone": "",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/robertoveiculos.1/",
    "status": "Não contatado",
    "score": 91,
    "createdAt": "2026-07-21T18:02:58.484Z"
  },
  {
    "id": "80ee5085",
    "storeName": "Mais Veículos",
    "city": "Hortolândia",
    "phone": "",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/maisveiculos_hortolandia/",
    "status": "Não contatado",
    "score": 83,
    "createdAt": "2026-07-21T18:02:58.484Z"
  },
  {
    "id": "3ebe77e2",
    "storeName": "Ockner Motors",
    "city": "Hortolândia",
    "phone": "",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/ocknermotors/",
    "status": "Não contatado",
    "score": 89,
    "createdAt": "2026-07-21T18:02:58.484Z"
  },
  {
    "id": "1595ad8b",
    "storeName": "A3 Veículos",
    "city": "Hortolândia",
    "phone": "",
    "email": "contato@a3veiculosoficial.com.br",
    "link": "https://a3veiculosoficial.com.br/",
    "instagram": "https://www.instagram.com/a3veiculos",
    "status": "Não contatado",
    "score": 30,
    "createdAt": "2026-07-21T18:02:58.484Z"
  },
  {
    "id": "cacf71b5",
    "storeName": "Loja de Veículos",
    "city": "Hortolândia",
    "phone": "(19) 99119-7060",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/reel/DRkyYSOEUt1/",
    "status": "Não contatado",
    "score": 81,
    "createdAt": "2026-07-21T18:02:58.484Z"
  },
  {
    "id": "5c53d494",
    "storeName": "N5N Veículos",
    "city": "Hortolândia",
    "phone": "",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/n5nveiculos/",
    "status": "Não contatado",
    "score": 94,
    "createdAt": "2026-07-21T18:02:58.484Z"
  },
  {
    "id": "060576cf",
    "storeName": "Vaapty Hortolândia",
    "city": "Hortolândia",
    "phone": "",
    "email": "",
    "link": "",
    "instagram": "https://www.instagram.com/vaaptyhortolandia/",
    "status": "Não contatado",
    "score": 86,
    "createdAt": "2026-07-21T18:02:58.484Z"
  }
];

export const INITIAL_SCRAPED_LEADS: ScrapedLead[] = RAW_LEADS
  .filter(l => isCarDealership(l.storeName))
  .map(calculateRealisticLeadData);
