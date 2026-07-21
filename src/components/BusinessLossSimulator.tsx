import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  Gauge, 
  Clock, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Sparkles,
  BarChart2,
  RefreshCw
} from "lucide-react";

interface Scenario {
  name: string;
  visitors: number;
  slowSiteTime: string;
  slowBounceRate: number;
  slowLeads: number;
  slowSales: number;
  slowRevenue: number;
  hubSiteTime: string;
  hubBounceRate: number;
  hubLeads: number;
  hubSales: number;
  hubRevenue: number;
  monthlyLoss: number;
  yearlyLoss: number;
}

const scenarios: Scenario[] = [
  {
    name: "Loja Média (3.000 acessos/mês)",
    visitors: 3000,
    slowSiteTime: "4.8s",
    slowBounceRate: 80,
    slowLeads: 36,
    slowSales: 4,
    slowRevenue: 20000,
    hubSiteTime: "0.6s",
    hubBounceRate: 15,
    hubLeads: 165,
    hubSales: 17,
    hubRevenue: 85000,
    monthlyLoss: 65000,
    yearlyLoss: 780000,
  },
  {
    name: "Loja Pequena (1.200 acessos/mês)",
    visitors: 1200,
    slowSiteTime: "5.2s",
    slowBounceRate: 85,
    slowLeads: 14,
    slowSales: 1,
    slowRevenue: 5000,
    hubSiteTime: "0.5s",
    hubBounceRate: 12,
    hubLeads: 66,
    hubSales: 7,
    hubRevenue: 35000,
    monthlyLoss: 30000,
    yearlyLoss: 360000,
  },
  {
    name: "Grande Operação (8.000 acessos/mês)",
    visitors: 8000,
    slowSiteTime: "4.2s",
    slowBounceRate: 75,
    slowLeads: 96,
    slowSales: 10,
    slowRevenue: 50000,
    hubSiteTime: "0.7s",
    hubBounceRate: 14,
    hubLeads: 440,
    hubSales: 44,
    hubRevenue: 220000,
    monthlyLoss: 170000,
    yearlyLoss: 2040000,
  },
];

