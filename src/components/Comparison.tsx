import { motion } from "motion/react";
import { XCircle, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/Button";
import { Highlight } from "./Highlight";
import { SpeedometerHover } from "./SpeedometerHover";

const portais = [
  "Custo de Aquisição alto",
  "Dependência total",
  "Marca fraca",
  "Leads imprevisíveis"
];

const outgrid = [
  "Custo de Aquisição baixo",
  "Independência digital",
  "Marca forte",
  "Leads constantes"
];

export function Comparison() {
  return (
    <section className="pt-40 md:pt-48 pb-40 md:pb-48 bg-[#F4F4F5] text-black-main relative z-10 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 bg-black/5 border border-black/10 rounded-full text-xs font-semibold tracking-widest text-black/60 mb-6"
          >
            COMPARATIVO
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight"
          >
            A diferença é <span className="text-orange-primary">brutal</span>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 relative">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-gray-200 hover:border-orange-primary transition-colors duration-300 p-8 md:p-12 rounded-3xl shadow-sm"
          >
            <h3 className="text-2xl font-bold text-gray-400 mb-8 flex items-center gap-3">
              COM PORTAIS
            </h3>
            <ul className="space-y-6">
              {portais.map((item, idx) => (
                <li key={idx} className="flex items-center gap-4">
                  <XCircle className="w-6 h-6 text-red-500 shrink-0" />
                  <span className="text-gray-600 font-medium text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-black-main border-2 border-orange-primary/30 hover:border-orange-primary transition-colors duration-300 p-8 md:p-12 rounded-3xl shadow-xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-primary/10 to-transparent"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                COM OUTGRID
              </h3>
              <ul className="space-y-6">
                {outgrid.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#34A853] shrink-0" />
                    <span className="text-white font-medium text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* VS Badge */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white border border-gray-200 rounded-full items-center justify-center font-black text-gray-300 text-xl shadow-lg z-20">
            VS
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 text-center flex flex-col items-center justify-center gap-4"
        >
          <SpeedometerHover theme="light" />
          <a href="#contato" className="inline-flex items-center justify-center gap-2 bg-black-main text-white hover:bg-gray-800 hover:-translate-y-1 transition-all shadow-xl px-12 py-4 rounded-full font-bold text-lg tracking-widest uppercase">
            Quero acelerar agora
          </a>
        </motion.div>
      </div>
    </section>
  );
}
