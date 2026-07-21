import { useState, useEffect } from "react";
import { getLeads, getPageViews, getScrapedLeads, saveScrapedLead, updateScrapedLeadStatus, Lead, PageView, ScrapedLead } from "../lib/storage";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import { Search, Filter, Loader2, Database, LayoutDashboard, Users, UserPlus, RefreshCw, LogOut, ChevronDown, CheckCircle2, Phone, Mail, MapPin, Building2, TrendingUp, TrendingDown, Bell, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "leads" | "prospects">("dashboard");
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [scrapedLeads, setScrapedLeads] = useState<ScrapedLead[]>([]);
  
  const [isScraping, setIsScraping] = useState(false);

  const fetchScrapedLeads = async () => {
    try {
      const response = await fetch('/api/leads/scraped');
      if (response.ok) {
        const data = await response.json();
        setScrapedLeads(data);
      }
    } catch (e) {
      console.error('Error fetching scraped leads', e);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      setLeads(getLeads());
      setPageViews(getPageViews());
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

  // Prepare Analytics Data
  const viewsByDay = pageViews.reduce((acc, view) => {
    const date = new Date(view.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    if (!acc[date]) {
      acc[date] = { name: date, total: 0, home: 0, captacao: 0, outros: 0 };
    }
    acc[date].total++;
    if (view.path === '/') acc[date].home++;
    else if (view.path === '/captacao') acc[date].captacao++;
    else acc[date].outros++;
    return acc;
  }, {} as Record<string, any>);
  
  const chartData = Object.values(viewsByDay).slice(-14); // Last 14 days

  const leadsByDay = leads.reduce((acc, lead) => {
    const date = new Date(lead.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    if (!acc[date]) acc[date] = { name: date, leads: 0 };
    acc[date].leads++;
    return acc;
  }, {} as Record<string, any>);
  
  const leadsChartData = Object.values(leadsByDay).slice(-14);

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

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-orange-primary/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <LayoutDashboard className="w-16 h-16 text-orange-primary" />
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Acessos Totais</p>
          <h3 className="text-4xl font-bold text-white mb-2">{pageViews.length}</h3>
          <p className="text-xs text-green-500 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +12% esta semana</p>
        </div>
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-orange-primary/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-16 h-16 text-orange-primary" />
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Leads Inbound</p>
          <h3 className="text-4xl font-bold text-white mb-2">{leads.length}</h3>
          <p className="text-xs text-green-500 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +3% esta semana</p>
        </div>
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-orange-primary/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Database className="w-16 h-16 text-orange-primary" />
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Leads Outbound (Scraped)</p>
          <h3 className="text-4xl font-bold text-white mb-2">{scrapedLeads.length}</h3>
          <p className="text-xs text-gray-500 flex items-center gap-1">Prospecção Ativa</p>
        </div>
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-orange-primary/50 transition-colors">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle2 className="w-16 h-16 text-orange-primary" />
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Taxa de Conversão</p>
          <h3 className="text-4xl font-bold text-white mb-2">
            {pageViews.length > 0 ? ((leads.length / pageViews.length) * 100).toFixed(1) : 0}%
          </h3>
          <p className="text-xs text-gray-500 flex items-center gap-1">Visitas vs Leads</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#111] border border-white/5 rounded-2xl p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-white mb-6">Tráfego da Loja (Últimos dias)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FF6B00" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCaptacao" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" tick={{fill: '#666', fontSize: 12}} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" tick={{fill: '#666', fontSize: 12}} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="home" name="Home" stroke="#FF6B00" strokeWidth={3} fillOpacity={1} fill="url(#colorHome)" />
                <Area type="monotone" dataKey="captacao" name="Captação" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCaptacao)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Leads Gerados (Inbound)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="name" stroke="#666" tick={{fill: '#666', fontSize: 12}} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" tick={{fill: '#666', fontSize: 12}} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="leads" name="Leads" fill="#FF6B00" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLeads = () => (
    <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-white">Leads Inbound</h3>
          <p className="text-sm text-gray-400 mt-1">Contatos que preencheram os formulários do site.</p>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Buscar lead..." 
            className="bg-[#0A0A0A] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-orange-primary w-full md:w-64 transition-colors"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 text-xs text-gray-500 uppercase tracking-widest bg-[#0A0A0A]/50">
              <th className="p-4 font-bold">Data</th>
              <th className="p-4 font-bold">Contato</th>
              <th className="p-4 font-bold">Loja / Volume</th>
              <th className="p-4 font-bold">Origem</th>
              <th className="p-4 font-bold text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
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
              <tr key={lead.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-4 text-sm text-gray-400 whitespace-nowrap">
                  {new Date(lead.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="p-4">
                  <div className="font-bold text-white mb-1">{lead.name}</div>
                  <div className="text-sm text-gray-400 flex items-center gap-1"><Phone className="w-3 h-3" /> {lead.whatsapp}</div>
                </td>
                <td className="p-4">
                  <div className="text-white flex items-center gap-1 mb-1"><Building2 className="w-3 h-3 text-orange-primary" /> {lead.store}</div>
                  <div className="text-xs text-gray-500">Volume: {lead.volume === '1' ? 'até 10' : lead.volume === '2' ? '10 a 30' : lead.volume === '3' ? '30 a 50' : lead.volume === '4' ? '+50' : lead.volume} carros</div>
                </td>
                <td className="p-4">
                  <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                    lead.source === 'Captacao' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                  }`}>
                    {lead.source}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded text-sm font-medium">
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

  const renderProspects = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Scraper Control Panel */}
      <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
        <div className="flex flex-col justify-between items-start gap-6">
          <div className="max-w-3xl">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
              <Search className="text-orange-primary" /> Como funciona a busca de leads
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Nosso sistema busca automaticamente por concessionárias de pequeno e médio porte na região de Campinas. Uma inteligência artificial analisa os resultados, limpa o nome real da loja e calcula um score de oportunidade: lojas que não possuem site próprio e têm menor engajamento recebem scores mais altos, indicando maior potencial para venda de serviços. A busca percorre rotineiramente cidades da região (Campinas, Valinhos, Vinhedo, etc).
            </p>
          </div>
        </div>
      </div>

      {/* CRM Table */}
      <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">CRM de Prospecção</h3>
          <div className="flex gap-2">
            <span className="text-xs text-gray-500 bg-[#0A0A0A] px-3 py-1.5 rounded-full border border-white/5 font-medium flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-orange-primary"></div>
              {scrapedLeads.length} de 30 hoje
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 text-xs text-gray-500 uppercase tracking-widest bg-[#0A0A0A]/50">
                <th className="p-4 font-bold">Loja & Local</th>
                <th className="p-4 font-bold">Contato</th>
                <th className="p-4 font-bold">Score de Oportunidade</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {scrapedLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <Search className="w-12 h-12 mb-4 opacity-20" />
                      <p>Nenhuma loja prospectada ainda. Use a busca acima.</p>
                    </div>
                  </td>
                </tr>
              )}
              {[...scrapedLeads].reverse().map(lead => (
                <tr key={lead.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4">
                    <div className="font-bold text-white mb-1">{lead.storeName}</div>
                    <div className="flex flex-col gap-1">
                      <div className="text-xs text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {lead.city}</div>
                      {lead.link && (
                        <a href={lead.link} target="_blank" rel="noopener noreferrer" className="text-xs text-orange-primary hover:underline truncate max-w-[200px] inline-block">
                          {lead.link}
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-300 flex items-center gap-1 mb-1">
                      <Phone className="w-3 h-3 text-gray-500" /> 
                      {lead.phone || <span className="text-gray-600 italic">Não encontrado</span>}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> 
                      {lead.email || <span className="text-gray-600 italic">Não encontrado</span>}
                    </div>
                  </td>
                  <td className="p-4">
                    {lead.score !== undefined ? (
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${lead.score >= 70 ? 'bg-red-500' : lead.score >= 40 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                        <span className={`text-sm font-bold ${lead.score >= 70 ? 'text-red-400' : lead.score >= 40 ? 'text-yellow-400' : 'text-green-400'}`}>
                          {lead.score} <span className="text-gray-500 text-xs font-normal">/ 100</span>
                        </span>
                        {lead.score >= 70 && (
                          <span className="text-[10px] bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full ml-2 uppercase font-bold tracking-wider">
                            Oportunidade
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">N/A</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="relative inline-block">
                      <select 
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as any)}
                        className={`appearance-none bg-[#0A0A0A] border text-xs font-bold rounded-lg pl-3 pr-8 py-2 focus:outline-none cursor-pointer transition-colors ${
                          lead.status === 'Não contatado' ? 'border-gray-700 text-gray-400 hover:border-gray-500' :
                          lead.status === 'Em contato' ? 'border-blue-500/30 text-blue-400 bg-blue-500/5' :
                          lead.status === 'Reunião agendada' ? 'border-orange-primary/50 text-orange-primary bg-orange-primary/10' :
                          lead.status === 'Fechado' ? 'border-green-500/50 text-green-400 bg-green-500/10' :
                          'border-red-500/30 text-red-400 bg-red-500/5'
                        }`}
                      >
                        <option value="Não contatado">Não contatado</option>
                        <option value="Em contato">Em contato</option>
                        <option value="Reunião agendada">Reunião agendada</option>
                        <option value="Fechado">Fechado (Ganho)</option>
                        <option value="Perdido">Perdido</option>
                      </select>
                      <ChevronDown className="w-3 h-3 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500" />
                    </div>
                  </td>
                  <td className="p-4 text-right text-sm text-gray-500">
                    {new Date(lead.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0A0A0A] hidden md:flex flex-col">
        <div className="h-20 flex items-center px-8 border-b border-white/5">
          <h1 className="text-xl font-black tracking-tighter">OUT<span className="text-orange-primary">GRID</span> <span className="text-[10px] font-medium text-gray-500 ml-1 tracking-widest uppercase">Admin</span></h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-orange-primary/10 text-orange-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Overview
          </button>
          <button 
            onClick={() => setActiveTab('leads')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'leads' ? 'bg-orange-primary/10 text-orange-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <Users className="w-4 h-4" /> Inbound Leads
          </button>
          <button 
            onClick={() => setActiveTab('prospects')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'prospects' ? 'bg-orange-primary/10 text-orange-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            <div className="flex items-center gap-3">
              <Search className="w-4 h-4" /> Prospecção
            </div>
            <span className="bg-orange-primary text-black-main text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">Novo</span>
          </button>
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-bold text-white capitalize">
              {activeTab === 'dashboard' ? 'Overview' : activeTab === 'leads' ? 'Leads Inbound' : 'Prospecção Ativa'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-all relative">
              <Bell className="w-4 h-4" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-orange-primary rounded-full border-2 border-[#0A0A0A]"></div>
            </button>
            <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 transition-all">
              <Settings className="w-4 h-4" />
            </button>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-primary to-[#ff4000] p-[2px] ml-2">
              <div className="w-full h-full bg-[#0A0A0A] rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">AD</span>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'leads' && renderLeads()}
            {activeTab === 'prospects' && renderProspects()}
          </div>
        </div>
      </main>
    </div>
  );
}
