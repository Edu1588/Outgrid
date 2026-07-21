import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { Highlight } from "./Highlight";

const faqs = [
  {
    question: "Para quem o OUTGRID é indicado?",
    answer: "Para lojistas e revendedores de veículos independentes que desejam ter controle sobre suas vendas, reduzindo a dependência de grandes portais e aumentando a conversão de leads."
  },
  {
    question: "Preciso ter conhecimento prévio sobre tecnologia e marketing para usar?",
    answer: "Não! A nossa mentoria foi estruturada para ser intuitiva e fácil de aplicar. Nós ensinamos toda a base e fornecemos as ferramentas para que você possa focar no que faz de melhor: vender carros."
  },
  {
    question: "Quais resultados posso esperar após implementar o OUTGRID?",
    answer: "Ao implementar o OUTGRID, você pode esperar um aumento significativo no volume de vendas, geração de leads qualificados, maior reconhecimento da sua loja na sua região e um retorno mais previsível sobre os investimentos. Além disso, a sua equipe comercial terá uma ferramenta poderosa para fechar mais negócios."
  },
  {
    question: "Quanto tempo leva para integrar meu estoque?",
    answer: "A estruturação dos seus canais ocorre em questão de dias após o início. Trabalhamos orientando sobre os melhores sistemas do mercado."
  },
  {
    question: "Existe algum prazo de fidelidade?",
    answer: "Nossos planos não possuem carência ou multas de cancelamento abusivas. Confiamos tanto no resultado que entregamos que nossos clientes ficam pelo valor gerado."
  },
  {
    question: "Posso passar o acesso para meus vendedores usarem?",
    answer: "Sim! A estratégia foi desenhada para que toda a sua equipe comercial participe e possa gerenciar os leads e as vendas diretamente com o método ensinado."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-32 bg-black-main text-white relative">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-semibold tracking-widest text-white/60 mb-6"
          >
            PERGUNTAS FREQUENTES
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tight"
          >
            Dúvidas? Nós <Highlight delay={0.4}>respondemos</Highlight>.
          </motion.h2>
        </div>

        <div className="space-y-0 border-t border-white/10">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <div key={index} className="border-b border-white/10">
                <button
                  onClick={() => toggleOpen(index)}
                  className="w-full py-6 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-primary flex items-center justify-center text-black font-bold">
                      {isOpen ? (
                        <ChevronDown className="w-4 h-4 stroke-[3]" />
                      ) : (
                        <ChevronRight className="w-4 h-4 stroke-[3]" />
                      )}
                    </div>
                    <span className="text-lg font-bold">{faq.question}</span>
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8 pt-2 text-gray-300 text-base leading-relaxed pl-10 pr-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
