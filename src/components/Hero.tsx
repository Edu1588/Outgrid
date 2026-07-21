import { motion, useScroll, useTransform } from "motion/react";
import { Button } from "./ui/Button";
import { Highlight } from "./Highlight";
import { useRef } from "react";

export function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section id="home" ref={ref} className="relative pt-20 pb-32 min-h-[85vh] flex items-center z-10 overflow-hidden">
      <div className="absolute inset-0 z-0">
         <div className="absolute inset-y-0 left-0 w-full md:w-1/2 bg-gradient-to-r from-black-main via-black-main/70 to-transparent z-10"></div>
         <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black-main to-transparent z-10"></div>
         <motion.div style={{ y }} className="absolute inset-0 -top-[20%] h-[140%] z-0">
           <img 
             src="https://res.cloudinary.com/ifuatk2z/image/upload/v1784652418/HERO_OUTGRID_suvjmq.png"
             alt="Car"
             className="w-full h-full object-cover opacity-50 mix-blend-luminosity"
           />
         </motion.div>
      </div>
      <div className="max-w-7xl mx-auto px-6 w-full relative z-20">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs font-semibold tracking-widest text-orange-primary mb-6"
          >
            INDEPENDÊNCIA DIGITAL
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6 tracking-tight text-white"
          >
            Pare de depender dos portais. Comece a vender com <Highlight delay={0.6}>o que é seu</Highlight>.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 font-medium leading-relaxed mb-10 max-w-lg"
          >
            Seu site pode gerar mais leads qualificados, mais vendas e muito mais autoridade sem depender 100% de terceiros.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
          >
            <a href="#contato" className="bg-orange-primary hover:bg-[#FF7043] text-white font-extrabold text-base tracking-wider py-4 px-8 rounded-full transition-all shadow-lg hover:shadow-orange-primary/30 flex items-center justify-center gap-3 uppercase group hover:-translate-y-1">
              Fazer minha aplicação
              <div className="bg-white/20 rounded-full p-1 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </div>
            </a>
            <a href="#como-funciona" className="border border-white/20 text-white hover:border-orange-primary hover:text-orange-primary py-4 px-8 rounded-full text-base tracking-wider font-extrabold bg-[#141414]/50 backdrop-blur-sm transition-all uppercase hover:-translate-y-1 flex items-center justify-center gap-2">
              Ver como funciona
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
