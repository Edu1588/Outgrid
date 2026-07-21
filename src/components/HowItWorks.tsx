import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";

const products = [
  {
    number: "01",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60",
    title: "ACELERADOR DE VENDAS",
    subtitle: "Prepare sua loja para converter",
    description: "Diagnóstico completo da operação comercial, planejamento da campanha, definição da oferta, estruturação do funil de vendas e plano de ação para os próximos 30 dias.",
    features: [
      "Diagnóstico da operação comercial",
      "Planejamento da campanha",
      "Definição da oferta principal",
      "Estruturação do funil de vendas",
      "Estratégia para aumentar conversão",
      "Plano de ação — 30 dias"
    ]
  },
  {
    number: "02",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=60",
    title: "GERAÇÃO DE LEADS",
    subtitle: "Coloque oportunidades na mesa",
    description: "Meta Ads, Google Ads e Landing Pages de alta conversão para captar leads qualificados. Campanhas otimizadas para maximizar o retorno sobre o investimento.",
    features: [
      "Meta Ads direcionado",
      "Google Ads para buscas ativas",
      "Landing Pages de alta conversão",
      "Captação de leads qualificados",
      "Otimização contínua de campanhas",
      "Remarketing inteligente"
    ]
  },
  {
    number: "03",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&auto=format&fit=crop&q=60",
    title: "OUTGRID",
    subtitle: "Tecnologia que converte",
    description: "Mentoria e estratégia completa de vendas com página dos veículos, site do vendedor, IA de atendimento, integração com estoque e ferramentas de conversão.",
    features: [
      "Página dedicada aos veículos",
      "Site personalizado por vendedor",
      "IA de atendimento imediato",
      "Integração com estoque",
      "Ferramentas de conversão",
      "Dashboard de performance"
    ]
  }
];

export function HowItWorks() {
  return (
    <section id="metodo" className="pt-24 pb-32 md:pb-40 bg-white relative z-10">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-bold tracking-widest text-red-500 mb-2 uppercase"
          >
            O Método
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight uppercase max-w-3xl leading-tight mb-4"
          >
            3 Produtos.<br/>Uma máquina de vendas.
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#64748B] text-lg max-w-2xl"
          >
            Cada etapa foi desenhada para transformar sua operação comercial em um processo previsível de geração de resultados.
          </motion.p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {products.map((product, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx }}
              className="bg-[#F8F9FA] rounded-2xl overflow-hidden border border-gray-100 flex flex-col"
            >
              <div className="h-48 relative">
                <div className="absolute top-4 left-4 bg-white text-[#0F172A] text-xs font-bold px-3 py-1 rounded shadow-sm z-10">
                  {product.number}
                </div>
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-extrabold text-[#0F172A] uppercase mb-1">{product.title}</h3>
                <p className="text-red-500 font-medium mb-4">{product.subtitle}</p>
                <p className="text-[#64748B] text-sm leading-relaxed mb-6 flex-1">
                  {product.description}
                </p>
                
                <ul className="space-y-3">
                  {product.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#34A853] shrink-0" />
                      <span className="text-[#334155] text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
}
