import { motion } from "motion/react";
import { Layout, RefreshCw, Users, Target, Search, BarChart3 } from "lucide-react";
import { Highlight } from "./Highlight";

const features = [
  {
    icon: <Layout className="w-6 h-6" />,
    title: "Website Automotivo",
    desc: "Experiência de portal profissional no seu domínio, construído para converter visitantes em compradores."
  },
  {
    icon: <RefreshCw className="w-6 h-6" />,
    title: "Estoque Integrado",
    desc: "Sincronização automática de todos os seus veículos, mantendo suas ofertas sempre atualizadas em tempo real."
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "CRM Conectado",
    desc: "Gestão completa de leads e vendas em um só lugar. Não perca nenhuma oportunidade de negócio."
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Leads Qualificados",
    desc: "Sistema inteligente de captura e qualificação que identifica o momento de compra do seu cliente."
  },
  {
    icon: <Search className="w-6 h-6" />,
    title: "SEO Otimizado",
    desc: "Ranqueamento orgânico nos buscadores. Seja encontrado facilmente por quem pesquisa no Google."
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Performance Previsível",
    desc: "Métricas claras, relatórios detalhados e resultados consistentes para você tomar as melhores decisões."
  }
];

export function Features() {
  return (
    <section id="recursos" className="pt-40 md:pt-48 pb-32 bg-[#F4F4F5] text-black-main overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 bg-black/5 border border-black/10 rounded-full text-xs font-semibold tracking-widest text-black/60 mb-6"
          >
            O QUE É O OUTGRID
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tight"
          >
            A tecnologia que <span className="text-orange-primary">transforma</span> sua loja
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-black/5 hover:border-orange-primary group transition-all duration-300"
            >
              <div className="w-14 h-14 bg-black-main rounded-2xl flex items-center justify-center text-white mb-6 shadow-md group-hover:bg-orange-primary transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
