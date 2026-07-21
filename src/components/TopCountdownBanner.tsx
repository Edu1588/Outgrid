import { useState, useEffect } from "react";
import { Sparkles, Clock, Flame, ArrowRight } from "lucide-react";

export function TopCountdownBanner() {
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTwoDigits = (num: number) => String(num).padStart(2, '0');

  return (
    <div className="bg-gradient-to-r from-orange-600 via-orange-primary to-amber-600 text-black py-2.5 px-4 font-bold text-xs md:text-sm text-center sticky top-0 z-50 shadow-lg border-b border-orange-400/30 flex items-center justify-center gap-2 md:gap-4 flex-wrap">
      <div className="flex items-center gap-1.5 bg-black/15 px-2.5 py-0.5 rounded-full uppercase tracking-wider text-[11px] font-black text-white shrink-0">
        <Flame className="w-3.5 h-3.5 text-yellow-300 animate-bounce" />
        Faltam poucas vagas!
      </div>

      <div className="flex items-center gap-1.5 text-black">
        <span>
          <strong>Análise + Mentoria Gratuita</strong> para os 50 primeiros donos de loja.
        </span>
        <span className="hidden sm:inline bg-black text-orange-primary px-2 py-0.5 rounded font-mono font-extrabold text-xs">
          Apenas 7 vagas
        </span>
      </div>

      <div className="flex items-center gap-2 bg-black/20 text-white px-3 py-0.5 rounded-full text-xs font-mono">
        <Clock className="w-3.5 h-3.5 text-yellow-300" />
        <span>
          {formatTwoDigits(timeLeft.hours)}:{formatTwoDigits(timeLeft.minutes)}:{formatTwoDigits(timeLeft.seconds)}
        </span>
      </div>

      <a 
        href="#quero" 
        className="hidden lg:inline-flex items-center gap-1 bg-black text-white hover:bg-zinc-900 px-3 py-1 rounded-full text-xs font-extrabold uppercase transition-all hover:scale-105"
      >
        Garantir vaga <ArrowRight className="w-3 h-3 text-orange-primary" />
      </a>
    </div>
  );
}
