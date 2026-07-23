import { supabase } from './supabase';
import { INITIAL_SCRAPED_LEADS } from './initialScrapedLeads';

export interface Lead {
  id: string;
  name: string;
  whatsapp: string;
  store: string;
  volume: string;
  challenge?: string;
  source: string;
  createdAt: string;
}

export interface PageView {
  id: string;
  path: string;
  timestamp: string;
}

export interface ScrapedLead {
  id: string;
  storeName: string;
  city: string;
  email: string;
  phone: string;
  score: number;
  status: 'Não contatado' | 'Em contato' | 'Reunião agendada' | 'Fechado' | 'Perdido';
  link?: string;
  instagram?: string;
  followers?: number;
  createdAt: string;
}

export async function saveLeadAsync(leadData: Omit<Lead, 'id' | 'createdAt'>) {
  try {
    if (supabase) {
      const newLead = {
        ...leadData,
        id: Math.random().toString(36).substring(2, 9),
        created_at: new Date().toISOString()
      };
      await supabase.from('leads').insert([newLead]);
    }
  } catch (e) {
    console.error('Supabase insert failed', e);
  }
  return saveLead(leadData);
}

export function saveLead(leadData: Omit<Lead, 'id' | 'createdAt'>) {
  try {
    const currentLeadsStr = localStorage.getItem('outgrid_leads');
    const currentLeads: Lead[] = currentLeadsStr ? JSON.parse(currentLeadsStr) : [];
    
    const newLead: Lead = {
      ...leadData,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString()
    };
    
    currentLeads.push(newLead);
    localStorage.setItem('outgrid_leads', JSON.stringify(currentLeads));
    return newLead;
  } catch (e) {
    console.error('Failed to save lead locally:', e);
  }
}

export async function getLeadsAsync(): Promise<Lead[]> {
  try {
    if (supabase) {
      const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map(d => ({
          ...d,
          createdAt: d.created_at
        }));
      }
    }
  } catch (e) {
    console.error('Supabase fetch failed, falling back to local storage', e);
  }
  return getLeads();
}

export function getLeads(): Lead[] {
  try {
    const currentLeadsStr = localStorage.getItem('outgrid_leads');
    return currentLeadsStr ? JSON.parse(currentLeadsStr) : [];
  } catch (e) {
    console.error('Failed to get leads:', e);
    return [];
  }
}

export function trackPageView(path: string) {
  try {
    const currentViewsStr = localStorage.getItem('outgrid_page_views');
    const currentViews: PageView[] = currentViewsStr ? JSON.parse(currentViewsStr) : [];
    
    currentViews.push({
      id: Math.random().toString(36).substring(2, 9),
      path,
      timestamp: new Date().toISOString()
    });
    
    localStorage.setItem('outgrid_page_views', JSON.stringify(currentViews));

    // Also send to backend
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path })
    }).catch(e => console.error("Failed to sync analytics", e));
  } catch (e) {
    console.error('Failed to track page view:', e);
  }
}

export function getPageViews(): PageView[] {
  try {
    const currentViewsStr = localStorage.getItem('outgrid_page_views');
    return currentViewsStr ? JSON.parse(currentViewsStr) : [];
  } catch (e) {
    console.error('Failed to get page views:', e);
    return [];
  }
}

export async function getScrapedLeadsAsync(): Promise<ScrapedLead[]> {
  try {
    if (supabase) {
      const { data, error } = await supabase.from('scraped_leads').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map(d => ({
          ...d,
          storeName: d.store_name,
          createdAt: d.created_at
        }));
      }
    }
  } catch (e) {
    console.error('Supabase fetch failed, falling back to local storage', e);
  }
  return getScrapedLeads();
}

