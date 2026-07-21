import { Sparkles, Flame, ArrowRight } from "lucide-react";

export function TopCountdownBanner() {
  return (
    <div className="bg-gradient-to-r from-orange-600 via-orange-primary to-amber-600 text-black py-2.5 px-4 font-bold text-xs md:text-sm text-center sticky top-0 z-50 shadow-lg border-b border-orange-400/30 flex items-center justify-center gap-2 md:gap-4 flex-wrap">
      <div className="flex items-center gap-1.5 bg-black/15 px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[11px] font-black text-white shrink-0">
        <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
        Oportunidade Exclusiva
      </div>

      <div className="flex items-center gap-1.5 text-black">
        <span>
          <strong>Análise + Mentoria Gratuita</strong> para donos de loja de veículos.
        </span>
      </div>

      <a 
        href="#quero" 
        className="inline-flex items-center gap-1 bg-black text-white hover:bg-zinc-900 px-3 py-1 rounded-full text-xs font-extrabold uppercase transition-all hover:scale-105"
      >
        Garantir Análise <ArrowRight className="w-3 h-3 text-orange-primary" />
      </a>
    </div>
  );
}
