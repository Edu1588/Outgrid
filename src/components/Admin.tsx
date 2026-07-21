import { useState, useEffect } from "react";
import { getLeads, getPageViews, Lead, PageView } from "../lib/storage";

export function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"analytics" | "leads">("analytics");
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [pageViews, setPageViews] = useState<PageView[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      setLeads(getLeads());
      setPageViews(getPageViews());
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

  // Group views by day
  const viewsByDay = pageViews.reduce((acc, view) => {
    const date = new Date(view.timestamp).toLocaleDateString('pt-BR');
    if (!acc[date]) {
      acc[date] = { total: 0, pages: {} };
    }
    acc[date].total++;
    if (!acc[date].pages[view.path]) {
      acc[date].pages[view.path] = 0;
    }
    acc[date].pages[view.path]++;
    return acc;
  }, {} as Record<string, { total: number, pages: Record<string, number> }>);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black-main flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="bg-[#141414] border border-white/10 p-8 rounded-2xl w-full max-w-md shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Acesso Restrito</h2>
          <div className="mb-4">
            <label className="block text-gray-400 text-sm font-bold mb-2">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black-main border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-primary"
              placeholder="Digite a senha"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4 font-medium">{error}</p>}
          <button type="submit" className="w-full bg-orange-primary text-white font-bold py-3 rounded-xl hover:bg-[#FF7043] transition-colors">
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black-main text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              Painel Admin <span className="text-xs bg-orange-primary/20 text-orange-primary px-3 py-1 rounded-full border border-orange-primary/30">Alpha Local</span>
            </h1>
            <p className="text-gray-400 mt-2">Monitoramento de leads e acessos da plataforma (Modo Local).</p>
          </div>
          <div className="flex bg-[#141414] border border-white/10 rounded-lg p-1">
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`px-6 py-2 rounded-md font-bold text-sm transition-colors ${activeTab === 'analytics' ? 'bg-orange-primary text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Analytics
            </button>
            <button 
              onClick={() => setActiveTab('leads')}
              className={`px-6 py-2 rounded-md font-bold text-sm transition-colors ${activeTab === 'leads' ? 'bg-orange-primary text-white' : 'text-gray-400 hover:text-white'}`}
            >
              Leads Recebidos
            </button>
          </div>
        </div>

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold border-b border-white/10 pb-4">Acessos por Dia (Páginas Únicas)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.keys(viewsByDay).length === 0 && (
                <p className="text-gray-500 col-span-3">Nenhum acesso registrado ainda.</p>
              )}
              {Object.entries(viewsByDay).map(([date, data]) => (
                <div key={date} className="bg-[#141414] border border-white/10 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">{date}</h3>
                    <span className="bg-white/10 text-white text-xs px-2 py-1 rounded-full font-bold">{data.total} views</span>
                  </div>
                  <div className="space-y-3">
                    {Object.entries(data.pages).map(([path, count]) => (
                      <div key={path} className="flex justify-between items-center text-sm">
                        <span className="text-gray-400">{path}</span>
                        <span className="font-mono bg-black-main px-2 py-1 rounded text-orange-primary">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold">Leads Capturados</h2>
              <span className="bg-orange-primary/20 text-orange-primary text-sm px-3 py-1 rounded-full font-bold">{leads.length} total</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-sm text-gray-400 uppercase tracking-wider">
                    <th className="p-4 font-medium">Data</th>
                    <th className="p-4 font-medium">Nome</th>
                    <th className="p-4 font-medium">WhatsApp</th>
                    <th className="p-4 font-medium">Loja</th>
                    <th className="p-4 font-medium">Origem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {leads.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-500">Nenhum lead capturado ainda.</td>
                    </tr>
                  )}
                  {leads.map(lead => (
                    <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 text-sm text-gray-400 whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleString('pt-BR')}
                      </td>
                      <td className="p-4 font-bold">{lead.name}</td>
                      <td className="p-4 text-gray-300">{lead.whatsapp}</td>
                      <td className="p-4 text-gray-300">
                        {lead.store} <br />
                        <span className="text-xs text-gray-500">Volume: {lead.volume === '1' ? 'até 10' : lead.volume === '2' ? '10 a 30' : lead.volume === '3' ? '30 a 50' : lead.volume === '4' ? '+50' : lead.volume}</span>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider ${
                          lead.source === 'Captacao' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                        }`}>
                          {lead.source}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
