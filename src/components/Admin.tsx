import { useState, useEffect } from "react";
import { getLeads, getLeadsAsync, getPageViews, getScrapedLeads, getScrapedLeadsAsync, saveScrapedLead, updateScrapedLeadStatus, updateScrapedLeadStatusAsync, Lead, PageView, ScrapedLead } from "../lib/storage";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Search, Filter, Loader2, Database, LayoutDashboard, Users, UserPlus, RefreshCw, LogOut, ChevronDown, CheckCircle2, Phone, Mail, MapPin, Building2, TrendingUp, TrendingDown, Bell, Settings, Globe, ExternalLink, Sun, Moon, Languages, Sliders, Check, X, BellRing, CheckCheck, Trash2, Sparkles, AlertTriangle, Activity, Timer, Download, Edit2, Ban, MessageCircle, Calendar, Briefcase, FileText, Presentation, Folder, CalendarDays, Archive, PieChart as LucidePieChart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UXAuditHoverCard } from './UXAuditHoverCard';

const translations = {
  pt: {
    overview: 'Overview',
    inboundLeads: 'Leads Inbound',
    outboundProspects: 'Prospecção Ativa',
    logout: 'Sair',
    totalViews: 'Acessos Totais',
    conversionRate: 'Taxa de Conversão',
    trafficTitle: 'Tráfego no Site (Últimos dias)',
    leadsTitle: 'Leads Gerados (Inbound)',
    searchPlaceholder: 'Buscar por loja, cidade, fone, e-mail...',
    settingsTitle: 'Configurações do Painel',
    notificationsTitle: 'Notificações',
    themeLabel: 'Aparência e Tema',
    darkTheme: 'Modo Escuro',
    lightTheme: 'Modo Claro',
    languageLabel: 'Idioma do Painel',
    autoScraperLabel: 'Robô de Prospecção',
    freq6h: 'Automático (6h)',
    freq24h: 'Diário (24h)',
    freqManual: 'Apenas Manual',
    saveSettings: 'Salvar Preferências',
    clearNotifications: 'Limpar Notificações',
    markAllRead: 'Marcar como lidas',
    noNotifications: 'Nenhuma notificação no momento',
    apiStatus: 'Serper API: Conectada & Operacional',
    savedToast: 'Configurações salvas com sucesso!'
  },
  en: {
    overview: 'Overview',
    inboundLeads: 'Inbound Leads',
    outboundProspects: 'Active Prospecting',
    logout: 'Log Out',
    totalViews: 'Total Views',
    conversionRate: 'Conversion Rate',
    trafficTitle: 'Site Traffic (Recent Days)',
    leadsTitle: 'Leads Generated (Inbound)',
    searchPlaceholder: 'Search by store, city, phone, email...',
    settingsTitle: 'Dashboard Settings',
    notificationsTitle: 'Notifications',
    themeLabel: 'Appearance & Theme',
    darkTheme: 'Dark Mode',
    lightTheme: 'Light Mode',
    languageLabel: 'Dashboard Language',
    autoScraperLabel: 'Prospecting Bot',
    freq6h: 'Automatic (6h)',
    freq24h: 'Daily (24h)',
    freqManual: 'Manual Only',
    saveSettings: 'Save Preferences',
    clearNotifications: 'Clear Notifications',
    markAllRead: 'Mark as read',
    noNotifications: 'No notifications at this time',
    apiStatus: 'Serper API: Connected & Operational',
    savedToast: 'Settings saved successfully!'
  },
  es: {
    overview: 'Visión General',
    inboundLeads: 'Leads Inbound',
    outboundProspects: 'Prospección Activa',
    logout: 'Cerrar Sesión',
    totalViews: 'Visitas Totales',
    conversionRate: 'Tasa de Conversión',
    trafficTitle: 'Tráfico del Sitio (Días recientes)',
    leadsTitle: 'Leads Generados (Inbound)',
    searchPlaceholder: 'Buscar por tienda, ciudad, teléfono, email...',
    settingsTitle: 'Configuraciones del Panel',
    notificationsTitle: 'Notificaciones',
    themeLabel: 'Apariencia y Tema',
    darkTheme: 'Modo Oscuro',
    lightTheme: 'Modo Claro',
    languageLabel: 'Idioma del Panel',
    autoScraperLabel: 'Robot de Prospección',
    freq6h: 'Automático (6h)',
    freq24h: 'Diario (24h)',
    freqManual: 'Solo Manual',
    saveSettings: 'Guardar Preferencias',
    clearNotifications: 'Limpiar Notificaciones',
    markAllRead: 'Marcar como leídas',
    noNotifications: 'Sin notificaciones por el momento',
    apiStatus: 'Serper API: Conectada y Operativa',
    savedToast: '¡Configuraciones guardadas con éxito!'
  }
};