export function getScrapedLeads(): ScrapedLead[] {
  try {
    const DATA_VERSION = 'v2.6_no_ux_popup_and_verified_followers';
    const currentVersion = localStorage.getItem('outgrid_leads_version');
    if (currentVersion !== DATA_VERSION) {
      localStorage.removeItem('outgrid_scraped_leads');
      localStorage.setItem('outgrid_leads_version', DATA_VERSION);
      return INITIAL_SCRAPED_LEADS;
    }

    const leadsStr = localStorage.getItem('outgrid_scraped_leads');
    if (leadsStr) {
      const parsed = JSON.parse(leadsStr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Invalidate cache if no followers exist to force recalculation
        if (!parsed[0].hasOwnProperty('followers')) { localStorage.removeItem('outgrid_scraped_leads'); return INITIAL_SCRAPED_LEADS; }
        
        // Invalidate if Forza Motors still has the wrong instagram link (to apply fix for all users)
        const forza = parsed.find(l => l.storeName === 'Forza Motors');
        if (forza && forza.instagram === 'https://www.instagram.com/forzamotors') {
          localStorage.removeItem('outgrid_scraped_leads');
          return INITIAL_SCRAPED_LEADS;
        }

        // Invalidate if GB Car Veículos has the old incorrect follower count or empty link
        const gbCar = parsed.find(l => l.storeName === 'GB Car Veículos');
        if (gbCar && (gbCar.followers === 9721 || !gbCar.link)) {
          localStorage.removeItem('outgrid_scraped_leads');
          return INITIAL_SCRAPED_LEADS;
        }

        // Invalidate if Altomani Multimarcas has the old incorrect follower count or empty link
        const altomani = parsed.find(l => l.storeName === 'Altomani Multimarcas');
        if (altomani && (altomani.followers === 4149 || !altomani.link)) {
          localStorage.removeItem('outgrid_scraped_leads');
          return INITIAL_SCRAPED_LEADS;
        }

        // Invalidate if Alpha Veículos has an empty link to load all newly found websites
        const alpha = parsed.find(l => l.storeName === 'Alpha Veículos');
        if (alpha && !alpha.link) {
          localStorage.removeItem('outgrid_scraped_leads');
          return INITIAL_SCRAPED_LEADS;
        }

        // Invalidate if Roberto Veículos or Mais Veículos have empty links
        const roberto = parsed.find(l => l.storeName === 'Roberto Veículos');
        if (roberto && !roberto.link) {
          localStorage.removeItem('outgrid_scraped_leads');
          return INITIAL_SCRAPED_LEADS;
        }

        // Invalidate if SR Veículos has an empty link to load new website
        const srVeiculos = parsed.find(l => l.storeName === 'SR Veículos');
        if (srVeiculos && !srVeiculos.link) {
          localStorage.removeItem('outgrid_scraped_leads');
          return INITIAL_SCRAPED_LEADS;
        }

        // Invalidate if Nobre Multimarcas is present but has no instagram link (to apply fix for all users)
        const nobre = parsed.find(l => l.storeName === 'Nobre Multimarcas');
        if (nobre && !nobre.instagram) {
          localStorage.removeItem('outgrid_scraped_leads');
          return INITIAL_SCRAPED_LEADS;
        }

        // Invalidate if Jazz Veículos has wrong follower count or no website link
        const jazz = parsed.find(l => l.storeName === 'Jazz Veículos');
        if (jazz && (jazz.followers === 9177 || !jazz.link)) {
          localStorage.removeItem('outgrid_scraped_leads');
          return INITIAL_SCRAPED_LEADS;
        }

        // Invalidate if Fião Veículos has wrong follower count
        const fiao = parsed.find(l => l.storeName === 'Fião Veículos');
        if (fiao && fiao.followers === 10843) {
          localStorage.removeItem('outgrid_scraped_leads');
          return INITIAL_SCRAPED_LEADS;
        }

        // Invalidate if Junior Cardoso Vehicles has no link
        const junior = parsed.find(l => l.storeName === 'Junior Cardoso Vehicles');
        if (junior && !junior.link) {
          localStorage.removeItem('outgrid_scraped_leads');
          return INITIAL_SCRAPED_LEADS;
        }

        // Invalidate if any lead has an empty phone to force phone/email generation for all users
        const hasEmptyPhone = parsed.some(l => !l.phone);
        if (hasEmptyPhone) {
          localStorage.removeItem('outgrid_scraped_leads');
          return INITIAL_SCRAPED_LEADS;
        }
        
        return parsed.filter((l: any) => {
          const hasWebsite = Boolean(l.link && l.link.trim() !== '' && l.link.startsWith('http') && !l.link.includes('instagram.com') && !l.link.includes('facebook.com') && !l.link.includes('carrosp.com.br') && !l.link.includes('olx.com.br') && !l.link.includes('webmotors.com.br'));
          const hasInstagram = Boolean(l.instagram && l.instagram.trim() !== "");
          return hasWebsite || hasInstagram;
        });
      }
    }
    // Initialize localStorage with initial dataset
    localStorage.setItem('outgrid_scraped_leads', JSON.stringify(INITIAL_SCRAPED_LEADS));
    return INITIAL_SCRAPED_LEADS;
  } catch (e) {
    console.error('Failed to get scraped leads:', e);
    return INITIAL_SCRAPED_LEADS;
  }
}

export async function saveScrapedLeadAsync(leadData: Omit<ScrapedLead, 'id' | 'createdAt'>) {
  try {
    if (supabase) {
      const newLead = {
        ...leadData,
        id: Math.random().toString(36).substring(2, 9),
        created_at: new Date().toISOString(),
        store_name: leadData.storeName
      };
      await supabase.from('scraped_leads').insert([newLead]);
    }
  } catch (e) {
    console.error('Supabase insert failed', e);
  }
  return saveScrapedLead(leadData);
}

export function saveScrapedLead(leadData: Omit<ScrapedLead, 'id' | 'createdAt'>) {
  try {
    const currentLeads = getScrapedLeads();
    const newLead: ScrapedLead = {
      ...leadData,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString()
    };
    currentLeads.push(newLead);
    localStorage.setItem('outgrid_scraped_leads', JSON.stringify(currentLeads));
    return newLead;
  } catch (e) {
    console.error('Failed to save scraped lead:', e);
  }
}

export async function updateScrapedLeadStatusAsync(id: string, status: ScrapedLead['status']) {
  try {
    if (supabase) {
      await supabase.from('scraped_leads').update({ status }).eq('id', id);
    }
  } catch (e) {
    console.error('Supabase update failed', e);
  }
  updateScrapedLeadStatus(id, status);
}

export function updateScrapedLeadStatus(id: string, status: ScrapedLead['status']) {
  try {
    const currentLeads = getScrapedLeads();
    const leadIndex = currentLeads.findIndex(l => l.id === id);
    if (leadIndex >= 0) {
      currentLeads[leadIndex].status = status;
      localStorage.setItem('outgrid_scraped_leads', JSON.stringify(currentLeads));
    }
  } catch (e) {
    console.error('Failed to update scraped lead status:', e);
  }
}
