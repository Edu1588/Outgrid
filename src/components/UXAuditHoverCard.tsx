import React from "react";
import { 
  Sparkles, 
  AlertTriangle,
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
    <div className="relative inline-block">
      {/* Badge Button */}
      <div className="flex flex-col gap-1">
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
    </div>
  );
}
