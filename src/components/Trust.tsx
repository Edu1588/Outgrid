import { motion } from "motion/react";
import { HeadphonesIcon, RefreshCw, ShieldCheck, BarChart3 } from "lucide-react";
import { Highlight } from "./Highlight";

const trustItems = [
  {
    icon: <HeadphonesIcon className="w-8 h-8 text-orange-primary" />,
    title: "Suporte Dedicado",
    desc: "Equipe especializada em vendas automotivas."
  },
  {
    icon: <RefreshCw className="w-8 h-8 text-orange-primary" />,
    title: "Atualizações Contínuas",
    desc: "Sempre na vanguarda da tecnologia."
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-orange-primary" />,
    title: "Segurança Total",
    desc: "Dados protegidos e criptografados."
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-orange-primary" />,
    title: "Relatórios Detalhados",
    desc: "Métricas e insights em tempo real."
  }
];

export function Trust() {
  return (
    <section className="py-24 bg-black-main relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {trustItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx }}
              className="flex flex-col items-center group cursor-default"
            >
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:border-orange-primary group-hover:bg-orange-primary/10 transition-all duration-300">
                {item.icon}
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm max-w-[200px]">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
