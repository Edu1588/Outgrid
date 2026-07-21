import { motion } from "motion/react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black-main text-white font-sans selection:bg-orange-primary/30">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-invert prose-orange max-w-none"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Política de Privacidade</h1>
          <p className="text-gray-400 mb-8">Última atualização: Julho de 2026</p>
          
          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Coleta de Dados</h2>
              <p>Coletamos informações pessoais que você nos fornece diretamente, como nome, e-mail, telefone e nome da empresa ao solicitar uma demonstração ou usar nossos serviços. Também podemos coletar automaticamente dados de navegação e uso dos nossos serviços e materiais.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Uso das Informações</h2>
              <p>Utilizamos os dados coletados para fornecer, manter e melhorar nossos serviços, além de processar transações, enviar comunicações sobre atualizações, ofertas e suporte técnico, sempre com foco em aprimorar a sua experiência.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Compartilhamento de Dados</h2>
              <p>Não vendemos ou alugamos suas informações pessoais a terceiros. Podemos compartilhar dados com parceiros de serviço estritamente necessários para a prestação da mentoria e serviços, exigindo que eles mantenham o mesmo nível de segurança e privacidade.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Segurança</h2>
              <p>Implementamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais contra acesso, alteração, divulgação ou destruição não autorizados. No entanto, nenhum método de transmissão na internet é 100% seguro.</p>
            </section>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
