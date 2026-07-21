import { motion } from "motion/react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function TermsOfUse() {
  return (
    <div className="min-h-screen bg-black-main text-white font-sans selection:bg-orange-primary/30">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-invert prose-orange max-w-none"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Termos de Uso</h1>
          <p className="text-gray-400 mb-8">Última atualização: Julho de 2026</p>
          
          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">1. Aceitação dos Termos</h2>
              <p>Ao acessar e usar os serviços da OUTGRID, você concorda em cumprir e ficar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá usar nossos serviços.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">2. Uso dos Serviços</h2>
              <p>Nossa mentoria foi projetada para otimizar as vendas e o marketing de lojas de automóveis. Você concorda em usar os materiais e as metodologias ensinadas apenas para fins legais e de acordo com todas as leis aplicáveis.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">3. Propriedade Intelectual</h2>
              <p>Todo o conteúdo, design, logotipos e materiais fornecidos pela OUTGRID são de propriedade exclusiva da OUTGRID ou de seus licenciadores. O uso não autorizado destes materiais é estritamente proibido.</p>
            </section>
            
            <section>
              <h2 className="text-2xl font-bold text-white mb-4">4. Limitação de Responsabilidade</h2>
              <p>A OUTGRID não será responsável por quaisquer danos indiretos, incidentais, especiais, consequenciais ou punitivos resultantes do uso ou da incapacidade de usar nossos serviços.</p>
            </section>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