export function BusinessLossSimulator() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [liveLossCounter, setLiveLossCounter] = useState(0);

  const current = scenarios[scenarioIndex];

  // Auto-cycle scenarios every 8 seconds if playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setScenarioIndex((prev) => (prev + 1) % scenarios.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Real-time ticking loss counter animation (lasts 3 seconds)
  useEffect(() => {
    setLiveLossCounter(0);
    const target = current.monthlyLoss;
    const duration = 3000; // 3 seconds
    const steps = 60;
    const stepTime = duration / steps;
    const increment = target / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setLiveLossCounter(target);
        clearInterval(timer);
      } else {
        setLiveLossCounter(Math.round(increment * currentStep));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [scenarioIndex]);

  const handleContactClick = () => {
    const message = encodeURIComponent(
      `Olá! Vi a análise no site. Minha loja se encaixa em ${current.name} e quero uma Análise de Negócio personalizada para recuperar até R$ ${current.monthlyLoss.toLocaleString('pt-BR')}/mês.`
    );
    window.open(`https://wa.me/5519997412895?text=${message}`, '_blank');
  };

  return (
    <section id="simulador" className="py-24 bg-black-main relative z-20 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-orange-primary/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-xs font-semibold tracking-widest text-red-400 uppercase mb-6"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
            ANÁLISE DE IMPACTO DO SEU NEGÓCIO
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight"
          >
            Você está <span className="text-orange-primary underline decoration-orange-primary/40 underline-offset-8">deixando dinheiro na mesa</span> todos os dias
            <span className="inline-block w-6 md:w-8 h-1 md:h-1.5 bg-orange-primary rounded-full ml-2.5 align-middle" />
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 text-base md:text-lg leading-relaxed"
          >
            Um site lento, desatualizado ou sem inteligência comercial faz o comprador perder o interesse nos primeiros 3 segundos e ir para o concorrente. 
            <strong className="text-white block mt-2">Abaixo, veja a simulação animada do impacto no faturamento e como o HUB Web OUTGRID recupera essas vendas:</strong>
          </motion.p>
        </div>

        {/* Automated Scenario Selector Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {scenarios.map((sc, idx) => (
            <button
              key={idx}
              onClick={() => {
                setScenarioIndex(idx);
                setIsPlaying(false);
              }}
              className={`py-2.5 px-5 rounded-full text-xs font-bold transition-all flex items-center gap-2 border ${
                scenarioIndex === idx
                  ? 'bg-orange-primary text-black border-orange-primary shadow-lg shadow-orange-primary/20 scale-105'
                  : 'bg-zinc-900/80 text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              {sc.name}
            </button>
          ))}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? "Pausar animação" : "Iniciar animação automática"}
            className="p-2.5 bg-zinc-900 border border-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isPlaying ? 'animate-spin text-orange-primary' : ''}`} />
          </button>
        </div>

        {/* Animated Simulation Display */}
        <motion.div
          key={scenarioIndex}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-zinc-900/90 border border-white/10 rounded-2xl p-6 md:p-10 backdrop-blur-xl shadow-2xl mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Left Card: Slow Site Analysis */}
            <div className="bg-black/80 border border-red-500/30 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-2xl rounded-full pointer-events-none" />
              
              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-red-500/20">
                  <div>
                    <span className="text-xs font-bold uppercase text-red-400 tracking-wider block">Cenário Tradicional</span>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-red-400" /> Site Lento Comum
                    </h3>
                  </div>
                  <XCircle className="w-6 h-6 text-red-400" />
                </div>

                {/* Animated Loading Bar */}
                <div className="mb-6 bg-zinc-900 p-4 rounded-lg border border-red-500/20">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-400">Tempo de Carregamento:</span>
                    <strong className="text-red-400 font-extrabold">{current.slowSiteTime} (Muito Lento)</strong>
                  </div>
                  <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: "85%" }}
                      transition={{ duration: 3.5, ease: "easeInOut" }}
                      className="bg-red-500 h-full rounded-full"
                    />
                  </div>
                </div>

                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span>Taxa de Abandono (Desistência):</span>
                    <strong className="text-red-400 font-extrabold">{current.slowBounceRate}% dos compradores</strong>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span>Leads gerados por mês:</span>
                    <strong className="text-white font-bold">{current.slowLeads} leads</strong>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span>Vendas estimadas no mês:</span>
                    <strong className="text-white font-bold">{current.slowSales} carros</strong>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-red-500/20">
                <span className="text-xs text-gray-400 block uppercase font-medium">Faturamento Estimado:</span>
                <span className="text-2xl font-black text-red-400">R$ {current.slowRevenue.toLocaleString('pt-BR')}</span>
              </div>
            </div>

            {/* Right Card: OUTGRID HUB Web Analysis */}
            <div className="bg-gradient-to-br from-zinc-900 to-black border border-emerald-500/40 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-emerald-500/5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-2xl rounded-full pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-emerald-500/20">
                  <div>
                    <span className="text-xs font-bold uppercase text-emerald-400 tracking-wider block">Solução Exclusiva</span>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 fill-emerald-400 text-emerald-400" /> HUB Web OUTGRID
                    </h3>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>

                {/* Animated Fast Bar */}
                <div className="mb-6 bg-zinc-900/80 p-4 rounded-lg border border-emerald-500/20">
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-gray-400">Tempo de Carregamento PWA:</span>
                    <strong className="text-emerald-400 font-extrabold">{current.hubSiteTime} (Ultrarrápido)</strong>
                  </div>
                  <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: "15%" }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className="bg-emerald-400 h-full rounded-full"
                    />
                  </div>
                </div>

                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span>Taxa de Abandono (Retenção 85%):</span>
                    <strong className="text-emerald-400 font-extrabold">{current.hubBounceRate}% (Mínimo)</strong>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span>Leads gerados por mês:</span>
                    <strong className="text-emerald-400 font-bold">{current.hubLeads} leads (<span className="text-emerald-400 font-extrabold">+{Math.round(current.hubLeads / current.slowLeads)}x mais</span>)</strong>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span>Vendas estimadas no mês:</span>
                    <strong className="text-emerald-400 font-bold">{current.hubSales} carros</strong>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-emerald-500/20">
                <span className="text-xs text-emerald-400/80 block uppercase font-medium">Faturamento Estimado:</span>
                <span className="text-2xl font-black text-emerald-400">R$ {current.hubRevenue.toLocaleString('pt-BR')}</span>
              </div>
            </div>

          </div>

          {/* Animated Loss Summary Banner */}
          <div className="mt-8 bg-gradient-to-r from-red-950/90 via-zinc-900 to-orange-950/90 border border-orange-primary/40 rounded-xl p-6 text-center relative overflow-hidden">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-red-400 animate-bounce" />
              <span className="text-xs uppercase font-extrabold text-orange-primary tracking-widest">
                Dinheiro Deixado na Mesa Todo Mês
              </span>
            </div>

            <div className="text-3xl md:text-5xl font-black text-white tracking-tight my-2">
              R$ {liveLossCounter.toLocaleString('pt-BR')}<span className="text-lg font-medium text-gray-400"> /mês</span>
            </div>

            <p className="text-xs md:text-sm text-gray-300 mt-2">
              Isso representa até <strong className="text-orange-primary">R$ {current.yearlyLoss.toLocaleString('pt-BR')} por ano</strong> que sua empresa deixa de faturar devido a um site lento e sem inteligência de conversão.
            </p>

            <button
              onClick={handleContactClick}
              className="mt-6 w-full md:w-auto mx-auto py-4 px-8 bg-orange-primary hover:bg-orange-primary/90 text-black font-extrabold text-sm rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-orange-primary/25 hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-black" />
              SOLICITAR ANÁLISE DE NEGÓCIO DA SUA LOJA
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Business Analysis Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-950/80 border border-red-500/20 rounded-2xl p-8 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
                  <TrendingDown className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">O Problema do Site Tradicional Lento</h4>
                  <span className="text-xs text-red-400 font-semibold">Perda direta de compradores e vendas</span>
                </div>
              </div>

              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <span><strong>Desistência imediata:</strong> O comprador não espera 4 a 6 segundos para carregar as fotos e volta para a pesquisa do Google.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <span><strong>Sem IA de resposta instantânea:</strong> O comprador envia mensagem à noite e fica sem resposta até a manhã seguinte.</span>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <span><strong>Total dependência dos portais:</strong> Como o site da loja não vende, ela se torna refém das mensalidades abusivas de portais.</span>
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-b from-zinc-900 to-black border border-orange-primary/30 rounded-2xl p-8 flex flex-col justify-between shadow-2xl shadow-orange-primary/5"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-primary/10 rounded-xl border border-orange-primary/30">
                  <Zap className="w-6 h-6 text-orange-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">HUB Web OUTGRID</h4>
                  <span className="text-xs text-orange-primary font-semibold">Inteligência Automotiva de Alta Conversão</span>
                </div>
              </div>

              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-orange-primary shrink-0 mt-0.5" />
                  <span><strong>Velocidade Ultrarrápida PWA (&lt;0.8s):</strong> Abre em milissegundos mesmo em conexões 3G e 4G lentas.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-orange-primary shrink-0 mt-0.5" />
                  <span><strong>IA de Atendimento 24/7:</strong> Qualifica o comprador no exato momento da dúvida e entrega o lead pronto ao vendedor.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-orange-primary shrink-0 mt-0.5" />
                  <span><strong>Canal Próprio e Forte:</strong> Sua loja constrói sua própria base de clientes fiéis e reduz drasticamente a dependência de terceiros.</span>
                </li>
              </ul>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
