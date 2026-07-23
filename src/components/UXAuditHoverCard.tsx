import React from "react";
import { 
  Sparkles, 
  AlertTriangle,
  Info
} from "lucide-react";

interface UXAuditHoverCardProps {
  storeName: string;
  url: string;
  score: number;
}

export function UXAuditHoverCard({ storeName, url, score }: UXAuditHoverCardProps) {
  const isNoWebsite = !url || url.trim() === "" || 
    url.toLowerCase().includes("sem site") || 
    url.toLowerCase().includes("instagram.com") || 
    url.toLowerCase().includes("facebook.com") || 
    url.toLowerCase().includes("carrosp.com.br") || 
    url.toLowerCase().includes("olx.com.br") || 
    url.toLowerCase().includes("webmotors.com.br") || 
    url.toLowerCase() === "null";

  return (
    <div className="relative inline-block group">
      {/* Badge Button */}
      <div className="flex flex-col gap-1 cursor-help">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${score >= 70 ? 'bg-emerald-400' : score >= 40 ? 'bg-yellow-400' : 'bg-orange-primary/80'}`}></div>
          <span className={`text-sm font-extrabold font-mono flex items-center gap-1 ${score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-yellow-400' : 'text-gray-200'}`}>
            {score} <span className="text-gray-500 text-xs font-normal">/ 100</span>
          </span>
        </div>
        <div className="flex items-center gap-1">
          {isNoWebsite ? (
            <span className="text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider border flex items-center gap-1 bg-amber-500/10 text-amber-500 border-amber-500/20">
              <AlertTriangle className="w-2.5 h-2.5 shrink-0" />
              Sem site próprio
            </span>
          ) : (
            <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider border flex items-center gap-1 ${
              score >= 70 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
              score >= 40 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
              'bg-orange-primary/10 text-orange-primary border-orange-primary/20'
            }`}>
              <Sparkles className="w-2.5 h-2.5" />
              UX Audit: {score < 40 ? 'Atenção Crítica' : score < 70 ? 'Score Médio' : 'Otimizado'}
            </span>
          )}
        </div>
      </div>

      {/* Hover Tooltip */}
      <div className="absolute z-50 left-0 top-full mt-2 w-64 p-3 bg-black border border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none">
        <div className="flex items-start gap-2 mb-2">
          <Info className="w-4 h-4 text-orange-primary shrink-0 mt-0.5" />
          <h4 className="text-xs font-bold text-white">Como essa nota foi calculada?</h4>
        </div>
        <p className="text-[11px] text-gray-300 leading-relaxed mb-2">
          O score (de 0 a 100) é baseado exclusivamente na presença digital da loja <strong className="text-white">{storeName}</strong>:
        </p>
        <ul className="text-[11px] text-gray-400 space-y-1.5 list-disc pl-4">
          <li>
            <strong className="text-gray-200">Qualidade do site (até 20 pontos):</strong> 20 pontos para domínio próprio, 5 pontos para agregadores (ex: Webmotors, OLX) ou redes sociais, e 0 se não possuir link.
          </li>
          <li>
            <strong className="text-gray-200">Seguidores no Instagram (até 80 pontos):</strong> Pontuação baseada no volume de seguidores reais detectados, calculada logaritmicamente (fórmula matemática).
          </li>
        </ul>
      </div>
    </div>
  );
}
