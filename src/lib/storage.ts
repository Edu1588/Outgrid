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
  createdAt: string;
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

export function getScrapedLeads(): ScrapedLead[] {
  try {
    const leadsStr = localStorage.getItem('outgrid_scraped_leads');
    if (leadsStr) {
      const parsed = JSON.parse(leadsStr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const validWithWebsite = parsed.filter(l => l.link && l.link.trim() !== '' && l.link.startsWith('http') && !l.link.includes('instagram.com') && !l.link.includes('facebook.com'));
        if (validWithWebsite.length > 0) {
          // Sync filtered array back to localStorage
          localStorage.setItem('outgrid_scraped_leads', JSON.stringify(validWithWebsite));
          return validWithWebsite;
        }
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
