import { motion } from "motion/react";
import { Button } from "./ui/Button";
import { AnimatedCounter } from "./AnimatedCounter";
import { Highlight } from "./Highlight";

const stats = [
  { value: 30, prefix: "+", suffix: "%", label: "Conversão" },
  { value: 80, prefix: "-", suffix: "%", label: "Custo de Aquisição" },
  { value: 100, suffix: "%", label: "Independência dos Portais" },
  { value: 3, suffix: "x", label: "Mais Vendas (mesma equipe)" }
];

export function Proof() {
  return (
    <section id="resultados" className="py-32 bg-black-main relative z-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-semibold tracking-widest text-white mb-6"
        >
          PROVA REAL
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold mb-16 text-white tracking-tight"
        >
          Lojas com Outgrid <Highlight delay={0.4}>vendem mais</Highlight>
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx }}
              className="bg-white/5 border border-white/10 hover:border-orange-primary transition-colors duration-300 rounded-3xl p-8"
            >
              <div className="text-4xl lg:text-5xl font-black text-orange-primary mb-2 tracking-tighter">
                <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <div className="text-gray-400 font-medium text-sm leading-tight max-w-[120px] mx-auto">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-medium text-gray-400 mb-8">
            Lojas que já transformaram suas vendas
          </h3>
          
          {/* Logo Banner */}
          <div className="bg-[#111] rounded-full py-6 px-8 flex items-center justify-between overflow-hidden border border-white/5 mb-16 relative max-w-4xl mx-auto">
            <div className="flex gap-12 justify-center overflow-x-hidden flex-grow px-4 opacity-50">
              {["AUTO PREMIER", "SUL MOTORS", "VIP CARROS", "MEGA VEÍCULOS", "ELITE MOTORS"].map((logo, i) => (
                <div key={i} className="text-white font-black tracking-widest uppercase whitespace-nowrap">
                  {logo}
                </div>
              ))}
            </div>
          </div>

          <a href="#contato" className="inline-flex items-center justify-center gap-2 bg-orange-primary text-white hover:bg-[#FF7043] hover:-translate-y-1 transition-all shadow-lg shadow-orange-primary/20 px-10 py-4 rounded-full font-bold text-sm tracking-widest uppercase">
            Seja o próximo case de sucesso
          </a>
        </motion.div>
      </div>
    </section>
  );
}
