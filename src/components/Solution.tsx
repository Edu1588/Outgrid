import { motion } from "motion/react";
import { CheckCircle2, TrendingUp, ShieldCheck, Zap } from "lucide-react";
import { Highlight } from "./Highlight";

const benefits = [
  {
    icon: <Zap className="w-5 h-5 text-orange-primary" />,
    title: "Integração Rápida",
    desc: "Configure em minutos"
  },
  {
    icon: <TrendingUp className="w-5 h-5 text-orange-primary" />,
    title: "Economia Real",
    desc: "Até 80% menos CAC"
  },
  {
    icon: <CheckCircle2 className="w-5 h-5 text-orange-primary" />,
    title: "+30% Conversão",
    desc: "Resultados comprovados"
  },
  {
    icon: <ShieldCheck className="w-5 h-5 text-orange-primary" />,
    title: "Independência Total",
    desc: "Seu site, suas regras"
  }
];

export function Solution() {
  return (
    <section id="solucao" className="py-32 relative z-20 bg-black-main border-t border-white/5 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[1000px] h-[600px] bg-orange-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-3 py-1 bg-orange-primary/10 border border-orange-primary/20 rounded-full text-xs font-semibold tracking-widest text-orange-primary mb-6"
        >
          A VIRADA
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight max-w-3xl mx-auto"
        >
          Existe um caminho <Highlight delay={0.4}>mais inteligente</Highlight><span className="inline-block w-6 md:w-8 h-1 md:h-1.5 bg-orange-primary rounded-full ml-2.5 align-middle" />
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto mb-12"
        >
          Ter seu próprio ecossistema que gera tráfego, leads e vendas todos os dias. Esse caminho tem nome: <strong className="text-white font-bold">OUTGRID</strong>. A metodologia que transforma a estrutura da sua loja em uma máquina de vendas.
        </motion.p>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="relative rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent z-0"></div>
          <video
            src="https://res.cloudinary.com/ifuatk2z/video/upload/v1784576234/Generated_Video_July_20_2026_-_4_35PM_jzrpsk.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto rounded-xl object-cover opacity-80 mix-blend-luminosity grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700 relative z-10"
          />
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {benefits.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + (0.1 * idx) }}
              className="bg-black-main border border-white/10 hover:border-orange-primary p-6 rounded-2xl flex flex-col items-center text-center group transition-colors duration-300"
            >
              <div className="w-12 h-12 rounded-full bg-orange-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h4 className="text-white font-bold mb-1">{item.title}</h4>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
