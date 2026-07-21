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
