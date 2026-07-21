import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { Highlight } from "./Highlight";
import { Check, X, Play, ArrowRight, ShieldCheck, Award, Lock } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { supabase } from "../lib/supabase";

const Seals = () => (
  <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mt-6 text-[#C5A059]">
    <div className="flex items-center gap-2">
      <ShieldCheck className="w-5 h-5" />
      <span className="text-xs md:text-sm font-medium text-left leading-tight">Compra<br/>Segura</span>
    </div>
    <div className="flex items-center gap-2">
      <Award className="w-5 h-5" />
      <span className="text-xs md:text-sm font-medium text-left leading-tight">Satisfação<br/>Garantida</span>
    </div>
    <div className="flex items-center gap-2">
      <Lock className="w-5 h-5" />
      <span className="text-xs md:text-sm font-medium text-left leading-tight">Privacidade<br/>Protegida</span>
    </div>
  </div>
);

const DiagonalMarquee = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const x1 = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const x2 = useTransform(scrollYProgress, [0, 1], [-500, 0]);

  return (
    <div ref={containerRef} className="relative h-64 overflow-hidden flex items-center justify-center -my-10 z-0">
      <div className="absolute w-[150%] bg-[#222222] py-4 transform -rotate-3 z-10 shadow-xl whitespace-nowrap overflow-hidden">
        <motion.div style={{ x: x1 }} className="flex items-center w-max">
          {[...Array(10)].map((_, i) => (
             <span key={i} className="text-gray-400 font-medium text-xl md:text-3xl px-8">
               Então chegou a hora de tomar a <span className="text-white font-bold">decisão mais inteligente</span> para você e sua loja!
             </span>
          ))}
        </motion.div>
      </div>
      
      <div className="absolute w-[150%] bg-orange-primary py-4 transform rotate-3 z-20 shadow-xl whitespace-nowrap overflow-hidden">
        <motion.div style={{ x: x2 }} className="flex items-center w-max">
          {[...Array(10)].map((_, i) => (
             <span key={i} className="text-white font-medium text-xl md:text-3xl px-8">
               Então chegou a hora de tomar a <span className="text-black font-bold">decisão mais inteligente</span> para você e sua loja!
             </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export function Captacao() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      whatsapp: formData.get('whatsapp') as string,
      store: formData.get('store') as string,
      volume: formData.get('volume') as string,
      source: 'Captacao'
    };

    try {
      if (supabase) {
        await supabase.from('leads').insert([data]);
      }
    } catch (err) {
      console.error('Error saving lead:', err);
    }
    
    setIsSubmitting(false);
    setFormSubmitted(true);

    const volumeText = data.volume === '1' ? 'até 10' : 
                       data.volume === '2' ? 'de 10 a 30' : 
                       data.volume === '3' ? 'de 30 a 50' : 'mais de 50';

    const message = `Olá! Meu nome é ${data.name}, da loja ${data.store}. Vendo ${volumeText} carros por mês e gostaria de saber mais sobre o Acelerador de Vendas. Meu WhatsApp é ${data.whatsapp}.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/5519974070224?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-black-main font-sans selection:bg-orange-primary/30 selection:text-white text-white">
      {/* Topbar */}
      <div className="bg-orange-primary text-black text-center py-3 px-5 font-extrabold text-sm md:text-base tracking-wide uppercase">
        Exclusivo para donos de loja de veículos que querem vender mais carros
      </div>

      {/* Hero */}
      <header className="relative text-center pt-16 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FyfGVufDB8MHwwfHx8Mg%3D%3D" alt="Car Background" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-black-main/80 via-black-main/90 to-black-main"></div>
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="flex justify-center mb-10">
            <Link to="/">
              <Logo className="text-white" />
            </Link>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6 text-balance">
            Vou te mostrar a estratégia que faz lojas de veículos <Highlight delay={0.4}>venderem mais</Highlight> carros todo mês pela internet
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12">
            Assista à apresentação abaixo e descubra como atrair leads qualificados pra sua loja — de forma simples, previsível e sem depender só dos portais.
          </p>

          <div className="relative mx-auto max-w-3xl aspect-video bg-[#161618] border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center shadow-2xl">
            <video
                src="https://res.cloudinary.com/ifuatk2z/video/upload/v1784576234/Generated_Video_July_20_2026_-_4_35PM_jzrpsk.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-orange-primary flex items-center justify-center shadow-[0_0_0_12px_rgba(255,87,34,0.18)] cursor-pointer hover:scale-105 transition-transform">
                <Play className="w-8 h-8 text-white ml-1 fill-white" />
              </div>
            </div>
            <span className="absolute bottom-4 font-mono text-xs tracking-widest text-white/40 uppercase">Apresentação VSL</span>
          </div>

          <div className="mt-12 flex flex-col items-center">
            <a href="#quero" className="bg-orange-primary hover:bg-[#FF7043] inline-flex items-center justify-center gap-3 text-white font-extrabold text-xl py-6 px-12 w-full max-w-md rounded-full transition-all hover:-translate-y-1 shadow-lg hover:shadow-orange-primary/30 uppercase">
              Quero vender mais <ArrowRight className="w-6 h-6" />
            </a>
            <Seals />
          </div>
        </div>
      </header>

      {/* Desafios */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4 tracking-tight text-balance">
            Você está passando por algum desses desafios?
          </h2>
          <p className="text-center text-gray-400 text-lg mb-12">
            Se você marcar "sim" pra qualquer um deles, esta página é pra você.
          </p>
          
          <div className="grid gap-4 max-w-3xl mx-auto">
            {[
              <>Não consegue atrair <b className="text-orange-primary font-bold">leads qualificados</b> — e quando atrai, vêm curiosos ou sem crédito</>,
              <>Depende de <b className="text-orange-primary font-bold">portais, OLX e Marketplace</b> e não tem controle da geração de leads</>,
              <>Seus <b className="text-orange-primary font-bold">vendedores demoram pra responder</b> e o lead esfria antes de virar visita</>,
              <>Tem medo de <b className="text-orange-primary font-bold">investir em tráfego</b> e não ver retorno</>,
              <>Não tem uma <b className="text-orange-primary font-bold">estratégia própria e previsível</b> pra vender mais de 10 carros no mês</>,
              <>Já contratou agência que se diz "especialista", mas <b className="text-orange-primary font-bold">só queimou seu dinheiro</b></>
            ].map((text, i) => (
              <div key={i} className="flex gap-5 items-start bg-[#161618] border border-white/10 rounded-2xl p-6 hover:border-orange-primary/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-orange-primary/10 border border-orange-primary text-orange-primary flex items-center justify-center shrink-0 mt-0.5">
                  <X className="w-5 h-5" />
                </div>
                <p className="text-lg text-white">{text}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-xl font-bold mt-12 mb-10 max-w-2xl mx-auto">
            Se você disse <span className="text-orange-primary">sim</span> pra qualquer um deles, chegou a hora de virar a máquina de vendas da sua cidade.
          </p>
          
          <div className="text-center flex flex-col items-center">
            <a href="#quero" className="bg-orange-primary hover:bg-[#FF7043] inline-flex items-center justify-center gap-3 text-white font-extrabold text-xl py-6 px-12 w-full max-w-md rounded-full transition-all hover:-translate-y-1 shadow-lg hover:shadow-orange-primary/30 uppercase">
              Quero mudar isso <ArrowRight className="w-5 h-5" />
            </a>
            <Seals />
          </div>
        </div>
      </section>

      {/* O Que Significa */}
      <section className="py-20 bg-[#101012] border-t border-white/10 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4 tracking-tight text-balance">
            O que significa entrar no <span className="text-orange-primary">Acelerador de Vendas</span>
          </h2>
          <p className="text-center text-gray-400 text-lg mb-16 max-w-2xl mx-auto">
            Uma estratégia feita pra sua loja vender mais carros — não pra "ficar bonita na internet".
          </p>
          
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 w-full relative">
              <img 
                src="https://res.cloudinary.com/ifuatk2z/image/upload/v1784647657/Outgrid_1_voq4bn.png" 
                alt="Acelerador de Vendas" 
                className="w-full h-auto object-contain drop-shadow-2xl rounded-2xl" 
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-primary/20 to-transparent rounded-2xl mix-blend-overlay pointer-events-none"></div>
            </div>
            
            <div className="flex-1 w-full">
              <div className="grid gap-2">
                {[
                  <><b className="font-bold text-white">Leads qualificados no WhatsApp do seu vendedor</b> e a cidade agendando visita na sua loja.</>,
                  <>Atrair os <b className="font-bold text-white">melhores leads</b> e vender carro todo dia com campanhas que geram resultado.</>,
                  <><b className="font-bold text-white">Não depender</b> de marketplaces e portais — com controle total do seu investimento.</>,
                  <>Uma máquina que <b className="font-bold text-white">atende na hora, inclusive fora do horário</b>, e não deixa o lead esfriar.</>,
                  <>Ser <b className="font-bold text-white">referência na sua cidade</b> — com os concorrentes vendo sua loja como máquina de vendas.</>
                ].map((text, i) => (
                  <div key={i} className="flex gap-4 items-start py-5 border-b border-white/10 last:border-0">
                    <div className="w-8 h-8 rounded-full bg-[#34A853] flex items-center justify-center shrink-0 mt-0.5 shadow-lg">
                      <Check className="w-5 h-5 text-white" strokeWidth={3} />
                    </div>
                    <p className="text-lg text-gray-300">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pra Quem É */}
      <section className="py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-4 tracking-tight text-balance">
            Pra quem é o Acelerador de Vendas
          </h2>
          <p className="text-center text-gray-400 text-lg mb-12">
            Feito pra quem vive de vender carro e quer previsibilidade.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            <div className="bg-[#161618] border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-extrabold mb-3">Dono de <span className="text-orange-primary">loja de veículos</span></h3>
              <p className="text-gray-400 leading-relaxed">Novos, usados e seminovos — que querem mais volume de clientes qualificados e vendas com previsibilidade.</p>
            </div>
            <div className="bg-[#161618] border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-extrabold mb-3">Quem <span className="text-orange-primary">depende dos portais</span></h3>
              <p className="text-gray-400 leading-relaxed">Loja que luta com vendas baixas e imprevisíveis e tem dificuldade de atrair cliente pelo digital.</p>
            </div>
            <div className="bg-[#161618] border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-extrabold mb-3">Gestor de <span className="text-orange-primary">concessionária</span></h3>
              <p className="text-gray-400 leading-relaxed">Quem quer modernizar as vendas da equipe e aumentar o desempenho com estratégia digital validada.</p>
            </div>
            <div className="bg-[#161618] border border-white/10 rounded-2xl p-8">
              <h3 className="text-xl font-extrabold mb-3">Vendedor <span className="text-orange-primary">de carro</span></h3>
              <p className="text-gray-400 leading-relaxed">Quem já vende pessoalmente e quer aprender a atrair lead qualificado e vender também pelo digital.</p>
            </div>
          </div>
          
          <div className="text-center mt-12 flex flex-col items-center">
            <a href="#quero" className="bg-orange-primary hover:bg-[#FF7043] inline-flex items-center justify-center gap-3 text-white font-extrabold text-xl py-6 px-12 w-full max-w-md rounded-full transition-all hover:-translate-y-1 shadow-lg hover:shadow-orange-primary/30 uppercase">
              Quero fazer parte <ArrowRight className="w-5 h-5" />
            </a>
            <Seals />
          </div>
        </div>
      </section>

      {/* Prova */}
      <section className="py-20 bg-[#101012] border-t border-white/10 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-7xl md:text-8xl font-extrabold text-orange-primary leading-none tracking-tighter mb-3">+60</div>
          <p className="text-xl text-gray-400 font-medium">lojas já vendem mais usando o método</p>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mt-8 mb-10 leading-relaxed">
            De lojas de seminovos e de luxo a concessionárias — todas com mais previsibilidade, mais reconhecimento na cidade e leads com crédito, sem curiosos.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {["Premium Motors", "AutoPrime", "Carros&Cia", "Seminovos Elite", "Nacional Veículos"].map((logo, i) => (
              <div key={i} className="bg-[#161618] border border-white/10 rounded-xl px-6 py-4 font-bold text-gray-400 text-sm">
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      <DiagonalMarquee />

      {/* Conheça o Mentor */}
      <section className="py-24 bg-[#0A0A0A] border-t border-b border-white/5 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="w-full lg:w-1/2 relative">
              <div className="absolute inset-0 bg-orange-primary/20 blur-3xl rounded-full"></div>
              <img 
                src="https://res.cloudinary.com/ifuatk2z/image/upload/v1784649912/ChatGPT_Image_21_de_jul._de_2026_13_03_31_tm1lry.png" 
                alt="Lucas Correa" 
                className="w-full max-w-md mx-auto lg:mx-0 h-auto object-cover rounded-3xl relative z-10 shadow-2xl border border-white/10"
              />
            </div>
            <div className="w-full lg:w-1/2">
              <span className="text-orange-primary font-bold tracking-widest uppercase text-sm mb-4 block">Conheça o Mentor</span>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-white">
                Lucas Correa
              </h2>
              <div className="space-y-4 text-gray-400 text-lg leading-relaxed">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section id="quero" className="py-24 relative z-10 bg-black-main">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight text-balance">
            Dê o primeiro passo pra <span className="text-orange-primary">vender mais carros</span>
          </h2>
          <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
            Preencha abaixo e um especialista entra em contato pra montar a estratégia da sua loja. Leva menos de 1 minuto.
          </p>
          
          <div className="max-w-xl mx-auto bg-[#161618] border border-white/10 rounded-3xl p-8 md:p-10 text-left shadow-2xl">
            {!formSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Seu nome</label>
                  <input type="text" name="name" placeholder="Nome completo" required className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-orange-primary focus:ring-1 focus:ring-orange-primary transition-all font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">WhatsApp</label>
                  <input type="tel" name="whatsapp" placeholder="(00) 00000-0000" required className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-orange-primary focus:ring-1 focus:ring-orange-primary transition-all font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Nome da loja</label>
                  <input type="text" name="store" placeholder="Sua loja de veículos" required className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-orange-primary focus:ring-1 focus:ring-orange-primary transition-all font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Quantos carros você vende por mês?</label>
                  <select name="volume" required defaultValue="" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-orange-primary focus:ring-1 focus:ring-orange-primary transition-all font-medium appearance-none">
                    <option value="" disabled>Selecione</option>
                    <option value="1">Até 10 carros</option>
                    <option value="2">De 10 a 30 carros</option>
                    <option value="3">De 30 a 50 carros</option>
                    <option value="4">Mais de 50 carros</option>
                  </select>
                </div>
                <div className="pt-2 flex flex-col items-center">
                  <button type="submit" disabled={isSubmitting} className="bg-orange-primary hover:bg-[#FF7043] disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed w-full max-w-md mx-auto inline-flex items-center justify-center gap-3 text-white font-extrabold text-xl py-6 px-12 rounded-full transition-all hover:-translate-y-1 shadow-lg hover:shadow-orange-primary/30 uppercase border-none">
                    {isSubmitting ? 'Enviando...' : 'Quero vender mais'} <ArrowRight className="w-5 h-5" />
                  </button>
                  <Seals />
                  <p className="text-center text-sm text-gray-500 mt-4 font-medium">Resposta em até 24h · Sem compromisso</p>
                </div>
              </form>
            ) : (
              <div className="text-center py-10">
                <div className="text-6xl mb-6">✅</div>
                <h3 className="text-2xl font-extrabold mb-4">Pronto! Recebemos sua aplicação.</h3>
                <p className="text-gray-400 text-lg">Em breve um especialista entra em contato pra montar a estratégia da sua loja.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-center mb-6">
            <Logo className="text-white opacity-80" />
          </div>
          <p className="text-sm text-gray-500 font-medium">
            © {new Date().getFullYear()} Acelerador de Vendas · OUTGRID. Desenvolvido por <a href="#" className="text-orange-primary font-bold hover:underline">Fábrica Publicidade</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
