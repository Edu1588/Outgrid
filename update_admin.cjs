const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

// Add states for new tabs
code = code.replace(
  /const \[activeTab, setActiveTab\] = useState<"dashboard" \| "leads" \| "prospects">/,
  'const [activeTab, setActiveTab] = useState<"dashboard" | "leads" | "prospects" | "apresentacoes" | "estrategia" | "repos">('
);

// Update sidebar buttons to not use window.open and add new Repositories
const oldApresentacaoBtn = /<button \s*onClick=\{\(\) => window\.open\('\/apresentacao-comercial', '_blank'\)\}\s*className=\{`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all \$\{theme === 'light' \? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-gray-400 hover:text-white hover:bg-white\/5'\}`\}\s*>\s*<div className="flex items-center gap-3">\s*<Presentation className="w-4 h-4" \/> Apresentações\s*<\/div>\s*<\/button>/;

const newApresentacaoBtn = `
          <button 
            onClick={() => setActiveTab('apresentacoes')}
            className={\`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all \${activeTab === 'apresentacoes' ? 'bg-orange-primary/10 text-orange-primary' : theme === 'light' ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-gray-400 hover:text-white hover:bg-white/5'}\`}
          >
            <div className="flex items-center gap-3">
              <Presentation className="w-4 h-4" /> Apresentações
            </div>
          </button>
`;

code = code.replace(oldApresentacaoBtn, newApresentacaoBtn);

const oldEstrategiaBtn = /<button \s*onClick=\{\(\) => window\.open\('\/estrategia', '_blank'\)\}\s*className=\{`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all \$\{theme === 'light' \? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-gray-400 hover:text-white hover:bg-white\/5'\}`\}\s*>\s*<div className="flex items-center gap-3">\s*<PieChart className="w-4 h-4" \/> Estratégia\s*<\/div>\s*<\/button>/;

const newEstrategiaBtn = `
          <button 
            onClick={() => setActiveTab('estrategia')}
            className={\`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all \${activeTab === 'estrategia' ? 'bg-orange-primary/10 text-orange-primary' : theme === 'light' ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-gray-400 hover:text-white hover:bg-white/5'}\`}
          >
            <div className="flex items-center gap-3">
              <PieChart className="w-4 h-4" /> Estratégia
            </div>
          </button>

          <div className="pt-6 pb-2">
            <h3 className={\`px-4 text-xs font-bold uppercase tracking-widest \${theme === 'light' ? 'text-slate-400' : 'text-gray-500'}\`}>Repositórios</h3>
          </div>
          
          <button 
            onClick={() => window.open('https://github.com/lllyasviel/Fooocus.git', '_blank')}
            className={\`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all \${theme === 'light' ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-gray-400 hover:text-white hover:bg-white/5'}\`}
          >
            <div className="flex items-center gap-3">
              <Folder className="w-4 h-4" /> Fooocus (Imagens IA)
            </div>
          </button>
          
          <button 
            onClick={() => window.open('https://github.com/plausible/analytics.git', '_blank')}
            className={\`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all \${theme === 'light' ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-gray-400 hover:text-white hover:bg-white/5'}\`}
          >
            <div className="flex items-center gap-3">
              <Folder className="w-4 h-4" /> Plausible Analytics
            </div>
          </button>

          <button 
            onClick={() => window.open('https://github.com/AppFlowy-IO/AppFlowy-Cloud.git', '_blank')}
            className={\`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all \${theme === 'light' ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-gray-400 hover:text-white hover:bg-white/5'}\`}
          >
            <div className="flex items-center gap-3">
              <Folder className="w-4 h-4" /> AppFlowy
            </div>
          </button>

          <button 
            onClick={() => window.open('https://github.com/penpot/penpot.git', '_blank')}
            className={\`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all \${theme === 'light' ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-gray-400 hover:text-white hover:bg-white/5'}\`}
          >
            <div className="flex items-center gap-3">
              <Folder className="w-4 h-4" /> Penpot
            </div>
          </button>
`;

code = code.replace(oldEstrategiaBtn, newEstrategiaBtn);

// Fix title display
code = code.replace(
  /\{activeTab === 'dashboard' \? t\.overview : activeTab === 'leads' \? t\.inboundLeads : t\.outboundProspects\}/,
  "{activeTab === 'dashboard' ? t.overview : activeTab === 'leads' ? t.inboundLeads : activeTab === 'apresentacoes' ? 'Apresentações' : activeTab === 'estrategia' ? 'Estratégia' : t.outboundProspects}"
);

// We need to change the max-w-7xl mx-auto to handle full screen for the iframes
code = code.replace(
  /<div className="max-w-7xl mx-auto">\s*\{activeTab === 'dashboard' && renderDashboard\(\)\}\s*\{activeTab === 'leads' && renderLeads\(\)\}\s*\{activeTab === 'prospects' && renderProspects\(\)\}\s*<\/div>/,
  `<div className={\`\${activeTab === 'apresentacoes' || activeTab === 'estrategia' ? 'h-full w-full' : 'max-w-7xl mx-auto'}\`}>
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'leads' && renderLeads()}
            {activeTab === 'prospects' && renderProspects()}
            {activeTab === 'apresentacoes' && <iframe src="/apresentacao-comercial" className="w-full h-full border-none bg-black-main" />}
            {activeTab === 'estrategia' && <iframe src="/estrategia" className="w-full h-full border-none bg-black-main" />}
          </div>`
);

// We also need to fix main content height handling to ensure iframe fills space
code = code.replace(
  /<main className="flex-1 flex flex-col h-screen overflow-hidden relative">\s*\{\/\* Header \*\/\}/,
  '<main className="flex-1 flex flex-col h-screen overflow-hidden relative">\n        {/* Header */}'
);

code = code.replace(
  /<div className=\{`flex-1 overflow-y-auto p-4 md:p-8 transition-colors \$\{theme === 'light' \? 'bg-slate-50\/50' : 'bg-\[#0A0A0A\]'\}`\}>/,
  `<div className={\`flex-1 overflow-y-auto \${activeTab === 'apresentacoes' || activeTab === 'estrategia' ? 'p-0' : 'p-4 md:p-8'} transition-colors \${theme === 'light' ? 'bg-slate-50/50' : 'bg-[#0A0A0A]'}\`}>`
);

fs.writeFileSync('src/components/Admin.tsx', code);
