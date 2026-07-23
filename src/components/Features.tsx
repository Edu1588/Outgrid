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

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.6
    }
  }
};

const cardVariants: any = {
  hidden: { opacity: 0, y: 20, borderColor: 'rgba(0,0,0,0.05)' },
  visible: { 
    opacity: 1, 
    y: 0,
    borderColor: ['rgba(0,0,0,0.05)', '#f97316', 'rgba(0,0,0,0.05)'],
    boxShadow: ['none', '0 0 30px rgba(249,115,22,0.3)', 'none'],
    transition: {
      opacity: { duration: 0.4 },
      y: { duration: 0.4 },
      borderColor: { duration: 1.5, times: [0, 0.5, 1], ease: "easeInOut" },
      boxShadow: { duration: 1.5, times: [0, 0.5, 1], ease: "easeInOut" }
    }
  }
};

const lineVariants: any = {
  hidden: { pathLength: 0 },
  visible: { 
    pathLength: 1,
    transition: { duration: 3.6, ease: "linear" }
  }
};

export function Features() {
  return (
    <section id="recursos" className="pt-40 md:pt-48 pb-32 bg-[#F4F4F5] text-black-main overflow-hidden relative z-10">
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 bg-black/5 border border-black/10 rounded-full text-xs font-semibold tracking-widest text-black/60 mb-6"
          >
            O QUE É A INTELIGÊNCIA AUTOMOTIVA
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

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="relative"
        >
          {/* Animated Line (Desktop Only) */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block z-0" 
            viewBox="0 0 100 100" 
            preserveAspectRatio="none"
          >
            <motion.path
              d="M 16.6 25 L 50 25 L 83.3 25 L 16.6 75 L 50 75 L 83.3 75"
              fill="none"
              stroke="rgba(249, 115, 22, 0.15)"
              strokeWidth="2"
              strokeDasharray="2 2"
              vectorEffect="non-scaling-stroke"
            />
            <motion.path
              variants={lineVariants as any}
              d="M 16.6 25 L 50 25 L 83.3 25 L 16.6 75 L 50 75 L 83.3 75"
              fill="none"
              stroke="#f97316"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                variants={cardVariants as any}
                className="bg-white p-8 rounded-3xl shadow-sm border border-black/5 hover:border-orange-primary group transition-all duration-300 relative overflow-hidden"
              >
                <div className="w-14 h-14 bg-black-main rounded-2xl flex items-center justify-center text-white mb-6 shadow-md group-hover:bg-orange-primary transition-colors relative z-10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 relative z-10">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm relative z-10">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
