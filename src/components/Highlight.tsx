import { motion } from "motion/react";

interface HighlightProps {
  children: React.ReactNode;
  color?: string;
  delay?: number;
}

export function Highlight({ children, color = "#FF5A00", delay = 0.5 }: HighlightProps) {
  return (
    <span className="relative inline-block">
      <motion.span
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay, ease: "circOut" }}
        className="absolute inset-x-0 bottom-0 top-1 -z-10 origin-left rounded-sm"
        style={{ backgroundColor: "#FF5A00" }}
      ></motion.span>
      <span className="relative z-10 px-2 text-white">{children}</span>
    </span>
  );
}
