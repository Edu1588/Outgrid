import { useState } from "react";
import { motion } from "motion/react";
import { Check, ArrowRight } from "lucide-react";
import { supabase } from "../lib/supabase";

import { saveLead } from "../lib/storage";

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      whatsapp: formData.get('whatsapp') as string,
      store: formData.get('store') as string,
      volume: formData.get('volume') as string,
      challenge: formData.get('challenge') as string,
      source: 'Contact'
    };

    try {
      if (supabase) {
        await supabase.from('leads').insert([data]);
      }
      saveLead(data);
    } catch (err) {
      console.error('Error saving lead:', err);
    }
    
    setIsSubmitting(false);
    setFormSubmitted(true);

    const volumeText = data.volume === 'ate-10' ? 'até 10' : 
                       data.volume === '10-a-30' ? 'de 10 a 30' : 
                       data.volume === '30-a-50' ? 'de 30 a 50' : 'mais de 50';
    
    const challengeText = data.challenge === 'poucos-leads' ? 'recebo poucos leads' :
                          data.challenge === 'leads-desqualificados' ? 'recebo leads desqualificados' :
                          data.challenge === 'portais' ? 'dependo de portais, OLX e Marketplace' :
                          data.challenge === 'vendedores' ? 'meus vendedores não vendem' :
                          data.challenge === 'agencias' ? 'já contratei agências e nada funciona' : 'outros';

    const message = `Olá! Meu nome é ${data.name}, da loja ${data.store}. Vendo ${volumeText} carros por mês e meu principal desafio é que ${challengeText}. Gostaria de saber mais sobre o Acelerador de Vendas. Meu WhatsApp é ${data.whatsapp}.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/5519974070224?text=${encodedMessage}`, '_blank');
  };

  return (
    <section id="contato" className="py-24 bg-black-main relative z-10 text-white overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-xl"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-[2px] bg-orange-primary"></span>
              <span className="text-orange-primary text-sm font-bold tracking-widest uppercase">
                Aplicação
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
              Receba um <br className="hidden md:block"/>
              plano de ação pra <span className="text-orange-primary">sua loja vender mais</span>
            </h2>
            
            <p className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed font-medium">
              Preencha o formulário rápido. Nossa equipe fará um diagnóstico para descobrir onde você está perdendo dinheiro e como reverter isso.
            </p>
            
            <ul className="space-y-5">
              {[
                "Diagnóstico da sua operação comercial",
                "Descubra onde sua loja está perdendo vendas",
                "Estratégia clara para gerar leads todos os dias"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-orange-primary flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-medium text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="w-full lg:max-w-lg mx-auto lg:ml-auto"
          >
            <div className="bg-[#141414] border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl relative">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Seu Nome</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    placeholder="Nome completo" 
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-orange-primary focus:ring-1 focus:ring-orange-primary transition-all font-medium"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">WhatsApp</label>
                  <input 
                    type="tel" 
                    name="whatsapp"
                    required
                    placeholder="(00) 00000-0000" 
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-orange-primary focus:ring-1 focus:ring-orange-primary transition-all font-medium"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nome da Loja</label>
                  <input 
                    type="text" 
                    name="store"
                    required
                    placeholder="Sua loja de veículos" 
                    className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-orange-primary focus:ring-1 focus:ring-orange-primary transition-all font-medium"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Quantos carros você vende por mês?</label>
                  <select name="volume" required defaultValue="" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-orange-primary focus:ring-1 focus:ring-orange-primary transition-all font-medium appearance-none">
                    <option value="" disabled>Selecione</option>
                    <option value="ate-10">Até 10 carros</option>
                    <option value="10-a-30">De 10 a 30 carros</option>
                    <option value="30-a-50">De 30 a 50 carros</option>
                    <option value="mais-50">Mais de 50 carros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Qual seu principal desafio hoje?</label>
                  <select name="challenge" required defaultValue="" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-4 text-white placeholder-gray-600 focus:outline-none focus:border-orange-primary focus:ring-1 focus:ring-orange-primary transition-all font-medium appearance-none">
                    <option value="" disabled>Selecione</option>
                    <option value="poucos-leads">Recebo poucos leads</option>
                    <option value="leads-desqualificados">Recebo leads desqualificados</option>
                    <option value="portais">Dependo de portais, OLX e Marketplace</option>
                    <option value="vendedores">Meus vendedores não vendem</option>
                    <option value="agencias">Já contratei agências e nada funciona</option>
                  </select>
                </div>
                
                <div className="pt-2">
                  <button type="submit" disabled={isSubmitting} className="w-full bg-orange-primary hover:bg-orange-600 text-white font-bold text-lg py-4 px-6 rounded-xl transition-all shadow-lg shadow-orange-primary/20 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed">
                    {isSubmitting ? 'Enviando...' : 'Enviar aplicação'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-4 font-medium">
                    Resposta em até 24h · Sem compromisso
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
