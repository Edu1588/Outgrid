import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, ChevronsDown } from "lucide-react";

const steps = [
  {
    title: "ME CONTRATE",
    subtitle: "O PASSO A PASSO",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=60",
  },
  {
    title: "INTRODUÇÃO",
    subtitle: "COMECE POR AQUI",
    image: "https://res.cloudinary.com/ifuatk2z/image/upload/v1784649912/ChatGPT_Image_21_de_jul._de_2026_13_03_31_tm1lry.png",
  },
  {
    title: "TRÁFEGO PAGO",
    subtitle: "VENDAS NA VEIA",
    image: "https://images.unsplash.com/photo-1580519542036-ed47f3e42214?w=500&auto=format&fit=crop&q=60",
  },
  {
    title: "CONVERSÃO",
    subtitle: "FECHANDO NEGÓCIOS",
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32b7?w=500&auto=format&fit=crop&q=60",
  },
  {
    title: "ESCALA",
    subtitle: "DOMINANDO A CIDADE",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60",
  }
];

export function JourneyCarousel() {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [direction, setDirection] = useState(0);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % steps.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + steps.length) % steps.length);
  };

  const getVisibleSteps = () => {
    const prev = (currentIndex - 1 + steps.length) % steps.length;
    const next = (currentIndex + 1) % steps.length;
    return [prev, currentIndex, next];
  };

  const visibleIndices = getVisibleSteps();

  return (
    <section className="py-24 bg-black-main overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-16 tracking-tight text-white leading-tight text-balance">
          Como será sua jornada dentro do <br />
          <span className="bg-[#E5C78B] text-black-main px-3 py-1 rounded-sm inline-block mt-2">Acelerador Automotivo?</span>
        </h2>

        <div className="relative flex items-center justify-center h-[400px] md:h-[500px]">
          {/* Controls */}
          <button 
            onClick={handlePrev}
            className="absolute left-0 md:left-10 z-30 w-10 h-10 md:w-12 md:h-12 bg-[#E5C78B] hover:bg-[#d6b77c] rounded-full flex items-center justify-center text-black-main transition-colors shadow-xl"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 font-bold" strokeWidth={3} />
          </button>
          
          <button 
            onClick={handleNext}
            className="absolute right-0 md:right-10 z-30 w-10 h-10 md:w-12 md:h-12 bg-[#E5C78B] hover:bg-[#d6b77c] rounded-full flex items-center justify-center text-black-main transition-colors shadow-xl"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8 font-bold" strokeWidth={3} />
          </button>

          {/* Carousel Track */}
          <div className="relative w-full max-w-4xl h-full flex justify-center items-center perspective-1000">
            <AnimatePresence mode="sync">
              {visibleIndices.map((stepIndex, i) => {
                const step = steps[stepIndex];
                const isCenter = i === 1;
                const isLeft = i === 0;
                const isRight = i === 2;

                return (
                  <motion.div
                    key={`${stepIndex}`}
                    initial={{ 
                      opacity: 0, 
                      scale: 0.8, 
                      x: direction === 1 ? 100 : direction === -1 ? -100 : 0,
                      z: -100
                    }}
                    animate={{ 
                      opacity: isCenter ? 1 : 0.4, 
                      scale: isCenter ? 1 : 0.85, 
                      x: isLeft ? '-65%' : isRight ? '65%' : '0%',
                      z: isCenter ? 0 : -100,
                      filter: isCenter ? 'blur(0px) brightness(1)' : 'blur(6px) brightness(0.6)'
                    }}
                    exit={{ 
                      opacity: 0,
                      scale: 0.8,
                      x: direction === 1 ? -100 : 100,
                      transition: { duration: 0.3 }
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className={`absolute w-[240px] md:w-[320px] h-[340px] md:h-[450px] rounded-2xl overflow-hidden shadow-2xl ${isCenter ? 'z-20' : 'z-10'}`}
                  >
                    <div className="absolute inset-0 bg-black-main/40 z-10 mix-blend-overlay"></div>
                    <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
                    
                    <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-8 text-center bg-gradient-to-t from-black-main via-black-main/60 to-transparent">
                      <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                        {step.title}
                      </h3>
                      <p className="text-[#E5C78B] font-bold text-sm md:text-lg uppercase tracking-widest mt-1">
                        {step.subtitle}
                      </p>
                      {isCenter && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="mt-4 flex justify-center text-white"
                        >
                          <ChevronsDown className="w-6 h-6 md:w-8 md:h-8" />
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
