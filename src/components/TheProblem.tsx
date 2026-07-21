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
        
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-bold tracking-widest text-red-500 mb-2 uppercase"
          >
            O Problema
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight uppercase max-w-2xl leading-tight"
          >
            Por que sua loja não vende o suficiente?
          </motion.h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {problems.map((problem, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-6"
            >
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                {problem.icon}
              </div>
              <p className="text-[#1E293B] font-medium leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
