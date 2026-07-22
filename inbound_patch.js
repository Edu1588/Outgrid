const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

// Update imports
code = code.replace(/Trash2, Sparkles, AlertTriangle } from 'lucide-react'/, "Trash2, Sparkles, AlertTriangle, Download, Edit2, Ban, MessageCircle, Calendar, Briefcase, FileText, Presentation, Folder, CalendarDays, Archive } from 'lucide-react'");

// Inbound Leads: format phone & add actions
// replace lead.whatsapp rendering
code = code.replace(
  /<div className=\{`text-sm flex items-center gap-1 \$\{theme === 'light' \? 'text-slate-500' : 'text-gray-400'\}`\}><Phone className="w-3 h-3" \/> \{lead.whatsapp\}<\/div>/g,
  `<div className={\`text-sm flex items-center gap-1 \${theme === 'light' ? 'text-slate-500' : 'text-gray-400'}\`}>🇧🇷 {lead.whatsapp}</div>`
);

// add Export button
code = code.replace(
  /<div className="relative">\s*<Search className="w-4 h-4 absolute left-3 top-1\/2 -translate-y-1\/2 text-gray-500" \/>/,
  `<div className="flex gap-2 relative">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />`
);

code = code.replace(
  /placeholder:text-gray-500'\}\`\}\s*\/>\s*<\/div>/,
  `placeholder:text-gray-500'}\`}
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
              ].map(e => e.join(',')).join('\\n');
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
            className={\`px-4 py-2 border rounded-full text-sm font-medium flex items-center gap-2 transition-colors \${theme === 'light' ? 'bg-white border-slate-200 hover:bg-slate-50' : 'bg-[#0A0A0A] border-white/10 hover:bg-white/5'}\`}
          >
            <Download className="w-4 h-4" /> Exportar
          </button>
        </div>`
);

// replace Ação cell
code = code.replace(
  /<td className="p-4 text-right">\s*<button className=\{`p-2 rounded-lg transition-colors \$\{theme === 'light' \? 'hover:bg-slate-100 text-slate-400' : 'hover:bg-white\/5 text-gray-500'\}`\}>\s*<Phone className="w-4 h-4" \/>\s*<\/button>\s*<\/td>/g,
  `<td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <button className="text-green-500 hover:opacity-80 transition-opacity">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                    <button className="text-pink-500 hover:opacity-80 transition-opacity">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="text-pink-500 hover:opacity-80 transition-opacity">
                      <Ban className="w-4 h-4" />
                    </button>
                    <button className="text-pink-500 hover:opacity-80 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>`
);

fs.writeFileSync('src/components/Admin.tsx', code);