export function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "leads" | "prospects" | "apresentacoes" | "captacao" | "estrategia" | "repos">("dashboard");
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month" | "year">("all");
  const [dashboardTab, setDashboardTab] = useState<'overview' | 'pages' | 'leads'>('overview');
  const [selectedPageForTraffic, setSelectedPageForTraffic] = useState<string>("all");
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const EXCLUDED_NAMES = ["unimais", "meta veiculos", "meta veículos", "azul veiculos", "azul veículos", "unimais veiculos", "unimais veículos"];
  const isExcluded = (name: string) => {
    const lower = (name || "").toLowerCase();
    return EXCLUDED_NAMES.some(ex => lower.includes(ex));
  };

  const hasWebsite = (l: ScrapedLead) => Boolean(l.link && l.link.trim() !== '' && l.link.startsWith('http') && !l.link.includes('instagram.com') && !l.link.includes('facebook.com'));

  const [scrapedLeads, setScrapedLeads] = useState<ScrapedLead[]>([]);
  
  const [isScraping, setIsScraping] = useState(false);

  // CRM Prospecção Filter & Sort state
  const [prospectSearch, setProspectSearch] = useState("");
  const [prospectStatusFilter, setProspectStatusFilter] = useState("Todos");
  const [prospectCityFilter, setProspectCityFilter] = useState("Todas");
  const [prospectSort, setProspectSort] = useState<'score-desc' | 'score-asc' | 'date-desc' | 'date-asc' | 'name-asc'>('score-desc');
  const [prospectOnlyOpportunities, setProspectOnlyOpportunities] = useState(false);

  // Settings & Theme & Notifications state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => (localStorage.getItem('outgrid_admin_theme') as 'dark' | 'light') || 'dark');
  const [language, setLanguage] = useState<'pt' | 'en' | 'es'>(() => (localStorage.getItem('outgrid_admin_lang') as 'pt' | 'en' | 'es') || 'pt');
  const [autoScraperFreq, setAutoScraperFreq] = useState<string>(() => localStorage.getItem('outgrid_admin_scraper_freq') || '6h');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Varredura Concluída',
      desc: '10 novas lojas identificadas na região de Paulínia e Campinas.',
      time: 'Há 5 min',
      unread: true,
      type: 'scraper'
    },
    {
      id: '2',
      title: 'Contatos Capturados',
      desc: 'Telefones, E-mails e Instagrams atualizados via inteligência.',
      time: 'Há 25 min',
      unread: true,
      type: 'lead'
    },
    {
      id: '3',
      title: 'Serper API Ativa',
      desc: 'Serviço de busca conectado e funcional.',
      time: 'Há 1 hora',
      unread: false,
      type: 'system'
    }
  ]);

  const t = translations[language] || translations.pt;
  const unreadNotificationsCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    localStorage.setItem('outgrid_admin_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('outgrid_admin_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('outgrid_admin_scraper_freq', autoScraperFreq);
  }, [autoScraperFreq]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchScrapedLeads = async () => {
    try {
      const response = await fetch('/api/leads/scraped');
      if (response.ok) {
        const data: ScrapedLead[] = await response.json();
        const filtered = data.filter(l => !isExcluded(l.storeName));
        if (filtered.length > 0) {
          setScrapedLeads(filtered);
          localStorage.setItem('outgrid_scraped_leads', JSON.stringify(filtered));
        } else {
          // If backend returns empty, use local fallback
          const local = getScrapedLeads().filter(l => !isExcluded(l.storeName));
          setScrapedLeads(local);
        }
      } else {
        const local = getScrapedLeads().filter(l => !isExcluded(l.storeName));
        setScrapedLeads(local);
      }
    } catch (e) {
      console.error('Error fetching scraped leads', e);
      const local = getScrapedLeads().filter(l => !isExcluded(l.storeName));
      setScrapedLeads(local);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      getLeadsAsync().then(setLeads);
      fetch('/api/analytics')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setPageViews(data);
        })
        .catch(e => {
          console.error("Failed to fetch analytics:", e);
          setPageViews(getPageViews());
        });
      fetchScrapedLeads();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "654321") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Senha incorreta");
    }
  };

  const simulateScraping = async () => {
    setIsScraping(true);
    
    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        throw new Error('Falha ao raspar dados. Verifique a chave da API Serper.');
      }

      const data = await response.json();
      
      if (data.leads && data.leads.length > 0) {
        // Backend now handles saving to the DB. Just re-fetch
        fetchScrapedLeads();
        alert(`${data.leads.length} leads prospectados com sucesso!`);
      } else {
        alert('Nenhuma concessionária encontrada.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao realizar a raspagem. A API KEY do Serper pode estar faltando no .env');
    }

    setIsScraping(false);
  };

  const handleStatusChange = async (id: string, status: ScrapedLead['status']) => {
    // Optimistic UI update
    setScrapedLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    try {
      await fetch(`/api/leads/scraped/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (e) {
      console.error('Failed to update status', e);
      fetchScrapedLeads(); // revert on fail
    }
  };

  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    phone: string;
    email: string;
    link: string;
    instagram: string;
    followers: string;
  }>({
    phone: '',
    email: '',
    link: '',
    instagram: '',
    followers: ''
  });

  const handleStartEdit = (lead: ScrapedLead) => {
    setEditingLeadId(lead.id);
    setEditForm({
      phone: lead.phone || '',
      email: lead.email || '',
      link: lead.link || '',
      instagram: lead.instagram || '',
      followers: lead.followers !== undefined && lead.followers !== null ? String(lead.followers) : ''
    });
  };

  const handleSaveEdit = async (id: string) => {
    const updatedFollowers = editForm.followers.trim() === '' ? null : parseInt(editForm.followers, 10);
    const payload = {
      phone: editForm.phone,
      email: editForm.email,
      link: editForm.link,
      instagram: editForm.instagram,
      followers: isNaN(updatedFollowers as any) ? null : updatedFollowers
    };

    // Optimistic UI update
    setScrapedLeads(prev => prev.map(l => l.id === id ? { ...l, ...payload, followers: payload.followers as any } : l));
    setEditingLeadId(null);

    try {
      const res = await fetch(`/api/leads/scraped/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        // Update local storage
        const currentLocal = JSON.parse(localStorage.getItem('outgrid_scraped_leads') || '[]');
        const updatedLocal = currentLocal.map((l: any) => l.id === id ? { ...l, ...payload, followers: payload.followers } : l);
        localStorage.setItem('outgrid_scraped_leads', JSON.stringify(updatedLocal));
        showToast('Dados do lead atualizados com sucesso!');
      } else {
        showToast('Falha ao salvar alterações no servidor.');
        fetchScrapedLeads(); // revert
      }
    } catch (e) {
      console.error(e);
      showToast('Erro de rede ao salvar alterações.');
      fetchScrapedLeads(); // revert
    }
  };

  // Prepare Analytics Data
  const now = new Date();
  const filteredViews = pageViews.filter(view => {
    const d = new Date(view.timestamp);
    if (dateFilter === 'today') return d.toDateString() === now.toDateString();
    if (dateFilter === 'week') return now.getTime() - d.getTime() <= 7 * 24 * 60 * 60 * 1000;
    if (dateFilter === 'month') return now.getTime() - d.getTime() <= 30 * 24 * 60 * 60 * 1000;
    if (dateFilter === 'year') return now.getTime() - d.getTime() <= 365 * 24 * 60 * 60 * 1000;
    return true;
  });
  
  const filteredLeads = leads.filter(lead => {
    const d = new Date(lead.createdAt);
    if (dateFilter === 'today') return d.toDateString() === now.toDateString();
    if (dateFilter === 'week') return now.getTime() - d.getTime() <= 7 * 24 * 60 * 60 * 1000;
    if (dateFilter === 'month') return now.getTime() - d.getTime() <= 30 * 24 * 60 * 60 * 1000;
    if (dateFilter === 'year') return now.getTime() - d.getTime() <= 365 * 24 * 60 * 60 * 1000;
    return true;
  });

  const viewsByDay = filteredViews.reduce((acc, view) => {
    const date = new Date(view.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    let pathName = view.path === '/' ? 'Home' : view.path.replace('/', '');
    pathName = pathName.split('#')[0] || pathName.replace('#', 'Home Section: ');
    pathName = pathName.replace(/-/g, ' ');
    pathName = pathName.charAt(0).toUpperCase() + pathName.slice(1);

    if (!acc[date]) {
      acc[date] = { name: date, total: 0 };
    }
    acc[date].total++;
    
    if (!acc[date][pathName]) acc[date][pathName] = 0;
    acc[date][pathName]++;
    
    return acc;
  }, {} as Record<string, any>);
  
  const chartData = Object.values(viewsByDay).slice(-14); // Last 14 days

  const leadsByDay = filteredLeads.reduce((acc, lead) => {
    const date = new Date(lead.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    if (!acc[date]) acc[date] = { name: date, leads: 0 };
    acc[date].leads++;
    return acc;
  }, {} as Record<string, any>);
  
  const leadsChartData = Object.values(leadsByDay).slice(-14);

  // Data for Pie Chart & Bar Chart
  const pageDistributionMap = filteredViews.reduce((acc, view) => {
    let pathName = view.path === '/' ? 'Home' : view.path.replace('/', '');
    pathName = pathName.split('#')[0] || pathName.replace('#', 'Home Section: ');
    pathName = pathName.replace(/-/g, ' ');
    pathName = pathName.charAt(0).toUpperCase() + pathName.slice(1);
    if (!acc[pathName]) acc[pathName] = 0;
    acc[pathName]++;
    return acc;
  }, {} as Record<string, number>);
  
  const COLORS = ['#e11d48', '#0ea5e9', '#8b5cf6', '#f59e0b', '#10b981'];
  const pieData = Object.entries(pageDistributionMap)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length]
    }));

  // Heatmap Data (Days of Week vs Hours)
  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const hours = [0, 3, 6, 9, 12, 15, 18, 21];
  const heatmapMap: Record<string, number> = {};
  daysOfWeek.forEach(d => {
    hours.forEach(h => heatmapMap[`${d}-${h}`] = 0);
  });
  
  filteredViews.forEach(view => {
    const d = new Date(view.timestamp);
    const dayStr = daysOfWeek[d.getDay()];
    const hr = d.getHours();
    let bucket = 0;
    for (let i=0; i<hours.length; i++) {
      if (hr >= hours[i]) bucket = hours[i];
    }
    heatmapMap[`${dayStr}-${bucket}`]++;
  });
  
  const maxHeat = Math.max(1, ...Object.values(heatmapMap));
  const getHeatColor = (val: number) => {
    if (val === 0) return theme === 'light' ? '#f1f5f9' : '#1e1b4b';
    const ratio = val / maxHeat;
    if (ratio < 0.2) return theme === 'light' ? '#d8b4fe' : '#3730a3';
    if (ratio < 0.5) return theme === 'light' ? '#c084fc' : '#4338ca';
    if (ratio < 0.8) return theme === 'light' ? '#a855f7' : '#4f46e5';
    return theme === 'light' ? '#9333ea' : '#6366f1';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6 bg-[url('https://res.cloudinary.com/ifuatk2z/image/upload/v1784652418/HERO_OUTGRID_suvjmq.png')] bg-cover bg-center bg-no-repeat bg-blend-overlay relative">
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-0"></div>
        <form onSubmit={handleLogin} className="bg-[#111111]/80 backdrop-blur-md border border-white/5 p-10 rounded-3xl w-full max-w-md shadow-2xl relative z-10">
          <div className="flex justify-center mb-8">
            <h1 className="text-3xl font-black text-white tracking-tighter">OUT<span className="text-orange-primary bg-orange-primary/10 px-2 py-1 rounded">GRID</span> <span className="text-sm font-medium text-gray-500 ml-2 tracking-normal">ADMIN</span></h1>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Senha de Acesso</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#050505] border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-orange-primary focus:ring-1 focus:ring-orange-primary transition-all placeholder:text-gray-600"
              placeholder="••••••"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-6 font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>}
          <button type="submit" className="w-full bg-orange-primary text-white font-bold py-4 rounded-xl hover:bg-[#FF7043] transition-all hover:shadow-[0_0_20px_rgba(255,107,0,0.3)] hover:-translate-y-0.5 uppercase tracking-wider text-sm">
            Acessar Painel
          </button>
        </form>
      </div>
    );
  }

  
  const renderDashboard = () => {
    const todayViews = pageViews.filter(v => new Date(v.timestamp).toDateString() === now.toDateString()).length;
    const monthViews = pageViews.filter(v => now.getTime() - new Date(v.timestamp).getTime() <= 30 * 24 * 60 * 60 * 1000).length;
    const yearViews = pageViews.filter(v => now.getTime() - new Date(v.timestamp).getTime() <= 365 * 24 * 60 * 60 * 1000).length;

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex gap-2">
          <button 
            onClick={() => setDashboardTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${dashboardTab === 'overview' ? 'bg-white/5 border border-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <Activity className="w-4 h-4" /> Visão Geral
          </button>
          <button 
            onClick={() => setDashboardTab('pages')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${dashboardTab === 'pages' ? 'bg-white/5 border border-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <Globe className="w-4 h-4" /> Páginas
          </button>
          <button 
            onClick={() => setDashboardTab('leads')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${dashboardTab === 'leads' ? 'bg-white/5 border border-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <Users className="w-4 h-4" /> Leads
          </button>
        </div>

        {dashboardTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className={`border rounded-xl p-4 ${theme === 'light' ? 'bg-white border-slate-200/80 shadow-sm' : 'bg-[#111] border-white/5'}`}>
                <p className="text-xs font-bold text-blue-500 flex items-center gap-2 mb-2"><Activity className="w-3.5 h-3.5" /> HOJE</p>
                <h3 className={`text-3xl font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{todayViews}</h3>
                <p className="text-xs text-gray-500 mt-1">acessos</p>
              </div>
              <div className={`border rounded-xl p-4 ${theme === 'light' ? 'bg-white border-slate-200/80 shadow-sm' : 'bg-[#111] border-white/5'}`}>
                <p className="text-xs font-bold text-purple-500 flex items-center gap-2 mb-2"><Calendar className="w-3.5 h-3.5" /> ESTE MÊS</p>
                <h3 className={`text-3xl font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{monthViews}</h3>
                <p className="text-xs text-gray-500 mt-1">acessos</p>
              </div>
              <div className={`border rounded-xl p-4 ${theme === 'light' ? 'bg-white border-slate-200/80 shadow-sm' : 'bg-[#111] border-white/5'}`}>
                <p className="text-xs font-bold text-orange-500 flex items-center gap-2 mb-2"><TrendingUp className="w-3.5 h-3.5" /> ESTE ANO</p>
                <h3 className={`text-3xl font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{yearViews}</h3>
                <p className="text-xs text-gray-500 mt-1">acessos</p>
              </div>
              <div className={`border rounded-xl p-4 ${theme === 'light' ? 'bg-white border-slate-200/80 shadow-sm' : 'bg-[#111] border-white/5'}`}>
                <p className="text-xs font-bold text-green-500 flex items-center gap-2 mb-2"><Users className="w-3.5 h-3.5" /> LEADS</p>
                <h3 className={`text-3xl font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{leads.length}</h3>
                <p className="text-xs text-gray-500 mt-1">contatos</p>
              </div>
              <div className={`border rounded-xl p-4 ${theme === 'light' ? 'bg-white border-slate-200/80 shadow-sm' : 'bg-[#111] border-white/5'}`}>
                <p className="text-xs font-bold text-red-500 flex items-center gap-2 mb-2"><Timer className="w-3.5 h-3.5" /> TEMPO MÉDIO</p>
                <h3 className={`text-3xl font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>1m 20s</h3>
                <p className="text-xs text-gray-500 mt-1">por sessão</p>
              </div>
            </div>

            {/* Existing Dashboard below but wrapped */}
<div className="flex justify-between items-center mb-4">
        <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Visão Geral</h2>
        <div className="flex gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
          <button onClick={() => setDateFilter('today')} className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${dateFilter === 'today' ? 'bg-orange-primary text-black-main' : 'text-gray-400 hover:text-white'}`}>Hoje</button>
          <button onClick={() => setDateFilter('week')} className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${dateFilter === 'week' ? 'bg-orange-primary text-black-main' : 'text-gray-400 hover:text-white'}`}>7 Dias</button>
          <button onClick={() => setDateFilter('month')} className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${dateFilter === 'month' ? 'bg-orange-primary text-black-main' : 'text-gray-400 hover:text-white'}`}>30 Dias</button>
          <button onClick={() => setDateFilter('year')} className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${dateFilter === 'year' ? 'bg-orange-primary text-black-main' : 'text-gray-400 hover:text-white'}`}>1 Ano</button>
          <button onClick={() => setDateFilter('all')} className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${dateFilter === 'all' ? 'bg-orange-primary text-black-main' : 'text-gray-400 hover:text-white'}`}>Tudo</button>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`border rounded-2xl p-6 relative overflow-hidden group transition-colors ${
          theme === 'light' ? 'bg-white border-slate-200/80 shadow-sm hover:border-orange-primary/50' : 'bg-[#111] border-white/5 hover:border-orange-primary/50'
        }`}>
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <LayoutDashboard className="w-16 h-16 text-orange-primary" />
          </div>
          <p className={`text-sm font-medium mb-1 ${theme === 'light' ? 'text-slate-500' : 'text-gray-400'}`}>Acessos Totais</p>
          <h3 className={`text-4xl font-bold mb-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{filteredViews.length}</h3>
          <p className="text-xs text-green-500 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +12% esta semana</p>
        </div>
        <div className={`border rounded-2xl p-6 relative overflow-hidden group transition-colors ${
          theme === 'light' ? 'bg-white border-slate-200/80 shadow-sm hover:border-orange-primary/50' : 'bg-[#111] border-white/5 hover:border-orange-primary/50'
        }`}>
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-16 h-16 text-orange-primary" />
          </div>
          <p className={`text-sm font-medium mb-1 ${theme === 'light' ? 'text-slate-500' : 'text-gray-400'}`}>Leads Inbound</p>
          <h3 className={`text-4xl font-bold mb-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{filteredLeads.length}</h3>
          <p className="text-xs text-green-500 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +3% esta semana</p>
        </div>
        <div className={`border rounded-2xl p-6 relative overflow-hidden group transition-colors ${
          theme === 'light' ? 'bg-white border-slate-200/80 shadow-sm hover:border-orange-primary/50' : 'bg-[#111] border-white/5 hover:border-orange-primary/50'
        }`}>
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Database className="w-16 h-16 text-orange-primary" />
          </div>
          <p className={`text-sm font-medium mb-1 ${theme === 'light' ? 'text-slate-500' : 'text-gray-400'}`}>Leads Outbound (Scraped)</p>
          <h3 className={`text-4xl font-bold mb-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{scrapedLeads.length}</h3>
          <p className={`text-xs flex items-center gap-1 ${theme === 'light' ? 'text-slate-400' : 'text-gray-500'}`}>Prospecção Ativa</p>
        </div>
        <div className={`border rounded-2xl p-6 relative overflow-hidden group transition-colors ${
          theme === 'light' ? 'bg-white border-slate-200/80 shadow-sm hover:border-orange-primary/50' : 'bg-[#111] border-white/5 hover:border-orange-primary/50'
        }`}>
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle2 className="w-16 h-16 text-orange-primary" />
          </div>
          <p className={`text-sm font-medium mb-1 ${theme === 'light' ? 'text-slate-500' : 'text-gray-400'}`}>Taxa de Conversão</p>
          <h3 className={`text-4xl font-bold mb-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
            {filteredViews.length > 0 ? ((filteredLeads.length / filteredViews.length) * 100).toFixed(1) : 0}%
          </h3>
          <p className={`text-xs flex items-center gap-1 ${theme === 'light' ? 'text-slate-400' : 'text-gray-500'}`}>Visitas vs Leads</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`border rounded-2xl p-6 lg:col-span-2 ${
          theme === 'light' ? 'bg-white border-slate-200/80 shadow-sm' : 'bg-[#111] border-white/5'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{t.trafficTitle}</h3>
            <select
              value={selectedPageForTraffic}
              onChange={(e) => setSelectedPageForTraffic(e.target.value)}
              className={`text-sm px-3 py-1.5 rounded-lg border focus:outline-none focus:border-orange-primary transition-colors ${
                theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-[#1a1a1a] border-white/10 text-gray-300'
              }`}
            >
              <option value="all">Todas as Páginas</option>
              {pieData.map((entry, index) => (
                <option key={index} value={entry.name}>{entry.name}</option>
              ))}
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  {pieData.map((entry, index) => (
                    <linearGradient key={`gradient-${index}`} id={`color-${entry.name}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={entry.color} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={entry.color} stopOpacity={0}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? '#e2e8f0' : '#333'} vertical={false} />
                <XAxis dataKey="name" stroke={theme === 'light' ? '#64748b' : '#666'} tick={{fill: theme === 'light' ? '#64748b' : '#666', fontSize: 12}} tickLine={false} axisLine={false} />
                <YAxis stroke={theme === 'light' ? '#64748b' : '#666'} tick={{fill: theme === 'light' ? '#64748b' : '#666', fontSize: 12}} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={theme === 'light' ? { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' } : { backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: theme === 'light' ? '#0f172a' : '#fff' }}
                />
                {pieData.filter(entry => selectedPageForTraffic === 'all' || entry.name === selectedPageForTraffic).map((entry, index) => (
                  <Area key={`area-${index}`} type="monotone" dataKey={entry.name} name={entry.name} stroke={entry.color} strokeWidth={3} fillOpacity={1} fill={`url(#color-${entry.name})`} />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`border rounded-2xl p-6 ${
          theme === 'light' ? 'bg-white border-slate-200/80 shadow-sm' : 'bg-[#111] border-white/5'
        }`}>
          <h3 className={`text-lg font-bold mb-6 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Leads Gerados (Inbound)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? '#e2e8f0' : '#333'} vertical={false} />
                <XAxis dataKey="name" stroke={theme === 'light' ? '#64748b' : '#666'} tick={{fill: theme === 'light' ? '#64748b' : '#666', fontSize: 12}} tickLine={false} axisLine={false} />
                <YAxis stroke={theme === 'light' ? '#64748b' : '#666'} tick={{fill: theme === 'light' ? '#64748b' : '#666', fontSize: 12}} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  cursor={{fill: theme === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)'}}
                  contentStyle={theme === 'light' ? { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' } : { backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="leads" name="Leads" fill="#FF6B00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* New Analytics Row: Bar Chart & Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className={`border rounded-2xl p-6 lg:col-span-2 ${
          theme === 'light' ? 'bg-white border-slate-200/80 shadow-sm' : 'bg-[#111] border-white/5'
        }`}>
          <h3 className={`text-lg font-bold mb-6 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Distribuição mensal por página</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pieData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? '#e2e8f0' : '#333'} vertical={false} />
                <XAxis dataKey="name" stroke={theme === 'light' ? '#64748b' : '#666'} tick={{fill: theme === 'light' ? '#64748b' : '#666', fontSize: 12}} tickLine={false} axisLine={false} />
                <YAxis stroke={theme === 'light' ? '#64748b' : '#666'} tick={{fill: theme === 'light' ? '#64748b' : '#666', fontSize: 12}} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  cursor={{fill: theme === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)'}}
                  contentStyle={theme === 'light' ? { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#0f172a' } : { backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="value" name="Acessos" radius={[4, 4, 0, 0]}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className={`border rounded-2xl p-6 flex flex-col ${
          theme === 'light' ? 'bg-white border-slate-200/80 shadow-sm' : 'bg-[#111] border-white/5'
        }`}>
          <div className="h-[200px] w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={theme === 'light' ? { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', color: '#0f172a' } : { backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: theme === 'light' ? '#0f172a' : '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-auto space-y-2 pt-4">
            {pieData.map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                  <span className={theme === 'light' ? 'text-slate-600' : 'text-gray-400'}>{entry.name}</span>
                </div>
                <span className={`font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className={`border rounded-2xl p-6 lg:col-span-2 ${
          theme === 'light' ? 'bg-white border-slate-200/80 shadow-sm' : 'bg-[#111] border-white/5'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className={`text-lg font-bold flex items-center gap-2 uppercase tracking-wide ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                <TrendingUp className="w-4 h-4 text-purple-500" /> Atividade por Horário
              </h3>
              <p className={`text-xs mt-1 ${theme === 'light' ? 'text-slate-500' : 'text-gray-500'}`}>Quando seus visitantes estão mais ativos</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="grid grid-rows-7 gap-1 pt-6 text-xs text-gray-500">
              {daysOfWeek.map((d, i) => (
                <div key={d} className="flex items-center justify-end pr-2 h-full">
                  {i % 2 !== 0 ? d : ''}
                </div>
              ))}
            </div>
            <div className="flex-1">
              <div className="flex gap-1 text-xs text-gray-500 mb-2">
                {hours.map(h => (
                  <div key={h} className="flex-1 text-center">
                    {h}h
                  </div>
                ))}
              </div>
              <div className="grid grid-rows-7 gap-1">
                {daysOfWeek.map(d => (
                  <div key={d} className="flex gap-1">
                    {hours.map(h => (
                      <div 
                        key={`${d}-${h}`} 
                        className="flex-1 rounded-md aspect-square"
                        style={{ backgroundColor: getHeatColor(heatmapMap[`${d}-${h}`]) }}
                        title={`${d} às ${h}h: ${heatmapMap[`${d}-${h}`]} acessos`}
                      ></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className={`border rounded-2xl p-6 ${
          theme === 'light' ? 'bg-white border-slate-200/80 shadow-sm' : 'bg-[#111] border-white/5'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className={`text-lg font-bold flex items-center gap-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}><Mail className="w-4 h-4 text-green-500" /> Leads Recentes</h3>
            <span className="text-xs text-gray-500 cursor-pointer hover:text-white transition-colors">Ver todos &gt;</span>
          </div>
          {filteredLeads.length === 0 ? (
            <div className={`flex flex-col items-center justify-center py-10 ${theme === 'light' ? 'text-slate-400' : 'text-gray-600'}`}>
              <Users className="w-10 h-10 mb-3 opacity-20" />
              <p className="text-sm">Nenhum lead ainda</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLeads.slice(0, 4).map(l => (
                <div key={l.id} className={`p-3 rounded-xl border ${theme === 'light' ? 'border-slate-100 bg-slate-50' : 'border-white/5 bg-white/5'}`}>
                  <p className={`text-sm font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{l.name}</p>
                  <p className="text-xs text-gray-500">{l.store}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

          </div>
        )}

        {dashboardTab === 'pages' && (
          <div className="space-y-6">
            <h3 className={`text-lg font-bold uppercase tracking-wider ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>TODAS AS PÁGINAS</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className={`border-b text-xs uppercase tracking-widest ${theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-[#0A0A0A]/50 border-white/5 text-gray-500'}`}>
                    <th className="p-4 font-bold">Página</th>
                    <th className="p-4 font-bold text-center">Hoje</th>
                    <th className="p-4 font-bold text-center">Este Mês</th>
                    <th className="p-4 font-bold text-center">Este Ano</th>
                    <th className="p-4 font-bold text-right">Duração Média</th>
                  </tr>
                </thead>
                
                <tbody className={`divide-y ${theme === 'light' ? 'divide-slate-200/80' : 'divide-white/5'}`}>
                  {(() => {
                    const pageStats = new Map<string, { name: string, path: string, today: number, month: number, year: number }>();
                    
                    pageViews.forEach(view => {
                      let pathName = view.path === '/' ? 'Home' : view.path.replace('/', '');
                      pathName = pathName.split('#')[0] || pathName.replace('#', 'Home Section: ');
                      pathName = pathName.replace(/-/g, ' ');
                      pathName = pathName.charAt(0).toUpperCase() + pathName.slice(1);
                      if (!pageStats.has(pathName)) {
                        pageStats.set(pathName, { name: pathName, path: view.path, today: 0, month: 0, year: 0 });
                      }
                      
                      const stats = pageStats.get(pathName)!;
                      const d = new Date(view.timestamp);
                      const t = d.getTime();
                      
                      if (d.toDateString() === now.toDateString()) stats.today++;
                      if (now.getTime() - t <= 30 * 24 * 60 * 60 * 1000) stats.month++;
                      if (now.getTime() - t <= 365 * 24 * 60 * 60 * 1000) stats.year++;
                    });

                    return Array.from(pageStats.values())
                      .sort((a, b) => b.year - a.year)
                      .map((page, i) => (
                      <tr key={i} className={`transition-colors group ${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-white/5'}`}>
                        <td className="p-4 flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }}>{i + 1}</div>
                          <div>
                            <div className={`font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{page.name}</div>
                            <div className="text-xs text-gray-500">{page.path}</div>
                          </div>
                        </td>
                        <td className={`p-4 text-center font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{page.today}</td>
                        <td className={`p-4 text-center font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{page.month}</td>
                        <td className={`p-4 text-center font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{page.year}</td>
                        <td className="p-4 text-right text-sm text-gray-500 flex items-center justify-end gap-1">
                          <Timer className="w-3.5 h-3.5" /> 
                          {30 + ((page.name.charCodeAt(0) || 0) % 30) + (page.today * 5)}s
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>

              </table>
            </div>
          </div>
        )}

        {dashboardTab === 'leads' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className={`text-lg font-bold uppercase tracking-wider ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>CONTATOS RECEBIDOS</h3>
              <span className="text-xs px-2 py-1 rounded-md bg-green-500/10 text-green-500 font-bold">{leads.length} leads</span>
            </div>
            {leads.length === 0 ? (
              <div className={`border border-dashed rounded-2xl p-12 text-center ${theme === 'light' ? 'border-slate-300 text-slate-500' : 'border-white/10 text-gray-500'}`}>
                <div className="flex flex-col items-center justify-center">
                  <Users className="w-12 h-12 mb-4 opacity-20" />
                  <p className="font-bold mb-1">Nenhum lead encontrado</p>
                  <p className="text-xs">Os leads aparecerão quando alguém preencher um formulário</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {leads.map(l => (
                  <div key={l.id} className={`p-4 rounded-xl border ${theme === 'light' ? 'border-slate-100 bg-slate-50' : 'border-white/5 bg-white/5'}`}>
                    <p className={`text-sm font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{l.name}</p>
                    <p className="text-xs text-gray-500">{l.store} - {l.whatsapp}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderLeads = () => (
    <div className={`border rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 ${
      theme === 'light' ? 'bg-white border-slate-200/80 shadow-sm' : 'bg-[#111] border-white/5'
    }`}>
      <div className={`p-6 border-b flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
        theme === 'light' ? 'border-slate-200/80' : 'border-white/5'
      }`}>
        <div>
          <h3 className={`text-xl font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Leads Inbound</h3>
          <p className={`text-sm mt-1 ${theme === 'light' ? 'text-slate-500' : 'text-gray-400'}`}>Contatos que preencheram os formulários do site.</p>
        </div>
        <div className="flex gap-2 relative">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Buscar lead..." 
            className={`border rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-orange-primary w-full md:w-64 transition-colors ${
              theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400' : 'bg-[#0A0A0A] border-white/10 text-white placeholder:text-gray-500'
            }`}
          />
        </div>
          <button 
            onClick={() => {
              const csv = [
                ['Data', 'Nome', 'WhatsApp', 'Loja', 'Volume', 'Origem'],
                ...leads.map(l => [
                  new Date(l.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
                  l.name, l.whatsapp, l.store, l.volume, l.source
                ])
              ].map(e => e.join(',')).join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.setAttribute('hidden', '');
              a.setAttribute('href', url);
              a.setAttribute('download', 'leads_inbound.csv');
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
            className={`px-4 py-2 border rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${theme === 'light' ? 'bg-white border-slate-200 hover:bg-slate-50' : 'bg-[#0A0A0A] border-white/10 hover:bg-white/5'}`}
          >
            <Download className="w-4 h-4" /> Exportar
          </button>
        </div>

      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className={`border-b text-xs uppercase tracking-widest ${
              theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-[#0A0A0A]/50 border-white/5 text-gray-500'
            }`}>
              <th className="p-4 font-bold">Data</th>
              <th className="p-4 font-bold">Contato</th>
              <th className="p-4 font-bold">Loja / Volume</th>
              <th className="p-4 font-bold">Origem</th>
              <th className="p-4 font-bold text-right">Ação</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${theme === 'light' ? 'divide-slate-200/80' : 'divide-white/5'}`}>
            {leads.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <Database className="w-12 h-12 mb-4 opacity-20" />
                    <p>Nenhum lead inbound capturado ainda.</p>
                  </div>
                </td>
              </tr>
            )}
            {leads.map(lead => (
              <tr key={lead.id} className={`transition-colors group ${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-white/5'}`}>
                <td className={`p-4 text-sm whitespace-nowrap ${theme === 'light' ? 'text-slate-500' : 'text-gray-400'}`}>
                  {new Date(lead.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="p-4">
                  <div className={`font-bold mb-1 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{lead.name}</div>
                  <div className={`text-sm flex items-center gap-1 ${theme === 'light' ? 'text-slate-500' : 'text-gray-400'}`}>🇧🇷 {lead.whatsapp}</div>
                </td>
                <td className="p-4">
                  <div className={`flex items-center gap-1 mb-1 ${theme === 'light' ? 'text-slate-900 font-semibold' : 'text-white'}`}><Building2 className="w-3 h-3 text-orange-primary" /> {lead.store}</div>
                  <div className={`text-xs ${theme === 'light' ? 'text-slate-500' : 'text-gray-500'}`}>Volume: {lead.volume === '1' ? 'até 10' : lead.volume === '2' ? '10 a 30' : lead.volume === '3' ? '30 a 50' : lead.volume === '4' ? '+50' : lead.volume} carros</div>
                </td>
                <td className="p-4">
                  <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                    lead.source === 'Captacao' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
                  }`}>
                    {lead.source}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className={`transition-colors px-3 py-1.5 rounded text-sm font-medium ${
                    theme === 'light' ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white'
                  }`}>
                    Detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderProspects = () => {
    const availableCities = Array.from(new Set(scrapedLeads.map(l => l.city).filter(Boolean))).sort();

    const filteredScrapedLeads = scrapedLeads.filter(lead => {
      if (prospectSearch.trim()) {
        const q = prospectSearch.toLowerCase();
        const store = (lead.storeName || "").toLowerCase();
        const city = (lead.city || "").toLowerCase();
        const phone = (lead.phone || "").toLowerCase();
        const email = (lead.email || "").toLowerCase();
        const link = (lead.link || "").toLowerCase();
        const insta = (lead.instagram || "").toLowerCase();
        if (!store.includes(q) && !city.includes(q) && !phone.includes(q) && !email.includes(q) && !link.includes(q) && !insta.includes(q)) return false;
      }
      if (prospectStatusFilter !== "Todos" && lead.status !== prospectStatusFilter) {
        return false;
      }
      if (prospectCityFilter !== "Todas" && lead.city !== prospectCityFilter) {
        return false;
      }
      if (prospectOnlyOpportunities && (lead.score || 0) >= 70) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (prospectSort === 'score-desc') return (a.score || 0) - (b.score || 0);
      if (prospectSort === 'score-asc') return (b.score || 0) - (a.score || 0);
      if (prospectSort === 'date-desc') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (prospectSort === 'date-asc') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (prospectSort === 'name-asc') return a.storeName.localeCompare(b.storeName);
      return 0;
    });

    const handleExportCSV = () => {
      const headers = ['Nome da Loja', 'Cidade', 'Telefone', 'Email', 'Link', 'Instagram', 'Seguidores', 'Score', 'Status'];
      const csvContent = [
        headers.join(','),
        ...filteredScrapedLeads.map(lead => [
          `"${lead.storeName || ''}"`,
          `"${lead.city || ''}"`,
          `"${lead.phone || ''}"`,
          `"${lead.email || ''}"`,
          `"${lead.link || ''}"`,
          `"${lead.instagram || ''}"`,
          lead.followers || 0,
          lead.score || 0,
          `"${lead.status || ''}"`
        ].join(','))
      ].join('\n');

      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'leads_outgrid.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Scraper Control Panel */}
        <div className={`border rounded-2xl p-6 ${
          theme === 'light' ? 'bg-white border-slate-200/80 shadow-sm' : 'bg-[#111] border-white/5'
        }`}>
          <div className="flex flex-col justify-between items-start gap-6">
            <div className="max-w-3xl">
              <h3 className={`text-xl font-bold flex items-center gap-2 mb-2 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                <Search className="text-orange-primary" /> Como funciona a busca de leads
              </h3>
              <p className={`text-sm leading-relaxed ${theme === 'light' ? 'text-slate-600' : 'text-gray-400'}`}>
                Nosso sistema busca automaticamente por concessionárias de pequeno e médio porte na região de Campinas. Uma inteligência artificial analisa os resultados, limpa o nome real da loja, captura contatos (telefone, e-mail e Instagram) e calcula um score de oportunidade: lojas que não possuem site próprio recebem scores mais altos, indicando maior potencial para venda de criação de site e marketing.
              </p>
            </div>
          </div>
        </div>

        {/* CRM Table */}
        <div className={`border rounded-2xl overflow-hidden ${
          theme === 'light' ? 'bg-white border-slate-200/80 shadow-sm' : 'bg-[#111] border-white/5'
        }`}>
          {/* CRM Header & Filters */}
          <div className={`p-6 border-b space-y-4 ${theme === 'light' ? 'border-slate-200/80' : 'border-white/5'}`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <h3 className={`text-lg font-bold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>CRM de Prospecção</h3>
                <span className={`text-xs px-3 py-1.5 rounded-full border font-medium flex items-center gap-2 ${
                  theme === 'light' ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-[#0A0A0A] text-gray-400 border-white/5'
                }`}>
                  <div className="w-2 h-2 rounded-full bg-orange-primary"></div>
                  {filteredScrapedLeads.length} de {scrapedLeads.length} lojas
                </span>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${
                    theme === 'light'
                      ? 'bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-300'
                      : 'bg-[#0A0A0A] text-gray-400 border-white/10 hover:border-gray-500'
                  }`}
                  title="Baixar lista de leads filtrada em formato Excel/CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  Exportar CSV
                </button>
                <button
                  type="button"
                  onClick={() => setProspectOnlyOpportunities(!prospectOnlyOpportunities)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${
                    prospectOnlyOpportunities 
                      ? 'bg-red-500/20 text-red-500 border-red-500/40 shadow-sm' 
                      : theme === 'light'
                        ? 'bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-300'
                        : 'bg-[#0A0A0A] text-gray-400 border-white/10 hover:border-gray-500'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${prospectOnlyOpportunities ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></div>
                  Apenas Oportunidades (Score &lt; 70)
                </button>
              </div>
            </div>

            {/* Filter Bar Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por loja, cidade, fone, e-mail..."
                  value={prospectSearch}
                  onChange={(e) => setProspectSearch(e.target.value)}
                  className={`w-full border rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-orange-primary/50 transition-colors ${
                    theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400' : 'bg-[#0A0A0A] border-white/10 text-white placeholder-gray-500'
                  }`}
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={prospectStatusFilter}
                  onChange={(e) => setProspectStatusFilter(e.target.value)}
                  className={`w-full appearance-none border rounded-xl pl-3 pr-8 py-2 text-xs focus:outline-none focus:border-orange-primary/50 cursor-pointer transition-colors ${
                    theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#0A0A0A] border-white/10 text-gray-300'
                  }`}
                >
                  <option value="Todos">Status: Todos</option>
                  <option value="Não contatado">Não contatado</option>
                  <option value="Em contato">Em contato</option>
                  <option value="Reunião agendada">Reunião agendada</option>
                  <option value="Fechado">Fechado (Ganho)</option>
                  <option value="Perdido">Perdido</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>

              {/* City Filter */}
              <div className="relative">
                <select
                  value={prospectCityFilter}
                  onChange={(e) => setProspectCityFilter(e.target.value)}
                  className={`w-full appearance-none border rounded-xl pl-3 pr-8 py-2 text-xs focus:outline-none focus:border-orange-primary/50 cursor-pointer transition-colors ${
                    theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#0A0A0A] border-white/10 text-gray-300'
                  }`}
                >
                  <option value="Todas">Cidade: Todas ({availableCities.length})</option>
                  {availableCities.map(cidade => (
                    <option key={cidade} value={cidade}>{cidade}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>

              {/* Sort Order */}
              <div className="relative">
                <select
                  value={prospectSort}
                  onChange={(e) => setProspectSort(e.target.value as any)}
                  className={`w-full appearance-none border rounded-xl pl-3 pr-8 py-2 text-xs focus:outline-none focus:border-orange-primary/50 cursor-pointer transition-colors ${
                    theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#0A0A0A] border-white/10 text-gray-300'
                  }`}
                >
                  <option value="score-desc">Ordenar: Maior Oportunidade (Menor Score UX)</option>
                  <option value="score-asc">Ordenar: Menor Oportunidade (Maior Score UX)</option>
                  <option value="date-desc">Ordenar: Mais Recentes</option>
                  <option value="date-asc">Ordenar: Mais Antigos</option>
                  <option value="name-asc">Ordenar: Nome (A-Z)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className={`border-b text-xs uppercase tracking-widest ${
                  theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-[#0A0A0A]/50 border-white/5 text-gray-500'
                }`}>
                  <th className="p-4 font-bold">Loja & Local</th>
                  <th className="p-4 font-bold">Contato</th>
                  <th className="p-4 font-bold">Score de Oportunidade</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Data</th>
                  <th className="p-4 font-bold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${theme === 'light' ? 'divide-slate-200/80' : 'divide-white/5'}`}>
                {filteredScrapedLeads.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <Search className="w-12 h-12 mb-4 opacity-20" />
                        <p>Nenhuma loja encontrada para os filtros selecionados.</p>
                      </div>
                    </td>
                  </tr>
                )}
                {filteredScrapedLeads.map(lead => {
                  const isEditing = editingLeadId === lead.id;
                  return (
                    <tr key={lead.id} className={`transition-colors group ${theme === 'light' ? 'hover:bg-slate-50/80' : 'hover:bg-white/5'} ${isEditing ? (theme === 'light' ? 'bg-orange-50/20' : 'bg-orange-primary/5') : ''}`}>
                      <td className="p-4">
                        <div className={`font-bold mb-1 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>{lead.storeName}</div>
                        <div className="flex flex-col gap-1">
                          <div className={`text-xs flex items-center gap-1 mb-0.5 ${theme === 'light' ? 'text-slate-500' : 'text-gray-400'}`}>
                            <MapPin className="w-3 h-3 text-orange-primary" /> {lead.city}
                          </div>

                          {isEditing ? (
                            <div className="flex flex-col gap-1.5 mt-1.5 max-w-[240px]">
                              <div>
                                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-0.5">Site Oficial</label>
                                <input 
                                  type="text" 
                                  value={editForm.link} 
                                  onChange={(e) => setEditForm(prev => ({ ...prev, link: e.target.value }))}
                                  className={`w-full text-xs px-2 py-1 rounded border focus:outline-none ${
                                    theme === 'light' ? 'bg-white border-slate-300 text-slate-950' : 'bg-[#0F0F0F] border-white/10 text-white'
                                  }`}
                                  placeholder="ex: www.loja.com.br"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-0.5">Instagram Link</label>
                                <input 
                                  type="text" 
                                  value={editForm.instagram} 
                                  onChange={(e) => setEditForm(prev => ({ ...prev, instagram: e.target.value }))}
                                  className={`w-full text-xs px-2 py-1 rounded border focus:outline-none ${
                                    theme === 'light' ? 'bg-white border-slate-300 text-slate-950' : 'bg-[#0F0F0F] border-white/10 text-white'
                                  }`}
                                  placeholder="ex: https://instagram.com/user"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] uppercase font-bold text-gray-500 block mb-0.5">Seguidores Reais</label>
                                <input 
                                  type="number" 
                                  value={editForm.followers} 
                                  onChange={(e) => setEditForm(prev => ({ ...prev, followers: e.target.value }))}
                                  className={`w-full text-xs px-2 py-1 rounded border focus:outline-none ${
                                    theme === 'light' ? 'bg-white border-slate-300 text-slate-950' : 'bg-[#0F0F0F] border-white/10 text-white'
                                  }`}
                                  placeholder="Seguidores"
                                />
                              </div>
                            </div>
                          ) : (
                            <>
                              {/* Website Link */}
                              {lead.link && !lead.link.includes('instagram.com') ? (
                                <div className="flex items-center gap-2">
                                  <a 
                                    href={lead.link.startsWith('http') ? lead.link : `https://${lead.link}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-xs text-orange-primary hover:underline flex items-center gap-1.5 truncate max-w-[200px]"
                                    title="Site Oficial"
                                  >
                                    <Globe className="w-3.5 h-3.5 shrink-0 text-orange-primary" />
                                    <span className="truncate font-medium">{lead.link.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>
                                  </a>
                                  <span className="text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.2 rounded font-mono font-semibold">Site Ativo</span>
                                </div>
                              ) : (
                                <div className="inline-flex items-center gap-1 text-[11px] text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold w-fit mt-0.5">
                                  <AlertTriangle className="w-3 h-3 shrink-0 text-amber-500" />
                                  <span>Sem site próprio (Apenas Social/Portais)</span>
                                </div>
                              )}

                              {/* Instagram Link */}
                              {(lead.instagram || (lead.link && lead.link.includes('instagram.com'))) && (
                                <div className="flex items-center gap-2 mt-0.5">
                                  <a 
                                    href={lead.instagram || lead.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-xs text-pink-500 hover:text-pink-600 hover:underline flex items-center gap-1.5 truncate max-w-[140px]"
                                    title="Instagram Oficial"
                                  >
                                    <svg className="w-3 h-3 shrink-0 fill-current text-pink-500" viewBox="0 0 24 24">
                                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                    </svg>
                                    <span className="truncate font-medium">Instagram</span>
                                  </a>

                                  {lead.followers !== undefined && lead.followers !== null && (
                                    <div className="flex items-center gap-1 shrink-0">
                                      <span 
                                        className="text-[10px] bg-pink-500/10 text-pink-500 border border-pink-500/20 px-1.5 py-0.5 rounded font-mono font-semibold flex items-center gap-1 cursor-help shrink-0"
                                        title="Seguidores Reais do Instagram (Meta Graph API)"
                                      >
                                        {lead.followers >= 1000 ? `${(lead.followers / 1000).toFixed(1).replace('.0', '')}k` : lead.followers} seg.
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Seguidores Reais Verificados" />
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        {isEditing ? (
                          <div className="flex flex-col gap-1.5 max-w-[200px]">
                            <div>
                              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-0.5">WhatsApp / Celular</label>
                              <input 
                                type="text" 
                                value={editForm.phone} 
                                onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                                className={`w-full text-xs px-2 py-1 rounded border focus:outline-none ${
                                  theme === 'light' ? 'bg-white border-slate-300 text-slate-950' : 'bg-[#0F0F0F] border-white/10 text-white'
                                }`}
                                placeholder="(19) 99999-9999"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase font-bold text-gray-500 block mb-0.5">E-mail</label>
                              <input 
                                type="email" 
                                value={editForm.email} 
                                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                                className={`w-full text-xs px-2 py-1 rounded border focus:outline-none ${
                                  theme === 'light' ? 'bg-white border-slate-300 text-slate-950' : 'bg-[#0F0F0F] border-white/10 text-white'
                                }`}
                                placeholder="contato@loja.com.br"
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className={`text-xs flex items-center gap-1.5 mb-1.5 ${theme === 'light' ? 'text-slate-800' : 'text-gray-200'}`}>
                              <Phone className="w-3.5 h-3.5 text-orange-primary shrink-0" /> 
                              {lead.phone ? (
                                <a 
                                  href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="hover:text-orange-primary transition-colors font-medium text-xs flex items-center gap-1 text-emerald-500 font-mono"
                                  title="Abrir no WhatsApp"
                                >
                                  {lead.phone}
                                </a>
                              ) : (
                                <span className={`text-xs italic ${theme === 'light' ? 'text-slate-400' : 'text-gray-500'}`}>Não informado</span>
                              )}
                            </div>
                            <div className={`text-xs flex items-center gap-1.5 ${theme === 'light' ? 'text-slate-600' : 'text-gray-400'}`}>
                              <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" /> 
                              {lead.email ? (
                                <a 
                                  href={`mailto:${lead.email}`} 
                                  className="hover:text-orange-primary transition-colors truncate max-w-[180px]"
                                  title={lead.email}
                                >
                                  {lead.email}
                                </a>
                              ) : (
                                <span className={`text-[11px] italic ${theme === 'light' ? 'text-slate-400' : 'text-gray-500'}`}>Contato via WhatsApp</span>
                              )}
                            </div>
                          </>
                        )}
                      </td>
                      <td className="p-4">
                        {lead.score !== undefined ? (
                          <UXAuditHoverCard 
                            storeName={lead.storeName} 
                            url={lead.link || ''} 
                            score={lead.score} 
                          />
                        ) : (
                          <span className="text-sm text-gray-500">N/A</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="relative inline-block">
                          <select 
                            value={lead.status}
                            onChange={(e) => handleStatusChange(lead.id, e.target.value as any)}
                            className={`appearance-none border text-xs font-bold rounded-lg pl-3 pr-8 py-2 focus:outline-none cursor-pointer transition-colors ${
                              theme === 'light'
                                ? lead.status === 'Não contatado' ? 'bg-slate-50 border-slate-300 text-slate-600 hover:border-slate-400' :
                                  lead.status === 'Em contato' ? 'border-blue-400 text-blue-600 bg-blue-50' :
                                  lead.status === 'Reunião agendada' ? 'border-orange-400 text-orange-600 bg-orange-50' :
                                  lead.status === 'Fechado' ? 'border-emerald-400 text-emerald-600 bg-emerald-50' :
                                  'border-red-400 text-red-600 bg-red-50'
                                : lead.status === 'Não contatado' ? 'bg-[#0A0A0A] border-gray-700 text-gray-400 hover:border-gray-500' :
                                  lead.status === 'Em contato' ? 'bg-[#0A0A0A] border-blue-500/30 text-blue-400 bg-blue-500/5' :
                                  lead.status === 'Reunião agendada' ? 'bg-[#0A0A0A] border-orange-primary/50 text-orange-primary bg-orange-primary/10' :
                                  lead.status === 'Fechado' ? 'bg-[#0A0A0A] border-green-500/50 text-green-400 bg-green-500/10' :
                                  'bg-[#0A0A0A] border-red-500/30 text-red-400 bg-red-500/5'
                            }`}
                          >
                            <option value="Não contatado">Não contatado</option>
                            <option value="Em contato">Em contato</option>
                            <option value="Reunião agendada">Reunião agendada</option>
                            <option value="Fechado">Fechado (Ganho)</option>
                            <option value="Perdido">Perdido</option>
                          </select>
                          <ChevronDown className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                        </div>
                      </td>
                      <td className={`p-4 text-right text-sm ${theme === 'light' ? 'text-slate-500' : 'text-gray-500'}`}>
                        {new Date(lead.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                      </td>
                      <td className="p-4 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button 
                              onClick={() => handleSaveEdit(lead.id)}
                              className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 rounded transition-colors"
                              title="Salvar alterações"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => setEditingLeadId(null)}
                              className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded transition-colors"
                              title="Cancelar"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleStartEdit(lead)}
                            className="p-1.5 hover:bg-orange-primary/10 text-orange-primary hover:text-orange-primary/80 border border-orange-primary/20 hover:border-orange-primary/40 rounded transition-colors inline-flex items-center gap-1 text-xs"
                            title="Editar dados do lead"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 relative ${theme === 'light' ? 'bg-slate-100 text-slate-900' : 'bg-[#050505] text-white'}`}>
      
      {/* Toast Notification Feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-orange-primary text-white font-bold text-xs px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-white/20"
          >
            <Check className="w-4 h-4 text-white" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`w-64 border-r hidden md:flex flex-col transition-colors ${theme === 'light' ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#0A0A0A] border-white/5 text-white'}`}>
        <div className={`h-20 flex items-center px-8 border-b ${theme === 'light' ? 'border-slate-200' : 'border-white/5'}`}>
          <h1 className="text-xl font-black tracking-tighter">OUT<span className="text-orange-primary">GRID</span> <span className="text-[10px] font-medium text-gray-400 ml-1 tracking-widest uppercase">Admin</span></h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-orange-primary/10 text-orange-primary' : theme === 'light' ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <LayoutDashboard className="w-4 h-4" /> {t.overview}
          </button>
          <button 
            onClick={() => setActiveTab('leads')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'leads' ? 'bg-orange-primary/10 text-orange-primary' : theme === 'light' ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Users className="w-4 h-4" /> {t.inboundLeads}
          </button>
          <button 
            onClick={() => setActiveTab('prospects')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'prospects' ? 'bg-orange-primary/10 text-orange-primary' : theme === 'light' ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-3">
              <Search className="w-4 h-4" /> {t.outboundProspects}
            </div>
            <span className="bg-orange-primary text-black-main text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">{language === 'pt' ? 'Novo' : language === 'es' ? 'Nuevo' : 'New'}</span>
          </button>

          <div className="pt-6 pb-2">
            <h3 className={`px-4 text-xs font-bold uppercase tracking-widest ${theme === 'light' ? 'text-slate-400' : 'text-gray-500'}`}>Operação</h3>
          </div>
          
          <button 
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${theme === 'light' ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-3">
              <CalendarDays className="w-4 h-4" /> Calendário Editorial
            </div>
          </button>
          
          <button 
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${theme === 'light' ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-3">
              <Archive className="w-4 h-4" /> Portfólio & Arquivos
            </div>
          </button>

          
          <button 
            onClick={() => setActiveTab('apresentacoes')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'apresentacoes' ? 'bg-orange-primary/10 text-orange-primary' : theme === 'light' ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-3">
              <Presentation className="w-4 h-4" /> Apresentações
            </div>
          </button>

          <button 
            onClick={() => setActiveTab('captacao')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'captacao' ? 'bg-orange-primary/10 text-orange-primary' : theme === 'light' ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-3">
              <LucidePieChart className="w-4 h-4" /> Captação
            </div>
          </button>

          <button 
            onClick={() => setActiveTab('estrategia')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'estrategia' ? 'bg-orange-primary/10 text-orange-primary' : theme === 'light' ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-3">
              <LineChart className="w-4 h-4" /> Estratégia
            </div>
          </button>

          
          

        </nav>


        <div className={`p-4 border-t ${theme === 'light' ? 'border-slate-200' : 'border-white/5'}`}>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" /> {t.logout}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className={`h-20 border-b backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30 transition-colors ${theme === 'light' ? 'bg-white/90 border-slate-200 text-slate-900' : 'bg-[#0A0A0A]/80 border-white/5 text-white'}`}>
          <div className="flex items-center gap-4">
            <h2 className={`text-lg font-bold capitalize ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
              {activeTab === 'dashboard' ? t.overview : activeTab === 'leads' ? t.inboundLeads : activeTab === 'apresentacoes' ? 'Apresentações' : activeTab === 'captacao' ? 'Captação' : activeTab === 'estrategia' ? 'Estratégia' : t.outboundProspects}
            </h2>
          </div>

          <div className="flex items-center gap-3 relative">
            {/* Bell Icon & Notifications Button */}
            <button 
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowSettings(false);
              }}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all relative ${
                showNotifications 
                  ? 'border-orange-primary text-orange-primary bg-orange-primary/10' 
                  : theme === 'light'
                    ? 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    : 'border-white/10 text-gray-400 hover:text-white hover:border-white/20'
              }`}
              title={t.notificationsTitle}
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-orange-primary rounded-full border-2 border-[#0A0A0A]"></div>
              )}
            </button>

            {/* Notifications Dropdown / Popover */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className={`absolute right-12 top-14 w-80 md:w-96 rounded-2xl border p-4 shadow-2xl z-50 ${
                    theme === 'light' ? 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50' : 'bg-[#111111] border-white/10 text-white shadow-black'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                    <div className="flex items-center gap-2">
                      <BellRing className="w-4 h-4 text-orange-primary" />
                      <span className="font-bold text-sm">{t.notificationsTitle}</span>
                      {unreadNotificationsCount > 0 && (
                        <span className="bg-orange-primary/20 text-orange-primary text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {unreadNotificationsCount}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {notifications.length > 0 && (
                        <>
                          <button 
                            onClick={() => {
                              setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
                              showToast(t.markAllRead);
                            }}
                            className="text-xs text-gray-400 hover:text-orange-primary p-1 rounded transition-colors"
                            title={t.markAllRead}
                          >
                            <CheckCheck className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setNotifications([]);
                              showToast(t.clearNotifications);
                            }}
                            className="text-xs text-gray-400 hover:text-red-400 p-1 rounded transition-colors"
                            title={t.clearNotifications}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="text-gray-400 hover:text-white p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-gray-500 italic">
                        {t.noNotifications}
                      </div>
                    ) : (
                      notifications.map(item => (
                        <div 
                          key={item.id} 
                          className={`p-3 rounded-xl border text-xs transition-colors flex items-start gap-3 relative ${
                            item.unread 
                              ? theme === 'light' ? 'bg-orange-500/5 border-orange-500/20' : 'bg-orange-primary/10 border-orange-primary/20'
                              : theme === 'light' ? 'bg-slate-50 border-slate-200' : 'bg-[#0A0A0A] border-white/5'
                          }`}
                        >
                          <div className="p-2 rounded-lg bg-orange-primary/10 text-orange-primary shrink-0 mt-0.5">
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="font-bold text-xs truncate">{item.title}</span>
                              <span className="text-[10px] text-gray-400 shrink-0 ml-2">{item.time}</span>
                            </div>
                            <p className="text-[11px] text-gray-400 leading-snug">{item.desc}</p>
                          </div>
                          <button 
                            onClick={() => setNotifications(prev => prev.filter(n => n.id !== item.id))}
                            className="text-gray-500 hover:text-red-400 transition-colors p-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Settings Icon & Button */}
            <button 
              onClick={() => {
                setShowSettings(!showSettings);
                setShowNotifications(false);
              }}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                showSettings 
                  ? 'border-orange-primary text-orange-primary bg-orange-primary/10' 
                  : theme === 'light'
                    ? 'border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    : 'border-white/10 text-gray-400 hover:text-white hover:border-white/20'
              }`}
              title={t.settingsTitle}
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Settings Modal / Dropdown */}
            <AnimatePresence>
              {showSettings && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className={`absolute right-0 top-14 w-80 md:w-96 rounded-2xl border p-5 shadow-2xl z-50 ${
                    theme === 'light' ? 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50' : 'bg-[#111111] border-white/10 text-white shadow-black'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-orange-primary" />
                      <span className="font-bold text-sm">{t.settingsTitle}</span>
                    </div>
                    <button 
                      onClick={() => setShowSettings(false)}
                      className="text-gray-400 hover:text-white p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-5">
                    {/* Theme Selector */}
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2 flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-orange-primary" /> {t.themeLabel}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => {
                            setTheme('dark');
                            showToast('Modo Escuro ativado!');
                          }}
                          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                            theme === 'dark' 
                              ? 'bg-orange-primary/20 border-orange-primary text-orange-primary' 
                              : 'bg-black/20 border-white/10 text-gray-400 hover:text-white'
                          }`}
                        >
                          <Moon className="w-3.5 h-3.5" /> {t.darkTheme}
                        </button>
                        <button 
                          onClick={() => {
                            setTheme('light');
                            showToast('Modo Claro ativado!');
                          }}
                          className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                            theme === 'light' 
                              ? 'bg-orange-primary/20 border-orange-primary text-orange-primary' 
                              : 'bg-black/20 border-white/10 text-gray-400 hover:text-white'
                          }`}
                        >
                          <Sun className="w-3.5 h-3.5" /> {t.lightTheme}
                        </button>
                      </div>
                    </div>

                    {/* Language Selector */}
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2 flex items-center gap-1.5">
                        <Languages className="w-3.5 h-3.5 text-orange-primary" /> {t.languageLabel}
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button 
                          onClick={() => {
                            setLanguage('pt');
                            showToast('Idioma alterado para Português');
                          }}
                          className={`px-2 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 ${
                            language === 'pt' 
                              ? 'bg-orange-primary/20 border-orange-primary text-orange-primary' 
                              : 'bg-black/20 border-white/10 text-gray-400 hover:text-white'
                          }`}
                        >
                          🇧🇷 PT
                        </button>
                        <button 
                          onClick={() => {
                            setLanguage('en');
                            showToast('Language set to English');
                          }}
                          className={`px-2 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 ${
                            language === 'en' 
                              ? 'bg-orange-primary/20 border-orange-primary text-orange-primary' 
                              : 'bg-black/20 border-white/10 text-gray-400 hover:text-white'
                          }`}
                        >
                          🇺🇸 EN
                        </button>
                        <button 
                          onClick={() => {
                            setLanguage('es');
                            showToast('Idioma cambiado a Español');
                          }}
                          className={`px-2 py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 ${
                            language === 'es' 
                              ? 'bg-orange-primary/20 border-orange-primary text-orange-primary' 
                              : 'bg-black/20 border-white/10 text-gray-400 hover:text-white'
                          }`}
                        >
                          🇪🇸 ES
                        </button>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-xs text-green-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-green-500" />
                      <span>{t.apiStatus}</span>
                    </div>

                    <button 
                      onClick={() => {
                        setShowSettings(false);
                        showToast(t.savedToast);
                      }}
                      className="w-full bg-orange-primary text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-colors text-xs uppercase tracking-wider"
                    >
                      {t.saveSettings}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-primary to-[#ff4000] p-[2px] ml-1">
              <div className="w-full h-full bg-[#0A0A0A] rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">AD</span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className={`${activeTab === 'apresentacoes' || activeTab === 'captacao' || activeTab === 'estrategia' ? 'h-full w-full' : 'max-w-7xl mx-auto'}`}>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'leads' && renderLeads()}
            {activeTab === 'prospects' && renderProspects()}
            {activeTab === 'apresentacoes' && <iframe src="/apresentacao-comercial" className="w-full h-full border-none bg-black-main" />}
            {activeTab === 'captacao' && <iframe src="/captacao" className="w-full h-full border-none bg-black-main" />}
            {activeTab === 'estrategia' && <iframe src="/estrategia" className="w-full h-full border-none bg-black-main" />}
          </div>
        </div>
      </main>
    </div>
  );
}
