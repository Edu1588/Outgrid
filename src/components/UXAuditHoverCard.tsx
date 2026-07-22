import React, { useState, useRef, useEffect } from "react";
import { generateUXAuditReport } from "../lib/uxAudit";
import { 
  FileText, 
  Sparkles, 
  Eye, 
  Layout, 
  Brain, 
  Search, 
  Accessibility, 
  ExternalLink,
  ChevronDown,
  ChevronUp
} from "lucide-react";

interface UXAuditHoverCardProps {
  storeName: string;
  url: string;
  score: number;
}

export function UXAuditHoverCard({ storeName, url, score }: UXAuditHoverCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showFullReport, setShowFullReport] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [coords, setCoords] = useState<{ top?: number; bottom?: number; left: number } | null>(null);

  const report = generateUXAuditReport(storeName, url, score);

  const calculatePos = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const spaceAbove = rect.top;
    
    const cardWidth = 420;
    let left = rect.right - cardWidth;
    if (left < 16) left = 16;
    if (left + cardWidth > window.innerWidth - 16) left = window.innerWidth - cardWidth - 16;

    if (spaceAbove > 360) {
      setCoords({
        bottom: window.innerHeight - rect.top + 8,
        left
      });
    } else {
      setCoords({
        top: rect.bottom + 8,
        left
      });
    }
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    calculatePos();
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div 
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Badge Button */}
      <div className="flex flex-col gap-1 cursor-pointer group">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${score >= 70 ? 'bg-emerald-400 animate-pulse' : score >= 40 ? 'bg-yellow-400' : 'bg-orange-primary/80'}`}></div>
          <span className={`text-sm font-extrabold font-mono group-hover:underline flex items-center gap-1 ${score >= 70 ? 'text-emerald-400' : score >= 40 ? 'text-yellow-400' : 'text-gray-200'}`}>
            {score} <span className="text-gray-500 text-xs font-normal">/ 100</span>
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wider border flex items-center gap-1 transition-all ${
            score >= 70 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 group-hover:bg-emerald-500/20' : 
            score >= 40 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 group-hover:bg-yellow-500/20' : 
            'bg-orange-primary/10 text-orange-primary border-orange-primary/20 group-hover:bg-orange-primary/20'
          }`}>
            <Sparkles className="w-2.5 h-2.5" />
            UX Audit: {score < 40 ? 'Atenção Crítica' : score < 70 ? 'Score Médio' : 'Otimizado'}
          </span>
        </div>
      </div>

      {/* Hover Card Floating Modal / Tooltip with fixed positioning & z-[9999] */}
      {isOpen && coords && (
        <div 
          style={{
            position: 'fixed',
            left: `${coords.left}px`,
            ...(coords.bottom !== undefined ? { bottom: `${coords.bottom}px` } : { top: `${coords.top}px` }),
            zIndex: 9999
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="w-[380px] sm:w-[440px] bg-[#121214] border border-orange-primary/40 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-4 text-left backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-orange-primary/20 border border-orange-primary/40 flex items-center justify-center text-orange-primary">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black tracking-wider text-white uppercase flex items-center gap-1.5">
                  UX ANALYZER OUTGRID
                  <span className="text-[9px] bg-orange-primary/20 text-orange-primary px-1.5 py-0.5 rounded font-mono">AUDIT v2.4</span>
                </h4>
                <p className="text-[11px] text-gray-400 truncate max-w-[240px]">
                  {url || storeName}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono font-bold text-orange-primary">Score UX</span>
              <div className="text-lg font-extrabold font-mono text-white leading-none">
                {score}<span className="text-xs text-gray-500 font-normal">/100</span>
              </div>
            </div>
          </div>

          {/* Resumo Executivo */}
          <div className="bg-black/60 border border-white/10 rounded-xl p-3 mb-3 shadow-inner">
            <div className="text-[10px] font-bold text-orange-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Resumo Executivo da Auditoria
            </div>
            <p className="text-xs text-gray-200 leading-relaxed font-sans">
              {report.resumoExecutivo}
            </p>
          </div>

          {/* 5 Critérios de Auditoria */}
          <div className="space-y-2 mb-3 max-h-[320px] overflow-y-auto pr-1">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Métricas do Relatório (Desempenho & UX)
            </div>

            {/* Pillar 1 */}
            <div className="bg-zinc-900/90 border border-white/10 rounded-lg p-2.5 flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-semibold text-white">
                <Layout className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                {report.pillars.identidadeVisual.title}
              </span>
              <span className={`font-mono text-xs font-bold ${report.pillars.identidadeVisual.score >= 70 ? 'text-emerald-400' : report.pillars.identidadeVisual.score >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                {report.pillars.identidadeVisual.score}/100
              </span>
            </div>

            {/* Pillar 2 */}
            <div className="bg-zinc-900/90 border border-white/10 rounded-lg p-2.5 flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-semibold text-white">
                <Eye className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                {report.pillars.heuristicasNielsen.title}
              </span>
              <span className={`font-mono text-xs font-bold ${report.pillars.heuristicasNielsen.score >= 70 ? 'text-emerald-400' : report.pillars.heuristicasNielsen.score >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                {report.pillars.heuristicasNielsen.score}/100
              </span>
            </div>

            {/* Expandable toggle for the remaining 3 criteria */}
            {showFullReport && (
              <>
                {/* Pillar 3 */}
                <div className="bg-zinc-900/90 border border-white/10 rounded-lg p-2.5 flex items-center justify-between animate-in fade-in duration-150">
                  <span className="flex items-center gap-2 text-xs font-semibold text-white">
                    <Brain className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    {report.pillars.viesesCognitivos.title}
                  </span>
                  <span className={`font-mono text-xs font-bold ${report.pillars.viesesCognitivos.score >= 70 ? 'text-emerald-400' : report.pillars.viesesCognitivos.score >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {report.pillars.viesesCognitivos.score}/100
                  </span>
                </div>

                {/* Pillar 4 */}
                <div className="bg-zinc-900/90 border border-white/10 rounded-lg p-2.5 flex items-center justify-between animate-in fade-in duration-150">
                  <span className="flex items-center gap-2 text-xs font-semibold text-white">
                    <Search className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    {report.pillars.arquiteturaInformacao.title}
                  </span>
                  <span className={`font-mono text-xs font-bold ${report.pillars.arquiteturaInformacao.score >= 70 ? 'text-emerald-400' : report.pillars.arquiteturaInformacao.score >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {report.pillars.arquiteturaInformacao.score}/100
                  </span>
                </div>

                {/* Pillar 5 */}
                <div className="bg-zinc-900/90 border border-white/10 rounded-lg p-2.5 flex items-center justify-between animate-in fade-in duration-150">
                  <span className="flex items-center gap-2 text-xs font-semibold text-white">
                    <Accessibility className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                    {report.pillars.acessibilidade.title}
                  </span>
                  <span className={`font-mono text-xs font-bold ${report.pillars.acessibilidade.score >= 70 ? 'text-emerald-400' : report.pillars.acessibilidade.score >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {report.pillars.acessibilidade.score}/100
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Footer Action */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowFullReport(!showFullReport);
              }}
              className="text-[11px] text-orange-primary hover:text-orange-400 font-semibold flex items-center gap-1 transition-colors"
            >
              {showFullReport ? (
                <>Menos detalhes <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>Ver todas as 5 métricas <ChevronDown className="w-3 h-3" /></>
              )}
            </button>

            {url && (
              <a 
                href={url.startsWith('http') ? url : `https://${url}`} 
                target="_blank" 
                rel="noreferrer"
                className="text-[11px] text-gray-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
              >
                Analisar ao vivo <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
