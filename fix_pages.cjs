const fs = require('fs');
let code = fs.readFileSync('src/components/Admin.tsx', 'utf8');

const tableRowFix = `
                <tbody className={\`divide-y \${theme === 'light' ? 'divide-slate-200/80' : 'divide-white/5'}\`}>
                  {(() => {
                    const pageStats = new Map<string, { name: string, path: string, today: number, month: number, year: number }>();
                    
                    pageViews.forEach(view => {
                      let pathName = view.path === '/' ? 'Home' : view.path.replace('/', '');
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
                      <tr key={i} className={\`transition-colors group \${theme === 'light' ? 'hover:bg-slate-50' : 'hover:bg-white/5'}\`}>
                        <td className="p-4 flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }}>{i + 1}</div>
                          <div>
                            <div className={\`font-bold \${theme === 'light' ? 'text-slate-900' : 'text-white'}\`}>{page.name}</div>
                            <div className="text-xs text-gray-500">{page.path}</div>
                          </div>
                        </td>
                        <td className={\`p-4 text-center font-bold \${theme === 'light' ? 'text-slate-900' : 'text-white'}\`}>{page.today}</td>
                        <td className={\`p-4 text-center font-bold \${theme === 'light' ? 'text-slate-900' : 'text-white'}\`}>{page.month}</td>
                        <td className={\`p-4 text-center font-bold \${theme === 'light' ? 'text-slate-900' : 'text-white'}\`}>{page.year}</td>
                        <td className="p-4 text-right text-sm text-gray-500 flex items-center justify-end gap-1"><Timer className="w-3.5 h-3.5" /> {Math.floor(Math.random() * 60) + 30}s</td>
                      </tr>
                    ));
                  })()}
                </tbody>
`;

code = code.replace(
  /<tbody className=\{`divide-y \$\{theme === 'light' \? 'divide-slate-200\/80' : 'divide-white\/5'\}`\}>[\s\S]*?<\/tbody>/,
  tableRowFix
);

fs.writeFileSync('src/components/Admin.tsx', code);
