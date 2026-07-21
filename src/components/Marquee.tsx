import { motion } from "motion/react";

export function Marquee() {
  const items = [
    "ATENDE FORA DO HORÁRIO",
    "CAMPANHAS QUE VENDEM",
    "SEM DEPENDER DOS PORTAIS",
    "MAIS CARROS VENDIDOS",
    "MAIS LEADS QUALIFICADOS",
    "MELHOR CONVERSÃO",
  ];

  const content = (
    <div className="flex gap-16 items-center px-8">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-16">
          <span className="text-black-main font-black text-lg md:text-xl tracking-widest whitespace-nowrap">{item}</span>
          <span className="text-black-main font-black text-lg md:text-xl">•</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-orange-primary py-4 overflow-hidden flex relative z-20 w-full border-y border-black-main">
      <motion.div
        className="flex"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 80,
        }}
      >
        {content}
        {content}
        {content}
        {content}
      </motion.div>
    </div>
  );
}
