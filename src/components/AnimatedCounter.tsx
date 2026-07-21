import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  formatCurrency?: boolean;
}

export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  duration = 2,
  className = "",
  formatCurrency = false,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  });

  useEffect(() => {
    if (inView) {
      motionValue.set(value);
    }
  }, [inView, motionValue, value]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        if (formatCurrency) {
          ref.current.textContent = `${prefix} ${Intl.NumberFormat("pt-BR").format(Math.floor(latest))}${suffix}`;
        } else {
          ref.current.textContent = `${prefix}${Math.floor(latest)}${suffix}`;
        }
      }
    });
  }, [springValue, prefix, suffix, formatCurrency]);

  return <span ref={ref} className={className} />;
}
