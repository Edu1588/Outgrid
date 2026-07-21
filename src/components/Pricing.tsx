import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "./ui/Button";
import { Highlight } from "./Highlight";

const plans = [
  {
    name: "Starter",
    price: 499,
    description: "Ideal para lojas iniciantes.",
    features: ["Website Automotivo", "Estoque de até 50 carros", "Suporte via Email"],
  },
  {
    name: "Pro",
    price: 899,
    description: "Para quem quer acelerar as vendas.",
    popular: true,
    features: ["Tudo do Starter", "Estoque Ilimitado", "Integração CRM", "Leads Ilimitados", "Suporte Prioritário"],
  },
  {
    name: "Enterprise",
    price: 1499,
    description: "Solução completa e customizada.",
    features: ["Tudo do Pro", "Consultoria SEO", "Gestor de Contas", "Treinamento da Equipe"],
  }
];

export function Pricing() {
  return (
    <section id="planos" className="py-32 bg-black-main relative z-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 bg-orange-primary/10 border border-orange-primary/20 rounded-full text-xs font-semibold tracking-widest text-orange-primary mb-6"
          >
            PLANOS E PREÇOS
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight"
          >
            Escolha o plano ideal para <Highlight delay={0.3}>sua loja</Highlight>
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx }}
              className={`bg-[#151515] border p-8 rounded-3xl relative flex flex-col group transition-all duration-300 ${plan.popular ? 'border-orange-primary shadow-[0_0_30px_rgba(255,90,0,0.15)] hover:shadow-[0_0_40px_rgba(255,90,0,0.3)] hover:-translate-y-2' : 'border-white/10 hover:border-orange-primary hover:shadow-xl hover:-translate-y-1'}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-primary text-black font-bold text-xs px-4 py-1 rounded-full uppercase tracking-widest">
                  MAIS ESCOLHIDO
                </div>
              )}
              
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-gray-400 text-sm mb-6 h-10">{plan.description}</p>
              
              <div className="mb-8 pb-8 border-b border-white/10 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-500">R$</span>
                <span className="text-5xl font-black text-white">
                  {plan.price}
                </span>
                <span className="text-gray-500 font-medium">/mês</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-300 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-[#34A853] shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <a 
                href="#contato" 
                className={`w-full inline-flex justify-center items-center font-bold uppercase tracking-wider py-4 rounded-full transition-all ${
                  plan.popular 
                    ? 'bg-orange-primary text-black hover:bg-[#FF7043] shadow-lg shadow-orange-primary/20 hover:-translate-y-1' 
                    : 'text-white border border-white/20 hover:border-orange-primary hover:text-orange-primary bg-transparent'
                }`}
              >
                Assinar Plano
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
