import { motion } from "motion/react";
import { AnimatedCounter } from "./AnimatedCounter";
import { Highlight } from "./Highlight";

export function Cost() {
  return (
    <section className="py-32 bg-black-main relative z-10 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-orange-primary/5 rounded-[100%] blur-[120px] pointer-events-none border border-orange-primary/10"></div>
      
      {/* Background Particles/Dots effect can be simulated here if needed */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-16 text-white tracking-tight"
        >
          Vender por portais <Highlight delay={0.2}>custa caro</Highlight>
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-[#151515] border border-white/5 hover:border-orange-primary transition-colors duration-300 p-10 md:p-12 rounded-[2rem] text-left flex flex-col justify-center shadow-2xl relative overflow-hidden group"
          >
            <div className="text-gray-400 font-medium text-sm tracking-wider uppercase mb-6 z-10 group-hover:text-gray-300 transition-colors">CAC MÉDIO DOS PORTAIS</div>
            <div className="relative z-10">
              <span className="text-5xl md:text-7xl font-bold text-gray-300 group-hover:text-white transition-colors">
                <AnimatedCounter value={1500} prefix="R$" formatCurrency={true} />
              </span>
              {/* Optional strike-through line effect */}
              <div className="absolute top-1/2 left-0 w-[110%] h-[3px] bg-red-500/50 -translate-y-1/2 -rotate-2"></div>
            </div>
            <div className="text-gray-500 font-medium mt-4 z-10 group-hover:text-gray-400 transition-colors">por venda</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-orange-primary hover:bg-orange-500 transition-colors duration-300 text-black-main p-10 md:p-12 rounded-[2rem] text-left flex flex-col justify-center shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
            <div className="text-black/70 font-bold text-sm tracking-wider uppercase mb-6 relative z-10">CAC COM O OUTGRID</div>
            <div className="text-5xl md:text-7xl font-black relative z-10">
              <AnimatedCounter value={380} prefix="R$" formatCurrency={true} />
            </div>
            <div className="text-black/70 font-bold mt-4 relative z-10">por venda</div>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-lg text-gray-400"
        >
          Diferença que vai <Highlight delay={0.6}><span className="text-white">direto para a sua margem</span></Highlight><span className="inline-block w-6 md:w-8 h-1 md:h-1.5 bg-orange-primary rounded-full ml-2.5 align-middle" />
        </motion.p>
      </div>
    </section>
  );
}
