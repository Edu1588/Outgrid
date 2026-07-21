import { motion } from "motion/react";
import { MousePointerClick, Users, BarChart2, Target } from "lucide-react";

const problems = [
  {
    icon: <MousePointerClick className="w-5 h-5 text-red-500" />,
    description: "Depende apenas de portais (OLX, iCarros, Webmotors) para gerar vendas"
  },
  {
    icon: <Users className="w-5 h-5 text-red-500" />,
    description: "Recebe leads desqualificados e curiosos que não compram"
  },
  {
    icon: <BarChart2 className="w-5 h-5 text-red-500" />,
    description: "Não tem previsibilidade nas vendas de um mês para o outro"
  },
  {
    icon: <Target className="w-5 h-5 text-red-500" />,
    description: "Falta de estratégia digital que realmente gere resultado"
  }
];

export function TheProblem() {
  return (
    <section id="problema" className="pt-24 pb-32 md:pb-40 relative z-10 overflow-hidden bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Coluna 1: Título + Cards de Problemas */}
          <div className="flex flex-col gap-4">
            <div className="mb-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-xs font-bold tracking-widest text-red-500 mb-2 uppercase"
              >
                O Problema
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-2xl md:text-3xl font-extrabold text-[#0F172A] tracking-tight uppercase leading-snug"
              >
                Por que sua loja não vende o suficiente?
              </motion.h2>
            </div>

            {problems.map((problem, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * idx }}
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-5"
              >
                <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                  {problem.icon}
                </div>
                <p className="text-[#1E293B] font-medium leading-relaxed text-sm md:text-base">
                  {problem.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Coluna 2: Imagem explicativa com animação de loading */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="relative rounded-2xl overflow-hidden border border-gray-200/80 shadow-xl bg-white p-2"
          >
            <img 
              src="https://res.cloudinary.com/ifuatk2z/image/upload/v1784675394/buscaveiculosOUTGRID2_wnoov8.png" 
              alt="Busca de veículos e presença no Google" 
              className="w-full h-auto object-cover rounded-xl"
            />

            {/* Animação de Loading Branca centralizada no card */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="p-4 md:p-5 rounded-2xl bg-black/60 backdrop-blur-sm border border-white/20 shadow-2xl flex items-center justify-center">
                <div className="dot-spinner">
                  <div className="dot-spinner__dot"></div>
                  <div className="dot-spinner__dot"></div>
                  <div className="dot-spinner__dot"></div>
                  <div className="dot-spinner__dot"></div>
                  <div className="dot-spinner__dot"></div>
                  <div className="dot-spinner__dot"></div>
                  <div className="dot-spinner__dot"></div>
                  <div className="dot-spinner__dot"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
      </div>
    </section>
  );
}
